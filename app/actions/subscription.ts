"use server"

import { db } from "@/lib/db"
import {
  subscriptions,
  appointments,
  doctorProfiles,
  leads,
  planOffers,
  user as userTable,
} from "@/lib/db/schema"
import { getSessionUser, requireRole } from "@/lib/session"
import { stripe } from "@/lib/stripe"
import { getRequestBaseUrl } from "@/lib/base-url"
import { getPlan, defaultPlan, SUBSCRIPTION_PRICE_CENTS, MAIN_PRODUCT_ID, type PlanInfo } from "@/lib/plans"
import { getProduct } from "@/lib/catalog"
import { buildClinicCheckoutSession } from "@/lib/checkout"
import { hasPendingVerification } from "@/app/actions/verification"
import { createNotification } from "@/app/actions/notifications"
import { and, desc, eq, inArray } from "drizzle-orm"
import { revalidatePath } from "next/cache"

const ACTIVE_STATES = ["active", "trialing", "past_due", "incomplete"] as const

/** Suscripción vigente del paciente autenticado (o null). */
export async function getMySubscription() {
  const me = await getSessionUser()
  if (!me) return null
  const [row] = await db
    .select({
      id: subscriptions.id,
      plan: subscriptions.plan,
      priceCents: subscriptions.priceCents,
      status: subscriptions.status,
      currentPeriodEnd: subscriptions.currentPeriodEnd,
      cancelAtPeriodEnd: subscriptions.cancelAtPeriodEnd,
      followupDueAt: subscriptions.followupDueAt,
      doctorName: doctorProfiles.fullName,
    })
    .from(subscriptions)
    .leftJoin(doctorProfiles, eq(doctorProfiles.userId, subscriptions.doctorId))
    .where(eq(subscriptions.patientId, me.id))
    .orderBy(desc(subscriptions.id))
    .limit(1)
  return row ?? null
}

/**
 * Estado completo del paciente en el flujo de tratamiento.
 *
 * Fases (en orden):
 *  1. "pending_appointment"  → sin cita confirmada aún (el médico la enviará)
 *  2. "pending_prescription" → tiene cita confirmada pero no hay receta
 *  3. "can_activate"         → tiene receta, sin suscripción activa → puede activar
 *  4. "active"               → suscripción activa
 *  5. "followup_available"   → suscripción activa + followupDueAt establecido → puede reservar seguimiento
 */
export type PatientStatus =
  | "pending_appointment"
  | "pending_prescription"
  | "can_activate"
  | "active"
  | "followup_available"

export async function getPatientStatus(patientId: string): Promise<PatientStatus> {
  const { prescriptions: prescriptionsTable } = await import("@/lib/db/schema")
  const { count } = await import("drizzle-orm")

  // 1. ¿Tiene suscripción activa?
  const [sub] = await db
    .select({
      id: subscriptions.id,
      status: subscriptions.status,
      followupDueAt: subscriptions.followupDueAt,
    })
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.patientId, patientId),
        inArray(subscriptions.status, ["active", "trialing", "past_due"]),
      ),
    )
    .orderBy(desc(subscriptions.id))
    .limit(1)

  if (sub) {
    return sub.followupDueAt ? "followup_available" : "active"
  }

  // 2. ¿Tiene receta emitida?
  const [rxRow] = await db
    .select({ id: prescriptionsTable.id })
    .from(prescriptionsTable)
    .where(eq(prescriptionsTable.patientId, patientId))
    .limit(1)

  if (rxRow) return "can_activate"

  // 3. ¿Tiene al menos una cita confirmada?
  const [appt] = await db
    .select({ id: appointments.id })
    .from(appointments)
    .where(
      and(
        eq(appointments.patientId, patientId),
        inArray(appointments.status, ["confirmed"]),
      ),
    )
    .limit(1)

  return appt ? "pending_prescription" : "pending_appointment"
}

