"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { deleteClinic } from "@/app/actions/admin"

export function AdminDeleteClinic({
  doctorId,
  clinicName,
}: {
  doctorId: string
  clinicName: string
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function removeClinic() {
    const confirmed = window.confirm(
      `¿Eliminar definitivamente la clínica «${clinicName}» y todos sus datos asociados? Esta acción no se puede deshacer.`,
    )
    if (!confirmed) return

    setError(null)
    startTransition(async () => {
      try {
        const result = await deleteClinic(doctorId)
        if (!result.ok) {
          setError(result.error ?? "No se puede eliminar esta clínica.")
          return
        }
        router.refresh()
      } catch {
        setError("No se pudo eliminar la clínica. Inténtalo de nuevo.")
      }
    })
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={removeClinic}
        disabled={pending}
        className="rounded-full border border-red-900/20 px-3 py-1 text-[12px] font-semibold text-red-900 transition hover:bg-red-900/10 disabled:opacity-60"
      >
        {pending ? "Eliminando…" : "Eliminar"}
      </button>
      {error && (
        <p role="alert" className="max-w-52 text-xs text-red-900">
          {error}
        </p>
      )}
    </div>
  )
}
