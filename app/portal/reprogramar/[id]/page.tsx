import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { getRescheduleOptions } from "@/app/actions/booking"
import { RescheduleCalendar } from "@/components/reschedule-calendar"

export const metadata = { title: "Reprogramar cita — DoctorLife" }

export default async function ReprogramarPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const appointmentId = Number(id)
  if (!Number.isInteger(appointmentId)) notFound()

  const result = await getRescheduleOptions(appointmentId)
  if ("error" in result) {
    // Si la cita ya no es reprogramable, volvemos a la lista de citas.
    redirect("/portal/citas")
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <Link
        href="/portal/citas"
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-ink/60 transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Volver a mis citas
      </Link>

      <header className="mb-6">
        <h1 className="text-balance text-2xl font-semibold text-ink">Elige una nueva hora</h1>
        <p className="mt-1.5 text-pretty text-ink/60">
          Tu médico canceló esta cita. Selecciona el horario que mejor te venga y la
          confirmamos al instante, sin coste adicional.
        </p>
      </header>

      <RescheduleCalendar
        appointmentId={result.appointmentId}
        kind={result.kind}
        doctorName={result.doctorName}
        slots={result.slots}
      />
    </div>
  )
}
