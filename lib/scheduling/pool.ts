import { db } from "@/lib/db"
import { account, appointments, doctorProfiles, user } from "@/lib/db/schema"
import { and, eq, exists, gte, lt, ne, or } from "drizzle-orm"
import { isProductionRequest } from "@/lib/base-url"
import { scheduling } from "./index"
import type { PooledSlot, SlotRange } from "./types"

/** Minutos que una reserva sin pagar bloquea el hueco antes de liberarse. */
const PENDING_TTL_MIN = 30

/**
 * Devuelve los huecos libres COMBINADOS de todos los médicos que aceptan
 * pacientes, deduplicados por instante: el paciente elige una hora y el sistema
 * asigna un médico disponible para ese hueco. Las citas activas se descartan.
 */
export async function getPooledSlots(range: SlotRange): Promise<PooledSlot[]> {
  // En producción (doctorlife.io) excluimos los médicos de desarrollo.
  // En dev/preview/local los médicos de dev SÍ aparecen.
  const isProd = await isProductionRequest()

  // Médicos elegibles: solo aparecen quienes cumplen TODOS los requisitos para
  // poder atender — aceptan pacientes, tienen Stripe Connect operativo (cobros
  // y transferencias) y han enlazado Google (Calendar/Meet) para las
  // videollamadas. La disponibilidad se filtra después al generar los huecos.
  const doctors = await db
    .select({
      userId: doctorProfiles.userId,
      name: doctorProfiles.fullName,
    })
    .from(doctorProfiles)
    .innerJoin(user, eq(user.id, doctorProfiles.userId))
    .where(
      and(
        eq(doctorProfiles.acceptingPatients, true),
        eq(doctorProfiles.chargesEnabled, true),
        eq(doctorProfiles.payoutsEnabled, true),
        // En producción, excluir médicos marcados como isDevOnly.
        isProd ? eq(doctorProfiles.isDevOnly, false) : undefined,
        // Cuenta de Google enlazada (proveedor "google" en la tabla account).
        exists(
          db
            .select({ id: account.id })
            .from(account)
            .where(and(eq(account.userId, doctorProfiles.userId), eq(account.providerId, "google"))),
        ),
      ),
    )

  if (doctors.length === 0) return []

  // Citas activas en el rango, agrupadas por médico (huecos ocupados).
  // Una reserva 'pending_payment' solo bloquea durante PENDING_TTL_MIN.
  const pendingFloor = new Date(Date.now() - PENDING_TTL_MIN * 60_000)
  const booked = await db
    .select({
      doctorId: appointments.doctorId,
      startsAt: appointments.startsAt,
    })
    .from(appointments)
    .where(
      and(
        ne(appointments.status, "cancelled"),
        or(
          eq(appointments.status, "confirmed"),
          and(eq(appointments.status, "pending_payment"), gte(appointments.createdAt, pendingFloor)),
        ),
        gte(appointments.startsAt, range.from),
        lt(appointments.startsAt, range.to),
      ),
    )

  const takenByDoctor = new Map<string, Set<string>>()
  for (const b of booked) {
    const set = takenByDoctor.get(b.doctorId) ?? new Set<string>()
    set.add(new Date(b.startsAt).toISOString())
    takenByDoctor.set(b.doctorId, set)
  }

  // Para cada médico generamos sus huecos libres y los volcamos a un mapa por
  // instante. Si varios médicos comparten hora, repartimos por nº de huecos ya
  // asignados para equilibrar la carga.
  const byStart = new Map<string, PooledSlot>()
  const assignedCount = new Map<string, number>()

  for (const doc of doctors) {
    const slots = await scheduling.getAvailableSlots(
      doc.userId,
      range,
      takenByDoctor.get(doc.userId),
    )
    for (const s of slots) {
      const existing = byStart.get(s.startUtc)
      if (!existing) {
        byStart.set(s.startUtc, { ...s, doctorId: doc.userId, doctorName: doc.name })
        assignedCount.set(doc.userId, (assignedCount.get(doc.userId) ?? 0) + 1)
        continue
      }
      // Reasignar al médico con menos huecos asignados (equilibrio simple).
      const currentLoad = assignedCount.get(existing.doctorId) ?? 0
      const candidateLoad = assignedCount.get(doc.userId) ?? 0
      if (candidateLoad < currentLoad) {
        assignedCount.set(existing.doctorId, currentLoad - 1)
        assignedCount.set(doc.userId, candidateLoad + 1)
        byStart.set(s.startUtc, { ...s, doctorId: doc.userId, doctorName: doc.name })
      }
    }
  }

  return [...byStart.values()].sort((a, b) => a.startUtc.localeCompare(b.startUtc))
}

/** Comprueba que un instante concreto sigue libre para un médico dado. */
export async function isSlotFree(doctorId: string, startUtc: Date): Promise<boolean> {
  const rows = await db
    .select({ id: appointments.id })
    .from(appointments)
    .where(
      and(
        eq(appointments.doctorId, doctorId),
        eq(appointments.startsAt, startUtc),
        ne(appointments.status, "cancelled"),
      ),
    )
  return rows.length === 0
}
