import { getMyVerifications } from "@/app/actions/verification"
import { PatientVerification } from "@/components/patient-verification"

export const metadata = { title: "Verificación — DoctorLife" }

export default async function VerificacionPage() {
  const verifications = await getMyVerifications()

  return (
    <div>
      <h1 className="text-[30px] font-light leading-tight tracking-[-.02em] text-ink text-balance">
        Verificación
      </h1>
      <p className="mt-1.5 max-w-[60ch] text-[15.5px] leading-relaxed text-ink-soft">
        Por tu seguridad, tu médico puede pedirte una prueba adicional antes de activar el
        tratamiento. Así nos aseguramos de que la indicación es correcta y segura para ti.
      </p>

      <div className="mt-7">
        <PatientVerification verifications={verifications} />
      </div>
    </div>
  )
}
