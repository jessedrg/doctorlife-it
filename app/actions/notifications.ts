"use server"

import { db } from "@/lib/db"
import { notifications } from "@/lib/db/schema"
import { getSessionUser } from "@/lib/session"
import { and, desc, eq, isNull, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"

/** Crea una notificación para un usuario (uso interno desde otras acciones/webhook). */
export async function createNotification(input: {
  userId: string
  type: string
  title: string
  body?: string | null
  href?: string | null
}): Promise<void> {
  try {
    await db.insert(notifications).values({
      userId: input.userId,
      type: input.type,
      title: input.title,
      body: input.body ?? null,
      href: input.href ?? null,
    })
  } catch (e) {
    console.log("[v0] createNotification error:", e instanceof Error ? e.message : e)
  }
}

export type NotificationRow = {
  id: number
  type: string
  title: string
  body: string | null
  href: string | null
  read: boolean
  createdAt: Date
}

/** Notificaciones del usuario en sesión (más recientes primero). */
export async function getMyNotifications(limit = 20): Promise<NotificationRow[]> {
  const me = await getSessionUser()
  if (!me) return []
  const rows = await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, me.id))
    .orderBy(desc(notifications.createdAt))
    .limit(limit)
  return rows.map((n) => ({
    id: n.id,
    type: n.type,
    title: n.title,
    body: n.body,
    href: n.href,
    read: n.readAt != null,
    createdAt: new Date(n.createdAt),
  }))
}

/** Número de notificaciones sin leer del usuario en sesión. */
export async function getUnreadNotificationsCount(): Promise<number> {
  const me = await getSessionUser()
  if (!me) return 0
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(notifications)
    .where(and(eq(notifications.userId, me.id), isNull(notifications.readAt)))
  return row?.count ?? 0
}

/** Marca todas las notificaciones del usuario como leídas. */
export async function markAllNotificationsRead(): Promise<void> {
  const me = await getSessionUser()
  if (!me) return
  await db
    .update(notifications)
    .set({ readAt: new Date() })
    .where(and(eq(notifications.userId, me.id), isNull(notifications.readAt)))
  revalidatePath("/clinica")
}
