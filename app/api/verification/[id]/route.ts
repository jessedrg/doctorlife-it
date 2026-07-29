import { type NextRequest, NextResponse } from "next/server"
import { get } from "@vercel/blob"
import { db } from "@/lib/db"
import { verificationRequests } from "@/lib/db/schema"
import { getSessionUser } from "@/lib/session"
import { eq } from "drizzle-orm"

/**
 * Sirve el archivo privado de una verificación. Solo el médico que la solicitó
 * o el propio paciente que la subió pueden verlo. Confidencial.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const me = await getSessionUser()
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const reqId = Number(id)
  if (!Number.isInteger(reqId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 })
  }

  const [row] = await db
    .select()
    .from(verificationRequests)
    .where(eq(verificationRequests.id, reqId))
    .limit(1)
  if (!row || !row.blobPathname) return NextResponse.json({ error: "Not found" }, { status: 404 })

  if (row.patientId !== me.id && row.doctorId !== me.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
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
      "Content-Type": result.blob.contentType || "application/octet-stream",
      "Content-Disposition": `inline; filename="${encodeURIComponent(row.fileName || `verificacion-${row.id}`)}"`,
      ETag: result.blob.etag,
      "Cache-Control": "private, no-cache",
    },
  })
}
