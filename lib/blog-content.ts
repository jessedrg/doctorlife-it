/* ───────────────────────────────────────────────────────────
   Generatore programmatico di post SEO ad alta intenzione di acquisto.
   Tutto il TESTO (template, farmaci, prezzi) vive in
   messages/{locale}/blog-drugs.json e blog-templates.json,
   caricati centralmente da lib/blog-i18n.ts secondo LOCALE
   (i18n/config.ts). Questo file contiene SOLO la logica di
   generazione — è agnostico rispetto alla lingua.

   Per cambiare lingua: cambia LOCALE in i18n/config.ts e crea i
   JSON corrispondenti. Per aggiungere una città: edita
   messages/{locale}/geo-cities.json (vedi lib/geo-i18n.ts).
   ─────────────────────────────────────────────────────────── */

import type { Post, Section, Faq, Block } from "./blog";
import { buildKeywordPosts } from "./blog-keywords";
import { buildRegionPosts } from "./blog-regions";
import { CITY_FACTS, healthServiceFor, formatCityPop } from "./blog-city-facts";
import { blogDrugsData, blogTemplates, type DrugRaw, type ResearchDrugRaw } from "./blog-i18n";

const T = blogTemplates;
const M = blogTemplates.postMeta;
const BRAND = "DoctorLife";
const PRICE_NOTE = T.priceNote;

/* ── utilità deterministiche ── */
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
  const d = new Date(Date.UTC(2025, 1, 1));
  d.setUTCDate(d.getUTCDate() + offset);
  return d.toISOString().slice(0, 10);
}
function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/* ── città (fonte unica: lib/geo/it-cities.ts via blog-city-facts) ── */
export type City = { name: string; slug: string };
export const CITIES: City[] = Object.keys(CITY_FACTS).map((slug) => ({
  name: slug.split("-").map(cap).join(" "),
  slug,
}));

function localContextSection(city: City): Section {
  const facts = CITY_FACTS[city.slug];
  if (!facts) return { h2: tpl(T.sections.localContext, { City: city.name }), blocks: [] };
  const health = healthServiceFor(city.slug);
  const vars = {
    City: city.name,
    trait: facts.trait,
    pop: formatCityPop(facts.pop),
    healthLong: health.long,
    healthShort: health.short,
    hospital: facts.hospital,
    BRAND,
  };
  return {
    h2: tpl(T.sections.localContext, vars),
    blocks: [
      { type: "p", text: tpl(T.localContext.trait, vars) },
      { type: "p", text: tpl(T.localContext.waitTimes, vars) },
    ],
  };
}

function localFaqs(city: City): Faq[] {
  const vars = { City: city.name, BRAND };
  return [
    { q: tpl(T.localFaqs.allOnline, vars), a: tpl(T.localFaqs.allOnlineA, vars) },
    { q: tpl(T.localFaqs.doctorAvailable, vars), a: tpl(T.localFaqs.doctorAvailableA, vars) },
    { q: tpl(T.localFaqs.howLong, vars), a: tpl(T.localFaqs.howLongA, vars) },
  ];
}

function withPlace(post: Post, place: string): Post {
  return { ...post, place };
}

/* ── farmaci (dati da JSON) ── */
type Drug = DrugRaw;
const DRUGS: Drug[] = blogDrugsData.drugs;
const PRICE_DRUG_KEYS = new Set(blogDrugsData.priceDrugKeys);
const INVESTIGATIONAL: ResearchDrugRaw[] = blogDrugsData.research;

function getDrug(key: string): Drug {
  return DRUGS.find((d) => d.key === key) as Drug;
}

