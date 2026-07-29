"use server"

import { db } from "@/lib/db"
import {
  doctorProfiles,
  user as userTable,
  appointments,
  subscriptions,
  leads,
  progressEntries,
  doctorNotes,
  commissions,
  prescriptions,
} from "@/lib/db/schema"
import { stripe } from "@/lib/stripe"
import { getRequestBaseUrl } from "@/lib/base-url"
import { getSessionUser } from "@/lib/session"
import { and, desc, eq, sql } from "drizzle-orm"
import { CONTRAINDICATIONS, COMORBIDITIES } from "@/lib/eligibility"
import { put } from "@vercel/blob"
import { revalidatePath } from "next/cache"

async function requireDoctor() {
  const user = await getSessionUser()
  if (!user || user.role !== "doctor") throw new Error("Unauthorized")
  return user
}

/** Returns the current doctor's profile, creating a blank one on first access. */
export async function getMyDoctorProfile() {
  const user = await requireDoctor()
  const [existing] = await db
    .select()
    .from(doctorProfiles)
    .where(eq(doctorProfiles.userId, user.id))
    .limit(1)

  if (existing) return existing

  const [created] = await db
    .insert(doctorProfiles)
    .values({ userId: user.id, fullName: user.name })
    .returning()
  return created
}

/** Perfil del médico + su foto (user.image), para la página "Mi cuenta". */
export async function getMyDoctorProfileWithImage() {
  const me = await requireDoctor()
  const profile = await getMyDoctorProfile()
  const [u] = await db
    .select({ image: userTable.image, email: userTable.email })
    .from(userTable)
    .where(eq(userTable.id, me.id))
    .limit(1)
  return { ...profile, image: u?.image ?? null, email: u?.email ?? me.email }
}

export async function updateDoctorProfile(input: {
  fullName: string
  specialty?: string
  licenseNumber?: string
  bio?: string
  acceptingPatients?: boolean
  maxPatients?: number | null
}) {
  const user = await requireDoctor()
  const fullName = input.fullName.trim()
  if (!fullName) return { ok: false as const, error: "El nombre es obligatorio." }

  // Validate maxPatients: must be a positive integer or null (no limit).
  const maxPatients =
    input.maxPatients != null && input.maxPatients > 0
      ? Math.round(input.maxPatients)
      : null

  await db
    .update(doctorProfiles)
    .set({
      fullName,
      specialty: input.specialty?.trim() || null,
      licenseNumber: input.licenseNumber?.trim() || null,
      bio: input.bio?.trim() || null,
      acceptingPatients: input.acceptingPatients ?? true,
      maxPatients,
      updatedAt: new Date(),
    })
    .where(eq(doctorProfiles.userId, user.id))

  // Sincroniza el nombre visible en la cuenta para que coincida en el chat.
  await db
    .update(userTable)
    .set({ name: fullName, updatedAt: new Date() })
    .where(eq(userTable.id, user.id))

  revalidatePath("/clinica")
  revalidatePath("/clinica/cuenta")
  return { ok: true as const }
}

/** Sube la foto de perfil del médico a Blob (público) y la guarda en user.image. */
export async function uploadDoctorAvatar(formData: FormData) {
  const me = await requireDoctor()
  const file = formData.get("file")
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false as const, error: "Selecciona una imagen." }
  }
  if (!file.type.startsWith("image/")) {
    return { ok: false as const, error: "El archivo debe ser una imagen." }
  }
  if (file.size > 5 * 1024 * 1024) {
    return { ok: false as const, error: "La imagen no puede superar 5 MB." }
  }

  const ext = file.type.split("/")[1]?.replace("jpeg", "jpg") || "png"
  const blob = await put(`avatars/${me.id}.${ext}`, file, {
    access: "public",
    contentType: file.type,
    addRandomSuffix: true,
  })

  await db
    .update(userTable)
    .set({ image: blob.url, updatedAt: new Date() })
    .where(eq(userTable.id, me.id))

  revalidatePath("/clinica/cuenta")
  revalidatePath("/clinica/chat")
  return { ok: true as const, url: blob.url }
}

export type DoctorPatient = {
  id: string
  name: string
  email: string
  image: string | null
  subscriptionStatus: string | null
  totalAppointments: number
  lastVisit: Date | null
  nextVisit: Date | null
}

