"use client"

import { useState } from "react"
import { startSubscriptionCheckout } from "@/app/actions/subscription"

export function UnlockPrescriptionsButton({ priceLabel }: { priceLabel: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function unlock() {
    setError(null)
    setLoading(true)
    try {
      const res = await startSubscriptionCheckout()
      if ("url" in res) {
        window.location.href = res.url
        return
      }
      setError(res.error)
    } catch {
      setError("Impossibile avviare il pagamento. Riprova.")
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={unlock}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Reindirizzamento…" : `Attiva trattamento · ${priceLabel}`}
      </button>
      {error && <p className="text-xs text-clay">{error}</p>}
    </div>
  )
}