/* ── blocchi riutilizzabili ── */
function buyLinks(drug: Drug, city: City, hasPrice: boolean): Block {
  const vars = { Drug: cap(drug.name), City: city.name, drugKey: drug.key, citySlug: city.slug };
  const items = [
    { label: tpl(M.buyLinks.priceLabel, vars), href: `/blog/${drug.pillarPrice}` },
    { label: tpl(M.buyLinks.buyLabel, vars), href: `/blog/${drug.pillarBuy}` },
    { label: M.buyLinks.compareLabel, href: `/blog/${drug.compare}` },
  ];
  if (hasPrice) {
    items.unshift({
      label: tpl(M.buyLinks.cityPriceLabel, vars),
      href: tpl(M.buyLinks.cityPriceHref, vars),
    });
  }
  return { type: "links", title: M.buyLinks.title, items: items.slice(0, 4) };
}

function priceTable(drug: Drug, city: City): Block {
  const vars = { Drug: cap(drug.name), City: city.name };
  return {
    type: "table",
    caption: tpl(M.priceTable.caption, vars),
    head: drug.key === "saxenda" ? M.priceTable.saxendaHead : M.priceTable.weightHead,
    rows: drug.rows,
  };
}

function baseVars(drug: Drug, city: City) {
  return {
    Drug: cap(drug.name),
    drug: drug.name,
    inn: drug.inn,
    City: city.name,
    BRAND,
    frequency: drug.frequency,
  };
}

/* ── post "comprare {drug} a {city}" ── */
function buildBuyPost(drug: Drug, city: City, index: number, hasPrice: boolean): Post {
  const slug = `comprare-${drug.key}-${city.slug}`;
  const vars = baseVars(drug, city);
  const intros = drug.kind === "weight" ? T.weightIntros : T.diabIntros;
  const intro = pick(intros, slug + "intro");
  const steps = pick(T.steps, slug + "steps").map((s) => tpl(s, vars));
  const benefitTitle = tpl(pick(drug.kind === "weight" ? T.benefitWeightTitles : T.benefitDiabTitles, slug + "bt"), vars);
  const benefitP = tpl(pick(drug.kind === "weight" ? T.benefitWeightP : T.benefitDiabP, slug + "bp"), vars);
  const mech = drug.kind === "weight" ? T.mechWeight : T.mechDiab;

  const sections: Section[] = [
    {
      h2: tpl(T.sections.whereToBuy, vars),
      blocks: [
        { type: "p", text: tpl(intro[0], vars) },
        { type: "p", text: tpl(intro[1] ?? intro[0], vars) },
        { type: "p", text: tpl(pick(T.localBuy, slug + "local"), vars) },
      ],
    },
    {
      h2: tpl(T.sections.whatIsAndHow, vars),
      blocks: [
        { type: "p", text: tpl(pick(mech, slug + "mech"), vars) },
        { type: "p", text: tpl(pick(T.compareP, slug + "cmp"), vars) },
      ],
    },
    localContextSection(city),
    {
      h2: tpl(T.sections.priceByDose, vars),
      blocks: [priceTable(drug, city), { type: "quote", text: PRICE_NOTE }],
    },
    {
      h2: tpl(T.sections.howToBuySteps, vars),
      blocks: [{ type: "list", items: steps }, buyLinks(drug, city, hasPrice)],
    },
    {
      h2: tpl(T.sections.sideEffects, vars),
      blocks: [
        { type: "p", text: tpl(pick(T.sideIntro, slug + "si"), vars) },
        { type: "list", items: T.sideList.map((s) => tpl(s, vars)) },
        { type: "p", text: tpl(pick(T.sideOutro, slug + "so"), vars) },
      ],
    },
    {
      h2: tpl(T.sections.whoCanUse, vars),
      blocks: [
        { type: "p", text: tpl(pick(T.contraP, slug + "cp"), vars) },
        { type: "list", items: T.contraList.map((s) => tpl(s, vars)) },
      ],
    },
    {
      h2: tpl(T.sections.howToStore, vars),
      blocks: [{ type: "list", items: T.storageList.map((s) => tpl(s, vars)) }],
    },
    {
      h2: benefitTitle,
      blocks: [
        { type: "p", text: benefitP },
        ...(drug.kind === "weight" ? [{ type: "p", text: tpl(pick(T.resultsWeight, slug + "res"), vars) } as Block] : []),
        buyLinks(drug, city, hasPrice),
      ],
    },
  ];

  const faqs: Faq[] = [
    { q: tpl(T.faqTemplates.noRxWeight, vars), a: tpl(T.faqTemplates.noRxWeightA, vars) },
    { q: tpl(T.faqTemplates.howMuch, vars), a: tpl(T.faqTemplates.howMuchA, { ...vars, low: drug.priceLow, high: drug.priceHigh }) },
    { q: tpl(T.faqTemplates.allOnline, vars), a: tpl(T.faqTemplates.allOnlineA, vars) },
    { q: tpl(T.faqTemplates.isSafe, vars), a: tpl(T.faqTemplates.isSafeA, vars) },
    { q: tpl(T.faqTemplates.howStart, vars), a: tpl(T.faqTemplates.howStartA, vars) },
    localFaqs(city)[hash(slug) % 3],
  ];

  return {
    slug,
    title: tpl(M.buyPost.title, vars),
    h1: tpl(M.buyPost.h1, vars),
    metaTitle: tpl(M.buyPost.metaTitle, vars),
    metaDescription: tpl(M.buyPost.metaDescription, vars),
    excerpt: tpl(M.buyPost.excerpt, vars),
    category: drug.category,
    keyword: tpl(M.buyPost.keyword, { drugName: drug.name.toLowerCase(), cityName: city.name.toLowerCase() }),
    readMins: 5 + (hash(slug) % 4),
    date: isoDate(index),
    updated: "2026-06-18",
    cover: drug.cover,
    coverAlt: tpl(M.buyPost.coverAlt, vars),
    sections,
    faqs,
  };
}

