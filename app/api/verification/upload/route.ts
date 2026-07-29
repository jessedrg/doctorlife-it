import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { db } from "@/lib/db"
import { verificationRequests } from "@/lib/db/schema"
import { getSessionUser } from "@/lib/session"
import { and, eq } from "drizzle-orm"

// Permite cuerpos grandes (vídeos).
export const maxDuration = 60

export async function POST(request: NextRequest) {
  const me = await getSessionUser()
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const form = await request.formData()
  const file = form.get("file")
  const requestId = Number(form.get("requestId"))
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Archivo no válido" }, { status: 400 })
  }
  if (!Number.isInteger(requestId)) {
    return NextResponse.json({ error: "Solicitud no válida" }, { status: 400 })
  }

  // La solicitud debe ser del paciente y estar pendiente de envío.
  const [row] = await db
    .select()
    .from(verificationRequests)
    .where(and(eq(verificationRequests.id, requestId), eq(verificationRequests.patientId, me.id)))
    .limit(1)
  if (!row) return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 })
  if (row.status === "approved") {
    return NextResponse.json({ error: "Esta verificación ya fue aprobada." }, { status: 409 })
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80) || "archivo"
  const pathname = `verifications/${me.id}/${requestId}-${Date.now()}-${safeName}`

  try {
    const blob = await put(pathname, file, {
      access: "private",
      contentType: file.type || "application/octet-stream",
      addRandomSuffix: true,
    })

    await db
      .update(verificationRequests)
      .set({
        blobPathname: blob.pathname,
        fileName: file.name.slice(0, 200),
        fileType: file.type || null,
        status: "submitted",
        submittedAt: new Date(),
        reviewNote: null,
        updatedAt: new Date(),
      })
      .where(eq(verificationRequests.id, requestId))

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.log("[v0] verification upload error:", e instanceof Error ? e.message : e)
    return NextResponse.json({ error: "No se pudo subir el archivo." }, { status: 500 })
  }
}
