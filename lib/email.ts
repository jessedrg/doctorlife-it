import { Resend } from "resend"
import { getCanonicalBaseUrl } from "@/lib/base-url"

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

/**
 * Remitente. El dominio doctorlife.io está verificado en Resend. Se puede
 * sobreescribir con RESEND_FROM_EMAIL.
 */
const FROM = process.env.RESEND_FROM_EMAIL ?? "DoctorLife <hola@doctorlife.io>"

/* ── Paleta de la app (Maren) ── */
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

/** Cabecera, tarjeta y pie minimalistas con la estética cálida de la app. */
function shell(opts: { title: string; body: string; preheader?: string }) {
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
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
      DoctorLife · Salud y bienestar con médicos colegiados. Si no esperabas este correo, puedes ignorarlo.
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

/** Caja de datos (etiqueta + valor) sobre fondo papel. */
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

/** El médico solicita una verificación adicional antes de activar el tratamiento. */
export async function sendVerificationRequestedEmail(opts: {
  to: string
  name: string
  doctorName?: string | null
  message: string
}) {
  const firstName = opts.name.split(" ")[0] || "hola"
  const doc = opts.doctorName ? `Dr. ${opts.doctorName}` : "tu médico"
  const url = `${getCanonicalBaseUrl()}/portal/verificacion`
  const body = `
    ${p(`Hola ${firstName}, ${doc} necesita una verificación adicional antes de activar tu tratamiento.`)}
    ${dataBox([{ label: "Lo que te pide tu médico", value: opts.message }])}
    ${p("Sube lo solicitado desde tu panel. Tu médico lo revisará y, una vez aprobado, podrás activar el tratamiento.")}
    ${p("<strong>Confidencial:</strong> lo que envíes solo lo verá tu médico asignado. Nadie más tiene acceso.")}
    <div style="margin:22px 0 4px;">${button(url, "Completar verificación")}</div>
  `
  return send(
    opts.to,
    "Verificación necesaria para activar tu tratamiento",
    shell({ title: "Verificación necesaria", body, preheader: "Tu médico necesita un dato adicional." }),
  )
}

async function send(to: string, subject: string, html: string) {
  if (!resend) {
    console.log("[v0] RESEND_API_KEY ausente; email no enviado:", subject, "->", to)
    return { skipped: true as const }
  }
  const { data, error } = await resend.emails.send({ from: FROM, to, subject, html })
  if (error) {
    console.log("[v0] Error enviando email:", subject, error)
    throw new Error(error.message ?? "No se pudo enviar el correo")
  }
  return { id: data?.id }
}

/** Credenciales de acceso tras reservar la primera visita (gratis). */
export async function sendCredentialsEmail(opts: { to: string; name: string; tempPassword: string }) {
  const loginUrl = `${getCanonicalBaseUrl()}/sign-in`
  const firstName = opts.name.split(" ")[0] || "hola"
  const body = `
    ${p(`Hola ${firstName}, gracias por reservar tu primera visita. Hemos creado tu cuenta para acceder a tu panel privado, donde tendrás tu cita, el chat con tu médico y tus recetas.`)}
    ${dataBox([
      { label: "Usuario (tu email)", value: opts.to },
      { label: "Contraseña temporal", value: opts.tempPassword, mono: true },
    ])}
    ${p("Por seguridad, cámbiala desde <strong>Mi cuenta</strong> la primera vez que entres.")}
    <div style="margin:22px 0 4px;">${button(loginUrl, "Entrar a mi panel")}</div>
  `
  return send(
    opts.to,
    "Tus credenciales de acceso a DoctorLife",
    shell({ title: "Tu cuenta está lista", body, preheader: "Accede a tu panel privado de DoctorLife." }),
  )
}

/** Confirmación de la primera visita y del pago único. */
export async function sendBookingConfirmationEmail(opts: {
  to: string
  name: string
  doctorName?: string | null
  startsAt: Date
  amountLabel: string
}) {
  const firstName = opts.name.split(" ")[0] || "hola"
  const when = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Madrid",
  }).format(opts.startsAt)
  const rows = [{ label: "Tu primera visita", value: when }]
  if (opts.doctorName) rows.push({ label: "Endocrino", value: opts.doctorName })
  rows.push({ label: "Importe", value: opts.amountLabel })
  const body = `
    ${p(`Hola ${firstName}, hemos recibido tu pago correctamente y tu primera visita está reservada.`)}
    ${dataBox(rows)}
    ${p("Encontrarás el enlace de la videollamada y tu chat con el médico en tu panel. Tras la consulta, si tu médico te receta tratamiento, podrás activarlo desde ahí.")}
    <div style="margin:22px 0 4px;">${button(`${getCanonicalBaseUrl()}/portal`, "Ir a mi panel")}</div>
  `
  return send(
    opts.to,
    "Confirmación de tu primera visita — DoctorLife",
    shell({ title: "Pago confirmado", body, preheader: "Tu primera visita está reservada." }),
  )
}

