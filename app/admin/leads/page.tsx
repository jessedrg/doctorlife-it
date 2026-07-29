import { requireRole } from "@/lib/session"
import { listLeads } from "@/app/actions/admin"

export const metadata = { title: "Leads — DoctorLife" }

function fmtDate(d: Date) {
  return new Intl.DateTimeFormat("es-ES", { dateStyle: "medium" }).format(new Date(d))
}

export default async function AdminLeadsPage() {
  await requireRole("admin")
  const leads = await listLeads()

  return (
    <div>
      <h1 className="text-[30px] font-light leading-tight tracking-[-.02em] text-ink text-balance">
        Leads ({leads.length})
      </h1>
      <p className="mt-1.5 max-w-[60ch] text-[15.5px] leading-relaxed text-ink-soft">
        Personas que completaron el quiz de la landing.
      </p>

      <div className="mt-6 overflow-x-auto rounded-[18px] border border-ink/10">
        <table className="w-full text-left text-[14px]">
          <thead className="bg-cream text-[12.5px] uppercase tracking-[.05em] text-ink-mute">
            <tr>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Objetivo</th>
              <th className="px-4 py-3 font-semibold">Plan</th>
              <th className="px-4 py-3 font-semibold">IMC</th>
              <th className="px-4 py-3 font-semibold">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l.id} className="border-t border-ink/10 bg-warm">
                <td className="px-4 py-3">
                  <div className="text-ink">{l.email}</div>
                  {l.name && <div className="text-[13px] text-ink-soft">{l.name}</div>}
                </td>
                <td className="px-4 py-3 text-ink-soft">{l.goal ?? "—"}</td>
                <td className="px-4 py-3 text-ink-soft">{l.plan ?? "—"}</td>
                <td className="px-4 py-3 text-ink-soft">{l.bmi ?? "—"}</td>
                <td className="px-4 py-3 text-ink-soft">{fmtDate(l.createdAt)}</td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr className="bg-warm">
                <td colSpan={5} className="px-4 py-6 text-center text-ink-mute">
                  Aún no hay leads del quiz.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
