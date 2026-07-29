import Link from "next/link"
import { CalendarClock, Clock } from "lucide-react"
import { getPooledAvailability } from "@/app/actions/booking"
import { getMySubscription, getPatientStatus } from "@/app/actions/subscription"
import { requireRole } from "@/lib/session"
import { BookingCalendar } from "@/components/booking-calendar"

export default async function ReservarPage() {
  const me = await requireRole("patient")
  const [slots, subscription, status] = await Promise.all([
    getPooledAvailability(14),
    getMySubscription(),
    getPatientStatus(me.id),
  ])

  // Esta página SOLO es para seguimientos post-renovación.
  // La primera cita siempre llega desde el flujo del quiz público (25€).
  const isFollowup = status === "followup_available"

  if (!isFollowup) {
    const title =
      status === "active"
        ? "El calendario se activa con la renovación"
        : status === "pending_appointment"
          ? "Tu médico te enviará tu primera cita"
          : status === "pending_prescription"
            ? "Esperando la valoración de tu médico"
            : "Activa tu suscripción primero"

    const body =
      status === "active"
        ? "Ya tienes tu primera consulta hecha. Cuando se renueve tu suscripción mensual podrás reservar aquí tu próxima videollamada de seguimiento."
        : status === "pending_appointment"
          ? "Tu médico está revisando tu caso y pronto te enviará la fecha de la primera consulta. No tienes que hacer nada más."
          : status === "pending_prescription"
            ? "Tu médico está preparando el tratamiento personalizado para ti. En cuanto lo tenga listo recibirás un aviso."
            : "Para acceder a las videollamadas de seguimiento activa tu plan de tratamiento desde Recetas."

    return (
      <div className="mx-auto w-full max-w-xl">
        <div className="rounded-[20px] border border-ink/10 bg-cream p-8 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-ink/5">
            <Clock className="size-5 text-ink-soft" aria-hidden />
          </div>
          <h1 className="text-balance text-xl font-semibold text-ink">{title}</h1>
          <p className="mx-auto mt-3 max-w-[44ch] text-pretty text-[14px] leading-relaxed text-ink-soft">
            {body}
          </p>
          {status === "active" && subscription?.currentPeriodEnd && (
            <p className="mt-2 text-[13px] text-ink-soft">
              Próxima renovación:{" "}
              {new Intl.DateTimeFormat("es-ES", { dateStyle: "long" }).format(
                new Date(subscription.currentPeriodEnd),
              )}
            </p>
          )}
          <Link
            href="/portal"
            className="mt-6 inline-flex rounded-full bg-ink px-5 py-2.5 text-[13.5px] font-medium text-paper transition-opacity hover:opacity-90"
          >
            Volver al panel
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <header className="mb-6">
        <h1 className="text-balance text-2xl font-semibold text-ink">
          {isFollowup ? "Reserva tu videollamada de seguimiento" : "Reserva tu primera cita"}
        </h1>
        <p className="mt-1 text-pretty text-ink/70">
          {isFollowup
            ? "Está incluida en tu suscripción. Elige el horario que mejor te venga."
            : "Elige el horario que mejor te venga. Te asignaremos un médico disponible y recibirás el enlace de la videollamada."}
        </p>
      </header>
      <BookingCalendar slots={slots} />
    </div>
  )
}
