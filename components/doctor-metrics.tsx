import Link from "next/link"
import { Users, CreditCard, CalendarCheck, CalendarClock, FileText, Wallet } from "lucide-react"
import type { DoctorMetrics } from "@/app/actions/doctor"

type Metric = {
  label: string
  value: string
  hint: string
  href: string
  icon: typeof Users
}

function formatEur(cents: number, currency = "eur") {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

export function DoctorMetricsGrid({ metrics }: { metrics: DoctorMetrics }) {
  const items: Metric[] = [
    {
      label: "Citas hoy",
      value: String(metrics.appointmentsToday),
      hint: "Programadas para hoy",
      href: "/clinica/agenda",
      icon: CalendarCheck,
    },
    {
      label: "Próximas citas",
      value: String(metrics.upcomingAppointments),
      hint: "A partir de ahora",
      href: "/clinica/citas",
      icon: CalendarClock,
    },
    {
      label: "Pacientes",
      value: String(metrics.totalPatients),
      hint: "Con consulta realizada",
      href: "/clinica/pacientes",
      icon: Users,
    },
    {
      label: "Suscripciones activas",
      value: String(metrics.activeSubscriptions),
      hint: "Pacientes con plan vigente",
      href: "/clinica/pagos",
      icon: CreditCard,
    },
    {
      label: "Recetas emitidas",
      value: String(metrics.prescriptionsIssued),
      hint: "Total acumulado",
      href: "/clinica/recetas",
      icon: FileText,
    },
    {
      label: "Comisiones",
      value: formatEur(metrics.totalCommissionCents),
      hint: "Ingresos acumulados",
      href: "/clinica/pagos",
      icon: Wallet,
    },
  ]

  return (
    <section aria-label="Resumen de tu actividad">
      <h2 className="text-[13px] font-semibold uppercase tracking-[.08em] text-ink-mute">
        Resumen
      </h2>
      <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-3">
        {items.map((m) => {
          const Icon = m.icon
          return (
            <Link
              key={m.label}
              href={m.href}
              className="group flex flex-col gap-3 rounded-2xl border border-ink/10 bg-paper p-4 transition-colors hover:border-ink/20 hover:bg-warm/60"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-sage/30 text-ink">
                <Icon className="size-[18px]" aria-hidden />
              </span>
              <span>
                <span className="block text-[26px] font-light leading-none tracking-[-.02em] text-ink">
                  {m.value}
                </span>
                <span className="mt-1.5 block text-[13.5px] font-medium text-ink">{m.label}</span>
                <span className="mt-0.5 block text-[12px] text-ink-soft">{m.hint}</span>
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