/** ¿El paciente tiene una suscripción que da acceso al tratamiento/recetas? */
export async function hasActiveSubscription(patientId: string): Promise<boolean> {
  const [row] = await db
    .select({ id: subscriptions.id })
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.patientId, patientId),
        inArray(subscriptions.status, ["active", "trialing", "past_due"]),
      ),
    )
    .limit(1)
  return Boolean(row)
}

/** Médico asignado al paciente: el de su cita más reciente. */
async function getAssignedDoctorId(patientId: string): Promise<string | null> {
  const [appt] = await db
    .select({ doctorId: appointments.doctorId })
    .from(appointments)
    .where(eq(appointments.patientId, patientId))
    .orderBy(desc(appointments.id))
    .limit(1)
  return appt?.doctorId ?? null
}

/** Plan elegido por el paciente en el quiz (por email), con fallback al recomendado. */
async function getPatientPlan(email: string): Promise<PlanInfo> {
  const [lead] = await db
    .select({ plan: leads.plan })
    .from(leads)
    .where(eq(leads.email, email.toLowerCase()))
    .orderBy(desc(leads.id))
    .limit(1)
  return getPlan(lead?.plan) ?? defaultPlan()
}

/**
 * Inicia el checkout de la suscripción mensual del tratamiento.
 *
 * Compliance: el cobro recurrente se liquida en la cuenta Connect de la CLÍNICA
 * (comerciante de liquidación) vía `on_behalf_of` + `transfer_data.destination`;
 * DoctorLife solo retiene su comisión de servicio tecnológico
 * (`application_fee_percent`). El enrutado lo aplica `buildClinicCheckoutSession`.
 */
export async function startSubscriptionCheckout(): Promise<{ url: string } | { error: string }> {
  const patient = await requireRole("patient")

  // ¿Ya tiene una suscripción activa?
  const [existing] = await db
    .select({ id: subscriptions.id, status: subscriptions.status })
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.patientId, patient.id),
        inArray(subscriptions.status, ["active", "trialing", "past_due"]),
      ),
    )
    .limit(1)
  if (existing) return { error: "Ya tienes una suscripción activa." }

  const doctorId = await getAssignedDoctorId(patient.id)
  if (!doctorId) {
    return { error: "Primero reserva tu primera visita para activar el tratamiento." }
  }

  // Si el médico solicitó verificación adicional, no se puede activar hasta que
  // la apruebe.
  if (await hasPendingVerification(patient.id)) {
    return {
      error:
        "Tu médico ha solicitado una verificación adicional. Complétala para poder activar el tratamiento.",
    }
  }

  // El plan a activar es el que la clínica envió por correo (oferta 'sent'). Si
  // no hay ninguna, usamos el producto principal del catálogo como respaldo.
  const [offer] = await db
    .select({ productId: planOffers.productId })
    .from(planOffers)
    .where(and(eq(planOffers.patientId, patient.id), eq(planOffers.status, "sent")))
    .orderBy(desc(planOffers.id))
    .limit(1)

  // Producto del catálogo (fuente de verdad de precio y oferta del primer mes).
  const product = getProduct(offer?.productId ?? MAIN_PRODUCT_ID) ?? getProduct(MAIN_PRODUCT_ID)
  if (!product) {
    return { error: "El plan no está disponible en este momento." }
  }

  // Guardamos una fila de suscripción en estado incompleto con el plan elegido.
  const [pending] = await db
    .insert(subscriptions)
    .values({
      patientId: patient.id,
      doctorId,
      plan: product.name,
      priceCents: product.priceCents,
      status: "incomplete",
    })
    .returning({ id: subscriptions.id })

  try {
    const baseUrl = await getRequestBaseUrl()
    const result = await buildClinicCheckoutSession({
      product,
      customerEmail: patient.email,
      doctorId,
      metadata: {
        subscriptionRowId: String(pending.id),
        patientId: patient.id,
        doctorId,
      },
      successUrl: `${baseUrl}/portal/recetas?subscription=ok&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/portal/recetas?subscription=cancelled`,
    })

    if ("error" in result) {
      await db.delete(subscriptions).where(eq(subscriptions.id, pending.id))
      return { error: result.error }
    }
    return { url: result.url }
  } catch (e) {
    await db.delete(subscriptions).where(eq(subscriptions.id, pending.id))
    return { error: e instanceof Error ? e.message : "No se pudo iniciar la suscripción." }
  }
}

