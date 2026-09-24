import { ArrowUpRight, CalendarClock, Mail, MessageCircle } from "lucide-react"

type DoctorLead = {
  appointmentId: number
  patientName: string
  patientEmail: string
  patientPhone: string | null
  startsAt: Date
  bookedAt: Date
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Rome",
  }).format(value)
}

function getWhatsAppUrl(phone: string | null) {
  if (!phone) return null
  const digits = phone.replace(/\D/g, "").replace(/^00/, "")
  return digits.length >= 7 ? `https://wa.me/${digits}` : null
}

export function DoctorLeadsList({ leads }: { leads: DoctorLead[] }) {
  if (leads.length === 0) {
    return (
      <section className="mt-7 rounded-[20px] border border-ink/10 bg-warm px-6 py-10 text-center">
        <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-paper text-ink-soft">
          <CalendarClock aria-hidden="true" />
        </div>
        <h2 className="mt-4 text-lg font-medium text-ink">Ancora nessuna prenotazione</h2>
        <p className="mx-auto mt-1 max-w-[42ch] text-sm leading-relaxed text-ink-soft">
          Quando un paziente prenota una visita con te, troverai qui i suoi dati e il modo per contattarlo.
        </p>
      </section>
    )
  }

  return (
    <section aria-label="Lead con prenotazioni" className="mt-7 flex flex-col gap-3">
      {leads.map((lead) => {
        const whatsappUrl = getWhatsAppUrl(lead.patientPhone)
        return (
          <article
            key={lead.appointmentId}
            className="rounded-[18px] border border-ink/10 bg-warm p-5"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-medium text-ink">{lead.patientName}</h2>
                <a
                  href={`mailto:${lead.patientEmail}`}
                  className="mt-1 inline-flex max-w-full items-center gap-2 text-sm text-ink-soft underline-offset-4 hover:text-ink hover:underline"
                >
                  <Mail aria-hidden="true" className="size-4 shrink-0" />
                  <span className="truncate">{lead.patientEmail}</span>
                </a>
              </div>
              {whatsappUrl ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-full border border-ink/15 px-4 text-sm font-medium text-ink no-underline transition-colors hover:bg-paper"
                  aria-label={`Apri WhatsApp per ${lead.patientName}`}
                >
                  <MessageCircle aria-hidden="true" className="size-4" />
                  WhatsApp
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                </a>
              ) : (
                <span className="inline-flex min-h-10 items-center gap-2 rounded-full bg-paper px-4 text-sm text-ink-mute">
                  <MessageCircle aria-hidden="true" className="size-4" />
                  WhatsApp non disponibile
                </span>
              )}
            </div>

            <dl className="mt-5 grid gap-4 border-t border-ink/10 pt-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-[.08em] text-ink-mute">Visita prenotata</dt>
                <dd className="mt-1 text-sm font-medium text-ink">{formatDate(lead.startsAt)}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[.08em] text-ink-mute">Prenotazione ricevuta</dt>
                <dd className="mt-1 text-sm font-medium text-ink">{formatDate(lead.bookedAt)}</dd>
              </div>
            </dl>
          </article>
        )
      })}
    </section>
  )
}

export type { DoctorLead }