/** Aviso al paciente de que su médico canceló la cita y debe reprogramar. */
export async function sendAppointmentCancelledEmail(opts: {
  to: string
  name: string
  doctorName?: string | null
  startsAt: Date
  rescheduleId: number
  isFollowup: boolean
}) {
  const firstName = opts.name.split(" ")[0] || "hola"
  const doc = opts.doctorName ? `Dr. ${opts.doctorName}` : "tu médico"
  const when = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Madrid",
  }).format(opts.startsAt)
  const url = `${getCanonicalBaseUrl()}/portal/reprogramar/${opts.rescheduleId}`
  const note = opts.isFollowup
    ? "Podrás elegir una nueva hora con tu mismo médico."
    : "Podrás elegir una nueva hora; te asignaremos un médico disponible para ese horario."
  const body = `
    ${p(`Hola ${firstName}, ${doc} ha tenido que cancelar tu cita del <strong>${when}</strong>. Lamentamos las molestias.`)}
    ${p(note)}
    <div style="margin:22px 0 4px;">${button(url, "Elegir nueva hora")}</div>
  `
  return send(
    opts.to,
    "Tu cita se ha cancelado — reprograma fácilmente",
    shell({ title: "Tu cita se canceló", body, preheader: "Elige una nueva hora para tu consulta." }),
  )
}

/** Confirmación al paciente de que su cita reprogramada está lista. */
export async function sendRescheduleConfirmedEmail(opts: {
  to: string
  name: string
  doctorName?: string | null
  startsAt: Date
  reassigned: boolean
}) {
  const firstName = opts.name.split(" ")[0] || "hola"
  const when = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Madrid",
  }).format(opts.startsAt)
  const rows = [{ label: "Nueva cita", value: when }]
  if (opts.doctorName) rows.push({ label: "Médico", value: opts.doctorName })
  const body = `
    ${p(`Hola ${firstName}, tu cita ha quedado reprogramada correctamente.`)}
    ${opts.reassigned ? p("Para ese horario te hemos asignado un médico disponible.") : ""}
    ${dataBox(rows)}
    ${p("Encontrarás el enlace de la videollamada en tu panel.")}
    <div style="margin:22px 0 4px;">${button(`${getCanonicalBaseUrl()}/portal/citas`, "Ver mis citas")}</div>
  `
  return send(
    opts.to,
    "Tu cita reprogramada está confirmada — DoctorLife",
    shell({ title: "Cita reprogramada", body, preheader: "Tu nueva cita está confirmada." }),
  )
}

/** Aviso al paciente de que su médico ha emitido una receta. */
export async function sendPrescriptionReadyEmail(opts: {
  to: string
  name: string
  doctorName?: string | null
  locked: boolean
}) {
  const firstName = opts.name.split(" ")[0] || "hola"
  const doc = opts.doctorName ? `Dr. ${opts.doctorName}` : "tu médico"
  const body = opts.locked
    ? `
      ${p(`Hola ${firstName}, ${doc} ha preparado tu tratamiento. Para ver los detalles y descargar tu receta en PDF, activa tu suscripción mensual.`)}
      ${p("Incluye endocrino asignado, videollamada mensual y chat en vivo con tu médico. Puedes cancelar cuando quieras.")}
      <div style="margin:22px 0 4px;">${button(`${getCanonicalBaseUrl()}/portal/recetas`, "Desbloquear mi receta")}</div>
    `
    : `
      ${p(`Hola ${firstName}, ${doc} ha emitido una nueva receta. Ya está disponible en tu panel para descargar en PDF.`)}
      <div style="margin:22px 0 4px;">${button(`${getCanonicalBaseUrl()}/portal/recetas`, "Ver mi receta")}</div>
    `
  return send(
    opts.to,
    "Tu receta está lista — DoctorLife",
    shell({
      title: "Tienes una nueva receta",
      body,
      preheader: opts.locked ? "Actívala para verla y descargarla." : "Ya disponible en tu panel.",
    }),
  )
}

