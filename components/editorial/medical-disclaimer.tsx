import { getTranslations } from "next-intl/server";
import { Info } from "lucide-react";

/** Aviso médico obligatorio en contenido YMYL de salud. */
export async function MedicalDisclaimer({ reviewer }: { reviewer?: string }) {
  const t = await getTranslations("ui.medicalDisclaimer");
  return (
    <aside
      role="note"
      aria-label={t("ariaLabel")}
      className="mt-10 flex items-start gap-3 rounded-[16px] bg-cream/50 px-5 py-4 text-[13px] leading-relaxed text-ink-mute"
    >
      <Info aria-hidden className="mt-0.5 h-4 w-4 flex-shrink-0 text-clay" />
      <p>
        {t("text")}
        {reviewer ? ` ${t("reviewedBySuffix", { reviewer })}` : ""}
      </p>
    </aside>
  );
}
