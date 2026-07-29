"use client"

import { useEffect, useRef, useState } from "react"
import useSWR from "swr"
import { getMessages, sendMessage, createInstantCall } from "@/app/actions/chat"
import { CALL_PREFIX } from "@/lib/chat-constants"
import { AnalysisRequestDialog, ANALYSIS_PREFIX } from "@/components/analysis-request-dialog"
import { UserAvatar } from "@/components/user-avatar"
import { PatientDetailPanel } from "@/components/patient-detail-panel"
import { FlaskConical, ChevronLeft, IdCard, X, Video } from "lucide-react"

type Msg = { id: number; body: string; mine: boolean; createdAt: Date }

const timeFmt = new Intl.DateTimeFormat("es-ES", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Madrid",
})

export function ChatThread({
  conversationId,
  counterpartName,
  counterpartImage,
  canRequestAnalysis = false,
  patientId,
  subtitle = "Mensajería segura · respuesta no inmediata",
  onBack,
  className,
}: {
  conversationId: number
  counterpartName: string
  counterpartImage?: string | null
  canRequestAnalysis?: boolean
  /** Si se pasa (lado médico), permite abrir la ficha completa del paciente. */
  patientId?: string | null
  subtitle?: string
  onBack?: () => void
  className?: string
}) {
  const { data: messages = [], mutate } = useSWR<Msg[]>(
    ["messages", conversationId],
    () => getMessages(conversationId),
    { refreshInterval: 3500, revalidateOnFocus: true },
  )

  const [text, setText] = useState("")
  const [sending, setSending] = useState(false)
  const [analysisOpen, setAnalysisOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [callingError, setCallingError] = useState<string | null>(null)
  const [creatingCall, setCreatingCall] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // El médico genera una videollamada instantánea y la publica en el chat.
  async function startCall() {
    if (creatingCall) return
    setCreatingCall(true)
    setCallingError(null)
    try {
      const res = await createInstantCall(conversationId)
      if (!res.ok) {
        setCallingError(res.error)
        return
      }
      await mutate(getMessages(conversationId), { revalidate: false })
      // Abre la sala recién creada para el médico.
      const url = res.message.body.replace(CALL_PREFIX, "").trim()
      if (url) window.open(url, "_blank", "noopener,noreferrer")
    } catch {
      setCallingError("No se pudo crear la llamada.")
    } finally {
      setCreatingCall(false)
    }
  }

  // Envía un cuerpo arbitrario (usado por el diálogo de análisis) de forma optimista.
  async function sendBody(body: string) {
    const optimistic: Msg = { id: Date.now(), body, mine: true, createdAt: new Date() }
    await mutate(
      async () => {
        const res = await sendMessage(conversationId, body)
        if (!res.ok) throw new Error(res.error)
        return getMessages(conversationId)
      },
      { optimisticData: [...messages, optimistic], rollbackOnError: true, revalidate: false },
    )
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    const body = text.trim()
    if (!body || sending) return
    setSending(true)
    setText("")

    // Optimista: añade el mensaje inmediatamente.
    const optimistic: Msg = { id: Date.now(), body, mine: true, createdAt: new Date() }
    await mutate(async () => {
      const res = await sendMessage(conversationId, body)
      if (!res.ok) throw new Error(res.error)
      return getMessages(conversationId)
    }, {
      optimisticData: [...messages, optimistic],
      rollbackOnError: true,
      revalidate: false,
    }).catch(() => setText(body))

    setSending(false)
  }

  return (
    <div className={`flex flex-col bg-cream ${className ?? "h-[min(70vh,600px)] rounded-[20px] border border-ink/10"}`}>
      <div className="flex items-center gap-3 border-b border-ink/10 px-4 py-3 sm:px-5">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Volver a la lista"
            className="-ml-1 flex size-9 shrink-0 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-ink/5 md:hidden"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
        )}
        <UserAvatar name={counterpartName} image={counterpartImage} size={40} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-medium text-ink">{counterpartName}</p>
          <p className="truncate text-[12.5px] text-ink-soft">{subtitle}</p>
        </div>
        {canRequestAnalysis && (
          <button
            type="button"
            onClick={startCall}
            disabled={creatingCall}
            title="Crear videollamada"
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-teal px-3 py-1.5 text-[12.5px] font-medium text-paper transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            <Video className="size-4" aria-hidden />
            <span className="hidden sm:inline">{creatingCall ? "Creando…" : "Crear llamada"}</span>
          </button>
        )}
        {patientId && (
          <button
            type="button"
            onClick={() => setDetailOpen(true)}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-ink/15 px-3 py-1.5 text-[12.5px] font-medium text-ink transition-colors hover:bg-ink/5"
          >
            <IdCard className="size-4" aria-hidden />
            <span className="hidden sm:inline">Ver ficha</span>
          </button>
        )}
      </div>

      {callingError && (
        <div className="border-b border-clay/20 bg-clay/[.08] px-5 py-2 text-[12.5px] text-clay">
          {callingError}
        </div>
      )}

      <div className="flex-1 space-y-2.5 overflow-y-auto px-5 py-4">
        {messages.length === 0 ? (
          <p className="mt-6 text-center text-[14px] text-ink-soft">
            Aún no hay mensajes. Escribe el primero.
          </p>
        ) : (
          messages.map((m) => {
            if (m.body.startsWith(ANALYSIS_PREFIX)) {
              return (
                <AnalysisMessage key={m.id} body={m.body} mine={m.mine} createdAt={m.createdAt} />
              )
            }
            if (m.body.startsWith(CALL_PREFIX)) {
              return <CallMessage key={m.id} body={m.body} mine={m.mine} createdAt={m.createdAt} />
            }
            return (
              <div key={m.id} className={`flex ${m.mine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-[14px] leading-relaxed ${
                    m.mine ? "bg-ink text-paper" : "bg-paper text-ink border border-ink/10"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{m.body}</p>
                  <p className={`mt-1 text-[11px] ${m.mine ? "text-paper/60" : "text-ink-soft"}`}>
                    {timeFmt.format(new Date(m.createdAt))}
                  </p>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex items-end gap-2 border-t border-ink/10 p-3">
        {canRequestAnalysis && (
          <button
            type="button"
            onClick={() => setAnalysisOpen(true)}
            aria-label="Pedir análisis al paciente"
            title="Pedir análisis"
            className="flex size-[42px] shrink-0 items-center justify-center rounded-xl border border-teal/30 bg-teal/10 text-teal transition-colors hover:bg-teal/15"
          >
            <FlaskConical className="size-5" aria-hidden />
          </button>
        )}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) handleSend(e)
          }}
          rows={1}
          placeholder="Escribe un mensaje…"
          className="max-h-32 flex-1 resize-none rounded-xl border border-ink/15 bg-paper px-3.5 py-2.5 text-[14px] text-ink outline-none placeholder:text-ink-soft focus:border-ink/30"
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          className="rounded-xl bg-ink px-4 py-2.5 text-[13.5px] font-medium text-paper transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          Enviar
        </button>
      </form>

      {canRequestAnalysis && (
        <AnalysisRequestDialog
          open={analysisOpen}
          onClose={() => setAnalysisOpen(false)}
          onSubmit={sendBody}
        />
      )}

      {/* Ficha completa del paciente (panel deslizante) */}
      {patientId && detailOpen && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Cerrar ficha"
            onClick={() => setDetailOpen(false)}
            className="absolute inset-0 bg-ink/40"
          />
          <div className="absolute right-0 top-0 flex h-full w-[min(560px,94%)] flex-col bg-paper shadow-xl">
            <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
              <div>
                <p className="text-[16px] font-medium text-ink">Ficha del paciente</p>
                <p className="text-[12.5px] text-ink-soft">{counterpartName}</p>
              </div>
              <button
                type="button"
                onClick={() => setDetailOpen(false)}
                aria-label="Cerrar"
                className="flex size-9 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-warm"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <PatientDetailPanel patientId={patientId} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/** Tarjeta especial para una videollamada: muestra un botón "Unirse". */
function CallMessage({ body, mine, createdAt }: { body: string; mine: boolean; createdAt: Date }) {
  const url = body.slice(CALL_PREFIX.length).trim()
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[80%] overflow-hidden rounded-2xl border border-teal/30 bg-teal/[.07]">
        <div className="flex items-center gap-2 border-b border-teal/20 bg-teal/12 px-3.5 py-2 text-teal">
          <Video className="size-4" aria-hidden />
          <span className="text-[12.5px] font-semibold uppercase tracking-[.04em]">Videollamada</span>
        </div>
        <div className="px-3.5 py-2.5">
          <p className="text-[14px] leading-relaxed text-ink">
            {mine ? "Has iniciado una videollamada." : "Tu médico ha iniciado una videollamada."}
          </p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-teal px-4 py-2 text-[13px] font-medium text-paper transition-opacity hover:opacity-90"
          >
            <Video className="size-4" aria-hidden />
            Unirse a la llamada
          </a>
          <p className="mt-1.5 text-[11px] text-ink-soft">{timeFmt.format(new Date(createdAt))}</p>
        </div>
      </div>
    </div>
  )
}

/** Tarjeta especial para mensajes de solicitud de análisis. */
function AnalysisMessage({ body, mine, createdAt }: { body: string; mine: boolean; createdAt: Date }) {
  // Quita el prefijo marcador y separa título/cuerpo.
  const clean = body.slice(ANALYSIS_PREFIX.length).trim()
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[80%] overflow-hidden rounded-2xl border border-teal/30 bg-teal/[.07]">
        <div className="flex items-center gap-2 border-b border-teal/20 bg-teal/12 px-3.5 py-2 text-teal">
          <FlaskConical className="size-4" aria-hidden />
          <span className="text-[12.5px] font-semibold uppercase tracking-[.04em]">Análisis solicitados</span>
        </div>
        <p className="whitespace-pre-wrap break-words px-3.5 py-2.5 text-[14px] leading-relaxed text-ink">
          {clean}
        </p>
        <p className="px-3.5 pb-2 text-[11px] text-ink-soft">{timeFmt.format(new Date(createdAt))}</p>
      </div>
    </div>
  )
}
