import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { BmiHero } from "@/components/tools/bmi-hero";
import { QuizTrigger } from "@/components/quiz-trigger";
import { QuizProvider } from "@/components/quiz-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SITE_URL, BRAND } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("calculators.bmi.meta");
  return {
    title: `${t("title")} | ${BRAND}`,
    description: t("description"),
    alternates: { canonical: `${SITE_URL}/herramientas/calculadora-imc` },
  };
}

export default async function CalculadoraImcPage() {
  const t = await getTranslations("calculators.bmi");
  const overview = t.raw("overview.cards") as { bmi: string; label: string; color: string; text: string }[];
  const faq = t.raw("faq.items") as { q: string; a: string }[];

  return (
    <QuizProvider>
      <Navbar />
      <main>
        {/* ── Interactive hero ── */}
        <BmiHero />

        {/* ── Overview ── */}
        <section className="bg-paper px-6 py-20 lg:px-16 xl:px-24" id="overview">
          <div className="mx-auto max-w-6xl">
            {/* breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-10">
              <ol className="flex items-center gap-2 text-[13px] text-ink-mute">
                <li><Link href="/" className="hover:text-ink">{t("breadcrumb.home")}</Link></li>
                <li aria-hidden>/</li>
                <li><Link href="/herramientas" className="hover:text-ink">{t("breadcrumb.tools")}</Link></li>
                <li aria-hidden>/</li>
                <li className="text-ink font-medium">{t("breadcrumb.current")}</li>
              </ol>
            </nav>

            <h2 className="text-4xl font-bold text-ink md:text-5xl">{t("overview.title")}</h2>
            <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-ink-soft">
              {t("overview.subtitle")}
            </p>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {overview.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col rounded-[24px] p-7"
                  style={{ backgroundColor: `${item.color}18`, border: `1px solid ${item.color}40` }}
                >
                  <span
                    className="mb-3 inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[.12em]"
                    style={{ backgroundColor: `${item.color}30`, color: item.color }}
                  >
                    {item.label}
                  </span>
                  <span className="mb-4 text-2xl font-bold text-ink" style={{ color: item.color }}>
                    BMI {item.bmi}
                  </span>
                  <p className="flex-1 text-[14.5px] leading-relaxed text-ink-soft">{item.text}</p>
                </div>
              ))}
            </div>

            {/* IMC formula explanation */}
            <div className="mt-16 rounded-[28px] bg-cream px-10 py-10 md:px-14">
              <h3 className="text-2xl font-bold text-ink">{t("overview.formulaTitle")}</h3>
              <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-ink-soft">
                {t("overview.formulaDesc")}
              </p>
              <div className="mt-7 inline-flex flex-col items-start gap-3 rounded-2xl bg-ink px-8 py-6 font-mono text-paper">
                <span className="text-paper/50 text-sm">{t("overview.formulaLabel")}</span>
                <span className="text-xl font-semibold tracking-tight">{t("overview.formulaText")}</span>
                <span className="text-paper/40 text-sm mt-1">{t("overview.formulaExample")} <strong className="text-amber">{t("overview.formulaResult")}</strong></span>
              </div>
              <p className="mt-6 text-[14px] leading-relaxed text-ink-mute max-w-2xl">
                {t("overview.formulaNote")}
              </p>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="bg-warm px-6 py-20 lg:px-16 xl:px-24">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-ink md:text-4xl">{t("faq.title")}</h2>
            <div className="mt-10 flex flex-col divide-y divide-ink/10">
              {faq.map(({ q, a }) => (
                <details key={q} className="group py-6">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[16.5px] font-semibold text-ink">
                    {q}
                    <span className="mt-0.5 shrink-0 text-ink-mute transition-transform duration-300 group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="bg-ink px-6 py-20 lg:px-16">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center md:flex-row md:text-left">
            <div className="flex-1">
              <span className="mb-3 inline-block rounded-full bg-sage/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[.14em] text-sage">
                {t("cta.badge")}
              </span>
              <h2 className="text-balance text-3xl font-bold text-paper md:text-4xl">
                {t("cta.title")}
              </h2>
              <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-paper/65">
                {t("cta.subtitle")}
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 md:items-end">
              <QuizTrigger className="rounded-full bg-sage px-8 py-4 text-[15px] font-semibold text-ink">
                {t("cta.ctaButton")}
              </QuizTrigger>
              <Link
                href="/planes"
                className="rounded-full border border-paper/20 px-8 py-4 text-[15px] font-medium text-paper/80 transition hover:border-paper/40 hover:text-paper"
              >
                {t("cta.viewPlans")}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </QuizProvider>
  );
}
