"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createDoctor } from "@/app/actions/admin"

export function AdminCreateDoctor() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [specialty, setSpecialty] = useState("")
  const [domain, setDomain] = useState("")
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [pending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    startTransition(async () => {
      const res = await createDoctor({ name, email, specialty, domain })
      if (res.ok) {
        setMsg({ ok: true, text: `Account creato. Abbiamo inviato le credenziali a ${email}.` })
        setName("")
        setEmail("")
        setSpecialty("")
        setDomain("")
        router.refresh()
      } else {
        setMsg({ ok: false, text: res.error ?? "Impossibile completare." })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[20px] border border-ink/10 bg-cream p-5">
      <h2 className="text-[16px] font-medium text-ink">Invita clinica</h2>
      <p className="mt-1 text-[13.5px] leading-relaxed text-ink-soft">
        Crea l'account di una clinica. Riceverà via email il suo utente e una password temporanea che
        potrà cambiare. In seguito collegherà il proprio Stripe e i suoi dati fiscali dal suo portale.
      </p>
      <div className="mt-4 flex flex-col gap-2.5">
        <div className="flex flex-col gap-2.5 sm:flex-row">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome della clinica o del professionista"
            className="flex-1 rounded-full border border-ink/15 bg-paper px-4 py-2.5 text-[14px] text-ink outline-none placeholder:text-ink-mute focus:border-ink/35"
          />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="clinica@esempio.com"
            className="flex-1 rounded-full border border-ink/15 bg-paper px-4 py-2.5 text-[14px] text-ink outline-none placeholder:text-ink-mute focus:border-ink/35"
          />
        </div>
        <div className="flex flex-col gap-2.5 sm:flex-row">
          <input
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            placeholder="Specializzazione (es. Endocrinologia)"
            className="flex-1 rounded-full border border-ink/15 bg-paper px-4 py-2.5 text-[14px] text-ink outline-none placeholder:text-ink-mute focus:border-ink/35"
          />
          <input
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="Dominio assegnato (es. doctorlife-it.com)"
            className="flex-1 rounded-full border border-ink/15 bg-paper px-4 py-2.5 text-[14px] text-ink outline-none placeholder:text-ink-mute focus:border-ink/35"
          />
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-ink px-5 py-2.5 text-[14px] font-semibold text-paper transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {pending ? "Creazione…" : "Invita clinica"}
          </button>
        </div>
      </div>
      {msg && <p className={`mt-3 text-[13.5px] ${msg.ok ? "text-olive" : "text-clay"}`}>{msg.text}</p>}
    </form>
  )
}
