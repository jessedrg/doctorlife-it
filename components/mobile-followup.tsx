"use client";

import { useTranslations } from "next-intl";
import { QuizTrigger } from "./quiz-trigger";

export function MobileFollowup() {
  const t = useTranslations("ui.mobileFollowup");
  return (
    <section className="relative mx-auto max-w-none px-3 py-10 sm:px-4 lg:px-5">
      <div
        className="relative overflow-hidden rounded-[28px] p-6 sm:p-8 lg:flex lg:items-center lg:min-h-[260px] xl:min-h-[280px]"
        style={{
          background:
            "radial-gradient(110% 90% at 82% 50%, #33291c 0%, #1d160f 55%, #120c07 100%)",
          boxShadow: "0 0 80px 60px #f6f0e6",
        }}
      >
        {/* mano con móvil, a la derecha y centrada para que no se corte */}
        <img
          src="/doctor-mobile-hand.png"
          alt={t("altImage")}
          aria-hidden="true"
          className="absolute inset-y-0 right-0 h-full w-auto max-w-[42%] object-contain object-right sm:max-w-[36%]"
        />
        {/* copy a la izquierda */}
        <div className="relative flex w-full flex-col gap-3 pr-[42%] text-paper sm:pr-[36%]">
          <span className="inline-block w-fit rounded-full border border-amber/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-amber">
            {t("badge")}
          </span>
          <h2 className="m-0 text-[clamp(20px,2.6vw,36px)] font-light leading-[1.05] tracking-[-0.03em]">
            {t("title")}{" "}
            <span className="font-serif italic text-sage">{t("titleHighlight")}</span>
          </h2>
          <p className="max-w-[36ch] text-sm leading-relaxed text-paper/60">
            {t("subtitle")}
          </p>
          <QuizTrigger className="mt-2 w-fit rounded-full bg-paper px-6 py-2.5 text-sm font-medium text-[#1d160f] transition-opacity hover:opacity-85">
            {t("cta")}
          </QuizTrigger>
        </div>
      </div>
    </section>
  );
}
