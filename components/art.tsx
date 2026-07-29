/* ───────────────────────────────────────────────────────────
   Procedural CSS-art product renders (no images required).
   Pure server components — safe to use anywhere.
   ─────────────────────────────────────────────────────────── */

/** Embossed pill / tablet. */
export function PillArt({
  size = 118,
  bg = "radial-gradient(60% 60% at 38% 32%,#fff,#efe7da 55%,#d6c8b3)",
  glyph = true,
  className,
}: {
  size?: number;
  bg?: string;
  glyph?: boolean;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        boxShadow:
          "inset -9px -11px 24px rgba(120,100,80,.32),inset 7px 9px 18px rgba(255,255,255,.85),0 26px 42px rgba(0,0,0,.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-serif)",
        fontSize: size * 0.36,
        color: "rgba(120,95,70,.36)",
      }}
    >
      {glyph ? "m" : ""}
    </div>
  );
}

/** Injector pen with dose window + clay cap. */
export function PenArt({
  height = 280,
  capColor = "#9a5a33",
  dose,
  className,
}: {
  height?: number;
  capColor?: string;
  dose?: string;
  className?: string;
}) {
  const width = Math.round(height * 0.3);
  const radius = Math.round(width * 0.52);
  const capH = Math.round(height * 0.15);
  const winW = Math.round(width * 0.48);
  const winH = Math.round(height * 0.22);

  return (
    <div className={className} style={{ position: "relative", width, height }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: radius,
          background:
            "linear-gradient(102deg,#ffffff,#efe7da 47%,#cdbfa8)",
          boxShadow:
            "inset 8px 0 16px rgba(255,255,255,.72),inset -12px 0 22px rgba(120,100,80,.28),0 30px 50px rgba(0,0,0,.5)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: Math.round(height * 0.12),
          left: "50%",
          transform: "translateX(-50%)",
          width: winW,
          height: winH,
          borderRadius: 9,
          background: "linear-gradient(#241b12,#120c07)",
        }}
      />
      {dose ? (
        <div
          style={{
            position: "absolute",
            top: Math.round(height * 0.16),
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: Math.max(10, width * 0.16),
            letterSpacing: ".04em",
            color: "#e3b582",
            fontWeight: 600,
          }}
        >
          {dose}
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width,
          height: capH,
          borderRadius: `0 0 ${radius}px ${radius}px`,
          background: `linear-gradient(#caa06a,${capColor})`,
        }}
      />
    </div>
  );
}