/** Sincroniza la suscripción a partir de la sesión de Checkout (idempotente). */
export async function syncSubscriptionBySession(sessionId: string): Promise<void> {
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  const rowId = Number(session.metadata?.subscriptionRowId)
  if (!rowId || !session.subscription) return
  const sub = await stripe.subscriptions.retrieve(session.subscription as string)
  await applySubscriptionState(rowId, sub, session.customer as string | null)
}

/**
 * Activa el acceso de un plan de PAGO ÚNICO (pack 5 meses, nutricionista+GLP1)
 * a partir de la sesión de Checkout. Concede acceso durante `accessMonths` meses
 * (5 por defecto) sin renovación automática. Idempotente: si ya está activo, no
 * hace nada.
 */
export async function activateOneTimeAccessBySession(sessionId: string): Promise<void> {
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  if (session.mode !== "payment") return
  const rowId = Number(session.metadata?.subscriptionRowId)
  if (!rowId || session.payment_status !== "paid") return

  const [row] = await db
    .select({
      id: subscriptions.id,
      status: subscriptions.status,
      patientId: subscriptions.patientId,
      doctorId: subscriptions.doctorId,
    })
    .from(subscriptions)
    .where(eq(subscriptions.id, rowId))
    .limit(1)
  if (!row) return
  // Ya activado (idempotencia).
  if (["active", "trialing", "past_due"].includes(row.status)) return

  const product = session.metadata?.productId ? getProduct(session.metadata.productId) : undefined
  const months = product?.accessMonths ?? 5
  const end = new Date()
  end.setMonth(end.getMonth() + months)

  await db
    .update(subscriptions)
    .set({
      status: "active",
      // Pago único: no renueva automáticamente; el acceso caduca al final.
      cancelAtPeriodEnd: true,
      currentPeriodEnd: end,
      stripeCustomerId: (session.customer as string | null) ?? undefined,
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.id, rowId))

  // Cerramos la oferta de plan que la clínica hubiera enviado.
  await db
    .update(planOffers)
    .set({ status: "paid", paidAt: new Date() })
    .where(and(eq(planOffers.patientId, row.patientId), eq(planOffers.status, "sent")))

  // Aviso de activación al médico.
  if (row.doctorId) {
    const [patient] = await db
      .select({ name: userTable.name })
      .from(userTable)
      .where(eq(userTable.id, row.patientId))
      .limit(1)
    const patientName = patient?.name || "Un paciente"
    try {
      await createNotification({
        userId: row.doctorId,
        type: "subscription_activated",
        title: `${patientName} activó su plan`,
        body: `${patientName} ha activado el plan "${product?.name ?? "tratamiento"}" (${months} meses de acceso).`,
        href: "/clinica/pacientes",
      })
    } catch (e) {
      console.log("[v0] one-time activation notify failed:", e instanceof Error ? e.message : e)
    }
  }
  revalidatePath("/portal")
}

/** Aplica el estado de una suscripción de Stripe a nuestra fila. */
export async function applySubscriptionState(
  rowId: number,
  sub: { id: string; status: string; cancel_at_period_end?: boolean; current_period_end?: number },
  customerId: string | null,
): Promise<void> {
  await db
    .update(subscriptions)
    .set({
      stripeSubscriptionId: sub.id,
      stripeCustomerId: customerId ?? undefined,
      status: sub.status,
      cancelAtPeriodEnd: Boolean(sub.cancel_at_period_end),
      currentPeriodEnd: sub.current_period_end ? new Date(sub.current_period_end * 1000) : null,
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.id, rowId))

  // Al quedar activa, cerramos la oferta de plan que la clínica había enviado.
  if (["active", "trialing", "past_due"].includes(sub.status)) {
    const [row] = await db
      .select({ patientId: subscriptions.patientId })
      .from(subscriptions)
      .where(eq(subscriptions.id, rowId))
      .limit(1)
    if (row) {
      await db
        .update(planOffers)
        .set({ status: "paid", paidAt: new Date() })
        .where(and(eq(planOffers.patientId, row.patientId), eq(planOffers.status, "sent")))
    }
  }
  revalidatePath("/portal")
}