/* ── post "prezzo di {drug} a {city}" ── */
function buildPricePost(drug: Drug, city: City, index: number): Post {
  const slug = `precio-${drug.key}-${city.slug}`;
  const vars = baseVars(drug, city);
  const mech = drug.kind === "weight" ? T.mechWeight : T.mechDiab;

  const sections: Section[] = [
    {
      h2: tpl(T.sections.howMuchCost, vars),
      blocks: [
        {
          type: "p",
          text: tpl(M.pricePost.priceIntro, { ...vars, low: drug.priceLow, high: drug.priceHigh }),
        },
        priceTable(drug, city),
        { type: "quote", text: PRICE_NOTE },
      ],
    },
    {
      h2: tpl(T.sections.priceDepends, vars),
      blocks: [
        {
          type: "list",
          items: M.pricePost.priceDependsList.map((s) => tpl(s, vars)),
        },
      ],
    },
    localContextSection(city),
    {
      h2: tpl(T.sections.whatIsAndHow, vars),
      blocks: [
        { type: "p", text: tpl(pick(mech, slug + "mech"), vars) },
        { type: "p", text: tpl(pick(T.contraP, slug + "cp"), vars) },
      ],
    },
    {
      h2: tpl(T.sections.howToGetRx, vars),
      blocks: [
        { type: "list", items: pick(T.steps, slug + "steps").map((s) => tpl(s, vars)) },
        buyLinks(drug, city, false),
      ],
    },
  ];

  const faqs: Faq[] = [
    {
      q: tpl(T.faqTemplates.howMuch, vars),
      a: tpl(T.faqTemplates.howMuchA, { ...vars, low: drug.priceLow, high: drug.priceHigh }),
    },
    { q: tpl(T.faqTemplates.noRxWeight, vars), a: tpl(T.faqTemplates.noRxWeightA, vars) },
    { q: tpl(T.faqTemplates.allOnline, vars), a: tpl(T.faqTemplates.allOnlineA, vars) },
    localFaqs(city)[hash(slug) % 3],
  ];

  return {
    slug,
    title: tpl(M.pricePost.title, vars),
    h1: tpl(M.pricePost.h1, vars),
    metaTitle: tpl(M.pricePost.metaTitle, vars),
    metaDescription: tpl(M.pricePost.metaDescription, vars),
    excerpt: tpl(M.pricePost.excerpt, vars),
    category: M.pricePost.category,
    keyword: tpl(M.pricePost.keyword, { drugName: drug.name.toLowerCase(), cityName: city.name.toLowerCase() }),
    readMins: 5 + (hash(slug) % 3),
    date: isoDate(index),
    updated: "2026-06-18",
    cover: drug.cover,
    coverAlt: tpl(M.pricePost.coverAlt, vars),
    sections,
    faqs,
  };
}

