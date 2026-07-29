import { renderSitemapIndex } from "@/lib/sitemap-data";

// Índice de sitemaps: es la ÚNICA URL que necesitas enviar en Google Search
// Console. Apunta a los sitemaps hijos con nombre semántico.
export const revalidate = 86400; // 1 día

export async function GET() {
  return new Response(renderSitemapIndex(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
