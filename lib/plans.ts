/**
 * Plan principal de DoctorLife.
 *
 * La definición vive ahora en el catálogo central (`lib/catalog.ts`), fuente de
 * verdad de todos los productos (suscripciones, packs, pagos únicos). Este módulo
 * expone el plan principal en el formato `PlanInfo` que ya consumía la app, para
 * no romper las llamadas existentes.
 *
 * La primera visita (valoración) es GRATIS (0 €) y funciona como gancho. La
 * suscripción no tiene oferta de primer mes: el precio es plano desde el inicio.
 * Los servicios médicos están exentos de IVA (art. 20 Ley del IVA).
 */
import { getProduct, mainSubscription, type Product } from "./catalog"

/** Producto principal (suscripción de seguimiento mensual). */
const MAIN_PRODUCT: Product =
  mainSubscription() ??
  getProduct("seguimiento-mensual") ??
  ({
    id: "seguimiento-mensual",
    name: "Suscripción mensual",
    description: "Suscripción mensual con seguimiento médico.",
    model: "subscription",
    priceCents: 13900,
    currency: "eur",
    active: true,
    interval: "month",
  } satisfies Product)

/** Precio mensual (céntimos). Sin IVA (servicio médico exento). */
export const SUBSCRIPTION_PRICE_CENTS = MAIN_PRODUCT.priceCents   // 139 €

/** Pago único de la primera visita (céntimos). Es GRATIS. */
export const FIRST_VISIT_CENTS = 0               // 0 € (gratis)

/** Id del producto principal en el catálogo (para el checkout). */
export const MAIN_PRODUCT_ID = MAIN_PRODUCT.id

/** Etiqueta del pago de la primera visita. */
export const FIRST_VISIT_LABEL = "gratis"

export interface PlanInfo {
  name: string
  /** Precio mensual (céntimos). Sin IVA. */
  priceCents: number
  /** Total formateado, p. ej. "139,00 €/mes". */
  totalLabel: string
}

function eur(cents: number): string {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(cents / 100)
}

function buildMainPlan(): PlanInfo {
  return {
    name: MAIN_PRODUCT.name,
    priceCents: SUBSCRIPTION_PRICE_CENTS,
    totalLabel: `${eur(SUBSCRIPTION_PRICE_CENTS)}/mes`,
  }
}

/** Único plan disponible para contratar. */
export const MAIN_PLAN: PlanInfo = buildMainPlan()

/**
 * Devuelve la info del plan. Como solo hay un plan activo, siempre devuelve
 * MAIN_PLAN (el parámetro se mantiene por compatibilidad con llamadas previas).
 */
export function getPlan(_name?: string | null): PlanInfo {
  return MAIN_PLAN
}

/** Plan por defecto (idéntico al único plan disponible). */
export function defaultPlan(): PlanInfo {
  return MAIN_PLAN
}
