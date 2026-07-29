"use server"

import { db } from "@/lib/db"
import { appointments, user, doctorProfiles } from "@/lib/db/schema"
import { auth } from "@/lib/auth"
import { stripe, platformFeeCents } from "@/lib/stripe"
import { getDoctorChargeContext } from "@/lib/clinic"
import { getRequestBaseUrl } from "@/lib/base-url"
import { FIRST_VISIT_CENTS, FIRST_VISIT_LABEL } from "@/lib/plans"
import { getPooledSlots } from "@/lib/scheduling/pool"
import { generateTempPassword } from "@/lib/credentials"
import { sendCredentialsEmail, sendBookingConfirmationEmail } from "@/lib/email"
import { maybeCreateMeeting } from "@/lib/google/calendar"
import { eq } from "drizzle-orm"
import type { PooledSlot } from "@/lib/scheduling/types"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Huecos combinados de todos los médicos (público, sin sesión). */
export async function getPublicSlots(days = 14): Promise<PooledSlot[]> {
  const from = new Date()
  const to = new Date(from.getTime() + days * 864e5)
  return getPooledSlots({ from, to })
}

/**
 * Flujo público (sin cuenta): el visitante elige hora para su PRIMERA VISITA,
 * que ahora es GRATIS. Como no hay cobro (0 €), no se usa Stripe: creamos la
 * cuenta y la cita directamente y enviamos las credenciales por email. La
 * suscripción mensual se activa más tarde, cuando el paciente desbloquea su
 * receta.
 *
 * Si en el futuro la primera visita vuelve a tener coste (FIRST_VISIT_CENTS > 0),
 * se reactiva automáticamente el flujo de pago con Stripe Checkout.
 */
export async function startPublicCheckout(input: {
  name: string
  email: string
  startUtcISO: string
}): Promise<{ url: string } | { error: string }> {
  const name = input.name?.trim() || "Paciente"
  const email = input.email?.trim().toLowerCase()
  if (!email || !EMAIL_RE.test(email)) return { error: "Introduce un correo electrónico válido." }

  // Si ya existe una cuenta con ese correo, debe iniciar sesión (no recreamos cuenta).
  const [existing] = await db.select({ id: user.id }).from(user).where(eq(user.email, email)).limit(1)
  if (existing) {
    return {
      error: "Ya existe una cuenta con este correo. Inicia sesión para reservar desde tu panel.",
    }
  }

  const start = new Date(input.startUtcISO)
  if (Number.isNaN(start.getTime()) || start.getTime() < Date.now()) {
    return { error: "Ese horario ya no es válido. Elige otro." }
  }

  // Localizamos el hueco elegido en la agenda combinada y su médico.
  const slots = await getPooledSlots({ from: new Date(), to: new Date(Date.now() + 30 * 864e5) })
  const slot = slots.find((s) => s.startUtc === start.toISOString())
  if (!slot) return { error: "Ese horario ya no está disponible. Elige otro." }

  const baseUrl = await getRequestBaseUrl()

  // ── Primera visita GRATIS: sin pago, provisionamos directamente ──
  if (FIRST_VISIT_CENTS <= 0) {
    try {
      const res = await provisionVisit({
        name,
        email,
        doctorId: slot.doctorId,
        startUtcISO: slot.startUtc,
        endUtcISO: slot.endUtc,
        // Clave de idempotencia sintética (no hay sesión de Stripe).
        referenceId: `free-${email}-${slot.startUtc}`,
        paymentIntentId: null,
      })
      if (!res) return { error: "No se pudo completar la reserva. Inténtalo de nuevo." }
      const params = new URLSearchParams({ ref: res.referenceId, email: res.email, name: res.name })
      return { url: `${baseUrl}/bienvenido?${params.toString()}` }
    } catch (e) {
      return { error: e instanceof Error ? e.message : "No se pudo completar la reserva." }
    }
  }

  // ── Fallback: primera visita con coste → cobro con Stripe Checkout ──
  // Compliance: el acto médico lo cobra y factura la CLÍNICA (destination charge
  // con `on_behalf_of`); DoctorLife retiene su comisión tecnológica.
  const clinic = await getDoctorChargeContext(slot.doctorId)
  const paymentIntentData: Record<string, unknown> = {}
  if (clinic) {
    paymentIntentData.on_behalf_of = clinic.accountId
    paymentIntentData.transfer_data = { destination: clinic.accountId }
    paymentIntentData.application_fee_amount = platformFeeCents(FIRST_VISIT_CENTS)
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: FIRST_VISIT_CENTS,
            product_data: {
              name: "Primera visita · DoctorLife",
              description: "Evaluación con tu endocrino. Incluye acceso a tu panel privado.",
            },
          },
        },
      ],
      ...(Object.keys(paymentIntentData).length ? { payment_intent_data: paymentIntentData } : {}),
      metadata: {
        kind: "public_signup",
        name,
        email,
        doctorId: slot.doctorId,
        startUtcISO: slot.startUtc,
        endUtcISO: slot.endUtc,
      },
      success_url: `${baseUrl}/bienvenido?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/?checkout=cancelled`,
    })
    if (!session.url) return { error: "No se pudo iniciar el pago." }
    return { url: session.url }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "No se pudo iniciar el pago." }
  }
}

