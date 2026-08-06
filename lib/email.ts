import { Resend } from "resend"
import { getCanonicalBaseUrl } from "@/lib/base-url"

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

/**
 * Mittente. Il dominio doctorlife.io è verificato su Resend. Si può
 * sovrascrivere con RESEND_FROM_EMAIL.
 */
const FROM = process.env.RESEND_FROM_EMAIL ?? "DoctorLife <hola@doctorlife.io>"

/* ── Palette dell'app (Maren) ── */
const PAPER = "#f6f0e6"
const WARM = "#fffdf8"
const INK = "#221d17"
const INK_SOFT = "#5b5147"
const INK_MUTE = "#7a6f60"
const LINE = "#e3d6c1"
const AMBER = "#c98a4f"

const FONT =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"
const SERIF = "'Iowan Old Style','Palatino Linotype',Georgia,'Times New Roman',serif"

/** Formatta una data/ora nel fuso italiano. */
function formatWhen(date: Date) {
  return new Intl.DateTimeFormat("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Rome",
  }).format(date)
}

/** Intestazione, scheda e piè di pagina minimalisti con l'estetica calda dell'app. */
function shell(opts: { title: string; body: string; preheader?: string }) {
  return `<!doctype html><html lang="it"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:${PAPER};font-family:${FONT};color:${INK};">
  ${opts.preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${opts.preheader}</div>` : ""}
  <div style="max-width:512px;margin:0 auto;padding:40px 20px;">
    <div style="display:flex;align-items:center;gap:8px;margin:0 0 22px;">
      <span style="display:inline-block;width:22px;height:22px;border-radius:50%;background:${AMBER};"></span>
      <span style="font-size:18px;font-weight:600;letter-spacing:-.01em;color:${INK};">DoctorLife</span>
    </div>
    <div style="background:${WARM};border:1px solid ${LINE};border-radius:20px;padding:30px;">
      <h1 style="margin:0 0 14px;font-family:${SERIF};font-size:24px;font-weight:400;line-height:1.2;letter-spacing:-.01em;color:${INK};">${opts.title}</h1>
      ${opts.body}
    </div>
    <p style="margin:18px 6px 0;font-size:12px;line-height:1.6;color:${INK_MUTE};">
      DoctorLife · Salute e benessere con medici iscritti all'albo. Se non ti aspettavi questa email, puoi ignorarla.
    </p>
  </div>
</body></html>`
}

function p(text: string) {
  return `<p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:${INK_SOFT};">${text}</p>`
}

function button(href: string, label: string) {
  return `<a href="${href}" style="display:inline-block;background:${INK};color:${PAPER};text-decoration:none;font-weight:600;font-size:15px;padding:13px 24px;border-radius:999px;">${label}</a>`
}

/** Box dati (etichetta + valore) su sfondo carta. */
function dataBox(rows: { label: string; value: string; mono?: boolean }[]) {
  const inner = rows
    .map(
      (r, i) => `
      <p style="margin:${i === 0 ? "0" : "12px"} 0 4px;font-size:12px;letter-spacing:.04em;text-transform:uppercase;color:${INK_MUTE};">${r.label}</p>
      <p style="margin:0;font-size:${r.mono ? "18px" : "15px"};font-weight:${r.mono ? "700" : "600"};${r.mono ? `letter-spacing:.04em;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;` : ""}color:${INK};">${r.value}</p>`,
    )
    .join("")
  return `<div style="background:${PAPER};border:1px solid ${LINE};border-radius:14px;padding:18px;margin:0 0 18px;">${inner}</div>`
}

/** Il medico richiede una verifica aggiuntiva prima di attivare il trattamento. */
export async function sendVerificationRequestedEmail(opts: {
  to: string
  name: string
  doctorName?: string | null
  message: string
}) {
  const firstName = opts.name.split(" ")[0] || "ciao"
  const doc = opts.doctorName ? `Dr. ${opts.doctorName}` : "il tuo medico"
  const url = `${getCanonicalBaseUrl()}/portal/verificacion`
  const body = `
    ${p(`Ciao ${firstName}, ${doc} ha bisogno di una verifica aggiuntiva prima di attivare il tuo trattamento.`)}
    ${dataBox([{ label: "Cosa ti chiede il tuo medico", value: opts.message }])}
    ${p("Carica quanto richiesto dal tuo pannello. Il tuo medico lo esaminerà e, una volta approvato, potrai attivare il trattamento.")}
    ${p("<strong>Riservato:</strong> ciò che invii lo vedrà solo il tuo medico assegnato. Nessun altro vi ha accesso.")}
    <div style="margin:22px 0 4px;">${button(url, "Completa la verifica")}</div>
  `
  return send(
    opts.to,
    "Verifica necessaria per attivare il tuo trattamento",
    shell({ title: "Verifica necessaria", body, preheader: "Il tuo medico ha bisogno di un dato aggiuntivo." }),
  )
}

