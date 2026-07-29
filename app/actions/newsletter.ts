"use server"

import { db } from "@/lib/db"
import { newsletterSubscribers } from "@/lib/db/schema"

export type NewsletterResult = { ok: true } | { ok: false; error: string }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function subscribeNewsletter(
  email: string,
  source = "guia"
): Promise<NewsletterResult> {
  const normalized = (email ?? "").trim().toLowerCase()

  if (!normalized || !EMAIL_RE.test(normalized)) {
    return { ok: false, error: "Introduce un correo electrónico válido." }
  }

  try {
    await db
      .insert(newsletterSubscribers)
      .values({ email: normalized, source })
      .onConflictDoNothing() // si ya existe, no lanzamos error
    return { ok: true }
  } catch (err) {
    console.error("[newsletter] subscribeNewsletter error:", err)
    return { ok: false, error: "No hemos podido guardar tu correo. Inténtalo de nuevo." }
  }
}
