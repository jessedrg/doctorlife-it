"use server"

import { db } from "@/lib/db"
import {
  verificationRequests,
  appointments,
  user as userTable,
  doctorProfiles,
  type VerificationRequest,
} from "@/lib/db/schema"

export type VerificationRow = VerificationRequest
import { getSessionUser, requireRole } from "@/lib/session"
import { sendVerificationRequestedEmail } from "@/lib/email"
import { del } from "@vercel/blob"
import { and, desc, eq, inArray } from "drizzle-orm"
import { revalidatePath } from "next/cache"

/** Estados que aún bloquean la activación de la suscripción. */
const BLOCKING = ["pending", "submitted", "rejected"] as const

/**
 * ¿El paciente tiene alguna verificación pendiente de aprobar?
 * Mientras la haya, no puede activar el tratamiento.
 */
export async function hasPendingVerification(patientId: string): Promise<boolean> {
  const [row] = await db
    .select({ id: verificationRequests.id })
    .from(verificationRequests)
    .where(
      and(
        eq(verificationRequests.patientId, patientId),
        inArray(verificationRequests.status, [...BLOCKING]),
      ),
    )
    .limit(1)
  return Boolean(row)
}

/** Verifica que el médico tiene (o tuvo) una cita con este paciente. */
async function assertDoctorOwnsPatient(doctorId: string, patientId: string) {
  const [row] = await db
    .select({ id: appointments.id })
    .from(appointments)
    .where(and(eq(appointments.doctorId, doctorId), eq(appointments.patientId, patientId)))
    .limit(1)
  if (!row) throw new Error("Unauthorized")
}

/** El médico solicita verificación adicional a un paciente. */
export async function requestVerification(input: {
  patientId: string
  message: string
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const me = await requireRole("doctor")
  const message = input.message.trim()
  if (!message) return { ok: false, error: "Describe qué necesitas que envíe el paciente." }

  try {
    await assertDoctorOwnsPatient(me.id, input.patientId)

    // Evita duplicar solicitudes activas.
    const [open] = await db
      .select({ id: verificationRequests.id })
      .from(verificationRequests)
      .where(
        and(
          eq(verificationRequests.patientId, input.patientId),
          inArray(verificationRequests.status, ["pending", "submitted"]),
        ),
      )
      .limit(1)
    if (open) {
      return { ok: false, error: "Ya hay una verificación en curso para este paciente." }
    }

    await db.insert(verificationRequests).values({
      patientId: input.patientId,
      doctorId: me.id,
      message,
      status: "pending",
    })

    // Aviso por correo al paciente.
    const [pat] = await db
      .select({ email: userTable.email, name: userTable.name })
      .from(userTable)
      .where(eq(userTable.id, input.patientId))
      .limit(1)
    const [doc] = await db
      .select({ fullName: doctorProfiles.fullName })
      .from(doctorProfiles)
      .where(eq(doctorProfiles.userId, me.id))
      .limit(1)
    if (pat?.email) {
      try {
        await sendVerificationRequestedEmail({
          to: pat.email,
          name: pat.name ?? "",
          doctorName: doc?.fullName ?? null,
          message,
        })
      } catch (e) {
        console.log("[v0] verification email failed:", e instanceof Error ? e.message : e)
      }
    }

    revalidatePath("/clinica/pacientes")
    revalidatePath("/portal")
    return { ok: true }
  } catch (err) {
    console.log("[v0] requestVerification error:", err instanceof Error ? err.message : err)
    return { ok: false, error: "No se pudo crear la solicitud." }
  }
}

/** El médico aprueba o rechaza una verificación ya enviada. */
export async function reviewVerification(input: {
  id: number
  decision: "approved" | "rejected"
  note?: string
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const me = await requireRole("doctor")
  try {
    const [row] = await db
      .select()
      .from(verificationRequests)
      .where(eq(verificationRequests.id, input.id))
      .limit(1)
    if (!row || row.doctorId !== me.id) return { ok: false, error: "Solicitud no encontrada." }
    if (row.status !== "submitted") {
      return { ok: false, error: "Esta verificación no está pendiente de revisión." }
    }

    await db
      .update(verificationRequests)
      .set({
        status: input.decision,
        reviewNote: input.note?.trim() || null,
        reviewedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(verificationRequests.id, input.id))

    revalidatePath("/clinica/pacientes")
    revalidatePath("/portal")
    return { ok: true }
  } catch (err) {
    console.log("[v0] reviewVerification error:", err instanceof Error ? err.message : err)
    return { ok: false, error: "No se pudo guardar la decisión." }
  }
}

/** Verificaciones de un paciente (vista del médico en la ficha). */
export async function getPatientVerifications(patientId: string) {
  const me = await requireRole("doctor")
  await assertDoctorOwnsPatient(me.id, patientId)
  return db
    .select()
    .from(verificationRequests)
    .where(eq(verificationRequests.patientId, patientId))
    .orderBy(desc(verificationRequests.createdAt))
}

/** Verificaciones del paciente autenticado (vista del portal). */
export async function getMyVerifications() {
  const me = await getSessionUser()
  if (!me) return []
  return db
    .select({
      id: verificationRequests.id,
      message: verificationRequests.message,
      status: verificationRequests.status,
      fileName: verificationRequests.fileName,
      reviewNote: verificationRequests.reviewNote,
      createdAt: verificationRequests.createdAt,
      doctorName: doctorProfiles.fullName,
    })
    .from(verificationRequests)
    .leftJoin(doctorProfiles, eq(doctorProfiles.userId, verificationRequests.doctorId))
    .where(eq(verificationRequests.patientId, me.id))
    .orderBy(desc(verificationRequests.createdAt))
}

/** Elimina el archivo subido de una verificación (cuando el paciente lo reemplaza). */
export async function clearVerificationFile(pathname: string) {
  try {
    await del(pathname)
  } catch (e) {
    console.log("[v0] clearVerificationFile error:", e instanceof Error ? e.message : e)
  }
}
