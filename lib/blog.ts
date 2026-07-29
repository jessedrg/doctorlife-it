/* ───────────────────────────────────────────────────────────
   Contenuto del blog di DoctorLife. Post SEO ad alta intenzione
   di acquisto per il mercato italiano (GLP‑1, Wegovy, Mounjaro…).
   Il CONTENUTO (post manuali, template, dati farmaco, geografia)
   vive centralizzato in messages/{locale}/*.json, caricato dai
   loader lib/blog-i18n.ts e lib/geo-i18n.ts secondo LOCALE
   (i18n/config.ts). Questo file contiene la logica di aggregazione
   e gli helper SEO — è agnostico rispetto alla lingua.
   ─────────────────────────────────────────────────────────── */

import { generatePosts } from "./blog-content";
import { generateMunicipioPosts } from "./blog-municipios";
import { blogArticles } from "./blog-i18n";

export type InlineLink = { label: string; href: string };

export type Block =
  | { type: "p"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "table"; caption?: string; head: string[]; rows: string[][] }
  | { type: "links"; title?: string; items: InlineLink[] };

export type Section = { h2: string; blocks: Block[] };
export type Faq = { q: string; a: string };

export type Post = {
  slug: string;
  title: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  category: string;
  keyword: string;
  readMins: number;
  date: string; // ISO
  updated: string; // ISO
  cover: string;
  coverAlt: string;
  featured?: boolean;
  /** Luogo target della pagina (città/provincia/regione). Se presente,
   *  il saluto locale usa questo luogo invece della geo per IP. */
  place?: string;
  sections: Section[];
  faqs: Faq[];
};

export const BRAND = "DoctorLife";

export const MEDICAL_REVIEWER = {
  name: "Dott.ssa Laura Méndez",
  role: "Medico specialista in Endocrinologia e Nutrizione",
  credentials: "Iscritta all'Ordine dei Medici · Milano",
  bio: "Endocrinologa iscritta all'Ordine con oltre 12 anni di esperienza in obesità e trattamento con analoghi del GLP‑1. Revisiona i contenuti clinici di DoctorLife.",
};

/* Post principale: il pillar "comprare-wegovy-online" (definito nei
   template centralizzati) diventa il post in evidenza della home blog. */
const FEATURED_SLUG = "comprare-wegovy-online";

/* I post "manuali" sono quelli scritti a mano nel JSON centralizzato
   (messages/{locale}/blog-articles.json): pillar di prodotto, prezzo,
   confronti e guide bespoke. */
const manualPosts: Post[] = blogArticles.map((d, i) => ({
  slug: d.slug,
  title: d.title,
  h1: d.h1,
  metaTitle: d.metaTitle,
  metaDescription: d.metaDescription,
  excerpt: d.excerpt,
  category: d.category,
  keyword: d.keyword,
  readMins: 6 + (i % 4),
  date: "2026-01-08",
  updated: "2026-06-16",
  cover: "/hero/woman.png",
  coverAlt: d.title,
  featured: d.slug === FEATURED_SLUG,
  sections: d.sections,
  faqs: d.faqs,
}));

/* Nota: manualPosts qui sopra sono gli stessi che buildKeywordPosts genera
   in blog-content.ts. Per evitare duplicati, generatePosts() esclude
   già gli slug presenti in manualPosts (via il Set "existing"). */
const basePosts: Post[] = [
  ...manualPosts,
  ...generatePosts(new Set(manualPosts.map((p) => p.slug))),
];

