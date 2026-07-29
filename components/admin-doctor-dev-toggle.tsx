"use client"

import { useState, useTransition } from "react"
import { setDoctorDevOnly } from "@/app/actions/admin"

export function AdminDoctorDevToggle({
  doctorId,
  initial,
}: {
  doctorId: string
  initial: boolean
}) {
  const [isDevOnly, setIsDevOnly] = useState(initial)
  const [pending, startTransition] = useTransition()

  function toggle() {
    const next = !isDevOnly
    setIsDevOnly(next)
    startTransition(async () => {
      const res = await setDoctorDevOnly(doctorId, next)
      if (!res?.ok) setIsDevOnly(!next) // revertir si falla
    })
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-pressed={isDevOnly}
      title={isDevOnly ? "Solo visible en dev.doctorlife.io" : "Visible en producción (doctorlife.io)"}
      className={`rounded-full px-3 py-1 text-[12px] font-semibold transition disabled:opacity-60 ${
        isDevOnly
          ? "bg-amber-100 text-amber-800"
          : "bg-sage/30 text-ink"
      }`}
    >
      {isDevOnly ? "DEV" : "PROD"}
    </button>
  )
}
