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
const M = blogTemplates.postMeta;
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
    return tpl(M.formatPop.millions, { m });
  }
  return tpl(M.formatPop.thousands, { n: String(Math.round(n / 1000)) });
}

function pricingTable(): Block {
  return {
    type: "table",
    caption: T.pricingCaption,
    head: T.pricingHead,
    rows: T.pricingRows,
  };
}

function capitalLinks(r: Region): Block | null {
  if (!r.capitalSlug) return null;
  const vars = { capital: r.capital, capitalSlug: r.capitalSlug };
  return {
    type: "links",
    title: tpl(T.capitalLinksTitle, { capital: r.capital }),
    items: T.capitalLinks.map((l) => ({
      label: tpl(l.label, vars),
      href: tpl(l.href, vars),
    })),
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
          items: T.howToStartList.map((s) => tpl(s, vars)),
        },
        ...(capitalLinks(r) ? [capitalLinks(r) as Block] : []),
      ],
    },
  ];

  const faqs: Faq[] = T.faqs.map((f) => ({
    q: tpl(f.q, vars),
    a: tpl(f.a, vars),
  }));

  return {
    slug,
    title: tpl(T.postTitle, vars),
    h1: tpl(T.postH1, vars),
    metaTitle: tpl(T.postMetaTitle, vars),
    metaDescription: tpl(T.postMetaDescription, vars),
    excerpt: tpl(T.postExcerpt, vars),
    category: "Guide",
    keyword: `dimagrire ${r.name.toLowerCase()}`,
    readMins: 6 + (hash(slug) % 3),
    date: isoDate(index),
    updated: "2026-06-20",
    cover: "/products/maren-lineup.png",
    coverAlt: tpl(T.postCoverAlt, vars),
    place: r.name,
    sections,
    faqs,
  };
}

export function buildRegionPosts(startIndex: number): Post[] {
  return REGIONS.map((r, i) => buildRegionPost(r, startIndex + i));
}
