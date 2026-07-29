/* ───────────────────────────────────────────────────────────
   Re-esporta i dati geografici (centralizzati in lib/geo-i18n.ts,
   che carica i JSON secondo LOCALE) con l'interfaccia richiesta dal
   generatore di contenuti del blog (blog-content.ts…).
   Per aggiungere/cambiare una città: edita SOLO i JSON in messages/{locale}/geo-*.json.
   ─────────────────────────────────────────────────────────── */

import { CITY_FACTS, HEALTH_SERVICES, type CityFacts, type HealthService } from "./geo-i18n";

export { CITY_FACTS, HEALTH_SERVICES };
export type { CityFacts, HealthService };

/** Servizio sanitario regionale per una città (dalla sua regione). */
export function healthServiceFor(citySlug: string): HealthService {
  const facts = CITY_FACTS[citySlug];
  const fallback: HealthService = { short: "SSR", long: "il servizio sanitario regionale" };
  if (!facts) return fallback;
  return HEALTH_SERVICES[facts.region] ?? fallback;
}

/** Formatta la popolazione di una città in italiano. */
export function formatCityPop(pop: number): string {
  if (pop >= 1000000) {
    const m = (pop / 1000000).toFixed(1).replace(".", ",");
    return `${m} milioni di abitanti`;
  }
  return `${Math.round(pop / 1000)}.000 abitanti circa`;
}

/** Città extra oltre alle principali (per ora vuoto: CITY_FACTS è già la fonte unica). */
export const EXTRA_CITIES: { name: string; slug: string }[] = [];