/* ── post "{drug} a {city}" (disponibilità) ── */
function buildDrugCityPost(drug: Drug, city: City, index: number): Post {
  const slug = `${drug.key}-${city.slug}`;
  const vars = baseVars(drug, city);
  const mech = drug.kind === "weight" ? T.mechWeight : T.mechDiab;
  const steps = pick(T.steps, slug + "steps").map((s) => tpl(s, vars));

  const sections: Section[] = [
    {
      h2: tpl(T.sections.drugInCity, vars),
      blocks: [
        { type: "p", text: tpl(pick(T.drugCityIntro, slug + "intro"), vars) },
        { type: "p", text: tpl(pick(T.localBuy, slug + "local"), vars) },
      ],
    },
    localContextSection(city),
    {
      h2: tpl(T.sections.availability, vars),
      blocks: [{ type: "p", text: tpl(pick(T.drugCityStock, slug + "stock"), vars) }],
    },
    {
      h2: tpl(T.sections.whatIsAndHow, vars),
      blocks: [
        { type: "p", text: tpl(pick(mech, slug + "mech"), vars) },
        { type: "p", text: tpl(pick(T.compareP, slug + "cmp"), vars) },
      ],
    },
    {
      h2: tpl(T.sections.priceByDose, vars),
      blocks: [priceTable(drug, city), { type: "quote", text: PRICE_NOTE }],
    },
    {
      h2: tpl(T.sections.howToStartSteps, vars),
      blocks: [{ type: "list", items: steps }, buyLinks(drug, city, true)],
    },
  ];

  const faqs: Faq[] = [
    { q: tpl(T.faqTemplates.allOnline, vars), a: tpl(T.faqTemplates.allOnlineA, vars) },
    { q: tpl(T.faqTemplates.isSafe, vars), a: tpl(T.faqTemplates.isSafeA, vars) },
    localFaqs(city)[hash(slug) % 3],
  ];

  return {
    slug,
    title: tpl(M.drugCityPost.title, vars),
    h1: tpl(M.drugCityPost.h1, vars),
    metaTitle: tpl(M.drugCityPost.metaTitle, vars),
    metaDescription: tpl(M.drugCityPost.metaDescription, vars),
    excerpt: tpl(M.drugCityPost.excerpt, vars),
    category: drug.category,
    keyword: tpl(M.drugCityPost.keyword, { drugName: drug.name.toLowerCase(), cityName: city.name.toLowerCase() }),
    readMins: 5 + (hash(slug) % 4),
    date: isoDate(index),
    updated: "2026-06-18",
    cover: drug.cover,
    coverAlt: tpl(M.drugCityPost.coverAlt, vars),
    sections,
    faqs,
  };
}

