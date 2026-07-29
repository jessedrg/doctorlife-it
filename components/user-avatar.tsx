import { cn } from "@/lib/utils"

/** Iniciales a partir de un nombre (máx. 2 letras). */
function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
}

export function UserAvatar({
  name,
  image,
  size = 40,
  className,
}: {
  name: string
  image?: string | null
  size?: number
  className?: string
}) {
  const dimension = { width: size, height: size }
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image || "/placeholder.svg"}
        alt={name}
        style={dimension}
        className={cn("shrink-0 rounded-full object-cover", className)}
      />
    )
  }
  return (
    <span
      aria-hidden
      style={dimension}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-sage/40 font-medium text-ink",
        className,
      )}
    >
      <span style={{ fontSize: Math.max(11, size * 0.38) }}>{initials(name) || "?"}</span>
    </span>
  )
}
