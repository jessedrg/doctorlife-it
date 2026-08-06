"use server"

import { db } from "@/lib/db"
import { user as userTable, doctorProfiles, doctorAvailability, availabilityExceptions, appointments, leads, subscriptions, conversations, messages, session, account, notifications, prescriptions, planOffers, commissions, doctorNotes, verificationRequests } from "@/lib/db/schema"
import { getSessionUser } from "@/lib/session"
import { missingClinicFields } from "@/lib/clinic"
import { and, count, desc, eq, inArray, notInArray, sql, sum } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { generateTempPassword } from "@/lib/credentials"
import { sendDoctorWelcomeEmail } from "@/lib/email"
import { isProductionRequest, getRequestDomain } from "@/lib/base-url"

const ACTIVE_SUB_STATES = ["active", "trialing", "past_due"]

async function requireAdmin() {
  const u = await getSessionUser()
  if (!u || u.role !== "admin") throw new Error("Unauthorized")
  return u
}

/**
 * Crea una cuenta de médico con contraseña temporal y le envía sus credenciales.
 * Los médicos no se registran solos: solo el admin puede crearlos.
 */
export async function createDoctor(input: {
  name: string
  email: string
  specialty?: string
  domain?: string
}) {
  await requireAdmin()
  const name = input.name.trim()
  const email = input.email.trim().toLowerCase()
  const specialty = input.specialty?.trim() || null
  // Si el admin no indica un dominio, el médico queda asignado al dominio de
  // ESTE proyecto (doctorlife-it.com), para que solo atienda a sus pacientes.
  const domain = input.domain?.trim() || (await getRequestDomain())

  if (!name) return { ok: false, error: "Introduce el nombre de la clínica." }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Introduce un email válido." }
  }

  const [existing] = await db
    .select({ id: userTable.id })
    .from(userTable)
    .where(eq(userTable.email, email))
    .limit(1)
  if (existing) return { ok: false, error: "Ya existe una cuenta con ese email." }

  const tempPassword = generateTempPassword()

  // Si la petición viene desde producción (doctorlife.io) el médico es de prod.
  // Desde dev.doctorlife.io o cualquier otro entorno se marca como isDevOnly.
  const isProd = await isProductionRequest()
  const isDevOnly = !isProd

  // Better Auth crea el usuario y hashea la contraseña.
  const created = await auth.api.signUpEmail({ body: { name, email, password: tempPassword } })
  const userId = created?.user?.id
  if (!userId) return { ok: false, error: "No se pudo crear la cuenta de la clínica." }

  await db
    .update(userTable)
    .set({ role: "doctor", updatedAt: new Date() })
    .where(eq(userTable.id, userId))

  await db
    .insert(doctorProfiles)
    .values({ userId, fullName: name, specialty, isDevOnly, domain })
    .onConflictDoNothing({ target: doctorProfiles.userId })

  await sendDoctorWelcomeEmail({ to: email, name, tempPassword })

  revalidatePath("/admin/clinicas")
  revalidatePath("/admin")
  return { ok: true }
}

export async function listUsers() {
  await requireAdmin()
  return db
    .select({
      id: userTable.id,
      name: userTable.name,
      email: userTable.email,
      role: userTable.role,
      createdAt: userTable.createdAt,
    })
    .from(userTable)
    .orderBy(userTable.createdAt)
}

/** Métricas de cabecera para el panel de admin. */
export async function getAdminMetrics() {
  await requireAdmin()

  const [[doctors], [patients], [leadCount], [confirmed], [revenue], [fees], [activeSubs], [mrr]] =
    await Promise.all([
      db.select({ n: count() }).from(userTable).where(eq(userTable.role, "doctor")),
      db.select({ n: count() }).from(userTable).where(eq(userTable.role, "patient")),
      db.select({ n: count() }).from(leads),
      db.select({ n: count() }).from(appointments).where(eq(appointments.status, "confirmed")),
      db
        .select({ s: sum(appointments.amountCents) })
        .from(appointments)
        .where(eq(appointments.status, "confirmed")),
      db
        .select({ s: sum(appointments.applicationFeeCents) })
        .from(appointments)
        .where(eq(appointments.status, "confirmed")),
      db
        .select({ n: count() })
        .from(subscriptions)
        .where(inArray(subscriptions.status, ACTIVE_SUB_STATES)),
      db
        .select({ s: sum(subscriptions.priceCents) })
        .from(subscriptions)
        .where(inArray(subscriptions.status, ACTIVE_SUB_STATES)),
    ])

  return {
    doctors: doctors?.n ?? 0,
    patients: patients?.n ?? 0,
    leads: leadCount?.n ?? 0,
    confirmedAppointments: confirmed?.n ?? 0,
    grossRevenueCents: Number(revenue?.s ?? 0),
    platformFeesCents: Number(fees?.s ?? 0),
    activeSubscriptions: activeSubs?.n ?? 0,
    mrrCents: Number(mrr?.s ?? 0),
  }
}

