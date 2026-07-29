import { requireRole } from "@/lib/session"
import { listDoctors } from "@/app/actions/admin"
import { AdminDoctorToggle } from "@/components/admin-doctor-toggle"
import { AdminDoctorDevToggle } from "@/components/admin-doctor-dev-toggle"
import { AdminCreateDoctor } from "@/components/admin-create-doctor"

export const metadata = { title: "Clínicas — DoctorLife" }

export default async function AdminClinicsPage() {
  await requireRole("admin")
  const doctors = await listDoctors()

  return (
    <div>
      <h1 className="text-[30px] font-light leading-tight tracking-[-.02em] text-ink text-balance">
        Clínicas ({doctors.length})
      </h1>
      <p className="mt-1.5 max-w-[60ch] text-[15.5px] leading-relaxed text-ink-soft">
        Invita a las clínicas de la plataforma y consulta su estado de cobros. Cada clínica
        gestiona su propio Stripe y sus datos fiscales desde su portal.
      </p>

      <div className="mt-6 max-w-[680px]">
        <AdminCreateDoctor />
      </div>

      <div className="mt-6 overflow-x-auto rounded-[18px] border border-ink/10">
        <table className="w-full text-left text-[14px]">
          <thead className="bg-cream text-[12.5px] uppercase tracking-[.05em] text-ink-mute">
            <tr>
              <th className="px-4 py-3 font-semibold">Nombre</th>
              <th className="px-4 py-3 font-semibold">Especialidad</th>
              <th className="px-4 py-3 font-semibold">Stripe</th>
              <th className="px-4 py-3 font-semibold">Estado</th>
              <th className="px-4 py-3 font-semibold">Entorno</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((d) => (
              <tr key={d.id} className="border-t border-ink/10 bg-warm">
                <td className="px-4 py-3">
                  <div className="text-ink">{d.name}</div>
                  <div className="text-[13px] text-ink-soft">{d.email}</div>
                </td>
                <td className="px-4 py-3 text-ink-soft">{d.specialty ?? "—"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ${
                      d.chargesEnabled ? "bg-sage/30 text-ink" : "bg-ink/10 text-ink-soft"
                    }`}
                  >
                    {d.chargesEnabled ? "Cobros activos" : d.stripeOnboarded ? "En revisión" : "Sin conectar"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <AdminDoctorToggle doctorId={d.id} initial={d.acceptingPatients ?? false} />
                </td>
                <td className="px-4 py-3">
                  <AdminDoctorDevToggle doctorId={d.id} initial={d.isDevOnly ?? false} />
                </td>
              </tr>
            ))}
            {doctors.length === 0 && (
              <tr className="bg-warm">
                <td colSpan={5} className="px-4 py-6 text-center text-ink-mute">
                  Aún no hay clínicas. Invita la primera con el formulario de arriba.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
