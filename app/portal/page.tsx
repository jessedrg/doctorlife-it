import Link from "next/link"
import { requireRole } from "@/lib/session"
import { getNextAppointment } from "@/app/actions/booking"
import { getMyPlan } from "@/app/actions/patient"
import { getMySubscription, getPatientStatus, syncSubscriptionBySession } from "@/app/actions/subscription"
import { hasPendingVerification } from "@/app/actions/verification"
import { getMyPlanOffer } from "@/app/actions/clinic-plans"
import { AppointmentSummary } from "@/components/appointment-summary"
import { SubscriptionCard } from "@/components/subscription-card"
import { FollowupReminder } from "@/components/followup-reminder"
import { Clock, FileText, CheckCircle2, CalendarClock, CalendarCheck } from "lucide-react"

export const metadata = { title: "Il mio portale — DoctorLife" }

export default async function PortalHome({
  searchParams,
}: {
  searchParams: Promise<{ subscription?: string; session_id?: string }>
}) {
  const user = await requireRole("patient")
  const firstName = user.name.split(" ")[0]

  const sp = await searchParams
  if (sp.subscription === "ok" && sp.session_id) {
    await syncSubscriptionBySession(sp.session_id)
  }

  const [next, plan, subscription, verificationPending, status, offer] = await Promise.all([
    getNextAppointment(),
    getMyPlan(),
    getMySubscription(),
    hasPendingVerification(user.id),
    getPatientStatus(user.id),
    getMyPlanOffer(),
  ])

  const subActive = status === "active" || status === "followup_available"
  const followupPending = status === "followup_available"

  return (
    <div>
      <h1 className="text-[30px] font-light leading-tight tracking-[-.02em] text-ink text-balance">
        Ciao, {firstName}
      </h1>
      <p className="mt-1.5 max-w-[60ch] text-[15.5px] leading-relaxed text-ink-soft">
        Questo è il tuo portale paziente. Qui trovi il tuo prossimo appuntamento, il tuo piano di
        trattamento e puoi parlare con il tuo team medico.
      </p>

      {followupPending ? (
        <div className="mt-7">
          <FollowupReminder />
        </div>
      ) : null}

      {/* ── Barra de estado del flujo ── */}
      <TreatmentStatusBar status={status} />

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {next ? (
          <div className="lg:col-span-2">
            <AppointmentSummary appt={next} />
          </div>
        ) : (
          <div className="lg:col-span-2 rounded-[20px] border border-ink/10 bg-cream p-5">
            <h2 className="text-[16px] font-medium text-ink">Il tuo prossimo appuntamento</h2>
            {status === "pending_appointment" ? (
              <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">
                Il tuo medico sta valutando la tua richiesta e ti assegnerà un appuntamento a breve.
                Riceverai una notifica via email quando sarà pronto.
              </p>
            ) : status === "followup_available" ? (
              <>
                <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">
                  Il tuo abbonamento è stato rinnovato. Prenota la tua prossima videochiamata di follow-up.
                </p>
                <Link
                  href="/portal/reservar"
                  className="mt-4 inline-flex rounded-full bg-ink px-4 py-2 text-[13.5px] font-medium text-paper transition-opacity hover:opacity-90"
                >
                  Prenota follow-up
                </Link>
              </>
            ) : (
              <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">
                Una volta rinnovato il tuo abbonamento potrai prenotare qui la tua prossima videochiamata.
              </p>
            )}
          </div>
        )}

        <PlanCard plan={plan} />
      </div>

      <div className="mt-4">
        <SubscriptionCard
          subscription={subscription}
          patientStatus={status}
          verificationPending={verificationPending}
          offer={offer}
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <QuickLink
          href="/portal/progreso"
          title="I miei progressi"
          body="Registra il tuo peso e la dose, e monitora la tua evoluzione."
        />
        <QuickLink
          href="/portal/chat"
          title="Chat medica"
          body="Parla con il tuo team medico in modo sicuro tra un appuntamento e l'altro."
        />
        <QuickLink
          href="/portal/recetas"
          title="Ricette"
          body="Consulta e scarica le ricette emesse dal tuo medico."
        />
      </div>
    </div>
  )
}

