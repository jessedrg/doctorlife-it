import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { QuizProvider } from "@/components/quiz-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { QuizTrigger } from "@/components/quiz-trigger";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_URL, BRAND, breadcrumbSchema, itemListSchema } from "@/lib/seo";

const URL = `${SITE_URL}/herramientas`;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.herramientas");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: URL },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: URL,
      type: "website",
    },
  };
}

const TOOL_HREFS = [
  "/herramientas/calculadora-imc",
  "/herramientas/calculadora-tdee",
];
const TOOL_KEYS = ["bmi", "tdee"] as const;

export default async function HerramientasPage() {
  const t = await getTranslations("pages.herramientas");
  const TOOLS = TOOL_KEYS.map((key, i) => ({
    href: TOOL_HREFS[i],
    title: t(`tools.${key}.title`),
    desc: t(`tools.${key}.desc`),
    tag: t(`tools.${key}.tag`),
  }));
  const RELATED = t.raw("related") as { href: string; label: string }[];
  return (
    <QuizProvider>
      <div className="overflow-x-clip bg-paper">
        <Navbar />
        <main>
          <div className="mx-auto max-w-[1100px] px-5 pb-6 pt-10">
            {/* breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex items-center gap-2 text-[13px] text-ink-mute">
                <li><Link href="/" className="hover:text-ink">{t("breadcrumbHome")}</Link></li>
                <li aria-hidden>/</li>
                <li className="font-medium text-ink">{t("breadcrumbTools")}</li>
              </ol>
            </nav>

            <header className="max-w-[680px]">
              <span className="text-[13px] font-semibold uppercase tracking-[.18em] text-clay">
                {t("badge")}
              </span>
              <h1 className="mt-4 text-balance text-[clamp(34px,5vw,54px)] font-light leading-[1.05] tracking-[-.02em] text-ink">
                {t("title")} <span className="font-serif italic text-olive">{t("titleHighlight")}</span>
              </h1>
              <p className="mt-5 text-pretty text-[17px] leading-relaxed text-ink-soft">
                {t("description")}
              </p>
            </header>

            {/* Grid de herramientas */}
            <section aria-labelledby="tools-heading" className="mt-12">
              <h2 id="tools-heading" className="sr-only">{t("toolsListHeading")}</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {TOOLS.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="group flex flex-col rounded-[24px] border border-ink/10 bg-warm p-7 no-underline transition-shadow hover:shadow-[0_18px_40px_-22px_rgba(34,29,23,.4)]"
                  >
                    <span className="mb-4 inline-block w-fit rounded-full bg-sage/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[.12em] text-olive">
                      {tool.tag}
                    </span>
                    <h3 className="text-balance text-[22px] font-medium leading-snug text-ink">
                      {tool.title}
                    </h3>
                    <p className="mt-3 flex-1 text-[15.5px] leading-relaxed text-ink-soft">
                      {tool.desc}
                    </p>
                    <span className="mt-5 text-[14px] font-semibold text-olive">
                      {t("openCalculator")}
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            {/* Enlazado interno hacia contenido relacionado */}
            <section aria-labelledby="related-heading" className="mt-14 rounded-[24px] border border-ink/10 bg-cream/50 px-7 py-7">
              <h2 id="related-heading" className="text-[13px] font-semibold uppercase tracking-[.14em] text-clay">
                {t("relatedTitle")}
              </h2>
              <ul className="mt-4 flex flex-col gap-3">
                {RELATED.map((r) => (
                  <li key={r.href} className="flex items-start gap-2 text-[16px] leading-relaxed">
                    <span aria-hidden className="mt-[2px] text-clay">→</span>
                    <Link
                      href={r.href}
                      className="text-ink underline decoration-clay/40 underline-offset-4 hover:decoration-clay"
                    >
                      {r.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* CTA final */}
          <section className="mx-auto mt-12 max-w-[1100px] px-5 pb-16">
            <div className="flex flex-col items-center gap-8 rounded-[28px] bg-ink px-8 py-12 text-center md:flex-row md:px-14 md:text-left">
              <div className="flex-1">
                <span className="mb-3 inline-block rounded-full bg-sage/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[.14em] text-sage">
                  {t("ctaBadge")}
                </span>
                <h2 className="text-balance text-3xl font-bold text-paper md:text-4xl">
                  {t("ctaTitle")}
                </h2>
                <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-paper/65">
                  {t("ctaDesc")}
                </p>
              </div>
              <div className="shrink-0">
                <QuizTrigger className="rounded-full bg-sage px-8 py-4 text-[15px] font-semibold text-ink">
                  {t("ctaButton")}
                </QuizTrigger>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>

      <JsonLd
        data={[
          breadcrumbSchema([
            { name: t("breadcrumbHome"), url: SITE_URL },
            { name: t("breadcrumbTools"), url: URL },
          ]),
          itemListSchema(
            TOOLS.map((tool) => ({ name: tool.title, url: `${SITE_URL}${tool.href}` })),
          ),
        ]}
      />
    </QuizProvider>
  );
}
