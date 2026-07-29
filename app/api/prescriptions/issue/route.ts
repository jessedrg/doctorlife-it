import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { prescriptions, doctorProfiles, user as userTable, appointments } from "@/lib/db/schema"
import { getSessionUser } from "@/lib/session"
import { buildPrescriptionPdf } from "@/lib/prescriptions/pdf"
import { sendPrescriptionReadyEmail } from "@/lib/email"
import { hasActiveSubscription } from "@/app/actions/subscription"
import { put } from "@vercel/blob"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

const MAX_PDF_BYTES = 10 * 1024 * 1024 // 10 MB

export async function POST(req: NextRequest) {
  const me = await getSessionUser()
  if (!me || me.role !== "doctor") {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  }

  const form = await req.formData()
  const patientId = (form.get("patientId") as string | null)?.trim()
  const medication = (form.get("medication") as string | null)?.trim()
  const dosage = (form.get("dosage") as string | null)?.trim()
  const instructions = (form.get("instructions") as string | null)?.trim() || null
  const pdfEntry = form.get("pdf")

  if (!patientId || !medication || !dosage) {
    return NextResponse.json(
      { error: "Faltan datos obligatorios (paciente, medicamento, posología)." },
      { status: 400 },
    )
  }

  // El médico solo puede recetar a pacientes con los que ha tenido una cita.
  const [link] = await db
    .select({ id: appointments.id })
    .from(appointments)
    .where(and(eq(appointments.doctorId, me.id), eq(appointments.patientId, patientId)))
    .limit(1)
  if (!link) {
    return NextResponse.json({ error: "Solo puedes recetar a tus pacientes." }, { status: 403 })
  }

  const [patient] = await db
    .select({ name: userTable.name, email: userTable.email })
    .from(userTable)
    .where(eq(userTable.id, patientId))
    .limit(1)
  if (!patient) {
    return NextResponse.json({ error: "Paciente no encontrado." }, { status: 404 })
  }

  const [profile] = await db
    .select()
    .from(doctorProfiles)
    .where(eq(doctorProfiles.userId, me.id))
    .limit(1)

  const issuedAt = new Date()
  let pdfBuffer: Buffer

  // Si el médico subió un PDF real, usarlo directamente.
  if (pdfEntry instanceof File && pdfEntry.size > 0) {
    if (pdfEntry.type !== "application/pdf") {
      return NextResponse.json({ error: "Solo se admiten archivos PDF." }, { status: 400 })
    }
    if (pdfEntry.size > MAX_PDF_BYTES) {
      return NextResponse.json({ error: "El PDF no puede superar 10 MB." }, { status: 400 })
    }
    pdfBuffer = Buffer.from(await pdfEntry.arrayBuffer())
  } else {
    // Fallback: generar PDF automático con los metadatos.
    const bytes = await buildPrescriptionPdf({
      doctorName: profile?.fullName ?? me.name,
      doctorSpecialty: profile?.specialty,
      doctorLicense: profile?.licenseNumber,
      patientName: patient.name,
      medication,
      dosage,
      instructions,
      issuedAt,
    })
    pdfBuffer = Buffer.from(bytes)
  }

  const filename = `prescriptions/${patientId}/${Date.now()}-${slug(medication)}.pdf`
  const blob = await put(filename, pdfBuffer, {
    access: "private",
    contentType: "application/pdf",
    addRandomSuffix: true,
  })

  await db.insert(prescriptions).values({
    patientId,
    doctorId: me.id,
    appointmentId: null,
    medication,
    dosage,
    instructions,
    blobPathname: blob.pathname,
    issuedAt,
  })

  // Notificar al paciente.
  try {
    const unlocked = await hasActiveSubscription(patientId)
    await sendPrescriptionReadyEmail({
      to: patient.email,
      name: patient.name,
      doctorName: profile?.fullName ?? me.name,
      locked: !unlocked,
    })
  } catch (e) {
    console.log("[v0] prescription email error:", e instanceof Error ? e.message : e)
  }

  revalidatePath("/clinica/recetas")
  revalidatePath("/portal/recetas")

  return NextResponse.json({ ok: true })
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