/**
 * La clínica envía al paciente el plan/suscripción acordado tras la primera
 * consulta. El paciente entra a su portal, paga y se le activa el tratamiento.
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
  const firstName = opts.name.split(" ")[0] || "hola"
  const doc = opts.doctorName ? `Dr. ${opts.doctorName}` : "tu médico"
  const url = `${getCanonicalBaseUrl()}/portal/recetas?plan=oferta`
  const rows = [{ label: "Plan recomendado", value: opts.planName }]
  if (opts.firstPeriodLabel) rows.push({ label: "Primer pago", value: opts.firstPeriodLabel })
  rows.push({ label: opts.firstPeriodLabel ? "Después" : "Importe", value: opts.priceLabel })
  const body = `
    ${p(`Hola ${firstName}, ${doc} te ha preparado el plan que acordasteis en tu consulta. Cuando quieras, actívalo desde tu panel y tendrás acceso completo al tratamiento y al seguimiento.`)}
    ${dataBox(rows)}
    ${opts.note ? p(`<strong>Nota de tu médico:</strong> ${opts.note}`) : ""}
    ${p("Al confirmar el pago se activa automáticamente tu suscripción, tu receta y el chat con tu médico. Puedes cancelar cuando quieras.")}
    <div style="margin:22px 0 4px;">${button(url, "Ver y activar mi plan")}</div>
  `
  return send(
    opts.to,
    "Tu plan de tratamiento está listo — DoctorLife",
    shell({ title: "Tu plan está listo", body, preheader: "Actívalo desde tu panel para empezar." }),
  )
}

/** Credenciales de acceso para un médico creado por el admin. */
export async function sendDoctorWelcomeEmail(opts: { to: string; name: string; tempPassword: string }) {
  const loginUrl = `${getCanonicalBaseUrl()}/sign-in`
  const firstName = opts.name.split(" ")[0] || "hola"
  const body = `
    ${p(`Hola ${firstName}, el equipo de DoctorLife ha creado la cuenta de tu clínica. Desde tu panel podrás gestionar tu agenda, tus pacientes, el chat y las recetas, además de conectar tu Stripe y completar tus datos fiscales para poder cobrar.`)}
    ${dataBox([
      { label: "Usuario (tu email)", value: opts.to },
      { label: "Contraseña temporal", value: opts.tempPassword, mono: true },
    ])}
    ${p("Por seguridad, cámbiala desde <strong>Mi cuenta</strong> la primera vez que entres.")}
    <div style="margin:22px 0 4px;">${button(loginUrl, "Entrar a mi panel")}</div>
  `
  return send(
    opts.to,
    "El acceso de tu clínica en DoctorLife",
    shell({ title: "La cuenta de tu clínica está lista", body, preheader: "Gestiona tu agenda, pacientes y cobros." }),
  )
}

/**
 * Notificación de mensaje nuevo en el chat.
 *
 * Se envía cuando el otro participante (doctor o paciente) escribe y el
 * destinatario lleva más de 5 minutos sin recibir un aviso para esa misma
 * conversación (cooldown gestionado en sendMessage).
 */
