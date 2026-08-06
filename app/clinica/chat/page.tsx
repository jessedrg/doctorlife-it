import { requireRole } from "@/lib/session"
import { getMyConversations } from "@/app/actions/chat"
import { ChatWorkspace } from "@/components/chat-workspace"

export const metadata = { title: "Chat — DoctorLife" }

export default async function DoctorChatPage() {
  await requireRole("doctor")
  const conversations = await getMyConversations()

  return (
    <div>
      <h1 className="text-[26px] font-light tracking-[-.02em] text-ink">Messaggi</h1>
      <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">
        Conversazioni con i tuoi pazienti.
      </p>

      {conversations.length === 0 ? (
        <div className="mt-6 rounded-[20px] border border-ink/10 bg-cream p-6">
          <p className="text-[15px] text-ink">Non hai ancora conversazioni.</p>
          <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">
            Quando un paziente con un appuntamento ti scriverà, la sua conversazione apparirà qui.
          </p>
        </div>
      ) : (
        <ChatWorkspace conversations={conversations} canRequestAnalysis isDoctor />
      )}
    </div>
  )
}
