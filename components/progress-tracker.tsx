"use client"

import { useMemo, useState, useTransition } from "react"
import { Plus, Trash2, TrendingDown, Activity } from "lucide-react"
import {
  addProgressEntry,
  deleteProgressEntry,
  type ProgressRow,
  type SharedNote,
} from "@/app/actions/progress"
import { EmptyState } from "@/components/empty-state"

const dateFmt = new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short", year: "numeric" })
const shortFmt = new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short" })

export function ProgressTracker({
  initialEntries,
  sharedNotes,
}: {
  initialEntries: ProgressRow[]
  sharedNotes: SharedNote[]
}) {
  const [entries, setEntries] = useState<ProgressRow[]>(initialEntries)
  const [weight, setWeight] = useState("")
  const [waist, setWaist] = useState("")
  const [dose, setDose] = useState("")
  const [sideEffects, setSideEffects] = useState("")
  const [note, setNote] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  // entries vienen en orden ascendente (más antiguo → más reciente).
  const weights = useMemo(() => entries.filter((e) => e.weightKg != null), [entries])
  const first = weights[0]?.weightKg ?? null
  const latest = weights[weights.length - 1]?.weightKg ?? null
  const totalChange = first != null && latest != null ? latest - first : null

  const submit = () => {
    setError(null)
    const w = parseFloat(weight.replace(",", "."))
    const c = parseFloat(waist.replace(",", "."))
    startTransition(async () => {
      const res = await addProgressEntry({
        weightKg: Number.isFinite(w) ? w : null,
        waistCm: Number.isFinite(c) ? c : null,
        dose: dose || null,
        sideEffects: sideEffects || null,
        note: note || null,
      })
      if (!res.ok) {
        setError(res.error)
        return
      }
      // Refresco optimista local: añadimos al final (más reciente).
      const optimistic: ProgressRow = {
        id: Date.now(),
        weightKg: Number.isFinite(w) ? Math.round(w * 10) / 10 : null,
        waistCm: Number.isFinite(c) ? Math.round(c * 10) / 10 : null,
        dose: dose || null,
        sideEffects: sideEffects || null,
        note: note || null,
        createdAt: new Date(),
      }
      setEntries((prev) => [...prev, optimistic])
      setWeight("")
      setWaist("")
      setDose("")
      setSideEffects("")
      setNote("")
    })
  }

  const remove = (id: number) => {
    startTransition(async () => {
      const res = await deleteProgressEntry(id)
      if (res.ok) setEntries((prev) => prev.filter((e) => e.id !== id))
    })
  }

  return (
    <div className="grid gap-5 lg:grid-cols-5">
      {/* Columna izquierda: formulario */}
      <section className="lg:col-span-2">
        <div className="rounded-[20px] border border-ink/10 bg-cream p-5">
          <h2 className="flex items-center gap-2 text-[16px] font-medium text-ink">
            <Plus className="size-[18px] text-clay" aria-hidden />
            Nuevo registro
          </h2>
          <p className="mt-1 text-[13.5px] leading-relaxed text-ink-soft">
            Anota tu evolución. Tu médico podrá verlo en tu ficha.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5 text-[12.5px] font-medium text-ink-soft">
              Peso (kg)
              <input
                value={weight}
                onChange={(e) => setWeight(e.target.value.replace(/[^0-9.,]/g, ""))}
                inputMode="decimal"
                placeholder="82,5"
                className="rounded-[12px] border border-ink/15 bg-warm px-3.5 py-3 text-[15px] text-ink outline-none transition-colors focus:border-amber"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-[12.5px] font-medium text-ink-soft">
              Cintura (cm)
              <input
                value={waist}
                onChange={(e) => setWaist(e.target.value.replace(/[^0-9.,]/g, ""))}
                inputMode="decimal"
                placeholder="94"
                className="rounded-[12px] border border-ink/15 bg-warm px-3.5 py-3 text-[15px] text-ink outline-none transition-colors focus:border-amber"
              />
            </label>
          </div>

          <label className="mt-3 flex flex-col gap-1.5 text-[12.5px] font-medium text-ink-soft">
            Dosis actual
            <input
              value={dose}
              onChange={(e) => setDose(e.target.value)}
              placeholder="p. ej. Semaglutida 0,5 mg"
              className="rounded-[12px] border border-ink/15 bg-warm px-3.5 py-3 text-[15px] text-ink outline-none transition-colors focus:border-amber"
            />
          </label>

          <label className="mt-3 flex flex-col gap-1.5 text-[12.5px] font-medium text-ink-soft">
            Efectos secundarios
            <input
              value={sideEffects}
              onChange={(e) => setSideEffects(e.target.value)}
              placeholder="p. ej. náuseas leves"
              className="rounded-[12px] border border-ink/15 bg-warm px-3.5 py-3 text-[15px] text-ink outline-none transition-colors focus:border-amber"
            />
          </label>

          <label className="mt-3 flex flex-col gap-1.5 text-[12.5px] font-medium text-ink-soft">
            Nota
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="Cómo te sientes, energía, apetito…"
              className="resize-none rounded-[12px] border border-ink/15 bg-warm px-3.5 py-3 text-[15px] text-ink outline-none transition-colors focus:border-amber"
            />
          </label>

          {error && <p className="mt-3 text-[13px] text-clay">{error}</p>}

          <button
            type="button"
            onClick={submit}
            disabled={pending}
            className="mt-4 w-full rounded-full bg-ink py-3 text-[14px] font-semibold text-paper transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {pending ? "Guardando…" : "Guardar registro"}
          </button>
        </div>

        {/* Notas compartidas por el médico */}
        <div className="mt-5 rounded-[20px] border border-ink/10 bg-cream p-5">
          <h2 className="text-[16px] font-medium text-ink">Notas de tu médico</h2>
          {sharedNotes.length === 0 ? (
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">
              Aquí verás las indicaciones que tu médico decida compartir contigo.
            </p>
          ) : (
            <ul className="mt-3 flex flex-col gap-3">
              {sharedNotes.map((n) => (
                <li key={n.id} className="rounded-[14px] border border-sage/40 bg-sage/12 px-4 py-3">
                  <p className="text-[14px] leading-relaxed text-ink">{n.body}</p>
                  <p className="mt-1.5 text-[11.5px] text-ink-mute">{dateFmt.format(new Date(n.createdAt))}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Columna derecha: resumen + gráfico + historial */}
      <section className="lg:col-span-3">
        {/* Resumen */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Peso inicial" value={first != null ? `${first} kg` : "—"} />
          <StatCard label="Peso actual" value={latest != null ? `${latest} kg` : "—"} />
          <StatCard
            label="Variación"
            value={totalChange != null ? `${totalChange > 0 ? "+" : ""}${totalChange.toFixed(1)} kg` : "—"}
            tone={totalChange != null && totalChange < 0 ? "good" : "neutral"}
          />
        </div>

        {/* Gráfico */}
        <div className="mt-4 rounded-[20px] border border-ink/10 bg-cream p-5">
          <h2 className="flex items-center gap-2 text-[16px] font-medium text-ink">
            <TrendingDown className="size-[18px] text-olive" aria-hidden />
            Evolución del peso
          </h2>
          {weights.length < 2 ? (
            <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
              Registra tu peso al menos dos veces para ver tu gráfico de evolución.
            </p>
          ) : (
            <WeightChart points={weights.map((e) => ({ x: e.createdAt, y: e.weightKg as number }))} />
          )}
        </div>

        {/* Historial */}
        <div className="mt-4 rounded-[20px] border border-ink/10 bg-cream p-5">
          <h2 className="flex items-center gap-2 text-[16px] font-medium text-ink">
            <Activity className="size-[18px] text-clay" aria-hidden />
            Historial
          </h2>
          {entries.length === 0 ? (
            <div className="mt-3">
              <EmptyState
                icon={Activity}
                title="Aún no hay registros"
                description="Empieza a anotar tu peso, dosis y cómo te sientes. Verás tu progreso reflejado aquí."
              />
            </div>
          ) : (
            <ul className="mt-3 flex flex-col gap-2.5">
              {[...entries].reverse().map((e) => (
                <li
                  key={e.id}
                  className="flex items-start justify-between gap-3 rounded-[14px] border border-ink/10 bg-warm px-4 py-3"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      {e.weightKg != null && (
                        <span className="text-[15px] font-semibold text-ink">{e.weightKg} kg</span>
                      )}
                      {e.waistCm != null && (
                        <span className="text-[13px] text-ink-soft">Cintura {e.waistCm} cm</span>
                      )}
                      <span className="text-[12px] text-ink-mute">{dateFmt.format(new Date(e.createdAt))}</span>
                    </div>
                    {(e.dose || e.sideEffects || e.note) && (
                      <div className="mt-1.5 flex flex-col gap-1 text-[13px] leading-snug text-ink-soft">
                        {e.dose && (
                          <span>
                            <span className="text-ink-mute">Dosis:</span> {e.dose}
                          </span>
                        )}
                        {e.sideEffects && (
                          <span>
                            <span className="text-ink-mute">Efectos:</span> {e.sideEffects}
                          </span>
                        )}
                        {e.note && <span className="italic">“{e.note}”</span>}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(e.id)}
                    disabled={pending}
                    aria-label="Eliminar registro"
                    className="flex size-8 shrink-0 items-center justify-center rounded-full text-ink-mute transition-colors hover:bg-clay/10 hover:text-clay disabled:opacity-50"
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}

function StatCard({
  label,
  value,
  tone = "neutral",
}: {
  label: string
  value: string
  tone?: "good" | "neutral"
}) {
  return (
    <div className="rounded-[16px] border border-ink/10 bg-cream p-4 text-center">
      <p className="text-[11px] uppercase tracking-[.04em] text-ink-mute">{label}</p>
      <p className={`mt-1 text-[18px] font-semibold ${tone === "good" ? "text-olive" : "text-ink"}`}>
        {value}
      </p>
    </div>
  )
}

/** Gráfico de línea SVG simple, sin dependencias externas. */
function WeightChart({ points }: { points: { x: Date; y: number }[] }) {
  const W = 520
  const H = 200
  const padX = 36
  const padY = 22

  const ys = points.map((p) => p.y)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const spanY = maxY - minY || 1
  const minTime = points[0].x.getTime()
  const maxTime = points[points.length - 1].x.getTime()
  const spanT = maxTime - minTime || 1

  const sx = (t: number) => padX + ((t - minTime) / spanT) * (W - padX * 2)
  const sy = (v: number) => padY + (1 - (v - minY) / spanY) * (H - padY * 2)

  const coords = points.map((p) => ({ cx: sx(p.x.getTime()), cy: sy(p.y), ...p }))
  const linePath = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.cx} ${c.cy}`).join(" ")
  const areaPath =
    `M ${coords[0].cx} ${H - padY} ` +
    coords.map((c) => `L ${c.cx} ${c.cy}`).join(" ") +
    ` L ${coords[coords.length - 1].cx} ${H - padY} Z`

  return (
    <div className="mt-3 overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-[200px] w-full min-w-[420px]"
        role="img"
        aria-label="Gráfico de evolución del peso"
      >
        {/* Eje Y de referencia */}
        {[maxY, (maxY + minY) / 2, minY].map((v, i) => (
          <g key={i}>
            <line
              x1={padX}
              x2={W - padX}
              y1={sy(v)}
              y2={sy(v)}
              stroke="currentColor"
              className="text-ink/10"
              strokeWidth={1}
            />
            <text x={4} y={sy(v) + 4} className="fill-ink-mute text-[10px]">
              {v.toFixed(0)}
            </text>
          </g>
        ))}

        <path d={areaPath} className="fill-olive/12" />
        <path d={linePath} className="stroke-olive" strokeWidth={2.5} fill="none" strokeLinejoin="round" />

        {coords.map((c, i) => (
          <g key={i}>
            <circle cx={c.cx} cy={c.cy} r={3.5} className="fill-olive" />
            {(i === 0 || i === coords.length - 1) && (
              <text x={c.cx} y={H - 6} textAnchor="middle" className="fill-ink-mute text-[10px]">
                {shortFmt.format(c.x)}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  )
}
