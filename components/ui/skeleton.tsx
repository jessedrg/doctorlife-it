import { cn } from "@/lib/utils"

/**
 * Bloque base de carga. Usa un pulso suave sobre un tono neutro del tema.
 * Sirve como pieza para componer skeletons de página.
 */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cn("animate-pulse rounded-[8px] bg-ink/[.07]", className)}
      {...props}
    />
  )
}
