import { requireRole } from "@/lib/session"
import { getAdminMetrics, listUsers } from "@/app/actions/admin"
import { MetricCard } from "@/components/metric-card"

export const metadata = { title: "Administración — DoctorLife" }

const roleLabels: Record<string, string> = {
  patient: "Paciente",
  doctor: "Médico",
  admin: "Admin",
}

function eur(cents: number) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(cents / 100)
}

export default async function AdminHome() {
  await requireRole("admin")
  const [users, metrics] = await Promise.all([listUsers(), getAdminMetrics()])

  return (
    <div>
      <h1 className="text-[30px] font-light leading-tight tracking-[-.02em] text-ink text-balance">
        Administración
      </h1>
      <p className="mt-1.5 max-w-[60ch] text-[15.5px] leading-relaxed text-ink-soft">
        Supervisa médicos, pacientes, citas y pagos de la plataforma.
      </p>

      <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-3">
        <MetricCard label="Médicos" value={String(metrics.doctors)} />
        <MetricCard label="Pacientes" value={String(metrics.patients)} />
        <MetricCard label="Leads (quiz)" value={String(metrics.leads)} />
        <MetricCard label="Citas confirmadas" value={String(metrics.confirmedAppointments)} />
        <MetricCard
          label="Ingresos brutos"
          value={eur(metrics.grossRevenueCents)}
          hint="Primeras visitas pagadas"
        />
        <MetricCard
          label="Comisión plataforma"
          value={eur(metrics.platformFeesCents)}
          hint="Application fees acumuladas"
        />
        <MetricCard label="Suscripciones activas" value={String(metrics.activeSubscriptions)} />
        <MetricCard label="MRR" value={eur(metrics.mrrCents)} hint="Ingreso recurrente mensual" />
      </div>

      <div className="mt-7">
        <h2 className="text-[18px] font-medium text-ink">Usuarios ({users.length})</h2>
        <div className="mt-3 overflow-hidden rounded-[18px] border border-ink/10">
          <table className="w-full text-left text-[14px]">
            <thead className="bg-cream text-[12.5px] uppercase tracking-[.05em] text-ink-mute">
              <tr>
                <th className="px-4 py-3 font-semibold">Nombre</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Rol</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-ink/10 bg-warm">
                  <td className="px-4 py-3 text-ink">{u.name}</td>
                  <td className="px-4 py-3 text-ink-soft">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-sage/30 px-2.5 py-1 text-[12px] font-semibold text-ink">
                      {roleLabels[u.role] ?? u.role}
                    </span>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr className="bg-warm">
                  <td colSpan={3} className="px-4 py-6 text-center text-ink-mute">
                    Aún no hay usuarios registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
