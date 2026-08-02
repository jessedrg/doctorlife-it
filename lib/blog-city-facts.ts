/* ───────────────────────────────────────────────────────────
   Re-esporta i dati geografici (centralizzati in lib/geo-i18n.ts,
   che carica i JSON secondo LOCALE) con l'interfaccia richiesta dal
   generatore di contenuti del blog (blog-content.ts…).
   Per aggiungere/cambiare una città: edita SOLO i JSON in messages/{locale}/geo-*.json.
   ─────────────────────────────────────────────────────────── */

import { CITY_FACTS, HEALTH_SERVICES, type CityFacts, type HealthService } from "./geo-i18n";
import { blogTemplates } from "./blog-i18n";

const M = blogTemplates.postMeta;

export { CITY_FACTS, HEALTH_SERVICES };
export type { CityFacts, HealthService };

function tpl(s: string, vars: Record<string, string>): string {
  return s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
}

export function healthServiceFor(citySlug: string): HealthService {
  const facts = CITY_FACTS[citySlug];
  const fallback: HealthService = { short: M.fallbackHealth.short, long: M.fallbackHealth.long };
  if (!facts) return fallback;
  return HEALTH_SERVICES[facts.region] ?? fallback;
}

export function formatCityPop(pop: number): string {
  if (pop >= 1000000) {
    const m = (pop / 1000000).toFixed(1).replace(".", ",");
    return tpl(M.formatPop.millions, { m });
  }
  return tpl(M.formatPop.thousands, { n: String(Math.round(pop / 1000)) });
}

/** Città extra oltre alle principali (per ora vuoto: CITY_FACTS è già la fonte unica). */
export const EXTRA_CITIES: { name: string; slug: string }[] = [];
