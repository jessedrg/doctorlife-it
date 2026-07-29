"use client";

import { useState, useCallback } from "react";
import { QuizTrigger } from "@/components/quiz-trigger";

/* ── BMI category definitions ── */
const SEGMENTS = [
  { id: "bajo",      label: "Bajo peso",    range: "< 18.5",      max: 18.5, color: "#5fb3a3" },
  { id: "normal",    label: "Normopeso",    range: "18.5 – 24.9", max: 25,   color: "#cdd9a0" },
  { id: "sobre",     label: "Sobrepeso",    range: "25 – 29.9",   max: 30,   color: "#e3b582" },
  { id: "obesidad",  label: "Obesidad",     range: "> 30",        max: 999,  color: "#c98a4f" },
] as const;

/* ── Geometry helpers ── */
const CX = 160;
const CY = 160;
const R  = 108;
// Half-circle gauge: left=−180° right=0°, but we open a 200° arc centred on top
// Start = −200°→ −100° from east = at angle 200° (measuring CCW from east = -200 from east)
// Simple: let's do a 200° arc from -200° to 20° → that's awkward. Let's use a clean 180° flat half-moon at bottom.
// Actual: −90 top…we'll go from 180° to 0° (left side to right side) across the top — a 180° arc.
// So left end = 180°, right end = 0°, the arc sweeps across the top.
const ARC_START = 180; // degrees (3 o'clock = 0, measured clockwise)
const ARC_END   = 0;

/** Polar → cartesian, angles measured clockwise from 3 o'clock (standard SVG) */
function polar(angleDeg: number, r = R) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

/** Build an SVG arc path going clockwise from startDeg to endDeg */
function arc(startDeg: number, endDeg: number, r = R): string {
  // normalise so we always go the short way
  const s = polar(startDeg, r);
  const e = polar(endDeg, r);
  // We want the upper half, going counter-clockwise (sweep-flag=0)
  const large = 0;
  const sweep = 0; // counter-clockwise
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${large} ${sweep} ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
}

/** Map BMI → angle along the 180° arc.
 *  BMI 10 → left end (180°), BMI 45 → right end (0°) */
function bmiToAngle(bmi: number): number {
  const clamped = Math.min(45, Math.max(10, bmi));
  const t = (clamped - 10) / (45 - 10); // 0…1
  return 180 - t * 180; // 180→0
}

/** Map BMI to angle along arc for segment boundaries */
const BMI_MIN = 10;
const BMI_MAX = 45;
function bmiToArcAngle(bmi: number) {
  const t = (Math.min(BMI_MAX, Math.max(BMI_MIN, bmi)) - BMI_MIN) / (BMI_MAX - BMI_MIN);
  return 180 - t * 180;
}

type SegmentType = (typeof SEGMENTS)[number];

function getCategory(bmi: number): SegmentType {
  return (SEGMENTS.find((s) => bmi < s.max) ?? SEGMENTS[SEGMENTS.length - 1]) as SegmentType;
}

