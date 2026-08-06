import { db } from "@/lib/db"
import { doctorAvailability, doctorProfiles } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

/**
 * Requisitos que un médico debe cumplir para aparecer en la landing y recibir
 * reservas. Si falta cualquiera de ellos, sus huecos NO se publican.
 * Las videollamadas se generan automáticamente (Daily.co), por lo que el médico
 * no necesita conectar ninguna cuenta externa.
 */
export interface DoctorReadiness {
  /** Stripe Connect operativo: puede cobrar y recibir transferencias. */
  payments: boolean
  /** Tiene al menos una franja horaria configurada. */
  availability: boolean
  /** Acepta pacientes nuevos (interruptor manual del médico). */
  acceptingPatients: boolean
  /** Cumple TODOS los requisitos. */
  ready: boolean
}

/** Calcula el estado de preparación de un médico a partir de su userId. */
export async function getDoctorReadiness(userId: string): Promise<DoctorReadiness> {
  const [[profile], [availabilityRow]] = await Promise.all([
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
  ])

  const payments = Boolean(profile?.chargesEnabled && profile?.payoutsEnabled)
  const availability = Boolean(availabilityRow)
  const acceptingPatients = Boolean(profile?.acceptingPatients)

  return {
    payments,
    availability,
    acceptingPatients,
    ready: payments && availability && acceptingPatients,
  }
}
