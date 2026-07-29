import { requireRole } from "@/lib/session"
import { PortalShell } from "@/components/portal-shell"

export default async function ClinicaLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole("doctor")
  return (
    <PortalShell
      user={user}
      badge="Clínica"
      homeHref="/clinica"
      showNotifications
      nav={[
        { href: "/clinica", label: "Inicio", icon: "home" },
        { href: "/clinica/agenda", label: "Agenda", icon: "agenda" },
        { href: "/clinica/pacientes", label: "Pacientes", icon: "pacientes" },
        { href: "/clinica/disponibilidad", label: "Disponibilidad", icon: "disponibilidad" },
        { href: "/clinica/chat", label: "Mensajes", icon: "mensajes" },
        { href: "/clinica/recetas", label: "Recetas", icon: "recetas" },
        { href: "/clinica/pagos", label: "Cobros", icon: "pagos" },
        { href: "/clinica/cuenta", label: "Mi cuenta", icon: "cuenta" },
      ]}
    >
      {children}
    </PortalShell>
  )
}
