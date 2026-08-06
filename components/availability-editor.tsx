"use client"

import { useState, useTransition } from "react"
import {
  saveWeeklyRules,
  updateScheduleSettings,
  addBlockedDate,
  removeBlockedDate,
  previewMySlots,
} from "@/app/actions/availability"
import type { Slot, WeeklyRule } from "@/lib/scheduling"
import { Clock, Globe, Plus, X, CalendarOff, Check, Eye, CalendarRange } from "lucide-react"

const DAYS = [
  { dow: 1, label: "Lunedì" },
  { dow: 2, label: "Martedì" },
  { dow: 3, label: "Mercoledì" },
  { dow: 4, label: "Giovedì" },
  { dow: 5, label: "Venerdì" },
  { dow: 6, label: "Sabato" },
  { dow: 0, label: "Domenica" },
]

const TIMEZONES = [
  "Europe/Rome",
  "Europe/London",
  "Europe/Madrid",
  "Europe/Lisbon",
]

type Window = { start: string; end: string }
type DayState = { enabled: boolean; windows: Window[] }

function minutesToTime(min: number) {
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
}

function timeToMinutes(t: string) {
  const [h, m] = t.split(":").map(Number)
  return h * 60 + m
}

const DEFAULT_WINDOW: Window = { start: "09:00", end: "17:00" }

