type BrandLogoProps = {
  /** Envuelve la marca en un recuadro redondeado (solo se usa en el footer). */
  boxed?: boolean;
  /** Alto de la marca en px. */
  markSize?: number;
  /** Tamaño del texto en px. */
  textSize?: number;
  /** Color del texto (clase Tailwind, p.ej. "text-ink" o "text-paper"). */
  textClassName?: string;
};

/** Marca: círculo verde + media luna terracota (sin el recuadro de fondo del SVG original). */
export function BrandMark({ size }: { size: number }) {
  // Proporción original del icono: 42 x 48
  const w = (size * 42) / 48;
  return (
    <svg
      width={w}
      height={size}
      viewBox="0 0 42 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <circle cx="27.5" cy="23.5" r="14.5" fill="#6B774A" />
      <path
        d="M14.7196 16.6448C13.5578 16.2274 12.3055 16 11 16C4.92487 16 0 20.9249 0 27C0 33.0751 4.92487 38 11 38H27.5C19.4919 38 13 31.5081 13 23.5C13 21.0203 13.6224 18.686 14.7196 16.6448Z"
        fill="#A65F3B"
      />
    </svg>
  );
}

/** Texto "DoctorLife" en negrita geométrica. */
function Wordmark({ size, className }: { size: number; className: string }) {
  return (
    <span
      className={`leading-none tracking-[-.03em] ${className}`}
      style={{ fontSize: size, fontFamily: "var(--font-sora), system-ui, sans-serif", fontWeight: 800 }}
    >
      DoctorLife
    </span>
  );
}

export function BrandLogo({
  boxed = false,
  markSize = 30,
  textSize = 20,
  textClassName = "text-ink",
}: BrandLogoProps) {
  if (boxed) {
    return (
      <span className="flex items-center gap-3">
        <span className="flex items-center justify-center rounded-[14px] bg-sage p-2">
          <BrandMark size={markSize} />
        </span>
        <Wordmark size={textSize} className={textClassName} />
      </span>
    );
  }
  return (
    <span className="flex items-center gap-2.5">
      <BrandMark size={markSize} />
      <Wordmark size={textSize} className={textClassName} />
    </span>
  );
}
