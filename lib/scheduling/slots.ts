import type { Slot, SlotRange, WeeklyRule } from "./types"

/**
 * Desfase (ms) entre la hora de pared en `timeZone` y UTC para un instante dado.
 * Sin dependencias y a prueba de DST gracias a Intl.
 */
function tzOffsetMs(timeZone: string, date: Date): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
  const parts = dtf.formatToParts(date)
  const map: Record<string, number> = {}
  for (const p of parts) if (p.type !== "literal") map[p.type] = Number(p.value)
  // Intl devuelve hour 24 en medianoche en algunos motores
  const hour = map.hour === 24 ? 0 : map.hour
  const asUTC = Date.UTC(map.year, map.month - 1, map.day, hour, map.minute, map.second)
  return asUTC - date.getTime()
}

/** Convierte una hora de pared local (en `timeZone`) al instante UTC correcto. */
function zonedToUtc(
  year: number,
  month: number,
  day: number,
  minutes: number,
  timeZone: string,
): Date {
  const hour = Math.floor(minutes / 60)
  const minute = minutes % 60
  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute))
  const offset = tzOffsetMs(timeZone, utcGuess)
  let result = new Date(utcGuess.getTime() - offset)
  // Una segunda pasada corrige los bordes de cambio de hora (DST).
  const offset2 = tzOffsetMs(timeZone, result)
  if (offset2 !== offset) result = new Date(utcGuess.getTime() - offset2)
  return result
}

/** Componentes de fecha (año/mes/día/díaSemana) de un instante en una zona. */
function datePartsInTz(date: Date, timeZone: string) {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  })
  const map: Record<string, string> = {}
  for (const p of dtf.formatToParts(date)) map[p.type] = p.value
  const weekdays: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  }
  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    dayOfWeek: weekdays[map.weekday] ?? 0,
    iso: `${map.year}-${map.month}-${map.day}`,
  }
}

function pad(n: number) {
  return n.toString().padStart(2, "0")
}

/**
 * Genera los huecos libres a partir de reglas semanales, dentro de `range`,
 * descartando fechas bloqueadas, huecos en el pasado y los ya ocupados.
 */
export function generateSlots(opts: {
  rules: WeeklyRule[]
  exceptions: Set<string>
  range: SlotRange
  slotMinutes: number
  timeZone: string
  takenStartUtc?: Set<string>
  now?: Date
}): Slot[] {
  const { rules, exceptions, range, slotMinutes, timeZone } = opts
  const taken = opts.takenStartUtc ?? new Set<string>()
  const now = opts.now ?? new Date()
  if (rules.length === 0 || slotMinutes <= 0) return []

  const rulesByDay = new Map<number, WeeklyRule[]>()
  for (const r of rules) {
    const list = rulesByDay.get(r.dayOfWeek) ?? []
    list.push(r)
    rulesByDay.set(r.dayOfWeek, list)
  }

  const slots: Slot[] = []
  // Evita huecos duplicados cuando dos franjas del mismo día se solapan.
  const seen = new Set<string>()
  // Iteramos día a día por el calendario local del médico.
  const cursor = new Date(range.from.getTime())
  // Normalizamos al inicio del día en UTC para no saltarnos días por horas.
  cursor.setUTCHours(0, 0, 0, 0)

  let guard = 0
  while (cursor.getTime() < range.to.getTime() && guard < 400) {
    guard++
    const parts = datePartsInTz(cursor, timeZone)
    cursor.setUTCDate(cursor.getUTCDate() + 1)

    if (exceptions.has(parts.iso)) continue
    const dayRules = rulesByDay.get(parts.dayOfWeek)
    if (!dayRules) continue

    for (const rule of dayRules) {
      for (let m = rule.startMinute; m + slotMinutes <= rule.endMinute; m += slotMinutes) {
        const startUtc = zonedToUtc(parts.year, parts.month, parts.day, m, timeZone)
        if (startUtc.getTime() < now.getTime()) continue
        if (startUtc.getTime() < range.from.getTime()) continue
        if (startUtc.getTime() >= range.to.getTime()) continue
        const iso = startUtc.toISOString()
        if (taken.has(iso)) continue
        if (seen.has(iso)) continue
        seen.add(iso)
        const endUtc = new Date(startUtc.getTime() + slotMinutes * 60_000)
        slots.push({
          startUtc: iso,
          endUtc: endUtc.toISOString(),
          label: `${pad(Math.floor(m / 60))}:${pad(m % 60)}`,
          date: parts.iso,
        })
      }
    }
  }

  slots.sort((a, b) => a.startUtc.localeCompare(b.startUtc))
  return slots
}
