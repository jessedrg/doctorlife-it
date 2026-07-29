import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuizProvider } from "@/components/quiz-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BlogCard } from "@/components/blog-card";
import { BlogFunnel } from "@/components/blog-funnel";
import { BlogInternalLinks } from "@/components/blog-internal-links";
import { StickyCTA } from "@/components/editorial/sticky-cta";
import { TrustBox } from "@/components/trustbox";
import { GeoGreeting } from "@/components/geo-greeting";
import { BeforeAfterCarousel } from "@/components/before-after-carousel";
import { BlogDoctorCard } from "@/components/blog-doctor-card";
import { posts, getPost, getRelated, seoTitle, seoDescription, drugInfo, SITE_URL, BRAND, MEDICAL_REVIEWER, type Block } from "@/lib/blog";
import { getInternalLinks } from "@/lib/blog-internal-links";
import { breadcrumbSchema } from "@/lib/seo";

export const dynamic = "force-static";
export const revalidate = 86400; // 24h ISR — se regenera en background sin bloquear el build
export const dynamicParams = true; // rutas no conocidas en build se generan on-demand

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: `Artículo no encontrado — ${BRAND}` };
  const url = `${SITE_URL}/blog/${post.slug}`;
  const optimizedTitle = seoTitle(post);
  const optimizedDescription = seoDescription(post);
  return {
    title: optimizedTitle,
    description: optimizedDescription,
    keywords: [post.keyword, "GLP-1", "pérdida de peso", "semaglutida", "tirzepatida", BRAND],
    authors: [{ name: MEDICAL_REVIEWER.name }],
    alternates: { canonical: url },
    openGraph: {
      title: optimizedTitle,
      description: optimizedDescription,
      url,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated,
      images: [{ url: post.cover }],
    },
  };
}

