import { getTranslations } from "next-intl/server";
import { QuizTrigger } from "./quiz-trigger";

export async function Announcement() {
  const t = await getTranslations("ui.announcement");
  return (
    <div className="flex items-center justify-center gap-[14px] bg-ink px-5 py-[11px] text-[14.5px] text-paper">
      <span className="opacity-80">{t("text")}</span>
      <QuizTrigger className="inline-flex items-center gap-[6px] whitespace-nowrap font-semibold text-amber-light">
        {t("cta")} <span className="text-base">→</span>
      </QuizTrigger>
    </div>
  );
}
