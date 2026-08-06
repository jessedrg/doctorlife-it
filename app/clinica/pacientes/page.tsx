import { requireRole } from "@/lib/session"
import { getMyPatients } from "@/app/actions/doctor"
import { DoctorPatientsList } from "@/components/doctor-patients-list"

export const metadata = { title: "I miei pazienti — DoctorLife" }

export default async function MedicoPatientsPage() {
  await requireRole("doctor")
  const patients = await getMyPatients()

  return (
    <div>
      <h1 className="text-[30px] font-light leading-tight tracking-[-.02em] text-ink text-balance">
        I miei pazienti
      </h1>
      <p className="mt-1.5 max-w-[60ch] text-[15.5px] leading-relaxed text-ink-soft">
        {patients.length === 0
          ? "Non hai ancora pazienti. Appariranno qui non appena avranno un appuntamento con te."
          : `${patients.length} ${patients.length === 1 ? "paziente" : "pazienti"} con il relativo stato di trattamento e le prossime visite.`}
      </p>

      {patients.length > 0 && <DoctorPatientsList patients={patients} />}
    </div>
  )
}
