"use client"

import { useState } from "react"
import { FileText, Download, Eye, EyeOff, Lock, ChevronDown, ChevronUp, User, Calendar } from "lucide-react"
import { MAIN_PLAN } from "@/lib/plans"
import { UnlockPrescriptionsButton } from "@/components/unlock-prescriptions-button"
import { EmptyState } from "@/components/empty-state"

interface PrescriptionRow {
  id: number
  medication: string
  dosage: string
  instructions: string | null
  issuedAt: Date
  doctorName: string | null
  patientName: string | null
}

function PrescriptionCard({
  p,
  showPatient,
  locked,
}: {
  p: PrescriptionRow
  showPatient: boolean
  locked: boolean
}) {
  const [pdfOpen, setPdfOpen] = useState(false)

  const dateStr = new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Rome",
  }).format(new Date(p.issuedAt))

  if (locked) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-ink/10 bg-paper p-5">
        {/* Blurred content */}
        <div className="select-none blur-sm" aria-hidden>
          <p className="font-semibold text-ink">Trattamento prescritto</p>
          <p className="mt-1 text-sm text-ink-soft">Posologia disponibile all'attivazione</p>
        </div>
        {/* Lock overlay */}
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-cream/60 backdrop-blur-[2px]">
          <div className="flex flex-col items-center gap-1 text-center">
            <Lock className="size-5 text-ink-soft" />
            <span className="text-xs font-medium text-ink-soft">Attiva il tuo piano per vedere</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-ink/10 bg-paper">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 p-5">
        <div className="flex min-w-0 items-start gap-3">
          <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-sage/30">
            <FileText className="size-4 text-ink" />
          </span>
          <div className="min-w-0">
            <h3 className="font-semibold text-ink">{p.medication}</h3>
            <p className="mt-0.5 text-sm text-ink-soft">{p.dosage}</p>
            {p.instructions && (
              <p className="mt-1 text-[13px] leading-relaxed text-ink-soft/80">{p.instructions}</p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="flex items-center gap-1 text-xs text-ink-soft/60">
                <Calendar className="size-3" />
                {dateStr}
              </span>
              <span className="flex items-center gap-1 text-xs text-ink-soft/60">
                <User className="size-3" />
                {showPatient ? `Paziente: ${p.patientName ?? "—"}` : `Dr. ${p.doctorName ?? "—"}`}
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setPdfOpen((v) => !v)}
            className="flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-paper transition-opacity hover:opacity-90"
          >
            {pdfOpen ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
            {pdfOpen ? "Chiudi" : "Vedi ricetta"}
          </button>
          <a
            href={`/api/prescriptions/${p.id}`}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="flex items-center gap-1.5 rounded-full border border-ink/20 bg-paper px-4 py-2 text-[13px] font-medium text-ink transition-colors hover:bg-ink/5"
          >
            <Download className="size-3.5" />
            PDF
          </a>
        </div>
      </div>

      {/* Inline PDF viewer */}
      {pdfOpen && (
        <div className="border-t border-ink/8 px-5 pb-5 pt-4">
          <iframe
            src={`/api/prescriptions/${p.id}#toolbar=0`}
            title={`Ricetta: ${p.medication}`}
            className="h-[600px] w-full rounded-xl border border-ink/10 bg-cream"
          />
        </div>
      )}
    </div>
  )
}

export function PrescriptionList({
  prescriptions,
  showPatient = false,
  locked = false,
}: {
  prescriptions: PrescriptionRow[]
  showPatient?: boolean
  locked?: boolean
}) {
  if (prescriptions.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title={showPatient ? "Non hai ancora emesso ricette" : "Non hai ancora ricette"}
        description={
          showPatient
            ? "Quando emetti una ricetta, apparirà qui e sarà disponibile nel portale del tuo paziente."
            : "Il tuo medico pubblicherà qui i tuoi trattamenti. Potrai vederli e scaricarli in PDF quando saranno pronti."
        }
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {locked && (
        <div className="rounded-2xl border border-amber/40 bg-amber/10 p-5">
          <div className="flex items-start gap-3">
            <span
              aria-hidden
              className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-amber/20"
            >
              <Lock className="size-4 text-amber-700" />
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-ink">La tua ricetta è pronta</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                Il tuo medico ha preparato il tuo trattamento. Per vederlo e scaricare il PDF, attiva
                il tuo abbonamento mensile. Include il monitoraggio con il tuo medico, una consulenza
                telefonica al mese e chat dal vivo, per {MAIN_PLAN.totalLabel}. Nessun vincolo: disdici quando vuoi.
              </p>
              <div className="mt-3">
                <UnlockPrescriptionsButton priceLabel={MAIN_PLAN.totalLabel} />
              </div>
            </div>
          </div>
        </div>
      )}

      <ul className="flex flex-col gap-3">
        {prescriptions.map((p) => (
          <li key={p.id}>
            <PrescriptionCard p={p} showPatient={showPatient} locked={locked} />
          </li>
        ))}
      </ul>
    </div>
  )
}
