import type { Metadata } from "next";
import Link from "next/link";
import { QuizProvider } from "@/components/quiz-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Breadcrumbs } from "@/components/editorial/breadcrumbs";
import { CTABlock } from "@/components/editorial/cta-block";
import { JsonLd } from "@/components/seo/json-ld";
import { authors, getArticlesByAuthor } from "@/lib/articles";
import { SITE_URL, BRAND, breadcrumbSchema, itemListSchema } from "@/lib/seo";

const URL = `${SITE_URL}/autores`;

export const metadata: Metadata = {
  title: `Equipo médico — autores y revisores | ${BRAND}`,
  description:
    "Conoce al equipo médico de DoctorLife: especialistas colegiados en endocrinología y medicina interna que escriben y revisan todo nuestro contenido clínico.",
  alternates: { canonical: URL },
  openGraph: {
    title: `Equipo médico de ${BRAND}`,
    description:
      "Médicos colegiados que escriben y revisan el contenido clínico de DoctorLife.",
    url: URL,
    type: "website",
  },
};

export default function AutoresPage() {
  return (
    <QuizProvider>
      <div className="overflow-x-clip bg-paper">
        <Navbar />
        <main>
          <div className="mx-auto max-w-[820px] px-5 pb-4 pt-10">
            <Breadcrumbs
              items={[
                { label: "Inicio", href: "/" },
                { label: "Autores" },
              ]}
            />

            <header className="mt-8 max-w-[640px]">
              <span className="text-[13px] font-semibold uppercase tracking-[.14em] text-clay">
                Equipo médico DoctorLife
              </span>
              <h1 className="mt-3 text-balance text-[clamp(30px,4.6vw,46px)] font-light leading-[1.07] tracking-[-.02em] text-ink">
                Quién escribe y revisa nuestro contenido
              </h1>
              <p className="mt-5 text-pretty text-[17.5px] leading-[1.7] text-ink-soft">
                Todo el contenido clínico de DoctorLife está escrito o revisado por médicos
                colegiados con experiencia real en obesidad, metabolismo y tratamiento con
                análogos del GLP‑1. Sin atajos ni promesas vacías: información honesta para que
                decidas con criterio.
              </p>
            </header>

            <section aria-labelledby="team-heading" className="mt-12">
              <h2 id="team-heading" className="sr-only">Listado del equipo médico</h2>
              <div className="flex flex-col gap-5">
                {authors.map((a) => {
                  const count = getArticlesByAuthor(a.slug).length;
                  return (
                    <Link
                      key={a.slug}
                      href={`/autores/${a.slug}`}
                      className="group flex items-start gap-5 rounded-[22px] border border-ink/10 bg-warm p-6 no-underline transition-shadow hover:shadow-[0_14px_32px_-16px_rgba(34,29,23,.35)]"
                    >
                      <span className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-cream-2 text-[26px] font-medium text-ink-soft">
                        {a.name.split(" ").slice(-1)[0][0]}
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-balance text-[20px] font-medium leading-snug text-ink">
                          {a.name}
                        </h3>
                        <p className="mt-1 text-[15px] font-medium text-ink-soft">{a.jobTitle}</p>
                        <p className="mt-1 text-[13px] text-ink-mute">{a.colegiado}</p>
                        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{a.shortBio}</p>
                        <span className="mt-3 inline-block text-[14px] font-semibold text-olive">
                          Ver perfil{count > 0 ? ` · ${count} ${count === 1 ? "artículo" : "artículos"}` : ""} →
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            <div className="pb-4 pt-12">
              <CTABlock variant="form" source="autores:index" />
            </div>
          </div>
        </main>
        <Footer />
      </div>

      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Inicio", url: SITE_URL },
            { name: "Autores", url: URL },
          ]),
          itemListSchema(
            authors.map((a) => ({ name: a.name, url: `${SITE_URL}/autores/${a.slug}` })),
          ),
        ]}
      />
    </QuizProvider>
  );
}
