import Link from "next/link"
import { CalendarClock } from "lucide-react"

/**
 * Aviso para el paciente que ha renovado su tratamiento y aún no ha agendado
 * la videollamada de seguimiento incluida en el nuevo ciclo.
 */
export function FollowupReminder() {
  return (
    <div className="flex flex-col gap-4 rounded-[20px] border border-sage/40 bg-sage/15 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sage/30 text-ink"
          aria-hidden
        >
          <CalendarClock className="size-5" />
        </span>
        <div className="min-w-0">
          <h2 className="text-[16px] font-medium text-ink text-balance">
            Has renovado tu tratamiento
          </h2>
          <p className="mt-1 text-[14px] leading-relaxed text-ink-soft text-pretty">
            Tu videollamada de seguimiento de este mes está incluida. Elige la hora que mejor te
            venga y te asignaremos a tu médico.
          </p>
        </div>
      </div>
      <Link
        href="/portal/reservar"
        className="inline-flex shrink-0 items-center justify-center rounded-full bg-ink px-4 py-2 text-[13.5px] font-medium text-paper transition-opacity hover:opacity-90"
      >
        Reservar videollamada
      </Link>
    </div>
  )
}
