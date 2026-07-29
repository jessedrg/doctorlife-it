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
    title: "Cuenta de cobros (Stripe)",
    doneText: "Puedes recibir pagos y transferencias de tus pacientes.",
    todoText: "Conecta Stripe Connect para poder cobrar las consultas.",
    href: "/clinica/pagos",
    cta: "Configurar Stripe",
    icon: CreditCard,
  },
  {
    key: "availability",
    title: "Disponibilidad",
    doneText: "Tienes franjas horarias configuradas.",
    todoText: "Define tu horario semanal para generar huecos reservables.",
    href: "/clinica/disponibilidad",
    cta: "Configurar horario",
    icon: CalendarClock,
  },
  {
    key: "googleMeet",
    title: "Google Calendar y Meet",
    doneText: "Cada cita generará una videollamada de Google Meet automáticamente.",
    todoText: "Conecta Google para crear las videollamadas con tus pacientes.",
    href: "/clinica/cuenta",
    cta: "Conectar Google",
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
            <h2 className="text-[16px] font-medium text-ink">Tu perfil está activo</h2>
            <p className="text-[14px] leading-relaxed text-ink-soft">
              Apareces en la página de reservas y los pacientes ya pueden agendar contigo.
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
          <h2 className="text-[18px] font-medium text-ink">Completa tu configuración</h2>
          <p className="mt-1 max-w-[60ch] text-[14.5px] leading-relaxed text-ink-soft">
            Para empezar a recibir pacientes en la página de reservas necesitas terminar estos
            pasos. Hasta entonces, tu disponibilidad no se publica.
          </p>
        </div>
        <span className="rounded-full bg-paper px-3 py-1 text-[12.5px] font-semibold text-ink">
          {completed} de {total} completados
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
                  Listo
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