/** Cancela la suscripción al final del periodo (la programa, no corta el acceso). */
export async function cancelMySubscription(): Promise<{ ok: boolean; error?: string }> {
  const me = await requireRole("patient")
  const [row] = await db
    .select()
    .from(subscriptions)
    .where(
      and(eq(subscriptions.patientId, me.id), inArray(subscriptions.status, ["active", "trialing", "past_due"])),
    )
    .limit(1)
  if (!row || !row.stripeSubscriptionId) return { ok: false, error: "No tienes una suscripción activa." }

  try {
    await stripe.subscriptions.update(row.stripeSubscriptionId, { cancel_at_period_end: true })
    await db
      .update(subscriptions)
      .set({ cancelAtPeriodEnd: true, updatedAt: new Date() })
      .where(eq(subscriptions.id, row.id))
    revalidatePath("/portal")
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "No se pudo cancelar." }
  }
}

/**
 * Procesa el pago de una factura de suscripción.
 *
 * Compliance: el dinero ya se liquida en la clínica en el propio cargo
 * (`on_behalf_of` + `transfer_data.destination`), con la comisión de DoctorLife
 * retenida como `application_fee`. Aquí NO se mueve dinero: solo lógica de
 * negocio no monetaria:
 *  - En renovaciones, se habilita la videollamada de seguimiento (`followupDueAt`).
 *  - Se avisa al médico de la actividad del paciente (sin importes de reparto).
 *
 * Idempotente por naturaleza (los cambios son estados/avisos derivados).
 */
export async function handleInvoicePaidForSubscription(invoice: {
  id?: string
  subscription?: string | null
  charge?: string | null
  amount_paid?: number | null
  billing_reason?: string | null
}): Promise<void> {
  const subId = invoice.subscription
  if (!subId || !invoice.id) return

  const isActivation = invoice.billing_reason === "subscription_create"

  // Localizamos la suscripción y su médico asignado.
  const [row] = await db
    .select({
      id: subscriptions.id,
      doctorId: subscriptions.doctorId,
      patientId: subscriptions.patientId,
    })
    .from(subscriptions)
    .where(eq(subscriptions.stripeSubscriptionId, subId))
    .limit(1)
  if (!row?.doctorId) return

  // En renovaciones el paciente tiene derecho a una nueva videollamada de
  // seguimiento; marcamos la suscripción para invitarle a elegir hora.
  if (!isActivation) {
    await db
      .update(subscriptions)
      .set({ followupDueAt: new Date(), updatedAt: new Date() })
      .where(eq(subscriptions.id, row.id))
    revalidatePath("/portal")
  }

  // Datos del paciente para el aviso al médico.
  const [patient] = await db
    .select({ name: userTable.name })
    .from(userTable)
    .where(eq(userTable.id, row.patientId))
    .limit(1)
  const patientName = patient?.name || "Un paciente"

  // Aviso de actividad al médico (sin importes: la clínica gestiona la remuneración).
  try {
    await createNotification({
      userId: row.doctorId,
      type: isActivation ? "subscription_activated" : "subscription_renewed",
      title: isActivation
        ? `${patientName} activó su suscripción`
        : `${patientName} renovó su suscripción`,
      body: isActivation
        ? `${patientName} ha activado el tratamiento con seguimiento médico.`
        : `${patientName} ha renovado su suscripción mensual.`,
      href: "/clinica/pacientes",
    })
  } catch (e) {
    console.log("[v0] subscription activity notify failed:", e instanceof Error ? e.message : e)
  }
}

/** Localiza la fila por id de suscripción de Stripe (para webhooks). */
export async function findSubscriptionRowByStripeId(stripeSubscriptionId: string) {
  const [row] = await db
    .select({ id: subscriptions.id })
    .from(subscriptions)
    .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId))
    .limit(1)
  return row ?? null
}