/** Todos los pacientes del médico (con cita previa) + su estado. */
export async function getMyPatients(): Promise<DoctorPatient[]> {
  const me = await requireDoctor()
  const now = new Date()

  // Pacientes distintos con los que el médico ha tenido alguna cita (no pendiente de pago).
  const base = await db
    .select({
      id: userTable.id,
      name: userTable.name,
      email: userTable.email,
      image: userTable.image,
      total: sql<number>`count(${appointments.id})`,
      lastVisit: sql<Date | null>`max(case when ${appointments.startsAt} <= ${now} then ${appointments.startsAt} end)`,
      nextVisit: sql<Date | null>`min(case when ${appointments.startsAt} > ${now} and ${appointments.status} <> 'cancelled' then ${appointments.startsAt} end)`,
    })
    .from(appointments)
    .innerJoin(userTable, eq(userTable.id, appointments.patientId))
    .where(and(eq(appointments.doctorId, me.id), sql`${appointments.status} <> 'pending_payment'`))
    .groupBy(userTable.id, userTable.name, userTable.email, userTable.image)

  // Estado de suscripción por paciente con este médico.
  const subs = await db
    .select({ patientId: subscriptions.patientId, status: subscriptions.status })
    .from(subscriptions)
    .where(eq(subscriptions.doctorId, me.id))
    .orderBy(desc(subscriptions.id))

  const subByPatient = new Map<string, string>()
  for (const s of subs) {
    if (!subByPatient.has(s.patientId)) subByPatient.set(s.patientId, s.status)
  }

  return base
    .map((p) => ({
      id: p.id,
      name: p.name,
      email: p.email,
      image: p.image ?? null,
      subscriptionStatus: subByPatient.get(p.id) ?? null,
      totalAppointments: Number(p.total),
      lastVisit: p.lastVisit ? new Date(p.lastVisit) : null,
      nextVisit: p.nextVisit ? new Date(p.nextVisit) : null,
    }))
    .sort((a, b) => {
      // Próxima visita primero; si no, por última visita reciente.
      const an = a.nextVisit?.getTime() ?? Infinity
      const bn = b.nextVisit?.getTime() ?? Infinity
      if (an !== bn) return an - bn
      return (b.lastVisit?.getTime() ?? 0) - (a.lastVisit?.getTime() ?? 0)
    })
}

/**
 * Creates (if needed) a Stripe Connect Express account for a destination-charge
 * marketplace (the platform stays liable and collects an application fee), then
 * returns a hosted onboarding link.
 */
export async function startStripeOnboarding(): Promise<
  { url: string; error?: never } | { url?: never; error: string }
