"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { createIncludedBooking } from "@/app/actions/booking"
import type { PooledSlot } from "@/lib/scheduling/types"

function formatDateLabel(iso: string) {
  // iso = "YYYY-MM-DD"
  const [y, m, d] = iso.split("-").map(Number)
  const date = new Date(Date.UTC(y, m - 1, d))
  const weekday = new Intl.DateTimeFormat("es-ES", { weekday: "short", timeZone: "UTC" }).format(date)
  const day = new Intl.DateTimeFormat("es-ES", { day: "numeric", timeZone: "UTC" }).format(date)
  const month = new Intl.DateTimeFormat("es-ES", { month: "short", timeZone: "UTC" }).format(date)
  return { weekday, day, month }
}

export function BookingCalendar({ slots }: { slots: PooledSlot[] }) {
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

  async function book(startUtc: string) {
    setError(null)
    setPendingStart(startUtc)
    try {
      const result = await createIncludedBooking(startUtc)
      if ("ok" in result) {
        router.push("/portal/citas?reservada=1")
        return
      }
      setError(result.error)
    } catch {
      setError("No se pudo completar la reserva. Inténtalo de nuevo.")
    }
    setPendingStart(null)
  }

  if (dates.length === 0) {
    return (
      <div className="rounded-2xl border border-ink/10 bg-paper p-8 text-center">
        <p className="text-[15px] font-medium text-ink">No hay horas disponibles ahora mismo</p>
        <p className="mx-auto mt-2 max-w-[42ch] text-pretty text-[14px] leading-relaxed text-ink/70">
          Escríbenos por WhatsApp y te buscamos una disponibilidad en menos de 24&nbsp;h.
        </p>
        <a
          href={`https://wa.me/34711267223?text=${encodeURIComponent("Hola, soy paciente de DoctorLife y me gustaría reservar una videollamada de seguimiento pero no hay horas disponibles.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5 fill-white" aria-hidden="true">
            <path d="M24 4C13 4 4 13 4 24c0 3.6 1 7 2.7 9.9L4 44l10.4-2.7C17 43 20.4 44 24 44c11 0 20-9 20-20S35 4 24 4zm0 36c-3.1 0-6.1-.8-8.7-2.3l-.6-.4-6.2 1.6 1.7-6-.4-.6C8.3 30 7.5 27.1 7.5 24 7.5 14.8 15 7.5 24 7.5S40.5 15 40.5 24 33 40 24 40zm10.8-13.4c-.6-.3-3.4-1.7-3.9-1.9-.5-.2-.9-.3-1.2.3-.4.6-1.4 1.9-1.7 2.2-.3.4-.6.4-1.1.1-.6-.3-2.4-.9-4.6-2.8-1.7-1.5-2.8-3.4-3.2-3.9-.3-.6 0-.9.3-1.1l.9-1.1c.2-.3.3-.6.5-.9.2-.3.1-.6 0-.9-.1-.2-1.2-2.9-1.6-3.9-.4-1-.8-.9-1.2-.9h-1c-.3 0-.9.1-1.4.7-.5.5-1.8 1.8-1.8 4.3s1.9 5 2.1 5.4c.3.3 3.7 5.7 9 8 1.3.5 2.3.8 3 1.1 1.3.4 2.4.3 3.3.2 1-.2 3.1-1.3 3.5-2.5.4-1.2.4-2.2.3-2.5-.1-.3-.5-.4-1-.7z" />
          </svg>
          Escríbenos por WhatsApp
        </a>
        <p className="mt-3 text-[12px] text-ink/50">
          O escríbenos a{" "}
          <a href="mailto:hola@doctorlife.app" className="underline underline-offset-2 hover:text-ink/80">
            hola@doctorlife.app
          </a>
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
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
        {activeSlots.map((s) => {
          const isThisLoading = pendingStart === s.startUtc
          const isOtherLoading = pendingStart !== null && pendingStart !== s.startUtc
          return (
            <button
              key={s.startUtc}
              type="button"
              disabled={pendingStart !== null}
              onClick={() => book(s.startUtc)}
              className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                isThisLoading
                  ? "border-sage bg-sage/20 text-ink"
                  : isOtherLoading
                  ? "border-ink/8 bg-paper text-ink/40"
                  : "border-ink/10 bg-paper text-ink hover:border-sage hover:bg-sage/10"
              }`}
              title={`Con ${s.doctorName}`}
            >
              {isThisLoading ? "Reservando…" : s.label}
            </button>
          )
        })}
      </div>

      {error ? (
        <p role="alert" className="text-sm text-clay">
          {error}
        </p>
      ) : null}

      <p className="text-xs text-ink/50">
        Tu videollamada de seguimiento está incluida en tu suscripción. Se te asignará tu endocrino o,
        si no tiene hueco, otro médico disponible para la hora elegida.
      </p>
    </div>
  )
}
