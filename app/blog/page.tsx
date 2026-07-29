import type { Metadata } from "next";
import Link from "next/link";
import { QuizProvider } from "@/components/quiz-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BlogCard } from "@/components/blog-card";
import { BlogFunnel } from "@/components/blog-funnel";
import { BlogFilters } from "@/components/blog-filters";
import { posts, SITE_URL, type Post } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog DoctorLife — Wegovy, Mounjaro y pérdida de peso con GLP‑1",
  description:
    "Guías claras y médicas sobre Wegovy, Mounjaro, semaglutida y tirzepatida: precios, recetas y cómo empezar tu tratamiento de pérdida de peso en España.",
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: "Blog DoctorLife — Cuidado del peso con GLP‑1",
    description:
      "Guías sobre Wegovy, Mounjaro y pérdida de peso con GLP‑1: precios, recetas y cómo empezar con seguimiento médico.",
    url: `${SITE_URL}/blog`,
    type: "website",
  },
};

const PER_PAGE = 24;

/* Orden preferido de las categorías en los chips de filtro. */
const CATEGORY_ORDER = [
  "Wegovy",
  "Mounjaro",
  "Ozempic",
  "Saxenda",
  "Precios",
  "Comparativas",
  "Adelgazar",
  "Sin receta",
  "En investigación",
  "Guías",
];

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function orderedCategories(all: Post[]): string[] {
  const present = new Set(all.map((p) => p.category));
  const ordered = CATEGORY_ORDER.filter((c) => present.has(c));
  const extra = [...present].filter((c) => !CATEGORY_ORDER.includes(c)).sort();
  return [...ordered, ...extra];
}

function filterPosts(all: Post[], q: string, cat: string): Post[] {
  let list = all;
  if (cat) list = list.filter((p) => p.category === cat);
  if (q) {
    const terms = norm(q).split(/\s+/).filter(Boolean);
    list = list.filter((p) => {
      const hay = norm(`${p.title} ${p.h1} ${p.keyword} ${p.excerpt} ${p.category}`);
      return terms.every((t) => hay.includes(t));
    });
  }
  return list;
}