async function send(to: string, subject: string, html: string) {
  if (!resend) {
    console.log("[v0] RESEND_API_KEY assente; email non inviata:", subject, "->", to)
    return { skipped: true as const }
  }
  const { data, error } = await resend.emails.send({ from: FROM, to, subject, html })
  if (error) {
    console.log("[v0] Errore invio email:", subject, error)
    throw new Error(error.message ?? "Impossibile inviare l'email")
  }
  return { id: data?.id }
}

/** Credenziali di accesso dopo aver prenotato la prima visita (gratis). */
export async function sendCredentialsEmail(opts: { to: string; name: string; tempPassword: string }) {
  const loginUrl = `${getCanonicalBaseUrl()}/sign-in`
  const firstName = opts.name.split(" ")[0] || "ciao"
  const body = `
    ${p(`Ciao ${firstName}, grazie per aver prenotato la tua prima visita. Abbiamo creato il tuo account per accedere al tuo pannello privato, dove troverai il tuo appuntamento, la chat con il tuo medico e le tue ricette.`)}
    ${dataBox([
      { label: "Utente (la tua email)", value: opts.to },
      { label: "Password temporanea", value: opts.tempPassword, mono: true },
    ])}
    ${p("Per sicurezza, cambiala da <strong>Il mio account</strong> al primo accesso.")}
    <div style="margin:22px 0 4px;">${button(loginUrl, "Accedi al mio pannello")}</div>
  `
  return send(
    opts.to,
    "Le tue credenziali di accesso a DoctorLife",
    shell({ title: "Il tuo account è pronto", body, preheader: "Accedi al tuo pannello privato di DoctorLife." }),
  )
}

/** Conferma della prima visita e del pagamento unico. */
export async function sendBookingConfirmationEmail(opts: {
  to: string
  name: string
  doctorName?: string | null
  startsAt: Date
  amountLabel: string
}) {
  const firstName = opts.name.split(" ")[0] || "ciao"
  const when = formatWhen(opts.startsAt)
  const rows = [{ label: "La tua prima visita", value: when }]
  if (opts.doctorName) rows.push({ label: "Endocrinologo", value: opts.doctorName })
  rows.push({ label: "Importo", value: opts.amountLabel })
  const body = `
    ${p(`Ciao ${firstName}, abbiamo ricevuto correttamente il tuo pagamento e la tua prima visita è prenotata.`)}
    ${dataBox(rows)}
    ${p("Troverai il link della videochiamata e la chat con il medico nel tuo pannello. Dopo la visita, se il tuo medico ti prescrive un trattamento, potrai attivarlo da lì.")}
    <div style="margin:22px 0 4px;">${button(`${getCanonicalBaseUrl()}/portal`, "Vai al mio pannello")}</div>
  `
  return send(
    opts.to,
    "Conferma della tua prima visita — DoctorLife",
    shell({ title: "Pagamento confermato", body, preheader: "La tua prima visita è prenotata." }),
  )
}

/** Avviso al paziente che il suo medico ha annullato l'appuntamento e deve riprogrammare. */
export async function sendAppointmentCancelledEmail(opts: {
  to: string
  name: string
  doctorName?: string | null
  startsAt: Date
  rescheduleId: number
  isFollowup: boolean
}) {
  const firstName = opts.name.split(" ")[0] || "ciao"
  const doc = opts.doctorName ? `Dr. ${opts.doctorName}` : "il tuo medico"
  const when = formatWhen(opts.startsAt)
  const url = `${getCanonicalBaseUrl()}/portal/reprogramar/${opts.rescheduleId}`
  const note = opts.isFollowup
    ? "Potrai scegliere un nuovo orario con lo stesso medico."
    : "Potrai scegliere un nuovo orario; ti assegneremo un medico disponibile per quella fascia."
  const body = `
    ${p(`Ciao ${firstName}, ${doc} ha dovuto annullare il tuo appuntamento del <strong>${when}</strong>. Ci scusiamo per il disagio.`)}
    ${p(note)}
    <div style="margin:22px 0 4px;">${button(url, "Scegli un nuovo orario")}</div>
  `
  return send(
    opts.to,
    "Il tuo appuntamento è stato annullato — riprogramma facilmente",
    shell({ title: "Il tuo appuntamento è stato annullato", body, preheader: "Scegli un nuovo orario per la tua visita." }),
  )
}

