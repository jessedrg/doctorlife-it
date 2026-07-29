import { getMyPrescriptions } from "@/app/actions/prescriptions"
import {
  getMySubscription,
  getPatientStatus,
  syncSubscriptionBySession,
  activateOneTimeAccessBySession,
} from "@/app/actions/subscription"
import { requireRole } from "@/lib/session"
import { PrescriptionList } from "@/components/prescription-list"
import { hasPendingVerification } from "@/app/actions/verification"
import { getMyPlanOffer } from "@/app/actions/clinic-plans"
import { SubscriptionCard } from "@/components/subscription-card"

export default async function RecetasPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; subscription?: string }>
}) {
  const { session_id } = await searchParams

  if (session_id) {
    // Ambas son idempotentes y solo actúan sobre el modo que corresponde
    // (suscripción o pago único). Si falla, el webhook lo resolverá.
    try {
      await syncSubscriptionBySession(session_id)
    } catch {
      /* el webhook lo resolverá */
    }
    try {
      await activateOneTimeAccessBySession(session_id)
    } catch {
      /* el webhook lo resolverá */
    }
  }

  const me = await requireRole("patient")

  const [prescriptions, subscription, status, verificationPending, offer] = await Promise.all([
    getMyPrescriptions(),
    getMySubscription(),
    getPatientStatus(me.id),
    hasPendingVerification(me.id),
    getMyPlanOffer(),
  ])

  const isActive = status === "active" || status === "followup_available"
  const hasPrescription = prescriptions.length > 0

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold text-ink">Mis recetas</h1>
        <p className="mt-1 text-sm text-muted">
          {isActive
            ? "Descarga las recetas emitidas por tu médico en formato PDF."
            : status === "can_activate"
            ? "Tu médico ha preparado tu receta. Activa el tratamiento para descargarla."
            : status === "pending_prescription"
            ? "Tu médico está preparando tu plan de tratamiento. Aparecerá aquí en cuanto esté listo."
            : "Tu médico te enviará aquí las recetas cuando valore tu caso."}
        </p>
      </header>

      {/* Mostrar recetas si hay alguna */}
      <PrescriptionList prescriptions={prescriptions} locked={!isActive} />

      {/* Tarjeta de suscripción solo si no está activa todavía */}
      {!isActive && (
        <SubscriptionCard
          subscription={subscription}
          patientStatus={status}
          verificationPending={verificationPending}
          offer={offer}
        />
      )}
    </div>
  )
}