/** Suscripciones para el panel de admin. */
export async function listSubscriptions() {
  await requireAdmin()
  return db
    .select({
      id: subscriptions.id,
      plan: subscriptions.plan,
      priceCents: subscriptions.priceCents,
      status: subscriptions.status,
      cancelAtPeriodEnd: subscriptions.cancelAtPeriodEnd,
      currentPeriodEnd: subscriptions.currentPeriodEnd,
      patientName: userTable.name,
      doctorName: doctorProfiles.fullName,
    })
    .from(subscriptions)
    .leftJoin(userTable, eq(userTable.id, subscriptions.patientId))
    .leftJoin(doctorProfiles, eq(doctorProfiles.userId, subscriptions.doctorId))
    .orderBy(desc(subscriptions.id))
    .limit(200)
}

/** Médicos con su perfil y estado de Stripe. */
export async function listDoctors() {
  await requireAdmin()
  return db
    .select({
      id: userTable.id,
      name: userTable.name,
      email: userTable.email,
      specialty: doctorProfiles.specialty,
      acceptingPatients: doctorProfiles.acceptingPatients,
      chargesEnabled: doctorProfiles.chargesEnabled,
      stripeOnboarded: doctorProfiles.stripeOnboarded,
      isDevOnly: doctorProfiles.isDevOnly,
      createdAt: userTable.createdAt,
    })
  .from(userTable)
  .leftJoin(doctorProfiles, eq(doctorProfiles.userId, userTable.id))
  .where(eq(userTable.role, "doctor"))
  .orderBy(userTable.createdAt)
  }

  /**
   * Clínicas con el detalle de su progreso de activación y las franjas de
   * disponibilidad que han marcado. Para el panel de admin.
   */
  export async function listClinicsWithStatus() {
  await requireAdmin()

  const rows = await db
  .select({ user: userTable, profile: doctorProfiles })
  .from(userTable)
  .leftJoin(doctorProfiles, eq(doctorProfiles.userId, userTable.id))
  .where(eq(userTable.role, "doctor"))
  .orderBy(userTable.createdAt)

  const rules = await db
  .select({
  userId: doctorAvailability.userId,
  dayOfWeek: doctorAvailability.dayOfWeek,
  startMinute: doctorAvailability.startMinute,
  endMinute: doctorAvailability.endMinute,
  })
  .from(doctorAvailability)

  const rulesByUser = new Map<string, { dayOfWeek: number; startMinute: number; endMinute: number }[]>()
  for (const r of rules) {
  const list = rulesByUser.get(r.userId) ?? []
  list.push({ dayOfWeek: r.dayOfWeek, startMinute: r.startMinute, endMinute: r.endMinute })
  rulesByUser.set(r.userId, list)
  }

  return rows.map(({ user: u, profile: p }) => {
  const profileComplete = Boolean(p?.fullName?.trim() && p?.specialty?.trim() && p?.licenseNumber?.trim())
  const missingFiscal = p ? missingClinicFields(p) : []
  const fiscalComplete = Boolean(p) && missingFiscal.length === 0
  const stripeReady = Boolean(p?.stripeAccountId && p?.chargesEnabled)
  const availabilityRules = (rulesByUser.get(u.id) ?? []).sort(
  (a, b) => a.dayOfWeek - b.dayOfWeek || a.startMinute - b.startMinute,
  )
  const availabilitySet = availabilityRules.length > 0

  const steps = [
  { key: "profile", done: profileComplete },
  { key: "fiscal", done: fiscalComplete },
  { key: "stripe", done: stripeReady },
  { key: "availability", done: availabilitySet },
  ]
  const completed = steps.filter((s) => s.done).length

  return {
  id: u.id,
  name: u.name,
  email: u.email,
  specialty: p?.specialty ?? null,
  acceptingPatients: p?.acceptingPatients ?? false,
  isDevOnly: p?.isDevOnly ?? false,
  chargesEnabled: p?.chargesEnabled ?? false,
  stripeOnboarded: p?.stripeOnboarded ?? false,
  profileComplete,
  fiscalComplete,
  missingFiscalCount: missingFiscal.length,
  fiscal: {
  clinicName: p?.clinicName ?? null,
  taxId: p?.taxId ?? null,
  addressLine: p?.addressLine ?? null,
  city: p?.city ?? null,
  postalCode: p?.postalCode ?? null,
  province: p?.province ?? null,
  healthRegistryNumber: p?.healthRegistryNumber ?? null,
  medicalDirectorName: p?.medicalDirectorName ?? null,
  medicalDirectorLicense: p?.medicalDirectorLicense ?? null,
  billingEmail: p?.billingEmail ?? null,
  dataProtectionContact: p?.dataProtectionContact ?? null,
  },
  stripeReady,
  availabilitySet,
  availabilityRules,
  completedSteps: completed,
  totalSteps: steps.length,
  fullyActive: completed === steps.length,
  }
  })
  }

