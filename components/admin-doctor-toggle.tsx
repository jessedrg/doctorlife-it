"use client"

import { useState, useTransition } from "react"
import { setDoctorAccepting } from "@/app/actions/admin"

export function AdminDoctorToggle({
  doctorId,
  initial,
}: {
  doctorId: string
  initial: boolean
}) {
  const [accepting, setAccepting] = useState(initial)
  const [pending, startTransition] = useTransition()

  function toggle() {
    const next = !accepting
    setAccepting(next)
    startTransition(async () => {
      const res = await setDoctorAccepting(doctorId, next)
      if (!res?.ok) setAccepting(!next) // revertir si falla
    })
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-pressed={accepting}
      className={`rounded-full px-3 py-1 text-[12px] font-semibold transition disabled:opacity-60 ${
        accepting ? "bg-sage/30 text-ink" : "bg-ink/10 text-ink-soft"
      }`}
    >
      {accepting ? "Aceptando" : "Pausado"}
    </button>
  )
}
