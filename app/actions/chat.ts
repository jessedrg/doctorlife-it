"use server"

import { db } from "@/lib/db"
import { appointments, conversations, messages, user } from "@/lib/db/schema"
import { getSessionUser } from "@/lib/session"
import { hasActiveSubscription } from "@/app/actions/subscription"
import { maybeCreateMeeting, isGoogleConfigured } from "@/lib/google/calendar"
import { CALL_PREFIX } from "@/lib/chat-constants"
import { sendNewMessageEmail } from "@/lib/email"
import { and, asc, desc, eq, gt, ne, or } from "drizzle-orm"
import { revalidatePath } from "next/cache"

/** Minutos de silencio entre dos correos de notificación para la misma conversación. */
const NOTIFY_COOLDOWN_MINUTES = 5

async function requireUser() {
  const me = await getSessionUser()
  if (!me) throw new Error("Unauthorized")
  return me
}

/** Verifica que el usuario es participante de la conversación y la devuelve. */
async function requireParticipant(conversationId: number, userId: string) {
  const [conv] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, conversationId))
    .limit(1)
  if (!conv || (conv.patientId !== userId && conv.doctorId !== userId)) {
    throw new Error("Unauthorized")
  }
  return conv
}

/**
 * Para un paciente: encuentra (o crea) la conversación con el médico de su
 * cita más reciente no cancelada. Devuelve null si aún no tiene médico.
 */
export async function getOrCreatePatientConversation() {
  const me = await requireUser()

  const [appt] = await db
    .select({ doctorId: appointments.doctorId })
    .from(appointments)
    .where(and(eq(appointments.patientId, me.id), ne(appointments.status, "cancelled")))
    .orderBy(desc(appointments.startsAt))
    .limit(1)

  if (!appt) return null

  const [existing] = await db
    .select()
    .from(conversations)
    .where(and(eq(conversations.patientId, me.id), eq(conversations.doctorId, appt.doctorId)))
    .limit(1)

  if (existing) return existing.id

  const [created] = await db
    .insert(conversations)
    .values({ patientId: me.id, doctorId: appt.doctorId })
    .returning()

  return created.id
}

export type DoctorConversationStatus = "active" | "pending" | "archived"

export type ConversationSummary = {
  id: number
  counterpartId: string | null
  counterpartName: string
  counterpartImage: string | null
  lastMessageAt: Date | null
  lastMessagePreview: string | null
  doctorStatus: DoctorConversationStatus
}

/** Lista las conversaciones del usuario (médico o paciente) con datos del otro. */
export async function getMyConversations(): Promise<ConversationSummary[]> {
  const me = await requireUser()
  const isDoctor = me.role === "doctor"

  // El "otro" participante: para el médico es el paciente; para el paciente, el médico.
  const counterpartId = isDoctor ? conversations.patientId : conversations.doctorId

  const rows = await db
    .select({
      id: conversations.id,
      lastMessageAt: conversations.lastMessageAt,
      counterpartId: counterpartId,
      counterpartName: user.name,
      counterpartImage: user.image,
      doctorStatus: conversations.doctorStatus,
    })
    .from(conversations)
    .leftJoin(user, eq(user.id, counterpartId))
    .where(or(eq(conversations.patientId, me.id), eq(conversations.doctorId, me.id)))
    .orderBy(desc(conversations.lastMessageAt))

  // Adjunta el último mensaje de cada conversación como vista previa.
  const summaries = await Promise.all(
    rows.map(async (r) => {
      const [last] = await db
        .select({ body: messages.body })
        .from(messages)
        .where(eq(messages.conversationId, r.id))
        .orderBy(desc(messages.id))
        .limit(1)
      return {
        id: r.id,
        counterpartId: r.counterpartId ?? null,
        counterpartName: r.counterpartName ?? (isDoctor ? "Paciente" : "Médico"),
        counterpartImage: r.counterpartImage ?? null,
        lastMessageAt: r.lastMessageAt,
        lastMessagePreview: last?.body ? stripPreview(last.body) : null,
        doctorStatus: (r.doctorStatus ?? "active") as DoctorConversationStatus,
      }
    }),
  )

  return summaries
}

