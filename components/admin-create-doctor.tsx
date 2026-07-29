"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createDoctor } from "@/app/actions/admin"

export function AdminCreateDoctor() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [specialty, setSpecialty] = useState("")
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [pending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    startTransition(async () => {
      const res = await createDoctor({ name, email, specialty })
      if (res.ok) {
        setMsg({ ok: true, text: `Cuenta creada. Enviamos las credenciales a ${email}.` })
        setName("")
        setEmail("")
        setSpecialty("")
        router.refresh()
      } else {
        setMsg({ ok: false, text: res.error ?? "No se pudo completar." })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[20px] border border-ink/10 bg-cream p-5">
      <h2 className="text-[16px] font-medium text-ink">Invitar clínica</h2>
      <p className="mt-1 text-[13.5px] leading-relaxed text-ink-soft">
        Crea la cuenta de una clínica. Recibirá por email su usuario y una contraseña temporal que
        podrá cambiar. Después conectará su propio Stripe y sus datos fiscales desde su portal.
      </p>
      <div className="mt-4 flex flex-col gap-2.5">
        <div className="flex flex-col gap-2.5 sm:flex-row">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre de la clínica o del profesional"
            className="flex-1 rounded-full border border-ink/15 bg-paper px-4 py-2.5 text-[14px] text-ink outline-none placeholder:text-ink-mute focus:border-ink/35"
          />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="clinica@ejemplo.com"
            className="flex-1 rounded-full border border-ink/15 bg-paper px-4 py-2.5 text-[14px] text-ink outline-none placeholder:text-ink-mute focus:border-ink/35"
          />
        </div>
        <div className="flex flex-col gap-2.5 sm:flex-row">
          <input
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            placeholder="Especialidad (p. ej. Endocrinología)"
            className="flex-1 rounded-full border border-ink/15 bg-paper px-4 py-2.5 text-[14px] text-ink outline-none placeholder:text-ink-mute focus:border-ink/35"
          />
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-ink px-5 py-2.5 text-[14px] font-semibold text-paper transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {pending ? "Creando…" : "Invitar clínica"}
          </button>
        </div>
      </div>
      {msg && <p className={`mt-3 text-[13.5px] ${msg.ok ? "text-olive" : "text-clay"}`}>{msg.text}</p>}
    </form>
  )
}
