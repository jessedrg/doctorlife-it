/* ───────────────────────────────────────────────────────────
   Link interno geografico per il blog di DoctorLife.
   Tutto il CONTENUTO (pillar, hub nazionali, etichette) vive in
   messages/{locale}/blog-templates.json → internalLinks, caricato
   da lib/blog-i18n.ts. Questo file contiene SOLO la logica.

   Obiettivo SEO: eliminare pagine orfane e creare silos densi
   (provincia → regione → nazionale). Ogni pagina collega a:
     1. Lo stesso trattamento in città vicine (silo geografico)
     2. Altri trattamenti nella stessa città (silo tematico locale)
     3. Guide nazionali / pillar
   ─────────────────────────────────────────────────────────── */

import { posts } from "./blog";
import { CITIES } from "./blog-content";
import { CITY_FACTS } from "./blog-city-facts";
import { blogTemplates } from "./blog-i18n";

const T = blogTemplates.internalLinks;

export type LinkItem = { label: string; href: string };
export type LinkGroup = { title: string; intro?: string; items: LinkItem[] };

const DRUG_KEYS = ["wegovy", "mounjaro", "ozempic", "saxenda"] as const;
type DrugKey = (typeof DRUG_KEYS)[number];
const DRUG_NAME: Record<DrugKey, string> = {
  wegovy: "Wegovy",
  mounjaro: "Mounjaro",
  ozempic: "Ozempic",
  saxenda: "Saxenda",
};

type Kind = "buy" | "price" | "availability";
const KIND_PREFIX: Record<Kind, string> = { buy: "comprare-", price: "precio-", availability: "" };

function tpl(s: string, vars: Record<string, string>): string {
  return s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
}

const NAME_BY_SLUG: Record<string, string> = Object.fromEntries(CITIES.map((c) => [c.slug, c.name]));
const SLUG_SET: Set<string> = new Set(posts.map((p) => p.slug));

const byProvince = new Map<string, string[]>();
const byRegion = new Map<string, string[]>();
for (const slug of Object.keys(CITY_FACTS)) {
  const f = CITY_FACTS[slug];
  if (!f) continue;
  (byProvince.get(f.province) ?? byProvince.set(f.province, []).get(f.province)!).push(slug);
  (byRegion.get(f.region) ?? byRegion.set(f.region, []).get(f.region)!).push(slug);
}
const popDesc = (a: string, b: string) => (CITY_FACTS[b]?.pop ?? 0) - (CITY_FACTS[a]?.pop ?? 0);
for (const list of byProvince.values()) list.sort(popDesc);
for (const list of byRegion.values()) list.sort(popDesc);

const NATIONAL_HUBS: string[] = T.nationalHubs;

type Parsed = { kind: Kind; drug: DrugKey; city: string };

function parseCitySlug(slug: string): Parsed | null {
  for (const kind of ["buy", "price"] as const) {
    const prefix = KIND_PREFIX[kind];
    if (slug.startsWith(prefix)) {
      const rest = slug.slice(prefix.length);
      for (const drug of DRUG_KEYS) {
        if (rest.startsWith(drug + "-")) {
          const city = rest.slice(drug.length + 1);
          if (CITY_FACTS[city]) return { kind, drug, city };
        }
      }
    }
  }
  for (const drug of DRUG_KEYS) {
    if (slug.startsWith(drug + "-")) {
      const city = slug.slice(drug.length + 1);
      if (CITY_FACTS[city]) return { kind: "availability", drug, city };
    }
  }
  return null;
}

function cityHref(kind: Kind, drug: DrugKey, city: string): string {
  return `/blog/${KIND_PREFIX[kind]}${drug}-${city}`;
}
function cityLabel(kind: Kind, drug: DrugKey, city: string): string {
  const name = NAME_BY_SLUG[city] ?? city;
  const d = DRUG_NAME[drug];
  return tpl(T.labels[kind], { Drug: d, City: name });
}
function pushIfExists(items: LinkItem[], kind: Kind, drug: DrugKey, city: string) {
  const slug = `${KIND_PREFIX[kind]}${drug}-${city}`;
  if (SLUG_SET.has(slug)) items.push({ label: cityLabel(kind, drug, city), href: cityHref(kind, drug, city) });
}

function pillarsFor(drug: DrugKey): LinkItem[] {
  return (T.pillars[drug] ?? []).filter((l) => SLUG_SET.has(l.href.replace("/blog/", "")));
}

function neighborCities(parsed: Parsed, max: number): string[] {
  const f = CITY_FACTS[parsed.city];
  const ordered: string[] = [];
  const seen = new Set<string>([parsed.city]);
  const add = (slug: string) => {
    if (!seen.has(slug)) {
      seen.add(slug);
      ordered.push(slug);
    }
  };
  if (f) {
    for (const s of byProvince.get(f.province) ?? []) add(s);
    for (const s of byRegion.get(f.region) ?? []) add(s);
  }
  for (const s of NATIONAL_HUBS) add(s);
  return ordered.slice(0, max);
}

export function getInternalLinks(slug: string): LinkGroup[] {
  const parsed = parseCitySlug(slug);

  if (parsed) {
    const f = CITY_FACTS[parsed.city];
    const cityName = NAME_BY_SLUG[parsed.city] ?? parsed.city;
    const drugName = DRUG_NAME[parsed.drug];
    const groups: LinkGroup[] = [];

    const geo: LinkItem[] = [];
    for (const city of neighborCities(parsed, 18)) {
      pushIfExists(geo, parsed.kind, parsed.drug, city);
      if (geo.length >= 8) break;
    }
    if (geo.length) {
      const scope = f ? `di ${f.province}` : "vicine";
      groups.push({
        title: tpl(T.labels.geoGroupTitle, { Drug: drugName, scope }),
        intro: tpl(T.labels.geoGroupIntro, { Drug: drugName }),
        items: geo,
      });
    }

    const local: LinkItem[] = [];
    for (const drug of DRUG_KEYS) {
      if (drug !== parsed.drug) pushIfExists(local, "buy", drug, parsed.city);
    }
    (["buy", "price", "availability"] as Kind[])
      .filter((k) => k !== parsed.kind)
      .forEach((k) => pushIfExists(local, k, parsed.drug, parsed.city));
    if (local.length) {
      groups.push({ title: tpl(T.labels.localGroupTitle, { City: cityName }), items: local.slice(0, 6) });
    }

    const pillars = pillarsFor(parsed.drug);
    if (pillars.length) {
      groups.push({ title: tpl(T.labels.pillarGroupTitle, { Drug: drugName }), items: pillars });
    }

    return groups;
  }

  const drug = DRUG_KEYS.find((d) => slug.includes(d)) ?? "wegovy";
  const drugName = DRUG_NAME[drug];
  const down: LinkItem[] = [];
  for (const city of NATIONAL_HUBS) pushIfExists(down, "buy", drug, city);
  if (!down.length) return [];
  return [
    {
      title: tpl(T.labels.downGroupTitle, { Drug: drugName }),
      intro: tpl(T.labels.downGroupIntro, { Drug: drugName }),
      items: down.slice(0, 8),
    },
  ];
}
