import { posts, SITE_URL } from "@/lib/blog";
import { articles, authors, PILLAR } from "@/lib/articles";
import { MUNICIPIO_SLUG_PREFIX } from "@/lib/blog-municipios";

/* ───────────────────────────────────────────────────────────
   Datos del sitemap, compartidos por el índice y por cada
   sitemap hijo. En vez de trozos anónimos (0.xml, 1.xml…) los
   dividimos en SEGMENTOS con nombre semántico:

     /sitemap.xml            → índice (lo que envías a Search Console)
     /sitemaps/paginas.xml   → home, legales y herramientas
     /sitemaps/articulos.xml → pillar + artículos editoriales + autores
     /sitemaps/blog-1.xml     → posts del blog (bloques de 10.000)
     /sitemaps/blog-2.xml
     …

   Google limita a 50.000 URLs por archivo; troceamos el blog en
   bloques de 10.000 para ir muy holgados y acelerar el rastreo.
   ─────────────────────────────────────────────────────────── */

export const SITEMAP_CHUNK = 10000;

export type SitemapUrl = {
  url: string;
  lastModified: Date;
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority: number;
};

export type SitemapSegment = {
  /** Nombre de archivo sin extensión, p. ej. "paginas" o "blog-1". */
  name: string;
  urls: SitemapUrl[];
};

function staticUrls(now: Date): SitemapUrl[] {
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/${PILLAR.slug}`, lastModified: now, changeFrequency: "monthly", priority: 0.95 },
    { url: `${SITE_URL}/privacidad`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/legal/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terminos`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/legal/terms-of-services`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/cookies`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/herramientas/calculadora-imc`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${SITE_URL}/herramientas/calculadora-tdee`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${SITE_URL}/herramientas/calculadora-deficit-calorico`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${SITE_URL}/herramientas/calculadora-proteina-diaria`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
  ];
}

function articleUrls(now: Date): SitemapUrl[] {
  const editorial: SitemapUrl[] = articles.map((a) => ({
    url: `${SITE_URL}/${a.slug}`,
    lastModified: new Date(a.dateModified),
    changeFrequency: "monthly",
    priority: 0.85,
  }));
  const authorPages: SitemapUrl[] = authors.map((a) => ({
    url: `${SITE_URL}/autores/${a.slug}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.5,
  }));
  return [...editorial, ...authorPages];
}

function toUrl(p: { slug: string; updated: string }): SitemapUrl {
  return {
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.updated),
    changeFrequency: "monthly",
    priority: 0.8,
  };
}

/** Construye la lista de segmentos con nombre semántico. */
export function getSitemapSegments(): SitemapSegment[] {
  const now = new Date();
  const segments: SitemapSegment[] = [
    { name: "paginas", urls: staticUrls(now) },
    { name: "articulos", urls: articleUrls(now) },
  ];

  // Ogni cluster grande va nel proprio segmento per monitorarlo
  // separatamente in GSC: municipios-N (clinica perdita di peso per comune).
  const blog: SitemapUrl[] = [];
  const municipios: SitemapUrl[] = [];
  for (const p of posts) {
    if (p.slug.startsWith(MUNICIPIO_SLUG_PREFIX)) municipios.push(toUrl(p));
    else blog.push(toUrl(p));
  }

  const addChunks = (name: string, urls: SitemapUrl[], min = 0) => {
    const chunks = Math.max(min, Math.ceil(urls.length / SITEMAP_CHUNK));
    for (let i = 0; i < chunks; i++) {
      segments.push({
        name: `${name}-${i + 1}`,
        urls: urls.slice(i * SITEMAP_CHUNK, (i + 1) * SITEMAP_CHUNK),
      });
    }
  };

  addChunks("blog", blog, 1); // blog-1, blog-2, …
  addChunks("municipios", municipios); // municipios-1, …

  return segments;
}

/** Devuelve un segmento por su nombre (sin extensión). */
export function getSitemapSegment(name: string): SitemapSegment | undefined {
  return getSitemapSegments().find((s) => s.name === name);
}

/* ── Serialización XML ── */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Renderiza un sitemap hijo (<urlset>). */
export function renderUrlset(urls: SitemapUrl[]): string {
  const body = urls
    .map(
      (u) =>
        `  <url>\n` +
        `    <loc>${escapeXml(u.url)}</loc>\n` +
        `    <lastmod>${u.lastModified.toISOString()}</lastmod>\n` +
        `    <changefreq>${u.changeFrequency}</changefreq>\n` +
        `    <priority>${u.priority}</priority>\n` +
        `  </url>`,
    )
    .join("\n");
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${body}\n` +
    `</urlset>\n`
  );
}

/** Renderiza el índice de sitemaps (<sitemapindex>). */
export function renderSitemapIndex(): string {
  const segments = getSitemapSegments();
  const body = segments
    .map((s) => {
      const lastmod = s.urls.reduce<Date>(
        (max, u) => (u.lastModified > max ? u.lastModified : max),
        new Date(0),
      );
      const stamp = (lastmod.getTime() > 0 ? lastmod : new Date()).toISOString();
      return (
        `  <sitemap>\n` +
        `    <loc>${escapeXml(`${SITE_URL}/sitemaps/${s.name}.xml`)}</loc>\n` +
        `    <lastmod>${stamp}</lastmod>\n` +
        `  </sitemap>`
      );
    })
    .join("\n");
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${body}\n` +
    `</sitemapindex>\n`
  );
}
