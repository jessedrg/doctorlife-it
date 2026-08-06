import { requireRole } from "@/lib/session"
import { PortalShell, type NavIcon } from "@/components/portal-shell"
import { hasPendingVerification } from "@/app/actions/verification"
import { getPatientStatus } from "@/app/actions/subscription"

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole("patient")
  const [verificationPending, patientStatus] = await Promise.all([
    hasPendingVerification(user.id),
    getPatientStatus(user.id),
  ])

  // "Reservar cita" solo aparece en el sidebar cuando hay una renovación pendiente.
  // Para la primera cita, el paciente llega desde el quiz (flujo público).
  const showReservar = patientStatus === "followup_available"

  const nav: { href: string; label: string; icon: NavIcon }[] = [
    { href: "/portal", label: "Home", icon: "home" },
    ...(showReservar ? [{ href: "/portal/reservar", label: "Prenota follow-up", icon: "reservar" as NavIcon }] : []),
    { href: "/portal/citas", label: "I miei appuntamenti", icon: "citas" },
    { href: "/portal/progreso", label: "I miei progressi", icon: "progreso" },
    { href: "/portal/chat", label: "Chat", icon: "mensajes" },
    { href: "/portal/recetas", label: "Ricette", icon: "recetas" },
    { href: "/portal/cuenta", label: "Il mio account", icon: "cuenta" },
  ]
  if (verificationPending) {
    nav.splice(1, 0, { href: "/portal/verificacion", label: "Verifica", icon: "verificacion" })
  }

  return (
    <PortalShell
      user={user}
      badge="Paziente"
      homeHref="/portal"
      nav={nav}
    >
      {children}
    </PortalShell>
  )
}
