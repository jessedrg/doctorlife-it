"use client"

import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

export function SignOutButton({ className }: { className?: string }) {
  const router = useRouter()
  return (
    <button
      type="button"
      onClick={async () => {
        await authClient.signOut()
        router.push("/sign-in")
        router.refresh()
      }}
      className={
        className ??
        "cursor-pointer rounded-full border border-ink/15 px-4 py-2 text-[13.5px] font-medium text-ink-soft transition-colors hover:bg-warm"
      }
    >
      Cerrar sesión
    </button>
  )
}
