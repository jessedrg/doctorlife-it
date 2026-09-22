import { getTranslations } from "next-intl/server";

type Props = {
  className?: string;
  /** Alto del logo (fila del wordmark) en px. Por defecto 18px. */
  height?: number;
};

const TRUSTPILOT_GREEN = "#00b67a";
const STAR_GREY = "#dcdce6";

/** Estrella de 5 puntas usada en el logo y en las cajas de valoración. */
function Star({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.5l7.1-.6z"
      />
    </svg>
  );
}

/** Caja verde de valoración con estrella blanca. `half` la rellena hasta la mitad. */
function RatingBox({ size, half = false }: { size: number; half?: boolean }) {
  return (
    <span
      className="inline-flex items-center justify-center"
      style={{
        width: size,
        height: size,
        background: half
          ? `linear-gradient(90deg, ${TRUSTPILOT_GREEN} 50%, ${STAR_GREY} 50%)`
          : TRUSTPILOT_GREEN,
      }}
    >
      <Star className="text-white" />
    </span>
  );
}

/**
 * Insignia estática de Trustpilot (logo + estrellas) que enlaza a la ficha de
 * reseñas. Sin fondo: el wordmark toma el color del texto (blanco en fondos
 * oscuros del hero y footer) y las estrellas mantienen el verde de la marca.
 */
export async function TrustpilotBadge({ className, height = 28 }: Props) {
  const t = await getTranslations("ui.trustbox");
  const wordmarkStar = height;
  const box = Math.round(height * 0.82);

  return (
    <a
      href="https://it.trustpilot.com/review/doctorlife.io"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("ariaLabel")}
      className={`inline-flex w-fit flex-col gap-2 transition-transform hover:-translate-y-0.5 ${className ?? ""}`}
    >
      <span className="inline-flex items-center gap-2">
        <Star
          className="text-[#00b67a]"
          // @ts-expect-error inline size via style below
          style={{ width: wordmarkStar, height: wordmarkStar }}
        />
        <span
          className="font-bold leading-none tracking-tight text-white"
          style={{ fontSize: Math.round(height * 0.95) }}
        >
          Trustpilot
        </span>
      </span>
      <span className="inline-flex" style={{ gap: Math.max(2, Math.round(box * 0.1)) }}>
        <RatingBox size={box} />
        <RatingBox size={box} />
        <RatingBox size={box} />
        <RatingBox size={box} />
        <RatingBox size={box} half />
      </span>
    </a>
  );
}
