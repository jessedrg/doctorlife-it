import Image from "next/image";
import { QuizProvider } from "@/components/quiz-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  SITE_URL,
  BRAND,
  PILLAR,
  getAuthor,
  getRelated,
  formatDate,
  type Article,
  type Block,
} from "@/lib/articles";
import { Breadcrumbs } from "./breadcrumbs";
import { KeyTakeaways } from "./key-takeaways";
import { FAQSection } from "./faq-section";
import { CTABlock } from "./cta-block";
import { SourcesList } from "./sources-list";
import { MedicalDisclaimer } from "./medical-disclaimer";
import { AuthorCard } from "./author-card";
import { StickyCTA } from "./sticky-cta";

function renderBlock(block: Block, i: number) {
  switch (block.type) {
    case "p":
      return (
        <p key={i} className="mt-5 text-[18px] leading-[1.7] text-ink-soft">
          {block.text}
        </p>
      );
    case "h3":
      return (
        <h3 key={i} className="mt-9 text-[20px] font-medium leading-snug text-ink sm:text-[22px]">
          {block.text}
        </h3>
      );
    case "list":
      return (
        <ul key={i} className="mt-5 flex flex-col gap-3">
          {block.items.map((it) => (
            <li key={it} className="flex items-start gap-3 text-[18px] leading-[1.6] text-ink-soft">
              <span className="mt-[10px] h-[6px] w-[6px] flex-shrink-0 rounded-full bg-clay" />
              {it}
            </li>
          ))}
        </ul>
      );
    case "stat":
      return (
        <figure
          key={i}
          className="mt-7 rounded-[20px] border border-teal/30 bg-sage/15 px-7 py-6 text-center"
        >
          <div className="font-serif text-[clamp(28px,5vw,42px)] leading-none text-olive">
            {block.value}
          </div>
          <figcaption className="mt-2 text-[14.5px] leading-relaxed text-ink-soft">
            {block.label}
          </figcaption>
        </figure>
      );
    case "table":
      return (
        <figure key={i} className="mt-7 overflow-x-auto rounded-[18px] border border-ink/10">
          <table className="w-full border-collapse text-left text-[15px]">
            {block.caption && <caption className="sr-only">{block.caption}</caption>}
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
    case "quote":
      return (
        <blockquote
          key={i}
          className="mt-7 rounded-[20px] border-l-[3px] border-sage bg-cream/60 px-6 py-5 text-[17px] leading-relaxed text-ink"
        >
          {block.text}
        </blockquote>
      );
    default:
      return null;
  }
}

export function ArticleLayout({ article }: { article: Article }) {
  const author = getAuthor(article.authorSlug)!;
  const reviewer = getAuthor(article.reviewerSlug)!;
  const related = getRelated(article.slug);
  const url = `${SITE_URL}/${article.slug}`;
  const pillarUrl = `${SITE_URL}/${PILLAR.slug}`;

  // Inserta el CTA compacto tras la segunda sección.
  const midIndex = Math.min(2, article.body.length) - 1;

  const authorLd = (a: typeof author) => ({
    "@type": "Physician",
    name: a.name,
    jobTitle: a.jobTitle,
    description: a.shortBio,
    identifier: a.colegiado,
    url: `${SITE_URL}/autores/${a.slug}`,
  });

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    headline: article.h1,
    name: article.h1,
    description: article.metaDescription,
    image: `${SITE_URL}${article.cover}`,
    inLanguage: "es-ES",
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: authorLd(author),
    reviewedBy: authorLd(reviewer),
    lastReviewed: article.dateModified,
    publisher: {
      "@type": "MedicalOrganization",
      name: BRAND,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.png` },
    },
    about: { "@type": "MedicalEntity", name: article.category },
    citation: article.sources.map((s) => s.href),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: PILLAR.title, item: pillarUrl },
      { "@type": "ListItem", position: 3, name: article.title, item: url },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faq.map((f) => ({
      "@type": "Question",
      name: f.pregunta,
      acceptedAnswer: { "@type": "Answer", text: f.respuesta },
    })),
  };

  return (
    <QuizProvider>
      <div className="overflow-x-clip bg-paper">
        <Navbar />
        <main>
          <article className="mx-auto max-w-[760px] px-5 pb-4 pt-8 lg:max-w-[800px]">
            <Breadcrumbs
              items={[
                { label: "Inicio", href: "/" },
                { label: PILLAR.title, href: `/${PILLAR.slug}` },
                { label: article.title },
              ]}
            />

            <header className="mt-7">
              <span className="text-[13px] font-semibold uppercase tracking-[.16em] text-clay">
                {article.category}
              </span>
              <h1 className="mt-3 text-balance text-[clamp(30px,4.6vw,48px)] font-light leading-[1.07] tracking-[-.02em] text-ink">
                {article.h1}
              </h1>
              <div className="mt-5 flex flex-wrap items-center gap-3 text-[13.5px] text-ink-mute">
                <span>Actualizado el {formatDate(article.dateModified)}</span>
                <span aria-hidden>·</span>
                <span>{article.readMins} min de lectura</span>
              </div>

              <AuthorCard author={author} reviewer={reviewer} />
            </header>

            {/* Respuesta directa (answer-first / GEO) */}
            <div className="mt-8 rounded-[20px] border border-ink/10 bg-warm px-6 py-6">
              <p className="text-[19px] leading-[1.6] text-ink">{article.answerFirst}</p>
            </div>

            <KeyTakeaways items={article.keyTakeaways} />

            {article.body.map((section, idx) => (
              <section key={section.h2} className="mt-4">
                <h2 className="mt-12 text-balance text-[clamp(22px,2.8vw,30px)] font-normal leading-[1.15] text-ink">
                  {section.h2}
                </h2>
                {section.blocks.map((b, i) => renderBlock(b, i))}
                {idx === midIndex && (
                  <CTABlock variant="compact" source={`articulo:${article.slug}`} />
                )}
              </section>
            ))}

            <FAQSection faqs={article.faq} />

            <CTABlock variant="form" source={`articulo:${article.slug}`} />

            <SourcesList sources={article.sources} />

            <MedicalDisclaimer reviewer={`${reviewer.name} (${reviewer.colegiado})`} />

            {/* Enlace al pilar (enlazado interno bidireccional) */}
            <p className="mt-8 text-[15px] text-ink-soft">
              Esta guía forma parte de{" "}
              <a
                href={`/${PILLAR.slug}`}
                className="font-medium text-olive underline underline-offset-2"
              >
                {PILLAR.title}
              </a>
              .
            </p>
          </article>

          {related.length > 0 && (
            <section
              aria-labelledby="related-heading"
              className="mx-auto max-w-[1100px] px-5 pb-8 pt-12"
            >
              <h2 id="related-heading" className="mb-7 text-[clamp(22px,2.6vw,30px)] font-light text-ink">
                Sigue leyendo
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((p) => (
                  <a
                    key={p.slug}
                    href={`/${p.slug}`}
                    className="group flex flex-col overflow-hidden rounded-[22px] border border-ink/10 bg-warm no-underline transition-shadow hover:shadow-[0_18px_40px_-22px_rgba(34,29,23,.4)]"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={p.cover || "/placeholder.svg"}
                        alt={p.coverAlt}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <span className="text-[12px] font-semibold uppercase tracking-[.14em] text-clay">
                        {p.category}
                      </span>
                      <h3 className="mt-2 text-balance text-[18px] font-medium leading-snug text-ink">
                        {p.title}
                      </h3>
                      <span className="mt-3 text-[14px] font-medium text-olive">Leer artículo →</span>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}
        </main>
        <Footer />
        <StickyCTA />
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
    </QuizProvider>
  );
}
