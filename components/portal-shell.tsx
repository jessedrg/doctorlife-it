"use client"

import { useEffect, useState } from "react"
import Link, { useLinkStatus } from "next/link"
import { usePathname } from "next/navigation"
import { NotificationsBell } from "@/components/notifications-bell"
import {
  Home,
  CalendarDays,
  CalendarPlus,
  CalendarCheck,
  Users,
  Clock,
  MessageCircle,
  FileText,
  CreditCard,
  UserCog,
  Stethoscope,
  Inbox,
  LineChart,
  ShieldCheck,
  Building2,
  Menu,
  X,
  Loader2,
} from "lucide-react"
import { BrandLogo, BrandMark } from "./brand-logo"
import { SignOutButton } from "./sign-out-button"

export type NavIcon =
  | "home"
  | "agenda"
  | "reservar"
  | "citas"
  | "pacientes"
  | "disponibilidad"
  | "mensajes"
  | "recetas"
  | "pagos"
  | "cuenta"
  | "medicos"
  | "suscripciones"
  | "leads"
  | "progreso"
  | "verificacion"
  | "clinica"

type NavItem = { href: string; label: string; icon: NavIcon }

const ICONS: Record<NavIcon, typeof Home> = {
  home: Home,
  agenda: CalendarDays,
  reservar: CalendarPlus,
  citas: CalendarCheck,
  pacientes: Users,
  disponibilidad: Clock,
  mensajes: MessageCircle,
  recetas: FileText,
  pagos: CreditCard,
  cuenta: UserCog,
  medicos: Stethoscope,
  suscripciones: CreditCard,
  leads: Inbox,
  progreso: LineChart,
  verificacion: ShieldCheck,
  clinica: Building2,
}

export function PortalShell({
  user,
  nav,
  badge,
  homeHref,
  showNotifications = false,
  children,
}: {
  user: { name: string; email: string }
  nav: NavItem[]
  badge: string
  /** Destino del logo: el panel del usuario, NO la landing. */
  homeHref: string
  /** Muestra la campana de notificaciones (panel del médico). */
  showNotifications?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Bloquea el scroll del fondo mientras el menú móvil está abierto.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  // Cierra el menú automáticamente al cambiar de ruta.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const isActive = (href: string) =>
    pathname === href || (href !== homeHref && pathname.startsWith(href + "/"))

  const navLinks = (onNavigate?: () => void) => (
    <nav className="flex flex-col gap-1">
      {nav.map((item) => {
        const Icon = ICONS[item.icon]
        const active = isActive(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-[12px] px-3.5 py-2.5 text-[14px] font-medium transition-colors active:scale-[.99] ${
              active
                ? "bg-sage/35 text-ink"
                : "text-ink-soft hover:bg-warm hover:text-ink"
            }`}
          >
            <Icon className="size-[18px] shrink-0" aria-hidden />
            <span className="truncate">{item.label}</span>
            <NavPending active={active} />
          </Link>
        )
      })}
    </nav>
  )

  return (
    <div className="min-h-svh bg-paper md:flex">
      {/* Sidebar — escritorio */}
      <aside className="sticky top-0 hidden h-svh w-[260px] shrink-0 flex-col border-r border-ink/10 bg-paper/95 px-4 py-5 md:flex">
        <Link href={homeHref} className="flex items-center gap-2.5 px-2">
          <BrandLogo markSize={24} textSize={17} />
        </Link>
        <div className="mt-3 ml-2 flex items-center justify-between gap-2 pr-1">
          <span className="w-fit rounded-full bg-sage/30 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[.08em] text-ink">
            {badge}
          </span>
          {showNotifications && <NotificationsBell />}
        </div>

        <div className="mt-6 flex-1 overflow-y-auto">{navLinks()}</div>

        <div className="mt-4 border-t border-ink/10 pt-4">
          <p className="px-2 text-[12.5px] leading-tight text-ink-soft">
            {user.name}
            <br />
            <span className="text-ink-mute">{user.email}</span>
          </p>
          <div className="mt-3 px-2">
            <SignOutButton className="w-full cursor-pointer rounded-full border border-ink/15 px-4 py-2 text-center text-[13.5px] font-medium text-ink-soft transition-colors hover:bg-warm" />
          </div>
        </div>
      </aside>

      {/* Barra superior — móvil */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-ink/10 bg-paper/90 px-4 py-3 backdrop-blur md:hidden">
        <Link href={homeHref} className="flex items-center gap-2">
          <BrandLogo markSize={22} textSize={16} />
        </Link>
        <div className="flex items-center gap-1">
          {showNotifications && <NotificationsBell />}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
            className="flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-warm"
          >
            <Menu className="size-5" aria-hidden />
          </button>
        </div>
      </header>

      {/* Drawer — móvil (siempre montado para animar la entrada/salida) */}
      <div
        className={`fixed inset-0 z-40 md:hidden ${open ? "" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        {/* Fondo */}
        <button
          type="button"
          aria-label="Cerrar menú"
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${
            open ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        />
        {/* Panel */}
        <div
          className={`absolute left-0 top-0 flex h-full w-[280px] max-w-[82%] flex-col bg-paper px-4 py-5 shadow-xl will-change-transform transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
              <Link href={homeHref} onClick={() => setOpen(false)} className="flex items-center gap-2">
                <BrandMark size={24} />
                <span className="rounded-full bg-sage/30 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[.08em] text-ink">
                  {badge}
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar menú"
                className="flex size-9 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-warm"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>

            <div className="mt-6 flex-1 overflow-y-auto">{navLinks(() => setOpen(false))}</div>

            <div className="mt-4 border-t border-ink/10 pt-4">
              <p className="px-2 text-[12.5px] leading-tight text-ink-soft">
                {user.name}
                <br />
                <span className="text-ink-mute">{user.email}</span>
              </p>
              <div className="mt-3 px-2">
                <SignOutButton className="w-full cursor-pointer rounded-full border border-ink/15 px-4 py-2 text-center text-[13.5px] font-medium text-ink-soft transition-colors hover:bg-warm" />
              </div>
            </div>
          </div>
        </div>

      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-[1100px] px-5 py-7 sm:px-8 sm:py-10">{children}</div>
      </main>
    </div>
  )
}

/**
 * Indicador de carga que aparece en el enlace pulsado mientras Next.js
 * carga la ruta destino. Debe renderizarse dentro de un <Link>.
 */
function NavPending({ active }: { active: boolean }) {
  const { pending } = useLinkStatus()
  if (!pending || active) return null
  return <Loader2 className="ml-auto size-4 shrink-0 animate-spin text-ink-mute" aria-hidden />
}
