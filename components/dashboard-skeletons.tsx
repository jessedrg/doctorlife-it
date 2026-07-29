import { Skeleton } from "@/components/ui/skeleton"

type Variant = "list" | "cards" | "table" | "chat"

/**
 * Skeleton de página de dashboard. Replica la cabecera estándar
 * (título grande + subtítulo) y un cuerpo según el tipo de página.
 * Se renderiza dentro del layout, así que la barra/sidebar permanece fija
 * y solo el área de contenido muestra el estado de carga.
 */
export function DashboardPageSkeleton({ variant = "list" }: { variant?: Variant }) {
  return (
    <div role="status" aria-label="Cargando…" className="animate-in fade-in duration-300">
      {/* Cabecera */}
      <Skeleton className="h-9 w-[min(60%,280px)] rounded-[10px]" />
      <Skeleton className="mt-3 h-4 w-[min(80%,460px)] rounded-full" />

      <div className="mt-8">
        {variant === "cards" && <CardsBody />}
        {variant === "list" && <ListBody />}
        {variant === "table" && <TableBody />}
        {variant === "chat" && <ChatBody />}
      </div>

      <span className="sr-only">Cargando contenido…</span>
    </div>
  )
}

function CardsBody() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-[16px] border border-ink/10 bg-warm/40 p-5">
          <div className="flex items-center gap-3">
            <Skeleton className="size-11 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-2/3 rounded-full" />
              <Skeleton className="mt-2 h-3 w-1/3 rounded-full" />
            </div>
          </div>
          <Skeleton className="mt-5 h-3 w-full rounded-full" />
          <Skeleton className="mt-2.5 h-3 w-4/5 rounded-full" />
          <Skeleton className="mt-5 h-9 w-28 rounded-full" />
        </div>
      ))}
    </div>
  )
}

function ListBody() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-[16px] border border-ink/10 bg-warm/40 p-4"
        >
          <Skeleton className="size-12 rounded-full" />
          <div className="min-w-0 flex-1">
            <Skeleton className="h-4 w-1/2 rounded-full" />
            <Skeleton className="mt-2 h-3 w-3/4 rounded-full" />
          </div>
          <Skeleton className="hidden h-8 w-24 rounded-full sm:block" />
        </div>
      ))}
    </div>
  )
}

function TableBody() {
  return (
    <div className="overflow-hidden rounded-[16px] border border-ink/10">
      <div className="flex items-center gap-4 border-b border-ink/10 bg-warm/50 px-4 py-3">
        <Skeleton className="h-3 w-1/4 rounded-full" />
        <Skeleton className="hidden h-3 w-1/5 rounded-full sm:block" />
        <Skeleton className="ml-auto h-3 w-16 rounded-full" />
      </div>
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 border-b border-ink/8 px-4 py-3.5 last:border-0">
          <Skeleton className="size-9 rounded-full" />
          <div className="min-w-0 flex-1">
            <Skeleton className="h-3.5 w-2/5 rounded-full" />
            <Skeleton className="mt-2 h-3 w-1/4 rounded-full sm:hidden" />
          </div>
          <Skeleton className="hidden h-3.5 w-1/5 rounded-full sm:block" />
          <Skeleton className="ml-auto h-7 w-16 rounded-full" />
        </div>
      ))}
    </div>
  )
}

function ChatBody() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[300px_1fr]">
      {/* Lista de conversaciones */}
      <div className="flex flex-col gap-2.5">
        <Skeleton className="h-10 w-full rounded-full" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-2xl p-3">
            <Skeleton className="size-11 rounded-full" />
            <div className="min-w-0 flex-1">
              <Skeleton className="h-3.5 w-1/2 rounded-full" />
              <Skeleton className="mt-2 h-3 w-3/4 rounded-full" />
            </div>
          </div>
        ))}
      </div>
      {/* Hilo */}
      <div className="hidden flex-col gap-4 rounded-[16px] border border-ink/10 p-5 md:flex">
        <div className="flex items-center gap-3 border-b border-ink/10 pb-4">
          <Skeleton className="size-10 rounded-full" />
          <Skeleton className="h-4 w-40 rounded-full" />
        </div>
        <Skeleton className="h-12 w-2/3 self-start rounded-2xl" />
        <Skeleton className="h-12 w-1/2 self-end rounded-2xl" />
        <Skeleton className="h-16 w-3/5 self-start rounded-2xl" />
        <Skeleton className="mt-auto h-11 w-full rounded-full" />
      </div>
    </div>
  )
}
