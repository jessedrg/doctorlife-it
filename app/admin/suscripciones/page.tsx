import { requireRole } from "@/lib/session"
import { listSubscriptions } from "@/app/actions/admin"
import { CATALOG } from "@/lib/catalog"

/** Nombres de planes de pago único (para mostrar el importe sin "/mes"). */
const ONE_TIME_PLAN_NAMES = new Set(
  CATALOG.filter((p) => p.model !== "subscription").map((p) => p.name),
)

export const metadata = { title: "Suscripciones — DoctorLife" }

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

export default async function AdminSubscriptionsPage() {
  await requireRole("admin")
  const subs = await listSubscriptions()

  return (
    <div>
      <h1 className="text-[30px] font-light leading-tight tracking-[-.02em] text-ink text-balance">
        Suscripciones ({subs.length})
      </h1>
      <p className="mt-1.5 max-w-[60ch] text-[15.5px] leading-relaxed text-ink-soft">
        Tratamientos activos (suscripción mensual y packs de pago único) y su estado de cobro.
      </p>

      <div className="mt-6 overflow-x-auto rounded-[18px] border border-ink/10">
        <table className="w-full text-left text-[14px]">
          <thead className="bg-cream text-[12.5px] uppercase tracking-[.05em] text-ink-mute">
            <tr>
              <th className="px-4 py-3 font-semibold">Paciente</th>
              <th className="px-4 py-3 font-semibold">Médico</th>
              <th className="px-4 py-3 font-semibold">Plan</th>
              <th className="px-4 py-3 font-semibold">Importe</th>
              <th className="px-4 py-3 font-semibold">Estado</th>
            </tr>
          </thead>
          <tbody>
            {subs.map((s) => (
              <tr key={s.id} className="border-t border-ink/10 bg-warm">
                <td className="px-4 py-3 text-ink">{s.patientName ?? "—"}</td>
                <td className="px-4 py-3 text-ink-soft">{s.doctorName ?? "—"}</td>
                <td className="px-4 py-3 text-ink-soft">{s.plan}</td>
                <td className="px-4 py-3 text-ink">
                  {eur(s.priceCents)}
                  {ONE_TIME_PLAN_NAMES.has(s.plan) ? " · pago único" : "/mes"}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-sage/30 px-2.5 py-1 text-[12px] font-semibold text-ink">
                    {STATUS_LABELS[s.status] ?? s.status}
                    {s.cancelAtPeriodEnd ? " · cancela" : ""}
                  </span>
                </td>
              </tr>
            ))}
            {subs.length === 0 && (
              <tr className="bg-warm">
                <td colSpan={5} className="px-4 py-6 text-center text-ink-mute">
                  Aún no hay suscripciones.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