/** El médico fija el estado de una conversación para organizar su bandeja. */
export async function setConversationStatus(
  conversationId: number,
  status: DoctorConversationStatus,
) {
  const me = await requireUser()
  if (me.role !== "doctor") return { ok: false as const, error: "No autorizado" }
  const conv = await requireParticipant(conversationId, me.id)
  if (conv.doctorId !== me.id) return { ok: false as const, error: "No autorizado" }

  await db
    .update(conversations)
    .set({ doctorStatus: status })
    .where(eq(conversations.id, conversationId))

  revalidatePath("/clinica/chat")
  return { ok: true as const, status }
}

/** Quita el prefijo de análisis y recorta para una vista previa de una línea. */
function stripPreview(body: string): string {
  let text = body
  if (body.startsWith("[ANÁLISIS]")) text = "Análisis solicitados"
  else if (body.startsWith(CALL_PREFIX)) text = "Videollamada"
  text = text.replace(/\s+/g, " ").trim()
  return text.length > 60 ? text.slice(0, 60) + "…" : text
}

/** Datos (nombre + foto) del otro participante de una conversación. */
export async function getConversationCounterpart(conversationId: number) {
  const me = await requireUser()
  const conv = await requireParticipant(conversationId, me.id)
  const otherId = conv.patientId === me.id ? conv.doctorId : conv.patientId
  const [u] = await db
    .select({ name: user.name, image: user.image })
    .from(user)
    .where(eq(user.id, otherId))
    .limit(1)
  return {
    name: u?.name ?? (conv.patientId === me.id ? "Tu equipo médico" : "Paciente"),
    image: u?.image ?? null,
  }
}

/** Mensajes de una conversación (solo participantes). `after` para polling incremental. */
export async function getMessages(conversationId: number, after = 0) {
  const me = await requireUser()
  await requireParticipant(conversationId, me.id)

  const rows = await db
    .select()
    .from(messages)
    .where(and(eq(messages.conversationId, conversationId), gt(messages.id, after)))
    .orderBy(asc(messages.id))

  return rows.map((m) => ({
    id: m.id,
    body: m.body,
    mine: m.senderId === me.id,
    createdAt: m.createdAt,
  }))
}

/** Envía un mensaje a la conversación (solo participantes). */
export async function sendMessage(conversationId: number, body: string) {
  const me = await requireUser()
  const conv = await requireParticipant(conversationId, me.id)

  // El chat en vivo con la doctora asignada requiere suscripción activa.
  // (El médico siempre puede responder; solo se bloquea al paciente.)
  if (conv.patientId === me.id && !(await hasActiveSubscription(me.id))) {
    return { ok: false as const, error: "Activa tu tratamiento para chatear con tu médico." }
  }

  const text = body.trim()
  if (!text) return { ok: false as const, error: "Mensaje vacío" }
  if (text.length > 4000) return { ok: false as const, error: "Mensaje demasiado largo" }

  const [created] = await db
    .insert(messages)
    .values({ conversationId, senderId: me.id, body: text })
    .returning()

  await db
    .update(conversations)
    .set({ lastMessageAt: created.createdAt })
    .where(eq(conversations.id, conversationId))

  revalidatePath("/portal/chat")
  revalidatePath("/clinica/chat")

  // ── Notificación por email al destinatario ──────────────────────────────
  // Se lanza de forma fire-and-forget (sin await) para no bloquear la
  // respuesta al remitente. Cualquier error aquí es no-fatal.
  notifyRecipient(me, conv, text).catch((err) =>
    console.log("[v0] notifyRecipient error:", err),
  )

  return {
    ok: true as const,
    message: { id: created.id, body: created.body, mine: true, createdAt: created.createdAt },
  }
}

/**
 * Decide si debe enviarse el email de notificación al otro participante.
 * Respeta un cooldown de NOTIFY_COOLDOWN_MINUTES para no saturar el correo
 * cuando hay una conversación activa con muchos mensajes seguidos.
 */
