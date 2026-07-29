"use server"

import { db } from "@/lib/db"
import { appointments, doctorProfiles, subscriptions, user } from "@/lib/db/schema"
import { getSessionUser, requireRole } from "@/lib/session"
import { stripe, platformFeeCents } from "@/lib/stripe"
import { getDoctorChargeContext } from "@/lib/clinic"
import { getRequestBaseUrl } from "@/lib/base-url"
import { getPooledSlots, isSlotFree } from "@/lib/scheduling/pool"
import { scheduling } from "@/lib/scheduling"
import { maybeCreateMeeting, maybeCancelMeeting } from "@/lib/google/calendar"
import {
  sendAppointmentCancelledEmail,
  sendRescheduleConfirmedEmail,
} from "@/lib/email"
import { and, asc, desc, eq, gte, inArray, lt, lte, ne } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import type { PooledSlot, Slot } from "@/lib/scheduling/types"

const SUB_ACTIVE_STATES = ["active", "trialing", "past_due"]

const CONSULT_PRICE_CENTS = 2500

/** Huecos combinados de todos los médicos para los próximos `days` días. */
export async function getPooledAvailability(days = 14): Promise<PooledSlot[]> {
  const from = new Date()
  const to = new Date(from.getTime() + days * 24 * 60 * 60_000)
  return getPooledSlots({ from, to })
}

/**
 * Reserva un hueco y crea la sesión de pago de Stripe (cargo a la plataforma).
 * El médico se asigna automáticamente entre los disponibles para esa hora.
 */
export async function createBookingCheckout(
  startUtcISO: string,
): Promise<{ url: string } | { error: string }> {
  const patient = await requireRole("patient")

  const start = new Date(startUtcISO)
  if (Number.isNaN(start.getTime()) || start.getTime() < Date.now()) {
    return { error: "Ese horario ya no es válido." }
  }

  // Recalculamos la agenda combinada y localizamos el hueco elegido.
  const slots = await getPooledSlots({
    from: new Date(),
    to: new Date(Date.now() + 30 * 24 * 60 * 60_000),
  })
  const slot = slots.find((s) => s.startUtc === start.toISOString())
  if (!slot) return { error: "Ese horario ya no está disponible. Elige otro." }

  // Doble comprobación de que sigue libre para el médico asignado.
  if (!(await isSlotFree(slot.doctorId, start))) {
    return { error: "Ese horario acaba de ocuparse. Elige otro." }
  }

  // Compliance: el acto médico lo cobra y factura la CLÍNICA. Sin clínica lista
  // no se puede cobrar (el dinero no debe caer en la plataforma).
  const clinic = await getDoctorChargeContext(slot.doctorId)
  if (!clinic) {
    return {
      error:
        "La clínica todavía no puede procesar cobros. Inténtalo de nuevo más tarde.",
    }
  }
  const feeCents = platformFeeCents(CONSULT_PRICE_CENTS)

  // Creamos la cita en estado pending_payment (reserva el hueco).
  let appointmentId: number
  try {
    const [row] = await db
      .insert(appointments)
      .values({
        patientId: patient.id,
        doctorId: slot.doctorId,
        startsAt: start,
        endsAt: new Date(slot.endUtc),
        status: "pending_payment",
        amountCents: CONSULT_PRICE_CENTS,
        // La clínica cobra el acto médico; DoctorLife retiene su comisión tecnológica.
        applicationFeeCents: feeCents,
      })
      .returning({ id: appointments.id })
    appointmentId = row.id
  } catch {
    return { error: "Ese horario acaba de ocuparse. Elige otro." }
  }

  // Cargo liquidado en la clínica: `on_behalf_of` + `transfer_data.destination`
  // = clínica; DoctorLife retiene `application_fee_amount`.
  const baseUrl = await getRequestBaseUrl()
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: patient.email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: CONSULT_PRICE_CENTS,
            product_data: {
              name: "Consulta médica · DoctorLife",
              description: `Cita con ${slot.doctorName} el ${slot.date} a las ${slot.label}`,
            },
          },
        },
      ],
      metadata: { appointmentId: String(appointmentId) },
      payment_intent_data: {
        metadata: { appointmentId: String(appointmentId) },
        on_behalf_of: clinic.accountId,
        transfer_data: { destination: clinic.accountId },
        application_fee_amount: feeCents,
      },
      success_url: `${baseUrl}/portal/citas?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/portal/reservar?cancelled=1`,
    })

    await db
      .update(appointments)
      .set({ stripeSessionId: session.id, updatedAt: new Date() })
      .where(eq(appointments.id, appointmentId))

    if (!session.url) return { error: "No se pudo iniciar el pago." }
    return { url: session.url }
  } catch (e) {
    // Liberamos la reserva si falla la creación del pago.
    await db.delete(appointments).where(eq(appointments.id, appointmentId))
    return { error: e instanceof Error ? e.message : "No se pudo iniciar el pago." }
  }
}

