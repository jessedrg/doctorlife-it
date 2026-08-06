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
  active: "Attivo",
  trialing: "In prova",
  past_due: "Pagamento in sospeso",
  incomplete: "Incompleto",
  canceled: "Annullato",
}

function eur(cents: number) {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(cents / 100)
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
      setError(res.error ?? "Impossibile annullare.")
      return
    }
    router.refresh()
  }

  return (
    <div className="rounded-[20px] border border-ink/10 bg-cream p-5">
      <h2 className="text-[16px] font-medium text-ink">Abbonamento al trattamento</h2>

      {/* ── Estado 1: sin cita todavía ── */}
      {patientStatus === "pending_appointment" && (
        <div className="mt-3 flex items-start gap-3">
          <Clock className="mt-0.5 size-4 shrink-0 text-ink-soft" aria-hidden />
          <div>
            <p className="text-[14px] font-medium text-ink">Il tuo medico sta valutando la tua richiesta</p>
            <p className="mt-1 text-[13.5px] leading-relaxed text-ink-soft">
              Riceverai una notifica quando ti invierà un appuntamento. Una volta confermato, il tuo
              medico preparerà il tuo piano di trattamento.
            </p>
          </div>
        </div>
      )}

      {/* ── Estado 2: cita confirmada, esperando receta ── */}
      {patientStatus === "pending_prescription" && (
        <div className="mt-3 flex items-start gap-3">
          <FileText className="mt-0.5 size-4 shrink-0 text-ink-soft" aria-hidden />
          <div>
            <p className="text-[14px] font-medium text-ink">In attesa del tuo piano di trattamento</p>
            <p className="mt-1 text-[13.5px] leading-relaxed text-ink-soft">
              Il tuo appuntamento è confermato. Quando il tuo medico completerà la valutazione ti
              invierà la ricetta e potrai attivare il trattamento.
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
                  ? `${offer.doctorName ? `Dr. ${offer.doctorName}` : "Il tuo medico"} ti ha inviato il tuo piano`
                  : "Il tuo piano di trattamento è pronto"}
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">
                {offer?.oneTime
                  ? "Il tuo medico ha preparato la tua ricetta. Effettua il pagamento del programma per scaricarla e iniziare il trattamento."
                  : "Il tuo medico ha preparato la tua ricetta. Attiva l'abbonamento mensile per scaricarla e iniziare il trattamento."}
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
                      Pagamento unico
                    </span>
                  )}
                </p>
                <p className="text-[14px] font-semibold text-ink">{offer.priceLabel}</p>
              </div>
              {offer.oneTime && offer.product.accessMonths ? (
                <p className="mt-0.5 text-[12.5px] text-ink-mute">
                  Un unico pagamento con {offer.product.accessMonths} mesi di accesso al trattamento.
                </p>
              ) : (
                <p className="mt-0.5 text-[12.5px] text-ink-mute">
                  Nessun vincolo: disdici quando vuoi.
                </p>
              )}
              {offer.note ? (
                <p className="mt-2 border-t border-ink/10 pt-2 text-[13px] leading-relaxed text-ink-soft">
                  <span className="font-medium text-ink">Nota del tuo medico:</span> {offer.note}
                </p>
              ) : null}
            </div>
          ) : null}

          <p className="text-[14px] leading-relaxed text-ink-soft">
            {offer?.oneTime
              ? "Include monitoraggio medico, ricetta quando necessario e una consulenza telefonica al mese per tutta la durata del programma."
              : "Include monitoraggio con il tuo medico, una consulenza telefonica al mese e chat dal vivo. Puoi disdire quando vuoi."}
          </p>

          {verificationPending ? (
            <div className="mt-4 flex items-start gap-2.5 rounded-[14px] border border-amber/30 bg-amber/[.08] p-3.5">
              <ShieldAlert className="mt-0.5 size-4 shrink-0 text-amber" aria-hidden />
              <div>
                <p className="text-[13.5px] font-medium text-ink">
                  Il tuo medico ha bisogno di una verifica prima di attivare il trattamento
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">
                  Completala per poter continuare. È riservata: la vedrà solo il tuo medico.
                </p>
                <Link
                  href="/portal/verificacion"
                  className="mt-2.5 inline-flex rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-paper transition-opacity hover:opacity-90"
                >
                  Completa la verifica
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
                ? "Reindirizzamento…"
                : offer?.oneTime
                  ? "Paga il programma — vedi la mia ricetta"
                  : "Attiva l'abbonamento — vedi la mia ricetta"}
            </button>
          )}
        </div>
      )}

      {/* ��─ Estado 4 y 5: suscripción activa ── */}
      {(patientStatus === "active" || patientStatus === "followup_available") && isActive && (
        <div className="mt-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[15px] font-medium text-ink">{subscription!.plan}</p>
            <span className="rounded-full bg-sage/30 px-2.5 py-1 text-[12px] font-semibold text-ink">
              {STATUS_LABELS[subscription!.status] ?? subscription!.status}
            </span>
          </div>
          <p className="mt-1 text-[14px] text-ink-soft">
            {eur(subscription!.priceCents)} al mese
            {subscription!.doctorName ? ` · ${subscription!.doctorName}` : ""}
          </p>
          {subscription!.currentPeriodEnd ? (
            <p className="mt-1 text-[13px] text-ink-mute">
              {subscription!.cancelAtPeriodEnd ? "Termina il " : "Prossimo rinnovo il "}
              {new Intl.DateTimeFormat("it-IT", { dateStyle: "long" }).format(
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
                  La tua videochiamata di follow-up è disponibile
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">
                  Il tuo abbonamento è stato rinnovato. Prenota il tuo appuntamento di follow-up con il tuo medico.
                </p>
                <Link
                  href="/portal/reservar"
                  className="mt-2.5 inline-flex rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-paper transition-opacity hover:opacity-90"
                >
                  Prenota follow-up
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
              {loading ? "Elaborazione…" : "Disdici alla fine del periodo"}
            </button>
          ) : (
            <p className="mt-4 text-[13.5px] text-ink-soft">
              Il tuo abbonamento verrà annullato alla fine del periodo attuale.
            </p>
          )}
        </div>
      )}

      {error ? <p className="mt-3 text-[13.5px] text-clay">{error}</p> : null}
    </div>
  )
}
