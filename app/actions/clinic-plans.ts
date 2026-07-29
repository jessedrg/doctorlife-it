"use server"

import { db } from "@/lib/db"
import {
  planOffers,
  appointments,
  subscriptions,
  user as userTable,
  doctorProfiles,
} from "@/lib/db/schema"
import { getSessionUser } from "@/lib/session"
import {
  activeSellablePlans,
  getProduct,
  planPriceLabel,
  type Product,
} from "@/lib/catalog"
import { sendPlanOfferEmail } from "@/lib/email"
import { clinicDataComplete } from "@/lib/clinic"
import { createNotification } from "@/app/actions/notifications"
import { and, desc, eq, inArray, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"

async function requireDoctor() {
  const user = await getSessionUser()
  if (!user || user.role !== "doctor") throw new Error("Unauthorized")
  return user
}

/** Verifica que el médico atiende (o ha atendido) a ese paciente. */
async function assertDoctorOwnsPatient(doctorId: string, patientId: string) {
  const [row] = await db
    .select({ id: appointments.id })
    .from(appointments)
    .where(
      and(
        eq(appointments.doctorId, doctorId),
        eq(appointments.patientId, patientId),
        sql`${appointments.status} <> 'pending_payment'`,
      ),
    )
    .limit(1)
  if (!row) throw new Error("Unauthorized")
}

/** Planes que la clínica puede enviar (suscripción + pagos únicos del catálogo). */
export async function getSendablePlans() {
  await requireDoctor()
  return activeSellablePlans().map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    priceLabel: planPriceLabel(p),
    /** true si es pago único (pack / one_time); false si es suscripción. */
    oneTime: p.model !== "subscription",
  }))
}

/**
 * La clínica (médico) envía por correo al paciente el plan acordado. Se registra
 * la oferta y el paciente la activa/paga desde su portal.
 */
export async function sendPlanOffer(input: {
  patientId: string
  productId: string
  note?: string
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const me = await requireDoctor()
  try {
    await assertDoctorOwnsPatient(me.id, input.patientId)

    // La clínica debe poder cobrar: datos de centro sanitario completos y
    // Stripe habilitado. Si no, no tiene sentido enviar un plan impagable.
    const [myProfile] = await db
      .select()
      .from(doctorProfiles)
      .where(eq(doctorProfiles.userId, me.id))
      .limit(1)
    if (
      !myProfile ||
      !clinicDataComplete(myProfile) ||
      !myProfile.stripeAccountId ||
      !myProfile.chargesEnabled
    ) {
      return {
        ok: false,
        error:
          "La clínica aún no puede cobrar. Completa los datos de facturación y el alta en Stripe antes de enviar planes.",
      }
    }

    const product = getProduct(input.productId)
    if (!product || !product.active) {
      return { ok: false, error: "El plan seleccionado no está disponible." }
    }

    // ¿Ya tiene una suscripción activa?
    const [active] = await db
      .select({ id: subscriptions.id })
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.patientId, input.patientId),
          inArray(subscriptions.status, ["active", "trialing", "past_due"]),
        ),
      )
      .limit(1)
    if (active) {
      return { ok: false, error: "Este paciente ya tiene un tratamiento activo." }
    }

    const [patient] = await db
      .select({ name: userTable.name, email: userTable.email })
      .from(userTable)
      .where(eq(userTable.id, input.patientId))
      .limit(1)
    if (!patient?.email) return { ok: false, error: "No encontramos al paciente." }

    const note = input.note?.trim() || null

    // Cerramos ofertas 'sent' anteriores del mismo paciente y creamos la nueva.
    await db
      .update(planOffers)
      .set({ status: "cancelled" })
      .where(and(eq(planOffers.patientId, input.patientId), eq(planOffers.status, "sent")))

    await db.insert(planOffers).values({
      patientId: input.patientId,
      doctorId: me.id,
      productId: product.id,
      note,
    })

    // Nombre del médico para el correo.
    const [prof] = await db
      .select({ fullName: doctorProfiles.fullName })
      .from(doctorProfiles)
      .where(eq(doctorProfiles.userId, me.id))
      .limit(1)

    await sendPlanOfferEmail({
      to: patient.email,
      name: patient.name || "Paciente",
      doctorName: prof?.fullName ?? me.name ?? null,
      planName: product.name,
      priceLabel: planPriceLabel(product),
      firstPeriodLabel: null,
      note,
    })

    // Aviso in-app para el paciente.
    try {
      await createNotification({
        userId: input.patientId,
        type: "plan_offer_sent",
        title: "Tu plan de tratamiento está listo",
        body: `${prof?.fullName ? `Dr. ${prof.fullName}` : "Tu médico"} te ha enviado el plan acordado. Actívalo desde tu panel.`,
        href: "/portal/recetas",
      })
    } catch {
      // La notificación in-app es best-effort; el correo es el canal principal.
    }

    revalidatePath("/clinica/pacientes")
    return { ok: true }
  } catch (e) {
    console.log("[v0] sendPlanOffer error:", e instanceof Error ? e.message : e)
    return { ok: false, error: "No se pudo enviar el plan. Inténtalo de nuevo." }
  }
}

export type MyPlanOffer = {
  id: number
  productId: string
  product: Pick<
    Product,
    "id" | "name" | "description" | "priceCents" | "currency" | "firstPeriodCents" | "model" | "accessMonths"
  >
  /** Etiqueta de precio ya formateada según el modelo del plan. */
  priceLabel: string
  /** true si es pago único (pack / one_time). */
  oneTime: boolean
  note: string | null
  doctorName: string | null
}

/** Oferta de plan vigente (status 'sent') para el paciente autenticado. */
export async function getMyPlanOffer(): Promise<MyPlanOffer | null> {
  const me = await getSessionUser()
  if (!me) return null

  const [offer] = await db
    .select({
      id: planOffers.id,
      productId: planOffers.productId,
      note: planOffers.note,
      doctorName: doctorProfiles.fullName,
    })
    .from(planOffers)
    .leftJoin(doctorProfiles, eq(doctorProfiles.userId, planOffers.doctorId))
    .where(and(eq(planOffers.patientId, me.id), eq(planOffers.status, "sent")))
    .orderBy(desc(planOffers.id))
    .limit(1)

  if (!offer) return null
  const product = getProduct(offer.productId)
  if (!product) return null

  return {
    id: offer.id,
    productId: offer.productId,
    product: {
      id: product.id,
      name: product.name,
      description: product.description,
      priceCents: product.priceCents,
      currency: product.currency,
      firstPeriodCents: product.firstPeriodCents,
      model: product.model,
      accessMonths: product.accessMonths,
    },
    priceLabel: planPriceLabel(product),
    oneTime: product.model !== "subscription",
    note: offer.note,
    doctorName: offer.doctorName,
  }
}

/** Marca como pagadas las ofertas 'sent' del paciente (al activarse su suscripción). */
export async function markPlanOffersPaid(patientId: string): Promise<void> {
  await db
    .update(planOffers)
    .set({ status: "paid", paidAt: new Date() })
    .where(and(eq(planOffers.patientId, patientId), eq(planOffers.status, "sent")))
}
