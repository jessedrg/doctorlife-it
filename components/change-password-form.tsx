"use client"

import { useState } from "react"
import { authClient } from "@/lib/auth-client"

export function ChangePasswordForm() {
  const [current, setCurrent] = useState("")
  const [next, setNext] = useState("")
  const [confirm, setConfirm] = useState("")
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg(null)
    if (next !== confirm) {
      setMsg({ ok: false, text: "Las contraseñas nuevas no coinciden." })
      return
    }
    setLoading(true)
    const { error } = await authClient.changePassword({
      currentPassword: current,
      newPassword: next,
      revokeOtherSessions: true,
    })
    setLoading(false)
    if (error) {
      setMsg({ ok: false, text: error.message ?? "No se pudo cambiar la contraseña." })
      return
    }
    setMsg({ ok: true, text: "Contraseña actualizada correctamente." })
    setCurrent("")
    setNext("")
    setConfirm("")
  }

  const inputCls =
    "rounded-[13px] border border-ink/15 bg-warm px-[16px] py-3.5 text-[15.5px] text-ink outline-none transition-colors focus:border-amber"

  return (
    <form onSubmit={handleSubmit} className="flex max-w-[440px] flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-[13px] font-medium text-ink-soft">
        Contraseña actual
        <input
          type="password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          required
          autoComplete="current-password"
          className={inputCls}
        />
      </label>
      <label className="flex flex-col gap-1.5 text-[13px] font-medium text-ink-soft">
        Nueva contraseña
        <input
          type="password"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
          className={inputCls}
        />
      </label>
      <label className="flex flex-col gap-1.5 text-[13px] font-medium text-ink-soft">
        Repite la nueva contraseña
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
          className={inputCls}
        />
      </label>

      {msg && <p className={`text-[13.5px] ${msg.ok ? "text-olive" : "text-clay"}`}>{msg.text}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-1 w-full rounded-[13px] bg-ink py-3.5 text-[15px] font-semibold text-paper transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Guardando..." : "Cambiar contraseña"}
      </button>
    </form>
  )
}
