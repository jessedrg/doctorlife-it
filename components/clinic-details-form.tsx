"use client"

import { useState, useTransition } from "react"
import { updateClinicDetails, type ClinicStatus } from "@/app/actions/clinic"
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react"

const FIELD_LABELS: Record<string, string> = {
  clinicName: "Nombre de la clínica",
  name: "Nombre de la clínica",
  taxId: "CIF/NIF",
  addressLine: "Dirección",
  city: "Municipio",
  postalCode: "Código postal",
  province: "Provincia",
  healthRegistryNumber: "Nº registro sanitario",
  medicalDirectorName: "Director médico",
  medicalDirectorLicense: "Nº colegiado",
  billingEmail: "Email de facturación",
  dataProtectionContact: "Responsable RGPD",
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
            ? "Datos guardados. La clínica ya cumple los requisitos para operar."
            : "Datos guardados. Faltan campos obligatorios para poder cobrar.",
        })
      }
    })
  }

  return (
    <section className="rounded-[18px] border border-ink/10 bg-warm p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-[17px] font-medium text-ink">Datos de la clínica</h2>
          <p className="mt-0.5 text-[13.5px] leading-relaxed text-ink-soft">
            Información fiscal y sanitaria necesaria para operar y facturar como centro sanitario.
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
          Faltan por completar:{" "}
          <span className="font-medium">
            {status.missingFields.map((f) => FIELD_LABELS[f] ?? f).join(", ")}
          </span>
          .
        </p>
      )}

      <form onSubmit={onSubmit} className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Nombre de la clínica *" value={values.name} onChange={set("name")} required />
        <Field label="CIF/NIF *" value={values.taxId} onChange={set("taxId")} required />

        <Field
          label="Dirección *"
          value={values.addressLine}
          onChange={set("addressLine")}
          className="sm:col-span-2"
          required
        />
        <Field label="Municipio *" value={values.city} onChange={set("city")} required />
        <div className="grid grid-cols-2 gap-4">
          <Field label="C. Postal *" value={values.postalCode} onChange={set("postalCode")} required />
          <Field label="Provincia *" value={values.province} onChange={set("province")} required />
        </div>

        <Field
          label="Nº registro sanitario (NICA/autorización) *"
          value={values.healthRegistryNumber}
          onChange={set("healthRegistryNumber")}
          className="sm:col-span-2"
          required
        />
        <Field
          label="Director médico *"
          value={values.medicalDirectorName}
          onChange={set("medicalDirectorName")}
          required
        />
        <Field
          label="Nº colegiado del director *"
          value={values.medicalDirectorLicense}
          onChange={set("medicalDirectorLicense")}
          required
        />

        <Field
          label="Email de facturación *"
          type="email"
          value={values.billingEmail}
          onChange={set("billingEmail")}
          required
        />
        <Field
          label="Teléfono de facturación"
          value={values.billingPhone}
          onChange={set("billingPhone")}
        />
        <Field
          label="Responsable de protección de datos (RGPD) *"
          value={values.dataProtectionContact}
          onChange={set("dataProtectionContact")}
          className="sm:col-span-2"
          required
        />

        <div className="flex items-center gap-3 sm:col-span-2">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-ink px-5 text-[14.5px] font-medium text-cream transition hover:opacity-90 disabled:opacity-60"
          >
            {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
            {pending ? "Guardando…" : "Guardar datos"}
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
      <p className="mt-3 text-[12px] leading-relaxed text-ink-mute">* Campos obligatorios para poder cobrar.</p>
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
