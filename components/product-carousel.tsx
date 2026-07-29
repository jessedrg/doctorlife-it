"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { products } from "@/lib/data";
import { QuizTrigger } from "./quiz-trigger";

export function ProductCarousel() {
  const t = useTranslations("products.productCarousel");
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Size cards to exactly 1/3 of the wrapper on sm+, 85% on mobile
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    if (!wrapper || !track) return;

    const resize = () => {
      const isMobile = window.innerWidth < 640;
      const w = wrapper.offsetWidth;
      // gap between cards is 20px, 3 cards = 2 gaps = 40px
      const cardW = isMobile ? Math.round(w * 0.85) : Math.floor((w - 40) / 3);
      track.querySelectorAll<HTMLElement>("[data-card]").forEach((el) => {
        el.style.width = `${cardW}px`;
        el.style.minWidth = `${cardW}px`;
      });
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrapper);
    return () => ro.disconnect();
  }, []);

  const scrollByCard = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 20 : track.clientWidth * 0.85;
    track.scrollBy({ left: dir * step, behavior: "smooth" });
  };
  const prev = () => scrollByCard(-1);
  const next = () => scrollByCard(1);

  return (
    <div ref={wrapperRef} id="planes" className="scroll-mt-[110px] text-left">
      {/* primera visita */}
      <div className="mb-10 flex flex-col items-start gap-5 rounded-[28px] border border-sage/30 p-7 md:flex-row md:items-center md:justify-between" style={{ background: "rgba(205,217,160,.07)" }}>
        <div>
          <div className="text-[clamp(20px,2.2vw,26px)] font-light leading-[1.2]">
            {t("firstVisitTitle")}{" "}
            <span className="font-serif italic text-sage">{t("firstVisitHighlight")}</span>
          </div>
          <p className="mt-2 max-w-[52ch] text-[15px] leading-relaxed text-paper/70">
            {t("firstVisitDesc")}
          </p>
        </div>
        <QuizTrigger className="shrink-0 whitespace-nowrap rounded-full bg-sage px-7 py-[14px] text-[15px] font-semibold text-ink">
          {t("firstVisitCta")}
        </QuizTrigger>
      </div>

      <div className="mb-6 flex items-end justify-between">
        <div className="text-[clamp(22px,2.4vw,30px)] font-light">
          {t("choosePlan")} <span className="font-serif italic">{t("choosePlanHighlight")}</span>
        </div>
        <div className="flex gap-[10px]">
          <button type="button" onClick={prev} aria-label={t("prev")} className="flex h-[46px] w-[46px] cursor-pointer items-center justify-center rounded-full border border-paper/[.28] text-lg text-paper transition-all duration-200 hover:scale-105 hover:border-sage hover:bg-sage/15 active:scale-95" style={{ background: "rgba(246,240,230,.05)" }}>
            ‹
          </button>
          <button type="button" onClick={next} aria-label={t("next")} className="flex h-[46px] w-[46px] cursor-pointer items-center justify-center rounded-full border border-paper/[.28] text-lg text-paper transition-all duration-200 hover:scale-105 hover:border-sage hover:bg-sage/15 active:scale-95" style={{ background: "rgba(246,240,230,.05)" }}>
            ›
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth py-2"
        style={{ WebkitOverflowScrolling: "touch", overscrollBehaviorX: "contain" } as React.CSSProperties}
      >
        {products.map((p: typeof products[number]) => (
          <div
            key={p.name}
            data-card
            className="group flex flex-shrink-0 snap-start flex-col rounded-[28px] border p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(0,0,0,.35)]"
            style={{
              background: p.featured ? "rgba(86,96,58,.55)" : "rgba(40,44,30,.45)",
              borderColor: p.featured ? "rgba(205,217,160,.5)" : "rgba(246,240,230,.12)",
            }}
          >
            <div className="flex items-start justify-between">
              <span className="rounded-full bg-sage px-[11px] py-1 text-xs font-semibold text-ink">
                {p.tag}
              </span>
              <span className="rounded-full border border-paper/20 px-[10px] py-[5px] text-[10.5px] uppercase tracking-[.12em] text-paper/70">
                {t("medicalBadge")}
              </span>
            </div>
            <div className="mt-7 text-[22px] font-normal">{p.name}</div>
            <div className="mb-5 mt-[3px] text-sm leading-[1.4] text-paper/70">{p.subtitle}</div>

            {p.comingSoon ? (
              <div className="flex items-baseline gap-1">
                <span className="text-[22px] font-light text-paper/60">{t("comingSoon")}</span>
              </div>
            ) : (
              <div className="flex items-baseline gap-1">
                <span className="text-[28px] font-light text-sage">{p.price}</span>
                <span className="text-sm text-paper/55">{p.priceSuffix ?? "/mes"}</span>
              </div>
            )}

            <ul className="mb-7 mt-6 flex flex-col gap-[11px] border-t border-paper/[.12] pt-6">
              {p.features.map((f: string) => (
                <li key={f} className="flex items-start gap-[10px] text-[14px] leading-[1.35] text-paper/85">
                  <span className="mt-[2px] flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full bg-sage/25 text-[11px] text-sage">
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            {p.comingSoon ? (
              <div
                className="mt-auto w-full cursor-default rounded-full py-[13px] text-center text-[14.5px] font-semibold text-paper/55"
                style={{ background: "rgba(246,240,230,.05)", border: "1px dashed rgba(246,240,230,.22)" }}
                aria-disabled="true"
              >
                {t("comingSoon")}
              </div>
            ) : (
              <QuizTrigger
                plan={p.name}
                className="mt-auto w-full rounded-full py-[13px] text-center text-[14.5px] font-semibold"
                style={
                  p.featured
                    ? { background: "#cdd9a0", color: "#221d17" }
                    : { background: "rgba(246,240,230,.08)", color: "#f6f0e6", border: "1px solid rgba(246,240,230,.25)" }
                }
              >
                {t("startNow")}
              </QuizTrigger>
            )}
          </div>
        ))}
      </div>

      <p className="mx-auto mt-[22px] max-w-[80ch] text-center text-xs text-paper/50">
        {t("disclaimer", {
          free: t("free"),
          monthly: t("monthly"),
          pack: t("pack"),
          nutritionist: t("nutritionist"),
        })}
      </p>
    </div>
  );
}