export async function sendNewMessageEmail(opts: {
  to: string
  /** Nombre del destinatario (quien recibe el correo). */
  recipientName: string
  /** Nombre de quien escribió el mensaje. */
  senderName: string
  /** Fragmento del último mensaje (hasta 120 chars). */
  preview: string
  /** Rol del destinatario: 'patient' → enlace al portal; 'doctor' → enlace al panel. */
  recipientRole: "patient" | "doctor"
}) {
  const firstName = opts.recipientName.split(" ")[0] || "hola"
  const chatUrl =
    opts.recipientRole === "doctor"
      ? `${getCanonicalBaseUrl()}/clinica/chat`
      : `${getCanonicalBaseUrl()}/portal/chat`

  const previewText =
    opts.preview.length > 120 ? opts.preview.slice(0, 120) + "…" : opts.preview

  const body = `
    ${p(`Hola ${firstName}, tienes un mensaje nuevo de <strong>${opts.senderName}</strong>.`)}
    <div style="background:${PAPER};border-left:3px solid ${AMBER};border-radius:0 10px 10px 0;padding:12px 16px;margin:0 0 18px;">
      <p style="margin:0;font-size:14px;line-height:1.6;color:${INK_SOFT};font-style:italic;">"${previewText}"</p>
    </div>
    ${p("Responde desde tu panel para mantener la conversación en un solo lugar seguro.")}
    <div style="margin:22px 0 4px;">${button(chatUrl, "Ver el mensaje")}</div>
  `

  return send(
    opts.to,
    `${opts.senderName} te ha escrito — DoctorLife`,
    shell({
      title: "Tienes un mensaje nuevo",
      body,
      preheader: `${opts.senderName}: ${previewText}`,
    }),
  )
}

/** Restablecer contraseña (usado por Better Auth). */
export async function sendResetPasswordEmail(opts: { to: string; name?: string; url: string }) {
  const firstName = opts.name?.split(" ")[0] || "hola"
  const body = `
    ${p(`Hola ${firstName}, recibimos una solicitud para restablecer tu contraseña.`)}
    ${p("Pulsa el botón para crear una nueva. El enlace caduca en 1 hora.")}
    <div style="margin:18px 0 8px;">${button(opts.url, "Restablecer contraseña")}</div>
    ${p("Si no fuiste tú, ignora este correo y tu contraseña seguirá igual.")}
  `
  return send(
    opts.to,
    "Restablece tu contraseña — DoctorLife",
    shell({ title: "Restablecer contraseña", body, preheader: "Crea una contraseña nueva." }),
  )
}

/* ───────────────────────────────────────────────────────────
   Notificación interna de nuevos leads (captados desde landing/blog).
   ─────────────────────────────────────────────────────────── */

// Destinatarios de las notificaciones de nuevos leads.
export const LEAD_NOTIFICATION_RECIPIENTS = ["hello@doctorlife.io"]

// Remitente para los avisos de leads (dominio verificado en Resend).
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
  if (!resend) return { ok: false, error: "RESEND_API_KEY no configurada" }

  const title = lead.name ? `Nuevo lead: ${lead.name}` : "Nuevo lead en DoctorLife"
  const rows = [
    leadRow("Nombre", lead.name),
    leadRow("Email", lead.email),
    leadRow("Teléfono", lead.phone),
    leadRow("Objetivo", lead.goal),
    leadRow("Experiencia GLP-1", lead.glp1Experience),
    leadRow("Formato preferido", lead.formatPreference),
    leadRow("Plazo", lead.timeline),
    leadRow("Plan", lead.plan),
    leadRow("Altura (cm)", lead.heightCm),
    leadRow("Peso (kg)", lead.weightKg),
    leadRow("Edad", lead.age),
    leadRow("IMC", lead.bmi),
    leadRow("Origen", lead.source),
  ].join("")

  const html = `<!doctype html>
<html lang="es">
<body style="margin:0;background:#f6f6f4;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:24px;">
    <div style="background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #ececec;">
      <div style="background:#111827;padding:20px 24px;">
        <h1 style="margin:0;color:#ffffff;font-size:18px;">${title}</h1>
        <p style="margin:4px 0 0;color:#9ca3af;font-size:13px;">DoctorLife · notificación de lead</p>
      </div>
      <table style="width:100%;border-collapse:collapse;">
        ${rows}
      </table>
      <div style="padding:16px 24px;background:#fafafa;">
        <a href="mailto:${lead.email}" style="display:inline-block;background:#111827;color:#fff;text-decoration:none;font-size:13px;font-weight:600;padding:10px 18px;border-radius:8px;">Responder al lead</a>
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
      return { ok: false, error: error.message ?? "Error al enviar el email" }
    }
    return { ok: true, id: data?.id }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido al enviar el email"
    console.log("[v0] sendLeadNotification exception:", message)
    return { ok: false, error: message }
  }
}