/**
 * Reserva una cita de seguimiento incluida en la suscripción activa (sin pago).
 * Se usa desde el portal del paciente para las videollamadas mensuales.
 */
export async function createIncludedBooking(
  startUtcISO: string,
): Promise<{ ok: true } | { error: string }> {
  const patient = await requireRole("patient")

  // Debe tener una suscripción activa para reservar gratis.
  const [sub] = await db
    .select({ doctorId: subscriptions.doctorId, status: subscriptions.status })
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.patientId, patient.id),
        inArray(subscriptions.status, SUB_ACTIVE_STATES),
      ),
    )
    .orderBy(desc(subscriptions.id))
    .limit(1)
  if (!sub) {
    return { error: "Necesitas una suscripción activa para reservar tu videollamada." }
  }

  const start = new Date(startUtcISO)
  if (Number.isNaN(start.getTime()) || start.getTime() < Date.now()) {
    return { error: "Ese horario ya no es válido." }
  }

  const slots = await getPooledSlots({
    from: new Date(),
    to: new Date(Date.now() + 30 * 24 * 60 * 60_000),
  })
  const slot = slots.find((s) => s.startUtc === start.toISOString())
  if (!slot) return { error: "Ese horario ya no está disponible. Elige otro." }

  // Preferimos mantener al endocrino asignado en la suscripción si está libre.
  let doctorId = slot.doctorId
  if (sub.doctorId && (await isSlotFree(sub.doctorId, start))) {
    doctorId = sub.doctorId
  } else if (!(await isSlotFree(slot.doctorId, start))) {
    return { error: "Ese horario acaba de ocuparse. Elige otro." }
  }

  let appointmentId: number
  try {
    const [row] = await db
      .insert(appointments)
      .values({
        patientId: patient.id,
        doctorId,
        startsAt: start,
        endsAt: new Date(slot.endUtc),
        status: "confirmed",
        amountCents: 0,
        applicationFeeCents: 0,
      })
      .returning({ id: appointments.id })
    appointmentId = row.id
  } catch {
    return { error: "Ese horario acaba de ocuparse. Elige otro." }
  }

  // Crea el enlace de la videollamada (si Google está configurado).
  const [doc] = await db
    .select({ email: user.email })
    .from(doctorProfiles)
    .innerJoin(user, eq(user.id, doctorProfiles.userId))
    .where(eq(doctorProfiles.userId, doctorId))
  const [pat] = await db.select({ email: user.email }).from(user).where(eq(user.id, patient.id))
  const meeting = await maybeCreateMeeting({
    doctorId,
    doctorEmail: doc?.email ?? "",
    patientEmail: pat?.email ?? "",
    summary: "Seguimiento mensual · DoctorLife",
    startUtc: start,
    endUtc: new Date(slot.endUtc),
  })
  if (meeting.meetingUrl || meeting.googleEventId) {
    await db
      .update(appointments)
      .set({ meetingUrl: meeting.meetingUrl, googleEventId: meeting.googleEventId, updatedAt: new Date() })
      .where(eq(appointments.id, appointmentId))
  }

  // El seguimiento de este ciclo queda agendado: limpiamos el aviso pendiente.
  await db
    .update(subscriptions)
    .set({ followupDueAt: null, updatedAt: new Date() })
    .where(
      and(
        eq(subscriptions.patientId, patient.id),
        inArray(subscriptions.status, SUB_ACTIVE_STATES),
      ),
    )

  revalidatePath("/portal/citas")
  revalidatePath("/portal")
  revalidatePath("/clinica/citas")
  return { ok: true }
}

