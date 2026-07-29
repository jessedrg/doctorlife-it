import { posts } from "../lib/blog.ts";

console.log("TOTAL_POSTS", posts.length);

// Desglose por prefijo/patrón de slug
const buckets = {};
for (const p of posts) {
  const s = p.slug;
  let key = "otros";
  if (/^comprar-/.test(s)) key = "comprar-*";
  else if (/^precio-/.test(s)) key = "precio-*";
  else if (/^clinica-/.test(s)) key = "clinica-*";
  else if (/^endocrino-/.test(s)) key = "endocrino-*";
  else if (/^receta-/.test(s)) key = "receta-*";
  else if (/-provincia-|^glp1-|-espana$/.test(s)) key = "provincia/nacional";
  buckets[key] = (buckets[key] || 0) + 1;
}
console.log(JSON.stringify(buckets, null, 2));

// Comprobar duplicados de slug
const seen = new Set();
let dups = 0;
for (const p of posts) {
  if (seen.has(p.slug)) dups++;
  seen.add(p.slug);
}
console.log("SLUGS_UNICOS", seen.size, "DUPLICADOS", dups);
