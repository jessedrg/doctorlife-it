import { posts } from '../lib/blog.ts';
const pat = new Map();
for (const p of posts) {
  const s = p.slug
    .replace(/wegovy|mounjaro|ozempic|saxenda|semaglutida|tirzepatida|rybelsus|trulicity|victoza|zepbound/g,'{drug}')
    .replace(/-(madrid|barcelona|valencia|sevilla|zaragoza|malaga|murcia|bilbao|alicante|cordoba|valladolid|vigo|gijon)$/,'-{city}');
  // generic: collapse trailing known city by checking last segment against many
  const key = s.split('-').slice(0,4).join('-');
  pat.set(key, (pat.get(key)||0)+1);
}
const sorted=[...pat.entries()].sort((a,b)=>b[1]-a[1]).slice(0,40);
for(const [k,v] of sorted) console.log(v, k);
