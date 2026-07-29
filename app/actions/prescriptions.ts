"use server"

import { db } from "@/lib/db"
import { prescriptions, doctorProfiles, user as userTable, appointments } from "@/lib/db/schema"
import { getSessionUser } from "@/lib/session"
import { buildPrescriptionPdf } from "@/lib/prescriptions/pdf"
import { sendPrescriptionReadyEmail } from "@/lib/email"
import { hasActiveSubscription } from "@/app/actions/subscription"
import { createNotification } from "@/app/actions/notifications"
import { put } from "@vercel/blob"
import { and, desc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

/** Pacientes con los que el médico ha tenido (o tiene) una cita: a quién puede recetar. */
export async function getMyPatientsForPrescribing() {
  const me = await getSessionUser()
  if (!me || me.role !== "doctor") return []
  const rows = await db
    .selectDistinct({ id: userTable.id, name: userTable.name, email: userTable.email })
    .from(appointments)
    .innerJoin(userTable, eq(userTable.id, appointments.patientId))
    .where(eq(appointments.doctorId, me.id))
  return rows
}

/** El médico emite una receta: genera el PDF, lo sube a un blob privado y guarda la fila. */
export async function issuePrescription(input: {
  patientId: string
  medication: string
  dosage: string
  instructions?: string
  appointmentId?: number
}) {
  const me = await getSessionUser()
  if (!me || me.role !== "doctor") return { error: "No autorizado." }

  const medication = input.medication.trim()
  const dosage = input.dosage.trim()
  if (!input.patientId || !medication || !dosage) {
    return { error: "Faltan datos obligatorios (paciente, medicamento y posología)." }
  }

  // El médico solo puede recetar a pacientes con los que ha tenido una cita.
  const [link] = await db
    .select({ id: appointments.id })
    .from(appointments)
    .where(and(eq(appointments.doctorId, me.id), eq(appointments.patientId, input.patientId)))
    .limit(1)
  if (!link) return { error: "Solo puedes recetar a tus pacientes." }

  const [patient] = await db
    .select({ name: userTable.name, email: userTable.email })
    .from(userTable)
    .where(eq(userTable.id, input.patientId))
    .limit(1)
  if (!patient) return { error: "Paciente no encontrado." }

  const [profile] = await db
    .select()
    .from(doctorProfiles)
    .where(eq(doctorProfiles.userId, me.id))
    .limit(1)

  const issuedAt = new Date()
  const pdfBytes = await buildPrescriptionPdf({
    doctorName: profile?.fullName ?? me.name,
    doctorSpecialty: profile?.specialty,
    doctorLicense: profile?.licenseNumber,
    patientName: patient.name,
    medication,
    dosage,
    instructions: input.instructions?.trim() || null,
    issuedAt,
  })

  const filename = `prescriptions/${input.patientId}/${Date.now()}-${slug(medication)}.pdf`
  const blob = await put(filename, Buffer.from(pdfBytes), {
    access: "private",
    contentType: "application/pdf",
    addRandomSuffix: true,
  })

  await db.insert(prescriptions).values({
    patientId: input.patientId,
    doctorId: me.id,
    appointmentId: input.appointmentId ?? null,
    medication,
    dosage,
    instructions: input.instructions?.trim() || null,
    blobPathname: blob.pathname,
    issuedAt,
  })

  // Notificación in-app al paciente + email con CTA contextual.
  try {
    const unlocked = await hasActiveSubscription(input.patientId)
    const doctorName = profile?.fullName ?? me.name

    // Notificación en el panel del paciente
    await createNotification({
      userId: input.patientId,
      type: "prescription_ready",
      title: unlocked ? "Tu receta ya está disponible" : "Tu plan de tratamiento está listo",
      body: unlocked
        ? `${doctorName} ha emitido una nueva receta. Descárgala en PDF desde Mis recetas.`
        : `${doctorName} ha preparado tu tratamiento. Actívalo para ver tu receta y empezar.`,
      href: "/portal/recetas",
    })

    // Email al paciente
    await sendPrescriptionReadyEmail({
      to: patient.email,
      name: patient.name,
      doctorName,
      locked: !unlocked,
    })
  } catch (e) {
    console.log("[v0] prescription email/notification error:", e instanceof Error ? e.message : e)
  }

  revalidatePath("/clinica/recetas")
  revalidatePath("/portal/recetas")
  return { ok: true }
}

/** Recetas del usuario autenticado (vista de paciente o de médico). */
export async function getMyPrescriptions() {
  const me = await getSessionUser()
  if (!me) return []

  const scope =
    me.role === "doctor"
      ? eq(prescriptions.doctorId, me.id)
      : eq(prescriptions.patientId, me.id)

  return db
    .select({
      id: prescriptions.id,
      medication: prescriptions.medication,
      dosage: prescriptions.dosage,
      instructions: prescriptions.instructions,
      issuedAt: prescriptions.issuedAt,
      blobPathname: prescriptions.blobPathname,
      doctorName: doctorProfiles.fullName,
      patientName: userTable.name,
    })
    .from(prescriptions)
    .leftJoin(doctorProfiles, eq(doctorProfiles.userId, prescriptions.doctorId))
    .leftJoin(userTable, eq(userTable.id, prescriptions.patientId))
    .where(scope)
    .orderBy(desc(prescriptions.issuedAt))
}

/** Recetas que el médico autenticado ha emitido a un paciente concreto. */
export async function getPatientPrescriptions(patientId: string) {
  const me = await getSessionUser()
  if (!me || me.role !== "doctor") return []

  // Solo si existe relación de cita médico-paciente.
  const [link] = await db
    .select({ id: appointments.id })
    .from(appointments)
    .where(and(eq(appointments.doctorId, me.id), eq(appointments.patientId, patientId)))
    .limit(1)
  if (!link) return []

  return db
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
}

function slug(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40)
}
