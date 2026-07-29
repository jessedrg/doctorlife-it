import { requireRole } from "@/lib/session"
import { getDoctorAppointments } from "@/app/actions/booking"
import { AppointmentsCalendar } from "@/components/appointments-calendar"

export const metadata = { title: "Agenda — DoctorLife" }

export default async function MedicoAgendaPage() {
  await requireRole("doctor")
  const appointments = await getDoctorAppointments()

  const now = Date.now()
  const upcoming = appointments.filter(
    (a) => new Date(a.startsAt).getTime() >= now && a.status !== "cancelled",
  ).length

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[28px] font-light leading-tight tracking-[-.02em] text-ink">Agenda</h1>
          <p className="mt-1.5 max-w-[60ch] text-[15.5px] leading-relaxed text-ink-soft">
            Todas tus consultas en una vista de calendario. Cambia entre mes, semana y día.
          </p>
        </div>
        <span className="rounded-full bg-olive/12 px-3.5 py-1.5 text-[13px] font-medium text-olive">
          {upcoming} {upcoming === 1 ? "cita próxima" : "citas próximas"}
        </span>
      </div>

      <div className="mt-7">
        <AppointmentsCalendar
          appointments={appointments.map((a) => ({
            ...a,
            startsAt: a.startsAt.toISOString(),
            endsAt: a.endsAt.toISOString(),
          }))}
        />
      </div>
    </div>
  )
}
