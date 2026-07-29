"use server"

import { db } from "@/lib/db"
import { leads } from "@/lib/db/schema"
import { getSessionUser } from "@/lib/session"
import { desc, eq } from "drizzle-orm"

/**
 * Plan derivado del quiz, emparejado por email con el lead más reciente.
 * El paciente solo ve datos de su propio email.
 */
export async function getMyPlan() {
  const me = await getSessionUser()
  if (!me) return null
  const [lead] = await db
    .select()
    .from(leads)
    .where(eq(leads.email, me.email))
    .orderBy(desc(leads.createdAt))
    .limit(1)
  return lead ?? null
}
