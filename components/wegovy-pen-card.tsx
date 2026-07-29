"use client";

import { useTranslations } from "next-intl";
import { QuizTrigger } from "./quiz-trigger";
import { Reveal } from "./reveal";

/* Tick marks for the semicircular dose selector arc */
const TOTAL_TICKS = 22;
const ARC_START = -170; // degrees
const ARC_END = -10;
const ACTIVE_INDEX = 14; // roughly 7.2 mg position

function DoseArc() {
  return (
    <div className="relative mx-auto h-[120px] w-[340px] max-w-[90vw]">
      {/* active dose label */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 text-center">
        <span className="text-[15px] font-medium text-paper">7.2 mg</span>
      </div>

      {/* ticks rendered as absolutely-positioned lines around a circle */}
      <svg
        viewBox="0 0 340 120"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        {Array.from({ length: TOTAL_TICKS }).map((_, i) => {
          const t = i / (TOTAL_TICKS - 1);
          const angleDeg = ARC_START + t * (ARC_END - ARC_START);
          const angleRad = (angleDeg * Math.PI) / 180;
          const cx = 170;
          const cy = 130; // center below viewBox so arc curves upward
          const r = 100;
          const tickLen = i === ACTIVE_INDEX ? 18 : 10;
          const x1 = cx + r * Math.cos(angleRad);
          const y1 = cy + r * Math.sin(angleRad);
          const x2 = cx + (r + tickLen) * Math.cos(angleRad);
          const y2 = cy + (tickLen + r) * Math.sin(angleRad);
          const isActive = i === ACTIVE_INDEX;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isActive ? "#e3b582" : "rgba(246,240,230,0.45)"}
              strokeWidth={isActive ? 2.5 : 1.2}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
    </div>
  );
}

export function WegovyPenCard() {
  const t = useTranslations("ui.wegovyPenCard");
  return (
    <div
      className="grain relative overflow-hidden rounded-[26px] p-8 text-paper"
      style={{
        background:
          "radial-gradient(120% 80% at 50% 110%, #3a2a12 0%, #221a0c 50%, #140f07 100%)",
      }}
    >
      {/* ambient glow behind pen */}
      <div
        aria-hidden
        className="anim-glow pointer-events-none absolute left-1/2 top-[30%] h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(201,138,79,.28), transparent)",
          filter: "blur(24px)",
        }}
      />

      <div className="relative flex flex-col items-center text-center">
        {/* badge */}
        <Reveal>
          <span className="inline-block rounded-full border border-amber px-4 py-1.5 text-[13px] font-medium tracking-wide text-amber">
            {t("badge")}
          </span>
        </Reveal>

        {/* heading */}
        <Reveal>
          <h3 className="mt-5 text-[clamp(36px,5vw,64px)] font-light leading-[.95] tracking-[-0.03em]">
            {t("titlePrefix")}{" "}
            <span className="font-serif italic text-sage">{t("titleHighlight")}</span>
            <br />
            {t("titleSuffix")}
          </h3>
        </Reveal>

        {/* pen image */}
        <Reveal className="relative mt-6 h-[200px] w-full max-w-[360px]">
          <img
            src="/products/pen-horizontal.png"
            alt={t("altImage")}
            className="anim-floatB absolute inset-0 h-full w-full object-contain drop-shadow-[0_8px_32px_rgba(201,138,79,.35)]"
          />
        </Reveal>

        {/* dose arc selector */}
        <div className="mt-2">
          <DoseArc />
        </div>

        {/* CTA */}
        <Reveal className="mt-4">
          <QuizTrigger className="rounded-full bg-amber px-10 py-4 text-[15px] font-semibold text-ink transition-opacity hover:opacity-90">
            {t("cta")}
          </QuizTrigger>
        </Reveal>

        {/* disclaimer */}
        <p className="mt-5 max-w-[32ch] text-[11px] leading-relaxed text-paper/40">
          {t("disclaimer")}
        </p>
      </div>
    </div>
  );
}
