import { getTranslations } from "next-intl/server";
import { Reveal } from "./reveal";
import { QuizTrigger } from "./quiz-trigger";
import { WegovyPenCard } from "./wegovy-pen-card";

export async function Transformation() {
  const t = await getTranslations("ui.transformation");
  return (
    <section id="transform" className="mx-auto max-w-none scroll-mt-[90px] px-3 pt-24 sm:px-4 lg:px-5">

      {/* Mobile: sin fondo gris — solo el heading y las cards */}
      {/* Desktop: fondo gris completo con grain y gradiente */}
      <div className="lg:hidden">
        {/* Heading */}
        <Reveal className="text-center">
          <div className="text-[13px] uppercase tracking-[.16em] text-ink-mute">{t("badge")}</div>
          <h2 className="mt-[10px] text-[clamp(34px,4.8vw,62px)] font-light leading-none tracking-[-.02em] text-ink text-balance">
            {t("titleLine1")}
            <br />
            {t("titleLine2")} <span className="font-serif italic">{t("titleLine3")}</span> {t("titleLine4")}
          </h2>
          <div className="mt-[26px] flex flex-wrap justify-center gap-3">
            <QuizTrigger className="rounded-full bg-ink px-[30px] py-[13px] text-[15px] font-medium text-paper">
              {t("ctaStart")}
            </QuizTrigger>
            <QuizTrigger className="rounded-full border border-ink/30 bg-transparent px-[30px] py-[13px] text-[15px] font-medium text-ink">
              {t("ctaCheck")}
            </QuizTrigger>
          </div>
        </Reveal>

        {/* Cards en mobile — solo WegovyPenCard */}
        <div className="mt-8 flex flex-col gap-4">
          <WegovyPenCard />
        </div>
      </div>

      {/* Desktop: fondo gris con grain — solo WegovyPenCard */}
      <Reveal className="grain relative hidden min-h-[680px] overflow-hidden rounded-[40px] p-[54px] text-paper lg:block">
        <div className="absolute inset-0" style={{ background: "linear-gradient(165deg,#7d8a9a 0%,#4f5b63 40%,#2c3439 100%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(70% 60% at 30% 12%,rgba(246,240,230,.42),transparent 55%),radial-gradient(80% 70% at 90% 95%,rgba(40,48,52,.6),transparent 60%)" }} />

        <div className="relative z-[2] text-center">
          <div className="text-[13px] uppercase tracking-[.16em] text-paper/70">{t("badge")}</div>
          <h2 className="mt-[10px] text-[clamp(34px,4.8vw,62px)] font-light leading-none tracking-[-.02em] text-balance">
            {t("titleLine1")}
            <br />
            {t("titleLine2")} <span className="font-serif italic">{t("titleLine3")}</span> {t("titleLine4")}
          </h2>
          <div className="mt-[26px] flex justify-center gap-3">
            <QuizTrigger className="rounded-full bg-warm px-[30px] py-[13px] text-[15px] font-medium text-ink">
              {t("ctaStart")}
            </QuizTrigger>
            <QuizTrigger className="rounded-full border border-paper/40 px-[30px] py-[13px] text-[15px] font-medium text-paper" style={{ background: "rgba(246,240,230,.12)" }}>
              {t("ctaCheck")}
            </QuizTrigger>
          </div>
        </div>

        {/* Solo WegovyPenCard */}
        <div className="relative z-[2] mt-[46px]">
          <WegovyPenCard />
        </div>
      </Reveal>
    </section>
  );
}
