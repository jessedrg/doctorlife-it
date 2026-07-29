import Link from "next/link"
import { CalendarCheck } from "lucide-react"
import { confirmAppointmentBySession, getMyAppointments } from "@/app/actions/booking"
import { getPatientStatus } from "@/app/actions/subscription"
import { requireRole } from "@/lib/session"
import { EmptyState } from "@/components/empty-state"

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  confirmed: { label: "Confirmada", cls: "bg-sage/15 text-sage" },
  pending_payment: { label: "Pago pendiente", cls: "bg-amber/20 text-ink" },
  cancelled: { label: "Cancelada", cls: "bg-clay/15 text-clay" },
}

function formatWhen(startsAt: Date | string) {
  const d = new Date(startsAt)
  return new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Madrid",
  }).format(d)
}

export default async function CitasPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; reprogramada?: string }>
}) {
  const me = await requireRole("patient")
  const { session_id, reprogramada } = await searchParams
  if (session_id) {
    try {
      await confirmAppointmentBySession(session_id)
    } catch {
      // se ignora; el webhook lo confirmará igualmente
    }
  }

  const [appointments, status] = await Promise.all([
    getMyAppointments(),
    getPatientStatus(me.id),
  ])

  // El botón "Reservar" solo aparece si aún no tiene suscripción activa
  // (primera cita post-quiz) o si la suscripción se ha renovado (followup).
  const canBook = status === "pending_appointment" || status === "followup_available"

  return (
    <div className="mx-auto w-full max-w-3xl">
      <header className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-balance text-2xl font-semibold text-ink">Mis citas</h1>
        {canBook && (
          <Link
            href="/portal/reservar"
            className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-opacity hover:opacity-90"
          >
            {status === "followup_available" ? "Reservar seguimiento" : "Reservar"}
          </Link>
        )}
      </header>

      {reprogramada ? (
        <div className="mb-5 rounded-2xl border border-sage/30 bg-sage/10 p-4 text-sm text-ink">
          Tu cita se ha reprogramado correctamente. Encontrarás el enlace de la videollamada aquí abajo.
        </div>
      ) : null}

      {appointments.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title="Todavía no tienes citas"
          description="Reserva tu primera consulta y aquí verás tus videollamadas, su estado y el enlace para unirte."
          action={{ href: "/portal/reservar", label: "Reservar mi primera cita" }}
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {appointments.map((a) => {
            const status = STATUS_LABEL[a.status] ?? STATUS_LABEL.pending_payment
            return (
              <li
                key={a.id}
                className="flex flex-col gap-3 rounded-2xl border border-ink/10 bg-paper p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium capitalize text-ink">{formatWhen(a.startsAt)}</p>
                  <p className="text-sm text-ink/60">
                    {a.doctorName ? `Con ${a.doctorName}` : "Médico por asignar"} ·{" "}
                    {(a.amountCents / 100).toFixed(2)}&nbsp;€
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${status.cls}`}>
                    {status.label}
                  </span>
                  {a.status === "cancelled" && a.cancelledBy === "doctor" && !a.rescheduledToId ? (
                    <Link
                      href={`/portal/reprogramar/${a.id}`}
                      className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-opacity hover:opacity-90"
                    >
                      Reprogramar
                    </Link>
                  ) : null}
                  {a.status === "confirmed" && a.meetingUrl ? (
                    <a
                      href={a.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-sage px-4 py-2 text-sm font-medium text-paper transition-opacity hover:opacity-90"
                    >
                      Unirse
                    </a>
                  ) : null}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
