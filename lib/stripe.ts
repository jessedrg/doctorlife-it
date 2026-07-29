import "server-only"

import Stripe from "stripe"

/** Si la plataforma tiene configurada la clave secreta de Stripe. */
export const isStripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY)

/**
 * Cliente de Stripe con inicialización perezosa. No lanzamos al importar el
 * módulo (eso tumbaría cualquier página que lo importe si falta la env var);
 * en su lugar, lanzamos solo cuando se intenta usar el cliente sin clave, y
 * dejamos que las server actions capturen el error y degraden con elegancia.
 */
let _stripe: Stripe | null = null
function getStripe(): Stripe {
  if (_stripe) return _stripe
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error(
      "Stripe no está configurado: falta la variable de entorno STRIPE_SECRET_KEY.",
    )
  }
  _stripe = new Stripe(key)
  return _stripe
}

/**
 * Proxy que difiere la creación del cliente hasta el primer acceso a una
 * propiedad/método. Permite `import { stripe }` sin evaluar la clave en import.
 */
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    const client = getStripe()
    const value = Reflect.get(client, prop)
    return typeof value === "function" ? value.bind(client) : value
  },
}) as Stripe

/**
 * Modelo de facturación compliant (Stripe Connect):
 *
 * La CLÍNICA (entidad sanitaria) es el comerciante de liquidación de todo acto
 * médico: el cargo se crea `on_behalf_of` la clínica y se liquida en su cuenta
 * Connect (`transfer_data.destination`). DoctorLife solo retiene su comisión de
 * servicio tecnológico mediante `application_fee` y factura esa parte.
 *
 * Los médicos son personal de la clínica: DoctorLife NO les transfiere dinero.
 * La clínica los remunera fuera de la plataforma.
 */

/**
 * Comisión de servicio tecnológico de DoctorLife, en % del importe cobrado.
 * Parametrizable vía env `PLATFORM_FEE_PERCENT` (por defecto 30%).
 */
export const PLATFORM_FEE_PERCENT = Number(process.env.PLATFORM_FEE_PERCENT ?? 30)

/** Calcula la comisión de plataforma en céntimos a partir de un importe. */
export function platformFeeCents(amountCents: number): number {
  return Math.round((amountCents * PLATFORM_FEE_PERCENT) / 100)
}

/**
 * @deprecated Reparto por médico retirado. La clínica remunera a sus médicos
 * fuera de la app. Se conservan solo para datos históricos de `commissions`.
 */
export const DOCTOR_ACTIVATION_CENTS = 1000   // 10 € (histórico)
/** @deprecated Ver DOCTOR_ACTIVATION_CENTS. */
export const DOCTOR_SHARE_CENTS = 3500         // 35 € (histórico)
