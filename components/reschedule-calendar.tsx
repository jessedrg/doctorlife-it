"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Info } from "lucide-react"
import { rescheduleAppointment } from "@/app/actions/booking"
import type { PooledSlot } from "@/lib/scheduling/types"

function formatDateLabel(iso: string) {
  const [y, m, d] = iso.split("-").map(Number)
  const date = new Date(Date.UTC(y, m - 1, d))
  const weekday = new Intl.DateTimeFormat("es-ES", { weekday: "short", timeZone: "UTC" }).format(date)
  const day = new Intl.DateTimeFormat("es-ES", { day: "numeric", timeZone: "UTC" }).format(date)
  const month = new Intl.DateTimeFormat("es-ES", { month: "short", timeZone: "UTC" }).format(date)
  return { weekday, day, month }
}

export function RescheduleCalendar({
  appointmentId,
  kind,
  doctorName,
  slots,
}: {
  appointmentId: number
  kind: "first" | "followup"
  doctorName: string | null
  slots: PooledSlot[]
}) {
  const dates = useMemo(() => {
    const map = new Map<string, PooledSlot[]>()
    for (const s of slots) {
      const list = map.get(s.date) ?? []
      list.push(s)
      map.set(s.date, list)
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  }, [slots])

  const router = useRouter()
  const [activeDate, setActiveDate] = useState<string | null>(dates[0]?.[0] ?? null)
  const [pendingStart, setPendingStart] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const activeSlots = dates.find(([d]) => d === activeDate)?.[1] ?? []

  async function pick(startUtc: string) {
    setError(null)
    setPendingStart(startUtc)
    try {
      const result = await rescheduleAppointment(appointmentId, startUtc)
      if ("ok" in result) {
        router.push("/portal/citas?reprogramada=1")
        return
      }
      setError(result.error)
    } catch {
      setError("No se pudo reprogramar. Inténtalo de nuevo.")
    }
    setPendingStart(null)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Nota según el tipo de cita */}
      <div className="flex items-start gap-2.5 rounded-2xl border border-ink/10 bg-paper p-4">
        <Info className="mt-0.5 size-4.5 shrink-0 text-sage" aria-hidden />
        <p className="text-sm leading-relaxed text-ink/70">
          {kind === "followup"
            ? `Tu videollamada de seguimiento se mantendrá con ${
                doctorName ? `tu médico, ${doctorName}` : "tu médico asignado"
              }. Elige una de sus horas disponibles.`
            : "Elige la hora que mejor te venga. Se te asignará un médico disponible para ese horario, que puede ser distinto al anterior."}
        </p>
      </div>

      {dates.length === 0 ? (
        <div className="rounded-2xl border border-ink/10 bg-paper p-8 text-center">
          <p className="text-pretty text-ink/70">
            {kind === "followup"
              ? "Tu médico no tiene huecos disponibles ahora mismo. Vuelve a intentarlo más tarde."
              : "Ahora mismo no hay huecos disponibles. Vuelve a intentarlo más tarde."}
          </p>
        </div>
      ) : (
        <>
          {/* Selector de día */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {dates.map(([d]) => {
              const { weekday, day, month } = formatDateLabel(d)
              const active = d === activeDate
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setActiveDate(d)}
                  className={`flex min-w-16 flex-col items-center gap-0.5 rounded-xl border px-3 py-2 transition-colors ${
                    active
                      ? "border-sage bg-sage text-paper"
                      : "border-ink/10 bg-paper text-ink hover:border-sage/50"
                  }`}
                >
                  <span className="text-xs capitalize opacity-80">{weekday}</span>
                  <span className="text-lg font-semibold leading-none">{day}</span>
                  <span className="text-xs capitalize opacity-80">{month}</span>
                </button>
              )
            })}
          </div>

          {/* Huecos del día */}
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {activeSlots.map((s) => (
              <button
                key={s.startUtc}
                type="button"
                disabled={pendingStart !== null}
                onClick={() => pick(s.startUtc)}
                className="rounded-xl border border-ink/10 bg-paper px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:border-sage hover:bg-sage/10 disabled:opacity-50"
                title={kind === "first" ? `Con ${s.doctorName}` : undefined}
              >
                {pendingStart === s.startUtc ? "..." : s.label}
              </button>
            ))}
          </div>
        </>
      )}

      {error ? (
        <p role="alert" className="text-sm text-clay">
          {error}
        </p>
      ) : null}
    </div>
  )
}
