"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { FileText, UploadCloud, X } from "lucide-react"

interface PatientOption {
  id: string
  name: string
  email: string
}

export function PrescriptionForm({ patients }: { patients: PatientOption[] }) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [patientId, setPatientId] = useState(patients[0]?.id ?? "")
  const [medication, setMedication] = useState("")
  const [dosage, setDosage] = useState("")
  const [instructions, setInstructions] = useState("")
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    if (file && file.type !== "application/pdf") {
      setError("Solo se admiten archivos PDF.")
      setPdfFile(null)
      return
    }
    setError(null)
    setPdfFile(file)
  }

  function removeFile() {
    setPdfFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!medication.trim() || !dosage.trim()) {
      setError("Medicamento y posología son obligatorios.")
      return
    }

    setLoading(true)
    setError(null)
    setDone(false)

    try {
      const body = new FormData()
      body.append("patientId", patientId)
      body.append("medication", medication.trim())
      body.append("dosage", dosage.trim())
      body.append("instructions", instructions.trim())
      if (pdfFile) body.append("pdf", pdfFile)

      const res = await fetch("/api/prescriptions/issue", { method: "POST", body })
      const json = await res.json()

      if (!res.ok || json.error) {
        setError(json.error ?? "Error al emitir la receta.")
        return
      }

      setDone(true)
      setMedication("")
      setDosage("")
      setInstructions("")
      setPdfFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
      router.refresh()
    } catch {
      setError("Error de red. Inténtalo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  if (patients.length === 0) {
    return (
      <p className="text-[14px] text-ink-soft">
        Aún no tienes pacientes con cita. Podrás emitir recetas cuando un paciente reserve contigo.
      </p>
    )
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      {/* Paciente */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="patient" className="text-[13.5px] font-medium text-ink">
          Paciente
        </label>
        <select
          id="patient"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          className="rounded-[10px] border border-ink/15 bg-paper px-3 py-2.5 text-[14px] text-ink focus:border-amber outline-none"
        >
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.email})
            </option>
          ))}
        </select>
      </div>

      {/* Medicamento */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="medication" className="text-[13.5px] font-medium text-ink">
          Medicamento <span className="text-clay">*</span>
        </label>
        <input
          id="medication"
          value={medication}
          onChange={(e) => setMedication(e.target.value)}
          required
          placeholder="Ej. Semaglutida 0,25 mg — Ozempic"
          className="rounded-[10px] border border-ink/15 bg-paper px-3 py-2.5 text-[14px] text-ink placeholder:text-ink/35 focus:border-amber outline-none"
        />
      </div>

      {/* Dosis */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="dosage" className="text-[13.5px] font-medium text-ink">
          Posología / dosis <span className="text-clay">*</span>
        </label>
        <input
          id="dosage"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
          required
          placeholder="Ej. 1 inyección subcutánea semanal — incrementar mensualmente"
          className="rounded-[10px] border border-ink/15 bg-paper px-3 py-2.5 text-[14px] text-ink placeholder:text-ink/35 focus:border-amber outline-none"
        />
      </div>

      {/* Instrucciones */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="instructions" className="text-[13.5px] font-medium text-ink">
          Instrucciones adicionales
          <span className="ml-1.5 text-[12px] font-normal text-ink-soft">(opcional)</span>
        </label>
        <textarea
          id="instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          rows={3}
          placeholder="Indicaciones de almacenamiento, efectos secundarios a vigilar, próxima revisión…"
          className="rounded-[10px] border border-ink/15 bg-paper px-3 py-2.5 text-[14px] text-ink placeholder:text-ink/35 focus:border-amber outline-none resize-none"
        />
      </div>

      {/* PDF de la receta */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[13.5px] font-medium text-ink">
          PDF de la receta oficial
          <span className="ml-1.5 text-[12px] font-normal text-ink-soft">(recomendado)</span>
        </label>

        {pdfFile ? (
          <div className="flex items-center gap-3 rounded-[10px] border border-olive/30 bg-olive/6 px-4 py-3">
            <FileText className="size-5 shrink-0 text-olive" aria-hidden />
            <span className="flex-1 truncate text-[13.5px] text-ink">{pdfFile.name}</span>
            <span className="text-[12px] text-ink-soft">
              {(pdfFile.size / 1024).toFixed(0)} KB
            </span>
            <button
              type="button"
              onClick={removeFile}
              className="rounded-full p-1 hover:bg-ink/8 transition-colors"
              aria-label="Quitar archivo"
            >
              <X className="size-4 text-ink-soft" />
            </button>
          </div>
        ) : (
          <label
            htmlFor="pdf-upload"
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[12px] border-2 border-dashed border-ink/15 bg-paper px-6 py-6 text-center transition-colors hover:border-amber hover:bg-amber/4"
          >
            <UploadCloud className="size-7 text-ink/35" aria-hidden />
            <span className="text-[13.5px] text-ink-soft">
              Arrastra el PDF aquí o{" "}
              <span className="font-medium text-ink underline underline-offset-2">selecciona un archivo</span>
            </span>
            <span className="text-[12px] text-ink/35">Solo PDF · Máx. 10 MB</span>
            <input
              id="pdf-upload"
              ref={fileInputRef}
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleFileChange}
              className="sr-only"
            />
          </label>
        )}

        <p className="text-[12px] text-ink-soft">
          Si subes el PDF oficial de la receta, se mostrará al paciente tal cual. Si no lo subes,
          se generará un documento automático con los datos introducidos.
        </p>
      </div>

      {error && <p className="text-[13.5px] text-clay">{error}</p>}
      {done && (
        <p className="text-[13.5px] text-olive font-medium">
          Receta emitida correctamente. El paciente ha sido notificado.
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="self-start rounded-full bg-ink px-6 py-2.5 text-[14px] font-semibold text-paper transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Emitiendo…" : "Emitir receta"}
      </button>
    </form>
  )
}