/**
 * Confirma una cita a partir de la sesión de Stripe (idempotente).
 * Se llama desde la página de éxito y desde el webhook.
 */
export async function confirmAppointmentBySession(sessionId: string): Promise<void> {
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  if (session.payment_status !== "paid") return
  const appointmentId = Number(session.metadata?.appointmentId)
  if (!appointmentId) return
  await finalizeAppointment(appointmentId, session.payment_intent as string | null)
}

/** Marca la cita como confirmada, transfiere al médico y crea el Meet. */
export async function finalizeAppointment(
  appointmentId: number,
  paymentIntentId: string | null,
): Promise<void> {
  const [appt] = await db
    .select()
    .from(appointments)
    .where(eq(appointments.id, appointmentId))
  if (!appt || appt.status === "confirmed") return

  await db
    .update(appointments)
    .set({
      status: "confirmed",
      stripePaymentIntentId: paymentIntentId ?? appt.stripePaymentIntentId,
      updatedAt: new Date(),
    })
    .where(eq(appointments.id, appointmentId))

  // El acto médico ya se liquidó en la clínica en el propio cargo (destination
  // charge con `application_fee`). No se transfiere nada al médico: la clínica
  // gestiona su remuneración fuera de la app. Solo necesitamos el email del
  // médico para crear la videollamada.
  const [doc] = await db
    .select({ email: user.email })
    .from(doctorProfiles)
    .innerJoin(user, eq(user.id, doctorProfiles.userId))
    .where(eq(doctorProfiles.userId, appt.doctorId))

  // Enlace de Google Meet (si Google está configurado y el médico conectado).
  const [pat] = await db.select({ email: user.email }).from(user).where(eq(user.id, appt.patientId))
  const meeting = await maybeCreateMeeting({
    doctorId: appt.doctorId,
    doctorEmail: doc?.email ?? "",
    patientEmail: pat?.email ?? "",
    summary: "Primera consulta · DoctorLife",
    startUtc: new Date(appt.startsAt),
    endUtc: new Date(appt.endsAt),
  })
  if (meeting.meetingUrl || meeting.googleEventId) {
    await db
      .update(appointments)
      .set({
        meetingUrl: meeting.meetingUrl,
        googleEventId: meeting.googleEventId,
        updatedAt: new Date(),
      })
      .where(eq(appointments.id, appointmentId))
  }

  revalidatePath("/portal/citas")
  revalidatePath("/clinica/citas")
}

/** Citas del paciente autenticado, con el nombre del médico asignado. */
export async function getMyAppointments() {
  const me = await getSessionUser()
  if (!me) return []
  return db
    .select({
      id: appointments.id,
      startsAt: appointments.startsAt,
      endsAt: appointments.endsAt,
      status: appointments.status,
      amountCents: appointments.amountCents,
      meetingUrl: appointments.meetingUrl,
      cancelledBy: appointments.cancelledBy,
      rescheduledToId: appointments.rescheduledToId,
      doctorName: doctorProfiles.fullName,
    })
    .from(appointments)
    .leftJoin(doctorProfiles, eq(doctorProfiles.userId, appointments.doctorId))
    .where(and(eq(appointments.patientId, me.id)))
    .orderBy(appointments.startsAt)
}

