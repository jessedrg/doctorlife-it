"use server"

import { db } from "@/lib/db"
import { doctorProfiles } from "@/lib/db/schema"
import { getSessionUser } from "@/lib/session"
import { stripe } from "@/lib/stripe"
import { missingClinicFields, clinicDataComplete } from "@/lib/clinic"
import { getRequestBaseUrl } from "@/lib/base-url"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

/**
 * Acciones de gestión de la PROPIA clínica (cuenta de tipo médico). Cada clínica
 * es su comerciante de liquidación en Stripe Connect y gestiona sus datos
 * fiscales/sanitarios desde su portal. Scope: el médico autenticado.
 */
async function requireDoctor() {
  const user = await getSessionUser()
  if (!user || user.role !== "doctor") throw new Error("Unauthorized")
  return user
}

/** Devuelve el perfil de la clínica del médico, creándolo en blanco si no existe. */
async function getMyProfile(userId: string, name: string) {
  const [existing] = await db
    .select()
    .from(doctorProfiles)
    .where(eq(doctorProfiles.userId, userId))
    .limit(1)
  if (existing) return existing
  const [created] = await db
    .insert(doctorProfiles)
    .values({ userId, fullName: name })
    .returning()
  return created
}

export type ClinicStatus = {
  id: number
  name: string
  taxId: string | null
  addressLine: string | null
  city: string | null
  postalCode: string | null
  province: string | null
  healthRegistryNumber: string | null
  medicalDirectorName: string | null
  medicalDirectorLicense: string | null
  billingEmail: string | null
  billingPhone: string | null
  dataProtectionContact: string | null
  stripeAccountId: string | null
  stripeOnboarded: boolean
  chargesEnabled: boolean
  payoutsEnabled: boolean
  /** Datos obligatorios de centro sanitario completos. */
  dataComplete: boolean
  /** Campos obligatorios que faltan por rellenar. */
  missingFields: string[]
  /** Puede cobrar actos médicos ahora mismo (Stripe listo + datos completos). */
  ready: boolean
}

/** Estado actual de la clínica del médico para su portal. */
export async function getClinicStatus(): Promise<ClinicStatus> {
  const me = await requireDoctor()
  const p = await getMyProfile(me.id, me.name)
  const missing = missingClinicFields(p)
  const complete = missing.length === 0
  return {
    id: p.id,
    name: p.clinicName ?? "",
    taxId: p.taxId,
    addressLine: p.addressLine,
    city: p.city,
    postalCode: p.postalCode,
    province: p.province,
    healthRegistryNumber: p.healthRegistryNumber,
    medicalDirectorName: p.medicalDirectorName,
    medicalDirectorLicense: p.medicalDirectorLicense,
    billingEmail: p.billingEmail,
    billingPhone: p.billingPhone,
    dataProtectionContact: p.dataProtectionContact,
    stripeAccountId: p.stripeAccountId,
    stripeOnboarded: p.stripeOnboarded,
    chargesEnabled: p.chargesEnabled,
    payoutsEnabled: p.payoutsEnabled,
    dataComplete: complete,
    missingFields: missing as string[],
    ready: Boolean(p.stripeAccountId && p.chargesEnabled && complete),
  }
}

/** Actualiza todos los datos fiscales y sanitarios de la clínica. */
export async function updateClinicDetails(input: {
  name?: string
  taxId?: string
  addressLine?: string
  city?: string
  postalCode?: string
  province?: string
  healthRegistryNumber?: string
  medicalDirectorName?: string
  medicalDirectorLicense?: string
  billingEmail?: string
  billingPhone?: string
  dataProtectionContact?: string
}): Promise<{ ok: true; dataComplete: boolean } | { error: string }> {
  const me = await requireDoctor()
  const p = await getMyProfile(me.id, me.name)
  const clean = (v?: string) => {
    const t = v?.trim()
    return t ? t : null
  }
  const updated = {
    clinicName: clean(input.name),
    taxId: clean(input.taxId),
    addressLine: clean(input.addressLine),
    city: clean(input.city),
    postalCode: clean(input.postalCode),
    province: clean(input.province),
    healthRegistryNumber: clean(input.healthRegistryNumber),
    medicalDirectorName: clean(input.medicalDirectorName),
    medicalDirectorLicense: clean(input.medicalDirectorLicense),
    billingEmail: clean(input.billingEmail),
    billingPhone: clean(input.billingPhone),
    dataProtectionContact: clean(input.dataProtectionContact),
  }
  await db
    .update(doctorProfiles)
    .set({ ...updated, updatedAt: new Date() })
    .where(eq(doctorProfiles.userId, me.id))
  revalidatePath("/clinica/pagos")
  return { ok: true, dataComplete: clinicDataComplete({ ...p, ...updated }) }
}

/**
 * Crea (si hace falta) la cuenta Stripe Connect de la clínica y devuelve un
 * enlace de onboarding alojado por Stripe. La clínica es el comerciante de
 * liquidación: cobra el acto médico y DoctorLife retiene su comisión.
 */
export async function startClinicStripeOnboarding(): Promise<
  { url: string } | { error: string }
> {
  const me = await requireDoctor()
  const profile = await getMyProfile(me.id, me.name)

  try {
    let accountId = profile.stripeAccountId

    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        country: "ES",
        email: me.email,
        business_type: "company",
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_profile: {
          mcc: "8062", // hospitals / clínicas
          name: profile.clinicName || profile.fullName,
        },
        metadata: { userId: me.id },
      })
      accountId = account.id
      await db
        .update(doctorProfiles)
        .set({ stripeAccountId: accountId, updatedAt: new Date() })
        .where(eq(doctorProfiles.userId, me.id))
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
    if (raw.includes("signed up for Connect") || raw.includes("Connect")) {
      return {
        error:
          "Stripe Connect aún no está activado en la cuenta de la plataforma. Actívalo en el panel de Stripe (Connect → Empezar) y vuelve a intentarlo.",
      }
    }
    return { error: raw }
  }
}

/** Relee el estado de la cuenta Connect en Stripe y lo sincroniza en la BD. */
export async function refreshClinicStripeStatus(): Promise<
  { ok: true } | { error: string }
> {
  const me = await requireDoctor()
  const profile = await getMyProfile(me.id, me.name)
  if (!profile.stripeAccountId) return { error: "La clínica no tiene cuenta de Stripe." }

  try {
    const acct = await stripe.accounts.retrieve(profile.stripeAccountId)
    await db
      .update(doctorProfiles)
      .set({
        chargesEnabled: Boolean(acct.charges_enabled),
        payoutsEnabled: Boolean(acct.payouts_enabled),
        stripeOnboarded: Boolean(acct.details_submitted),
        updatedAt: new Date(),
      })
      .where(eq(doctorProfiles.userId, me.id))
    revalidatePath("/clinica/pagos")
    return { ok: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "No se pudo comprobar el estado." }
  }
}
