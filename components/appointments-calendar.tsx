"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  Video,
  Clock,
  CalendarDays,
  CheckCircle2,
  XCircle,
  CircleDot,
  AlertTriangle,
  Loader2,
  CalendarClock,
} from "lucide-react"
import { cancelAppointmentAsDoctor, doctorRescheduleAppointment } from "@/app/actions/booking"

export type DoctorAppointment = {
  id: number
  startsAt: string | Date
  endsAt: string | Date
  status: string
  amountCents: number
  meetingUrl: string | null
  patientName: string
}

type ViewMode = "month" | "week" | "day"

const TZ = "Europe/Rome"

const WEEKDAYS = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"]
const WEEKDAYS_FULL = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"]
const MONTHS = [
  "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
  "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre",
]

const timeFmt = new Intl.DateTimeFormat("it-IT", { hour: "2-digit", minute: "2-digit", timeZone: TZ })

/* Valores iniciales para <input type="date"|"time"> a partir de un Date (hora local del navegador). */
function toLocalDateInput(d: Date): string {
  const y = d.getFullYear()
  const mo = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${mo}-${day}`
}
function toLocalTimeInput(d: Date): string {
  const h = String(d.getHours()).padStart(2, "0")
  const mi = String(d.getMinutes()).padStart(2, "0")
  return `${h}:${mi}`
}

/** Devuelve el índice de día de la semana con lunes = 0. */
function mondayIndex(d: Date) {
  return (d.getDay() + 6) % 7
}

function startOfDay(d: Date) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

function addDays(d: Date, n: number) {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

const STATUS_META: Record<
  string,
  { label: string; dot: string; chip: string; icon: typeof CheckCircle2 }
> = {
  confirmed: {
    label: "Confermato",
    dot: "bg-olive",
    chip: "bg-olive/12 text-olive border-olive/20",
    icon: CheckCircle2,
  },
  completed: {
    label: "Completato",
    dot: "bg-teal",
    chip: "bg-teal/12 text-teal border-teal/25",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Annullato",
    dot: "bg-clay",
    chip: "bg-clay/12 text-clay border-clay/25",
    icon: XCircle,
  },
}

function statusMeta(status: string) {
  return (
    STATUS_META[status] ?? {
      label: status,
      dot: "bg-amber",
      chip: "bg-amber/15 text-clay border-amber/30",
      icon: CircleDot,
    }
  )
}

export function AppointmentsCalendar({ appointments }: { appointments: DoctorAppointment[] }) {
  const [view, setView] = useState<ViewMode>("month")
  const [cursor, setCursor] = useState(() => new Date())
  const [selected, setSelected] = useState<DoctorAppointment | null>(null)

  // Normaliza fechas a objetos Date una sola vez.
  const items = useMemo(
    () =>
      appointments
        .map((a) => ({ ...a, start: new Date(a.startsAt), end: new Date(a.endsAt) }))
        .sort((a, b) => a.start.getTime() - b.start.getTime()),
    [appointments],
  )

  function shift(dir: -1 | 1) {
    setCursor((c) => {
      if (view === "month") {
        const x = new Date(c)
        x.setMonth(x.getMonth() + dir)
        return x
      }
      return addDays(c, dir * (view === "week" ? 7 : 1))
    })
  }

  const title = useMemo(() => {
    if (view === "month") return `${MONTHS[cursor.getMonth()]} ${cursor.getFullYear()}`
    if (view === "day")
      return `${WEEKDAYS_FULL[mondayIndex(cursor)]}, ${cursor.getDate()} ${MONTHS[cursor.getMonth()]}`
    const weekStart = addDays(startOfDay(cursor), -mondayIndex(cursor))
    const weekEnd = addDays(weekStart, 6)
    const sameMonth = weekStart.getMonth() === weekEnd.getMonth()
    return sameMonth
      ? `${weekStart.getDate()}–${weekEnd.getDate()} ${MONTHS[weekStart.getMonth()]}`
      : `${weekStart.getDate()} ${MONTHS[weekStart.getMonth()]} – ${weekEnd.getDate()} ${MONTHS[weekEnd.getMonth()]}`
  }, [view, cursor])

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => shift(-1)}
            aria-label="Precedente"
            className="flex size-9 items-center justify-center rounded-full border border-ink/12 bg-warm text-ink-soft transition-colors hover:bg-ink/[.04] hover:text-ink"
          >
            <ChevronLeft className="size-4.5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => shift(1)}
            aria-label="Successivo"
            className="flex size-9 items-center justify-center rounded-full border border-ink/12 bg-warm text-ink-soft transition-colors hover:bg-ink/[.04] hover:text-ink"
          >
            <ChevronRight className="size-4.5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => setCursor(new Date())}
            className="ml-1 rounded-full border border-ink/12 bg-warm px-3.5 py-2 text-[13px] font-medium text-ink-soft transition-colors hover:bg-ink/[.04] hover:text-ink"
          >
            Oggi
          </button>
          <h2 className="ml-1 text-[17px] font-medium capitalize text-ink sm:text-[19px]">{title}</h2>
        </div>

        {/* View switch */}
        <div className="flex rounded-full border border-ink/12 bg-warm p-1">
          {(["month", "week", "day"] as ViewMode[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                view === v ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"
              }`}
            >
              {v === "month" ? "Mese" : v === "week" ? "Settimana" : "Giorno"}
            </button>
          ))}
        </div>
      </div>

      {view === "month" && (
        <MonthView cursor={cursor} items={items} onSelect={setSelected} onPickDay={(d) => { setCursor(d); setView("day") }} />
      )}
      {view === "week" && <WeekView cursor={cursor} items={items} onSelect={setSelected} />}
      {view === "day" && <DayView cursor={cursor} items={items} onSelect={setSelected} />}

      {selected && <AppointmentSheet appt={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

type Item = DoctorAppointment & { start: Date; end: Date }

/* ─────────────────────────── Month ─────────────────────────── */
function MonthView({
  cursor,
  items,
  onSelect,
  onPickDay,
}: {
  cursor: Date
  items: Item[]
  onSelect: (a: Item) => void
  onPickDay: (d: Date) => void
}) {
  const firstOfMonth = new Date(cursor.getFullYear(), cursor.getMonth(), 1)
  const gridStart = addDays(startOfDay(firstOfMonth), -mondayIndex(firstOfMonth))
  const today = new Date()
  const cells = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i))

  return (
    <div className="overflow-hidden rounded-2xl border border-ink/10 bg-warm">
      <div className="grid grid-cols-7 border-b border-ink/10 bg-cream/60">
        {WEEKDAYS.map((d) => (
          <div key={d} className="px-1 py-2 text-center text-[11px] font-semibold uppercase tracking-[.05em] text-ink-mute">
            <span className="hidden sm:inline">{d}</span>
            <span className="sm:hidden">{d[0]}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          const inMonth = day.getMonth() === cursor.getMonth()
          const dayItems = items.filter((it) => sameDay(it.start, day))
          const isToday = sameDay(day, today)
          return (
            <button
              type="button"
              key={i}
              onClick={() => onPickDay(day)}
              className={`flex min-h-[76px] flex-col gap-1 border-b border-r border-ink/8 p-1.5 text-left transition-colors last:border-r-0 hover:bg-ink/[.03] sm:min-h-[104px] ${
                inMonth ? "" : "bg-cream/40"
              }`}
            >
              <span
                className={`flex size-6 items-center justify-center rounded-full text-[12.5px] font-medium ${
                  isToday ? "bg-ink text-paper" : inMonth ? "text-ink" : "text-ink-mute"
                }`}
              >
                {day.getDate()}
              </span>
              <span className="flex flex-col gap-1">
                {dayItems.slice(0, 3).map((it) => {
                  const m = statusMeta(it.status)
                  return (
                    <span
                      key={it.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelect(it)
                      }}
                      className="flex items-center gap-1 truncate rounded-md bg-paper px-1.5 py-0.5 text-[11px] text-ink shadow-sm ring-1 ring-ink/5"
                    >
                      <span className={`size-1.5 shrink-0 rounded-full ${m.dot}`} />
                      <span className="hidden truncate sm:inline">{timeFmt.format(it.start)} {it.patientName}</span>
                      <span className="truncate sm:hidden">{timeFmt.format(it.start)}</span>
                    </span>
                  )
                })}
                {dayItems.length > 3 && (
                  <span className="px-1.5 text-[10.5px] text-ink-mute">+{dayItems.length - 3} altri</span>
                )}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ─────────────────────────── Week ─────────────────────────── */
function WeekView({ cursor, items, onSelect }: { cursor: Date; items: Item[]; onSelect: (a: Item) => void }) {
  const weekStart = addDays(startOfDay(cursor), -mondayIndex(cursor))
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  const today = new Date()

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-7 sm:gap-2">
      {days.map((day, i) => {
        const dayItems = items.filter((it) => sameDay(it.start, day))
        const isToday = sameDay(day, today)
        return (
          <div
            key={i}
            className={`flex flex-col gap-2 rounded-2xl border p-2.5 ${
              isToday ? "border-ink/25 bg-cream" : "border-ink/10 bg-warm"
            }`}
          >
            <div className="flex items-center justify-between sm:flex-col sm:items-start sm:gap-0.5">
              <span className="text-[12px] font-semibold uppercase tracking-[.04em] text-ink-mute">
                {WEEKDAYS[i]}
              </span>
              <span className={`text-[15px] font-medium ${isToday ? "text-ink" : "text-ink-soft"}`}>
                {day.getDate()} {MONTHS[day.getMonth()].slice(0, 3)}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              {dayItems.length === 0 ? (
                <span className="rounded-lg py-1 text-center text-[12px] text-ink-mute">—</span>
              ) : (
                dayItems.map((it) => <MiniEvent key={it.id} it={it} onSelect={onSelect} />)
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ─────────────────────────── Day ─────────────────────────── */
function DayView({ cursor, items, onSelect }: { cursor: Date; items: Item[]; onSelect: (a: Item) => void }) {
  const dayItems = items.filter((it) => sameDay(it.start, cursor))

  if (dayItems.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-ink/10 bg-warm py-14 text-center">
        <CalendarDays className="size-8 text-ink-mute" aria-hidden />
        <p className="text-[15px] font-medium text-ink">Nessun appuntamento in questo giorno</p>
        <p className="text-[13.5px] text-ink-soft">Goditi la pausa o modifica la tua disponibilità.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2.5">
      {dayItems.map((it) => {
        const m = statusMeta(it.status)
        const Icon = m.icon
        const isUpcoming = it.start.getTime() > Date.now() - 30 * 60_000
        return (
          <button
            type="button"
            key={it.id}
            onClick={() => onSelect(it)}
            className="flex items-center gap-4 rounded-2xl border border-ink/10 bg-warm p-4 text-left transition-colors hover:bg-cream"
          >
            <div className="flex w-16 shrink-0 flex-col items-center">
              <span className="text-[17px] font-semibold text-ink">{timeFmt.format(it.start)}</span>
              <span className="text-[12px] text-ink-mute">{timeFmt.format(it.end)}</span>
            </div>
            <div className="h-12 w-px bg-ink/10" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15.5px] font-medium text-ink">{it.patientName}</p>
              <span className={`mt-1 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[12px] font-medium ${m.chip}`}>
                <Icon className="size-3.5" aria-hidden />
                {m.label}
              </span>
            </div>
            {it.meetingUrl && isUpcoming && it.status !== "cancelled" && (
              <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-ink px-3.5 py-2 text-[13px] font-semibold text-paper">
                <Video className="size-4" aria-hidden />
                <span className="hidden sm:inline">Partecipa</span>
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

function MiniEvent({ it, onSelect }: { it: Item; onSelect: (a: Item) => void }) {
  const m = statusMeta(it.status)
  return (
    <button
      type="button"
      onClick={() => onSelect(it)}
      className="flex flex-col gap-0.5 rounded-lg border border-ink/8 bg-paper px-2 py-1.5 text-left shadow-sm transition-colors hover:bg-cream"
    >
      <span className="flex items-center gap-1.5">
        <span className={`size-1.5 shrink-0 rounded-full ${m.dot}`} />
        <span className="text-[12.5px] font-semibold text-ink">{timeFmt.format(it.start)}</span>
      </span>
      <span className="truncate text-[12px] text-ink-soft">{it.patientName}</span>
    </button>
  )
}

/* ─────────────────────── Detail sheet ─────────────────────── */
function AppointmentSheet({ appt, onClose }: { appt: Item | DoctorAppointment; onClose: () => void }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [rescheduling, setRescheduling] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const start = new Date(appt.startsAt)
  const end = new Date(appt.endsAt)
  const m = statusMeta(appt.status)
  const Icon = m.icon
  const dateLabel = new Intl.DateTimeFormat("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: TZ,
  }).format(start)
  const isUpcoming = start.getTime() > Date.now() - 30 * 60_000
  const canCancel = isUpcoming && appt.status !== "cancelled"
  // Primera consulta (de pago) → al reprogramar puede reasignarse a otro médico.
  const isFirstConsult = appt.amountCents > 0

  // Valores por defecto para los inputs de reprogramación (hora local del médico).
  const [newDate, setNewDate] = useState<string>(() => toLocalDateInput(start))
  const [newTime, setNewTime] = useState<string>(() => toLocalTimeInput(start))

  async function doCancel() {
    setLoading(true)
    setError(null)
    try {
      const res = await cancelAppointmentAsDoctor(appt.id)
      if ("error" in res) {
        setError(res.error)
        setLoading(false)
        return
      }
      onClose()
      router.refresh()
    } catch {
      setError("Impossibile annullare. Riprova.")
      setLoading(false)
    }
  }

  async function doReschedule() {
    setError(null)
    if (!newDate || !newTime) {
      setError("Scegli data e ora.")
      return
    }
    // Construye un instante a partir de la fecha/hora locales introducidas.
    const iso = new Date(`${newDate}T${newTime}`).toISOString()
    if (Number.isNaN(new Date(iso).getTime())) {
      setError("Data od ora non valida.")
      return
    }
    if (new Date(iso).getTime() < Date.now()) {
      setError("Scegli un orario futuro.")
      return
    }
    setLoading(true)
    try {
      const res = await doctorRescheduleAppointment(appt.id, iso)
      if ("error" in res) {
        setError(res.error)
        setLoading(false)
        return
      }
      onClose()
      router.refresh()
    } catch {
      setError("Impossibile riprogrammare. Riprova.")
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-[420px] rounded-t-3xl border border-ink/10 bg-paper p-6 shadow-xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-ink/15 sm:hidden" />

        {rescheduling ? (
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-teal/25 bg-teal/12 px-2.5 py-1 text-[12.5px] font-medium text-teal">
              <CalendarClock className="size-3.5" aria-hidden />
              Riprogramma appuntamento
            </span>
            <h3 className="mt-3 text-[20px] font-light tracking-[-.01em] text-ink">
              Scegli la nuova data e ora
            </h3>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">
              L'appuntamento con <strong>{appt.patientName}</strong> verrà spostato subito e resterà
              assegnato a te. Il paziente riceverà un'email con il nuovo orario già confermato.
            </p>

            <div className="mt-4 flex gap-3">
              <label className="flex-1 text-[12.5px] font-medium text-ink">
                Data
                <input
                  type="date"
                  value={newDate}
                  min={toLocalDateInput(new Date())}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-ink/15 bg-warm px-3 py-2.5 text-[14px] text-ink outline-none focus:border-ink/30"
                />
              </label>
              <label className="w-[130px] text-[12.5px] font-medium text-ink">
                Ora
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-ink/15 bg-warm px-3 py-2.5 text-[14px] text-ink outline-none focus:border-ink/30"
                />
              </label>
            </div>

            {error ? (
              <p role="alert" className="mt-3 text-[13px] text-clay">
                {error}
              </p>
            ) : null}

            <div className="mt-6 flex gap-2.5">
              <button
                type="button"
                disabled={loading}
                onClick={doReschedule}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 text-[14.5px] font-semibold text-paper transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {loading ? <Loader2 className="size-4.5 animate-spin" aria-hidden /> : null}
                Conferma nuovo orario
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  setRescheduling(false)
                  setError(null)
                }}
                className="flex-1 rounded-xl border border-ink/15 px-4 py-3 text-[14.5px] font-medium text-ink transition-colors hover:bg-warm disabled:opacity-60"
              >
                Indietro
              </button>
            </div>
          </div>
        ) : confirming ? (
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-clay/25 bg-clay/12 px-2.5 py-1 text-[12.5px] font-medium text-clay">
              <AlertTriangle className="size-3.5" aria-hidden />
              Annulla appuntamento
            </span>
            <h3 className="mt-3 text-[20px] font-light tracking-[-.01em] text-ink">
              Vuoi davvero annullare?
            </h3>

            <div className="mt-4 rounded-xl border border-amber/30 bg-amber/10 p-4">
              {isFirstConsult ? (
                <p className="text-[13.5px] leading-relaxed text-ink-soft">
                  Il paziente potrà scegliere un nuovo orario. Trattandosi di una <strong>prima visita</strong>,
                  se sceglie uno slot che non è tuo, l'appuntamento verrà <strong>riassegnato a un altro medico</strong>{" "}
                  disponibile per quell'orario — pagamento incluso. Potresti perdere questo paziente.
                </p>
              ) : (
                <p className="text-[13.5px] leading-relaxed text-ink-soft">
                  Il paziente potrà scegliere un nuovo orario <strong>con te</strong>. Trattandosi di una
                  videochiamata di follow-up, l'appuntamento resterà assegnato a te.
                </p>
              )}
            </div>

            {error ? (
              <p role="alert" className="mt-3 text-[13px] text-clay">
                {error}
              </p>
            ) : null}

            <div className="mt-6 flex gap-2.5">
              <button
                type="button"
                disabled={loading}
                onClick={doCancel}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-clay px-4 py-3 text-[14.5px] font-semibold text-paper transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {loading ? <Loader2 className="size-4.5 animate-spin" aria-hidden /> : null}
                Sì, annulla appuntamento
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  setConfirming(false)
                  setError(null)
                }}
                className="flex-1 rounded-xl border border-ink/15 px-4 py-3 text-[14.5px] font-medium text-ink transition-colors hover:bg-warm disabled:opacity-60"
              >
                Indietro
              </button>
            </div>
          </div>
        ) : (
          <div>
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12.5px] font-medium ${m.chip}`}>
              <Icon className="size-3.5" aria-hidden />
              {m.label}
            </span>
            <h3 className="mt-3 text-[22px] font-light tracking-[-.01em] text-ink">{appt.patientName}</h3>

            <div className="mt-4 flex flex-col gap-2.5">
              <div className="flex items-center gap-3 text-[14.5px] text-ink-soft">
                <CalendarDays className="size-4.5 text-ink-mute" aria-hidden />
                <span className="capitalize">{dateLabel}</span>
              </div>
              <div className="flex items-center gap-3 text-[14.5px] text-ink-soft">
                <Clock className="size-4.5 text-ink-mute" aria-hidden />
                <span>
                  {timeFmt.format(start)} – {timeFmt.format(end)}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[14.5px] text-ink-soft">
                <CircleDot className="size-4.5 text-ink-mute" aria-hidden />
                <span>{appt.amountCents > 0 ? `${(appt.amountCents / 100).toFixed(2)} €` : "Inclusa nell'abbonamento"}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-2.5">
              {appt.meetingUrl && isUpcoming && appt.status !== "cancelled" ? (
                <a
                  href={appt.meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 text-[14.5px] font-semibold text-paper transition-opacity hover:opacity-90"
                >
                  <Video className="size-4.5" aria-hidden />
                  Partecipa a Google Meet
                </a>
              ) : null}
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-ink/15 px-4 py-3 text-[14.5px] font-medium text-ink transition-colors hover:bg-warm"
              >
                Chiudi
              </button>
            </div>

            {canCancel ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setError(null)
                    setNewDate(toLocalDateInput(start))
                    setNewTime(toLocalTimeInput(start))
                    setRescheduling(true)
                  }}
                  className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-xl border border-ink/15 px-4 py-2.5 text-[13.5px] font-medium text-ink transition-colors hover:bg-warm"
                >
                  <CalendarClock className="size-4" aria-hidden />
                  Riprogramma a un altro orario
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(true)}
                  className="mt-2 w-full rounded-xl px-4 py-2.5 text-[13.5px] font-medium text-clay transition-colors hover:bg-clay/10"
                >
                  Annulla questo appuntamento
                </button>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}