export const posts: Post[] = [
  ...basePosts,
  ...generateMunicipioPosts(new Set(basePosts.map((p) => p.slug))),
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

/* ───────────────────────────────────────────────────────────
   Ottimizzazione del titolo per Google (SERP).
   ─────────────────────────────────────────────────────────── */
const VALUE_SUFFIX = "Visita + Ricetta Online";
const MAX_TITLE = 62;

export function seoTitle(post: Post): string {
  const core = post.metaTitle
    .split(/[:|]/)[0]
    .replace(/\s*\(\s*\d{4}\s*\)\s*/g, " ")
    .replace(/\s\b20\d{2}\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const fit = (s: string) => (s.length <= MAX_TITLE ? s : null);

  const isComparison = /(?:-vs-|\bvs\b)/i.test(post.slug) || post.category === "Confronti";
  if (isComparison) {
    return fit(`${core} · Quale Scegliere con Ricetta`) ?? fit(core) ?? core.slice(0, MAX_TITLE);
  }

  if (/ricetta/i.test(core)) {
    return (
      fit(`${core} con Medico Iscritto in 24h`) ??
      fit(`${core} con Medico in 24h`) ??
      fit(core) ??
      core.slice(0, MAX_TITLE)
    );
  }

  return (
    fit(`${core} · ${VALUE_SUFFIX}`) ??
    fit(`${core} · Ricetta Online`) ??
    fit(core) ??
    core.slice(0, MAX_TITLE).replace(/\s+\S*$/, "").trim()
  );
}

/* ───────────────────────────────────────────────────────────
   Ottimizzazione della meta description per Google (SERP).
   ─────────────────────────────────────────────────────────── */
const MAX_DESC = 158;

const DRUGS = ["Wegovy", "Mounjaro", "Ozempic", "Saxenda", "Tirzepatide", "Semaglutide"];

export function detectDrug(post: Post): string | null {
  const hay = `${post.title} ${post.metaTitle} ${post.keyword} ${post.slug}`;
  for (const d of DRUGS) {
    if (new RegExp(d, "i").test(hay)) return d;
  }
  if (/glp[\s-]?1/i.test(hay)) return "GLP‑1";
  return null;
}

const DRUG_INN: Record<string, string | undefined> = {
  Wegovy: "semaglutide",
  Ozempic: "semaglutide",
  Rybelsus: "semaglutide",
  Mounjaro: "tirzepatide",
  Saxenda: "liraglutide",
  Semaglutide: "semaglutide",
  Tirzepatide: "tirzepatide",
};

export function drugInfo(post: Post): { name: string; inn?: string } | null {
  const name = detectDrug(post);
  if (!name || name === "GLP‑1") return null;
  return { name, inn: DRUG_INN[name] };
}

function detectCity(post: Post): string | null {
  if (!/\ba\s+/i.test(post.title)) return null;
  const city = post.title
    .split(/\ba\s+/i)
    .pop()!
    .replace(/[.:·|(].*$/, "")
    .trim();
  if (!city) return null;
  if (/^Itali/i.test(city)) return null;
  if (/\d/.test(city)) return null;
  if (city.length > 40) return null;
  if (!/^[A-ZÀÈÉÌÍÒÓÙÚ]/.test(city)) return null;
  return city;
}

function joinUnderLimit(lead: string, checks: string[], max: number): string {
  let out = lead;
  for (const c of checks) {
    const next = `${out} ${c}`;
    if (next.length > max) break;
    out = next;
  }
  return out;
}

export function seoDescription(post: Post): string {
  const drug = detectDrug(post);
  const city = detectCity(post);
  const slug = post.slug.toLowerCase();

  const checks = [
    "✓ Ricetta medica online",
    "✓ Medici iscritti all'Ordine",
    "✓ Senza liste d'attesa",
    "✓ 1ª visita gratis",
    "✓ Follow-up nella nostra app",
  ];

  let lead: string;
  const where = city ? ` a ${city}` : "";

  if (/(?:-vs-|\bvs\b)/.test(slug) || post.category === "Confronti") {
    const compareName = post.title.split(/[:|]/)[0].replace(/\s+/g, " ").trim();
    lead = `➤ ${compareName}: quale scegliere e inizia con valutazione medica.`;
  } else if (/prezzo|quanto-costa|costo/.test(slug)) {
    lead = `➤ ${drug ?? "Trattamento GLP‑1"}${where}: prezzo aggiornato e come ottenerlo legalmente.`;
  } else if (/ricetta/.test(slug)) {
    lead = `➤ Ottieni la tua ricetta di ${drug ?? "GLP‑1"} online, rapido e legale.`;
  } else if (/clinica|perdere-peso|piano|dimagrire|iniezione/.test(slug)) {
    lead = `➤ Trattamento medico per dimagrire${where} con ${drug ?? "GLP‑1"}.`;
  } else if (/comprare/.test(slug)) {
    lead = `➤ Inizia il tuo trattamento con ${drug ?? "GLP‑1"}${where} oggi stesso.`;
  } else {
    lead = `➤ Trattamento con ${drug ?? "GLP‑1"}${where} supervisionato da medici.`;
  }

  const built = joinUnderLimit(lead, checks, MAX_DESC);

  if (built.length > MAX_DESC) {
    return built.slice(0, MAX_DESC).replace(/\s+\S*$/, "").trim();
  }
  return built;
}

export function getRelated(slug: string, limit = 3): Post[] {
  const current = posts.find((p) => p.slug === slug);
  if (!current) return posts.slice(0, limit);
  const sameCat = posts.filter((p) => p.slug !== slug && p.category === current.category);
  const rest = posts.filter((p) => p.slug !== slug && p.category !== current.category);
  return [...sameCat, ...rest].slice(0, limit);
}

export { SITE_URL } from "./seo";