/* ── post "ricetta {drug} online {city}" ── */
function buildRxCityPost(drug: Drug, city: City, index: number): Post {
  const slug = `receta-${drug.key}-online-${city.slug}`;
  const vars = baseVars(drug, city);
  const mech = drug.kind === "weight" ? T.mechWeight : T.mechDiab;
  const steps = pick(T.steps, slug + "steps").map((s) => tpl(s, vars));

  const sections: Section[] = [
    {
      h2: tpl(M.rxCityPost.rxH2, vars),
      blocks: [
        { type: "p", text: tpl(pick(T.rxCityIntro, slug + "intro"), vars) },
        { type: "p", text: tpl(pick(T.rxCityValidity, slug + "valid"), vars) },
      ],
    },
    localContextSection(city),
    {
      h2: tpl(M.rxCityPost.reqH2, vars),
      blocks: [
        { type: "p", text: tpl(pick(T.rxCityRequirements, slug + "req"), vars) },
        { type: "p", text: tpl(pick(mech, slug + "mech"), vars) },
      ],
    },
    {
      h2: tpl(T.sections.priceByDose, vars),
      blocks: [priceTable(drug, city), { type: "quote", text: PRICE_NOTE }],
    },
    {
      h2: tpl(M.rxCityPost.stepsH2, vars),
      blocks: [{ type: "list", items: steps }, buyLinks(drug, city, true)],
    },
  ];

  const faqs: Faq[] = [
    { q: tpl(T.faqTemplates.allOnline, vars), a: tpl(T.faqTemplates.allOnlineA, vars) },
    { q: tpl(T.faqTemplates.howMuch, vars), a: tpl(T.faqTemplates.howMuchA, { ...vars, low: drug.priceLow, high: drug.priceHigh }) },
    localFaqs(city)[hash(slug) % 3],
  ];

  return {
    slug,
    title: tpl(M.rxCityPost.title, vars),
    h1: tpl(M.rxCityPost.h1, vars),
    metaTitle: tpl(M.rxCityPost.metaTitle, vars),
    metaDescription: tpl(M.rxCityPost.metaDescription, vars),
    excerpt: tpl(M.rxCityPost.excerpt, vars),
    category: drug.category,
    keyword: tpl(M.rxCityPost.keyword, { drugName: drug.name.toLowerCase(), cityName: city.name.toLowerCase() }),
    readMins: 5 + (hash(slug) % 4),
    date: isoDate(index),
    updated: "2026-06-18",
    cover: drug.cover,
    coverAlt: tpl(M.rxCityPost.coverAlt, vars),
    sections,
    faqs,
  };
}

/* ── cluster "in ricerca" (farmaci non approvati) ── */
function researchLinks(drug: ResearchDrugRaw): Block {
  const alt = getDrug(drug.altKey);
  const vars = { AltName: cap(alt.name), altBuy: alt.pillarBuy, altPrice: alt.pillarPrice };
  return {
    type: "links",
    title: M.researchPost.altLinksTitle,
    items: M.researchPost.altLinks.map((l) => ({
      label: tpl(l.label, vars),
      href: tpl(l.href, vars),
    })),
  };
}

function buildResearchPost(drug: ResearchDrugRaw, index: number): Post {
  const alt = getDrug(drug.altKey);
  const slug = `cosa-e-${drug.key.toLowerCase()}`;
  const vars = {
    Name: drug.Name, name: drug.name, maker: drug.maker, klass: drug.klass, route: drug.route,
    Alt: cap(alt.name), alt: alt.name, altInn: alt.inn, BRAND,
  };

  const sections: Section[] = [
    {
      h2: tpl(M.researchPost.whatIsH2, vars),
      blocks: [
        { type: "p", text: tpl(M.researchPost.whatIsP1, vars) },
        { type: "p", text: tpl(M.researchPost.whatIsP2, vars) },
      ],
    },
    { h2: tpl(M.researchPost.studiesH2, vars), blocks: [{ type: "p", text: drug.resultsP }] },
    {
      h2: tpl(M.researchPost.approvalH2, vars),
      blocks: [
        { type: "p", text: tpl(M.researchPost.approvalP1, vars) },
        { type: "p", text: tpl(pick(T.approvalExplain, slug + "ap"), vars) },
        { type: "quote", text: tpl(M.researchPost.approvalQuote, vars) },
      ],
    },
    {
      h2: tpl(M.researchPost.altH2, vars),
      blocks: [
        { type: "p", text: tpl(pick(T.legalRedirect, slug + "rd"), vars) },
        { type: "p", text: tpl(M.researchPost.altP1, vars) },
        researchLinks(drug),
      ],
    },
  ];

  const faqs: Faq[] = M.researchPost.faqs.map((f) => ({
    q: tpl(f.q, vars),
    a: tpl(f.a, vars),
  }));

  return {
    slug,
    title: tpl(M.researchPost.title, vars),
    h1: tpl(M.researchPost.h1, vars),
    metaTitle: tpl(M.researchPost.metaTitle, vars),
    metaDescription: tpl(M.researchPost.metaDescription, vars),
    excerpt: tpl(M.researchPost.excerpt, vars),
    category: M.researchPost.category,
    keyword: tpl(M.researchPost.keyword, vars),
    readMins: 5 + (hash(slug) % 3),
    date: isoDate(index),
    updated: "2026-06-18",
    cover: "/products/maren-lineup.png",
    coverAlt: tpl(M.researchPost.coverAlt, vars),
    sections,
    faqs,
  };
}

