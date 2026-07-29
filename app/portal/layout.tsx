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
    { href: "/portal", label: "Inicio", icon: "home" },
    ...(showReservar ? [{ href: "/portal/reservar", label: "Reservar seguimiento", icon: "reservar" as NavIcon }] : []),
    { href: "/portal/citas", label: "Mis citas", icon: "citas" },
    { href: "/portal/progreso", label: "Mi progreso", icon: "progreso" },
    { href: "/portal/chat", label: "Chat", icon: "mensajes" },
    { href: "/portal/recetas", label: "Recetas", icon: "recetas" },
    { href: "/portal/cuenta", label: "Mi cuenta", icon: "cuenta" },
  ]
  if (verificationPending) {
    nav.splice(1, 0, { href: "/portal/verificacion", label: "Verificación", icon: "verificacion" })
  }

  return (
    <PortalShell
      user={user}
      badge="Paciente"
      homeHref="/portal"
      nav={nav}
    >
      {children}
    </PortalShell>
  )
}
