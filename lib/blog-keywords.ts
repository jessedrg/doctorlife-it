/* ───────────────────────────────────────────────────────────
   Articoli SEO "bespoke" per cluster di keyword (prezzo per dose,
   confronti, domande frequenti di prodotto). Il CONTENUTO vive in
   messages/{locale}/blog-articles.json, caricato centralmente da
   lib/blog-i18n.ts. Questo file è solo il mapper verso il tipo Post.

   Per aggiungere un articolo: aggiungi una entry all'array JSON.
   Per cambiare lingua: crea il JSON equivalente per il nuovo locale.
   ─────────────────────────────────────────────────────────── */

import type { Post } from "./blog";
import { blogArticles } from "./blog-i18n";

const COVERS = [
  "/blog/wegovy-sevilla.png",
  "/blog/mounjaro-valencia.png",
  "/blog/ozempic-madrid.png",
  "/products/maren-lineup.png",
  "/products/maren-pen.png",
];

function hash(s: string): number {
  let n = 0;
  for (let i = 0; i < s.length; i++) n = (n * 31 + s.charCodeAt(i)) >>> 0;
  return n;
}
function isoDate(offset: number): string {
  const d = new Date(Date.UTC(2025, 6, 1));
  d.setUTCDate(d.getUTCDate() + offset);
  return d.toISOString().slice(0, 10);
}

export function buildKeywordPosts(startIndex: number): Post[] {
  return blogArticles.map((d, i) => {
    const cover = COVERS[hash(d.slug) % COVERS.length];
    return {
      slug: d.slug,
      title: d.title,
      h1: d.h1,
      metaTitle: d.metaTitle,
      metaDescription: d.metaDescription,
      excerpt: d.excerpt,
      category: d.category,
      keyword: d.keyword,
      readMins: 8 + (hash(d.slug) % 4),
      date: isoDate(startIndex + i),
      updated: "2026-06-21",
      cover,
      coverAlt: d.title,
      sections: d.sections,
      faqs: d.faqs,
    };
  });
}
