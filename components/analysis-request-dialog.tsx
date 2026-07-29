"use client"

import { useState } from "react"
import { FlaskConical, X, Check } from "lucide-react"

/** Prefijo marcador para reconocer mensajes de solicitud de análisis. */
export const ANALYSIS_PREFIX = "[ANÁLISIS]"

type TestCatalogItem = { id: string; label: string }
type TestGroup = { group: string; items: TestCatalogItem[] }

const CATALOG: TestGroup[] = [
  {
    group: "Sangre general",
    items: [
      { id: "hemograma", label: "Hemograma completo" },
      { id: "vsg", label: "VSG / PCR" },
      { id: "coagulacion", label: "Coagulación" },
    ],
  },
  {
    group: "Metabólico",
    items: [
      { id: "glucosa", label: "Glucosa en ayunas" },
      { id: "hba1c", label: "Hemoglobina glicosilada (HbA1c)" },
      { id: "lipidos", label: "Perfil lipídico (colesterol/triglicéridos)" },
      { id: "insulina", label: "Insulina basal" },
    ],
  },
  {
    group: "Hormonal / Tiroides",
    items: [
      { id: "tsh", label: "TSH y T4 libre" },
      { id: "cortisol", label: "Cortisol" },
      { id: "vitd", label: "Vitamina D" },
    ],
  },
  {
    group: "Órganos",
    items: [
      { id: "hepatico", label: "Perfil hepático" },
      { id: "renal", label: "Función renal (creatinina/urea)" },
      { id: "orina", label: "Análisis de orina" },
    ],
  },
]

export function AnalysisRequestDialog({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (body: string) => Promise<void>
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [labels, setLabels] = useState<Record<string, string>>({})
  const [note, setNote] = useState("")
  const [sending, setSending] = useState(false)

  if (!open) return null

  function toggle(id: string, label: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    setLabels((l) => ({ ...l, [id]: label }))
  }

  async function handleSubmit() {
    if (selected.size === 0 || sending) return
    setSending(true)
    const lines = [...selected].map((id) => `• ${labels[id]}`)
    let body = `${ANALYSIS_PREFIX}\nSolicitud de análisis clínicos:\n${lines.join("\n")}`
    if (note.trim()) body += `\n\nIndicaciones: ${note.trim()}`
    try {
      await onSubmit(body)
      setSelected(new Set())
      setNote("")
      onClose()
    } finally {
      setSending(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Pedir análisis al paciente"
    >
      <div
        className="flex max-h-[90vh] w-full max-w-[480px] flex-col rounded-t-3xl border border-ink/10 bg-paper shadow-xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-full bg-teal/15 text-teal">
              <FlaskConical className="size-4.5" aria-hidden />
            </span>
            <h3 className="text-[16.5px] font-medium text-ink">Pedir análisis</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex size-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-ink/[.05] hover:text-ink"
          >
            <X className="size-4.5" aria-hidden />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <p className="mb-4 text-[13.5px] leading-relaxed text-ink-soft">
            Selecciona las pruebas que el paciente debe realizarse. Se enviarán como un mensaje en el chat.
          </p>
          <div className="flex flex-col gap-5">
            {CATALOG.map((grp) => (
              <fieldset key={grp.group}>
                <legend className="mb-2 text-[12px] font-semibold uppercase tracking-[.05em] text-ink-mute">
                  {grp.group}
                </legend>
                <div className="flex flex-col gap-1.5">
                  {grp.items.map((it) => {
                    const checked = selected.has(it.id)
                    return (
                      <label
                        key={it.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-2.5 text-[14px] transition-colors ${
                          checked ? "border-teal/40 bg-teal/8 text-ink" : "border-ink/10 bg-warm text-ink-soft hover:bg-ink/[.03]"
                        }`}
                      >
                        <span
                          className={`flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                            checked ? "border-teal bg-teal text-paper" : "border-ink/25 bg-paper"
                          }`}
                        >
                          {checked && <Check className="size-3.5" aria-hidden />}
                        </span>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggle(it.id, it.label)}
                          className="sr-only"
                        />
                        {it.label}
                      </label>
                    )
                  })}
                </div>
              </fieldset>
            ))}

            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] font-semibold uppercase tracking-[.05em] text-ink-mute">
                Indicaciones (opcional)
              </span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="Ej. en ayunas de 12 horas, traer resultados a la próxima cita…"
                className="resize-none rounded-xl border border-ink/15 bg-warm px-3.5 py-2.5 text-[14px] text-ink outline-none placeholder:text-ink-mute focus:border-ink/30"
              />
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-ink/10 px-5 py-4">
          <span className="text-[13px] text-ink-soft">
            {selected.size} {selected.size === 1 ? "prueba" : "pruebas"}
          </span>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={selected.size === 0 || sending}
            className="rounded-xl bg-ink px-5 py-2.5 text-[14px] font-semibold text-paper transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {sending ? "Enviando…" : "Enviar solicitud"}
          </button>
        </div>
      </div>
    </div>
  )
}