/** Pacientes con su número de citas. */
export async function listPatients() {
  await requireAdmin()
  return db
    .select({
      id: userTable.id,
      name: userTable.name,
      email: userTable.email,
      createdAt: userTable.createdAt,
    })
    .from(userTable)
    .where(eq(userTable.role, "patient"))
    .orderBy(desc(userTable.createdAt))
}

/** Leads capturados desde el quiz. */
export async function listLeads() {
  await requireAdmin()
  return db
    .select({
      id: leads.id,
      name: leads.name,
      email: leads.email,
      phone: leads.phone,
      goal: leads.goal,
      plan: leads.plan,
      bmi: leads.bmi,
      createdAt: leads.createdAt,
    })
    .from(leads)
    .orderBy(desc(leads.createdAt))
    .limit(200)
}

/**
 * Borra TODOS los pacientes y todos sus datos asociados.
 * Solo para el admin, útil para limpiar entornos de prueba.
 */
export async function purgeAllPatients() {
  await requireAdmin()

  const patientIds = await db
    .select({ id: userTable.id })
    .from(userTable)
    .where(eq(userTable.role, "patient"))
  const ids = patientIds.map((p) => p.id)
  if (!ids.length) return { ok: true, deleted: 0 }

  await db.delete(messages).where(inArray(messages.senderId, ids))
  await db.delete(prescriptions).where(inArray(prescriptions.patientId, ids))
  await db.delete(appointments).where(inArray(appointments.patientId, ids))
  await db.delete(subscriptions).where(inArray(subscriptions.patientId, ids))
  await db.delete(conversations).where(inArray(conversations.patientId, ids))
  await db.delete(notifications).where(inArray(notifications.userId, ids))
  await db.delete(session).where(inArray(session.userId, ids))
  await db.delete(account).where(inArray(account.userId, ids))
  await db.delete(userTable).where(inArray(userTable.id, ids))

  revalidatePath("/admin/pacientes")
  revalidatePath("/admin")
  return { ok: true, deleted: ids.length }
}

/**
 * Borra pacientes "colgados": creados hace más de 24 h pero sin ninguna cita
 * confirmada. Sirve como limpieza de seguridad por si algún flujo antiguo dejó
 * cuentas a medias (el flujo actual no crea la cuenta antes del pago).
 */
export async function purgeOrphanedPatients() {
  await requireAdmin()

  // Pacientes que SÍ tienen al menos una cita.
  const withAppointment = await db
    .selectDistinct({ patientId: appointments.patientId })
    .from(appointments)

  const withApptIds = withAppointment.map((r) => r.patientId)

  // Cutoff: creados hace más de 24 h para no borrar recién llegados.
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000)

  const orphans = await db
    .select({ id: userTable.id })
    .from(userTable)
    .where(
      sql`${userTable.role} = 'patient'
        AND ${userTable.createdAt} < ${cutoff}
        ${withApptIds.length ? sql`AND ${userTable.id} NOT IN (${sql.join(withApptIds.map((id) => sql`${id}`), sql`, `)})` : sql``}`,
    )

  const ids = orphans.map((o) => o.id)
  if (!ids.length) return { ok: true, deleted: 0 }

  await db.delete(messages).where(inArray(messages.senderId, ids))
  await db.delete(prescriptions).where(inArray(prescriptions.patientId, ids))
  await db.delete(subscriptions).where(inArray(subscriptions.patientId, ids))
  await db.delete(conversations).where(inArray(conversations.patientId, ids))
  await db.delete(notifications).where(inArray(notifications.userId, ids))
  await db.delete(session).where(inArray(session.userId, ids))
  await db.delete(account).where(inArray(account.userId, ids))
  await db.delete(userTable).where(inArray(userTable.id, ids))

  revalidatePath("/admin/pacientes")
  revalidatePath("/admin")
  return { ok: true, deleted: ids.length }
}

