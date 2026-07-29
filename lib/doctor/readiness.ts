import { db } from "@/lib/db"
import { account, doctorAvailability, doctorProfiles } from "@/lib/db/schema"
import { and, eq } from "drizzle-orm"

/**
 * Requisitos que un médico debe cumplir para aparecer en la landing y recibir
 * reservas. Si falta cualquiera de ellos, sus huecos NO se publican.
 */
export interface DoctorReadiness {
  /** Stripe Connect operativo: puede cobrar y recibir transferencias. */
  payments: boolean
  /** Tiene al menos una franja horaria configurada. */
  availability: boolean
  /** Ha enlazado Google (Calendar/Meet) para generar las videollamadas. */
  googleMeet: boolean
  /** Acepta pacientes nuevos (interruptor manual del médico). */
  acceptingPatients: boolean
  /** Cumple TODOS los requisitos. */
  ready: boolean
}

/** Calcula el estado de preparación de un médico a partir de su userId. */
export async function getDoctorReadiness(userId: string): Promise<DoctorReadiness> {
  const [[profile], [availabilityRow], [googleRow]] = await Promise.all([
    db
      .select({
        chargesEnabled: doctorProfiles.chargesEnabled,
        payoutsEnabled: doctorProfiles.payoutsEnabled,
        acceptingPatients: doctorProfiles.acceptingPatients,
      })
      .from(doctorProfiles)
      .where(eq(doctorProfiles.userId, userId))
      .limit(1),
    db
      .select({ id: doctorAvailability.id })
      .from(doctorAvailability)
      .where(eq(doctorAvailability.userId, userId))
      .limit(1),
    db
      .select({ id: account.id })
      .from(account)
      .where(and(eq(account.userId, userId), eq(account.providerId, "google")))
      .limit(1),
  ])

  const payments = Boolean(profile?.chargesEnabled && profile?.payoutsEnabled)
  const availability = Boolean(availabilityRow)
  const googleMeet = Boolean(googleRow)
  const acceptingPatients = Boolean(profile?.acceptingPatients)

  return {
    payments,
    availability,
    googleMeet,
    acceptingPatients,
    ready: payments && availability && googleMeet && acceptingPatients,
  }
}
