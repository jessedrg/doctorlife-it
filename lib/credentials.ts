import { randomInt } from "node:crypto"

// Sin caracteres ambiguos (0/O, 1/l/I) para que sea fácil de teclear.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789"

/** Genera una contraseña temporal legible (por defecto 10 caracteres). */
export function generateTempPassword(length = 10): string {
  let out = ""
  for (let i = 0; i < length; i++) {
    out += ALPHABET[randomInt(0, ALPHABET.length)]
  }
  return out
}
