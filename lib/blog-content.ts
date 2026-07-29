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
  const items = [
    { label: `${cap(drug.name)} prezzo in Italia per dose`, href: `/blog/${drug.pillarPrice}` },
    { label: `Comprare ${cap(drug.name)} online in Italia`, href: `/blog/${drug.pillarBuy}` },
    { label: "Confronto GLP‑1: quale scegliere", href: `/blog/${drug.compare}` },
  ];
  if (hasPrice) {
    items.unshift({
      label: `Prezzo di ${cap(drug.name)} a ${city.name}`,
      href: `/blog/precio-${drug.key}-${city.slug}`,
    });
  }
  return { type: "links", title: "Continua a informarti", items: items.slice(0, 4) };
}

function priceTable(drug: Drug, city: City): Block {
  return {
    type: "table",
    caption: `Prezzo orientativo di ${cap(drug.name)} per dose a ${city.name}`,
    head: drug.key === "saxenda" ? ["Confezione", "Uso", "Prezzo orientativo"] : ["Dose", "Fase", "Prezzo orientativo/mese"],
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
    title: tpl("Comprare {Drug} a {City}", vars),
    h1: tpl("Comprare {Drug} a {City}: prezzo, ricetta e come iniziare", vars),
    metaTitle: tpl("Comprare {Drug} a {City}: Ricetta Online con Medico in 24h", vars),
    metaDescription: tpl(
      "Ottieni {Drug} a {City} con una visita medica online: ricetta elettronica in 24h, senza liste d'attesa né spostamenti. Medici iscritti all'Ordine e follow-up reale. Prima visita gratis!",
      vars,
    ),
    excerpt: tpl(
      "Guida per comprare {Drug} a {City} con ricetta medica: prezzo reale per dose, come ottenere la prescrizione online senza spostarti e iniziare con follow-up clinico.",
      vars,
    ),
    category: drug.category,
    keyword: `comprare ${drug.name.toLowerCase()} ${city.name.toLowerCase()}`,
    readMins: 5 + (hash(slug) % 4),
    date: isoDate(index),
    updated: "2026-06-18",
    cover: drug.cover,
    coverAlt: tpl("{Drug} con ricetta medica per trattamento a {City}", vars),
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
          text: tpl(
            "Il prezzo di {Drug} nelle farmacie di {City} è regolato e si situa in modo orientativo tra {low} e {high} al mese, secondo la dose. A questo costo si aggiunge la visita e il follow-up medico, necessari per una prescrizione sicura.",
            { ...vars, low: drug.priceLow, high: drug.priceHigh },
          ),
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
          items: [
            tpl("La dose: man mano che aumenta, il prezzo della penna di {Drug} sale.", vars),
            "Se serve visita e follow-up medico (incluso nel trattamento DoctorLife).",
            tpl("La disponibilità nella tua farmacia di {City} e la confezione specifica.", vars),
            "Se è per il controllo del peso (non rimborsato) o per il diabete (rimborsato con ricetta dello specialista).",
          ],
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
    title: tpl("Prezzo di {Drug} a {City}", vars),
    h1: tpl("Prezzo di {Drug} a {City}: quanto costa e come ottenerlo con ricetta", vars),
    metaTitle: tpl("{Drug} Prezzo a {City} 2026 | Ricetta Online con Medico", vars),
    metaDescription: tpl(
      "Prezzo di {Drug} a {City} per dose e come ottenerlo legalmente: visita medica online e ricetta elettronica senza attese. Medici iscritti all'Ordine e follow-up incluso. Prima visita gratis!",
      vars,
    ),
    excerpt: tpl(
      "Quanto costa {Drug} a {City} per dose, da cosa dipende il prezzo e come ottenerlo legalmente con ricetta medica e follow-up reale.",
      vars,
    ),
    category: "Prezzi",
    keyword: `prezzo ${drug.name.toLowerCase()} ${city.name.toLowerCase()}`,
    readMins: 5 + (hash(slug) % 3),
    date: isoDate(index),
    updated: "2026-06-18",
    cover: drug.cover,
    coverAlt: tpl("Penna di {Drug} con etichetta di prezzo in una farmacia di {City}", vars),
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
    title: tpl("{Drug} a {City}", vars),
    h1: tpl("{Drug} a {City}: dove ottenerlo, prezzo e disponibilità", vars),
    metaTitle: tpl("{Drug} a {City} | Visita e Ricetta Online senza Attese", vars),
    metaDescription: tpl(
      "{Drug} a {City}: ottienilo con ricetta tramite una visita medica online, senza liste d'attesa. Prezzo per dose, disponibilità e follow-up reale. Prima visita gratis!",
      vars,
    ),
    excerpt: tpl(
      "Tutto su {Drug} a {City}: dove ottenerlo legalmente, prezzo orientativo, disponibilità in farmacia e come iniziare con ricetta e follow-up medico.",
      vars,
    ),
    category: drug.category,
    keyword: `${drug.name.toLowerCase()} ${city.name.toLowerCase()}`,
    readMins: 5 + (hash(slug) % 4),
    date: isoDate(index),
    updated: "2026-06-18",
    cover: drug.cover,
    coverAlt: tpl("Penna di {Drug} disponibile in una farmacia di {City}", vars),
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
      h2: tpl("Ricetta di {Drug} online a {City}: come funziona", vars),
      blocks: [
        { type: "p", text: tpl(pick(T.rxCityIntro, slug + "intro"), vars) },
        { type: "p", text: tpl(pick(T.rxCityValidity, slug + "valid"), vars) },
      ],
    },
    localContextSection(city),
    {
      h2: tpl("Requisiti perché ti venga prescritto {Drug}", vars),
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
      h2: tpl("Ottenere la ricetta di {Drug} a {City} passo dopo passo", vars),
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
    title: tpl("Ricetta di {Drug} online a {City}", vars),
    h1: tpl("Ricetta di {Drug} online a {City}: requisiti, prezzo e passi", vars),
    metaTitle: tpl("Ricetta {Drug} Online a {City} | Medico Iscritto Oggi", vars),
    metaDescription: tpl(
      "Ottieni la ricetta di {Drug} online a {City} con valutazione di un medico iscritto all'Ordine, oggi stesso e senza liste d'attesa. Ricetta elettronica valida nella tua farmacia. Prima visita gratis!",
      vars,
    ),
    excerpt: tpl(
      "Come ottenere la ricetta di {Drug} online a {City}: requisiti clinici, validità della ricetta elettronica, prezzo in farmacia e passi per iniziare oggi con valutazione medica.",
      vars,
    ),
    category: drug.category,
    keyword: `ricetta ${drug.name.toLowerCase()} online ${city.name.toLowerCase()}`,
    readMins: 5 + (hash(slug) % 4),
    date: isoDate(index),
    updated: "2026-06-18",
    cover: drug.cover,
    coverAlt: tpl("Ricetta elettronica di {Drug} emessa online a {City}", vars),
    sections,
    faqs,
  };
}

