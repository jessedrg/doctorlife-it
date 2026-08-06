import { getMyVerifications } from "@/app/actions/verification"
import { PatientVerification } from "@/components/patient-verification"

export const metadata = { title: "Verifica — DoctorLife" }

export default async function VerificacionPage() {
  const verifications = await getMyVerifications()

  return (
    <div>
      <h1 className="text-[30px] font-light leading-tight tracking-[-.02em] text-ink text-balance">
        Verifica
      </h1>
      <p className="mt-1.5 max-w-[60ch] text-[15.5px] leading-relaxed text-ink-soft">
        Per la tua sicurezza, il tuo medico può chiederti un controllo aggiuntivo prima di attivare
        il trattamento. Così ci assicuriamo che l'indicazione sia corretta e sicura per te.
      </p>

      <div className="mt-7">
        <PatientVerification verifications={verifications} />
      </div>
    </div>
  )
}
