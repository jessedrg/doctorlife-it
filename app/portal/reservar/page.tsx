import Link from "next/link"
import { CalendarClock, Clock } from "lucide-react"
import { getPooledAvailability } from "@/app/actions/booking"
import { getMySubscription, getPatientStatus } from "@/app/actions/subscription"
import { requireRole } from "@/lib/session"
import { BookingCalendar } from "@/components/booking-calendar"

export default async function ReservarPage() {
  const me = await requireRole("patient")
  const [slots, subscription, status] = await Promise.all([
    getPooledAvailability(14),
    getMySubscription(),
    getPatientStatus(me.id),
  ])

  // Esta página SOLO es para seguimientos post-renovación.
  // La primera cita siempre llega desde el flujo del quiz público (25€).
  const isFollowup = status === "followup_available"

  if (!isFollowup) {
    const title =
      status === "active"
        ? "Il calendario si attiva con il rinnovo"
        : status === "pending_appointment"
          ? "Il tuo medico ti invierà il primo appuntamento"
          : status === "pending_prescription"
            ? "In attesa della valutazione del tuo medico"
            : "Attiva prima il tuo abbonamento"

    const body =
      status === "active"
        ? "Hai già fatto la tua prima visita. Quando si rinnoverà il tuo abbonamento mensile potrai prenotare qui la tua prossima videochiamata di follow-up."
        : status === "pending_appointment"
          ? "Il tuo medico sta esaminando il tuo caso e presto ti invierà la data della prima visita. Non devi fare altro."
          : status === "pending_prescription"
            ? "Il tuo medico sta preparando il trattamento personalizzato per te. Appena sarà pronto riceverai un avviso."
            : "Per accedere alle videochiamate di follow-up attiva il tuo piano di trattamento dalla sezione Ricette."

    return (
      <div className="mx-auto w-full max-w-xl">
        <div className="rounded-[20px] border border-ink/10 bg-cream p-8 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-ink/5">
            <Clock className="size-5 text-ink-soft" aria-hidden />
          </div>
          <h1 className="text-balance text-xl font-semibold text-ink">{title}</h1>
          <p className="mx-auto mt-3 max-w-[44ch] text-pretty text-[14px] leading-relaxed text-ink-soft">
            {body}
          </p>
          {status === "active" && subscription?.currentPeriodEnd && (
            <p className="mt-2 text-[13px] text-ink-soft">
              Prossimo rinnovo:{" "}
              {new Intl.DateTimeFormat("it-IT", { dateStyle: "long" }).format(
                new Date(subscription.currentPeriodEnd),
              )}
            </p>
          )}
          <Link
            href="/portal"
            className="mt-6 inline-flex rounded-full bg-ink px-5 py-2.5 text-[13.5px] font-medium text-paper transition-opacity hover:opacity-90"
          >
            Torna al pannello
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <header className="mb-6">
        <h1 className="text-balance text-2xl font-semibold text-ink">
          {isFollowup ? "Prenota la tua videochiamata di follow-up" : "Prenota il tuo primo appuntamento"}
        </h1>
        <p className="mt-1 text-pretty text-ink/70">
          {isFollowup
            ? "È inclusa nel tuo abbonamento. Scegli l'orario che preferisci."
            : "Scegli l'orario che preferisci. Ti assegneremo un medico disponibile e riceverai il link della videochiamata."}
        </p>
      </header>
      <BookingCalendar slots={slots} />
    </div>
  )
}
