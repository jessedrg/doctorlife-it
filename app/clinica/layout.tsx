import { requireRole } from "@/lib/session"
import { PortalShell } from "@/components/portal-shell"

export default async function ClinicaLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole("doctor")
  return (
    <PortalShell
      user={user}
      badge="Clinica"
      homeHref="/clinica"
      showNotifications
      nav={[
        { href: "/clinica", label: "Home", icon: "home" },
        { href: "/clinica/agenda", label: "Agenda", icon: "agenda" },
        { href: "/clinica/pacientes", label: "Pazienti", icon: "pacientes" },
        { href: "/clinica/disponibilidad", label: "Disponibilità", icon: "disponibilidad" },
        { href: "/clinica/chat", label: "Messaggi", icon: "mensajes" },
        { href: "/clinica/recetas", label: "Ricette", icon: "recetas" },
        { href: "/clinica/pagos", label: "Pagamenti", icon: "pagos" },
        { href: "/clinica/cuenta", label: "Il mio account", icon: "cuenta" },
      ]}
    >
      {children}
    </PortalShell>
  )
}
