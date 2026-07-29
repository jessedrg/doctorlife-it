"use client"

import { useEffect, useState, useTransition } from "react"
import { Send, Check } from "lucide-react"
import { getSendablePlans, sendPlanOffer } from "@/app/actions/clinic-plans"

type Plan = Awaited<ReturnType<typeof getSendablePlans>>[number]

export function SendPlanForm({ patientId }: { patientId: string }) {
  const [plans, setPlans] = useState<Plan[]>([])
  const [selected, setSelected] = useState<string>("")
  const [note, setNote] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    getSendablePlans()
      .then((p) => {
        setPlans(p)
        if (p[0]) setSelected(p[0].id)
      })
      .catch(() => setError("No se pudieron cargar los planes."))
  }, [])

  const submit = () => {
    setError(null)
    if (!selected) {
      setError("Elige un plan para enviar.")
      return
    }
    startTransition(async () => {
      const res = await sendPlanOffer({ patientId, productId: selected, note: note.trim() })
      if (!res.ok) {
        setError(res.error)
        return
      }
      setSent(true)
      setNote("")
    })
  }

  if (sent) {
    return (
      <div className="flex items-start gap-2.5 rounded-[12px] border border-olive/30 bg-olive/10 p-3.5">
        <Check className="mt-0.5 size-4 shrink-0 text-olive" aria-hidden />
        <div>
          <p className="text-[13.5px] font-medium text-ink">Plan enviado al paciente</p>
          <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">
            Le hemos enviado un correo con el plan. Cuando lo pague desde su panel, se activará
            automáticamente su tratamiento.
          </p>
          <button
            type="button"
            onClick={() => setSent(false)}
            className="mt-2 text-[12.5px] font-medium text-ink underline underline-offset-2"
          >
            Enviar otro plan
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        {plans.map((p) => (
          <label
            key={p.id}
            className={`flex cursor-pointer items-start gap-3 rounded-[12px] border p-3 transition-colors ${
              selected === p.id ? "border-ink bg-cream" : "border-ink/15 hover:bg-ink/[.03]"
            }`}
          >
            <input
              type="radio"
              name="plan"
              value={p.id}
              checked={selected === p.id}
              onChange={() => setSelected(p.id)}
              className="mt-1 accent-ink"
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <p className="text-[14px] font-medium text-ink">
                  {p.name}
                  {p.oneTime && (
                    <span className="ml-2 rounded-full bg-ink/10 px-2 py-0.5 text-[11px] font-medium text-ink-soft align-middle">
                      Pago único
                    </span>
                  )}
                </p>
                <p className="text-[13.5px] font-semibold text-ink">{p.priceLabel}</p>
              </div>
              <p className="mt-0.5 text-[12.5px] leading-snug text-ink-soft">{p.description}</p>
            </div>
          </label>
        ))}
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={2}
        placeholder="Nota opcional para el paciente (aparecerá en el correo)…"
        className="resize-none rounded-[12px] border border-ink/15 bg-cream px-3.5 py-2.5 text-[14px] text-ink outline-none transition-colors focus:border-amber"
      />

      <button
        type="button"
        onClick={submit}
        disabled={pending || plans.length === 0}
        className="ml-auto flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-paper transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        <Send className="size-4" aria-hidden />
        {pending ? "Enviando…" : "Enviar plan por correo"}
      </button>

      {error && <p className="text-[13px] text-clay">{error}</p>}
    </div>
  )
}
