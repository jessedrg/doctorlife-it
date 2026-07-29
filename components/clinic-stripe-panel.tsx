"use client"

import { useState, useTransition } from "react"
import { Loader2, ExternalLink, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react"
import {
  startClinicStripeOnboarding,
  refreshClinicStripeStatus,
  type ClinicStatus,
} from "@/app/actions/clinic"

export function ClinicStripePanel({ status }: { status: ClinicStatus }) {
  const [pending, startTransition] = useTransition()
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function onboard() {
    setError(null)
    startTransition(async () => {
      const res = await startClinicStripeOnboarding()
      if ("error" in res) {
        setError(res.error)
        return
      }
      window.location.href = res.url
    })
  }

  async function refresh() {
    setError(null)
    setRefreshing(true)
    const res = await refreshClinicStripeStatus()
    setRefreshing(false)
    if ("error" in res) {
      setError(res.error)
      return
    }
    window.location.reload()
  }

  const ready = status.ready

  return (
    <div className="rounded-[18px] border border-ink/10 bg-warm p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[17px] font-medium text-ink">Cuenta de cobros de la clínica</h2>
          <p className="mt-1 max-w-[56ch] text-[14.5px] leading-relaxed text-ink-soft">
            La clínica es la entidad sanitaria que cobra y factura el acto médico.
            DoctorLife solo retiene su comisión de servicio tecnológico.
          </p>
        </div>
        <span
          className={
            "shrink-0 rounded-full px-3 py-1 text-[12.5px] font-semibold " +
            (ready ? "bg-sage/40 text-ink" : "bg-amber-100 text-amber-900")
          }
        >
          {ready ? "Cobros activos" : "Pendiente"}
        </span>
      </div>

      <ul className="mt-4 grid gap-2 text-[14px]">
        <StatusRow ok={Boolean(status.stripeAccountId)} label="Cuenta de Stripe creada" />
        <StatusRow ok={status.stripeOnboarded} label="Onboarding completado" />
        <StatusRow ok={status.chargesEnabled} label="Puede aceptar pagos" />
        <StatusRow ok={status.payoutsEnabled} label="Puede recibir liquidaciones" />
      </ul>

      {error && (
        <p className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 px-3 py-2 text-[13.5px] text-red-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          {error}
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onboard}
          disabled={pending}
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 text-[14.5px] font-medium text-warm transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <ExternalLink className="h-4 w-4" aria-hidden />
          )}
          {status.stripeAccountId ? "Continuar onboarding" : "Conectar la clínica con Stripe"}
        </button>

        {status.stripeAccountId && (
          <button
            type="button"
            onClick={refresh}
            disabled={refreshing}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-ink/15 px-5 text-[14.5px] font-medium text-ink transition-colors hover:bg-cream disabled:opacity-60"
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <RefreshCw className="h-4 w-4" aria-hidden />
            )}
            Comprobar estado
          </button>
        )}
      </div>
    </div>
  )
}

function StatusRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className="flex items-center gap-2.5">
      {ok ? (
        <CheckCircle2 className="h-[18px] w-[18px] text-emerald-600" aria-hidden />
      ) : (
        <span className="h-[18px] w-[18px] rounded-full border-2 border-ink/20" aria-hidden />
      )}
      <span className={ok ? "text-ink" : "text-ink-mute"}>{label}</span>
    </li>
  )
}
