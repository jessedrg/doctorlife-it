"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Reveal } from "./reveal";
import { Counter } from "./counter";
import { QuizTrigger } from "./quiz-trigger";
import { metrics, LOSS_STAT } from "@/lib/data";

export function ImmersiveProduct() {
  const t = useTranslations("ui.immersiveProduct");
  const sectionRef = useRef<HTMLElement>(null);

  // Set height so the section fills exactly the viewport when scrolled into view.
  // Strategy: when section.scrollTop === 0, the section top is at window.scrollY
  // below page top. The sticky nav always occupies the top. So:
  // visibleHeight when section is at top of scroll = vh - nav.offsetHeight - section.marginTop
  // We simply measure nav.offsetHeight at runtime — no hardcoding.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const setHeight = () => {
      // Sum the heights of ALL sticky/fixed elements that appear before this
      // section in the DOM — announcement bar + nav both count.
      const seen = new Set<HTMLElement>();
      const allEls = Array.from(document.querySelectorAll<HTMLElement>("*"));
      let headerH = 0;
      for (const el of allEls) {
        if (el === section) break;
        if (seen.has(el)) continue;
        const pos = getComputedStyle(el).position;
        if (pos === "sticky" || pos === "fixed") {
          // Only count top-level sticky bars (direct children of body or main wrapper)
          const parentPos = getComputedStyle(el.parentElement!).position;
          if (parentPos !== "sticky" && parentPos !== "fixed") {
            headerH += el.offsetHeight;
            seen.add(el);
          }
        }
      }
      if (headerH === 0) headerH = 106; // safe fallback
      const mt = parseFloat(getComputedStyle(section).marginTop) || 0;
      // 8px breathing room at bottom
      const viewportFit = window.innerHeight - headerH - mt - 8;
      let h = viewportFit;
      // On large/wide screens the object-cover video scales up and crops the
      // bottom of the pen. Grow the card height (based on its width) so the full
      // video is revealed, while never going below the viewport-fit height.
      if (window.innerWidth >= 1024) {
        const targetByWidth = Math.round(section.offsetWidth * 0.7);
        h = Math.max(viewportFit, Math.min(targetByWidth, viewportFit * 1.45));
      }
      section.style.height = `${Math.max(h, 400)}px`;
    };

    const timer = setTimeout(setHeight, 150);
    window.addEventListener("resize", setHeight, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", setHeight);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="product"
      className="grain relative scroll-mt-20 overflow-hidden text-paper"
      style={{
        margin: "clamp(12px, 1.5vw, 20px) clamp(12px, 1.5vw, 20px) 0",
        borderRadius: "44px 44px 0 0",
        // Height is overwritten by JS useEffect above; fallback for SSR
        height: "calc(100svh - 120px)",
        // Fondo oscuro cálido: las zonas transparentes del PNG de las plumas
        // conservan el mismo look oscuro que tenía el vídeo.
        backgroundColor: "#120c07",
      }}
    >
      {/* imagen de fondo con las plumas (reemplaza la animación en vídeo) */}
      <img
        src="/products/pens.png"
        alt={t("altImage")}
        className="absolute inset-0 h-full w-full object-contain p-8 md:p-16"
        style={{ objectPosition: "center center" }}
      />
      {/* overlay oscuro para legibilidad del texto */}
      <div className="absolute inset-0 bg-black/50 md:bg-black/40" />
      {/* fundido suave hacia la sección siguiente */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0"
        style={{
          height: "55%",
          background: "linear-gradient(to bottom, transparent 0%, rgba(18,12,7,0.55) 50%, #120c07 100%)",
        }}
      />

      {/* contenido en flex column que ocupa toda la altura */}
      {/* pb-safe: extra bottom padding so metrics are never hidden behind mobile browser bar */}
      <div
        className="relative flex h-full flex-col items-center justify-between px-4 pt-10 text-center sm:px-6 sm:pt-14 lg:px-8"
        style={{ paddingBottom: "max(24px, calc(env(safe-area-inset-bottom, 0px) + 20px))" }}
      >

        {/* título + párrafo + CTA */}
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <Reveal>
            <h2 className="m-0 text-[clamp(28px,5vw,78px)] font-light leading-[.96] tracking-[-.03em]">
              {t("titleLine1")}
              <br />
              <span className="font-serif italic text-sage">{t("titleLine2")}</span> {t("titleLine3")}
            </h2>
          </Reveal>
          <Reveal>
            <p className="max-w-[32ch] text-[clamp(14px,1.8vw,22px)] font-light leading-[1.35] text-paper/80">
              <span className="text-sage">{t("subtitle", { loss: LOSS_STAT })}</span>{" "}
              {t("subtitleSuffix")}
            </p>
          </Reveal>
          <Reveal>
            <QuizTrigger className="rounded-full bg-sage px-8 py-3 text-sm font-semibold text-ink sm:px-[38px] sm:py-[15px] sm:text-base">
              {t("cta")}
            </QuizTrigger>
          </Reveal>
        </div>

        {/* métricas */}
        <Reveal className="w-full max-w-[880px]">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-left sm:grid-cols-4 sm:gap-[22px]">
            {metrics.map((m: typeof metrics[number]) => (
              <div key={m.label} className="border-t border-paper/[.18] pt-3 sm:pt-[18px]">
                <div className="text-[clamp(24px,3.5vw,54px)] font-light leading-none">
                  <Counter to={m.value} prefix={m.prefix} suffix={m.suffix} />
                </div>
                <div className="mt-1 text-[clamp(10px,1.1vw,14px)] leading-tight text-paper/70">{m.label}</div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-[10.5px] leading-relaxed text-paper/50">
            {t("disclaimer")}
          </p>
        </Reveal>

      </div>
    </section>
  );
}
