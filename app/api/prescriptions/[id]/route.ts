import { type NextRequest, NextResponse } from "next/server"
import { get } from "@vercel/blob"
import { db } from "@/lib/db"
import { prescriptions } from "@/lib/db/schema"
import { getSessionUser } from "@/lib/session"
import { hasActiveSubscription } from "@/app/actions/subscription"
import { eq } from "drizzle-orm"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const me = await getSessionUser()
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const prescriptionId = Number(id)
  if (!Number.isInteger(prescriptionId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 })
  }

  const [row] = await db
    .select()
    .from(prescriptions)
    .where(eq(prescriptions.id, prescriptionId))
    .limit(1)

  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 })

  // Solo el paciente o el médico de la receta pueden descargarla.
  if (row.patientId !== me.id && row.doctorId !== me.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  // El paciente necesita tratamiento activo para desbloquear el PDF.
  if (row.patientId === me.id && me.role !== "doctor" && !(await hasActiveSubscription(me.id))) {
    return NextResponse.json({ error: "Suscripción requerida" }, { status: 402 })
  }

  const result = await get(row.blobPathname, {
    access: "private",
    ifNoneMatch: request.headers.get("if-none-match") ?? undefined,
  })

  if (!result) return new NextResponse("Not found", { status: 404 })

  if (result.statusCode === 304) {
    return new NextResponse(null, {
      status: 304,
      headers: { ETag: result.blob.etag, "Cache-Control": "private, no-cache" },
    })
  }

  return new NextResponse(result.stream, {
    headers: {
      "Content-Type": result.blob.contentType || "application/pdf",
      "Content-Disposition": `inline; filename="receta-${row.id}.pdf"`,
      ETag: result.blob.etag,
      "Cache-Control": "private, no-cache",
    },
  })
}
