import { requireRole } from "@/lib/session"
import { getDoctorBilling } from "@/app/actions/doctor"
import { getClinicStatus } from "@/app/actions/clinic"
import { DoctorBillingOverview } from "@/components/doctor-billing-overview"
import { ClinicStripePanel } from "@/components/clinic-stripe-panel"
import { ClinicDetailsForm } from "@/components/clinic-details-form"
import { Info } from "lucide-react"

export const metadata = { title: "Pagamenti e fatturazione — DoctorLife" }

export default async function ClinicaPagosPage() {
  await requireRole("doctor")

  const [status, billing] = await Promise.all([
    getClinicStatus(),
    getDoctorBilling().catch(() => ({
      subscriptions: [],
      commissions: [],
      totalCommissionCents: 0,
      activeCount: 0,
      upcomingPayouts: [],
      upcomingTotalCents: 0,
    })),
  ])

  return (
    <div>
      <h1 className="text-[28px] font-light leading-tight tracking-[-.02em] text-ink">
        Pagamenti e fatturazione
      </h1>
      <p className="mt-1.5 max-w-[62ch] text-[15.5px] leading-relaxed text-ink-soft">
        La tua clinica è l'ente sanitario che incassa e fattura le prestazioni mediche. Collega
        il tuo account Stripe e completa i dati fiscali per poter ricevere i pagamenti.
      </p>

      <div className="mt-6 grid max-w-[720px] gap-5">
        <ClinicStripePanel status={status} />
        <ClinicDetailsForm status={status} />
      </div>

      <section className="mt-10">
        <h2 className="text-[20px] font-medium text-ink">Abbonamenti dei tuoi pazienti</h2>
        <p className="mt-1 flex items-center gap-1.5 text-[14px] text-ink-soft">
          <Info className="h-3.5 w-3.5" aria-hidden />
          Stato degli abbonamenti attivi e relativa attività.
        </p>
        <div className="mt-5">
          <DoctorBillingOverview billing={billing} />
        </div>
      </section>
    </div>
  )
}
