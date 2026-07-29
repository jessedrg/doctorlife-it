"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Search, MessageCircle, FileText, Users, ChevronDown } from "lucide-react"
import { UserAvatar } from "@/components/user-avatar"
import { EmptyState } from "@/components/empty-state"
import { PatientDetailPanel } from "@/components/patient-detail-panel"
import type { DoctorPatient } from "@/app/actions/doctor"

const dateFmt = new Intl.DateTimeFormat("es-ES", { dateStyle: "medium" })

const ACTIVE = ["active", "trialing", "past_due"]

function statusBadge(status: string | null) {
  if (status && ACTIVE.includes(status)) {
    return { label: "Tratamiento activo", cls: "bg-olive/15 text-olive" }
  }
  if (status === "canceled" || status === "incomplete") {
    return { label: "Tratamiento inactivo", cls: "bg-clay/15 text-clay" }
  }
  return { label: "Sin tratamiento", cls: "bg-ink/8 text-ink-soft" }
}

type Filter = "all" | "active" | "inactive"

export function DoctorPatientsList({ patients }: { patients: DoctorPatient[] }) {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<Filter>("all")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return patients.filter((p) => {
      const matchesQuery =
        !q || p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q)
      const isActive = p.subscriptionStatus && ACTIVE.includes(p.subscriptionStatus)
      const matchesFilter =
        filter === "all" || (filter === "active" ? isActive : !isActive)
      return matchesQuery && matchesFilter
    })
  }, [patients, query, filter])

  const tabs: { key: Filter; label: string }[] = [
    { key: "all", label: "Todos" },
    { key: "active", label: "En tratamiento" },
    { key: "inactive", label: "Sin tratamiento" },
  ]

  if (patients.length === 0) {
    return (
      <div className="mt-6">
        <EmptyState
          icon={Users}
          title="Aún no tienes pacientes"
          description="Cuando un paciente reserve una consulta contigo, aparecerá aquí con su estado de tratamiento, su historial de citas y accesos rápidos al chat y a las recetas."
          action={{ href: "/clinica/disponibilidad", label: "Revisar mi disponibilidad" }}
        />
      </div>
    )
  }

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 rounded-full border border-ink/15 bg-warm px-3.5 py-2.5 sm:w-[320px]">
          <Search className="size-4 shrink-0 text-ink-soft" aria-hidden />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre o email…"
            className="w-full bg-transparent text-[14px] text-ink outline-none placeholder:text-ink-soft"
          />
        </div>
        <div className="flex gap-1 rounded-full border border-ink/10 bg-cream p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setFilter(t.key)}
              className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                filter === t.key ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-[20px] border border-ink/10 bg-cream p-6 text-center text-[14px] text-ink-soft">
          No hay pacientes que coincidan.
        </div>
      ) : (
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => {
            const badge = statusBadge(p.subscriptionStatus)
            const isExpanded = expandedId === p.id
            return (
              <li
                key={p.id}
                className={`flex flex-col gap-4 rounded-[20px] border bg-cream p-5 ${
                  isExpanded
                    ? "border-ink/20 sm:col-span-2 xl:col-span-3"
                    : "border-ink/10"
                }`}
              >
                <div className="flex items-start gap-3">
                  <UserAvatar name={p.name} image={p.image} size={48} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15.5px] font-medium text-ink">{p.name}</p>
                    <p className="truncate text-[12.5px] text-ink-soft">{p.email}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${badge.cls}`}
                  >
                    {badge.label}
                  </span>
                </div>

                <dl className="grid grid-cols-3 gap-2 border-t border-ink/10 pt-3 text-center">
                  <div>
                    <dt className="text-[11px] uppercase tracking-[.04em] text-ink-mute">Citas</dt>
                    <dd className="mt-0.5 text-[15px] font-medium text-ink">
                      {p.totalAppointments}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-[.04em] text-ink-mute">Última</dt>
                    <dd className="mt-0.5 text-[12.5px] text-ink">
                      {p.lastVisit ? dateFmt.format(new Date(p.lastVisit)) : "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-[.04em] text-ink-mute">Próxima</dt>
                    <dd className="mt-0.5 text-[12.5px] text-ink">
                      {p.nextVisit ? dateFmt.format(new Date(p.nextVisit)) : "—"}
                    </dd>
                  </div>
                </dl>

                <div className="mt-auto flex gap-2">
                  <Link
                    href="/clinica/chat"
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-ink py-2 text-[13px] font-medium text-paper transition-opacity hover:opacity-90"
                  >
                    <MessageCircle className="size-4" aria-hidden />
                    Chat
                  </Link>
                  <Link
                    href="/clinica/recetas"
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-ink/15 py-2 text-[13px] font-medium text-ink transition-colors hover:bg-ink/5"
                  >
                    <FileText className="size-4" aria-hidden />
                    Recetar
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : p.id)}
                  aria-expanded={isExpanded}
                  className="flex items-center justify-center gap-1.5 rounded-full border border-ink/15 py-2 text-[13px] font-medium text-ink transition-colors hover:bg-ink/5"
                >
                  <ChevronDown
                    className={`size-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                  {isExpanded ? "Ocultar ficha" : "Ver ficha del paciente"}
                </button>

                {isExpanded ? <PatientDetailPanel patientId={p.id} /> : null}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
