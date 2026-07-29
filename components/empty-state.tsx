import Link from "next/link"
import type { LucideIcon } from "lucide-react"

/**
 * Estado vacío reutilizable: icono en círculo, título, descripción y CTA opcional.
 * Pensado para colocarse dentro del área de contenido cuando no hay datos.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}: {
  icon: LucideIcon
  title: string
  description?: string
  action?: { href: string; label: string }
  className?: string
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-[24px] border border-dashed border-ink/15 bg-cream px-6 py-14 text-center ${className}`}
    >
      <span className="flex size-14 items-center justify-center rounded-full bg-sage/30 text-olive">
        <Icon className="size-7" aria-hidden />
      </span>
      <h3 className="mt-5 text-[17px] font-medium text-ink text-balance">{title}</h3>
      {description ? (
        <p className="mt-1.5 max-w-[42ch] text-[14px] leading-relaxed text-ink-soft text-pretty">
          {description}
        </p>
      ) : null}
      {action ? (
        <Link
          href={action.href}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-ink px-5 py-2.5 text-[14px] font-medium text-paper transition-opacity hover:opacity-90"
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  )
}
