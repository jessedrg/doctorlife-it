"use server"

import { db } from "@/lib/db"
import { progressEntries, doctorNotes } from "@/lib/db/schema"
import { getSessionUser, requireUserId } from "@/lib/session"
import { and, desc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export type ProgressRow = {
  id: number
  weightKg: number | null
  waistCm: number | null
  dose: string | null
  sideEffects: string | null
  note: string | null
  createdAt: Date
}

function mapRow(r: typeof progressEntries.$inferSelect): ProgressRow {
  return {
    id: r.id,
    weightKg: r.weightKg != null ? Number(r.weightKg) : null,
    waistCm: r.waistCm != null ? Number(r.waistCm) : null,
    dose: r.dose,
    sideEffects: r.sideEffects,
    note: r.note,
    createdAt: new Date(r.createdAt),
  }
}

/** Registros de progreso del paciente autenticado (orden cronológico ascendente). */
export async function getMyProgress(): Promise<ProgressRow[]> {
  const me = await getSessionUser()
  if (!me) return []
  const rows = await db
    .select()
    .from(progressEntries)
    .where(eq(progressEntries.patientId, me.id))
    .orderBy(desc(progressEntries.createdAt))
    .limit(60)
  // Devolvemos ascendente para el gráfico (de más antiguo a más reciente).
  return rows.map(mapRow).reverse()
}

export type SharedNote = { id: number; body: string; createdAt: Date }

/** Notas que el médico marcó como compartidas con este paciente. */
export async function getSharedNotes(): Promise<SharedNote[]> {
  const me = await getSessionUser()
  if (!me) return []
  const rows = await db
    .select()
    .from(doctorNotes)
    .where(and(eq(doctorNotes.patientId, me.id), eq(doctorNotes.visibility, "shared")))
    .orderBy(desc(doctorNotes.createdAt))
    .limit(30)
  return rows.map((n) => ({ id: n.id, body: n.body, createdAt: new Date(n.createdAt) }))
}

export type AddProgressInput = {
  weightKg?: number | null
  waistCm?: number | null
  dose?: string | null
  sideEffects?: string | null
  note?: string | null
}

export async function addProgressEntry(
  input: AddProgressInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const patientId = await requireUserId()

  const weight = input.weightKg && input.weightKg > 0 ? input.weightKg : null
  const waist = input.waistCm && input.waistCm > 0 ? input.waistCm : null

  if (weight == null && waist == null && !input.dose && !input.sideEffects && !input.note?.trim()) {
    return { ok: false, error: "Añade al menos un dato para guardar el registro." }
  }
  if (weight != null && (weight < 30 || weight > 400)) {
    return { ok: false, error: "Introduce un peso válido (30–400 kg)." }
  }

  try {
    await db.insert(progressEntries).values({
      patientId,
      weightKg: weight != null ? weight.toFixed(1) : null,
      waistCm: waist != null ? waist.toFixed(1) : null,
      dose: input.dose?.trim() || null,
      sideEffects: input.sideEffects?.trim() || null,
      note: input.note?.trim() || null,
    })
    revalidatePath("/portal/progreso")
    return { ok: true }
  } catch (err) {
    console.log("[v0] addProgressEntry error:", err instanceof Error ? err.message : err)
    return { ok: false, error: "No hemos podido guardar tu registro. Inténtalo de nuevo." }
  }
}

export async function deleteProgressEntry(
  id: number,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const patientId = await requireUserId()
  try {
    // Scoping por patientId: nadie puede borrar registros ajenos.
    await db
      .delete(progressEntries)
      .where(and(eq(progressEntries.id, id), eq(progressEntries.patientId, patientId)))
    revalidatePath("/portal/progreso")
    return { ok: true }
  } catch (err) {
    console.log("[v0] deleteProgressEntry error:", err instanceof Error ? err.message : err)
    return { ok: false, error: "No hemos podido eliminar el registro." }
  }
}
