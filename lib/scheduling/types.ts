/**
 * Abstracción de agenda. Hoy se implementa con una agenda nativa en Neon,
 * pero esta interfaz permite cambiar a Cal.com Platform (u otro proveedor)
 * sin tocar el resto de la app.
 */

/** Regla de disponibilidad semanal recurrente. */
export interface WeeklyRule {
  /** 0 = domingo … 6 = sábado */
  dayOfWeek: number
  /** Minutos desde medianoche, hora local del médico */
  startMinute: number
  endMinute: number
}

/** Un hueco concreto reservable. */
export interface Slot {
  /** Instante UTC de inicio en ISO 8601 */
  startUtc: string
  /** Instante UTC de fin en ISO 8601 */
  endUtc: string
  /** Etiqueta legible en la zona horaria del médico, p.ej. "09:30" */
  label: string
  /** Fecha local del médico, "YYYY-MM-DD" */
  date: string
}

export interface SlotRange {
  /** Inicio del rango (inclusive) */
  from: Date
  /** Fin del rango (exclusive) */
  to: Date
}

/** Hueco combinado del conjunto de médicos: incluye qué médico lo ofrece. */
export interface PooledSlot extends Slot {
  doctorId: string
  doctorName: string
}

export interface SchedulingProvider {
  getWeeklyRules(doctorUserId: string): Promise<WeeklyRule[]>
  setWeeklyRules(doctorUserId: string, rules: WeeklyRule[]): Promise<void>
  getExceptions(doctorUserId: string): Promise<string[]>
  addException(doctorUserId: string, date: string): Promise<void>
  removeException(doctorUserId: string, date: string): Promise<void>
  /**
   * Devuelve los huecos libres del médico en el rango dado.
   * `takenStartUtc` son instantes ISO ya ocupados por otras citas.
   */
  getAvailableSlots(
    doctorUserId: string,
    range: SlotRange,
    takenStartUtc?: Set<string>,
  ): Promise<Slot[]>
}
