import {
  getSitemapSegment,
  getSitemapSegments,
  renderUrlset,
} from "@/lib/sitemap-data";

export const revalidate = 86400; // 1 día

// Prerenderiza cada sitemap hijo (paginas.xml, articulos.xml, blog-1.xml, …).
export function generateStaticParams(): Array<{ name: string }> {
  return getSitemapSegments().map((s) => ({ name: `${s.name}.xml` }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  const segmentName = name.replace(/\.xml$/, "");
  const segment = getSitemapSegment(segmentName);

  if (!segment) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(renderUrlset(segment.urls), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
