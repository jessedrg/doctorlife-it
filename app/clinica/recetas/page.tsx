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
        <h1 className="text-2xl font-semibold text-ink">Recetas</h1>
        <p className="mt-1 text-sm text-muted">
          Rellena los datos de la receta y sube el PDF oficial. El paciente lo recibirá en su portal
          en cuanto active el tratamiento.
        </p>
      </header>

      <section className="rounded-2xl border border-line bg-cream p-6">
        <h2 className="mb-4 text-lg font-medium text-ink">Nueva receta</h2>
        <PrescriptionForm patients={patients} />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-medium text-ink">Recetas emitidas</h2>
        <PrescriptionList prescriptions={prescriptions} showPatient />
      </section>
    </div>
  )
}