export default async function BlogIndex({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const cat = (sp.cat ?? "").trim();
  const pageNum = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);

  const categories = orderedCategories(posts);
  const isFiltering = Boolean(q) || Boolean(cat);

  const filtered = filterPosts(posts, q, cat);

  // Destacado solo en la vista por defecto (sin filtros). Se muestra como lead
  // en la página 1 y se excluye del grid en TODAS las páginas para que la
  // paginación sea consistente.
  const featured = posts.filter((p) => p.featured)[0] ?? posts[0];
  const pool = isFiltering ? filtered : filtered.filter((p) => p.slug !== featured.slug);
  const showLead = !isFiltering && pageNum === 1;

  const totalPages = Math.max(1, Math.ceil(pool.length / PER_PAGE));
  const safePage = Math.min(pageNum, totalPages);
  const start = (safePage - 1) * PER_PAGE;
  const pageItems = pool.slice(start, start + PER_PAGE);

  const buildHref = (page: number) => {
    const u = new URLSearchParams();
    if (q) u.set("q", q);
    if (cat) u.set("cat", cat);
    if (page > 1) u.set("page", String(page));
    const qs = u.toString();
    return qs ? `/blog?${qs}` : "/blog";
  };

  // Ventana de números de página alrededor de la página actual.
  const windowPages: number[] = [];
  const from = Math.max(1, safePage - 2);
  const to = Math.min(totalPages, safePage + 2);
  for (let i = from; i <= to; i++) windowPages.push(i);

  return (
    <QuizProvider>
      <div className="overflow-x-clip bg-paper">
        <Navbar />
        <main className="mx-auto max-w-none px-3 pb-10 pt-10 sm:px-4 lg:px-5">
          <header className="mx-auto max-w-[760px] py-12 text-center sm:py-16">
            <span className="text-[13px] font-semibold uppercase tracking-[.18em] text-clay">
              Blog DoctorLife
            </span>
            <h1 className="mt-4 text-balance text-[clamp(34px,5vw,58px)] font-light leading-[1.04] tracking-[-.02em] text-ink">
              Todo sobre el <span className="font-serif italic text-olive">cuidado del peso</span> con GLP‑1
            </h1>
            <p className="mx-auto mt-5 max-w-[52ch] text-pretty text-[17px] leading-relaxed text-ink-soft">
              Wegovy, Mounjaro, semaglutida, tirzepatida: precios, recetas y cómo empezar de forma segura y con seguimiento médico real.
            </p>
          </header>

          <div className="mx-auto max-w-[820px]">
            <BlogFilters categories={categories} activeCat={cat} query={q} />
          </div>

          {isFiltering && (
            <p className="mx-auto mt-8 max-w-[760px] text-center text-[14px] text-ink-mute">
              {pool.length === 0
                ? "No hemos encontrado guías que coincidan."
                : `${pool.length} ${pool.length === 1 ? "guía encontrada" : "guías encontradas"}`}
              {cat && ` en ${cat}`}
              {q && ` para «${q}»`}.
            </p>
          )}

          {showLead && (
            <div className="mt-10">
              <BlogCard post={featured} large />
            </div>
          )}

          {pageItems.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {pageItems.slice(0, 8).map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          ) : (
            !isFiltering && null
          )}

          {!isFiltering && pageItems.length > 8 && <BlogFunnel />}

          {pageItems.length > 8 && (
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {pageItems.slice(8).map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          )}

          {pool.length === 0 && isFiltering && (
            <div className="mx-auto mt-10 max-w-[520px] text-center">
              <Link
                href="/blog"
                className="inline-block rounded-full bg-ink px-7 py-[13px] text-[15px] font-semibold text-paper no-underline"
              >
                Ver todas las guías
              </Link>
            </div>
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <nav
              aria-label="Paginación del blog"
              className="mt-14 flex flex-wrap items-center justify-center gap-2"
            >
              {safePage > 1 ? (
                <Link
                  href={buildHref(safePage - 1)}
                  className="rounded-full border border-ink/12 bg-warm px-4 py-[9px] text-[14px] font-medium text-ink no-underline transition-colors hover:border-ink/25"
                  rel="prev"
                >
                  ← Anterior
                </Link>
              ) : (
                <span className="cursor-not-allowed rounded-full border border-ink/8 bg-warm px-4 py-[9px] text-[14px] font-medium text-ink-mute/50">
                  ← Anterior
                </span>
              )}

              {from > 1 && (
                <>
                  <Link
                    href={buildHref(1)}
                    className="rounded-full border border-ink/12 bg-warm px-[14px] py-[9px] text-[14px] font-medium text-ink no-underline hover:border-ink/25"
                  >
                    1
                  </Link>
                  {from > 2 && <span className="px-1 text-ink-mute">…</span>}
                </>
              )}

              {windowPages.map((n) => (
                <Link
                  key={n}
                  href={buildHref(n)}
                  aria-current={n === safePage ? "page" : undefined}
                  className={`rounded-full px-[14px] py-[9px] text-[14px] font-medium no-underline transition-colors ${
                    n === safePage
                      ? "bg-ink text-paper"
                      : "border border-ink/12 bg-warm text-ink hover:border-ink/25"
                  }`}
                >
                  {n}
                </Link>
              ))}

              {to < totalPages && (
                <>
                  {to < totalPages - 1 && <span className="px-1 text-ink-mute">…</span>}
                  <Link
                    href={buildHref(totalPages)}
                    className="rounded-full border border-ink/12 bg-warm px-[14px] py-[9px] text-[14px] font-medium text-ink no-underline hover:border-ink/25"
                  >
                    {totalPages}
                  </Link>
                </>
              )}

              {safePage < totalPages ? (
                <Link
                  href={buildHref(safePage + 1)}
                  className="rounded-full border border-ink/12 bg-warm px-4 py-[9px] text-[14px] font-medium text-ink no-underline transition-colors hover:border-ink/25"
                  rel="next"
                >
                  Siguiente →
                </Link>
              ) : (
                <span className="cursor-not-allowed rounded-full border border-ink/8 bg-warm px-4 py-[9px] text-[14px] font-medium text-ink-mute/50">
                  Siguiente →
                </span>
              )}
            </nav>
          )}

        </main>
        <Footer />
      </div>
    </QuizProvider>
  );
}