/** Citas del médico autenticado dentro de un rango (para la agenda/calendario). */
export async function getDoctorAppointments(fromISO?: string, toISO?: string) {
  const me = await getSessionUser()
  if (!me) return []

  const from = fromISO ? new Date(fromISO) : new Date(Date.now() - 60 * 24 * 60 * 60_000)
  const to = toISO ? new Date(toISO) : new Date(Date.now() + 120 * 24 * 60 * 60_000)

  const rows = await db
    .select({
      id: appointments.id,
      startsAt: appointments.startsAt,
      endsAt: appointments.endsAt,
      status: appointments.status,
      amountCents: appointments.amountCents,
      meetingUrl: appointments.meetingUrl,
      patientName: user.name,
      patientEmail: user.email,
    })
    .from(appointments)
    .leftJoin(user, eq(user.id, appointments.patientId))
    .where(
      and(
        eq(appointments.doctorId, me.id),
        ne(appointments.status, "pending_payment"),
        gte(appointments.startsAt, from),
        lte(appointments.startsAt, to),
      ),
    )
    .orderBy(asc(appointments.startsAt))

  return rows.map((r) => ({
    id: r.id,
    startsAt: r.startsAt,
    endsAt: r.endsAt,
    status: r.status,
    amountCents: r.amountCents,
    meetingUrl: r.meetingUrl,
    patientName: r.patientName ?? r.patientEmail ?? "Paciente",
  }))
}

/** Próxima cita futura no cancelada del paciente (o null). */
export async function getNextAppointment() {
  const me = await getSessionUser()
  if (!me) return null
  const [next] = await db
    .select({
      id: appointments.id,
      startsAt: appointments.startsAt,
      endsAt: appointments.endsAt,
      status: appointments.status,
      meetingUrl: appointments.meetingUrl,
      doctorName: doctorProfiles.fullName,
    })
    .from(appointments)
    .leftJoin(doctorProfiles, eq(doctorProfiles.userId, appointments.doctorId))
    .where(
      and(
        eq(appointments.patientId, me.id),
        ne(appointments.status, "cancelled"),
        gte(appointments.startsAt, new Date()),
      ),
    )
    .orderBy(asc(appointments.startsAt))
    .limit(1)
  return next ?? null
}

/* ------------------------------------------------------------------ */
/* Cancelación (médico) y reprogramación (paciente)                    */
/* ------------------------------------------------------------------ */

/** Una cita es "primera consulta" (de pago) si tuvo importe; si no, es seguimiento. */
function isFirstConsult(amountCents: number): boolean {
  return amountCents > 0
}

/**
 * El médico cancela una de sus citas. La cita queda 'cancelled' y el paciente
 * podrá reprogramar. No se mueve dinero todavía: si reprograma con el mismo
 * médico, la transferencia sigue siendo válida; solo se ajusta si cambia de
 * médico al reprogramar una primera consulta.
 */
export async function cancelAppointmentAsDoctor(
  appointmentId: number,
): Promise<{ ok: true } | { error: string }> {
  const me = await requireRole("doctor")

  const [appt] = await db.select().from(appointments).where(eq(appointments.id, appointmentId))
  if (!appt || appt.doctorId !== me.id) return { error: "Cita no encontrada." }
  if (appt.status === "cancelled") return { error: "La cita ya estaba cancelada." }

  await db
    .update(appointments)
    .set({ status: "cancelled", cancelledBy: "doctor", updatedAt: new Date() })
    .where(eq(appointments.id, appointmentId))

  // Cancela el evento de Google Meet (best-effort).
  await maybeCancelMeeting(appt.doctorId, appt.googleEventId)

  // Avisa al paciente para que reprograme.
  const [pat] = await db
    .select({ email: user.email, name: user.name })
    .from(user)
    .where(eq(user.id, appt.patientId))
  const [doc] = await db
    .select({ fullName: doctorProfiles.fullName })
    .from(doctorProfiles)
    .where(eq(doctorProfiles.userId, appt.doctorId))
  if (pat?.email) {
    try {
      await sendAppointmentCancelledEmail({
        to: pat.email,
        name: pat.name ?? "",
        doctorName: doc?.fullName ?? null,
        startsAt: new Date(appt.startsAt),
        rescheduleId: appt.id,
        isFollowup: !isFirstConsult(appt.amountCents),
      })
    } catch (e) {
      console.log("[v0] cancel email failed:", e instanceof Error ? e.message : e)
    }
  }

  revalidatePath("/clinica/agenda")
  revalidatePath("/portal/citas")
  revalidatePath("/portal")
  return { ok: true }
}

