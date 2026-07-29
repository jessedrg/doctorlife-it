import Link from "next/link"
import { requireRole } from "@/lib/session"
import { getMyDoctorProfile, getDoctorMetrics, getDoctorCapacity } from "@/app/actions/doctor"
import { getDoctorReadiness } from "@/lib/doctor/readiness"
import { DoctorOnboardingChecklist } from "@/components/doctor-onboarding-checklist"
import { DoctorMetricsGrid } from "@/components/doctor-metrics"

export const metadata = { title: "Panel de la clínica — DoctorLife" }

export default async function MedicoHome() {
  const user = await requireRole("doctor")
  // Asegura que exista el perfil antes de calcular el estado de preparación.
  await getMyDoctorProfile()
  const [readiness, metrics, capacity] = await Promise.all([
    getDoctorReadiness(user.id),
    getDoctorMetrics(),
    getDoctorCapacity(),
  ])
  const firstName = user.name.split(" ")[0]

  return (
    <div>
      <h1 className="text-[30px] font-light leading-tight tracking-[-.02em] text-ink text-balance">
        Dr. {firstName}
      </h1>
      <p className="mt-1.5 max-w-[60ch] text-[15.5px] leading-relaxed text-ink-soft">
        Gestiona tu disponibilidad, tus pacientes, recetas y pagos desde aquí.
      </p>

      {/* Aviso de capacidad */}
      {capacity.atCapacity && (
        <div className="mt-5 flex items-center justify-between gap-4 rounded-[14px] border border-clay/30 bg-clay/8 px-5 py-3.5">
          <p className="text-[14px] leading-snug text-clay">
            <span className="font-semibold">Límite de pacientes alcanzado.</span>{" "}
            Tienes {capacity.activeCount}/{capacity.maxPatients} pacientes activos. No apareces disponible para nuevas suscripciones.
          </p>
          <Link
            href="/clinica/cuenta"
            className="shrink-0 rounded-full border border-clay/40 px-3 py-1.5 text-[12.5px] font-medium text-clay no-underline hover:bg-clay/10 transition-colors"
          >
            Ajustar
          </Link>
        </div>
      )}
      {!capacity.atCapacity && capacity.nearCapacity && (
        <div className="mt-5 flex items-center justify-between gap-4 rounded-[14px] border border-amber/40 bg-amber/8 px-5 py-3.5">
          <p className="text-[14px] leading-snug text-ink">
            <span className="font-semibold">Casi al límite.</span>{" "}
            Tienes {capacity.activeCount}/{capacity.maxPatients} pacientes activos.
          </p>
          <Link
            href="/clinica/cuenta"
            className="shrink-0 rounded-full border border-ink/20 px-3 py-1.5 text-[12.5px] font-medium text-ink no-underline hover:bg-ink/5 transition-colors"
          >
            Ajustar
          </Link>
        </div>
      )}

      <div className="mt-7">
        <DoctorMetricsGrid metrics={metrics} />
      </div>

      <div className="mt-8">
        <DoctorOnboardingChecklist readiness={readiness} />
      </div>
    </div>
  )
}
