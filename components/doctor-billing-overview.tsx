"use client"

import type { DoctorBilling } from "@/app/actions/doctor"
import { CreditCard, CheckCircle2, CalendarClock, Clock } from "lucide-react"

function fmtMoney(cents: number, currency = "eur") {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100)
}

const dateFmt = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "long",
  year: "numeric",
})

const STATUS_META: Record<string, { label: string; cls: string }> = {
  active: { label: "Activa", cls: "bg-olive/15 text-olive" },
  trialing: { label: "En prueba", cls: "bg-olive/15 text-olive" },
  past_due: { label: "Pago pendiente", cls: "bg-amber/15 text-amber" },
  incomplete: { label: "Incompleta", cls: "bg-amber/15 text-amber" },
  canceled: { label: "Cancelada", cls: "bg-ink/[.08] text-ink-soft" },
}

export function DoctorBillingOverview({ billing }: { billing: DoctorBilling }) {
  const { subscriptions, activeCount, upcomingPayouts } = billing

  return (
    <div className="flex flex-col gap-8">
      {/* KPIs de actividad */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-[16px] border border-ink/10 bg-cream p-5">
          <div className="flex items-center gap-2 text-ink-soft">
            <CheckCircle2 className="size-4" aria-hidden />
            <span className="text-[12px] font-semibold uppercase tracking-[.06em]">
              Pacientes activos
            </span>
          </div>
          <p className="mt-2.5 text-[32px] font-light leading-none text-ink">{activeCount}</p>
          <p className="mt-1 text-[12px] text-ink-mute">suscripciones en curso</p>
        </div>

        <div className="rounded-[16px] border border-ink/10 bg-cream p-5">
          <div className="flex items-center gap-2 text-ink-soft">
            <CalendarClock className="size-4" aria-hidden />
            <span className="text-[12px] font-semibold uppercase tracking-[.06em]">
              Próximas renovaciones
            </span>
          </div>
          <p className="mt-2.5 text-[32px] font-light leading-none text-ink">
            {upcomingPayouts.length}
          </p>
          <p className="mt-1 text-[12px] text-ink-mute">en los próximos meses</p>
        </div>
      </div>

      {/* Próximas renovaciones */}
      <section>
        <div className="flex items-center gap-2">
          <Clock className="size-4 text-ink-soft" aria-hidden />
          <h3 className="text-[16px] font-medium text-ink">Próximas renovaciones</h3>
        </div>
        <p className="mt-1 text-[13.5px] text-ink-soft">
          Fechas en las que tus pacientes renuevan su tratamiento.
        </p>

        {upcomingPayouts.length === 0 ? (
          <p className="mt-4 rounded-[14px] border border-dashed border-ink/15 bg-warm px-4 py-6 text-center text-[14px] text-ink-soft">
            No hay renovaciones próximas.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-2">
            {upcomingPayouts.map((p, i) => {
              const daysUntil = Math.ceil(
                (p.renewalDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
              )
              const isImminent = daysUntil <= 7
              return (
                <li
                  key={i}
                  className="flex items-center gap-3 rounded-[13px] border border-ink/10 bg-cream px-4 py-3.5"
                >
                  <div
                    className={`flex size-9 shrink-0 items-center justify-center rounded-full ${isImminent ? "bg-olive/15" : "bg-ink/5"}`}
                  >
                    <CalendarClock
                      className={`size-4 ${isImminent ? "text-olive" : "text-ink-soft"}`}
                      aria-hidden
                    />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-ink">{p.patientName}</p>
                    <p className="text-[12.5px] text-ink-soft">
                      Renovación el{" "}
                      <span className={isImminent ? "font-semibold text-olive" : ""}>
                        {dateFmt.format(p.renewalDate)}
                      </span>
                      {isImminent && (
                        <span className="ml-1.5 inline-flex items-center rounded-full bg-olive/15 px-1.5 py-0.5 text-[11px] font-medium text-olive">
                          en {daysUntil}d
                        </span>
                      )}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {/* Suscripciones de pacientes */}
      <section>
        <h3 className="text-[16px] font-medium text-ink">Suscripciones de tus pacientes</h3>
        <p className="mt-1 text-[13.5px] text-ink-soft">
          Estado de cada tratamiento y fecha del próximo cobro al paciente.
        </p>
        {subscriptions.length === 0 ? (
          <p className="mt-4 rounded-[14px] border border-dashed border-ink/15 bg-warm px-4 py-6 text-center text-[14px] text-ink-soft">
            Aún no tienes pacientes con suscripción activa.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-2.5">
            {subscriptions.map((s, i) => {
              const meta = STATUS_META[s.status] ?? STATUS_META.incomplete
              return (
                <li
                  key={i}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-ink/10 bg-cream px-4 py-3.5"
                >
                  <div className="min-w-0">
                    <p className="text-[15px] font-medium text-ink">{s.patientName}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[12.5px] text-ink-soft">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 font-medium ${meta.cls}`}
                      >
                        {meta.label}
                      </span>
                      {s.currentPeriodEnd && (
                        <span className="inline-flex items-center gap-1">
                          <CalendarClock className="size-3.5" aria-hidden />
                          {s.cancelAtPeriodEnd ? "Finaliza el " : "Próximo cobro: "}
                          {dateFmt.format(s.currentPeriodEnd)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="flex items-center gap-1 text-[14px] font-medium text-ink">
                      <CreditCard className="size-3.5 text-ink-mute" aria-hidden />
                      {fmtMoney(s.priceCents, s.currency)}
                      <span className="text-[12px] font-normal text-ink-mute">/mes</span>
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