/** Huecos libres de UN médico concreto (para reprogramar seguimientos). */
async function getSingleDoctorSlots(doctorId: string, days = 21): Promise<PooledSlot[]> {
  const from = new Date()
  const to = new Date(from.getTime() + days * 24 * 60 * 60_000)

  const [doc] = await db
    .select({ name: doctorProfiles.fullName })
    .from(doctorProfiles)
    .where(eq(doctorProfiles.userId, doctorId))
  const doctorName = doc?.name ?? "tu médico"

  // Instantes ya ocupados por ese médico (citas activas).
  const booked = await db
    .select({ startsAt: appointments.startsAt })
    .from(appointments)
    .where(
      and(
        eq(appointments.doctorId, doctorId),
        ne(appointments.status, "cancelled"),
        gte(appointments.startsAt, from),
        lt(appointments.startsAt, to),
      ),
    )
  const taken = new Set(booked.map((b) => new Date(b.startsAt).toISOString()))

  const slots: Slot[] = await scheduling.getAvailableSlots(doctorId, { from, to }, taken)
  return slots.map((s) => ({ ...s, doctorId, doctorName }))
}

export type RescheduleOptions = {
  appointmentId: number
  kind: "first" | "followup"
  doctorName: string | null
  slots: PooledSlot[]
}

/**
 * Opciones de reprogramación para el paciente:
 * - Primera consulta → huecos COMBINADOS de todos los médicos (puede reasignarse).
 * - Seguimiento → solo huecos del médico ya asignado.
 */
export async function getRescheduleOptions(
  appointmentId: number,
): Promise<RescheduleOptions | { error: string }> {
  const me = await requireRole("patient")

  const [appt] = await db.select().from(appointments).where(eq(appointments.id, appointmentId))
  if (!appt || appt.patientId !== me.id) return { error: "Cita no encontrada." }
  if (appt.status !== "cancelled") return { error: "Esta cita no necesita reprogramarse." }
  if (appt.rescheduledToId) return { error: "Esta cita ya se reprogramó." }

  const [doc] = await db
    .select({ name: doctorProfiles.fullName })
    .from(doctorProfiles)
    .where(eq(doctorProfiles.userId, appt.doctorId))

  if (isFirstConsult(appt.amountCents)) {
    return {
      appointmentId,
      kind: "first",
      doctorName: doc?.name ?? null,
      slots: await getPooledAvailability(21),
    }
  }
  return {
    appointmentId,
    kind: "followup",
    doctorName: doc?.name ?? null,
    slots: await getSingleDoctorSlots(appt.doctorId, 21),
  }
}

/**
 * El paciente reprograma una cita cancelada por el médico.
 * - Seguimiento: se mantiene el mismo médico.
 * - Primera consulta: se reasigna por el pool; si cambia de médico se revierte
 *   la transferencia original y se transfiere al nuevo (sin cobrar de nuevo).
 */
