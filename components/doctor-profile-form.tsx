"use client"

import { useRef, useState, useTransition } from "react"
import { Camera, Loader2, Users } from "lucide-react"
import { UserAvatar } from "@/components/user-avatar"
import { updateDoctorProfile, uploadDoctorAvatar } from "@/app/actions/doctor"

type Profile = {
  fullName: string
  specialty: string | null
  licenseNumber: string | null
  bio: string | null
  acceptingPatients: boolean
  maxPatients: number | null
  image: string | null
}

const PRESET_LIMITS = [10, 25, 50, 100]

export function DoctorProfileForm({ profile }: { profile: Profile }) {
  const [image, setImage] = useState(profile.image)
  const [fullName, setFullName] = useState(profile.fullName)
  const [specialty, setSpecialty] = useState(profile.specialty ?? "")
  const [licenseNumber, setLicenseNumber] = useState(profile.licenseNumber ?? "")
  const [bio, setBio] = useState(profile.bio ?? "")
  const [accepting, setAccepting] = useState(profile.acceptingPatients)
  const [maxPatients, setMaxPatients] = useState<number | null>(profile.maxPatients)

  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [pending, startTransition] = useTransition()
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setMsg(null)
    setUploading(true)
    const fd = new FormData()
    fd.append("file", file)
    const res = await uploadDoctorAvatar(fd)
    setUploading(false)
    if (res.ok) {
      setImage(res.url)
      setMsg({ ok: true, text: "Foto actualizada." })
    } else {
      setMsg({ ok: false, text: res.error })
    }
    if (fileRef.current) fileRef.current.value = ""
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    startTransition(async () => {
      const res = await updateDoctorProfile({
        fullName,
        specialty,
        licenseNumber,
        bio,
        acceptingPatients: accepting,
        maxPatients,
      })
      setMsg(
        res.ok
          ? { ok: true, text: "Perfil guardado." }
          : { ok: false, text: res.error ?? "No se pudo guardar." },
      )
    })
  }

  const inputCls =
    "rounded-[13px] border border-ink/15 bg-warm px-[16px] py-3.5 text-[15.5px] text-ink outline-none transition-colors focus:border-amber"
  const labelCls = "flex flex-col gap-1.5 text-[13px] font-medium text-ink-soft"

  return (
    <form onSubmit={handleSubmit} className="flex max-w-[560px] flex-col gap-5">
      {/* Foto */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <UserAvatar name={fullName || "Médico"} image={image} size={76} />
          {uploading && (
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-ink/40">
              <Loader2 className="size-5 animate-spin text-paper" aria-hidden />
            </span>
          )}
        </div>
        <div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-warm px-4 py-2 text-[13.5px] font-medium text-ink transition-colors hover:bg-ink/5 disabled:opacity-60"
          >
            <Camera className="size-4" aria-hidden />
            {image ? "Cambiar foto" : "Subir foto"}
          </button>
          <p className="mt-1.5 text-[12px] text-ink-mute">JPG o PNG, hasta 5 MB.</p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
        </div>
      </div>

      <label className={labelCls}>
        Nombre completo
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className={inputCls}
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className={labelCls}>
          Especialidad
          <input
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            placeholder="Medicina general"
            className={inputCls}
          />
        </label>
        <label className={labelCls}>
          Nº de colegiado
          <input
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            placeholder="000000000"
            className={inputCls}
          />
        </label>
      </div>

      <label className={labelCls}>
        Sobre ti
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          placeholder="Una breve presentación que verán tus pacientes."
          className={`${inputCls} resize-none`}
        />
      </label>

      <label className="flex cursor-pointer items-center justify-between gap-4 rounded-[13px] border border-ink/15 bg-warm px-[16px] py-3.5">
        <span>
          <span className="block text-[14.5px] font-medium text-ink">Acepto nuevos pacientes</span>
          <span className="block text-[12.5px] text-ink-soft">
            Controla si apareces disponible para nuevas reservas.
          </span>
        </span>
        <input
          type="checkbox"
          checked={accepting}
          onChange={(e) => setAccepting(e.target.checked)}
          className="size-5 shrink-0 accent-ink"
        />
      </label>

      {/* Límite de pacientes activos */}
      <div className="rounded-[13px] border border-ink/15 bg-warm px-[16px] py-4">
        <div className="flex items-start gap-3">
          <Users className="mt-0.5 size-[18px] shrink-0 text-ink-soft" aria-hidden />
          <div className="flex-1 min-w-0">
            <span className="block text-[14.5px] font-medium text-ink">
              Límite de pacientes activos
            </span>
            <span className="mt-0.5 block text-[12.5px] text-ink-soft">
              Cuando alcances este número, se dejará de mostrarte como disponible para nuevas
              suscripciones. Déjalo en «Sin límite» para no restringir.
            </span>

            {/* Presets */}
            <div className="mt-3 flex flex-wrap gap-2">
              {PRESET_LIMITS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setMaxPatients(n)}
                  className={`rounded-full px-3 py-1 text-[13px] font-medium transition-colors ${
                    maxPatients === n
                      ? "bg-ink text-paper"
                      : "border border-ink/20 bg-paper text-ink hover:bg-ink/5"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setMaxPatients(null)}
                className={`rounded-full px-3 py-1 text-[13px] font-medium transition-colors ${
                  maxPatients === null
                    ? "bg-ink text-paper"
                    : "border border-ink/20 bg-paper text-ink hover:bg-ink/5"
                }`}
              >
                Sin límite
              </button>
            </div>

            {/* Input personalizado */}
            <div className="mt-3 flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={9999}
                step={1}
                value={maxPatients ?? ""}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10)
                  setMaxPatients(isNaN(v) || v <= 0 ? null : v)
                }}
                placeholder="Número personalizado…"
                className="w-[190px] rounded-[10px] border border-ink/15 bg-paper px-3 py-2 text-[13.5px] text-ink outline-none transition-colors focus:border-amber"
              />
              {maxPatients !== null && (
                <span className="text-[13px] text-ink-soft">pacientes máximo</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {msg && (
        <p className={`text-[13.5px] ${msg.ok ? "text-olive" : "text-clay"}`}>{msg.text}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-[13px] bg-ink py-3.5 text-[15px] font-semibold text-paper transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-auto sm:px-8 sm:self-start"
      >
        {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
        {pending ? "Guardando…" : "Guardar perfil"}
      </button>
    </form>
  )
}
