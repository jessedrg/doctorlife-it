/* ───────────────────────────────────────────────────────────
   Generatore di guide SEO per REGIONE italiana (20 regioni).
   Dati geografici reali da lib/geo-i18n.ts (JSON centralizzati).
   Template testuali da messages/{locale}/blog-templates.json
   tramite lib/blog-i18n.ts. Nessun testo hardcoded qui: solo logica.
   ─────────────────────────────────────────────────────────── */

import type { Post, Section, Faq, Block } from "./blog";
import { REGIONS, HEALTH_SERVICES, type Region } from "./geo-i18n";
import { blogTemplates } from "./blog-i18n";

const T = blogTemplates.region;
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
  const d = new Date(Date.UTC(2025, 5, 1));
  d.setUTCDate(d.getUTCDate() + offset);
  return d.toISOString().slice(0, 10);
}
function formatPop(n: number): string {
  if (n >= 1000000) {
    const m = (n / 1000000).toFixed(1).replace(".", ",");
    return `${m} milioni di abitanti`;
  }
  return `${Math.round(n / 1000)}.000 abitanti circa`;
}

function pricingTable(): Block {
  return {
    type: "table",
    caption: "Prezzi orientativi dei trattamenti GLP‑1 in farmacia (2026)",
    head: ["Trattamento", "Principio attivo", "Somministrazione", "Indicazione", "Prezzo orientativo"],
    rows: [
      ["Wegovy", "semaglutide 2,4 mg", "Iniezione settimanale", "Perdita di peso", "200–300 €/mese"],
      ["Mounjaro", "tirzepatide", "Iniezione settimanale", "Perdita di peso", "200–350 €/mese"],
      ["Ozempic", "semaglutide", "Iniezione settimanale", "Diabete tipo 2", "120–170 €/mese"],
      ["Saxenda", "liraglutide", "Iniezione giornaliera", "Perdita di peso", "200–300 €/mese"],
    ],
  };
}

function capitalLinks(r: Region): Block | null {
  if (!r.capitalSlug) return null;
  return {
    type: "links",
    title: tpl(T.capitalLinksTitle, { capital: r.capital }),
    items: [
      { label: `Comprare Wegovy a ${r.capital}`, href: `/blog/comprare-wegovy-${r.capitalSlug}` },
      { label: `Comprare Mounjaro a ${r.capital}`, href: `/blog/comprare-mounjaro-${r.capitalSlug}` },
      { label: `Prezzo Ozempic a ${r.capital}`, href: `/blog/precio-ozempic-${r.capitalSlug}` },
    ],
  };
}

function buildRegionPost(r: Region, index: number): Post {
  const slug = `trattamento-dimagrire-regione-${r.slug}`;
  const health = HEALTH_SERVICES[r.name] ?? { short: "SSR", long: "il servizio sanitario regionale" };
  const popText = formatPop(r.pop);
  const vars: Record<string, string> = {
    Name: r.name,
    capital: r.capital,
    pop: popText,
    BRAND,
    health: health.long,
    obesity: String(r.obesity),
  };

  const sections: Section[] = [
    {
      h2: tpl(T.sections.intro, vars),
      blocks: [
        { type: "p", text: tpl(pick(T.introP1, slug + "1"), vars) },
        { type: "p", text: tpl(pick(T.introP2, slug + "2"), vars) },
        { type: "p", text: tpl(pick(T.introP3, slug + "3"), vars) },
      ],
    },
    {
      h2: tpl(T.sections.price, vars),
      blocks: [
        { type: "p", text: tpl(pick(T.priceP, slug + "p"), vars) },
        pricingTable(),
        { type: "p", text: tpl(pick(T.priceP2, slug + "p2"), vars) },
      ],
    },
    {
      h2: tpl(T.sections.prescription, vars),
      blocks: [
        { type: "p", text: tpl(pick(T.rxP1, slug + "rx1"), vars) },
        { type: "p", text: tpl(pick(T.rxP2, slug + "rx2"), vars) },
      ],
    },
    {
      h2: tpl(T.sections.obesity, vars),
      blocks: [
        { type: "p", text: tpl(pick(T.obesityIntro, slug + "oi"), vars) },
        { type: "p", text: tpl(pick(T.obesityP2, slug + "op2"), vars) },
      ],
    },
    {
      h2: tpl(T.sections.howToStart, vars),
      blocks: [
        {
          type: "list",
          items: [
            "Prenoti la prima visita medica online gratis.",
            tpl("Completi la tua anamnesi e i tuoi obiettivi dall'app, ovunque tu sia in {Name}.", vars),
            "Un endocrinologo iscritto all'Ordine valuta il tuo caso.",
            tpl("Se appropriato, ricevi la ricetta elettronica valida in qualsiasi farmacia di {Name}.", vars),
            "Fai il follow-up e gli aggiustamenti di dose dall'app.",
          ],
        },
        ...(capitalLinks(r) ? [capitalLinks(r) as Block] : []),
      ],
    },
  ];

  const faqs: Faq[] = [
    {
      q: tpl("Quanto costano i trattamenti GLP‑1 in {Name}?", vars),
      a: tpl("I prezzi sono gli stessi del resto d'Italia: Ozempic 120–170 €/mese, Wegovy o Saxenda 200–300 €/mese, Mounjaro 200–350 €/mese, orientativi. La prima visita con {BRAND} è gratis.", vars),
    },
    {
      q: tpl("Posso ottenere la ricetta senza spostarmi in {Name}?", vars),
      a: tpl("Sì. Il consulto è online e, se il trattamento è indicato, ricevi la ricetta elettronica valida in qualsiasi farmacia della regione.", vars),
    },
    {
      q: tpl("Il {health} finanzia questi trattamenti?", vars),
      a: "Di norma i GLP‑1 per la perdita di peso non sono rimborsati dal SSN; sono invece rimborsabili per il diabete di tipo 2 su prescrizione dello specialista.",
    },
  ];

  return {
    slug,
    title: tpl("Trattamento per dimagrire in {Name}", vars),
    h1: tpl("Trattamento per dimagrire in {Name}: prezzi, ricetta e come iniziare", vars),
    metaTitle: tpl("Dimagrire in {Name}: Trattamento GLP‑1 con Ricetta Online", vars),
    metaDescription: tpl(
      "Guida completa al trattamento GLP‑1 per dimagrire in {Name}: prezzi, come ottenere la ricetta e come iniziare con follow-up medico online. Prima visita gratis!",
      vars,
    ),
    excerpt: tpl("Tutto sul trattamento medico per dimagrire in {Name}: prezzi dei GLP‑1, ricetta online e follow-up con medico iscritto all'Ordine.", vars),
    category: "Guide",
    keyword: `dimagrire ${r.name.toLowerCase()}`,
    readMins: 6 + (hash(slug) % 3),
    date: isoDate(index),
    updated: "2026-06-20",
    cover: "/products/maren-lineup.png",
    coverAlt: tpl("Trattamento GLP‑1 con ricetta medica per la regione {Name}", vars),
    place: r.name,
    sections,
    faqs,
  };
}

export function buildRegionPosts(startIndex: number): Post[] {
  return REGIONS.map((r, i) => buildRegionPost(r, startIndex + i));
}
