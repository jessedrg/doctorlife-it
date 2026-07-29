"use server"

import { db } from "@/lib/db"
import { account } from "@/lib/db/schema"
import { requireRole } from "@/lib/session"
import { isGoogleConfigured } from "@/lib/google/calendar"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export interface GoogleConnectionStatus {
  /** ¿Hay credenciales OAuth de Google configuradas en el servidor? */
  configured: boolean
  /** ¿El médico ha enlazado su cuenta de Google? */
  connected: boolean
}

/** Estado de la conexión con Google Calendar del médico autenticado. */
export async function getGoogleConnectionStatus(): Promise<GoogleConnectionStatus> {
  const doctor = await requireRole("doctor")
  if (!isGoogleConfigured()) return { configured: false, connected: false }

  const [row] = await db
    .select({ id: account.id })
    .from(account)
    .where(and(eq(account.userId, doctor.id), eq(account.providerId, "google")))
    .limit(1)

  return { configured: true, connected: Boolean(row) }
}

/** Desvincula la cuenta de Google del médico (borra sus tokens). */
export async function disconnectGoogle(): Promise<{ ok: true }> {
  const doctor = await requireRole("doctor")
  await db
    .delete(account)
    .where(and(eq(account.userId, doctor.id), eq(account.providerId, "google")))
  revalidatePath("/clinica/cuenta")
  return { ok: true }
}
