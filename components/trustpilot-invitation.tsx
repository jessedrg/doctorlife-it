"use client"

import { useEffect, useRef } from "react"

type Props = {
  /** Email del cliente que acaba de completar el pedido. */
  email: string
  /** Nombre del cliente (opcional pero recomendado). */
  name?: string
  /** Identificador único del pedido/sesión (evita invitaciones duplicadas). */
  referenceId: string
}

declare global {
  interface Window {
    tp?: (command: string, payload: Record<string, unknown>) => void
  }
}

/**
 * Dispara una invitación de reseña de servicio de Trustpilot cuando el cliente
 * llega a la página de confirmación tras pagar. Usa el script global `tp`
 * (register) ya cargado en app/layout.tsx. Solo se dispara una vez por montaje.
 *
 * Ref: JavaScript Integration de Trustpilot → createInvitation (service review).
 */
export function TrustpilotInvitation({ email, name, referenceId }: Props) {
  const sent = useRef(false)

  useEffect(() => {
    if (sent.current) return
    if (!email || !referenceId) return
    sent.current = true

    const send = () => {
      if (typeof window.tp !== "function") return
      window.tp("createInvitation", {
        recipientEmail: email,
        recipientName: name || "Paciente",
        referenceId,
        source: "InvitationScript",
      })
    }

    // El stub `tp` encola llamadas aunque el script aún no haya terminado de
    // cargar, así que podemos llamar directamente.
    send()
  }, [email, name, referenceId])

  return null
}