export async function rescheduleAppointment(
  appointmentId: number,
  startUtcISO: string,
): Promise<{ ok: true; newId: number } | { error: string }> {
  const me = await requireRole("patient")

  const [old] = await db.select().from(appointments).where(eq(appointments.id, appointmentId))
  if (!old || old.patientId !== me.id) return { error: "Cita no encontrada." }
  if (old.status !== "cancelled") return { error: "Esta cita no necesita reprogramarse." }
  if (old.rescheduledToId) return { error: "Esta cita ya se reprogramó." }

  const start = new Date(startUtcISO)
  if (Number.isNaN(start.getTime()) || start.getTime() < Date.now()) {
    return { error: "Ese horario ya no es válido." }
  }

  const followup = !isFirstConsult(old.amountCents)

  // Determina el médico y valida que el hueco siga libre.
  let doctorId: string
  let endUtc: Date
  if (followup) {
    // Mismo médico asignado.
    const slots = await getSingleDoctorSlots(old.doctorId, 30)
    const slot = slots.find((s) => s.startUtc === start.toISOString())
    if (!slot) return { error: "Ese horario ya no está disponible. Elige otro." }
    doctorId = old.doctorId
    endUtc = new Date(slot.endUtc)
  } else {
    // Pool: el sistema asigna un médico disponible para ese hueco.
    const slots = await getPooledSlots({
      from: new Date(),
      to: new Date(Date.now() + 30 * 24 * 60 * 60_000),
    })
    const slot = slots.find((s) => s.startUtc === start.toISOString())
    if (!slot) return { error: "Ese horario ya no está disponible. Elige otro." }
    doctorId = slot.doctorId
    endUtc = new Date(slot.endUtc)
  }

  if (!(await isSlotFree(doctorId, start))) {
    return { error: "Ese horario acaba de ocuparse. Elige otro." }
  }

  // Crea la nueva cita confirmada (sin cobrar de nuevo; hereda el importe).
  let newId: number
  try {
    const [row] = await db
      .insert(appointments)
      .values({
        patientId: old.patientId,
        doctorId,
        startsAt: start,
        endsAt: endUtc,
        status: "confirmed",
        amountCents: old.amountCents,
        applicationFeeCents: old.applicationFeeCents,
        currency: old.currency,
        stripeSessionId: old.stripeSessionId,
        stripePaymentIntentId: old.stripePaymentIntentId,
      })
      .returning({ id: appointments.id })
    newId = row.id
  } catch {
    return { error: "Ese horario acaba de ocuparse. Elige otro." }
  }

  // Enlaza la cita antigua con la nueva (no reprogramable dos veces).
  await db
    .update(appointments)
    .set({ rescheduledToId: newId, updatedAt: new Date() })
    .where(eq(appointments.id, appointmentId))

  // No hay movimiento de dinero al reprogramar: el acto médico lo cobra la
  // clínica (destination charge), independientemente del médico asignado, así
  // que cambiar de médico no requiere revertir ni recrear transferencias.

  // Crea el enlace de la nueva videollamada.
  const [doc] = await db
    .select({ email: user.email, fullName: doctorProfiles.fullName })
    .from(doctorProfiles)
    .innerJoin(user, eq(user.id, doctorProfiles.userId))
    .where(eq(doctorProfiles.userId, doctorId))
  const [pat] = await db
    .select({ email: user.email, name: user.name })
    .from(user)
    .where(eq(user.id, old.patientId))
  const meeting = await maybeCreateMeeting({
    doctorId,
    doctorEmail: doc?.email ?? "",
    patientEmail: pat?.email ?? "",
    summary: followup ? "Seguimiento mensual · DoctorLife" : "Primera consulta · DoctorLife",
    startUtc: start,
    endUtc,
  })
  if (meeting.meetingUrl || meeting.googleEventId) {
    await db
      .update(appointments)
      .set({ meetingUrl: meeting.meetingUrl, googleEventId: meeting.googleEventId, updatedAt: new Date() })
      .where(eq(appointments.id, newId))
  }

  // Confirmación al paciente.
  if (pat?.email) {
    try {
      await sendRescheduleConfirmedEmail({
        to: pat.email,
        name: pat.name ?? "",
        doctorName: doc?.fullName ?? null,
        startsAt: start,
        reassigned: !followup && doctorId !== old.doctorId,
      })
    } catch (e) {
      console.log("[v0] reschedule email failed:", e instanceof Error ? e.message : e)
    }
  }

  revalidatePath("/portal/citas")
  revalidatePath("/portal")
  revalidatePath("/clinica/agenda")
  return { ok: true, newId }
}
