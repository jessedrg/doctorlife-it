"use server"

import { db } from "@/lib/db"
import { doctorProfiles } from "@/lib/db/schema"
import { getSessionUser } from "@/lib/session"
import { scheduling, type WeeklyRule } from "@/lib/scheduling"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

async function requireDoctorId() {
  const user = await getSessionUser()
  if (!user || user.role !== "doctor") throw new Error("Unauthorized")
  return user.id
}

/** Disponibilidad + ajustes del médico actual. */
export async function getMyAvailability() {
  const userId = await requireDoctorId()
  const [profile] = await db
    .select()
    .from(doctorProfiles)
    .where(eq(doctorProfiles.userId, userId))

  const [rules, exceptions] = await Promise.all([
    scheduling.getWeeklyRules(userId),
    scheduling.getExceptions(userId),
  ])

  return {
    rules,
    exceptions,
    slotMinutes: profile?.slotMinutes ?? 30,
    timezone: profile?.timezone ?? "Europe/Madrid",
  }
}

/** Reemplaza por completo las reglas semanales del médico. */
export async function saveWeeklyRules(rules: WeeklyRule[]) {
  const userId = await requireDoctorId()

  // Validación básica en servidor.
  for (const r of rules) {
    if (r.dayOfWeek < 0 || r.dayOfWeek > 6) throw new Error("Día inválido")
    if (r.startMinute < 0 || r.endMinute > 24 * 60) throw new Error("Hora inválida")
    if (r.endMinute <= r.startMinute) throw new Error("El fin debe ser posterior al inicio")
  }

  await scheduling.setWeeklyRules(userId, rules)
  revalidatePath("/clinica/disponibilidad")
  return { ok: true }
}

/** Ajustes de la agenda (duración de cita y zona horaria). */
export async function updateScheduleSettings(input: { slotMinutes: number; timezone: string }) {
  const userId = await requireDoctorId()
  const slot = Math.max(10, Math.min(120, Math.round(input.slotMinutes)))
  await db
    .update(doctorProfiles)
    .set({ slotMinutes: slot, timezone: input.timezone, updatedAt: new Date() })
    .where(eq(doctorProfiles.userId, userId))
  revalidatePath("/clinica/disponibilidad")
  return { ok: true }
}

export async function addBlockedDate(date: string) {
  const userId = await requireDoctorId()
  const existing = await scheduling.getExceptions(userId)
  if (!existing.includes(date)) await scheduling.addException(userId, date)
  revalidatePath("/clinica/disponibilidad")
  return { ok: true }
}

export async function removeBlockedDate(date: string) {
  const userId = await requireDoctorId()
  await scheduling.removeException(userId, date)
  revalidatePath("/clinica/disponibilidad")
  return { ok: true }
}

/** Vista previa de huecos para los próximos `days` días (para el médico). */
export async function previewMySlots(days = 14) {
  const userId = await requireDoctorId()
  const from = new Date()
  const to = new Date(from.getTime() + days * 24 * 60 * 60 * 1000)
  return scheduling.getAvailableSlots(userId, { from, to })
}
