import { headers } from "next/headers"

/** Host canónico de producción. */
const PROD_HOST = "doctorlife.io"
/** Host de desarrollo/staging. */
const DEV_HOST = "dev.doctorlife.io"

/**
 * Devuelve true si la petición actual viene del dominio de producción
 * (doctorlife.io). Los médicos marcados como isDevOnly NO aparecen en prod.
 */
export async function isProductionRequest(): Promise<boolean> {
  try {
    const h = await headers()
    const host = (h.get("x-forwarded-host") ?? h.get("host") ?? "").toLowerCase()
    return host === PROD_HOST || host.endsWith(`.${PROD_HOST}`)
  } catch {
    // Fuera de contexto de petición (p.ej. cron/webhook): decidir por env var.
  }
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ""
  return appUrl.includes(PROD_HOST)
}

/**
 * Devuelve true si la petición viene del dominio de desarrollo.
 * Los médicos isDevOnly SÍ aparecen aquí (y en cualquier entorno no-prod).
 */
export async function isDevRequest(): Promise<boolean> {
  try {
    const h = await headers()
    const host = (h.get("x-forwarded-host") ?? h.get("host") ?? "").toLowerCase()
    return host === DEV_HOST || host.endsWith(`.${DEV_HOST}`)
  } catch {}
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ""
  return appUrl.includes(DEV_HOST)
}

/**
 * Resolves the app's public base URL across v0 preview, Vercel previews and prod.
 * Mirrors the cascade used by Better Auth in lib/auth.ts.
 */
export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL
  if (process.env.V0_RUNTIME_URL) return process.env.V0_RUNTIME_URL
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return "http://localhost:3000"
}

/**
 * Base URL CANÓNICA y estable, pensada para enlaces que viven fuera de la
 * sesión: correos, PDFs, metadatos, etc. Un email puede abrirse días después en
 * otro dispositivo, así que NUNCA debe apuntar a un host efímero (V0_RUNTIME_URL
 * o una URL de preview de Vercel), que dejaría de existir. Por eso esta cascada
 * prioriza un dominio fijo y explícito y omite los hosts temporales.
 *
 * Define NEXT_PUBLIC_APP_URL (p.ej. https://doctorlife.io) para forzar el dominio.
 */
export function getCanonicalBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  // Último recurso (desarrollo local): reutiliza la cascada general.
  return getBaseUrl()
}

/**
 * Base URL del dominio donde está navegando el usuario AHORA (dev, preview o
 * prod), leído de las cabeceras de la petición. Es lo que se debe usar para los
 * `success_url`/`return_url` de Stripe: así el usuario vuelve al mismo dominio
 * desde el que pagó (p.ej. dev.doctorlife.io) y no a producción, evitando que la
 * página de retorno (y el aprovisionamiento) acaben en un 404 de otro deploy.
 *
 * Cae de vuelta a getBaseUrl() si no hay contexto de petición.
 */
export async function getRequestBaseUrl(): Promise<string> {
  try {
    const h = await headers()
    const host = h.get("x-forwarded-host") ?? h.get("host")
    if (host) {
      const proto =
        h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https")
      return `${proto}://${host}`
    }
  } catch {
    // Sin contexto de petición (p.ej. desde el webhook): usar la canónica.
  }
  return getBaseUrl()
}