/**
 * Núcleo de provisión: crea (idempotente) la cuenta del paciente, su primera
 * cita y envía las credenciales. Reutilizado por el flujo gratuito (directo) y
 * por el flujo de pago (desde la sesión de Stripe).
 *
 * `referenceId` actúa como clave de idempotencia de la cita
 * (columna stripeSessionId): para el flujo gratuito es una clave sintética; para
 * el de pago es el id de la sesión de Stripe.
 */
async function provisionVisit(params: {
  name: string
  email: string
  doctorId: string
  startUtcISO: string
  endUtcISO?: string | null
  referenceId: string
  paymentIntentId?: string | null
}): Promise<{ email: string; name: string; referenceId: string } | null> {
  const email = params.email.toLowerCase()
  const name = params.name || "Paciente"
  const { doctorId, startUtcISO, endUtcISO, referenceId } = params
  if (!email || !doctorId || !startUtcISO) return null

  // 1) Cuenta del paciente (con contraseña temporal) — idempotente.
  let userId: string
  let tempPassword: string | null = null
  let freshlyCreated = false
  const [already] = await db.select({ id: user.id }).from(user).where(eq(user.email, email)).limit(1)
  if (already) {
    userId = already.id
  } else {
    const pwd = generateTempPassword()
    try {
      const created = await auth.api.signUpEmail({ body: { name, email, password: pwd } })
      userId = created.user.id
      tempPassword = pwd
      freshlyCreated = true
    } catch {
      // Perdió la carrera con otra ejecución: reusar la cuenta existente.
      const [u] = await db.select({ id: user.id }).from(user).where(eq(user.email, email)).limit(1)
      if (!u) return null
      userId = u.id
    }
  }

  // 2) Cita confirmada de la primera visita. Idempotente por referencia.
  const [existingAppt] = await db
    .select({ id: appointments.id })
    .from(appointments)
    .where(eq(appointments.stripeSessionId, referenceId))
    .limit(1)
  if (!existingAppt) {
    const start = new Date(startUtcISO)
    const end = endUtcISO ? new Date(endUtcISO) : new Date(start.getTime() + 30 * 60_000)
    const [appt] = await db
      .insert(appointments)
      .values({
        patientId: userId,
        doctorId,
        startsAt: start,
        endsAt: end,
        status: "confirmed",
        amountCents: FIRST_VISIT_CENTS,
        applicationFeeCents: 0,
        stripePaymentIntentId: params.paymentIntentId ?? null,
        stripeSessionId: referenceId,
      })
      .returning({ id: appointments.id })

    // Enlace de Google Meet (si está configurado).
    try {
      const [doc] = await db
        .select({ email: user.email })
        .from(user)
        .where(eq(user.id, doctorId))
        .limit(1)
      const meeting = await maybeCreateMeeting({
        doctorId,
        doctorEmail: doc?.email ?? "",
        patientEmail: email,
        summary: "Primera consulta · DoctorLife",
        startUtc: start,
        endUtc: end,
      })
      if (meeting.meetingUrl || meeting.googleEventId) {
        await db
          .update(appointments)
          .set({ meetingUrl: meeting.meetingUrl, googleEventId: meeting.googleEventId, updatedAt: new Date() })
          .where(eq(appointments.id, appt.id))
      }
    } catch (e) {
      console.log("[v0] provision meeting error:", e instanceof Error ? e.message : e)
    }
  }

  // 3) Emails — solo la primera vez (cuenta recién creada).
  if (freshlyCreated && tempPassword) {
    try {
      await sendCredentialsEmail({ to: email, name, tempPassword })
      const [doc] = await db
        .select({ fullName: doctorProfiles.fullName })
        .from(doctorProfiles)
        .where(eq(doctorProfiles.userId, doctorId))
        .limit(1)
      await sendBookingConfirmationEmail({
        to: email,
        name,
        doctorName: doc?.fullName ?? null,
        startsAt: new Date(startUtcISO),
        amountLabel: FIRST_VISIT_LABEL,
      })
    } catch (e) {
      console.log("[v0] provision email error:", e instanceof Error ? e.message : e)
    }
  }

  return { email, name, referenceId }
}

/**
 * Crea la cuenta del paciente y su primera cita a partir de una sesión de
 * Checkout pagada. Solo se usa cuando la primera visita tiene coste. Idempotente:
 * se llama desde la página de éxito y desde el webhook; solo envía emails la
 * primera vez.
 */
export async function provisionFromSession(
  sessionId: string,
): Promise<{ email: string; name: string; referenceId: string } | null> {
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  if (session.metadata?.kind !== "public_signup") return null
  if (session.payment_status !== "paid" && session.status !== "complete") return null

  const email = (session.metadata.email || session.customer_email || "").toLowerCase()
  const name = session.metadata.name || "Paciente"
  const doctorId = session.metadata.doctorId
  const startUtcISO = session.metadata.startUtcISO
  const endUtcISO = session.metadata.endUtcISO
  if (!email || !doctorId || !startUtcISO) return null

  return provisionVisit({
    name,
    email,
    doctorId,
    startUtcISO,
    endUtcISO,
    referenceId: session.id,
    paymentIntentId: (session.payment_intent as string | null) ?? null,
  })
}
