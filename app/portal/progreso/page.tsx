import { requireRole } from "@/lib/session"
import { getMyProgress, getSharedNotes } from "@/app/actions/progress"
import { ProgressTracker } from "@/components/progress-tracker"

export const metadata = { title: "I miei progressi — DoctorLife" }

export default async function ProgresoPage() {
  await requireRole("patient")
  const [entries, sharedNotes] = await Promise.all([getMyProgress(), getSharedNotes()])

  return (
    <div>
      <h1 className="text-[30px] font-light leading-tight tracking-[-.02em] text-ink text-balance">
        I miei progressi
      </h1>
      <p className="mt-1.5 max-w-[60ch] text-[15.5px] leading-relaxed text-ink-soft">
        Registra il tuo peso, la tua dose e come ti senti durante il trattamento. Solo il tuo medico
        assegnato vedrà queste informazioni, in modo riservato, per adeguare il tuo piano. Qui leggerai
        le note che condividerà con te.
      </p>

      <div className="mt-7">
        <ProgressTracker initialEntries={entries} sharedNotes={sharedNotes} />
      </div>
    </div>
  )
}
