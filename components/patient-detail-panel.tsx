"use client"

import { useState, useTransition } from "react"
import { Lock, Eye, Trash2, Plus, ShieldCheck, FileCheck2, Clock3, X, Check, Pill, Send } from "lucide-react"
import { SendPlanForm } from "@/components/send-plan-form"
import {
  getPatientDetail,
  addDoctorNote,
  deleteDoctorNote,
  type PatientDetail,
  type PatientNote,
} from "@/app/actions/doctor"
import {
  getPatientVerifications,
  requestVerification,
  reviewVerification,
  type VerificationRow,
} from "@/app/actions/verification"

const dateFmt = new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short", year: "numeric" })

const ELIGIBILITY_META: Record<string, { label: string; cls: string }> = {
  eligible: { label: "Candidato", cls: "bg-olive/15 text-olive" },
  review: { label: "Requiere revisión", cls: "bg-amber/15 text-amber" },
  blocked: { label: "No recomendado", cls: "bg-clay/15 text-clay" },
}

export function PatientDetailPanel({ patientId }: { patientId: string }) {
  const [detail, setDetail] = useState<PatientDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState<PatientNote[]>([])
  const [noteBody, setNoteBody] = useState("")
  const [visibility, setVisibility] = useState<"internal" | "shared">("internal")
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  // Verificación adicional.
  const [verifications, setVerifications] = useState<VerificationRow[]>([])
  const [verifyMsg, setVerifyMsg] = useState("")
  const [verifyError, setVerifyError] = useState<string | null>(null)

  // Carga perezosa al montar (el panel solo se monta al expandir).
  useState(() => {
    getPatientDetail(patientId)
      .then((d) => {
        setDetail(d)
        setNotes(d.notes)
      })
      .catch(() => setError("No se pudo cargar la información del paciente."))
      .finally(() => setLoading(false))
    getPatientVerifications(patientId)
      .then(setVerifications)
      .catch(() => {})
  })

  const reloadVerifications = () => {
    getPatientVerifications(patientId).then(setVerifications).catch(() => {})
  }

  const submitVerifyRequest = () => {
    setVerifyError(null)
    const message = verifyMsg.trim()
    if (!message) {
      setVerifyError("Describe qué necesitas que envíe el paciente.")
      return
    }
    startTransition(async () => {
      const res = await requestVerification({ patientId, message })
      if (!res.ok) {
        setVerifyError(res.error)
        return
      }
      setVerifyMsg("")
      reloadVerifications()
    })
  }

  const decide = (id: number, decision: "approved" | "rejected") => {
    startTransition(async () => {
      const note =
        decision === "rejected"
          ? window.prompt("Motivo del rechazo (opcional, lo verá el paciente):") ?? undefined
          : undefined
      const res = await reviewVerification({ id, decision, note })
      if (res.ok) reloadVerifications()
    })
  }

  const hasOpenVerification = verifications.some(
    (v) => v.status === "pending" || v.status === "submitted",
  )

  const submitNote = () => {
    setError(null)
    const body = noteBody.trim()
    if (!body) {
      setError("Escribe una nota.")
      return
    }
    startTransition(async () => {
      const res = await addDoctorNote({ patientId, body, visibility })
      if (!res.ok) {
        setError(res.error)
        return
      }
      setNotes((prev) => [
        { id: Date.now(), body, visibility, createdAt: new Date() },
        ...prev,
      ])
      setNoteBody("")
    })
  }

  const removeNote = (id: number) => {
    startTransition(async () => {
      const res = await deleteDoctorNote(id)
      if (res.ok) setNotes((prev) => prev.filter((n) => n.id !== id))
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 text-[13.5px] text-ink-soft">
        <span className="mr-2 inline-block size-4 animate-spin rounded-full border-2 border-ink/20 border-t-ink/60" />
        Cargando ficha…
      </div>
    )
  }

  const clinical = detail?.clinical
  const progress = detail?.progress ?? []
  const weights = progress.filter((p) => p.weightKg != null)
  const firstW = weights[0]?.weightKg ?? null
  const lastW = weights[weights.length - 1]?.weightKg ?? null
  const change = firstW != null && lastW != null ? lastW - firstW : null

  return (
    <div className="grid gap-4 border-t border-ink/10 pt-4 lg:grid-cols-2">
      {/* Información clínica */}
      <section className="rounded-[16px] border border-ink/10 bg-warm p-4">
        <h3 className="text-[13px] font-semibold uppercase tracking-[.05em] text-ink-mute">
          Información clínica
        </h3>
        {clinical ? (
          <>
            {clinical.eligibility && (
              <span
                className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${
                  ELIGIBILITY_META[clinical.eligibility]?.cls ?? "bg-ink/8 text-ink-soft"
                }`}
              >
                {ELIGIBILITY_META[clinical.eligibility]?.label ?? clinical.eligibility}
              </span>
            )}
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[13.5px]">
              <Row label="Edad" value={clinical.age != null ? `${clinical.age} años` : "—"} />
              <Row label="Sexo" value={sexLabel(clinical.sex)} />
              <Row label="Altura" value={clinical.heightCm != null ? `${clinical.heightCm} cm` : "—"} />
              <Row label="Peso" value={clinical.weightKg != null ? `${clinical.weightKg} kg` : "—"} />
              <Row label="IMC" value={clinical.bmi ?? "—"} />
              <Row label="Experiencia GLP‑1" value={clinical.glp1Experience ?? "—"} />
            </dl>

            {clinical.comorbidities.length > 0 && (
              <Tags title="Comorbilidades" items={clinical.comorbidities} tone="amber" />
            )}
            {clinical.contraindications.length > 0 && (
              <Tags title="Antecedentes" items={clinical.contraindications} tone="clay" />
            )}
            {clinical.eligibilityReasons.length > 0 && (
              <div className="mt-3">
                <p className="text-[11.5px] uppercase tracking-[.04em] text-ink-mute">Valoración</p>
                <ul className="mt-1 flex flex-col gap-1 text-[12.5px] leading-snug text-ink-soft">
                  {clinical.eligibilityReasons.map((r, i) => (
                    <li key={i}>• {r}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
            Este paciente no completó el cuestionario clínico, o lo hizo con otro correo.
          </p>
        )}
      </section>

      {/* Progreso */}
      <section className="rounded-[16px] border border-ink/10 bg-warm p-4">
        <h3 className="text-[13px] font-semibold uppercase tracking-[.05em] text-ink-mute">
          Progreso del paciente
        </h3>
        {progress.length === 0 ? (
          <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
            El paciente aún no ha registrado ningún dato de seguimiento.
          </p>
        ) : (
          <>
            <div className="mt-2 flex flex-wrap gap-2 text-[12.5px]">
              {firstW != null && (
                <span className="rounded-full bg-ink/[.06] px-2.5 py-1 text-ink-soft">Inicio {firstW} kg</span>
              )}
              {lastW != null && (
                <span className="rounded-full bg-ink/[.06] px-2.5 py-1 text-ink-soft">Actual {lastW} kg</span>
              )}
              {change != null && (
                <span
                  className={`rounded-full px-2.5 py-1 font-medium ${
                    change < 0 ? "bg-olive/15 text-olive" : "bg-ink/[.06] text-ink-soft"
                  }`}
                >
                  {change > 0 ? "+" : ""}
                  {change.toFixed(1)} kg
                </span>
              )}
            </div>
            <ul className="mt-3 flex max-h-[180px] flex-col gap-2 overflow-y-auto pr-1">
              {[...progress].reverse().map((e) => (
                <li key={e.id} className="rounded-[12px] border border-ink/10 bg-cream px-3 py-2">
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[13px]">
                    {e.weightKg != null && <span className="font-semibold text-ink">{e.weightKg} kg</span>}
                    {e.waistCm != null && <span className="text-ink-soft">Cintura {e.waistCm} cm</span>}
                    <span className="text-[11.5px] text-ink-mute">{dateFmt.format(new Date(e.createdAt))}</span>
                  </div>
                  {(e.dose || e.sideEffects || e.note) && (
                    <div className="mt-1 text-[12.5px] leading-snug text-ink-soft">
                      {e.dose && <span className="mr-2">Dosis: {e.dose}</span>}
                      {e.sideEffects && <span className="mr-2">Efectos: {e.sideEffects}</span>}
                      {e.note && <span className="italic">“{e.note}”</span>}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {/* Recetas anteriores */}
      <section className="rounded-[16px] border border-ink/10 bg-warm p-4 lg:col-span-2">
        <div className="flex items-center gap-2">
          <Pill className="size-4 text-ink-mute" aria-hidden />
          <h3 className="text-[13px] font-semibold uppercase tracking-[.05em] text-ink-mute">
            Recetas anteriores
          </h3>
        </div>
        {(detail?.prescriptions ?? []).length === 0 ? (
          <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
            Aún no has emitido recetas a este paciente.
          </p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {(detail?.prescriptions ?? []).map((rx) => (
              <li key={rx.id} className="rounded-[12px] border border-ink/10 bg-cream px-3.5 py-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[14px] font-medium text-ink">{rx.medication}</p>
                  <span className="text-[11.5px] text-ink-mute">
                    {dateFmt.format(new Date(rx.issuedAt))}
                  </span>
                </div>
                <p className="mt-0.5 text-[13px] text-ink-soft">Posología: {rx.dosage}</p>
                {rx.instructions && (
                  <p className="mt-0.5 text-[12.5px] leading-snug text-ink-soft">{rx.instructions}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Enviar plan / suscripción al paciente */}
      <section className="rounded-[16px] border border-ink/10 bg-warm p-4 lg:col-span-2">
        <div className="flex items-center gap-2">
          <Send className="size-4 text-ink-mute" aria-hidden />
          <h3 className="text-[13px] font-semibold uppercase tracking-[.05em] text-ink-mute">
            Enviar plan al paciente
          </h3>
        </div>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-soft">
          Envía por correo el plan que acordasteis en la consulta. El paciente lo paga desde su
          panel y, al confirmarse el pago, se activa automáticamente su tratamiento, su receta y el
          seguimiento.
        </p>
        <div className="mt-3">
          <SendPlanForm patientId={patientId} />
        </div>
      </section>

      {/* Verificación adicional */}
      <section className="rounded-[16px] border border-ink/10 bg-warm p-4 lg:col-span-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-ink-mute" aria-hidden />
          <h3 className="text-[13px] font-semibold uppercase tracking-[.05em] text-ink-mute">
            Verificación adicional
          </h3>
        </div>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-soft">
          Si sospechas que los datos del paciente no son veraces, pídele una prueba (un vídeo, una
          analítica, una foto…). Mientras esté pendiente, el paciente{" "}
          <span className="font-medium">no podrá activar su suscripción</span> hasta que tú la apruebes.
        </p>

        {!hasOpenVerification && (
          <div className="mt-3 flex flex-col gap-2">
            <textarea
              value={verifyMsg}
              onChange={(e) => setVerifyMsg(e.target.value)}
              rows={2}
              placeholder="Ej.: Necesito un vídeo corto sosteniendo tu DNI junto a tu rostro, o una analítica reciente."
              className="resize-none rounded-[12px] border border-ink/15 bg-cream px-3.5 py-2.5 text-[14px] text-ink outline-none transition-colors focus:border-amber"
            />
            <button
              type="button"
              onClick={submitVerifyRequest}
              disabled={pending}
              className="ml-auto flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-paper transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              <ShieldCheck className="size-4" aria-hidden />
              Solicitar verificación
            </button>
            {verifyError && <p className="text-[13px] text-clay">{verifyError}</p>}
          </div>
        )}

        {verifications.length > 0 && (
          <ul className="mt-4 flex flex-col gap-2">
            {verifications.map((v) => (
              <li key={v.id} className="rounded-[12px] border border-ink/10 bg-cream px-3.5 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <VerificationBadge status={v.status} />
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink">{v.message}</p>
                    {v.reviewNote && (
                      <p className="mt-1 text-[12px] text-ink-soft">Nota: {v.reviewNote}</p>
                    )}
                    <p className="mt-1 text-[11px] text-ink-mute">
                      {dateFmt.format(new Date(v.createdAt))}
                    </p>
                  </div>
                  {v.blobPathname && (
                    <a
                      href={`/api/verification/${v.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex shrink-0 items-center gap-1.5 rounded-full border border-ink/15 px-3 py-1.5 text-[12.5px] font-medium text-ink transition-colors hover:bg-ink/5"
                    >
                      <FileCheck2 className="size-3.5" aria-hidden />
                      Ver archivo
                    </a>
                  )}
                </div>
                {v.status === "submitted" && (
                  <div className="mt-2.5 flex gap-2">
                    <button
                      type="button"
                      onClick={() => decide(v.id, "approved")}
                      disabled={pending}
                      className="flex items-center gap-1.5 rounded-full bg-olive px-3.5 py-1.5 text-[12.5px] font-medium text-paper transition-opacity hover:opacity-90 disabled:opacity-60"
                    >
                      <Check className="size-3.5" aria-hidden />
                      Aprobar
                    </button>
                    <button
                      type="button"
                      onClick={() => decide(v.id, "rejected")}
                      disabled={pending}
                      className="flex items-center gap-1.5 rounded-full border border-clay/30 px-3.5 py-1.5 text-[12.5px] font-medium text-clay transition-colors hover:bg-clay/10 disabled:opacity-60"
                    >
                      <X className="size-3.5" aria-hidden />
                      Rechazar
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Notas del médico */}
      <section className="rounded-[16px] border border-ink/10 bg-warm p-4 lg:col-span-2">
        <h3 className="text-[13px] font-semibold uppercase tracking-[.05em] text-ink-mute">
          Notas del médico
        </h3>

        <div className="mt-3 flex flex-col gap-2">
          <textarea
            value={noteBody}
            onChange={(e) => setNoteBody(e.target.value)}
            rows={2}
            placeholder="Escribe una nota sobre este paciente…"
            className="resize-none rounded-[12px] border border-ink/15 bg-cream px-3.5 py-2.5 text-[14px] text-ink outline-none transition-colors focus:border-amber"
          />
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex gap-1 rounded-full border border-ink/10 bg-cream p-1">
              <button
                type="button"
                onClick={() => setVisibility("internal")}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
                  visibility === "internal" ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"
                }`}
              >
                <Lock className="size-3.5" aria-hidden />
                Interna
              </button>
              <button
                type="button"
                onClick={() => setVisibility("shared")}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
                  visibility === "shared" ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"
                }`}
              >
                <Eye className="size-3.5" aria-hidden />
                Compartida
              </button>
            </div>
            <button
              type="button"
              onClick={submitNote}
              disabled={pending}
              className="ml-auto flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-paper transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              <Plus className="size-4" aria-hidden />
              Añadir nota
            </button>
          </div>
          <p className="text-[11.5px] leading-snug text-ink-mute">
            Las notas <span className="font-medium">internas</span> solo las ve el equipo médico. Las{" "}
            <span className="font-medium">compartidas</span> aparecen en el portal del paciente.
          </p>
          {error && <p className="text-[13px] text-clay">{error}</p>}
        </div>

        {notes.length > 0 && (
          <ul className="mt-4 flex flex-col gap-2">
            {notes.map((n) => (
              <li
                key={n.id}
                className="flex items-start justify-between gap-3 rounded-[12px] border border-ink/10 bg-cream px-3.5 py-2.5"
              >
                <div className="min-w-0">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-medium ${
                      n.visibility === "shared" ? "bg-sage/25 text-ink" : "bg-ink/[.07] text-ink-soft"
                    }`}
                  >
                    {n.visibility === "shared" ? (
                      <>
                        <Eye className="size-3" aria-hidden /> Compartida
                      </>
                    ) : (
                      <>
                        <Lock className="size-3" aria-hidden /> Interna
                      </>
                    )}
                  </span>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink">{n.body}</p>
                  <p className="mt-1 text-[11px] text-ink-mute">{dateFmt.format(new Date(n.createdAt))}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeNote(n.id)}
                  disabled={pending}
                  aria-label="Eliminar nota"
                  className="flex size-8 shrink-0 items-center justify-center rounded-full text-ink-mute transition-colors hover:bg-clay/10 hover:text-clay disabled:opacity-50"
                >
                  <Trash2 className="size-4" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <dt className="text-[11.5px] text-ink-mute">{label}</dt>
      <dd className="font-medium capitalize text-ink">{value}</dd>
    </div>
  )
}

function Tags({ title, items, tone }: { title: string; items: string[]; tone: "amber" | "clay" }) {
  const cls = tone === "clay" ? "bg-clay/12 text-ink" : "bg-amber/12 text-ink"
  return (
    <div className="mt-3">
      <p className="text-[11.5px] uppercase tracking-[.04em] text-ink-mute">{title}</p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {items.map((i) => (
          <span key={i} className={`rounded-full px-2.5 py-1 text-[12px] ${cls}`}>
            {i}
          </span>
        ))}
      </div>
    </div>
  )
}

function sexLabel(sex: string | null) {
  if (sex === "female") return "Mujer"
  if (sex === "male") return "Hombre"
  if (sex === "other") return "No especificado"
  return "—"
}

function VerificationBadge({ status }: { status: string }) {
  const meta: Record<string, { label: string; cls: string; icon: typeof Clock3 }> = {
    pending: { label: "Esperando al paciente", cls: "bg-amber/15 text-amber", icon: Clock3 },
    submitted: { label: "Pendiente de revisar", cls: "bg-ink/[.08] text-ink-soft", icon: FileCheck2 },
    approved: { label: "Aprobada", cls: "bg-olive/15 text-olive", icon: Check },
    rejected: { label: "Rechazada", cls: "bg-clay/15 text-clay", icon: X },
  }
  const m = meta[status] ?? meta.pending
  const Icon = m.icon
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-medium ${m.cls}`}>
      <Icon className="size-3" aria-hidden />
      {m.label}
    </span>
  )
}
