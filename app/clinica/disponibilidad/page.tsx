import { getMyAvailability } from "@/app/actions/availability"
import { AvailabilityEditor } from "@/components/availability-editor"

export default async function DisponibilidadPage() {
  const { rules, exceptions, slotMinutes, timezone } = await getMyAvailability()

  return (
    <div className="mx-auto w-full max-w-3xl">
      <header className="mb-8">
        <h1 className="text-2xl font-medium text-ink text-pretty">Disponibilità</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Definisci il tuo orario settimanale. Da qui vengono generati gli slot che i tuoi pazienti
          vedranno al momento di prenotare il primo appuntamento.
        </p>
      </header>

      <AvailabilityEditor
        initialRules={rules}
        initialExceptions={exceptions}
        initialSlotMinutes={slotMinutes}
        initialTimezone={timezone}
      />
    </div>
  )
}
