import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { QuizProvider } from "@/components/quiz-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Breadcrumbs } from "@/components/editorial/breadcrumbs";
import { CTABlock } from "@/components/editorial/cta-block";
import { StickyCTA } from "@/components/editorial/sticky-cta";
import {
  SITE_URL,
  BRAND,
  authors,
  getAuthor,
  getArticlesByAuthor,
  formatDate,
} from "@/lib/articles";

export const dynamic = "force-static";
export const revalidate = 86400; // 24h ISR
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) return {};

  const url = `${SITE_URL}/autores/${slug}`;
  return {
    title: `${author.name} — ${author.jobTitle} | ${BRAND}`,
    description: author.shortBio,
    alternates: { canonical: url },
    openGraph: {
      type: "profile",
      url,
      title: `${author.name} — ${author.jobTitle}`,
      description: author.shortBio,
    },
  };
}

export default async function AutorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) notFound();

  const byAuthor = getArticlesByAuthor(slug);

  const authorLd = {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: author.name,
    jobTitle: author.jobTitle,
    description: author.shortBio,
    identifier: author.colegiado,
    url: `${SITE_URL}/autores/${slug}`,
    worksFor: {
      "@type": "MedicalOrganization",
      name: BRAND,
      url: SITE_URL,
    },
  };

  return (
    <QuizProvider>
      <div className="overflow-x-clip bg-paper">
        <Navbar />
        <main>
          <div className="mx-auto max-w-[820px] px-5 pb-4 pt-10">
            <Breadcrumbs
              items={[
                { label: "Inicio", href: "/" },
                { label: "Autores", href: "/autores" },
                { label: author.name },
              ]}
            />

            {/* Ficha de autor */}
            <header className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-10">
              <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full bg-cream-2 text-[38px] font-medium text-ink-soft sm:h-28 sm:w-28">
                {author.name.split(" ").slice(-1)[0][0]}
              </div>
              <div className="min-w-0">
                <span className="text-[13px] font-semibold uppercase tracking-[.14em] text-clay">
                  Equipo médico DoctorLife
                </span>
                <h1 className="mt-2 text-balance text-[clamp(28px,4vw,40px)] font-light leading-[1.1] tracking-[-0.02em] text-ink">
                  {author.name}
                </h1>
                <p className="mt-2 text-[16px] font-medium text-ink-soft">{author.jobTitle}</p>
                <p className="mt-1 text-[13px] text-ink-mute">{author.colegiado}</p>
              </div>
            </header>

            {/* Bio */}
            <section aria-labelledby="bio-heading" className="mt-10">
              <h2 id="bio-heading" className="sr-only">
                Biografía
              </h2>
              <div className="flex flex-col gap-4">
                {author.bio.map((paragraph, i) => (
                  <p key={i} className="text-[17.5px] leading-[1.7] text-ink-soft">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>

            {/* Experiencia */}
            <section aria-labelledby="exp-heading" className="mt-10">
              <h2
                id="exp-heading"
                className="mb-5 text-[clamp(20px,2.4vw,26px)] font-light text-ink"
              >
                Formación y experiencia
              </h2>
              <ul className="flex flex-col gap-3">
                {author.experience.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-[16.5px] leading-relaxed text-ink-soft"
                  >
                    <span className="mt-[9px] h-[6px] w-[6px] flex-shrink-0 rounded-full bg-olive" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {/* Artículos firmados */}
            {byAuthor.length > 0 && (
              <section aria-labelledby="articles-heading" className="mt-12">
                <h2
                  id="articles-heading"
                  className="mb-7 text-[clamp(20px,2.4vw,26px)] font-light text-ink"
                >
                  Artículos firmados o revisados
                </h2>
                <div className="flex flex-col gap-4">
                  {byAuthor.map((a) => (
                    <a
                      key={a.slug}
                      href={`/${a.slug}`}
                      className="group flex items-start gap-5 rounded-[18px] border border-ink/10 bg-warm p-4 no-underline transition-shadow hover:shadow-[0_12px_28px_-14px_rgba(34,29,23,.35)] sm:p-5"
                    >
                      <div className="relative hidden h-[72px] w-[120px] flex-shrink-0 overflow-hidden rounded-[12px] sm:block">
                        <Image
                          src={a.cover || "/placeholder.svg"}
                          alt={a.coverAlt}
                          fill
                          sizes="120px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[11.5px] font-semibold uppercase tracking-[.14em] text-clay">
                          {a.category}
                        </span>
                        <h3 className="mt-1 text-balance text-[16px] font-medium leading-snug text-ink">
                          {a.title}
                        </h3>
                        <p className="mt-1 text-[13px] text-ink-mute">
                          Actualizado el {formatDate(a.dateModified)} &middot; {a.readMins} min
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            )}

            <div className="pb-4 pt-4">
              <CTABlock variant="form" source={`autor:${slug}`} />
            </div>
          </div>
        </main>
        <Footer />
        <StickyCTA />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(authorLd) }}
      />
    </QuizProvider>
  );
}
