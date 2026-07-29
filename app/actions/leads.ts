"use server"

import { db } from "@/lib/db"
import { leads } from "@/lib/db/schema"
import { sendLeadNotification } from "@/lib/email"

export type LeadInput = {
  name?: string
  email: string
  phone?: string
  goal?: string
  glp1Experience?: string
  formatPreference?: string
  timeline?: string
  plan?: string
  heightCm?: number | null
  weightKg?: number | null
  age?: number | null
}

export type SaveLeadResult = { ok: true } | { ok: false; error: string }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function saveLead(input: LeadInput): Promise<SaveLeadResult> {
  const email = (input.email ?? "").trim().toLowerCase()

  if (!email || !EMAIL_RE.test(email)) {
    return { ok: false, error: "Introduce un correo electrónico válido." }
  }

  const heightCm = input.heightCm && input.heightCm > 0 ? Math.round(input.heightCm) : null
  const weightKg = input.weightKg && input.weightKg > 0 ? Math.round(input.weightKg) : null
  const age = input.age && input.age > 0 ? Math.round(input.age) : null
  const bmi =
    heightCm && weightKg ? (weightKg / Math.pow(heightCm / 100, 2)).toFixed(1) : null

  const leadData = {
    name: input.name?.trim() || null,
    email,
    phone: input.phone?.trim() || null,
    goal: input.goal || null,
    glp1Experience: input.glp1Experience || null,
    formatPreference: input.formatPreference || null,
    timeline: input.timeline || null,
    plan: input.plan || null,
    heightCm,
    weightKg,
    age,
    bmi,
    source: "quiz",
  }

  try {
    await db.insert(leads).values(leadData)

    // Notificación por email (no bloquea ni invalida el guardado si falla).
    const emailResult = await sendLeadNotification(leadData)
    if (!emailResult.ok) {
      console.log("[v0] aviso: lead guardado pero email no enviado:", emailResult.error)
    }

    return { ok: true }
  } catch (err) {
    console.log("[v0] saveLead error:", err instanceof Error ? err.message : err)
    return { ok: false, error: "No hemos podido guardar tus datos. Inténtalo de nuevo." }
  }
}
