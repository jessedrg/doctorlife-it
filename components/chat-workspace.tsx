"use client"

import { useMemo, useState, useTransition } from "react"
import { Search, MessageCircle, Inbox, Clock3, Archive } from "lucide-react"
import { ChatThread } from "@/components/chat-thread"
import { UserAvatar } from "@/components/user-avatar"
import {
  setConversationStatus,
  type ConversationSummary,
  type DoctorConversationStatus,
} from "@/app/actions/chat"

const dateFmt = new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short" })

const STATUS_TABS: { key: DoctorConversationStatus; label: string; icon: typeof Inbox }[] = [
  { key: "active", label: "Activos", icon: Inbox },
  { key: "pending", label: "Pendientes", icon: Clock3 },
  { key: "archived", label: "Archivados", icon: Archive },
]

const STATUS_LABEL: Record<DoctorConversationStatus, string> = {
  active: "Activo",
  pending: "Pendiente",
  archived: "Archivado",
}

export function ChatWorkspace({
  conversations,
  canRequestAnalysis = false,
  isDoctor = false,
}: {
  conversations: ConversationSummary[]
  canRequestAnalysis?: boolean
  /** Lado médico: habilita "Ver ficha" del paciente en el hilo. */
  isDoctor?: boolean
}) {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [query, setQuery] = useState("")
  const [tab, setTab] = useState<DoctorConversationStatus>("active")
  // Estado local de cada conversación para reflejar los cambios al instante.
  const [statuses, setStatuses] = useState<Record<number, DoctorConversationStatus>>(() =>
    Object.fromEntries(conversations.map((c) => [c.id, c.doctorStatus])),
  )
  const [, startTransition] = useTransition()

  const statusOf = (c: ConversationSummary) => statuses[c.id] ?? c.doctorStatus

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return conversations.filter((c) => {
      if (isDoctor && statusOf(c) !== tab) return false
      if (q && !c.counterpartName.toLowerCase().includes(q)) return false
      return true
    })
  }, [conversations, query, tab, statuses, isDoctor])

  // Selección inicial / al cambiar de pestaña: primer resultado visible.
  const selectedVisible = filtered.some((c) => c.id === selectedId)
  const effectiveSelectedId = selectedVisible ? selectedId : filtered[0]?.id ?? null
  const selected = conversations.find((c) => c.id === effectiveSelectedId) ?? null

  const changeStatus = (id: number, status: DoctorConversationStatus) => {
    setStatuses((prev) => ({ ...prev, [id]: status }))
    startTransition(() => {
      setConversationStatus(id, status).catch(() => {})
    })
  }

  const counts = useMemo(() => {
    const c: Record<DoctorConversationStatus, number> = { active: 0, pending: 0, archived: 0 }
    for (const conv of conversations) c[statusOf(conv)]++
    return c
  }, [conversations, statuses])

  return (
    <div className="mt-6 flex h-[min(74vh,720px)] overflow-hidden rounded-[22px] border border-ink/10 bg-paper">
      {/* Barra lateral */}
      <aside
        className={`flex w-full flex-col border-ink/10 md:w-[320px] md:border-r ${
          selected ? "hidden md:flex" : "flex"
        }`}
      >
        <div className="border-b border-ink/10 p-3">
          <div className="flex items-center gap-2 rounded-full border border-ink/15 bg-warm px-3.5 py-2.5">
            <Search className="size-4 shrink-0 text-ink-soft" aria-hidden />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar paciente…"
              className="w-full bg-transparent text-[14px] text-ink outline-none placeholder:text-ink-soft"
            />
          </div>

          {isDoctor && (
            <div className="mt-3 flex items-center gap-1 rounded-full bg-warm p-1">
              {STATUS_TABS.map((t) => {
                const Icon = t.icon
                const active = tab === t.key
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setTab(t.key)}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-[12px] font-medium transition-colors ${
                      active ? "bg-paper text-ink shadow-sm" : "text-ink-soft hover:text-ink"
                    }`}
                  >
                    <Icon className="size-3.5" aria-hidden />
                    {t.label}
                    <span className={`text-[11px] ${active ? "text-ink-mute" : "text-ink-mute"}`}>
                      {counts[t.key]}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <ul className="flex-1 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <li className="px-3 py-6 text-center text-[13.5px] text-ink-soft">
              {conversations.length === 0
                ? "Aún no tienes conversaciones."
                : isDoctor
                  ? `No hay conversaciones en "${STATUS_TABS.find((t) => t.key === tab)?.label}".`
                  : "Sin resultados para tu búsqueda."}
            </li>
          ) : (
            filtered.map((c) => {
              const active = c.id === effectiveSelectedId
              return (
                <li key={c.id} className="group/item relative">
                  <button
                    type="button"
                    onClick={() => setSelectedId(c.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors ${
                      active ? "bg-cream" : "hover:bg-ink/5"
                    }`}
                  >
                    <UserAvatar name={c.counterpartName} image={c.counterpartImage} size={44} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-[14.5px] font-medium text-ink">
                          {c.counterpartName}
                        </span>
                        {c.lastMessageAt && (
                          <span className="shrink-0 text-[11.5px] text-ink-mute">
                            {dateFmt.format(new Date(c.lastMessageAt))}
                          </span>
                        )}
                      </span>
                      <span className="block truncate text-[12.5px] text-ink-soft">
                        {c.lastMessagePreview ?? "Sin mensajes"}
                      </span>
                    </span>
                  </button>
                  {isDoctor && (
                    <select
                      aria-label={`Estado de ${c.counterpartName}`}
                      value={statusOf(c)}
                      onChange={(e) => changeStatus(c.id, e.target.value as DoctorConversationStatus)}
                      className="absolute bottom-2 right-3 cursor-pointer rounded-full border border-ink/15 bg-paper px-2 py-0.5 text-[10.5px] font-medium text-ink-soft opacity-0 transition-opacity focus:opacity-100 group-hover/item:opacity-100"
                    >
                      {STATUS_TABS.map((t) => (
                        <option key={t.key} value={t.key}>
                          {STATUS_LABEL[t.key]}
                        </option>
                      ))}
                    </select>
                  )}
                </li>
              )
            })
          )}
        </ul>
      </aside>

      {/* Hilo */}
      <section className={`min-w-0 flex-1 ${selected ? "flex" : "hidden md:flex"}`}>
        {selected ? (
          <ChatThread
            key={selected.id}
            conversationId={selected.id}
            counterpartName={selected.counterpartName}
            counterpartImage={selected.counterpartImage}
            canRequestAnalysis={canRequestAnalysis}
            patientId={isDoctor ? selected.counterpartId : null}
            onBack={() => setSelectedId(null)}
            className="h-full w-full"
          />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
            <MessageCircle className="size-7 text-ink-mute" aria-hidden />
            <p className="text-[14.5px] text-ink-soft">
              Selecciona una conversación para empezar.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
