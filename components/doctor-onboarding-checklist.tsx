import Link from "next/link"
import { Check, CreditCard, CalendarClock, Video, ArrowRight } from "lucide-react"
import type { DoctorReadiness } from "@/lib/doctor/readiness"

type Step = {
  key: keyof Omit<DoctorReadiness, "ready" | "acceptingPatients">
  title: string
  doneText: string
  todoText: string
  href: string
  cta: string
  icon: typeof CreditCard
}

const STEPS: Step[] = [
  {
    key: "payments",
    title: "Conto per incassi (Stripe)",
    doneText: "Puoi ricevere pagamenti e bonifici dai tuoi pazienti.",
    todoText: "Collega Stripe Connect per poter incassare le visite.",
    href: "/clinica/pagos",
    cta: "Configura Stripe",
    icon: CreditCard,
  },
  {
    key: "availability",
    title: "Disponibilità",
    doneText: "Hai delle fasce orarie configurate.",
    todoText: "Definisci il tuo orario settimanale per generare slot prenotabili.",
    href: "/clinica/disponibilidad",
    cta: "Configura orario",
    icon: CalendarClock,
  },
  {
    key: "googleMeet",
    title: "Google Calendar e Meet",
    doneText: "Ogni appuntamento genererà automaticamente una videochiamata Google Meet.",
    todoText: "Collega Google per creare le videochiamate con i tuoi pazienti.",
    href: "/clinica/cuenta",
    cta: "Collega Google",
    icon: Video,
  },
]

export function DoctorOnboardingChecklist({ readiness }: { readiness: DoctorReadiness }) {
  const completed = STEPS.filter((s) => readiness[s.key]).length
  const total = STEPS.length

  if (readiness.ready) {
    return (
      <div className="rounded-[22px] border border-olive/25 bg-olive/[.07] p-5">
        <div className="flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-full bg-olive text-paper">
            <Check className="size-4" aria-hidden />
          </span>
          <div>
            <h2 className="text-[16px] font-medium text-ink">Il tuo profilo è attivo</h2>
            <p className="text-[14px] leading-relaxed text-ink-soft">
              Compari nella pagina di prenotazione e i pazienti possono già prenotare con te.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-[22px] border border-amber/30 bg-amber/[.08] p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-medium text-ink">Completa la tua configurazione</h2>
          <p className="mt-1 max-w-[60ch] text-[14.5px] leading-relaxed text-ink-soft">
            Per iniziare a ricevere pazienti nella pagina di prenotazione devi completare questi
            passaggi. Fino ad allora, la tua disponibilità non viene pubblicata.
          </p>
        </div>
        <span className="rounded-full bg-paper px-3 py-1 text-[12.5px] font-semibold text-ink">
          {completed} di {total} completati
        </span>
      </div>

      <ol className="mt-5 flex flex-col gap-3">
        {STEPS.map((step) => {
          const done = readiness[step.key]
          const Icon = step.icon
          return (
            <li
              key={step.key}
              className="flex flex-wrap items-center gap-4 rounded-[16px] border border-ink/10 bg-paper px-4 py-3.5"
            >
              <span
                className={`flex size-9 flex-shrink-0 items-center justify-center rounded-full ${
                  done ? "bg-olive text-paper" : "bg-warm text-ink-mute"
                }`}
              >
                {done ? <Check className="size-4.5" aria-hidden /> : <Icon className="size-4.5" aria-hidden />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-medium text-ink">{step.title}</p>
                <p className="text-[13.5px] leading-relaxed text-ink-soft">
                  {done ? step.doneText : step.todoText}
                </p>
              </div>
              {done ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-olive/12 px-3 py-1 text-[12.5px] font-medium text-olive">
                  <Check className="size-3.5" aria-hidden />
                  Fatto
                </span>
              ) : (
                <Link
                  href={step.href}
                  className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[13.5px] font-semibold text-paper transition-opacity hover:opacity-90"
                >
                  {step.cta}
                  <ArrowRight className="size-3.5" aria-hidden />
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
