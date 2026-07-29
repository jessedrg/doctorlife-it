"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { BrandLogo } from "./brand-logo"

export function AuthForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await authClient.signIn.email({ email, password })

    setLoading(false)

    if (error) {
      setError(error.message ?? "Email o contraseña incorrectos.")
      return
    }

    // El layout del destino reenvía a cada usuario según su rol.
    router.push("/portal")
    router.refresh()
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-paper px-4 py-10">
      <div className="w-full max-w-[420px]">
        <Link href="/" className="mb-8 flex justify-center">
          <BrandLogo />
        </Link>

        <div className="rounded-[26px] border border-ink/10 bg-cream p-7 sm:p-8" style={{ boxShadow: "0 24px 60px rgba(0,0,0,.08)" }}>
          <h1 className="text-[26px] font-light leading-tight tracking-[-.02em] text-ink text-balance">
            Bienvenido de nuevo
          </h1>
          <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-soft">
            Inicia sesión con el correo y la contraseña que te enviamos.
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
            <label className="flex flex-col gap-1.5 text-[13px] font-medium text-ink-soft">
              Contraseña
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="current-password"
                className="rounded-[13px] border border-ink/15 bg-warm px-[16px] py-3.5 text-[15.5px] text-ink outline-none transition-colors focus:border-amber"
              />
            </label>

            {error && (
              <p className="text-[13.5px] text-clay" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full cursor-pointer rounded-[13px] bg-ink py-3.5 text-[15px] font-semibold text-paper transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Un momento..." : "Iniciar sesión"}
            </button>
          </form>

          <p className="mt-6 text-center text-[13.5px] text-ink-soft">
            <Link href="/recuperar" className="font-medium text-ink underline underline-offset-4">
              ¿Olvidaste tu contraseña?
            </Link>
          </p>
          <p className="mt-3 text-center text-[13px] leading-relaxed text-ink-mute">
            ¿Aún no eres paciente?{" "}
            <Link href="/#planes" className="font-medium text-ink underline underline-offset-4">
              Empieza tu tratamiento
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
