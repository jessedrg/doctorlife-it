"use client"

import { useState } from "react"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { BrandLogo } from "./brand-logo"

export function RequestResetForm() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Better Auth no revela si el email existe: respondemos igual en ambos casos.
    await authClient.requestPasswordReset({
      email,
      redirectTo: "/restablecer",
    })
    setLoading(false)
    setSent(true)
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-paper px-4 py-10">
      <div className="w-full max-w-[420px]">
        <Link href="/" className="mb-8 flex justify-center">
          <BrandLogo />
        </Link>

        <div
          className="rounded-[26px] border border-ink/10 bg-cream p-7 sm:p-8"
          style={{ boxShadow: "0 24px 60px rgba(0,0,0,.08)" }}
        >
          {sent ? (
            <>
              <h1 className="text-[26px] font-light leading-tight tracking-[-.02em] text-ink text-balance">
                Controlla la tua email
              </h1>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-soft">
                Se <span className="font-medium text-ink">{email}</span> ha un account, ti abbiamo inviato un link
                per reimpostare la password. Il link scade tra 1 ora.
              </p>
              <Link
                href="/sign-in"
                className="mt-6 inline-block w-full rounded-[13px] bg-ink py-3.5 text-center text-[15px] font-semibold text-paper transition-opacity hover:opacity-90"
              >
                Torna al login
              </Link>
            </>
          ) : (
            <>
              <h1 className="text-[26px] font-light leading-tight tracking-[-.02em] text-ink text-balance">
                Recupera password
              </h1>
              <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-soft">
                Inserisci la tua email e ti invieremo un link per creare una nuova password.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                <label className="flex flex-col gap-1.5 text-[13px] font-medium text-ink-soft">
                  Email
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="rounded-[13px] border border-ink/15 bg-warm px-[16px] py-3.5 text-[15.5px] text-ink outline-none transition-colors focus:border-amber"
                  />
                </label>
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-1 w-full cursor-pointer rounded-[13px] bg-ink py-3.5 text-[15px] font-semibold text-paper transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {loading ? "Invio..." : "Invia link"}
                </button>
              </form>

              <p className="mt-6 text-center text-[13.5px] text-ink-soft">
                <Link href="/sign-in" className="font-medium text-ink underline underline-offset-4">
                  Torna al login
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
