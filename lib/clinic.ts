import "server-only"

import { db } from "@/lib/db"
import { doctorProfiles, type DoctorProfile } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

/**
 * En DoctorLife cada CLÍNICA es una cuenta de tipo médico (`doctor_profiles`):
 * es el comerciante de liquidación de sus propios actos médicos en Stripe
 * Connect y gestiona sus propios datos fiscales/sanitarios. No hay una cuenta
 * central de clínica: cada clínica cobra en su propia cuenta Connect.
 */

/**
 * Campos fiscales y sanitarios obligatorios que la clínica debe rellenar para
 * poder OPERAR y facturar como centro sanitario. Se usan tanto para el bloqueo
 * de cobros como para indicar en el panel qué falta.
 */
export const REQUIRED_CLINIC_FIELDS = [
  "clinicName",
  "taxId",
  "addressLine",
  "city",
  "postalCode",
  "province",
  "healthRegistryNumber",
  "medicalDirectorName",
  "medicalDirectorLicense",
  "billingEmail",
  "dataProtectionContact",
] as const satisfies readonly (keyof DoctorProfile)[]

/** Devuelve la lista de campos obligatorios que faltan por rellenar. */
export function missingClinicFields(profile: DoctorProfile): (keyof DoctorProfile)[] {
  return REQUIRED_CLINIC_FIELDS.filter((f) => {
    const v = profile[f]
    return v == null || String(v).trim() === ""
  })
}

/** ¿Están completos todos los datos obligatorios para operar/facturar? */
export function clinicDataComplete(profile: DoctorProfile): boolean {
  return missingClinicFields(profile).length === 0
}

export type ClinicChargeContext = {
  /** Cuenta Connect de la clínica (médico). */
  accountId: string
  /** Puede aceptar cargos (onboarding completo + datos completos). */
  ready: boolean
}

/**
 * Contexto para enrutar un cargo a la clínica del médico indicado. Devuelve
 * `null` si NO se puede cobrar todavía, y en ese caso NO se debe cobrar (evita
 * que el dinero caiga en la plataforma como merchant of record). Requiere:
 *  1. Cuenta Connect creada (`stripeAccountId`).
 *  2. Stripe habilitado para cargos (`chargesEnabled`).
 *  3. Datos obligatorios de centro sanitario completos.
 */
export async function getDoctorChargeContext(
  doctorId: string,
): Promise<ClinicChargeContext | null> {
  const [profile] = await db
    .select()
    .from(doctorProfiles)
    .where(eq(doctorProfiles.userId, doctorId))
    .limit(1)
  if (!profile) return null
  if (!profile.stripeAccountId || !profile.chargesEnabled) return null
  if (!clinicDataComplete(profile)) return null
  return { accountId: profile.stripeAccountId, ready: true }
}
