/* ───────────────────────────────────────────────────────────
   Generatore di pagine di CLINICA per COMUNE (dai comuni elencati
   in ogni provincia — messages/{locale}/geo-provinces.json).
   Dati geografici e template testuali centralizzati (nessun testo
   hardcoded qui): vedi lib/geo-i18n.ts e lib/blog-i18n.ts.
   ─────────────────────────────────────────────────────────── */

import type { Post, Section, Faq } from "./blog";
import { PROVINCES } from "./geo-i18n";
import { blogTemplates } from "./blog-i18n";

const T = blogTemplates.comune;
const BRAND = "DoctorLife";

function hash(s: string): number {
  let n = 0;
  for (let i = 0; i < s.length; i++) n = (n * 31 + s.charCodeAt(i)) >>> 0;
  return n;
}
function pick<T2>(arr: T2[], seed: string): T2 {
  return arr[hash(seed) % arr.length];
}
function tpl(s: string, vars: Record<string, string>): string {
  return s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
}
function isoDate(offset: number): string {
  const d = new Date(Date.UTC(2025, 8, 1));
  d.setUTCDate(d.getUTCDate() + (offset % 300));
  return d.toISOString().slice(0, 10);
}
function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
function fmtPop(n: number): string {
  return `${n.toLocaleString()} ${T.postMeta.popSuffix}`;
}

type Comune = { name: string; slug: string; province: string; pop: number };

/* Estrae i comuni elencati in ogni provincia (dati reali di geo-provinces.json).
   Assegna una popolazione stimata decrescente in base alla posizione nell'elenco
   (i comuni sono già ordinati per rilevanza nel JSON). */
function buildComuni(): Comune[] {
  const out: Comune[] = [];
  for (const p of PROVINCES) {
    p.cities.forEach((cityName, i) => {
      const basePop = Math.max(8000, Math.round((p.pop / (p.cities.length + 2)) * (1 - i * 0.12)));
      out.push({ name: cityName, slug: slugify(cityName), province: p.name, pop: basePop });
    });
  }
  return out;
}

const COMUNI = buildComuni();

type SizeKey = "piccolo" | "medio" | "grande";
function sizeOf(pop: number): SizeKey {
  if (pop >= 80000) return "grande";
  if (pop >= 25000) return "medio";
  return "piccolo";
}

function buildSections(c: Comune, size: SizeKey): Section[] {
  const vars = { City: c.name, province: c.province, pop: fmtPop(c.pop), BRAND };
  return [
    {
      h2: tpl(T.sections.clinic, vars),
      blocks: [
        { type: "p", text: tpl(T.introBySize[size], vars) },
        { type: "p", text: tpl(pick(T.legalNote, c.slug + c.province), vars) },
      ],
    },
    {
      h2: tpl(T.sections.howItWorks, vars),
      blocks: [{ type: "list", items: T.howItWorks.map((s) => tpl(s, vars)) }],
    },
    {
      h2: tpl(T.sections.prices, vars),
      blocks: [
        {
          type: "table",
          caption: tpl(T.postMeta.pricingCaption, vars),
          head: T.postMeta.pricingHead,
          rows: T.postMeta.pricingRows,
        },
      ],
    },
    {
      h2: tpl(T.sections.whyOnline, vars),
      blocks: [
        {
          type: "list",
          items: [
            size === "piccolo" ? tpl(T.postMeta.whyOnlineSmall, vars) : T.postMeta.whyOnlineLarge,
            T.postMeta.doctorsLine,
            tpl(T.postMeta.rxLine, vars),
            T.postMeta.followUpLine,
          ],
        },
      ],
    },
  ];
}

function buildFaqs(c: Comune): Faq[] {
  const vars = { City: c.name, province: c.province, BRAND };
  return [
    { q: tpl(T.faqs.isThereClinic, vars), a: tpl(T.faqs.isThereClinicA, vars) },
    { q: tpl(T.faqs.howMuchCost, vars), a: tpl(T.faqs.howMuchCostA, vars) },
  ];
}

function buildComunePost(c: Comune, index: number, slug: string): Post {
  const size = sizeOf(c.pop);
  const vars = { City: c.name, province: c.province };
  return {
    slug,
    title: tpl(T.postMeta.title, vars),
    h1: tpl(T.postMeta.h1, vars),
    metaTitle: tpl(T.postMeta.metaTitle, vars),
    metaDescription: tpl(T.postMeta.metaDescription, vars),
    excerpt: tpl(T.postMeta.excerpt, vars),
    category: T.postMeta.category,
    keyword: tpl(T.postMeta.keyword, vars).toLowerCase(),
    readMins: 6 + (hash(slug) % 3),
    date: isoDate(index),
    updated: "2026-07-01",
    cover: "/products/maren-lineup.png",
    coverAlt: tpl(T.postMeta.coverAlt, vars),
    place: c.name,
    sections: buildSections(c, size),
    faqs: buildFaqs(c),
  };
}

export const MUNICIPIO_SLUG_PREFIX = T.postMeta.slugPrefix;

export function generateMunicipioPosts(existing: Set<string>): Post[] {
  const out: Post[] = [];
  const seen = new Set<string>(existing);
  let index = 0;
  for (const c of COMUNI) {
    let slug = `${MUNICIPIO_SLUG_PREFIX}${c.slug}`;
    if (seen.has(slug)) {
      slug = `${MUNICIPIO_SLUG_PREFIX}${c.slug}-${slugify(c.province)}`;
      if (seen.has(slug)) continue;
    }
    seen.add(slug);
    out.push(buildComunePost(c, index++, slug));
  }
  return out;
}
