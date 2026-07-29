import { requireRole } from "@/lib/session"
import { getMyPatients } from "@/app/actions/doctor"
import { DoctorPatientsList } from "@/components/doctor-patients-list"

export const metadata = { title: "Mis pacientes — DoctorLife" }

export default async function MedicoPatientsPage() {
  await requireRole("doctor")
  const patients = await getMyPatients()

  return (
    <div>
      <h1 className="text-[30px] font-light leading-tight tracking-[-.02em] text-ink text-balance">
        Mis pacientes
      </h1>
      <p className="mt-1.5 max-w-[60ch] text-[15.5px] leading-relaxed text-ink-soft">
        {patients.length === 0
          ? "Aún no tienes pacientes. Aparecerán aquí en cuanto tengan una cita contigo."
          : `${patients.length} ${patients.length === 1 ? "paciente" : "pacientes"} con su estado de tratamiento y próximas visitas.`}
      </p>

      {patients.length > 0 && <DoctorPatientsList patients={patients} />}
    </div>
  )
}