export function AvailabilityEditor({
  initialRules,
  initialExceptions,
  initialSlotMinutes,
  initialTimezone,
}: {
  initialRules: WeeklyRule[]
  initialExceptions: string[]
  initialSlotMinutes: number
  initialTimezone: string
}) {
  // Varias franjas por día: agrupamos todas las reglas del mismo día.
  const initialDays: Record<number, DayState> = {}
  for (const { dow } of DAYS) {
    const dayRules = initialRules
      .filter((r) => r.dayOfWeek === dow)
      .sort((a, b) => a.startMinute - b.startMinute)
    initialDays[dow] = dayRules.length
      ? {
          enabled: true,
          windows: dayRules.map((r) => ({
            start: minutesToTime(r.startMinute),
            end: minutesToTime(r.endMinute),
          })),
        }
      : { enabled: false, windows: [{ ...DEFAULT_WINDOW }] }
  }

  const [days, setDays] = useState<Record<number, DayState>>(initialDays)
  const [slotMinutes, setSlotMinutes] = useState(initialSlotMinutes)
  const [timezone, setTimezone] = useState(initialTimezone)
  const [exceptions, setExceptions] = useState<string[]>(initialExceptions)
  const [newDate, setNewDate] = useState("")
  const [slots, setSlots] = useState<Slot[] | null>(null)
  const [saved, setSaved] = useState(false)
  const [pending, startTransition] = useTransition()

  function toggleDay(dow: number, enabled: boolean) {
    setDays((d) => ({
      ...d,
      [dow]: {
        enabled,
        windows: d[dow].windows.length ? d[dow].windows : [{ ...DEFAULT_WINDOW }],
      },
    }))
    setSaved(false)
  }

  function setWindow(dow: number, index: number, patch: Partial<Window>) {
    setDays((d) => {
      const windows = d[dow].windows.map((w, i) => (i === index ? { ...w, ...patch } : w))
      return { ...d, [dow]: { ...d[dow], windows } }
    })
    setSaved(false)
  }

  function addWindow(dow: number) {
    setDays((d) => {
      // La nueva franja empieza una hora después del fin de la última.
      const last = d[dow].windows[d[dow].windows.length - 1]
      const startMin = last ? Math.min(timeToMinutes(last.end) + 60, 22 * 60) : 9 * 60
      const next: Window = {
        start: minutesToTime(startMin),
        end: minutesToTime(Math.min(startMin + 60, 23 * 60 + 59)),
      }
      return { ...d, [dow]: { ...d[dow], windows: [...d[dow].windows, next] } }
    })
    setSaved(false)
  }

  function removeWindow(dow: number, index: number) {
    setDays((d) => {
      const windows = d[dow].windows.filter((_, i) => i !== index)
      return {
        ...d,
        [dow]: windows.length
          ? { ...d[dow], windows }
          : { enabled: false, windows: [{ ...DEFAULT_WINDOW }] },
      }
    })
    setSaved(false)
  }

  function handleSave() {
    const rules: WeeklyRule[] = DAYS.filter(({ dow }) => days[dow].enabled).flatMap(({ dow }) =>
      days[dow].windows.map((w) => ({
        dayOfWeek: dow,
        startMinute: timeToMinutes(w.start),
        endMinute: timeToMinutes(w.end),
      })),
    )
    startTransition(async () => {
      await updateScheduleSettings({ slotMinutes, timezone })
      await saveWeeklyRules(rules)
      setSaved(true)
      setSlots(null)
    })
  }

  function handleAddDate() {
    if (!newDate) return
    startTransition(async () => {
      await addBlockedDate(newDate)
      setExceptions((e) => [...e, newDate].sort())
      setNewDate("")
    })
  }

  function handleRemoveDate(date: string) {
    startTransition(async () => {
      await removeBlockedDate(date)
      setExceptions((e) => e.filter((d) => d !== date))
    })
  }

  function handlePreview() {
    startTransition(async () => {
      const result = await previewMySlots(14)
      setSlots(result)
    })
  }

  const slotsByDate = (slots ?? []).reduce<Record<string, Slot[]>>((acc, s) => {
    ;(acc[s.date] ??= []).push(s)
    return acc
  }, {})

  const activeDays = DAYS.filter(({ dow }) => days[dow].enabled).length

  return (
    <div className="flex flex-col gap-6">
      {/* Ajustes generales */}
      <section className="overflow-hidden rounded-2xl border border-ink/10 bg-warm">
        <div className="border-b border-ink/10 px-5 py-3.5">
          <h2 className="text-[15.5px] font-medium text-ink">Impostazioni</h2>
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-[13px] font-medium text-ink-soft">
            <span className="flex items-center gap-1.5">
              <Clock className="size-4 text-ink-mute" aria-hidden /> Durata appuntamento
            </span>
            <select
              value={slotMinutes}
              onChange={(e) => {
                setSlotMinutes(Number(e.target.value))
                setSaved(false)
              }}
              className="rounded-xl border border-ink/15 bg-paper px-3 py-2.5 text-[14px] text-ink outline-none focus:border-ink/30"
            >
              {[15, 20, 30, 45, 60].map((m) => (
                <option key={m} value={m}>
                  {m} minuti
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-[13px] font-medium text-ink-soft">
            <span className="flex items-center gap-1.5">
              <Globe className="size-4 text-ink-mute" aria-hidden /> Fuso orario
            </span>
            <select
              value={timezone}
              onChange={(e) => {
                setTimezone(e.target.value)
                setSaved(false)
              }}
              className="rounded-xl border border-ink/15 bg-paper px-3 py-2.5 text-[14px] text-ink outline-none focus:border-ink/30"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {/* Horario semanal */}
      <section className="overflow-hidden rounded-2xl border border-ink/10 bg-warm">
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-3.5">
          <h2 className="flex items-center gap-2 text-[15.5px] font-medium text-ink">
            <CalendarRange className="size-4.5 text-amber" aria-hidden /> Orario settimanale
          </h2>
          <span className="rounded-full bg-sage/30 px-2.5 py-1 text-[12px] font-medium text-ink">
            {activeDays} {activeDays === 1 ? "giorno attivo" : "giorni attivi"}
          </span>
        </div>
        <div className="flex flex-col divide-y divide-ink/8">
          {DAYS.map(({ dow, label }) => {
            const d = days[dow]
            return (
              <div
                key={dow}
                className={`flex flex-col gap-3 px-5 py-4 transition-colors sm:flex-row sm:items-start sm:gap-5 ${
                  d.enabled ? "bg-paper/40" : ""
                }`}
              >
                {/* Toggle día */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={d.enabled}
                  onClick={() => toggleDay(dow, !d.enabled)}
                  className="flex w-36 shrink-0 items-center gap-2.5 text-left"
                >
                  <span
                    className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                      d.enabled ? "bg-olive" : "bg-ink/15"
                    }`}
                  >
                    <span
                      className={`inline-block size-4 transform rounded-full bg-paper shadow transition-transform ${
                        d.enabled ? "translate-x-4" : "translate-x-0.5"
                      }`}
                    />
                  </span>
                  <span className={`text-[14.5px] font-medium ${d.enabled ? "text-ink" : "text-ink-mute"}`}>
                    {label}
                  </span>
                </button>

                {d.enabled ? (
                  <div className="flex flex-1 flex-col gap-2">
                    {d.windows.map((w, i) => (
                      <div key={i} className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-2 rounded-xl border border-ink/12 bg-paper px-2.5 py-1.5">
                          <input
                            type="time"
                            value={w.start}
                            onChange={(e) => setWindow(dow, i, { start: e.target.value })}
                            className="bg-transparent text-[14px] text-ink outline-none"
                          />
                          <span className="text-ink-mute">–</span>
                          <input
                            type="time"
                            value={w.end}
                            onChange={(e) => setWindow(dow, i, { end: e.target.value })}
                            className="bg-transparent text-[14px] text-ink outline-none"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeWindow(dow, i)}
                          aria-label={`Rimuovi fascia ${i + 1} di ${label}`}
                          className="flex size-9 items-center justify-center rounded-xl border border-ink/12 text-ink-soft transition-colors hover:bg-clay/10 hover:text-clay"
                        >
                          <X className="size-4" aria-hidden />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addWindow(dow)}
                      className="flex w-fit items-center gap-1.5 rounded-lg px-1 py-1 text-[13.5px] font-medium text-olive transition-colors hover:text-ink"
                    >
                      <Plus className="size-4" aria-hidden /> Aggiungi fascia
                    </button>
                  </div>
                ) : (
                  <span className="flex-1 pt-0.5 text-[13.5px] text-ink-mute">Non disponibile</span>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Días bloqueados */}
      <section className="overflow-hidden rounded-2xl border border-ink/10 bg-warm">
        <div className="border-b border-ink/10 px-5 py-3.5">
          <h2 className="flex items-center gap-2 text-[15.5px] font-medium text-ink">
            <CalendarOff className="size-4.5 text-clay" aria-hidden /> Giorni bloccati
          </h2>
          <p className="mt-0.5 text-[13px] text-ink-soft">Ferie o festività in cui non ricevi.</p>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="rounded-xl border border-ink/15 bg-paper px-3 py-2.5 text-[14px] text-ink outline-none focus:border-ink/30"
            />
            <button
              type="button"
              onClick={handleAddDate}
              disabled={pending || !newDate}
              className="rounded-xl bg-ink px-4 py-2.5 text-[14px] font-medium text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              Blocca
            </button>
          </div>
          {exceptions.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {exceptions.map((date) => (
                <li
                  key={date}
                  className="flex items-center gap-2 rounded-full border border-clay/30 bg-clay/10 px-3 py-1.5 text-[13.5px] text-ink"
                >
                  {date}
                  <button
                    type="button"
                    onClick={() => handleRemoveDate(date)}
                    aria-label={`Rimuovi ${date}`}
                    className="text-clay transition-colors hover:text-ink"
                  >
                    <X className="size-3.5" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Acciones */}
      <div className="sticky bottom-3 z-10 flex flex-wrap items-center gap-3 rounded-2xl border border-ink/10 bg-paper/90 p-3 backdrop-blur">
        <button
          type="button"
          onClick={handleSave}
          disabled={pending}
          className="rounded-xl bg-olive px-6 py-3 text-[14px] font-semibold text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Salvataggio…" : "Salva disponibilità"}
        </button>
        <button
          type="button"
          onClick={handlePreview}
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-xl border border-ink/15 px-6 py-3 text-[14px] font-medium text-ink transition-colors hover:bg-warm disabled:opacity-50"
        >
          <Eye className="size-4" aria-hidden /> Anteprima slot
        </button>
        {saved && (
          <span className="inline-flex items-center gap-1.5 text-[14px] font-medium text-olive">
            <Check className="size-4" aria-hidden /> Salvato
          </span>
        )}
      </div>

      {/* Vista previa */}
      {slots && (
        <section className="overflow-hidden rounded-2xl border border-ink/10 bg-warm">
          <div className="border-b border-ink/10 px-5 py-3.5">
            <h2 className="text-[15.5px] font-medium text-ink">Prossimi slot ({slots.length})</h2>
          </div>
          <div className="p-5">
            {slots.length === 0 ? (
              <p className="text-[14px] text-ink-soft">
                Non ci sono slot nei prossimi 14 giorni. Controlla il tuo orario e salvalo.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {Object.entries(slotsByDate).map(([date, daySlots]) => (
                  <div key={date}>
                    <p className="mb-2 text-[13.5px] font-medium text-ink">{date}</p>
                    <div className="flex flex-wrap gap-2">
                      {daySlots.map((s) => (
                        <span
                          key={s.startUtc}
                          className="rounded-lg border border-sage/40 bg-sage/15 px-2.5 py-1 text-[13.5px] text-ink"
                        >
                          {s.label}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
