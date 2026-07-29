import { db } from "@/lib/db"
import { doctorAvailability, availabilityExceptions, doctorProfiles } from "@/lib/db/schema"
import { and, eq } from "drizzle-orm"
import { generateSlots } from "./slots"
import type { SchedulingProvider, SlotRange, WeeklyRule } from "./types"

/**
 * Agenda nativa respaldada por Neon. Todas las queries se escalan por `userId`
 * (no hay RLS en Neon). Implementa la misma interfaz que usaría Cal.com.
 */
export const nativeScheduling: SchedulingProvider = {
  async getWeeklyRules(doctorUserId) {
    const rows = await db
      .select()
      .from(doctorAvailability)
      .where(eq(doctorAvailability.userId, doctorUserId))
    return rows.map((r) => ({
      dayOfWeek: r.dayOfWeek,
      startMinute: r.startMinute,
      endMinute: r.endMinute,
    }))
  },

  async setWeeklyRules(doctorUserId, rules) {
    // Reemplazo completo: borramos las reglas del médico e insertamos las nuevas.
    await db.delete(doctorAvailability).where(eq(doctorAvailability.userId, doctorUserId))
    const clean = rules.filter((r) => r.endMinute > r.startMinute && r.dayOfWeek >= 0 && r.dayOfWeek <= 6)
    if (clean.length > 0) {
      await db.insert(doctorAvailability).values(
        clean.map((r) => ({
          userId: doctorUserId,
          dayOfWeek: r.dayOfWeek,
          startMinute: r.startMinute,
          endMinute: r.endMinute,
        })),
      )
    }
  },

  async getExceptions(doctorUserId) {
    const rows = await db
      .select()
      .from(availabilityExceptions)
      .where(eq(availabilityExceptions.userId, doctorUserId))
    return rows.map((r) => r.date)
  },

  async addException(doctorUserId, date) {
    await db.insert(availabilityExceptions).values({ userId: doctorUserId, date })
  },

  async removeException(doctorUserId, date) {
    await db
      .delete(availabilityExceptions)
      .where(
        and(eq(availabilityExceptions.userId, doctorUserId), eq(availabilityExceptions.date, date)),
      )
  },

  async getAvailableSlots(doctorUserId, range: SlotRange, takenStartUtc) {
    const [profile] = await db
      .select()
      .from(doctorProfiles)
      .where(eq(doctorProfiles.userId, doctorUserId))
    if (!profile) return []

    const rules: WeeklyRule[] = await this.getWeeklyRules(doctorUserId)
    const exceptions = new Set(await this.getExceptions(doctorUserId))

    return generateSlots({
      rules,
      exceptions,
      range,
      slotMinutes: profile.slotMinutes,
      timeZone: profile.timezone,
      takenStartUtc,
    })
  },
}
