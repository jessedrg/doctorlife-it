/**
 * Capa de integración con Google Calendar + Google Meet.
 *
 * Requiere credenciales OAuth de Google (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
 * y que cada médico conecte su cuenta de Google (botón "Conectar Google Calendar"
 * en su cuenta). Los tokens se guardan en la tabla `account` de Better Auth.
 *
 * Si Google no está configurado o el médico no ha conectado su cuenta, las
 * funciones degradan con elegancia: la cita se crea igualmente y el enlace de
 * Meet queda pendiente (meetingUrl = null), sin lanzar error.
 */

import { db } from "@/lib/db"
import { account } from "@/lib/db/schema"
import { and, eq } from "drizzle-orm"

const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token"
const EVENTS_ENDPOINT =
  "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all"
const EVENT_ENDPOINT = (id: string) =>
  `https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(id)}?sendUpdates=all`

export function isGoogleConfigured(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
}

export interface MeetingInput {
  doctorId: string
  doctorEmail: string
  patientEmail: string
  summary: string
  startUtc: Date
  endUtc: Date
}

export interface MeetingResult {
  meetingUrl: string | null
  googleEventId: string | null
}

/** Tokens de Google del médico almacenados por Better Auth. */
interface GoogleAccountRow {
  id: string
  accessToken: string | null
  refreshToken: string | null
  accessTokenExpiresAt: Date | null
}

/** Lee la cuenta de Google enlazada de un médico (o null si no la tiene). */
async function getGoogleAccount(doctorId: string): Promise<GoogleAccountRow | null> {
  const [row] = await db
    .select({
      id: account.id,
      accessToken: account.accessToken,
      refreshToken: account.refreshToken,
      accessTokenExpiresAt: account.accessTokenExpiresAt,
    })
    .from(account)
    .where(and(eq(account.userId, doctorId), eq(account.providerId, "google")))
    .limit(1)
  return row ?? null
}

/**
 * Devuelve un access token válido para el médico, refrescándolo con el
 * refresh_token si ha caducado, y persistiendo el nuevo token.
 */
async function getValidAccessToken(row: GoogleAccountRow): Promise<string | null> {
  const stillValid =
    row.accessToken &&
    row.accessTokenExpiresAt &&
    row.accessTokenExpiresAt.getTime() > Date.now() + 60_000 // margen de 1 min
  if (stillValid) return row.accessToken

  if (!row.refreshToken) return row.accessToken ?? null

  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID as string,
      client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
      grant_type: "refresh_token",
      refresh_token: row.refreshToken,
    }),
  })

  if (!res.ok) {
    console.log("[v0] google token refresh failed:", res.status, await res.text())
    return null
  }

  const data = (await res.json()) as { access_token?: string; expires_in?: number }
  if (!data.access_token) return null

  const expiresAt = new Date(Date.now() + (data.expires_in ?? 3600) * 1000)
  await db
    .update(account)
    .set({ accessToken: data.access_token, accessTokenExpiresAt: expiresAt, updatedAt: new Date() })
    .where(eq(account.id, row.id))

  return data.access_token
}

/**
 * Crea un evento en Google Calendar con enlace de Meet. Si Google no está
 * configurado o el médico no ha conectado su cuenta, devuelve enlaces nulos
 * sin lanzar error, para no bloquear la reserva.
 */
export async function maybeCreateMeeting(input: MeetingInput): Promise<MeetingResult> {
  if (!isGoogleConfigured()) {
    return { meetingUrl: null, googleEventId: null }
  }

  try {
    const row = await getGoogleAccount(input.doctorId)
    if (!row) return { meetingUrl: null, googleEventId: null }

    const accessToken = await getValidAccessToken(row)
    if (!accessToken) return { meetingUrl: null, googleEventId: null }

    const attendees: Array<{ email: string }> = []
    if (input.patientEmail) attendees.push({ email: input.patientEmail })

    const body = {
      summary: input.summary,
      description: "Consulta de DoctorLife. Únete a la videollamada con el enlace de Google Meet.",
      start: { dateTime: input.startUtc.toISOString(), timeZone: "UTC" },
      end: { dateTime: input.endUtc.toISOString(), timeZone: "UTC" },
      attendees,
      conferenceData: {
        createRequest: {
          requestId: `doctorlife-${input.doctorId}-${input.startUtc.getTime()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
      reminders: { useDefault: true },
    }

    const res = await fetch(EVENTS_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      console.log("[v0] google event insert failed:", res.status, await res.text())
      return { meetingUrl: null, googleEventId: null }
    }

    const event = (await res.json()) as {
      id?: string
      hangoutLink?: string
      conferenceData?: { entryPoints?: Array<{ entryPointType?: string; uri?: string }> }
    }

    const meetingUrl =
      event.hangoutLink ??
      event.conferenceData?.entryPoints?.find((e) => e.entryPointType === "video")?.uri ??
      null

    return { meetingUrl, googleEventId: event.id ?? null }
  } catch (e) {
    console.log("[v0] maybeCreateMeeting error:", e instanceof Error ? e.message : e)
    return { meetingUrl: null, googleEventId: null }
  }
}

/**
 * Elimina un evento de Google Calendar del médico (cancelación de cita).
 * Degrada en silencio si Google no está configurado o el médico no está enlazado.
 */
export async function maybeCancelMeeting(doctorId: string, googleEventId: string | null): Promise<void> {
  if (!googleEventId || !isGoogleConfigured()) return
  try {
    const row = await getGoogleAccount(doctorId)
    if (!row) return
    const accessToken = await getValidAccessToken(row)
    if (!accessToken) return

    const res = await fetch(EVENT_ENDPOINT(googleEventId), {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    // 410 = ya eliminado; lo tratamos como éxito.
    if (!res.ok && res.status !== 410 && res.status !== 404) {
      console.log("[v0] google event delete failed:", res.status, await res.text())
    }
  } catch (e) {
    console.log("[v0] maybeCancelMeeting error:", e instanceof Error ? e.message : e)
  }
}