/** Conferma al paziente che il suo appuntamento riprogrammato è pronto. */
export async function sendRescheduleConfirmedEmail(opts: {
  to: string
  name: string
  doctorName?: string | null
  startsAt: Date
  reassigned: boolean
}) {
  const firstName = opts.name.split(" ")[0] || "ciao"
  const when = formatWhen(opts.startsAt)
  const rows = [{ label: "Nuovo appuntamento", value: when }]
  if (opts.doctorName) rows.push({ label: "Medico", value: opts.doctorName })
  const body = `
    ${p(`Ciao ${firstName}, il tuo appuntamento è stato riprogrammato correttamente.`)}
    ${opts.reassigned ? p("Per quell'orario ti abbiamo assegnato un medico disponibile.") : ""}
    ${dataBox(rows)}
    ${p("Troverai il link della videochiamata nel tuo pannello.")}
    <div style="margin:22px 0 4px;">${button(`${getCanonicalBaseUrl()}/portal/citas`, "Vedi i miei appuntamenti")}</div>
  `
  return send(
    opts.to,
    "Il tuo appuntamento riprogrammato è confermato — DoctorLife",
    shell({ title: "Appuntamento riprogrammato", body, preheader: "Il tuo nuovo appuntamento è confermato." }),
  )
}

/** Avviso al paziente che il suo medico ha emesso una ricetta. */
export async function sendPrescriptionReadyEmail(opts: {
  to: string
  name: string
  doctorName?: string | null
  locked: boolean
}) {
  const firstName = opts.name.split(" ")[0] || "ciao"
  const doc = opts.doctorName ? `Dr. ${opts.doctorName}` : "il tuo medico"
  const body = opts.locked
    ? `
      ${p(`Ciao ${firstName}, ${doc} ha preparato il tuo trattamento. Per vedere i dettagli e scaricare la tua ricetta in PDF, attiva il tuo abbonamento mensile.`)}
      ${p("Include l'endocrinologo assegnato, la videochiamata mensile e la chat dal vivo con il tuo medico. Puoi disdire quando vuoi.")}
      <div style="margin:22px 0 4px;">${button(`${getCanonicalBaseUrl()}/portal/recetas`, "Sblocca la mia ricetta")}</div>
    `
    : `
      ${p(`Ciao ${firstName}, ${doc} ha emesso una nuova ricetta. È già disponibile nel tuo pannello per il download in PDF.`)}
      <div style="margin:22px 0 4px;">${button(`${getCanonicalBaseUrl()}/portal/recetas`, "Vedi la mia ricetta")}</div>
    `
  return send(
    opts.to,
    "La tua ricetta è pronta — DoctorLife",
    shell({
      title: "Hai una nuova ricetta",
      body,
      preheader: opts.locked ? "Attivala per vederla e scaricarla." : "Già disponibile nel tuo pannello.",
    }),
  )
}

/**
 * La clinica invia al paziente il piano/abbonamento concordato dopo la prima
 * visita. Il paziente entra nel suo portale, paga e gli viene attivato il trattamento.
 */
