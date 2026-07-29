"use client"

import { useMemo, useState } from "react"
import { ArrowDownLeft, ArrowUpRight, Receipt, Wallet } from "lucide-react"
import { EmptyState } from "@/components/empty-state"
import type { DoctorEarnings, DoctorTxnCategory } from "@/app/actions/doctor"

const dateTimeFmt = new Intl.DateTimeFormat("es-ES", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Europe/Madrid",
})

function money(cents: number, currency: string) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100)
}

const CATEGORY_META: Record<DoctorTxnCategory, { label: string; cls: string }> = {
  subscription: { label: "Suscripción", cls: "bg-olive/15 text-olive" },
  consultation: { label: "Consulta", cls: "bg-sage/25 text-ink" },
  payout: { label: "Retirada", cls: "bg-ink/8 text-ink-soft" },
  other: { label: "Otro", cls: "bg-ink/8 text-ink-soft" },
}

type Filter = "all" | "subscription" | "consultation" | "payout"

export function DoctorTransactions({ earnings }: { earnings: DoctorEarnings }) {
  const [filter, setFilter] = useState<Filter>("all")

  const filtered = useMemo(() => {
    if (filter === "all") return earnings.transactions
    return earnings.transactions.filter((t) => t.category === filter)
  }, [earnings.transactions, filter])

  const currency = earnings.transactions[0]?.currency ?? "eur"

  const tabs: { key: Filter; label: string }[] = [
    { key: "all", label: "Todo" },
    { key: "subscription", label: "Suscripciones" },
    { key: "consultation", label: "Consultas" },
    { key: "payout", label: "Retiradas" },
  ]

  if (earnings.transactions.length === 0) {
    return (
      <EmptyState
        icon={Receipt}
        title="Aún no hay transacciones"
        description="Cuando atiendas tu primera consulta o se renueve la suscripción de un paciente, verás aquí cada ingreso con su detalle y comisiones."
      />
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Resumen */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-[18px] border border-ink/10 bg-cream p-4">
          <div className="flex items-center gap-2 text-ink-soft">
            <Wallet className="size-4" aria-hidden />
            <span className="text-[12.5px]">Ingresos netos</span>
          </div>
          <p className="mt-1.5 text-[22px] font-medium text-ink">
            {money(earnings.totalNetCents, currency)}
          </p>
        </div>
        <div className="rounded-[18px] border border-ink/10 bg-cream p-4">
          <p className="text-[12.5px] text-ink-soft">Repartos de suscripción</p>
          <p className="mt-1.5 text-[22px] font-medium text-ink">{earnings.subscriptionCount}</p>
        </div>
        <div className="rounded-[18px] border border-ink/10 bg-cream p-4">
          <p className="text-[12.5px] text-ink-soft">Primeras consultas</p>
          <p className="mt-1.5 text-[22px] font-medium text-ink">{earnings.consultationCount}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-1 rounded-full border border-ink/10 bg-cream p-1 sm:w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setFilter(t.key)}
            className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
              filter === t.key ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Lista */}
      {filtered.length === 0 ? (
        <div className="rounded-[20px] border border-ink/10 bg-cream p-6 text-center text-[14px] text-ink-soft">
          No hay movimientos en esta categoría.
        </div>
      ) : (
        <ul className="overflow-hidden rounded-[20px] border border-ink/10 bg-cream">
          {filtered.map((t, i) => {
            const meta = CATEGORY_META[t.category]
            const isOutgoing = t.category === "payout" || t.netCents < 0
            return (
              <li
                key={t.id}
                className={`flex items-center gap-3 px-4 py-3.5 sm:px-5 ${
                  i > 0 ? "border-t border-ink/10" : ""
                }`}
              >
                <span
                  className={`flex size-9 shrink-0 items-center justify-center rounded-full ${
                    isOutgoing ? "bg-ink/8 text-ink-soft" : "bg-olive/15 text-olive"
                  }`}
                >
                  {isOutgoing ? (
                    <ArrowUpRight className="size-4" aria-hidden />
                  ) : (
                    <ArrowDownLeft className="size-4" aria-hidden />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-[14.5px] font-medium text-ink">{t.description}</p>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${meta.cls}`}>
                      {meta.label}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[12.5px] text-ink-soft">
                    {dateTimeFmt.format(new Date(t.created * 1000))}
                    {t.feeCents > 0 ? ` · comisión ${money(t.feeCents, t.currency)}` : ""}
                  </p>
                </div>
                <p
                  className={`shrink-0 text-[14.5px] font-medium tabular-nums ${
                    isOutgoing ? "text-ink-soft" : "text-ink"
                  }`}
                >
                  {isOutgoing ? "−" : "+"}
                  {money(Math.abs(t.netCents), t.currency)}
                </p>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
