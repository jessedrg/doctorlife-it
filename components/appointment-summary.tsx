import Link from "next/link"

type Appt = {
  id: number
  startsAt: Date
  endsAt: Date
  status: string
  meetingUrl: string | null
  doctorName: string | null
}

const STATUS: Record<string, { label: string; cls: string }> = {
  pending_payment: { label: "Pagamento in sospeso", cls: "bg-amber/20 text-ink" },
  confirmed: { label: "Confermato", cls: "bg-sage/25 text-ink" },
  cancelled: { label: "Annullato", cls: "bg-ink/10 text-ink-soft" },
}

const dateFmt = new Intl.DateTimeFormat("it-IT", {
  weekday: "long",
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Rome",
})

export function AppointmentSummary({ appt }: { appt: Appt }) {
  const badge = STATUS[appt.status] ?? STATUS.confirmed
  const when = dateFmt.format(new Date(appt.startsAt))

  return (
    <div className="rounded-[20px] border border-ink/10 bg-cream p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[16px] font-medium text-ink">Il tuo prossimo appuntamento</h2>
        <span className={`rounded-full px-2.5 py-1 text-[12px] font-medium ${badge.cls}`}>
          {badge.label}
        </span>
      </div>
      <p className="mt-2 text-[15px] capitalize text-ink">{when}</p>
      {appt.doctorName ? (
        <p className="mt-0.5 text-[14px] text-ink-soft">con {appt.doctorName}</p>

      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {appt.status === "confirmed" && appt.meetingUrl ? (
          <a
            href={appt.meetingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-ink px-4 py-2 text-[13.5px] font-medium text-paper transition-opacity hover:opacity-90"
          >
            Partecipa alla videochiamata
          </a>
        ) : null}
        {appt.status === "pending_payment" ? (
          <Link
            href="/portal/reservar"
            className="rounded-full bg-ink px-4 py-2 text-[13.5px] font-medium text-paper transition-opacity hover:opacity-90"
          >
            Completa il pagamento
          </Link>
        ) : null}
        <Link
          href="/portal/citas"
          className="rounded-full border border-ink/15 px-4 py-2 text-[13.5px] font-medium text-ink transition-colors hover:bg-ink/5"
        >
          Vedi tutti i miei appuntamenti
        </Link>
      </div>
    </div>
  )
}
