import { getTranslations } from "next-intl/server";

type Props = {
  className?: string;
  /** Alto del logo en px. Por defecto 40px. */
  height?: number;
};

/**
 * Insignia estática de Trustpilot (logo + estrellas) que enlaza a la ficha de
 * reseñas. Va sobre una "pill" clara para garantizar legibilidad del texto
 * negro de la marca en fondos oscuros (hero y footer).
 */
export async function TrustpilotBadge({ className, height = 40 }: Props) {
  const t = await getTranslations("ui.trustbox");
  return (
    <a
      href="https://it.trustpilot.com/review/doctorlife.io"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("ariaLabel")}
      className={`inline-flex w-fit items-center rounded-2xl bg-white px-4 py-2.5 shadow-sm transition-transform hover:-translate-y-0.5 ${className ?? ""}`}
    >
      <img
        src="/trustpilot-stars.png"
        alt="Trustpilot"
        className="w-auto"
        style={{ height }}
        width={210}
        height={98}
      />
    </a>
  );
}
