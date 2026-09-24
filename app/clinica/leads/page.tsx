import { requireRole } from "@/lib/session"
import { getMyDoctorLeads } from "@/app/actions/doctor"
import { DoctorLeadsList } from "@/components/doctor-leads-list"

export const metadata = { title: "Lead — DoctorLife" }

export default async function DoctorLeadsPage() {
  await requireRole("doctor")
  const leads = await getMyDoctorLeads()

  return (
    <main>
      <h1 className="text-[30px] font-light leading-tight tracking-[-.02em] text-ink text-balance">
        Lead e prenotazioni
      </h1>
      <p className="mt-1.5 max-w-[60ch] text-[15.5px] leading-relaxed text-ink-soft">
        I contatti che hanno prenotato una visita con te, con data della prenotazione e recapiti.
      </p>
      <DoctorLeadsList leads={leads} />
    </main>
  )
}
