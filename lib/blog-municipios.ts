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
  return `${n.toLocaleString("it-IT")} abitanti`;
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
          caption: `Prezzi orientativi in farmacia nella provincia di ${c.province}`,
          head: ["Farmaco", "Principio attivo", "Somministrazione", "Prezzo/mese"],
          rows: [
            ["Wegovy", "semaglutide 2,4 mg", "Iniezione settimanale", "200–300 €"],
            ["Mounjaro", "tirzepatide", "Iniezione settimanale", "200–350 €"],
            ["Ozempic", "semaglutide", "Iniezione settimanale", "120–170 €"],
            ["Saxenda", "liraglutide", "Iniezione giornaliera", "200–300 €"],
          ],
        },
      ],
    },
    {
      h2: tpl(T.sections.whyOnline, vars),
      blocks: [
        {
          type: "list",
          items: [
            size === "piccolo"
              ? tpl("Senza spostamenti: non dipendi dalla distanza tra {City} e il capoluogo di provincia per vedere uno specialista.", vars)
              : "Senza sale d'attesa: il videoconsulto si adatta al tuo orario, non il contrario.",
            "Endocrinologi iscritti all'Ordine in Italia, specializzati in obesità e GLP‑1.",
            tpl("Ricetta elettronica valida in qualsiasi farmacia, anche nella tua a {City}.", vars),
            "Follow-up settimanale tramite app: aderenza, effetti secondari e aggiustamento della dose.",
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
    title: tpl("Clinica per la perdita di peso a {City}", vars),
    h1: tpl("Clinica per la perdita di peso a {City}: GLP‑1 con medico online", vars),
    metaTitle: tpl("Clinica Perdita di Peso a {City} ({province}): GLP‑1 Online", vars),
    metaDescription: tpl(
      "Clinica online per la perdita di peso a {City} ({province}): endocrinologo iscritto all'Ordine, ricetta di Wegovy, Ozempic o Mounjaro e follow-up tramite app. Prima visita gratis!",
      vars,
    ),
    excerpt: tpl("Trattamento medico per dimagrire a {City} senza spostarti: valutazione in videoconsulto, ricetta elettronica valida in farmacia e follow-up clinico continuo.", vars),
    category: "Clinica",
    keyword: tpl("clinica perdita di peso {City}", vars).toLowerCase(),
    readMins: 6 + (hash(slug) % 3),
    date: isoDate(index),
    updated: "2026-07-01",
    cover: "/products/maren-lineup.png",
    coverAlt: tpl("Clinica online per la perdita di peso con GLP‑1 a {City} ({province})", vars),
    place: c.name,
    sections: buildSections(c, size),
    faqs: buildFaqs(c),
  };
}

export const MUNICIPIO_SLUG_PREFIX = "clinica-perdita-di-peso-";

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
