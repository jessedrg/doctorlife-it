"use client"

import { useMemo, useState } from "react"
import type { PooledSlot } from "@/lib/scheduling/types"

const WEEKDAY_LABELS = ["L", "M", "X", "J", "V", "S", "D"]
const MONTH_FORMAT = new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric" })
const FULL_DATE_FORMAT = new Intl.DateTimeFormat("es-ES", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "UTC",
})

/** "YYYY-MM-DD" -> Date en UTC (medianoche) para cálculos de calendario. */
function isoToUtcDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

/** Date local -> "YYYY-MM-DD" usando componentes locales. */
function localKey(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

/** Índice de columna (lunes = 0 … domingo = 6) para una fecha UTC. */
function mondayIndex(date: Date) {
  return (date.getUTCDay() + 6) % 7
}

export interface SchedulerCalendarProps {
  slots: PooledSlot[]
  onSelect: (slot: PooledSlot) => void
  /** startUtc del hueco en proceso de reserva (muestra estado de carga). */
  pendingStart?: string | null
  /** Mensaje de error a mostrar bajo la lista de horas. */
  error?: string | null
  /** Texto auxiliar opcional bajo el calendario. */
  footnote?: string
}

export function SchedulerCalendar({
  slots,
  onSelect,
  pendingStart,
  error,
  footnote,
}: SchedulerCalendarProps) {
  // Agrupar huecos por fecha local "YYYY-MM-DD".
  const slotsByDate = useMemo(() => {
    const map = new Map<string, PooledSlot[]>()
    for (const s of slots) {
      const list = map.get(s.date) ?? []
      list.push(s)
      map.set(s.date, list)
    }
    for (const list of map.values()) {
      list.sort((a, b) => a.startUtc.localeCompare(b.startUtc))
    }
    return map
  }, [slots])

  const availableDates = useMemo(
    () => [...slotsByDate.keys()].sort((a, b) => a.localeCompare(b)),
    [slotsByDate],
  )

  const firstAvailable = availableDates[0] ?? null
  const [selectedDate, setSelectedDate] = useState<string | null>(firstAvailable)

  // Mes mostrado en la cuadrícula (comienza en el primer día disponible).
  const [viewMonth, setViewMonth] = useState(() => {
    const base = firstAvailable ? isoToUtcDate(firstAvailable) : new Date()
    return { year: base.getUTCFullYear(), month: base.getUTCMonth() }
  })

  const activeSlots = selectedDate ? (slotsByDate.get(selectedDate) ?? []) : []

  // Construir la cuadrícula del mes actual.
  const calendarCells = useMemo(() => {
    const firstOfMonth = new Date(Date.UTC(viewMonth.year, viewMonth.month, 1))
    const daysInMonth = new Date(Date.UTC(viewMonth.year, viewMonth.month + 1, 0)).getUTCDate()
    const leadingBlanks = mondayIndex(firstOfMonth)
    const cells: ({ iso: string; day: number } | null)[] = []
    for (let i = 0; i < leadingBlanks; i++) cells.push(null)
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(Date.UTC(viewMonth.year, viewMonth.month, day))
      cells.push({ iso: localKey(date), day })
    }
    return cells
  }, [viewMonth])

  const monthLabel = MONTH_FORMAT.format(new Date(Date.UTC(viewMonth.year, viewMonth.month, 1)))

  const todayKey = localKey(new Date())

  function shiftMonth(delta: number) {
    setViewMonth((prev) => {
      const next = new Date(Date.UTC(prev.year, prev.month + delta, 1))
      return { year: next.getUTCFullYear(), month: next.getUTCMonth() }
    })
  }

  // ¿Hay huecos en meses anteriores/posteriores al visible? (para deshabilitar flechas)
  const monthStartKey = localKey(new Date(Date.UTC(viewMonth.year, viewMonth.month, 1)))
  const monthEndKey = localKey(new Date(Date.UTC(viewMonth.year, viewMonth.month + 1, 0)))
  const hasPrev = availableDates.some((d) => d < monthStartKey)
  const hasNext = availableDates.some((d) => d > monthEndKey)

  if (availableDates.length === 0) {
    return (
      <div className="rounded-2xl border border-ink/10 bg-paper p-8 text-center">
        <p className="text-pretty text-ink/70">
          Ahora mismo no hay huecos disponibles. Vuelve a intentarlo más tarde.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-5 md:grid-cols-[1fr_minmax(0,260px)] md:items-stretch">
        {/* ── Calendario del mes ── */}
        <div className="rounded-2xl border border-ink/10 bg-paper p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-medium capitalize text-ink">{monthLabel}</h3>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => shiftMonth(-1)}
                disabled={!hasPrev}
                aria-label="Mes anterior"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink/10 text-ink transition-colors hover:bg-cream disabled:cursor-not-allowed disabled:opacity-30"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => shiftMonth(1)}
                disabled={!hasNext}
                aria-label="Mes siguiente"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink/10 text-ink transition-colors hover:bg-cream disabled:cursor-not-allowed disabled:opacity-30"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-1">
            {WEEKDAY_LABELS.map((w, i) => (
              <div key={`${w}-${i}`} className="pb-1 text-center text-xs font-medium text-ink/40">
                {w}
              </div>
            ))}
            {calendarCells.map((cell, i) => {
              if (!cell) return <div key={`blank-${i}`} aria-hidden="true" />
              const hasSlots = slotsByDate.has(cell.iso)
              const isSelected = cell.iso === selectedDate
              const isToday = cell.iso === todayKey
              return (
                <button
                  key={cell.iso}
                  type="button"
                  disabled={!hasSlots}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedDate(cell.iso)}
                  className={[
                    "relative flex aspect-square items-center justify-center rounded-lg text-sm transition-colors",
                    isSelected
                      ? "bg-olive font-semibold text-paper"
                      : hasSlots
                        ? "bg-sage/30 font-medium text-ink hover:bg-sage/60"
                        : "text-ink/25",
                    !hasSlots ? "cursor-not-allowed" : "cursor-pointer",
                  ].join(" ")}
                >
                  {cell.day}
                  {isToday && !isSelected ? (
                    <span className="absolute bottom-1 h-1 w-1 rounded-full bg-amber" aria-hidden="true" />
                  ) : null}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Columna de horas ── */}
        <div className="flex flex-col rounded-2xl border border-ink/10 bg-paper p-4 sm:p-5">
          <p className="text-[13px] font-medium capitalize text-ink">
            {selectedDate ? FULL_DATE_FORMAT.format(isoToUtcDate(selectedDate)) : "Elige un día"}
          </p>
          <div className="mt-3 flex max-h-72 flex-col gap-2 overflow-y-auto md:max-h-[19rem]">
            {activeSlots.length === 0 ? (
              <p className="py-6 text-center text-sm text-ink/50">Sin horas disponibles este día.</p>
            ) : (
              activeSlots.map((s) => {
                const isPending = pendingStart === s.startUtc
                return (
                  <button
                    key={s.startUtc}
                    type="button"
                    disabled={pendingStart != null}
                    onClick={() => onSelect(s)}
                    title={`Con ${s.doctorName}`}
                    className="w-full rounded-xl border border-olive/30 bg-warm px-3 py-2.5 text-center text-sm font-medium text-ink transition-colors hover:border-olive hover:bg-olive hover:text-paper disabled:opacity-50"
                  >
                    {isPending ? "Reservando…" : s.label}
                  </button>
                )
              })
            )}
          </div>
        </div>
      </div>

      {error ? (
        <p role="alert" className="text-sm text-clay">
          {error}
        </p>
      ) : null}

      {footnote ? <p className="text-xs leading-relaxed text-ink/50">{footnote}</p> : null}
    </div>
  )
}