/* ── Gauge SVG ── */
function Gauge({ bmi }: { bmi: number | null }) {
  const category = bmi !== null ? getCategory(bmi) : null;
  const needleAngle = bmi !== null ? bmiToAngle(bmi) : 180;

  // segment boundaries in BMI
  const bounds = [BMI_MIN, 18.5, 25, 30, BMI_MAX];
  const ticks   = [10, 18.5, 25, 30, 45];
  const tickLbl = ["10", "18.5", "25", "30", "45"];

  return (
    <svg
      viewBox="0 0 320 185"
      aria-hidden
      className="w-full select-none overflow-visible"
    >
      {/* Track background */}
      <path
        d={arc(ARC_START, ARC_END)}
        fill="none"
        stroke="rgba(255,255,255,0.07)"
        strokeWidth={22}
        strokeLinecap="round"
      />

      {/* Colored arc segments */}
      {SEGMENTS.map((seg, i) => {
        const startA = bmiToArcAngle(bounds[i]);
        const endA   = bmiToArcAngle(bounds[i + 1]);
        const GAP = 1.5;
        return (
          <path
            key={seg.id}
            d={arc(startA - GAP * 0.5, endA + GAP * 0.5)}
            fill="none"
            stroke={seg.color}
            strokeWidth={20}
            strokeLinecap="butt"
            opacity={!bmi || category?.id === seg.id ? 1 : 0.22}
            style={{ transition: "opacity 0.45s ease" }}
          />
        );
      })}

      {/* Tick labels */}
      {ticks.map((b, i) => {
        const a = bmiToArcAngle(b);
        const pt = polar(a, R + 26);
        return (
          <text
            key={b}
            x={pt.x}
            y={pt.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={9.5}
            fill="rgba(246,240,230,0.38)"
            fontFamily="system-ui, sans-serif"
          >
            {tickLbl[i]}
          </text>
        );
      })}

      {/* Needle group – rotates around centre */}
      <g
        style={{
          transform: `rotate(${needleAngle}deg)`,
          transformOrigin: `${CX}px ${CY}px`,
          transition: "transform 0.85s cubic-bezier(.34,1.4,.64,1)",
        }}
      >
        {/* needle line pointing left (180° direction from centre) */}
        <line
          x1={CX}
          y1={CY}
          x2={CX - R + 12}
          y2={CY}
          stroke={category?.color ?? "rgba(246,240,230,0.45)"}
          strokeWidth={3.5}
          strokeLinecap="round"
          style={{ transition: "stroke 0.45s" }}
        />
      </g>

      {/* Hub */}
      <circle cx={CX} cy={CY} r={11} fill={category?.color ?? "#2a1f14"} style={{ transition: "fill 0.45s" }} />
      <circle cx={CX} cy={CY} r={5}  fill="#171009" />

      {/* Centre readout */}
      <text
        x={CX} y={CY + 28}
        textAnchor="middle"
        fontSize={10}
        fill="rgba(246,240,230,0.4)"
        fontFamily="system-ui, sans-serif"
        letterSpacing="0.12em"
      >
        TU IMC
      </text>
      <text
        x={CX} y={CY + 68}
        textAnchor="middle"
        fontSize={44}
        fontWeight="700"
        fill={category?.color ?? "rgba(246,240,230,0.2)"}
        fontFamily="system-ui, sans-serif"
        style={{ transition: "fill 0.45s" }}
      >
        {bmi !== null ? bmi.toFixed(1) : "—"}
      </text>
    </svg>
  );
}

/* ── Main component ── */
export function BmiHero() {
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [bmi, setBmi]           = useState<number | null>(null);
  const [error, setError]       = useState("");
  const [unit, setUnit]         = useState<"metric" | "imperial">("metric");

  const calculate = useCallback(() => {
    setError("");
    const w = parseFloat(weightKg);
    const h = parseFloat(heightCm);
    if (!w || !h || w <= 0 || h <= 0) {
      setError("Introduce tu altura y peso para calcular.");
      return;
    }
    let val: number;
    if (unit === "metric") {
      const hm = h / 100;
      val = w / (hm * hm);
    } else {
      val = (703 * w) / (h * h);
    }
    setBmi(Math.round(val * 10) / 10);
  }, [heightCm, weightKg, unit]);

  const category = bmi !== null ? getCategory(bmi) : null;

  const reset = () => {
    setHeightCm(""); setWeightKg(""); setBmi(null); setError("");
  };

  return (
    <section className="relative overflow-hidden bg-cocoa">
      {/* Ambient glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 72% 40%, rgba(201,138,79,0.13) 0%, transparent 65%), " +
            "radial-gradient(ellipse 50% 45% at 15% 70%, rgba(93,179,163,0.09) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:py-28 lg:grid-cols-2 lg:gap-8 lg:px-16 xl:px-20">

        {/* ── LEFT: form ── */}
        <div>
          <span className="mb-5 inline-block rounded-full border border-sage/30 bg-sage/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[.15em] text-sage">
            Herramienta gratuita
          </span>

          <h1 className="text-balance text-[44px] font-bold leading-[1.05] text-paper md:text-5xl lg:text-[52px]">
            Calculadora<br className="hidden sm:block" /> de IMC
          </h1>

          <p className="mt-5 max-w-[460px] text-[16.5px] leading-relaxed text-paper/60">
            El Índice de Masa Corporal usa tu altura y peso para estimar si tu
            peso está en un rango saludable. Calcula el tuyo en segundos.
          </p>

          {/* Unit toggle */}
          <div className="mt-8 mb-7 flex w-fit overflow-hidden rounded-full border border-paper/12 bg-paper/6 p-1 text-[13px] font-medium">
            {(["metric", "imperial"] as const).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => { setUnit(u); reset(); }}
                className={`rounded-full px-5 py-2 transition-all ${
                  unit === u
                    ? "bg-paper text-ink shadow-sm"
                    : "text-paper/50 hover:text-paper/80"
                }`}
              >
                {u === "metric" ? "cm / kg" : "in / lb"}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-5">
            {/* Height */}
            <div className="flex flex-col gap-2">
              <label htmlFor="height" className="text-[12px] font-semibold uppercase tracking-[.12em] text-paper/45">
                Altura ({unit === "metric" ? "cm" : "pulgadas"})
              </label>
              <input
                id="height"
                type="number"
                placeholder={unit === "metric" ? "170" : "67"}
                min={1}
                value={heightCm}
                onChange={(e) => { setHeightCm(e.target.value); setBmi(null); }}
                onKeyDown={(e) => e.key === "Enter" && calculate()}
                className="w-full rounded-[16px] border border-paper/12 bg-paper/7 px-5 py-[15px] text-[16px] text-paper placeholder-paper/25 outline-none transition-all focus:border-sage/60 focus:bg-paper/10"
              />
            </div>

            {/* Weight */}
            <div className="flex flex-col gap-2">
              <label htmlFor="weight" className="text-[12px] font-semibold uppercase tracking-[.12em] text-paper/45">
                Peso ({unit === "metric" ? "kg" : "libras"})
              </label>
              <input
                id="weight"
                type="number"
                placeholder={unit === "metric" ? "75" : "165"}
                min={1}
                value={weightKg}
                onChange={(e) => { setWeightKg(e.target.value); setBmi(null); }}
                onKeyDown={(e) => e.key === "Enter" && calculate()}
                className="w-full rounded-[16px] border border-paper/12 bg-paper/7 px-5 py-[15px] text-[16px] text-paper placeholder-paper/25 outline-none transition-all focus:border-sage/60 focus:bg-paper/10"
              />
            </div>
          </div>

          {error && (
            <p className="mt-3 text-sm text-amber-light">{error}</p>
          )}

          <button
            type="button"
            onClick={calculate}
            className="mt-7 w-full rounded-[16px] bg-sage py-[15px] text-[15.5px] font-semibold text-ink transition-all hover:brightness-[1.06] active:scale-[.985]"
          >
            Calcular mi IMC
          </button>

          {/* Inline result message */}
          {bmi !== null && category && (
            <div
              className="mt-5 rounded-[16px] p-5 text-[14.5px] leading-relaxed text-ink"
              style={{ backgroundColor: `${category.color}28`, border: `1px solid ${category.color}55` }}
            >
              <p className="font-semibold" style={{ color: category.color }}>
                {category.label} — IMC {bmi}
              </p>
              <p className="mt-1.5 text-paper/70">
                {category.id === "bajo"     && "Tu IMC indica bajo peso. Consulta con un profesional de la salud."}
                {category.id === "normal"   && "Tu peso está en el rango saludable. ¡Sigue con tus buenos hábitos!"}
                {category.id === "sobre"    && "Tu IMC indica sobrepeso. Un médico puede ayudarte con un plan personalizado."}
                {category.id === "obesidad" && "Tu IMC indica obesidad. Un especialista puede valorar el tratamiento más adecuado para ti."}
              </p>
              {(category.id === "sobre" || category.id === "obesidad") && (
                <QuizTrigger className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sage py-3 text-[14px] font-semibold text-ink">
                  Hablar con un médico — primera visita gratis
                </QuizTrigger>
              )}
            </div>
          )}
        </div>

        {/* ── RIGHT: gauge card ── */}
        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-[380px] rounded-[28px] bg-espresso/80 px-7 pb-8 pt-7 shadow-2xl ring-1 ring-paper/8 backdrop-blur-sm">

            <Gauge bmi={bmi} />

            {/* Category badge */}
            <div className="mt-1 flex justify-center">
              <span
                className="rounded-full px-5 py-1.5 text-[13px] font-semibold transition-all duration-500"
                style={{
                  backgroundColor: category ? `${category.color}22` : "rgba(246,240,230,0.07)",
                  color: category?.color ?? "rgba(246,240,230,0.3)",
                  border: `1px solid ${category ? category.color + "44" : "rgba(246,240,230,0.1)"}`,
                }}
              >
                {category?.label ?? "Introduce tus datos"}
              </span>
            </div>

            {/* Legend table */}
            <ul className="mt-6 divide-y divide-paper/8">
              {SEGMENTS.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between py-3 text-[13.5px] transition-opacity duration-400"
                  style={{ opacity: !bmi || category?.id === s.id ? 1 : 0.35 }}
                >
                  <span className="flex items-center gap-2.5 text-paper font-medium">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
                    {s.label}
                  </span>
                  <span className="tabular-nums text-paper/55">{s.range}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

      {/* Disclaimer */}
      <p className="relative mx-auto max-w-4xl px-6 pb-10 text-center text-[11.5px] leading-relaxed text-paper/28 lg:px-16">
        El IMC no mide directamente la composición corporal y puede no reflejar con precisión la salud de personas con alta masa muscular, mujeres embarazadas, menores o adultos mayores. Consulta siempre con un profesional médico.
      </p>
    </section>
  );
}
