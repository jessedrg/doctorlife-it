"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { BrandLogo } from "./brand-logo"

export function ResetPasswordForm({
  token,
  tokenError,
}: {
  token: string | null
  tokenError: string | null
}) {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const invalid = !token || tokenError

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.")
      return
    }
    setLoading(true)
    const { error } = await authClient.resetPassword({ newPassword: password, token: token! })
    setLoading(false)
    if (error) {
      setError(error.message ?? "No se pudo restablecer la contraseña. Solicita un nuevo enlace.")
      return
    }
    setDone(true)
    setTimeout(() => router.push("/sign-in"), 1800)
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
          {invalid ? (
            <>
              <h1 className="text-[26px] font-light leading-tight tracking-[-.02em] text-ink text-balance">
                Enlace no válido
              </h1>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-soft">
                Este enlace de recuperación ha caducado o no es válido. Solicita uno nuevo.
              </p>
              <Link
                href="/recuperar"
                className="mt-6 inline-block w-full rounded-[13px] bg-ink py-3.5 text-center text-[15px] font-semibold text-paper transition-opacity hover:opacity-90"
              >
                Solicitar nuevo enlace
              </Link>
            </>
          ) : done ? (
            <>
              <h1 className="text-[26px] font-light leading-tight tracking-[-.02em] text-ink text-balance">
                Contraseña actualizada
              </h1>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-soft">
                Te estamos redirigiendo para iniciar sesión…
              </p>
            </>
          ) : (
            <>
              <h1 className="text-[26px] font-light leading-tight tracking-[-.02em] text-ink text-balance">
                Crea tu nueva contraseña
              </h1>
              <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-soft">
                Elige una contraseña de al menos 8 caracteres.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                <label className="flex flex-col gap-1.5 text-[13px] font-medium text-ink-soft">
                  Nueva contraseña
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className="rounded-[13px] border border-ink/15 bg-warm px-[16px] py-3.5 text-[15.5px] text-ink outline-none transition-colors focus:border-amber"
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-[13px] font-medium text-ink-soft">
                  Repite la contraseña
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    minLength={8}
                    autoComplete="new-password"
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
                  {loading ? "Guardando..." : "Guardar contraseña"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
