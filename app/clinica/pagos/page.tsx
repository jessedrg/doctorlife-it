import { requireRole } from "@/lib/session"
import { getDoctorBilling } from "@/app/actions/doctor"
import { getClinicStatus } from "@/app/actions/clinic"
import { DoctorBillingOverview } from "@/components/doctor-billing-overview"
import { ClinicStripePanel } from "@/components/clinic-stripe-panel"
import { ClinicDetailsForm } from "@/components/clinic-details-form"
import { Info } from "lucide-react"

export const metadata = { title: "Cobros y facturación — DoctorLife" }

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
        Cobros y facturación
      </h1>
      <p className="mt-1.5 max-w-[62ch] text-[15.5px] leading-relaxed text-ink-soft">
        Tu clínica es la entidad sanitaria que cobra y factura los actos médicos. Conecta
        tu cuenta de Stripe y completa los datos fiscales para poder recibir pagos.
      </p>

      <div className="mt-6 grid max-w-[720px] gap-5">
        <ClinicStripePanel status={status} />
        <ClinicDetailsForm status={status} />
      </div>

      <section className="mt-10">
        <h2 className="text-[20px] font-medium text-ink">Suscripciones de tus pacientes</h2>
        <p className="mt-1 flex items-center gap-1.5 text-[14px] text-ink-soft">
          <Info className="h-3.5 w-3.5" aria-hidden />
          Estado de las suscripciones activas y su actividad.
        </p>
        <div className="mt-5">
          <DoctorBillingOverview billing={billing} />
        </div>
      </section>
    </div>
  )
}