const STATUS_STEPS = [
  {
    key: "pending_appointment",
    icon: Clock,
    label: "Richiesta ricevuta",
    description: "Il tuo medico sta valutando il tuo caso.",
  },
  {
    key: "pending_prescription",
    icon: CalendarCheck,
    label: "Primo appuntamento",
    description: "Appuntamento confermato con il tuo medico.",
  },
  {
    key: "can_activate",
    icon: FileText,
    label: "Piano pronto",
    description: "La tua ricetta è pronta.",
  },
  {
    key: "active",
    icon: CheckCircle2,
    label: "Trattamento attivo",
    description: "Abbonamento mensile attivo.",
  },
  {
    key: "followup_available",
    icon: CalendarClock,
    label: "Follow-up",
    description: "Videochiamata di follow-up disponibile.",
  },
] as const

const STATUS_ORDER = [
  "pending_appointment",
  "pending_prescription",
  "can_activate",
  "active",
  "followup_available",
] as const

function TreatmentStatusBar({ status }: { status: string }) {
  const currentIdx = STATUS_ORDER.indexOf(status as typeof STATUS_ORDER[number])

  return (
    <div className="mt-7 rounded-[20px] border border-ink/10 bg-cream p-5">
      <h2 className="mb-4 text-[15px] font-medium text-ink">I tuoi progressi nel trattamento</h2>
      <div className="flex items-start gap-0">
        {STATUS_STEPS.map((step, i) => {
          const done = i < currentIdx
          const current = i === currentIdx
          const Icon = step.icon
          return (
            <div key={step.key} className="flex flex-1 flex-col items-center text-center">
              <div className="flex w-full items-center">
                {i > 0 && (
                  <div
                    className={`h-0.5 flex-1 transition-colors ${done || current ? "bg-ink" : "bg-ink/15"}`}
                  />
                )}
                <div
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                    done
                      ? "border-ink bg-ink text-paper"
                      : current
                      ? "border-ink bg-paper text-ink"
                      : "border-ink/20 bg-paper text-ink/30"
                  }`}
                >
                  <Icon className="size-3.5" aria-hidden />
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 transition-colors ${done ? "bg-ink" : "bg-ink/15"}`}
                  />
                )}
              </div>
              <p
                className={`mt-2 hidden text-[11px] font-medium sm:block ${
                  current ? "text-ink" : done ? "text-ink/60" : "text-ink/30"
                }`}
              >
                {step.label}
              </p>
            </div>
          )
        })}
      </div>
      {/* Descripción del estado actual */}
      {STATUS_STEPS[currentIdx] && (
        <p className="mt-4 text-center text-[13px] text-ink-soft">
          {STATUS_STEPS[currentIdx].description}
        </p>
      )}
    </div>
  )
}

function PlanCard({ plan }: { plan: Awaited<ReturnType<typeof getMyPlan>> }) {
  return (
    <div className="rounded-[20px] border border-ink/10 bg-cream p-5">
      <h2 className="text-[16px] font-medium text-ink">Il tuo piano</h2>
      {plan ? (
        <dl className="mt-3 space-y-2 text-[14px]">
          {plan.plan ? <Row label="Piano" value={plan.plan} /> : null}
          {plan.goal ? <Row label="Obiettivo" value={plan.goal} /> : null}
          {plan.formatPreference ? <Row label="Formato" value={plan.formatPreference} /> : null}
          {plan.bmi ? <Row label="IMC" value={String(plan.bmi)} /> : null}
        </dl>
      ) : (
        <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">
          Il tuo piano di trattamento apparirà qui quando il tuo medico lo configurerà.
        </p>
      )}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-ink-soft">{label}</dt>
      <dd className="font-medium capitalize text-ink">{value}</dd>
    </div>
  )
}

function QuickLink({ href, title, body }: { href: string; title: string; body: string }) {
  return (
    <Link
      href={href}
      className="rounded-[20px] border border-ink/10 bg-cream p-5 transition-colors hover:bg-ink/5"
    >
      <h2 className="text-[16px] font-medium text-ink">{title}</h2>
      <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">{body}</p>
    </Link>
  )
}
