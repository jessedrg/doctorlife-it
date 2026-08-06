import Link from "next/link"
import { requireRole } from "@/lib/session"
import { getOrCreatePatientConversation, getConversationCounterpart } from "@/app/actions/chat"
import { hasActiveSubscription } from "@/app/actions/subscription"
import { ChatThread } from "@/components/chat-thread"
import { UnlockPrescriptionsButton } from "@/components/unlock-prescriptions-button"
import { MAIN_PLAN } from "@/lib/plans"

export const metadata = { title: "Chat — DoctorLife" }


export default async function PatientChatPage() {
  const me = await requireRole("patient")
  const conversationId = await getOrCreatePatientConversation()
  const subscribed = await hasActiveSubscription(me.id)
  const doctor = conversationId ? await getConversationCounterpart(conversationId) : null

  return (
    <div>
      <h1 className="text-[26px] font-light tracking-[-.02em] text-ink">Chat con il tuo medico</h1>
      <p className="mt-1.5 max-w-[60ch] text-[15px] leading-relaxed text-ink-soft">
        Chiedi al tuo team medico in modo sicuro tra un appuntamento e l'altro.
      </p>

      <div className="mt-6 max-w-2xl">
        {!conversationId ? (
          <div className="rounded-[20px] border border-ink/10 bg-cream p-6">
            <p className="text-[15px] text-ink">Non hai ancora un medico assegnato.</p>
            <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">
              Prenota il tuo primo appuntamento per iniziare a parlare con il tuo team medico.
            </p>
            <Link
              href="/portal/reservar"
              className="mt-4 inline-flex rounded-full bg-ink px-4 py-2 text-[13.5px] font-medium text-paper transition-opacity hover:opacity-90"
            >
              Prenota il primo appuntamento
            </Link>
          </div>
        ) : subscribed ? (
          <ChatThread
            conversationId={conversationId}
            counterpartName={doctor?.name ?? "Il tuo team medico"}
            counterpartImage={doctor?.image}
          />
        ) : (
          <div className="rounded-[20px] border border-amber/40 bg-amber/10 p-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber/25 px-3 py-1 text-[12px] font-medium text-ink">
              Incluso nel tuo trattamento
            </span>
            <p className="mt-3 text-[15px] font-medium text-ink">
              La chat dal vivo con il tuo medico fa parte del tuo abbonamento.
            </p>
            <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">
              Attiva il tuo trattamento per scrivere al tuo medico ogni volta che ti serve, tra un
              appuntamento e l'altro e senza attese, per {MAIN_PLAN.totalLabel}. Nessun vincolo:
              disdici quando vuoi.
            </p>
            <div className="mt-4">
              <UnlockPrescriptionsButton priceLabel={MAIN_PLAN.totalLabel} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
