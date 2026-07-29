import { nativeScheduling } from "./native"
import type { SchedulingProvider } from "./types"

/**
 * Proveedor de agenda activo. Hoy es la agenda nativa (Neon).
 * Para migrar a Cal.com Platform basta con crear `lib/scheduling/calcom.ts`
 * que implemente `SchedulingProvider` y exportarlo aquí.
 */
export const scheduling: SchedulingProvider = nativeScheduling

export * from "./types"
