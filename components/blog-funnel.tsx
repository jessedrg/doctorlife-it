"use client";

import { useTranslations } from "next-intl";
import { QuizTrigger } from "./quiz-trigger";
import { analytics } from "@/lib/analytics";

/**
 * Bloque de conversión reutilizable dentro de los posts del blog.
 * Empuja al lector a empezar el tratamiento con DoctorLife (primera visita gratis).
 */
export function BlogFunnel({
  title,
  subtitle,
  image = "/hero/woman.png",
  imageAlt,
}: {
  title?: string;
  subtitle?: string;
  image?: string;
  imageAlt?: string;
}) {
  const t = useTranslations("ui.blogFunnel");
  return (
    <aside className="my-12 overflow-hidden rounded-[28px] bg-espresso text-paper">
      <div className="flex flex-col-reverse md:grid md:grid-cols-[1.2fr_1fr]">
        <div className="p-8 sm:p-10">
          <span className="inline-block rounded-full bg-sage px-[13px] py-[5px] text-xs font-semibold text-ink">
            {t("badge")}
          </span>
          <h3 className="mt-5 text-balance text-[clamp(24px,3vw,32px)] font-light leading-[1.1]">
            {title ?? t("title")}
          </h3>
          <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-paper/75">{subtitle ?? t("subtitle")}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <QuizTrigger className="rounded-full bg-sage px-7 py-[14px] text-[15px] font-semibold text-ink">
              {t("ctaButton")}
            </QuizTrigger>
            <a
              href="/#planes"
              onClick={() => analytics.blogToHome("planes")}
              className="rounded-full border border-paper/25 px-7 py-[14px] text-[15px] font-medium text-paper no-underline transition-colors hover:bg-paper/10"
            >
              {t("secondaryButton")}
            </a>
          </div>
        </div>
        <div className="relative aspect-[5/4] w-full sm:aspect-[16/9] md:aspect-auto md:min-h-full md:max-h-[520px]">
          <img
            src={image || "/placeholder.svg"}
            alt={imageAlt ?? t("imageAlt")}
            className="absolute inset-0 h-full w-full object-cover object-[center_15%]"
          />
          {/* degradado: vertical en móvil (oscurece la parte inferior), horizontal en escritorio */}
          <div
            className="pointer-events-none absolute inset-0 md:hidden"
            style={{ background: "linear-gradient(180deg,transparent 45%,#171009 100%)" }}
          />
          <div
            className="pointer-events-none absolute inset-0 hidden md:block"
            style={{ background: "linear-gradient(90deg,#171009 0%,transparent 45%)" }}
          />
        </div>
      </div>
    </aside>
  );
}
