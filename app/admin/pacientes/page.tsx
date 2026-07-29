import { requireRole } from "@/lib/session"
import { listPatients } from "@/app/actions/admin"
import { AdminPatientActions } from "@/components/admin-patient-actions"

export const metadata = { title: "Pacientes — DoctorLife" }

function fmtDate(d: Date) {
  return new Intl.DateTimeFormat("es-ES", { dateStyle: "medium" }).format(new Date(d))
}

export default async function AdminPatientsPage() {
  await requireRole("admin")
  const patients = await listPatients()

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[30px] font-light leading-tight tracking-[-.02em] text-ink text-balance">
            Pacientes ({patients.length})
          </h1>
          <p className="mt-1.5 max-w-[60ch] text-[15.5px] leading-relaxed text-ink-soft">
            Usuarios registrados como pacientes en la plataforma.
          </p>
        </div>
        <AdminPatientActions />
      </div>

      <div className="mt-6 overflow-x-auto rounded-[18px] border border-ink/10">
        <table className="w-full text-left text-[14px]">
          <thead className="bg-cream text-[12.5px] uppercase tracking-[.05em] text-ink-mute">
            <tr>
              <th className="px-4 py-3 font-semibold">Nombre</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Alta</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p.id} className="border-t border-ink/10 bg-warm">
                <td className="px-4 py-3 text-ink">{p.name}</td>
                <td className="px-4 py-3 text-ink-soft">{p.email}</td>
                <td className="px-4 py-3 text-ink-soft">{fmtDate(p.createdAt)}</td>
              </tr>
            ))}
            {patients.length === 0 && (
              <tr className="bg-warm">
                <td colSpan={3} className="px-4 py-6 text-center text-ink-mute">
                  Aún no hay pacientes registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