/* ── cluster "in ricerca" (farmaci non approvati) ── */
function researchLinks(drug: ResearchDrugRaw): Block {
  const alt = getDrug(drug.altKey);
  return {
    type: "links",
    title: "Alternative disponibili oggi",
    items: [
      { label: `Comprare ${cap(alt.name)} online in Italia`, href: `/blog/${alt.pillarBuy}` },
      { label: `${cap(alt.name)} prezzo in Italia per dose`, href: `/blog/${alt.pillarPrice}` },
      { label: "Nuovi GLP‑1 in ricerca", href: "/blog/glp1-in-ricerca" },
    ],
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
      h2: tpl("Cos'è {Name}?", vars),
      blocks: [
        { type: "p", text: tpl("{Name} è un farmaco in fase di ricerca sviluppato da {maker}. È un {klass} che si somministra con {route} e viene studiato per il controllo del peso e del diabete di tipo 2.", vars) },
        { type: "p", text: tpl("Appartiene alla nuova generazione di trattamenti basati su ormoni intestinali — la stessa famiglia di Wegovy, Mounjaro o Ozempic — ma non ha ancora completato il processo di approvazione, quindi non è ancora disponibile nelle farmacie italiane.", vars) },
      ],
    },
    { h2: tpl("{Name} e la perdita di peso: cosa dicono gli studi", vars), blocks: [{ type: "p", text: drug.resultsP }] },
    {
      h2: tpl("È approvato {Name} in Italia?", vars),
      blocks: [
        { type: "p", text: tpl("No. Ad oggi {Name} NON è approvato dall'EMA né dall'AIFA e non si vende legalmente in Italia, né in farmacia né online. È disponibile solo all'interno di studi clinici.", vars) },
        { type: "p", text: tpl(pick(T.approvalExplain, slug + "ap"), vars) },
        { type: "quote", text: tpl("Qualsiasi sito che dica di venderti {Name} in Italia opera fuori dalla legge: il prodotto non ha garanzie e può essere pericoloso per la tua salute.", vars) },
      ],
    },
    {
      h2: tpl("Nell'attesa di {Name}: alternative approvate", vars),
      blocks: [
        { type: "p", text: tpl(pick(T.legalRedirect, slug + "rd"), vars) },
        { type: "p", text: tpl("Ad esempio, {Alt} ({altInn}) è un'opzione approvata e disponibile con ricetta. In DoctorLife, un endocrinologo iscritto all'Ordine valuta il tuo caso e, se appropriato, ti prescrive il trattamento con follow-up dall'app.", vars) },
        researchLinks(drug),
      ],
    },
  ];

  const faqs: Faq[] = [
    { q: tpl("È legale comprare {Name} in Italia?", vars), a: tpl("No, non essendo approvata dall'EMA/AIFA, qualsiasi vendita è illegale e rischiosa.", vars) },
    { q: tpl("Quando sarà disponibile {Name} in Italia?", vars), a: tpl("Dipende dal completamento degli studi di fase III e dall'approvazione EMA/AIFA. Non c'è una data certa.", vars) },
    { q: "Cosa posso fare oggi se voglio perdere peso?", a: tpl("Un medico può valutare {Alt}, già approvato e disponibile con ricetta e follow-up reale.", vars) },
  ];

  return {
    slug,
    title: tpl("Cos'è {Name}", vars),
    h1: tpl("Cos'è {Name} e a cosa serve", vars),
    metaTitle: tpl("Cos'è {Name}: a cosa serve e se è disponibile | {BRAND}", vars),
    metaDescription: tpl("{Name}: cos'è, come funziona, cosa dicono gli studi e perché non è ancora disponibile in Italia. Alternative approvate con ricetta e follow-up medico.", vars),
    excerpt: tpl("Tutto quello che si sa su {Name}: cos'è, come agisce e, soprattutto, quali alternative approvate puoi usare oggi mentre arriva.", vars),
    category: "In ricerca",
    keyword: tpl("cosa è {name}", vars),
    readMins: 5 + (hash(slug) % 3),
    date: isoDate(index),
    updated: "2026-06-18",
    cover: "/products/maren-lineup.png",
    coverAlt: tpl("{Name}, farmaco in fase di ricerca di {maker}", vars),
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
