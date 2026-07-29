import { NextResponse } from "next/server"
import type Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { finalizeAppointment } from "@/app/actions/booking"
import { provisionFromSession } from "@/app/actions/public-booking"
import {
  applySubscriptionState,
  findSubscriptionRowByStripeId,
  handleInvoicePaidForSubscription,
  syncSubscriptionBySession,
  activateOneTimeAccessBySession,
} from "@/app/actions/subscription"

/**
 * Webhook de Stripe. Confirma citas (pago único) y mantiene el estado de las
 * suscripciones mensuales. Requiere STRIPE_WEBHOOK_SECRET; mientras no esté
 * configurado, la confirmación se hace desde las páginas de éxito.
 */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    return NextResponse.json({ error: "Webhook no configurado" }, { status: 400 })
  }

  const body = await req.text()
  const signature = req.headers.get("stripe-signature")
  if (!signature) {
    return NextResponse.json({ error: "Falta firma" }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret)
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Firma inválida" },
      { status: 400 },
    )
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.metadata?.kind === "public_signup") {
          // Flujo público (pago único 25 €): crea cuenta + primera cita y envía credenciales.
          await provisionFromSession(session.id)
        } else if (session.mode === "subscription") {
          await syncSubscriptionBySession(session.id)
        } else if (session.metadata?.subscriptionRowId) {
          // Plan de pago único (pack 5 meses, nutricionista+GLP1): concede acceso.
          await activateOneTimeAccessBySession(session.id)
        } else {
          const appointmentId = Number(session.metadata?.appointmentId)
          if (appointmentId && session.payment_status === "paid") {
            await finalizeAppointment(appointmentId, session.payment_intent as string | null)
          }
        }
        break
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription
        const row = await findSubscriptionRowByStripeId(sub.id)
        if (row) {
          await applySubscriptionState(
            row.id,
            {
              id: sub.id,
              status: sub.status,
              cancel_at_period_end: sub.cancel_at_period_end,
              current_period_end: periodEnd(sub),
            },
            sub.customer as string,
          )
        }
        break
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice
        const raw = invoice as unknown as {
          id?: string
          subscription?: string
          charge?: string
          amount_paid?: number
          billing_reason?: string
        }
        const subId = raw.subscription
        if (subId) {
          const row = await findSubscriptionRowByStripeId(subId)
          if (row) {
            const sub = await stripe.subscriptions.retrieve(subId)
            await applySubscriptionState(
              row.id,
              {
                id: sub.id,
                status: sub.status,
                cancel_at_period_end: sub.cancel_at_period_end,
                current_period_end: periodEnd(sub),
              },
              sub.customer as string,
            )
          }
          // El dinero ya se liquidó en la clínica (destination charge) con la
          // comisión de DoctorLife retenida. Aquí solo lógica no monetaria:
          // habilitar seguimiento en renovaciones y avisar al médico.
          await handleInvoicePaidForSubscription({
            id: raw.id,
            subscription: subId,
            charge: raw.charge ?? null,
            amount_paid: raw.amount_paid ?? null,
            billing_reason: raw.billing_reason ?? null,
          })
        }
        break
      }
    }
  } catch (e) {
    console.log("[v0] stripe webhook handler error:", e instanceof Error ? e.message : e)
    return NextResponse.json({ error: "handler error" }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

/** current_period_end puede vivir en la sub o en su primer item según la versión de API. */
function periodEnd(sub: Stripe.Subscription): number | undefined {
  const top = (sub as unknown as { current_period_end?: number }).current_period_end
  if (typeof top === "number") return top
  const item = sub.items?.data?.[0] as unknown as { current_period_end?: number } | undefined
  return item?.current_period_end
}