function renderBlock(block: Block, i: number) {
  if (block.type === "p") {
    return (
      <p key={i} className="mt-5 text-[17px] leading-[1.7] text-ink-soft">
        {block.text}
      </p>
    );
  }
  if (block.type === "list") {
    return (
      <ul key={i} className="mt-5 flex flex-col gap-3">
        {block.items.map((it) => (
          <li key={it} className="flex items-start gap-3 text-[17px] leading-[1.6] text-ink-soft">
            <span className="mt-[9px] h-[6px] w-[6px] flex-shrink-0 rounded-full bg-clay" />
            {it}
          </li>
        ))}
      </ul>
    );
  }
  if (block.type === "table") {
    return (
      <figure key={i} className="mt-7 overflow-x-auto rounded-[18px] border border-ink/10">
        <table className="w-full border-collapse text-left text-[15px]">
          {block.caption && (
            <caption className="sr-only">{block.caption}</caption>
          )}
          <thead>
            <tr className="bg-cream/70">
              {block.head.map((h) => (
                <th key={h} className="border-b border-ink/10 px-4 py-3 font-medium text-ink">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, r) => (
              <tr key={r} className="odd:bg-warm/40">
                {row.map((cell, c) => (
                  <td key={c} className="border-b border-ink/[.06] px-4 py-3 text-ink-soft">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </figure>
    );
  }
  if (block.type === "links") {
    return (
      <nav key={i} className="mt-7 rounded-[18px] border border-ink/10 bg-warm px-6 py-5">
        {block.title && (
          <p className="text-[13px] font-semibold uppercase tracking-[.14em] text-clay">{block.title}</p>
        )}
        <ul className="mt-3 flex flex-col gap-2">
          {block.items.map((l) => (
            <li key={l.href} className="flex items-start gap-2 text-[16px] leading-relaxed">
              <span aria-hidden className="mt-[2px] text-clay">→</span>
              <a href={l.href} className="text-ink underline decoration-clay/40 underline-offset-4 hover:decoration-clay">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  }
  return (
    <blockquote
      key={i}
      className="mt-7 rounded-[20px] border-l-[3px] border-sage bg-cream/60 px-6 py-5 text-[16px] leading-relaxed text-ink"
    >
      {block.text}
    </blockquote>
  );
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = getRelated(slug);
  const internalLinks = getInternalLinks(slug);
  const url = `${SITE_URL}/blog/${post.slug}`;
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });

  // Inserta el funnel tras la segunda sección
  const insertAt = Math.min(2, post.sections.length);

  const reviewer = {
    "@type": "Person",
    name: MEDICAL_REVIEWER.name,
    jobTitle: MEDICAL_REVIEWER.role,
    description: MEDICAL_REVIEWER.bio,
  };

  const publisher = {
    "@type": "Organization",
    name: BRAND,
    url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.png` },
  };

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    headline: post.h1,
    name: post.h1,
    description: post.metaDescription,
    image: `${SITE_URL}${post.cover}`,
    inLanguage: "es-ES",
    datePublished: post.date,
    dateModified: post.updated,
    keywords: post.keyword,
    author: reviewer,
    reviewedBy: reviewer,
    lastReviewed: post.updated,
    publisher,
    about: [
      { "@type": "MedicalEntity", name: post.category },
      // El fármaco se referencia como entidad médica (informativa), NO como
      // Drug/Product: evita que Google lo evalúe como "Fragmento de producto"
      // y exija offers/review/aggregateRating (no vendemos el medicamento).
      ...(drugInfo(post)
        ? [{ "@type": "MedicalEntity", name: drugInfo(post)!.name }]
        : []),
    ],
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  const breadcrumbLd = breadcrumbSchema([
    { name: "Inicio", url: SITE_URL },
    { name: "Blog", url: `${SITE_URL}/blog` },
    { name: post.title, url },
  ]);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <QuizProvider>
      <div className="overflow-x-clip bg-paper">
        <Navbar />
        <main>
          <article className="mx-auto max-w-[760px] px-5 pb-6 pt-10 lg:max-w-[820px] 2xl:max-w-[900px]">
            {/* breadcrumb */}
            <nav className="mb-8 flex items-center gap-2 text-[13px] text-ink-mute">
              <a href="/" className="no-underline hover:text-ink">Inicio</a>
              <span aria-hidden>/</span>
              <a href="/blog" className="no-underline hover:text-ink">Blog</a>
              <span aria-hidden>/</span>
              <span className="text-ink-soft">{post.category}</span>
            </nav>

            <span className="text-[13px] font-semibold uppercase tracking-[.16em] text-clay">
              {post.category}
            </span>
            <h1 className="mt-4 text-balance text-[clamp(30px,4.6vw,50px)] font-light leading-[1.06] tracking-[-.02em] text-ink">
              {post.h1}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-[13.5px] text-ink-mute">
              <span>Actualizado el {fmt(post.updated)}</span>
              <span aria-hidden>·</span>
              <span>{post.readMins} min de lectura</span>
            </div>
            <div className="mt-6 flex items-start gap-3 rounded-[16px] border border-ink/10 bg-warm px-5 py-4">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-ink font-serif text-[15px] font-bold text-paper">
                {MEDICAL_REVIEWER.name.split(" ")[1]?.[0] ?? "D"}
              </span>
              <div className="text-[13.5px] leading-snug">
                <p className="font-medium text-ink">
                  Revisado médicamente por {MEDICAL_REVIEWER.name}
                </p>
                <p className="text-ink-mute">{MEDICAL_REVIEWER.role}</p>
                <p className="text-ink-mute">{MEDICAL_REVIEWER.credentials}</p>
              </div>
            </div>
            <TrustBox theme="light" alignment="left" className="mt-5" />
            <GeoGreeting place={post.place} className="mt-5" />
          </article>

          <div className="mx-auto max-w-[760px] px-5 lg:max-w-[820px] 2xl:max-w-[900px]">
            <hr className="border-t border-ink/10" />
          </div>

          <article className="mx-auto max-w-[760px] px-5 pb-4 pt-2 lg:max-w-[820px] 2xl:max-w-[900px]">
            <p className="mt-8 text-[19px] leading-[1.6] text-ink">{post.excerpt}</p>

            {post.sections.map((section, idx) => (
              <section key={section.h2}>
                <h2 className="mt-12 text-balance text-[clamp(22px,2.8vw,30px)] font-normal leading-[1.15] text-ink">
                  {section.h2}
                </h2>
                {section.blocks.map((b, i) => renderBlock(b, i))}
                {idx === insertAt - 1 && <BlogFunnel />}
              </section>
            ))}

            {/* Casos reales antes / después */}
            <section className="mt-14 rounded-[28px] border border-ink/10 bg-warm px-5 py-8 sm:px-8">
              <h2 className="text-balance text-center text-[clamp(22px,2.8vw,30px)] font-normal leading-[1.15] text-ink">
                Casos reales con tratamiento GLP-1
              </h2>
              <p className="mx-auto mt-3 max-w-[440px] text-center text-[15px] leading-relaxed text-ink-soft">
                Personas que empezaron su plan con supervisión médica. Desliza para
                ver más casos.
              </p>
              <div className="mx-auto mt-6 max-w-[460px]">
                <BeforeAfterCarousel variant="light" />
              </div>
            </section>

            {/* Conoce a nuestro médico */}
            <BlogDoctorCard />

            {/* FAQ */}
            <section>
              <h2 className="mt-14 text-[clamp(22px,2.8vw,30px)] font-normal text-ink">
                Preguntas frecuentes
              </h2>
              <div className="mt-6 flex flex-col gap-3">
                {post.faqs.map((f) => (
                  <details
                    key={f.q}
                    className="group rounded-[18px] border border-ink/10 bg-warm px-6 py-5 open:bg-cream/50"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between text-[17px] font-medium text-ink">
                      {f.q}
                      <span className="ml-4 text-clay transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>

            <BlogFunnel title="¿List@ para empezar?" subtitle="Reserva tu primera visita gratis y empieza con un plan diseñado en torno a ti." image="/testimonials/daniel.png" imageAlt="Daniel, paciente de DoctorLife, sonriendo" />

            <p className="mt-8 rounded-[16px] bg-cream/50 px-5 py-4 text-[13px] leading-relaxed text-ink-mute">
              Este contenido es informativo y no sustituye el consejo médico. Los tratamientos GLP‑1 requieren
              valoración y receta de un profesional colegiado. Contenido revisado por {MEDICAL_REVIEWER.name} ({MEDICAL_REVIEWER.credentials}).
            </p>
          </article>

          {/* enlazado interno geográfico (silos por ciudad/fármaco) */}
          <BlogInternalLinks groups={internalLinks} />

          {/* relacionados */}
          {related.length > 0 && (
            <section className="mx-auto max-w-none px-3 pb-6 pt-10 sm:px-4 lg:px-5">
              <h2 className="mb-7 text-[clamp(22px,2.6vw,30px)] font-light text-ink">
                Sigue leyendo
              </h2>
              <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {related.map((p) => (
                  <BlogCard key={p.slug} post={p} />
                ))}
              </div>
            </section>
          )}
        </main>
        <Footer />
      </div>

      <StickyCTA />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
    </QuizProvider>
  );
}
