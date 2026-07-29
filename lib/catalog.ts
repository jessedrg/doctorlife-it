/**
 * Catálogo central de todo lo que DoctorLife cobra.
 *
 * Única fuente de verdad para suscripciones, packs de sesiones y pagos únicos.
 * Para añadir un nuevo modelo de venta en el futuro, basta con añadir una fila a
 * `CATALOG`: el flujo de checkout (`lib/checkout.ts`) lo convierte en una sesión
 * de Stripe y aplica automáticamente el enrutado a la clínica + la comisión de
 * plataforma. No hace falta tocar la lógica de pagos.
 *
 * Los precios se guardan en céntimos (EUR). La asistencia sanitaria prestada
 * por profesionales médicos está exenta de IVA (art. 20 Ley del IVA), por lo
 * que el precio mostrado es el total final, sin impuestos añadidos.
 */

import type Stripe from "stripe"

export type PricingModel = "subscription" | "pack" | "one_time"

export type BillingInterval = "month" | "year"

export interface Product {
  /** Identificador estable usado en metadata de Stripe y en el código. */
  id: string
  /** Nombre visible en el checkout y la factura. */
  name: string
  /** Descripción visible en el checkout. */
  description: string
  /** Modelo de cobro. */
  model: PricingModel
  /** Precio recurrente / unitario (céntimos). Sin IVA (servicio médico exento). */
  priceCents: number
  /** Divisa ISO (por defecto EUR). */
  currency: string
  /** Si está disponible para contratar. */
  active: boolean
  /** Bullets opcionales para UI. */
  features?: string[]
  /**
   * Meses de acceso al tratamiento que concede un pago único (pack / one_time).
   * En suscripciones no aplica (el acceso se mantiene mientras esté activa).
   */
  accessMonths?: number

  /* ── Suscripción ── */
  /** Periodicidad del cobro recurrente. */
  interval?: BillingInterval
  /** Precio promocional del primer periodo (céntimos). Si se define, se aplica un cupón por la diferencia. */
  firstPeriodCents?: number

  /* ── Pack ── */
  /** Nº de sesiones/unidades incluidas en el pack. */
  quantity?: number
  /** Caducidad del pack en días (informativo). */
  expiresInDays?: number
}

/* ────────────────────────────────────────────────────────────
   CATÁLOGO — edita/añade filas aquí para crear nuevos productos.
   ──────────────────────────────────────────────────────────── */
export const CATALOG: Product[] = [
  {
    id: "seguimiento-mensual",
    name: "Suscripción mensual",
    description:
      "Seguimiento médico continuo, receta cuando proceda y una consulta por llamada al mes. Sin permanencia, cancela cuando quieras.",
    model: "subscription",
    priceCents: 13900, // 139 €/mes
    currency: "eur",
    active: true,
    interval: "month",
    features: [
      "Seguimiento médico continuo con tu médico",
      "Receta electrónica cuando proceda",
      "Una consulta por llamada al mes",
      "Sin permanencia: cancela cuando quieras",
    ],
  },
  {
    id: "pack-5-meses",
    name: "Pack 5 meses",
    description:
      "Programa completo de 5 meses en un único pago. La mejor relación calidad-precio para comprometerte con tu objetivo.",
    model: "one_time",
    priceCents: 44900, // 449 € pago único
    currency: "eur",
    active: true,
    accessMonths: 5,
    features: [
      "5 meses de seguimiento médico",
      "Receta electrónica cuando proceda",
      "Consulta por llamada mensual incluida",
      "Precio cerrado: te sale mucho más barato",
    ],
  },
  {
    id: "nutricionista-glp1",
    name: "Nutricionista + GLP1",
    description:
      "Programa de 5 meses con seguimiento médico y acompañamiento de nutricionista, en un único pago.",
    model: "one_time",
    priceCents: 64900, // 649 € pago único
    currency: "eur",
    active: true,
    accessMonths: 5,
    features: [
      "5 meses de seguimiento médico",
      "Acompañamiento de nutricionista",
      "Receta electrónica cuando proceda",
      "Consulta por llamada mensual incluida",
    ],
  },
]

/* ── Helpers de lectura ── */

export function getProduct(id: string): Product | undefined {
  return CATALOG.find((p) => p.id === id)
}

export function activeProducts(): Product[] {
  return CATALOG.filter((p) => p.active)
}

export function activeSubscriptions(): Product[] {
  return activeProducts().filter((p) => p.model === "subscription")
}

export function activePacks(): Product[] {
  return activeProducts().filter((p) => p.model === "pack")
}

/** Pagos únicos activos (packs cerrados y programas de un solo pago). */
export function activeOneTime(): Product[] {
  return activeProducts().filter((p) => p.model === "one_time" || p.model === "pack")
}

/**
 * Todos los planes que se pueden ofrecer a un paciente (suscripción + pagos
 * únicos), ordenados: primero la suscripción recurrente y luego los packs.
 */
export function activeSellablePlans(): Product[] {
  return [...activeSubscriptions(), ...activeOneTime()]
}

/** Suscripción principal (primera suscripción activa del catálogo). */
export function mainSubscription(): Product | undefined {
  return activeSubscriptions()[0]
}

/** Formatea céntimos como precio en euros: 13900 → "139,00 €". */
export function formatPrice(cents: number, currency = "eur"): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100)
}

/**
 * Etiqueta de precio según el modelo del plan:
 *  - Suscripción → "139,00 €/mes"
 *  - Pago único con acceso → "449,00 € · pago único · 5 meses"
 *  - Pago único sin acceso definido → "649,00 € · pago único"
 */
export function planPriceLabel(p: Product): string {
  const base = formatPrice(p.priceCents, p.currency)
  if (p.model === "subscription") return `${base}/mes`
  if (p.accessMonths) return `${base} · pago único · ${p.accessMonths} meses`
  return `${base} · pago único`
}

/** Descuento del primer periodo de una suscripción (céntimos), o 0. */
export function firstPeriodDiscountCents(product: Product): number {
  if (product.model !== "subscription" || product.firstPeriodCents == null) return 0
  return Math.max(0, product.priceCents - product.firstPeriodCents)
}

/** Modo de Stripe Checkout que corresponde al modelo del producto. */
export function stripeMode(product: Product): "subscription" | "payment" {
  return product.model === "subscription" ? "subscription" : "payment"
}

/**
 * Traduce un producto del catálogo a un `line_item` de Stripe Checkout,
 * uniforme para cualquier modelo (`price_data` inline, sin Price IDs fijos).
 */
export function toStripeLineItem(
  product: Product,
): Stripe.Checkout.SessionCreateParams.LineItem {
  const priceData: Stripe.Checkout.SessionCreateParams.LineItem.PriceData = {
    currency: product.currency,
    unit_amount: product.priceCents,
    product_data: {
      name: `${product.name} · DoctorLife`,
      description: product.description,
    },
  }
  if (product.model === "subscription") {
    priceData.recurring = { interval: product.interval ?? "month" }
  }
  return { quantity: 1, price_data: priceData }
}
