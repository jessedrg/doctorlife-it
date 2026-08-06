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
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

export function DoctorMetricsGrid({ metrics }: { metrics: DoctorMetrics }) {
  const items: Metric[] = [
    {
      label: "Appuntamenti oggi",
      value: String(metrics.appointmentsToday),
      hint: "Programmati per oggi",
      href: "/clinica/agenda",
      icon: CalendarCheck,
    },
    {
      label: "Prossimi appuntamenti",
      value: String(metrics.upcomingAppointments),
      hint: "Da adesso in poi",
      href: "/clinica/citas",
      icon: CalendarClock,
    },
    {
      label: "Pazienti",
      value: String(metrics.totalPatients),
      hint: "Con visita effettuata",
      href: "/clinica/pacientes",
      icon: Users,
    },
    {
      label: "Abbonamenti attivi",
      value: String(metrics.activeSubscriptions),
      hint: "Pazienti con piano in corso",
      href: "/clinica/pagos",
      icon: CreditCard,
    },
    {
      label: "Ricette emesse",
      value: String(metrics.prescriptionsIssued),
      hint: "Totale accumulato",
      href: "/clinica/recetas",
      icon: FileText,
    },
    {
      label: "Commissioni",
      value: formatEur(metrics.totalCommissionCents),
      hint: "Ricavi accumulati",
      href: "/clinica/pagos",
      icon: Wallet,
    },
  ]

  return (
    <section aria-label="Riepilogo della tua attività">
      <h2 className="text-[13px] font-semibold uppercase tracking-[.08em] text-ink-mute">
        Riepilogo
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
