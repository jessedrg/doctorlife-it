import { requireRole } from "@/lib/session"
import { PortalShell } from "@/components/portal-shell"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole("admin")
  return (
    <PortalShell
      user={user}
      badge="Admin"
      homeHref="/admin"
      nav={[
        { href: "/admin", label: "Inicio", icon: "home" },
        { href: "/admin/clinicas", label: "Clínicas", icon: "medicos" },
        { href: "/admin/pacientes", label: "Pacientes", icon: "pacientes" },
        { href: "/admin/suscripciones", label: "Suscripciones", icon: "suscripciones" },
        { href: "/admin/leads", label: "Leads", icon: "leads" },
      ]}
    >
      {children}
    </PortalShell>
  )
}