export async function sendPlanOfferEmail(opts: {
  to: string
  name: string
  doctorName?: string | null
  planName: string
  priceLabel: string
  firstPeriodLabel?: string | null
  note?: string | null
}) {
  const firstName = opts.name.split(" ")[0] || "ciao"
  const doc = opts.doctorName ? `Dr. ${opts.doctorName}` : "il tuo medico"
  const url = `${getCanonicalBaseUrl()}/portal/recetas?plan=oferta`
  const rows = [{ label: "Piano consigliato", value: opts.planName }]
  if (opts.firstPeriodLabel) rows.push({ label: "Primo pagamento", value: opts.firstPeriodLabel })
  rows.push({ label: opts.firstPeriodLabel ? "In seguito" : "Importo", value: opts.priceLabel })
  const body = `
    ${p(`Ciao ${firstName}, ${doc} ti ha preparato il piano concordato durante la tua visita. Quando vuoi, attivalo dal tuo pannello e avrai accesso completo al trattamento e al monitoraggio.`)}
    ${dataBox(rows)}
    ${opts.note ? p(`<strong>Nota del tuo medico:</strong> ${opts.note}`) : ""}
    ${p("Confermando il pagamento si attivano automaticamente il tuo abbonamento, la tua ricetta e la chat con il tuo medico. Puoi disdire quando vuoi.")}
    <div style="margin:22px 0 4px;">${button(url, "Vedi e attiva il mio piano")}</div>
  `
  return send(
    opts.to,
    "Il tuo piano di trattamento è pronto — DoctorLife",
    shell({ title: "Il tuo piano è pronto", body, preheader: "Attivalo dal tuo pannello per iniziare." }),
  )
}

