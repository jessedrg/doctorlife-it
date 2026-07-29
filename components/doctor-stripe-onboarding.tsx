"use client"

import { useState, useTransition, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Check, Loader2, RefreshCw } from "lucide-react"
import { startStripeOnboarding, refreshStripeStatus } from "@/app/actions/doctor"

type Props = {
  hasAccount: boolean
  chargesEnabled: boolean
  payoutsEnabled: boolean
  onboarded: boolean
}

/** Interval between automatic polls while waiting for Stripe to confirm (ms). */
const POLL_INTERVAL = 4_000
/** Give up auto-polling after this many attempts. */
const POLL_MAX_ATTEMPTS = 30

export function DoctorStripeOnboarding({ hasAccount, chargesEnabled, payoutsEnabled, onboarded }: Props) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [pending, startTransition] = useTransition()

  // Polling state: active when account exists but onboarding is not yet complete.
  const [polling, setPolling] = useState(false)
  const [pollCount, setPollCount] = useState(0)
  const pollTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const stopPolling = useCallback(() => {
    setPolling(false)
    if (pollTimer.current) {
      clearTimeout(pollTimer.current)
      pollTimer.current = null
    }
  }, [])

  const doPoll = useCallback(async () => {
    setPollCount((c) => {
      if (c >= POLL_MAX_ATTEMPTS) {
        stopPolling()
        return c
      }
      return c + 1
    })

    try {
      await refreshStripeStatus()
      router.refresh()
    } catch {
      // non-fatal; keep trying
    }
  }, [router, stopPolling])

  // Start polling as soon as the account exists but onboarding is incomplete.
  useEffect(() => {
    if (hasAccount && !onboarded && !polling) {
      setPolling(true)
      setPollCount(0)
    }
    if (onboarded) {
      stopPolling()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasAccount, onboarded])

  // Schedule the next poll tick whenever `polling` is active.
  useEffect(() => {
    if (!polling) return
    if (pollCount >= POLL_MAX_ATTEMPTS) {
      stopPolling()
      return
    }
    pollTimer.current = setTimeout(doPoll, POLL_INTERVAL)
    return () => {
      if (pollTimer.current) clearTimeout(pollTimer.current)
    }
  }, [polling, pollCount, doPoll, stopPolling])

  async function handleStart() {
    setError(null)
    setLoading(true)
    try {
      const result = await startStripeOnboarding()
      if (result.url) {
        window.location.href = result.url
        return
      }
      setError(result.error ?? "No se pudo iniciar el proceso.")
      setLoading(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo iniciar el proceso.")
      setLoading(false)
    }
  }

  function handleRefresh() {
    setError(null)
    startTransition(async () => {
      try {
        await refreshStripeStatus()
        router.refresh()
      } catch (e) {
        setError(e instanceof Error ? e.message : "No se pudo actualizar el estado.")
      }
    })
  }

  return (
    <div className="overflow-hidden rounded-[22px] border border-ink/10 bg-cream">
      <div className="flex items-start justify-between gap-4 p-6">
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-ink/10 bg-paper shadow-sm">
            <Image src="/brand/stripe.svg" alt="Stripe" width={26} height={26} />
          </span>
          <div>
            <h2 className="text-[18px] font-medium text-ink">Cuenta de cobros · Stripe</h2>
            <p className="mt-1 max-w-[52ch] text-[14.5px] leading-relaxed text-ink-soft">
              Conecta tu cuenta de Stripe para recibir los pagos de tus pacientes. DoctorLife retiene una
              comisión de servicio y te transfiere el resto automáticamente.
            </p>
          </div>
        </div>
        <StatusBadge onboarded={onboarded} polling={polling} />
      </div>

      <div className="grid gap-2.5 px-6 sm:grid-cols-2">
        <Flag label="Cobros habilitados" ok={chargesEnabled} />
        <Flag label="Transferencias habilitadas" ok={payoutsEnabled} />
      </div>

      {/* Auto-poll notice */}
      {polling && !onboarded && (
        <div className="mx-6 mt-4 flex items-center gap-2 rounded-xl border border-amber/30 bg-amber/8 px-4 py-3">
          <Loader2 className="size-4 shrink-0 animate-spin text-clay" aria-hidden />
          <p className="text-[13.5px] text-ink-soft">
            Verificando el estado de tu cuenta de Stripe automáticamente…
          </p>
        </div>
      )}

      {/* Give-up notice when max polls exceeded */}
      {!polling && hasAccount && !onboarded && pollCount >= POLL_MAX_ATTEMPTS && (
        <div className="mx-6 mt-4 rounded-xl border border-ink/15 bg-paper px-4 py-3">
          <p className="text-[13.5px] text-ink-soft">
            Stripe aún no ha confirmado la cuenta. Pulsa «Actualizar estado» cuando termines el proceso.
          </p>
        </div>
      )}

      {error && <p className="px-6 pt-4 text-[13.5px] text-clay">{error}</p>}

      <div className="mt-5 flex flex-wrap gap-3 border-t border-ink/10 bg-paper/40 px-6 py-4">
        <button
          type="button"
          onClick={handleStart}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[14px] font-semibold text-paper transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
          {loading
            ? "Redirigiendo…"
            : hasAccount && !onboarded
              ? "Continuar configuración"
              : onboarded
                ? "Gestionar en Stripe"
                : "Conectar con Stripe"}
        </button>
        {hasAccount && (
          <button
            type="button"
            onClick={handleRefresh}
            disabled={pending || polling}
            className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-paper px-5 py-2.5 text-[14px] font-medium text-ink transition-colors hover:bg-warm disabled:opacity-60"
          >
            <RefreshCw className={`size-3.5 ${pending ? "animate-spin" : ""}`} aria-hidden />
            {pending ? "Comprobando…" : "Actualizar estado"}
          </button>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ onboarded, polling }: { onboarded: boolean; polling: boolean }) {
  if (onboarded) {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-olive/12 px-3 py-1 text-[12px] font-semibold text-olive">
        <Check className="size-3.5" aria-hidden />
        Activa
      </span>
    )
  }
  if (polling) {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-amber/20 px-3 py-1 text-[12px] font-semibold text-clay">
        <Loader2 className="size-3 animate-spin" aria-hidden />
        Verificando…
      </span>
    )
  }
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-amber/20 px-3 py-1 text-[12px] font-semibold text-clay">
      Pendiente
    </span>
  )
}

function Flag({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-ink/10 bg-paper px-3.5 py-2.5">
      <span
        className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${
          ok ? "bg-olive text-paper" : "border border-ink/20 text-ink-mute"
        }`}
      >
        {ok ? <Check className="size-3" aria-hidden /> : <span className="text-[11px]">—</span>}
      </span>
      <span className="text-[13.5px] text-ink-soft">{label}</span>
    </div>
  )
}
