"use client"

import { useState, useTransition } from "react"
import { updateClinicDetails, type ClinicStatus } from "@/app/actions/clinic"
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react"

const FIELD_LABELS: Record<string, string> = {
  clinicName: "Nome della clinica",
  name: "Nome della clinica",
  taxId: "Partita IVA / Codice Fiscale",
  addressLine: "Indirizzo",
  city: "Comune",
  postalCode: "CAP",
  province: "Provincia",
  healthRegistryNumber: "N. registro sanitario",
  medicalDirectorName: "Direttore sanitario",
  medicalDirectorLicense: "N. iscrizione albo",
  billingEmail: "Email di fatturazione",
  dataProtectionContact: "Responsabile GDPR",
  domain: "Dominio assegnato",
}

type Fields = {
  name: string
  taxId: string
  addressLine: string
  city: string
  postalCode: string
  province: string
  healthRegistryNumber: string
  medicalDirectorName: string
  medicalDirectorLicense: string
  billingEmail: string
  billingPhone: string
  dataProtectionContact: string
  domain: string
}

export function ClinicDetailsForm({ status }: { status: ClinicStatus }) {
  const [values, setValues] = useState<Fields>({
    name: status.name ?? "",
    taxId: status.taxId ?? "",
    addressLine: status.addressLine ?? "",
    city: status.city ?? "",
    postalCode: status.postalCode ?? "",
    province: status.province ?? "",
    healthRegistryNumber: status.healthRegistryNumber ?? "",
    medicalDirectorName: status.medicalDirectorName ?? "",
    medicalDirectorLicense: status.medicalDirectorLicense ?? "",
    billingEmail: status.billingEmail ?? "",
    billingPhone: status.billingPhone ?? "",
    dataProtectionContact: status.dataProtectionContact ?? "",
    domain: status.domain ?? "",
  })
  const [pending, startTransition] = useTransition()
  const [msg, setMsg] = useState<{ type: "ok" | "error"; text: string } | null>(null)

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }))

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    startTransition(async () => {
      const res = await updateClinicDetails(values)
      if ("error" in res) {
        setMsg({ type: "error", text: res.error })
      } else {
        setMsg({
          type: "ok",
          text: res.dataComplete
            ? "Dati salvati. La clinica soddisfa ora i requisiti per operare."
            : "Dati salvati. Mancano campi obbligatori per poter incassare.",
        })
      }
    })
  }

  return (
    <section className="rounded-[18px] border border-ink/10 bg-warm p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-[17px] font-medium text-ink">Dati della clinica</h2>
          <p className="mt-0.5 text-[13.5px] leading-relaxed text-ink-soft">
            Informazioni fiscali e sanitarie necessarie per operare e fatturare come struttura sanitaria.
          </p>
        </div>
        {status.dataComplete ? (
          <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-sage/25 px-3 py-1 text-[12.5px] font-medium text-ink">
            <CheckCircle2 className="size-3.5" aria-hidden /> Completo
          </span>
        ) : (
          <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-[12.5px] font-medium text-amber-900">
            <AlertCircle className="size-3.5" aria-hidden /> Incompleto
          </span>
        )}
      </div>

      {!status.dataComplete && status.missingFields.length > 0 && (
        <p className="mt-3 rounded-xl bg-amber-50 px-4 py-3 text-[13.5px] leading-relaxed text-amber-900">
          Da completare:{" "}
          <span className="font-medium">
            {status.missingFields.map((f) => FIELD_LABELS[f] ?? f).join(", ")}
          </span>
          .
        </p>
      )}

      <form onSubmit={onSubmit} className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Nome della clinica *" value={values.name} onChange={set("name")} required />
        <Field label="Partita IVA / Codice Fiscale *" value={values.taxId} onChange={set("taxId")} required />

        <Field
          label="Indirizzo *"
          value={values.addressLine}
          onChange={set("addressLine")}
          className="sm:col-span-2"
          required
        />
        <Field label="Comune *" value={values.city} onChange={set("city")} required />
        <div className="grid grid-cols-2 gap-4">
          <Field label="CAP *" value={values.postalCode} onChange={set("postalCode")} required />
          <Field label="Provincia *" value={values.province} onChange={set("province")} required />
        </div>

        <Field
          label="N. registro sanitario (autorizzazione) *"
          value={values.healthRegistryNumber}
          onChange={set("healthRegistryNumber")}
          className="sm:col-span-2"
          required
        />
        <Field
          label="Direttore sanitario *"
          value={values.medicalDirectorName}
          onChange={set("medicalDirectorName")}
          required
        />
        <Field
          label="N. iscrizione albo del direttore *"
          value={values.medicalDirectorLicense}
          onChange={set("medicalDirectorLicense")}
          required
        />

        <Field
          label="Email di fatturazione *"
          type="email"
          value={values.billingEmail}
          onChange={set("billingEmail")}
          required
        />
        <Field
          label="Telefono di fatturazione"
          value={values.billingPhone}
          onChange={set("billingPhone")}
        />
        <Field
          label="Responsabile della protezione dei dati (GDPR) *"
          value={values.dataProtectionContact}
          onChange={set("dataProtectionContact")}
          className="sm:col-span-2"
          required
        />
        <Field
          label="Dominio assegnato (es. doctorlife-it.com)"
          value={values.domain}
          onChange={set("domain")}
          className="sm:col-span-2"
        />

        <div className="flex items-center gap-3 sm:col-span-2">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-ink px-5 text-[14.5px] font-medium text-cream transition hover:opacity-90 disabled:opacity-60"
          >
            {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
            {pending ? "Salvataggio…" : "Salva dati"}
          </button>
          {msg && (
            <p
              className={
                "text-[13.5px] " + (msg.type === "ok" ? "text-ink" : "text-red-600")
              }
              role="status"
            >
              {msg.text}
            </p>
          )}
        </div>
      </form>
      <p className="mt-3 text-[12px] leading-relaxed text-ink-mute">* Campi obbligatori per poter incassare.</p>
    </section>
  )
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  className = "",
}: {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  required?: boolean
  className?: string
}) {
  return (
    <label className={"block " + className}>
      <span className="mb-1.5 block text-[12.5px] font-medium text-ink-soft">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="min-h-[44px] w-full rounded-xl border border-ink/15 bg-cream px-3.5 text-[15px] text-ink outline-none transition focus:border-ink/40"
      />
    </label>
  )
}