/* ═══════════════════════════════════════════════════════════
   BUILDER PRINCIPALE
   ═══════════════════════════════════════════════════════════ */
export function generatePosts(existing: Set<string>): Post[] {
  const out: Post[] = [];
  const seen = new Set<string>(existing);
  let index = 40;

  // 1) comprare {drug} a {city}
  for (const drug of DRUGS) {
    for (const city of CITIES) {
      const slug = `comprare-${drug.key}-${city.slug}`;
      if (seen.has(slug)) continue;
      const hasPrice = PRICE_DRUG_KEYS.has(drug.key);
      out.push(withPlace(buildBuyPost(drug, city, index++, hasPrice), city.name));
      seen.add(slug);
    }
  }

  // 2) prezzo di {drug} a {city}
  for (const drug of DRUGS.filter((d) => PRICE_DRUG_KEYS.has(d.key))) {
    for (const city of CITIES) {
      const slug = `precio-${drug.key}-${city.slug}`;
      if (seen.has(slug)) continue;
      out.push(withPlace(buildPricePost(drug, city, index++), city.name));
      seen.add(slug);
    }
  }

  // 3) "{drug} a {city}" (disponibilità)
  for (const drug of DRUGS.filter((d) => PRICE_DRUG_KEYS.has(d.key))) {
    for (const city of CITIES) {
      const slug = `${drug.key}-${city.slug}`;
      if (seen.has(slug)) continue;
      out.push(withPlace(buildDrugCityPost(drug, city, index++), city.name));
      seen.add(slug);
    }
  }

  // 4) "ricetta {drug} online {city}"
  for (const drug of DRUGS.filter((d) => PRICE_DRUG_KEYS.has(d.key))) {
    for (const city of CITIES) {
      const slug = `receta-${drug.key}-online-${city.slug}`;
      if (seen.has(slug)) continue;
      out.push(withPlace(buildRxCityPost(drug, city, index++), city.name));
      seen.add(slug);
    }
  }

  // 5) cluster "in ricerca"
  for (const drug of INVESTIGATIONAL) {
    const slug = `cosa-e-${drug.key.toLowerCase()}`;
    if (seen.has(slug)) continue;
    out.push(buildResearchPost(drug, index++));
    seen.add(slug);
  }

  // 6) articoli per cluster di keyword
  for (const post of buildKeywordPosts(index)) {
    index++;
    if (seen.has(post.slug)) continue;
    out.push(post);
    seen.add(post.slug);
  }

  // 7) guide per regione (20 regioni d'Italia, dati reali)
  for (const post of buildRegionPosts(index)) {
    index++;
    if (seen.has(post.slug)) continue;
    out.push(post);
    seen.add(post.slug);
  }

  return out;
}
