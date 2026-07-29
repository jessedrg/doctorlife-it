"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CalendarClock, Clock, FileText, ShieldAlert, CheckCircle2 } from "lucide-react"
import { startSubscriptionCheckout, cancelMySubscription } from "@/app/actions/subscription"
import type { PatientStatus } from "@/app/actions/subscription"
import type { MyPlanOffer } from "@/app/actions/clinic-plans"

interface SubscriptionView {
  plan: string
  priceCents: number
  status: string
  currentPeriodEnd: Date | string | null
  cancelAtPeriodEnd: boolean
  doctorName: string | null
  followupDueAt?: Date | string | null
}

const STATUS_LABELS: Record<string, string> = {
  active: "Activa",
  trialing: "En prueba",
  past_due: "Pago pendiente",
  incomplete: "Sin completar",
  canceled: "Cancelada",
}

function eur(cents: number) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(cents / 100)
}

export function SubscriptionCard({
  subscription,
  patientStatus,
  verificationPending = false,
  offer = null,
}: {
  subscription: SubscriptionView | null
  patientStatus: PatientStatus
  verificationPending?: boolean
  offer?: MyPlanOffer | null
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isActive =
    subscription && ["active", "trialing", "past_due"].includes(subscription.status)

  async function onSubscribe() {
    setLoading(true)
    setError(null)
    const res = await startSubscriptionCheckout()
    if ("url" in res) {
      window.location.href = res.url
      return
    }
    setError(res.error)
    setLoading(false)
  }

  async function onCancel() {
    setLoading(true)
    setError(null)
    const res = await cancelMySubscription()
    setLoading(false)
    if (!res.ok) {
      setError(res.error ?? "No se pudo cancelar.")
      return
    }
    router.refresh()
  }

  return (
    <div className="rounded-[20px] border border-ink/10 bg-cream p-5">
      <h2 className="text-[16px] font-medium text-ink">Suscripción de tratamiento</h2>

      {/* ── Estado 1: sin cita todavía ── */}
      {patientStatus === "pending_appointment" && (
        <div className="mt-3 flex items-start gap-3">
          <Clock className="mt-0.5 size-4 shrink-0 text-ink-soft" aria-hidden />
          <div>
            <p className="text-[14px] font-medium text-ink">Tu médico está valorando tu solicitud</p>
            <p className="mt-1 text-[13.5px] leading-relaxed text-ink-soft">
              Recibirás una notificación cuando te envíe una cita. Una vez confirmada, tu médico
              preparará tu plan de tratamiento.
            </p>
          </div>
        </div>
      )}

      {/* ── Estado 2: cita confirmada, esperando receta ── */}
      {patientStatus === "pending_prescription" && (
        <div className="mt-3 flex items-start gap-3">
          <FileText className="mt-0.5 size-4 shrink-0 text-ink-soft" aria-hidden />
          <div>
            <p className="text-[14px] font-medium text-ink">Esperando tu plan de tratamiento</p>
            <p className="mt-1 text-[13.5px] leading-relaxed text-ink-soft">
              Tu cita está confirmada. Cuando tu médico termine la valoración te enviará la receta
              y podrás activar el tratamiento.
            </p>
          </div>
        </div>
      )}

      {/* ── Estado 3: receta lista, puede activar ── */}
      {patientStatus === "can_activate" && (
        <div className="mt-3">
          <div className="mb-4 flex items-start gap-3 rounded-[14px] border border-sage/30 bg-sage/10 p-3.5">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-sage" aria-hidden />
            <div>
              <p className="text-[13.5px] font-medium text-ink">
                {offer
                  ? `${offer.doctorName ? `Dr. ${offer.doctorName}` : "Tu médico"} te ha enviado tu plan`
                  : "Tu plan de tratamiento ya está listo"}
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">
                {offer?.oneTime
                  ? "Tu médico ha preparado tu receta. Realiza el pago del programa para descargarla y empezar el tratamiento."
                  : "Tu médico ha preparado tu receta. Activa la suscripción mensual para descargarla y empezar el tratamiento."}
              </p>
            </div>
          </div>

          {offer ? (
            <div className="mb-4 rounded-[14px] border border-ink/10 bg-warm p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-[15px] font-medium text-ink">
                  {offer.product.name}
                  {offer.oneTime && (
                    <span className="ml-2 rounded-full bg-ink/10 px-2 py-0.5 text-[11px] font-medium text-ink-soft align-middle">
                      Pago único
                    </span>
                  )}
                </p>
                <p className="text-[14px] font-semibold text-ink">{offer.priceLabel}</p>
              </div>
              {offer.oneTime && offer.product.accessMonths ? (
                <p className="mt-0.5 text-[12.5px] text-ink-mute">
                  Un solo pago con {offer.product.accessMonths} meses de acceso al tratamiento.
                </p>
              ) : (
                <p className="mt-0.5 text-[12.5px] text-ink-mute">
                  Sin permanencia: cancela cuando quieras.
                </p>
              )}
              {offer.note ? (
                <p className="mt-2 border-t border-ink/10 pt-2 text-[13px] leading-relaxed text-ink-soft">
                  <span className="font-medium text-ink">Nota de tu médico:</span> {offer.note}
                </p>
              ) : null}
            </div>
          ) : null}

          <p className="text-[14px] leading-relaxed text-ink-soft">
            {offer?.oneTime
              ? "Incluye seguimiento médico, receta cuando proceda y una consulta por llamada al mes durante todo el programa."
              : "Incluye seguimiento con tu médico, una consulta por llamada al mes y chat en vivo. Puedes cancelar cuando quieras."}
          </p>

          {verificationPending ? (
            <div className="mt-4 flex items-start gap-2.5 rounded-[14px] border border-amber/30 bg-amber/[.08] p-3.5">
              <ShieldAlert className="mt-0.5 size-4 shrink-0 text-amber" aria-hidden />
              <div>
                <p className="text-[13.5px] font-medium text-ink">
                  Tu médico necesita una verificación antes de activar el tratamiento
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">
                  Complétala para poder continuar. Es confidencial: solo la verá tu médico.
                </p>
                <Link
                  href="/portal/verificacion"
                  className="mt-2.5 inline-flex rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-paper transition-opacity hover:opacity-90"
                >
                  Completar verificación
                </Link>
              </div>
            </div>
          ) : (
            <button
              onClick={onSubscribe}
              disabled={loading}
              className="mt-4 inline-flex rounded-full bg-ink px-4 py-2 text-[13.5px] font-medium text-paper transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading
                ? "Redirigiendo…"
                : offer?.oneTime
                  ? "Pagar programa — ver mi receta"
                  : "Activar suscripción — ver mi receta"}
            </button>
          )}
        </div>
      )}

      {/* ── Estado 4 y 5: suscripción activa ── */}
      {(patientStatus === "active" || patientStatus === "followup_available") && isActive && (
        <div className="mt-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[15px] font-medium text-ink">{subscription!.plan}</p>
            <span className="rounded-full bg-sage/30 px-2.5 py-1 text-[12px] font-semibold text-ink">
              {STATUS_LABELS[subscription!.status] ?? subscription!.status}
            </span>
          </div>
          <p className="mt-1 text-[14px] text-ink-soft">
            {eur(subscription!.priceCents)} al mes
            {subscription!.doctorName ? ` · ${subscription!.doctorName}` : ""}
          </p>
          {subscription!.currentPeriodEnd ? (
            <p className="mt-1 text-[13px] text-ink-mute">
              {subscription!.cancelAtPeriodEnd ? "Finaliza el " : "Próxima renovación el "}
              {new Intl.DateTimeFormat("es-ES", { dateStyle: "long" }).format(
                new Date(subscription!.currentPeriodEnd),
              )}
            </p>
          ) : null}

          {/* Seguimiento disponible tras renovación */}
          {patientStatus === "followup_available" && (
            <div className="mt-4 flex items-start gap-3 rounded-[14px] border border-amber/30 bg-amber/[.08] p-3.5">
              <CalendarClock className="mt-0.5 size-4 shrink-0 text-amber" aria-hidden />
              <div>
                <p className="text-[13.5px] font-medium text-ink">
                  Tu videollamada de seguimiento está disponible
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">
                  Tu suscripción se ha renovado. Reserva tu cita de seguimiento con tu médico.
                </p>
                <Link
                  href="/portal/reservar"
                  className="mt-2.5 inline-flex rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-paper transition-opacity hover:opacity-90"
                >
                  Reservar seguimiento
                </Link>
              </div>
            </div>
          )}

          {!subscription!.cancelAtPeriodEnd ? (
            <button
              onClick={onCancel}
              disabled={loading}
              className="mt-4 inline-flex rounded-full border border-ink/20 px-4 py-2 text-[13.5px] font-medium text-ink transition-colors hover:bg-ink/5 disabled:opacity-60"
            >
              {loading ? "Procesando…" : "Cancelar al final del periodo"}
            </button>
          ) : (
            <p className="mt-4 text-[13.5px] text-ink-soft">
              Tu suscripción se cancelará al final del periodo actual.
            </p>
          )}
        </div>
      )}

      {error ? <p className="mt-3 text-[13.5px] text-clay">{error}</p> : null}
    </div>
  )
}