async function notifyRecipient(
  sender: { id: string; name: string; role: string },
  conv: { id: number; patientId: string; doctorId: string; lastPatientNotifiedAt: Date | null; lastDoctorNotifiedAt: Date | null },
  preview: string,
) {
  const senderIsPatient = conv.patientId === sender.id
  const recipientId = senderIsPatient ? conv.doctorId : conv.patientId
  const recipientRole: "patient" | "doctor" = senderIsPatient ? "doctor" : "patient"

  // Comprueba si el cooldown está activo para este destinatario.
  const lastNotified = senderIsPatient
    ? conv.lastDoctorNotifiedAt
    : conv.lastPatientNotifiedAt

  const now = new Date()
  if (lastNotified) {
    const minutesSince = (now.getTime() - lastNotified.getTime()) / 60_000
    if (minutesSince < NOTIFY_COOLDOWN_MINUTES) return // dentro del cooldown, silencio
  }

  // Obtiene nombre + email del destinatario.
  const [recipient] = await db
    .select({ name: user.name, email: user.email })
    .from(user)
    .where(eq(user.id, recipientId))
    .limit(1)

  if (!recipient?.email) return

  // Actualiza el cooldown ANTES de enviar para evitar race conditions si
  // se envía otro mensaje antes de que el await del email termine.
  const cooldownField = senderIsPatient
    ? { lastDoctorNotifiedAt: now }
    : { lastPatientNotifiedAt: now }

  await db
    .update(conversations)
    .set(cooldownField)
    .where(eq(conversations.id, conv.id))

  // Recorta el preview a 120 chars y elimina el prefijo de llamada.
  const previewText = preview.startsWith(CALL_PREFIX)
    ? "Videollamada iniciada"
    : preview.length > 120
      ? preview.slice(0, 120) + "…"
      : preview

  await sendNewMessageEmail({
    to: recipient.email,
    recipientName: recipient.name,
    senderName: sender.name,
    preview: previewText,
    recipientRole,
  })
}

/**
 * El médico genera una videollamada de Google Meet instantánea y la publica en
 * el chat como un mensaje con botón "Unirse" para ambos.
 */
export async function createInstantCall(conversationId: number) {
  const me = await requireUser()
  if (me.role !== "doctor") return { ok: false as const, error: "No autorizado" }
  const conv = await requireParticipant(conversationId, me.id)
  if (conv.doctorId !== me.id) return { ok: false as const, error: "No autorizado" }

  if (!isGoogleConfigured()) {
    return { ok: false as const, error: "Las videollamadas no están configuradas." }
  }

  // Email del médico y del paciente para invitar a ambos al evento.
  const [doc] = await db
    .select({ email: user.email })
    .from(user)
    .where(eq(user.id, me.id))
    .limit(1)
  const [pat] = await db
    .select({ email: user.email })
    .from(user)
    .where(eq(user.id, conv.patientId))
    .limit(1)

  const now = new Date()
  const end = new Date(now.getTime() + 60 * 60 * 1000)

  const { meetingUrl } = await maybeCreateMeeting({
    doctorId: me.id,
    doctorEmail: doc?.email ?? "",
    patientEmail: pat?.email ?? "",
    summary: "Videollamada DoctorLife",
    startUtc: now,
    endUtc: end,
  })

  if (!meetingUrl) {
    return {
      ok: false as const,
      error: "No se pudo crear la llamada. Conecta tu Google Calendar en Mi cuenta e inténtalo de nuevo.",
    }
  }

  const body = `${CALL_PREFIX} ${meetingUrl}`
  const [created] = await db
    .insert(messages)
    .values({ conversationId, senderId: me.id, body })
    .returning()

  await db
    .update(conversations)
    .set({ lastMessageAt: created.createdAt })
    .where(eq(conversations.id, conversationId))

  revalidatePath("/portal/chat")
  revalidatePath("/clinica/chat")

  return {
    ok: true as const,
    message: { id: created.id, body: created.body, mine: true, createdAt: created.createdAt },
  }
}
