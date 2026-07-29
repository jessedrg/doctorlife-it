"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { X, ShieldCheck } from "lucide-react";
import { useQuiz } from "@/components/quiz-context";

/**
 * Barra inferior sticky conforme a las políticas de Google Ads:
 * sin nombres de fármacos, sin promesas de porcentaje de pérdida de peso
 * y sin enlaces a WhatsApp. Abre el cuestionario de valoración.
 */
export function StickyValoracionCTA({ planPrefix }: { planPrefix: string }) {
  const t = useTranslations("ui.stickyCta");
  const [dismissed, setDismissed] = useState(false);
  const { openQuiz } = useQuiz();

  if (dismissed) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[80] px-3 pb-3 sm:px-5 sm:pb-5">
      <div className="relative mx-auto flex max-w-3xl items-center gap-3 overflow-hidden rounded-2xl bg-espresso px-4 py-3 text-paper shadow-[0_20px_50px_-16px_rgba(34,29,23,.55)] ring-1 ring-white/10 sm:gap-6 sm:rounded-3xl sm:px-6 sm:py-4">
        <button
          type="button"
          aria-label={t("close")}
          onClick={() => setDismissed(true)}
          className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/20 text-paper/70 transition-colors hover:bg-black/40 hover:text-paper"
        >
          <X aria-hidden className="h-4 w-4" />
        </button>

        <div className="min-w-0 flex-1 pr-6">
          <p className="text-[16px] font-semibold leading-tight sm:text-[19px]">
            {t("title")}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-[13px] leading-snug text-paper/75 sm:text-[14px]">
            <ShieldCheck aria-hidden className="h-4 w-4 flex-shrink-0 text-sage" />
            {t("subtitle")}
          </p>
        </div>

        <button
          type="button"
          onClick={() => openQuiz(`${planPrefix}-sticky`)}
          className="flex-shrink-0 rounded-full bg-sage px-5 py-3 text-[14px] font-bold text-espresso transition-transform duration-200 hover:scale-[1.03] active:scale-95 sm:px-8 sm:py-3.5 sm:text-[16px]"
        >
          {t("cta")}
        </button>
      </div>
    </div>
  );
}
