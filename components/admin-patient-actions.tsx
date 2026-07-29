"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Trash2, UserX, Loader2 } from "lucide-react"
import { purgeAllPatients, purgeOrphanedPatients } from "@/app/actions/admin"

export function AdminPatientActions() {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null)
  const [confirmAll, setConfirmAll] = useState(false)

  function run(action: () => Promise<{ ok: boolean; deleted: number }>, label: string) {
    setMsg(null)
    startTransition(async () => {
      try {
        const res = await action()
        setMsg({
          ok: res.ok,
          text: res.ok
            ? res.deleted === 0
              ? `No había ${label} que borrar.`
              : `${res.deleted} ${label} eliminado${res.deleted !== 1 ? "s" : ""} correctamente.`
            : "Error al eliminar.",
        })
        router.refresh()
      } catch (e) {
        setMsg({ ok: false, text: e instanceof Error ? e.message : "Error inesperado." })
      } finally {
        setConfirmAll(false)
      }
    })
  }

  return (
    <div className="flex shrink-0 flex-col items-end gap-2">
      {/* Purgar colgados */}
      <button
        type="button"
        disabled={pending}
        onClick={() => run(purgeOrphanedPatients, "paciente sin cita")}
        className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-paper px-4 py-2 text-[13px] font-medium text-ink transition-colors hover:bg-warm disabled:opacity-60"
      >
        {pending ? (
          <Loader2 className="size-3.5 animate-spin" aria-hidden />
        ) : (
          <UserX className="size-3.5" aria-hidden />
        )}
        Purgar sin cita
      </button>

      {/* Borrar todos — requiere doble confirmación */}
      {!confirmAll ? (
        <button
          type="button"
          disabled={pending}
          onClick={() => setConfirmAll(true)}
          className="inline-flex items-center gap-1.5 rounded-full border border-clay/30 bg-clay/8 px-4 py-2 text-[13px] font-medium text-clay transition-colors hover:bg-clay/15 disabled:opacity-60"
        >
          <Trash2 className="size-3.5" aria-hidden />
          Borrar todos
        </button>
      ) : (
        <div className="flex items-center gap-2 rounded-[12px] border border-clay/30 bg-clay/8 px-3 py-2">
          <span className="text-[12.5px] text-clay">¿Seguro?</span>
          <button
            type="button"
            disabled={pending}
            onClick={() => run(purgeAllPatients, "paciente")}
            className="rounded-full bg-clay px-3 py-1 text-[12.5px] font-semibold text-paper hover:opacity-90 disabled:opacity-60"
          >
            {pending ? <Loader2 className="size-3 animate-spin" aria-hidden /> : "Sí, borrar"}
          </button>
          <button
            type="button"
            onClick={() => setConfirmAll(false)}
            className="rounded-full border border-clay/30 px-3 py-1 text-[12.5px] text-clay hover:bg-clay/10"
          >
            Cancelar
          </button>
        </div>
      )}

      {msg && (
        <p className={`text-[12.5px] ${msg.ok ? "text-olive" : "text-clay"}`}>{msg.text}</p>
      )}
    </div>
  )
}
