"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ShieldCheck, Upload, FileCheck2, Clock3, Check, X, Lock } from "lucide-react"

type Verification = {
  id: number
  message: string
  status: string
  fileName: string | null
  reviewNote: string | null
  createdAt: Date | string
  doctorName: string | null
}

const dateFmt = new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric" })

export function PatientVerification({ verifications }: { verifications: Verification[] }) {
  const router = useRouter()
  const [uploadingId, setUploadingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputs = useRef<Record<number, HTMLInputElement | null>>({})

  async function upload(requestId: number, file: File) {
    setError(null)
    setUploadingId(requestId)
    try {
      const form = new FormData()
      form.append("file", file)
      form.append("requestId", String(requestId))
      const res = await fetch("/api/verification/upload", { method: "POST", body: form })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? "No se pudo subir el archivo.")
        return
      }
      router.refresh()
    } catch {
      setError("No se pudo subir el archivo. Revisa tu conexión.")
    } finally {
      setUploadingId(null)
    }
  }

  if (verifications.length === 0) {
    return (
      <div className="rounded-[20px] border border-ink/10 bg-cream p-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-5 text-olive" aria-hidden />
          <h2 className="text-[16px] font-medium text-ink">Sin verificaciones pendientes</h2>
        </div>
        <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
          Tu médico no te ha solicitado ninguna verificación adicional. Si lo hace, aparecerá aquí y
          te avisaremos por correo.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-2.5 rounded-[16px] border border-olive/25 bg-olive/[.08] p-4">
        <Lock className="mt-0.5 size-4 shrink-0 text-olive" aria-hidden />
        <p className="text-[13.5px] leading-relaxed text-ink-soft">
          <span className="font-medium text-ink">Todo es estrictamente confidencial.</span> Lo que
          subas aquí solo lo verá el médico que te lo ha pedido. Nadie más del equipo, ni otros
          pacientes, tiene acceso. Se almacena cifrado y se usa únicamente para validar tu tratamiento.
        </p>
      </div>

      {verifications.map((v) => {
        const canUpload = v.status === "pending" || v.status === "rejected"
        const busy = uploadingId === v.id
        return (
          <div key={v.id} className="rounded-[20px] border border-ink/10 bg-cream p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <StatusBadge status={v.status} />
                <p className="mt-2 text-[15px] leading-relaxed text-ink">{v.message}</p>
                <p className="mt-1 text-[12.5px] text-ink-mute">
                  Solicitada el {dateFmt.format(new Date(v.createdAt))}
                  {v.doctorName ? ` · Dr. ${v.doctorName}` : ""}
                </p>
              </div>
            </div>

            {v.status === "rejected" && v.reviewNote ? (
              <p className="mt-3 rounded-[12px] bg-clay/10 px-3.5 py-2.5 text-[13px] text-ink-soft">
                Tu médico necesita que lo repitas: {v.reviewNote}
              </p>
            ) : null}

            {v.status === "submitted" ? (
              <p className="mt-3 flex items-center gap-2 text-[13.5px] text-ink-soft">
                <FileCheck2 className="size-4 text-ink-mute" aria-hidden />
                {v.fileName ? `Has enviado “${v.fileName}”. ` : "Archivo enviado. "}
                Tu médico lo revisará en breve.
              </p>
            ) : null}

            {v.status === "approved" ? (
              <p className="mt-3 flex items-center gap-2 text-[13.5px] text-olive">
                <Check className="size-4" aria-hidden />
                Verificación aprobada. Ya puedes activar tu tratamiento.
              </p>
            ) : null}

            {canUpload ? (
              <div className="mt-4">
                <input
                  ref={(el) => {
                    inputs.current[v.id] = el
                  }}
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) upload(v.id, file)
                  }}
                />
                <button
                  type="button"
                  onClick={() => inputs.current[v.id]?.click()}
                  disabled={busy}
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-[13.5px] font-medium text-paper transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  <Upload className="size-4" aria-hidden />
                  {busy ? "Subiendo…" : v.status === "rejected" ? "Subir de nuevo" : "Subir archivo"}
                </button>
                <p className="mt-2 text-[12px] text-ink-mute">
                  Puedes subir un vídeo, una imagen o un documento (PDF). Tamaño máximo recomendado: 50 MB.
                </p>
              </div>
            ) : null}
          </div>
        )
      })}

      {error ? <p className="text-[13.5px] text-clay">{error}</p> : null}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const meta: Record<string, { label: string; cls: string; icon: typeof Clock3 }> = {
    pending: { label: "Pendiente de enviar", cls: "bg-amber/15 text-amber", icon: Clock3 },
    submitted: { label: "Enviada · en revisión", cls: "bg-ink/[.08] text-ink-soft", icon: FileCheck2 },
    approved: { label: "Aprobada", cls: "bg-olive/15 text-olive", icon: Check },
    rejected: { label: "Necesita repetirse", cls: "bg-clay/15 text-clay", icon: X },
  }
  const m = meta[status] ?? meta.pending
  const Icon = m.icon
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-medium ${m.cls}`}>
      <Icon className="size-3.5" aria-hidden />
      {m.label}
    </span>
  )
}