/** Credenziali di accesso per un medico creato dall'admin. */
export async function sendDoctorWelcomeEmail(opts: { to: string; name: string; tempPassword: string }) {
  const loginUrl = `${getCanonicalBaseUrl()}/sign-in`
  const firstName = opts.name.split(" ")[0] || "ciao"
  const body = `
    ${p(`Ciao ${firstName}, il team di DoctorLife ha creato l'account della tua clinica. Dal tuo pannello potrai gestire la tua agenda, i tuoi pazienti, la chat e le ricette, oltre a collegare il tuo Stripe e completare i tuoi dati fiscali per poter incassare.`)}
    ${dataBox([
      { label: "Utente (la tua email)", value: opts.to },
      { label: "Password temporanea", value: opts.tempPassword, mono: true },
    ])}
    ${p("Per sicurezza, cambiala da <strong>Il mio account</strong> al primo accesso.")}
    <div style="margin:22px 0 4px;">${button(loginUrl, "Accedi al mio pannello")}</div>
  `
  return send(
    opts.to,
    "L'accesso della tua clinica su DoctorLife",
    shell({ title: "L'account della tua clinica è pronto", body, preheader: "Gestisci la tua agenda, i pazienti e gli incassi." }),
  )
}

/**
 * Notifica di nuovo messaggio nella chat.
 *
 * Si invia quando l'altro partecipante (medico o paziente) scrive e il
 * destinatario non riceve un avviso per la stessa conversazione da più di
 * 5 minuti (cooldown gestito in sendMessage).
 */
export async function sendNewMessageEmail(opts: {
  to: string
  /** Nome del destinatario (chi riceve l'email). */
  recipientName: string
  /** Nome di chi ha scritto il messaggio. */
  senderName: string
  /** Estratto dell'ultimo messaggio (fino a 120 caratteri). */
  preview: string
  /** Ruolo del destinatario: 'patient' → link al portale; 'doctor' → link al pannello. */
  recipientRole: "patient" | "doctor"
}) {
  const firstName = opts.recipientName.split(" ")[0] || "ciao"
  const chatUrl =
    opts.recipientRole === "doctor"
      ? `${getCanonicalBaseUrl()}/clinica/chat`
      : `${getCanonicalBaseUrl()}/portal/chat`

  const previewText =
    opts.preview.length > 120 ? opts.preview.slice(0, 120) + "…" : opts.preview

  const body = `
    ${p(`Ciao ${firstName}, hai un nuovo messaggio da <strong>${opts.senderName}</strong>.`)}
    <div style="background:${PAPER};border-left:3px solid ${AMBER};border-radius:0 10px 10px 0;padding:12px 16px;margin:0 0 18px;">
      <p style="margin:0;font-size:14px;line-height:1.6;color:${INK_SOFT};font-style:italic;">"${previewText}"</p>
    </div>
    ${p("Rispondi dal tuo pannello per mantenere la conversazione in un unico posto sicuro.")}
    <div style="margin:22px 0 4px;">${button(chatUrl, "Vedi il messaggio")}</div>
  `

  return send(
    opts.to,
    `${opts.senderName} ti ha scritto — DoctorLife`,
    shell({
      title: "Hai un nuovo messaggio",
      body,
      preheader: `${opts.senderName}: ${previewText}`,
    }),
  )
}

/** Reimposta password (usato da Better Auth). */
export async function sendResetPasswordEmail(opts: { to: string; name?: string; url: string }) {
  const firstName = opts.name?.split(" ")[0] || "ciao"
  const body = `
    ${p(`Ciao ${firstName}, abbiamo ricevuto una richiesta per reimpostare la tua password.`)}
    ${p("Premi il pulsante per crearne una nuova. Il link scade tra 1 ora.")}
    <div style="margin:18px 0 8px;">${button(opts.url, "Reimposta password")}</div>
    ${p("Se non sei stato tu, ignora questa email e la tua password resterà invariata.")}
  `
  return send(
    opts.to,
    "Reimposta la tua password — DoctorLife",
    shell({ title: "Reimposta password", body, preheader: "Crea una nuova password." }),
  )
}

/* ───────────────────────────────────────────────────────────
   Notifica interna di nuovi lead (acquisiti da landing/blog).
   ─────────────────────────────────────────────────────────── */

// Destinatari delle notifiche di nuovi lead.
export const LEAD_NOTIFICATION_RECIPIENTS = ["hello@doctorlife.io"]

// Mittente per gli avvisi di lead (dominio verificato su Resend).
const LEAD_FROM = "DoctorLife <leads@doctorlife.io>"

type LeadEmailData = {
  name?: string | null
  email: string
  phone?: string | null
  goal?: string | null
  glp1Experience?: string | null
  formatPreference?: string | null
  timeline?: string | null
  plan?: string | null
  heightCm?: number | null
  weightKg?: number | null
  age?: number | null
  bmi?: string | null
  source?: string | null
  domain?: string | null
}

function leadRow(label: string, value: unknown): string {
  if (value === null || value === undefined || value === "") return ""
  return `<tr>
    <td style="padding:6px 12px;color:#6b7280;font-size:13px;border-bottom:1px solid #f0f0f0;">${label}</td>
    <td style="padding:6px 12px;color:#111827;font-size:13px;font-weight:600;border-bottom:1px solid #f0f0f0;">${String(value)}</td>
  </tr>`
}

export type SendResult = { ok: true; id?: string } | { ok: false; error: string }

export async function sendLeadNotification(lead: LeadEmailData): Promise<SendResult> {
  if (!resend) return { ok: false, error: "RESEND_API_KEY non configurata" }

  const title = lead.name ? `Nuovo lead: ${lead.name}` : "Nuovo lead su DoctorLife"
  const rows = [
    leadRow("Nome", lead.name),
    leadRow("Email", lead.email),
    leadRow("Telefono", lead.phone),
    leadRow("Obiettivo", lead.goal),
    leadRow("Esperienza GLP-1", lead.glp1Experience),
    leadRow("Formato preferito", lead.formatPreference),
    leadRow("Tempistica", lead.timeline),
    leadRow("Piano", lead.plan),
    leadRow("Altezza (cm)", lead.heightCm),
    leadRow("Peso (kg)", lead.weightKg),
    leadRow("Età", lead.age),
    leadRow("IMC", lead.bmi),
    leadRow("Origine", lead.source),
    leadRow("Dominio", lead.domain),
  ].join("")

  const html = `<!doctype html>
<html lang="it">
<body style="margin:0;background:#f6f6f4;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:24px;">
    <div style="background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #ececec;">
      <div style="background:#111827;padding:20px 24px;">
        <h1 style="margin:0;color:#ffffff;font-size:18px;">${title}</h1>
        <p style="margin:4px 0 0;color:#9ca3af;font-size:13px;">DoctorLife · notifica di lead</p>
      </div>
      <table style="width:100%;border-collapse:collapse;">
        ${rows}
      </table>
      <div style="padding:16px 24px;background:#fafafa;">
        <a href="mailto:${lead.email}" style="display:inline-block;background:#111827;color:#fff;text-decoration:none;font-size:13px;font-weight:600;padding:10px 18px;border-radius:8px;">Rispondi al lead</a>
      </div>
    </div>
  </div>
</body>
</html>`

  try {
    const { data, error } = await resend.emails.send({
      from: LEAD_FROM,
      to: LEAD_NOTIFICATION_RECIPIENTS,
      replyTo: lead.email,
      subject: title,
      html,
    })
    if (error) {
      console.log("[v0] sendLeadNotification error:", error.message ?? error)
      return { ok: false, error: error.message ?? "Errore durante l'invio dell'email" }
    }
    return { ok: true, id: data?.id }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore sconosciuto durante l'invio dell'email"
    console.log("[v0] sendLeadNotification exception:", message)
    return { ok: false, error: message }
  }
}
