import { getMyPatientsForPrescribing, getMyPrescriptions } from "@/app/actions/prescriptions"
import { PrescriptionForm } from "@/components/prescription-form"
import { PrescriptionList } from "@/components/prescription-list"

export default async function MedicoRecetasPage() {
  const [patients, prescriptions] = await Promise.all([
    getMyPatientsForPrescribing(),
    getMyPrescriptions(),
  ])

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-2xl font-semibold text-ink">Ricette</h1>
        <p className="mt-1 text-sm text-muted">
          Compila i dati della ricetta e carica il PDF ufficiale. Il paziente lo riceverà nel suo
          portale non appena attiverà il trattamento.
        </p>
      </header>

      <section className="rounded-2xl border border-line bg-cream p-6">
        <h2 className="mb-4 text-lg font-medium text-ink">Nuova ricetta</h2>
        <PrescriptionForm patients={patients} />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-medium text-ink">Ricette emesse</h2>
        <PrescriptionList prescriptions={prescriptions} showPatient />
      </section>
    </div>
  )
}