> {
  const user = await requireDoctor()
  const profile = await getMyDoctorProfile()

  try {
    let accountId = profile.stripeAccountId

    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        country: "ES",
        email: user.email,
        business_type: "individual",
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_profile: {
          mcc: "8011", // doctors / physicians
          name: profile.fullName,
        },
        metadata: { userId: user.id },
      })
      accountId = account.id
      await db
        .update(doctorProfiles)
        .set({ stripeAccountId: accountId, updatedAt: new Date() })
        .where(eq(doctorProfiles.userId, user.id))
    }

    const baseUrl = await getRequestBaseUrl()
    const link = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${baseUrl}/clinica/pagos?refresh=1`,
      return_url: `${baseUrl}/clinica/pagos?done=1`,
      type: "account_onboarding",
    })

    return { url: link.url }
  } catch (e) {
    const raw = e instanceof Error ? e.message : String(e)
    // Connect must be enabled on the platform Stripe account before any
    // connected account can be created.
    if (raw.includes("signed up for Connect") || raw.includes("Connect")) {
      return {
        error:
          "Stripe Connect aún no está activado en la cuenta de la plataforma. Actívalo en el panel de Stripe (Connect → Empezar) y vuelve a intentarlo.",
      }
    }
    return { error: raw }
  }
}

export type DoctorTxnCategory = "subscription" | "consultation" | "payout" | "other"

export type DoctorTransaction = {
  id: string
  category: DoctorTxnCategory
  description: string
  amountCents: number
  netCents: number
  feeCents: number
  currency: string
  status: string
  created: number
}

export type DoctorEarnings = {
  available: boolean
  transactions: DoctorTransaction[]
  totalNetCents: number
  subscriptionCount: number
  consultationCount: number
}

/** Clasifica un balance transaction de Stripe en una categoría de DoctorLife. */
function categorizeTxn(type: string): DoctorTxnCategory {
  // Las suscripciones llegan al médico como "transfer" (reparto de 25 € mensuales).
  if (type === "transfer" || type === "payment_transfer") return "subscription"
  // La primera consulta es un destination charge → "payment"/"charge".
  if (type === "payment" || type === "charge") return "consultation"
  // Retiradas al banco del médico.
  if (type === "payout" || type === "payout_cancel") return "payout"
  return "other"
}

const TXN_LABELS: Record<DoctorTxnCategory, string> = {
  subscription: "Reparto de suscripción",
  consultation: "Primera consulta",
  payout: "Retirada a tu banco",
  other: "Movimiento",
}

/**
 * Lee los últimos movimientos del saldo de la cuenta Connect del médico.
 * Incluye los repartos de suscripción (transfers), las primeras consultas
 * (destination charges) y las retiradas a su banco (payouts).
 */
export async function getDoctorTransactions(limit = 50): Promise<DoctorEarnings> {
  const profile = await getMyDoctorProfile()
  const empty: DoctorEarnings = {
    available: false,
    transactions: [],
    totalNetCents: 0,
    subscriptionCount: 0,
    consultationCount: 0,
  }
  if (!profile.stripeAccountId) return empty

  try {
    const list = await stripe.balanceTransactions.list(
      { limit },
      { stripeAccount: profile.stripeAccountId },
    )

    const transactions: DoctorTransaction[] = list.data.map((t) => {
      const category = categorizeTxn(t.type)
      return {
        id: t.id,
        category,
        description: t.description || TXN_LABELS[category],
        amountCents: t.amount,
        netCents: t.net,
        feeCents: t.fee,
        currency: t.currency,
        status: t.status,
        created: t.created,
      }
    })

    return {
      available: true,
      transactions,
      // Suma neta de entradas (excluye retiradas, que son salidas a banco).
      totalNetCents: transactions
        .filter((t) => t.category !== "payout")
        .reduce((sum, t) => sum + t.netCents, 0),
      subscriptionCount: transactions.filter((t) => t.category === "subscription").length,
      consultationCount: transactions.filter((t) => t.category === "consultation").length,
    }
  } catch {
    // Cuenta aún sin actividad o sin permisos de lectura: tratamos como vacío.
    return { ...empty, available: true }
  }
}

/** Re-reads the Stripe account and syncs the onboarding flags into our DB. */
export async function refreshStripeStatus() {
  const user = await requireDoctor()
  const profile = await getMyDoctorProfile()
  if (!profile.stripeAccountId) return profile

  const account = await stripe.accounts.retrieve(profile.stripeAccountId)

  const chargesEnabled = account.charges_enabled ?? false
  const payoutsEnabled = account.payouts_enabled ?? false
  const onboarded = account.details_submitted ?? false

  const [updated] = await db
    .update(doctorProfiles)
    .set({
      chargesEnabled,
      payoutsEnabled,
      stripeOnboarded: onboarded,
      updatedAt: new Date(),
    })
    .where(eq(doctorProfiles.userId, user.id))
    .returning()

  revalidatePath("/clinica")
  revalidatePath("/clinica/pagos")
  return updated
}

/* ───────────────────────────────────────────────────────────
   Suscripciones activas y comisiones del médico (registro en BD).
   ─────────────────────────────────────────────────────────── */

export type DoctorSubscriptionRow = {
  patientName: string
  plan: string
  status: string
  priceCents: number
  currency: string
  currentPeriodEnd: Date | null
  cancelAtPeriodEnd: boolean
}

export type DoctorCommissionRow = {
  id: number
  patientName: string
  kind: "activation" | "renewal"
  amountCents: number
  currency: string
  createdAt: Date
}

export type DoctorBilling = {
  subscriptions: DoctorSubscriptionRow[]
  commissions: DoctorCommissionRow[]
  totalCommissionCents: number
  activeCount: number
  /** Próximos pagos estimados: suscripciones activas ordenadas por fecha de próxima renovación. */
  upcomingPayouts: {
    patientName: string
    renewalDate: Date
    /** Comisión que recibirá el médico en esa renovación (35 €). */
    doctorPayoutCents: number
    currency: string
  }[]
  /** Total estimado del próximo mes de renovaciones. */
  upcomingTotalCents: number
}

/** Suscripciones y actividad de los pacientes del médico. */
export async function getDoctorBilling(): Promise<DoctorBilling> {
  const me = await requireDoctor()

  const subs = await db
    .select({
      patientName: userTable.name,
      plan: subscriptions.plan,
      status: subscriptions.status,
      priceCents: subscriptions.priceCents,
      currency: subscriptions.currency,
      currentPeriodEnd: subscriptions.currentPeriodEnd,
      cancelAtPeriodEnd: subscriptions.cancelAtPeriodEnd,
      createdAt: subscriptions.createdAt,
    })
    .from(subscriptions)
    .leftJoin(userTable, eq(userTable.id, subscriptions.patientId))
    .where(eq(subscriptions.doctorId, me.id))
    .orderBy(desc(subscriptions.createdAt))

  const activeStates = ["active", "trialing", "past_due"]

  // Próximas renovaciones de los pacientes (para contexto del médico). Sin
  // importes de reparto: la clínica gestiona los honorarios fuera de la app.
  const upcomingPayouts = subs
    .filter(
      (s) =>
        activeStates.includes(s.status) &&
        !s.cancelAtPeriodEnd &&
        s.currentPeriodEnd,
    )
    .map((s) => ({
      patientName: s.patientName || "Paciente",
      renewalDate: new Date(s.currentPeriodEnd!),
      doctorPayoutCents: 0,
      currency: s.currency,
    }))
    .sort((a, b) => a.renewalDate.getTime() - b.renewalDate.getTime())

  return {
    subscriptions: subs.map((s) => ({
      patientName: s.patientName || "Paciente",
      plan: s.plan,
      status: s.status,
      priceCents: s.priceCents,
      currency: s.currency,
      currentPeriodEnd: s.currentPeriodEnd ? new Date(s.currentPeriodEnd) : null,
      cancelAtPeriodEnd: s.cancelAtPeriodEnd,
    })),
    commissions: [],
    totalCommissionCents: 0,
    activeCount: subs.filter((s) => activeStates.includes(s.status)).length,
    upcomingPayouts,
    upcomingTotalCents: 0,
  }
}

/* ───────────────────────────────────────────────────────────
   Métricas de inicio del panel del médico.
   ─────────────────────────────────────────────────────────── */

export type DoctorMetrics = {
  totalPatients: number
  activeSubscriptions: number
  appointmentsToday: number
  upcomingAppointments: number
  prescriptionsIssued: number
  totalCommissionCents: number
}

/** Métricas agregadas para la vista de inicio del médico. */
export async function getDoctorMetrics(): Promise<DoctorMetrics> {
  const me = await requireDoctor()
  const now = new Date()
  const startOfDay = new Date(now)
  startOfDay.setHours(0, 0, 0, 0)
  const endOfDay = new Date(startOfDay)
  endOfDay.setDate(endOfDay.getDate() + 1)

  const notPending = sql`${appointments.status} <> 'pending_payment'`
  const notCancelled = sql`${appointments.status} <> 'cancelled'`

  // Pacientes distintos con cita confirmada.
  const [patientsRow] = await db
    .select({ count: sql<number>`count(distinct ${appointments.patientId})` })
    .from(appointments)
    .where(and(eq(appointments.doctorId, me.id), notPending))

  // Citas de hoy (no canceladas).
  const [todayRow] = await db
    .select({ count: sql<number>`count(*)` })
    .from(appointments)
    .where(
      and(
        eq(appointments.doctorId, me.id),
        notPending,
        notCancelled,
        sql`${appointments.startsAt} >= ${startOfDay}`,
        sql`${appointments.startsAt} < ${endOfDay}`,
      ),
    )

  // Próximas citas (a partir de ahora, no canceladas).
  const [upcomingRow] = await db
    .select({ count: sql<number>`count(*)` })
    .from(appointments)
    .where(
      and(
        eq(appointments.doctorId, me.id),
        notPending,
        notCancelled,
        sql`${appointments.startsAt} >= ${now}`,
      ),
    )

  // Suscripciones activas con este médico.
  const [activeSubsRow] = await db
    .select({ count: sql<number>`count(*)` })
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.doctorId, me.id),
        sql`${subscriptions.status} in ('active', 'trialing', 'past_due')`,
      ),
    )

  // Recetas emitidas en total.
  const [rxRow] = await db
    .select({ count: sql<number>`count(*)` })
    .from(prescriptions)
    .where(eq(prescriptions.doctorId, me.id))

  // Total de comisiones registradas.
  const [commRow] = await db
    .select({ total: sql<number>`coalesce(sum(${commissions.amountCents}), 0)` })
    .from(commissions)
    .where(eq(commissions.doctorId, me.id))

  return {
    totalPatients: Number(patientsRow?.count ?? 0),
    activeSubscriptions: Number(activeSubsRow?.count ?? 0),
    appointmentsToday: Number(todayRow?.count ?? 0),
    upcomingAppointments: Number(upcomingRow?.count ?? 0),
    prescriptionsIssued: Number(rxRow?.count ?? 0),
    totalCommissionCents: Number(commRow?.total ?? 0),
  }
}

/* ───────────────────────────────────────────────────────────
   Capacidad del médico: pacientes activos vs. límite.
   ─────────────────────────────────────────────────────────── */

export type DoctorCapacity = {
  activeCount: number
  maxPatients: number | null
  /** true cuando activeCount >= maxPatients (y maxPatients no es null). */
  atCapacity: boolean
  /** true cuando activeCount >= maxPatients * 0.9 pero no atCapacity. */
  nearCapacity: boolean
}

/**
 * Devuelve cuántos pacientes activos tiene el médico y si ha alcanzado
 * (o se acerca a) el límite que él mismo ha configurado.
 */
export async function getDoctorCapacity(): Promise<DoctorCapacity> {
  const me = await requireDoctor()
  const profile = await getMyDoctorProfile()

  const [row] = await db
    .select({ count: sql<number>`count(*)` })
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.doctorId, me.id),
        sql`${subscriptions.status} in ('active', 'trialing', 'past_due')`,
      ),
    )

  const activeCount = Number(row?.count ?? 0)
  const maxPatients = profile.maxPatients ?? null

  return {
    activeCount,
    maxPatients,
    atCapacity: maxPatients !== null && activeCount >= maxPatients,
    nearCapacity:
      maxPatients !== null &&
      activeCount < maxPatients &&
      activeCount >= Math.floor(maxPatients * 0.9),
  }
}

/* ───────────────────────────────────────────────────────────
   Ficha de paciente: info clínica (lead), progreso y notas.
   ─────────────────────────────────────────────────────────── */

/** Verifica que el médico tiene (o tuvo) una cita con este paciente. */
async function assertDoctorOwnsPatient(doctorId: string, patientId: string) {
  const [row] = await db
    .select({ id: appointments.id })
    .from(appointments)
    .where(
      and(
        eq(appointments.doctorId, doctorId),
        eq(appointments.patientId, patientId),
        sql`${appointments.status} <> 'pending_payment'`,
      ),
    )
    .limit(1)
  if (!row) throw new Error("Unauthorized")
}

function labelsFor(ids: string[], source: { id: string; label: string }[]) {
  return ids
    .map((id) => source.find((s) => s.id === id)?.label)
    .filter((x): x is string => Boolean(x))
}

function parseIds(json: string | null): string[] {
  if (!json) return []
  try {
    const v = JSON.parse(json)
    return Array.isArray(v) ? v.map(String) : []
  } catch {
    return []
  }
}

export type PatientClinical = {
  age: number | null
  sex: string | null
  heightCm: number | null
  weightKg: number | null
  bmi: string | null
  goal: string | null
  glp1Experience: string | null
  timeline: string | null
  eligibility: string | null
  eligibilityReasons: string[]
  comorbidities: string[]
  contraindications: string[]
}

export type PatientProgressRow = {
  id: number
  weightKg: number | null
  waistCm: number | null
  dose: string | null
  sideEffects: string | null
  note: string | null
  createdAt: Date
}

export type PatientNote = {
  id: number
  body: string
  visibility: string
  createdAt: Date
}

export type PatientPrescriptionRow = {
  id: number
  medication: string
  dosage: string
  instructions: string | null
  issuedAt: Date
}

export type PatientDetail = {
  clinical: PatientClinical | null
  progress: PatientProgressRow[]
  notes: PatientNote[]
  prescriptions: PatientPrescriptionRow[]
}

/** Detalle completo de un paciente para la tarjeta expandible del médico. */
export async function getPatientDetail(patientId: string): Promise<PatientDetail> {
  const me = await requireDoctor()
  await assertDoctorOwnsPatient(me.id, patientId)

  // Info clínica: lead más reciente emparejado por email del paciente.
  const [u] = await db
    .select({ email: userTable.email })
    .from(userTable)
    .where(eq(userTable.id, patientId))
    .limit(1)

  let clinical: PatientClinical | null = null
  if (u?.email) {
    const [lead] = await db
      .select()
      .from(leads)
      .where(eq(leads.email, u.email))
      .orderBy(desc(leads.createdAt))
      .limit(1)
    if (lead) {
      clinical = {
        age: lead.age ?? null,
        sex: lead.sex ?? null,
        heightCm: lead.heightCm ?? null,
        weightKg: lead.weightKg ?? null,
        bmi: lead.bmi != null ? String(lead.bmi) : null,
        goal: lead.goal ?? null,
        glp1Experience: lead.glp1Experience ?? null,
        timeline: lead.timeline ?? null,
        eligibility: lead.eligibility ?? null,
        eligibilityReasons: parseIds(lead.eligibilityReason ?? null),
        comorbidities: labelsFor(parseIds(lead.comorbidities ?? null), COMORBIDITIES),
        contraindications: labelsFor(parseIds(lead.contraindications ?? null), CONTRAINDICATIONS),
      }
    }
  }

  const progress = await db
    .select()
    .from(progressEntries)
    .where(eq(progressEntries.patientId, patientId))
    .orderBy(desc(progressEntries.createdAt))
    .limit(40)

  const notes = await db
    .select()
    .from(doctorNotes)
    .where(eq(doctorNotes.patientId, patientId))
    .orderBy(desc(doctorNotes.createdAt))
    .limit(50)

  const rx = await db
    .select({
      id: prescriptions.id,
      medication: prescriptions.medication,
      dosage: prescriptions.dosage,
      instructions: prescriptions.instructions,
      issuedAt: prescriptions.issuedAt,
    })
    .from(prescriptions)
    .where(and(eq(prescriptions.doctorId, me.id), eq(prescriptions.patientId, patientId)))
    .orderBy(desc(prescriptions.issuedAt))
    .limit(50)

  return {
    clinical,
    prescriptions: rx.map((r) => ({
      id: r.id,
      medication: r.medication,
      dosage: r.dosage,
      instructions: r.instructions,
      issuedAt: new Date(r.issuedAt),
    })),
    progress: progress
      .map((p) => ({
        id: p.id,
        weightKg: p.weightKg != null ? Number(p.weightKg) : null,
        waistCm: p.waistCm != null ? Number(p.waistCm) : null,
        dose: p.dose,
        sideEffects: p.sideEffects,
        note: p.note,
        createdAt: new Date(p.createdAt),
      }))
      .reverse(),
    notes: notes.map((n) => ({
      id: n.id,
      body: n.body,
      visibility: n.visibility,
      createdAt: new Date(n.createdAt),
    })),
  }
}

export async function addDoctorNote(input: {
  patientId: string
  body: string
  visibility: "internal" | "shared"
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const me = await requireDoctor()
  const body = input.body.trim()
  if (!body) return { ok: false, error: "La nota no puede estar vacía." }
  try {
    await assertDoctorOwnsPatient(me.id, input.patientId)
    await db.insert(doctorNotes).values({
      patientId: input.patientId,
      doctorId: me.id,
      body,
      visibility: input.visibility === "shared" ? "shared" : "internal",
    })
    revalidatePath("/clinica/pacientes")
    return { ok: true }
  } catch (err) {
    console.log("[v0] addDoctorNote error:", err instanceof Error ? err.message : err)
    return { ok: false, error: "No hemos podido guardar la nota." }
  }
}

export async function deleteDoctorNote(
  noteId: number,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const me = await requireDoctor()
  try {
    // Solo el médico autor puede borrar su nota.
    await db
      .delete(doctorNotes)
      .where(and(eq(doctorNotes.id, noteId), eq(doctorNotes.doctorId, me.id)))
    revalidatePath("/clinica/pacientes")
    return { ok: true }
  } catch (err) {
    console.log("[v0] deleteDoctorNote error:", err instanceof Error ? err.message : err)
    return { ok: false, error: "No hemos podido eliminar la nota." }
  }
}
