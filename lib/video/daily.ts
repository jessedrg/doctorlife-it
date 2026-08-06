/**
 * Videollamadas con Daily.co
 * --------------------------------------------------------------------------
 * Reemplazo de Google Meet. Crea una sala única por cita a través de la API
 * REST de Daily.co, sin que cada médico tenga que conectar ninguna cuenta.
 *
 * Se mantiene deliberadamente la MISMA firma que la antigua integración de
 * Google (`maybeCreateMeeting` / `maybeCancelMeeting`) para no tocar el resto
 * del flujo de reservas. El campo `googleEventId` se reutiliza para guardar el
 * nombre de la sala de Daily, de modo que podamos borrarla al cancelar la cita.
 */

const DAILY_API = "https://api.daily.co/v1"

/** ¿Está configurada la integración de vídeo? */
export function isVideoConfigured(): boolean {
  return Boolean(process.env.DAILY_API_KEY)
}

/** Compatibilidad con el código antiguo que preguntaba por Google. */
export const isGoogleConfigured = isVideoConfigured

type CreateMeetingInput = {
  /** Id del médico (solo para logs/depuración). */
  doctorId: string
  doctorEmail: string
  patientEmail: string
  summary: string
  startUtc: Date
  endUtc: Date
}

type MeetingResult = {
  /** URL de la sala de Daily para unirse a la videollamada. */
  meetingUrl: string | null
  /**
   * Identificador de la sala (su `name` en Daily). Se guarda en la columna
   * `googleEventId` existente para poder eliminar la sala al cancelar.
   */
  googleEventId: string | null
}

/** Nombre de sala único, corto y sin caracteres problemáticos. */
function buildRoomName(): string {
  const rand = Math.random().toString(36).slice(2, 10)
  return `dl-${Date.now().toString(36)}-${rand}`
}

/**
 * Crea una sala de Daily.co para la cita. Si la integración no está
 * configurada, devuelve valores nulos sin lanzar (best-effort, igual que la
 * antigua integración de Google).
 */
export async function maybeCreateMeeting(input: CreateMeetingInput): Promise<MeetingResult> {
  const apiKey = process.env.DAILY_API_KEY
  if (!apiKey) {
    console.log("[v0] Daily.co sin configurar: DAILY_API_KEY ausente")
    return { meetingUrl: null, googleEventId: null }
  }

  const name = buildRoomName()
  // La sala expira 2h después del fin de la cita; margen amplio por reprogramaciones.
  const exp = Math.floor(input.endUtc.getTime() / 1000) + 2 * 60 * 60
  // Disponible desde 15 min antes del inicio.
  const nbf = Math.floor(input.startUtc.getTime() / 1000) - 15 * 60

  try {
    const res = await fetch(`${DAILY_API}/rooms`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        privacy: "public",
        properties: {
          exp,
          nbf,
          // Limpieza automática: Daily borra la sala al expirar.
          enable_prejoin_ui: true,
          enable_chat: true,
          enable_knocking: false,
          max_participants: 4,
        },
      }),
    })

    if (!res.ok) {
      const detail = await res.text().catch(() => "")
      console.log("[v0] Daily.co no pudo crear la sala:", res.status, detail)
      return { meetingUrl: null, googleEventId: null }
    }

    const room = (await res.json()) as { name: string; url: string }
    return { meetingUrl: room.url, googleEventId: room.name }
  } catch (err) {
    console.log("[v0] Error creando sala Daily.co:", (err as Error).message)
    return { meetingUrl: null, googleEventId: null }
  }
}

/**
 * Elimina la sala de Daily asociada a una cita cancelada (best-effort).
 * El primer argumento (doctorId) se mantiene por compatibilidad de firma.
 */
export async function maybeCancelMeeting(_doctorId: string, roomName: string | null): Promise<void> {
  const apiKey = process.env.DAILY_API_KEY
  if (!apiKey || !roomName) return

  try {
    await fetch(`${DAILY_API}/rooms/${encodeURIComponent(roomName)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${apiKey}` },
    })
  } catch (err) {
    console.log("[v0] Error borrando sala Daily.co:", (err as Error).message)
  }
}