/** Cambia el flag de entorno (dev vs prod) de un médico. */
export async function setDoctorDevOnly(doctorId: string, isDevOnly: boolean) {
  await requireAdmin()
  await db
    .update(doctorProfiles)
    .set({ isDevOnly, updatedAt: new Date() })
    .where(eq(doctorProfiles.userId, doctorId))
  revalidatePath("/admin/clinicas")
  return { ok: true }
}

/** Activa/pausa que un médico acepte nuevos pacientes. */
export async function setDoctorAccepting(doctorId: string, accepting: boolean) {
  await requireAdmin()
  await db
    .update(doctorProfiles)
    .set({ acceptingPatients: accepting, updatedAt: new Date() })
    .where(eq(doctorProfiles.userId, doctorId))
  revalidatePath("/admin/clinicas")
  return { ok: true }
}

/**
 * Elimina por completo una clínica (usuario con rol doctor) y todos sus datos
 * asociados. Bloquea el borrado si tiene suscripciones activas para no dejar
 * pacientes de pago sin médico. Acción irreversible.
 */
export async function deleteClinic(doctorId: string) {
  await requireAdmin()

  // Verificar que es efectivamente una clínica/médico.
  const [target] = await db
    .select({ id: userTable.id, role: userTable.role })
    .from(userTable)
    .where(eq(userTable.id, doctorId))
    .limit(1)
  if (!target || target.role !== "doctor") {
    return { ok: false, error: "La cuenta no existe o no es una clínica." }
  }

  // Salvaguarda: no borrar si tiene suscripciones de pacientes activas.
  const [{ value: activeSubs } = { value: 0 }] = await db
    .select({ value: count() })
    .from(subscriptions)
    .where(and(eq(subscriptions.doctorId, doctorId), inArray(subscriptions.status, ACTIVE_SUB_STATES)))
  if (Number(activeSubs) > 0) {
    return {
      ok: false,
      error:
        "No se puede eliminar: la clínica tiene suscripciones de pacientes activas. Cancélalas o reasígnalas primero.",
    }
  }

  // Borrar mensajes de sus conversaciones (por conversationId).
  const convs = await db
    .select({ id: conversations.id })
    .from(conversations)
    .where(eq(conversations.doctorId, doctorId))
  const convIds = convs.map((c) => c.id)
  if (convIds.length > 0) {
    await db.delete(messages).where(inArray(messages.conversationId, convIds))
  }

  // Borrar el resto de datos asociados a la clínica.
  await db.delete(conversations).where(eq(conversations.doctorId, doctorId))
  await db.delete(appointments).where(eq(appointments.doctorId, doctorId))
  await db.delete(prescriptions).where(eq(prescriptions.doctorId, doctorId))
  await db.delete(subscriptions).where(eq(subscriptions.doctorId, doctorId))
  await db.delete(planOffers).where(eq(planOffers.doctorId, doctorId))
  await db.delete(commissions).where(eq(commissions.doctorId, doctorId))
  await db.delete(doctorNotes).where(eq(doctorNotes.doctorId, doctorId))
  await db.delete(verificationRequests).where(eq(verificationRequests.doctorId, doctorId))
  await db.delete(doctorAvailability).where(eq(doctorAvailability.userId, doctorId))
  await db.delete(availabilityExceptions).where(eq(availabilityExceptions.userId, doctorId))
  await db.delete(notifications).where(eq(notifications.userId, doctorId))
  await db.delete(doctorProfiles).where(eq(doctorProfiles.userId, doctorId))

  // Borrar credenciales/sesiones y, por último, el usuario.
  await db.delete(session).where(eq(session.userId, doctorId))
  await db.delete(account).where(eq(account.userId, doctorId))
  await db.delete(userTable).where(eq(userTable.id, doctorId))

  revalidatePath("/admin/clinicas")
  return { ok: true }
}
