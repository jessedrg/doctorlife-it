"use client";

import { useState } from "react";
import { QuizTrigger } from "@/components/quiz-trigger";

/* ── Activity levels ── */
const ACTIVITY_LEVELS = [
  { id: "sedentary",    label: "Sedentario",                    desc: "Sin ejercicio o muy poco",           multiplier: 1.2 },
  { id: "light",        label: "Ligero",                        desc: "Ejercicio 1–3 días/semana",          multiplier: 1.375 },
  { id: "moderate",     label: "Moderado",                      desc: "Ejercicio 3–5 días/semana",          multiplier: 1.55 },
  { id: "active",       label: "Activo",                        desc: "Ejercicio 6–7 días/semana",          multiplier: 1.725 },
  { id: "very_active",  label: "Muy activo",                    desc: "Trabajo físico intenso + ejercicio", multiplier: 1.9 },
] as const;

type ActivityId = (typeof ACTIVITY_LEVELS)[number]["id"];

/* ── BMR formulas ──
   Mifflin-St. Jeor (most commonly used, accurate for most people)
   Katch-McArdle when body fat % is provided
   kg, cm, years */
function calcBMR(
  sexo: "male" | "female",
  ageyrs: number,
  weightKg: number,
  heightCm: number,
  bodyFatPct?: number
): number {
  if (bodyFatPct && bodyFatPct > 0 && bodyFatPct < 60) {
    // Katch-McArdle: uses lean body mass
    const lbm = weightKg * (1 - bodyFatPct / 100);
    return 370 + 21.6 * lbm;
  }
  // Mifflin-St Jeor
  const base = 10 * weightKg + 6.25 * heightCm - 5 * ageyrs;
  return sexo === "male" ? base + 5 : base - 161;
}

/* ── Result card component ── */
function ResultCard({
  tdee,
  deficit1lb,
  deficit2lb,
  deficitKg,
}: {
  tdee: number;
  deficit1lb: number;
  deficit2lb: number;
  deficitKg: number;
}) {
  const [deficitMode, setDeficitMode] = useState<"lb" | "kg">("kg");
  const deficitVal = deficitMode === "lb" ? deficit1lb : deficitKg;
  const deficit2Val = deficitMode === "lb" ? deficit2lb : Math.round(deficitKg - 250);

  return (
    <div className="flex w-full max-w-[400px] flex-col gap-3">
      {/* Maintenance card */}
      <div className="rounded-[24px] bg-espresso/80 px-7 py-6 ring-1 ring-paper/8 backdrop-blur-sm">
        <span className="text-[11px] font-semibold uppercase tracking-[.14em] text-amber/70">Tu TDEE</span>
        <div className="mt-2 flex items-end justify-between gap-4">
          <p className="text-[22px] font-bold leading-tight text-paper">
            Para mantener<br />tu peso actual
          </p>
          <div className="text-right">
            <span className="text-4xl font-bold tabular-nums text-amber">{tdee.toLocaleString("es-ES")}</span>
            <span className="ml-1.5 text-lg text-paper/60">kcal/día</span>
          </div>
        </div>
      </div>

      {/* Deficit card */}
      <div className="rounded-[24px] bg-sage/20 px-7 py-6 ring-1 ring-sage/30">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[.14em] text-sage">Ajuste de calorías</span>
          {/* toggle */}
          <div className="flex overflow-hidden rounded-full border border-sage/30 bg-paper/5 p-0.5 text-[11px] font-semibold">
            {(["kg", "lb"] as const).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setDeficitMode(u)}
                className={`rounded-full px-3 py-1 transition-all ${
                  deficitMode === u ? "bg-sage text-ink" : "text-paper/50 hover:text-paper/80"
                }`}
              >
                {u === "kg" ? "0,5 kg/sem" : "1 lb/sem"}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-[16px] font-semibold text-paper/90">
              Perder {deficitMode === "kg" ? "0,5 kg" : "1 lb"} por semana
            </p>
            <div className="text-right">
              <span className="text-2xl font-bold tabular-nums text-sage">{deficitVal.toLocaleString("es-ES")}</span>
              <span className="ml-1 text-sm text-paper/50">kcal/día</span>
            </div>
          </div>
          <div className="h-px w-full bg-paper/10" />
          <div className="flex items-center justify-between">
            <p className="text-[16px] font-semibold text-paper/90">
              Perder {deficitMode === "kg" ? "0,25 kg" : "0.5 lb"} por semana
            </p>
            <div className="text-right">
              <span className="text-2xl font-bold tabular-nums text-paper/70">{deficit2Val.toLocaleString("es-ES")}</span>
              <span className="ml-1 text-sm text-paper/50">kcal/día</span>
            </div>
          </div>
        </div>
      </div>

      {/* BMR breakdown */}
      <div className="rounded-[20px] bg-paper/5 px-6 py-4 ring-1 ring-paper/8">
        <span className="text-[11px] font-semibold uppercase tracking-[.14em] text-paper/40">Composición de tu TDEE</span>
        <div className="mt-3 flex gap-2">
          {[
            { label: "TMB", pct: 65, color: "#c98a4f" },
            { label: "Actividad", pct: 28, color: "#cdd9a0" },
            { label: "Digestión", pct: 7, color: "#5fb3a3" },
          ].map((b) => (
            <div key={b.label} className="flex flex-col gap-1.5 text-center" style={{ flexBasis: `${b.pct}%` }}>
              <div
                className="h-2 w-full rounded-full"
                style={{ backgroundColor: b.color, opacity: 0.8 }}
              />
              <span className="text-[10px] text-paper/40">{b.pct}%</span>
              <span className="text-[10px] font-medium text-paper/60">{b.label}</span>
            </div>
          ))}
        </div>
      </div>

      <QuizTrigger className="mt-1 w-full rounded-[16px] bg-sage py-4 text-[14.5px] font-semibold text-ink transition hover:brightness-[1.06]">
        Obtener plan médico personalizado
      </QuizTrigger>
    </div>
  );
}

/* ── Empty state card ── */
function EmptyCard() {
  return (
    <div className="flex w-full max-w-[400px] flex-col gap-3">
      <div className="rounded-[24px] bg-espresso/80 px-7 py-7 ring-1 ring-paper/8">
        <span className="text-[11px] font-semibold uppercase tracking-[.14em] text-amber/50">Tu TDEE</span>
        <p className="mt-3 text-[20px] font-bold leading-snug text-paper">
          Para mantener<br />tu peso actual
        </p>
        <div className="mt-4 flex items-baseline gap-2">
          <div className="h-8 w-28 animate-pulse rounded-lg bg-paper/8" />
          <span className="text-lg text-paper/30">kcal/día</span>
        </div>
      </div>
      <div className="rounded-[24px] bg-sage/10 px-7 py-6 ring-1 ring-sage/20">
        <span className="text-[11px] font-semibold uppercase tracking-[.14em] text-sage/50">Ajuste de calorías</span>
        <p className="mt-3 text-[17px] font-semibold text-paper/40">
          Rellena el formulario para ver<br />tu objetivo calórico.
        </p>
        <div className="mt-4 flex items-baseline gap-2">
          <div className="h-7 w-20 animate-pulse rounded-lg bg-paper/6" />
          <span className="text-base text-paper/25">kcal/día</span>
        </div>
      </div>
    </div>
  );
}

/* ── Main exported component ── */
export function TdeeHero() {
  const [sexo, setSexo] = useState<"male" | "female">("male");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activityId, setActivityId] = useState<ActivityId>("moderate");
  const [bodyFat, setBodyFat] = useState("");
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [result, setResult] = useState<{
    tdee: number;
    deficit1lb: number;
    deficit2lb: number;
    deficitKg: number;
  } | null>(null);
  const [error, setError] = useState("");

  const calculate = () => {
    setError("");
    const ageN = parseFloat(age);
    const weightN = parseFloat(weight);
    const heightN = parseFloat(height);
    const bf = parseFloat(bodyFat) || 0;

    if (!ageN || !weightN || !heightN || ageN < 10 || ageN > 120) {
      setError("Introduce edad, peso y altura válidos para calcular.");
      return;
    }

    let wKg = weightN;
    let hCm = heightN;

    if (unit === "imperial") {
      wKg = weightN * 0.453592;    // lbs → kg
      hCm = heightN * 2.54;        // inches → cm
    }

    const bmr = calcBMR(sexo, ageN, wKg, hCm, bf || undefined);
    const mult = ACTIVITY_LEVELS.find((a) => a.id === activityId)?.multiplier ?? 1.55;
    const tdee = Math.round(bmr * mult);

    // Deficits
    const deficit1lb = Math.round(tdee - 500);   // ~0.45 kg/wk
    const deficit2lb = Math.round(tdee - 1000);  // ~0.9 kg/wk
    const deficitKg  = Math.round(tdee - 550);   // ~0.5 kg/wk

    setResult({ tdee, deficit1lb, deficit2lb, deficitKg });
  };

  const resetResult = () => setResult(null);

  return (
    <section className="relative overflow-hidden bg-cocoa">
      {/* Ambient glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 70% 35%, rgba(201,138,79,0.14) 0%, transparent 65%), " +
            "radial-gradient(ellipse 45% 40% at 10% 75%, rgba(93,179,163,0.10) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl items-start gap-12 px-6 py-20 md:py-28 lg:grid-cols-2 lg:gap-10 lg:px-16 xl:px-20">

        {/* ── LEFT: form ── */}
        <div>
          <span className="mb-5 inline-block rounded-full border border-sage/30 bg-sage/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[.15em] text-sage">
            Herramienta gratuita
          </span>

          <h1 className="text-balance text-[42px] font-bold leading-[1.05] text-paper md:text-5xl lg:text-[50px]">
            Calculadora<br className="hidden sm:block" /> de TDEE
          </h1>

          <p className="mt-5 max-w-[460px] text-[16.5px] leading-relaxed text-paper/60">
            Tu Gasto Energético Total Diario (TDEE) es una estimación de las calorías que quemas al día. Úsalo para saber cuánto deberías comer para perder, mantener o ganar peso.
          </p>

          {/* Unit toggle */}
          <div className="mt-8 mb-7 flex w-fit overflow-hidden rounded-full border border-paper/12 bg-paper/6 p-1 text-[13px] font-medium">
            {(["metric", "imperial"] as const).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => { setUnit(u); resetResult(); }}
                className={`rounded-full px-5 py-2 transition-all ${
                  unit === u ? "bg-paper text-ink shadow-sm" : "text-paper/50 hover:text-paper/80"
                }`}
              >
                {u === "metric" ? "kg / cm" : "lb / in"}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-5">
            {/* Sex toggle */}
            <div className="flex flex-col gap-2">
              <span className="text-[12px] font-semibold uppercase tracking-[.12em] text-paper/45">Sexo biológico</span>
              <div className="grid grid-cols-2 overflow-hidden rounded-[16px] border border-paper/12 bg-paper/5 p-1 text-[14.5px] font-semibold">
                {(["male", "female"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => { setSexo(s); resetResult(); }}
                    className={`rounded-[12px] py-3 transition-all ${
                      sexo === s ? "bg-ink text-paper shadow-sm" : "text-paper/45 hover:text-paper/70"
                    }`}
                  >
                    {s === "male" ? "Hombre" : "Mujer"}
                  </button>
                ))}
              </div>
            </div>

            {/* Age + Weight */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="tdee-age" className="text-[12px] font-semibold uppercase tracking-[.12em] text-paper/45">
                  Edad (años)
                </label>
                <input
                  id="tdee-age"
                  type="number"
                  placeholder="35"
                  min={10} max={120}
                  value={age}
                  onChange={(e) => { setAge(e.target.value); resetResult(); }}
                  className="w-full rounded-[16px] border border-paper/12 bg-paper/7 px-5 py-[14px] text-[16px] text-paper placeholder-paper/25 outline-none transition focus:border-sage/60 focus:bg-paper/10"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="tdee-weight" className="text-[12px] font-semibold uppercase tracking-[.12em] text-paper/45">
                  Peso ({unit === "metric" ? "kg" : "lb"})
                </label>
                <input
                  id="tdee-weight"
                  type="number"
                  placeholder={unit === "metric" ? "80" : "176"}
                  min={1}
                  value={weight}
                  onChange={(e) => { setWeight(e.target.value); resetResult(); }}
                  className="w-full rounded-[16px] border border-paper/12 bg-paper/7 px-5 py-[14px] text-[16px] text-paper placeholder-paper/25 outline-none transition focus:border-sage/60 focus:bg-paper/10"
                />
              </div>
            </div>

            {/* Height */}
            <div className="flex flex-col gap-2">
              <label htmlFor="tdee-height" className="text-[12px] font-semibold uppercase tracking-[.12em] text-paper/45">
                Altura ({unit === "metric" ? "cm" : "pulgadas"})
              </label>
              <input
                id="tdee-height"
                type="number"
                placeholder={unit === "metric" ? "170" : "67"}
                min={1}
                value={height}
                onChange={(e) => { setHeight(e.target.value); resetResult(); }}
                className="w-full rounded-[16px] border border-paper/12 bg-paper/7 px-5 py-[14px] text-[16px] text-paper placeholder-paper/25 outline-none transition focus:border-sage/60 focus:bg-paper/10"
              />
            </div>

            {/* Activity level */}
            <div className="flex flex-col gap-2">
              <label htmlFor="tdee-activity" className="text-[12px] font-semibold uppercase tracking-[.12em] text-paper/45">
                Nivel de actividad
              </label>
              <select
                id="tdee-activity"
                value={activityId}
                onChange={(e) => { setActivityId(e.target.value as ActivityId); resetResult(); }}
                className="w-full rounded-[16px] border border-paper/12 bg-paper/7 px-5 py-[14px] text-[16px] text-paper outline-none transition focus:border-sage/60 focus:bg-paper/10"
              >
                {ACTIVITY_LEVELS.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.label} — {a.desc}
                  </option>
                ))}
              </select>
            </div>

            {/* Body fat (optional) */}
            <div className="flex flex-col gap-2">
              <label htmlFor="tdee-bf" className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[.12em] text-paper/45">
                % de grasa corporal
                <span className="rounded bg-paper/8 px-2 py-0.5 text-[10px] normal-case tracking-normal text-paper/35">
                  opcional — mejora la precisión
                </span>
              </label>
              <input
                id="tdee-bf"
                type="number"
                placeholder="25"
                min={1} max={60}
                value={bodyFat}
                onChange={(e) => { setBodyFat(e.target.value); resetResult(); }}
                className="w-full rounded-[16px] border border-paper/12 bg-paper/7 px-5 py-[14px] text-[16px] text-paper placeholder-paper/25 outline-none transition focus:border-sage/60 focus:bg-paper/10"
              />
              <p className="text-[11.5px] leading-relaxed text-paper/30">
                Si introduces tu % de grasa, usamos la fórmula Katch-McArdle (más precisa para deportistas o personas con mucha o poca masa muscular).
              </p>
            </div>
          </div>

          {error && <p className="mt-3 text-sm text-amber-light">{error}</p>}

          <button
            type="button"
            onClick={calculate}
            className="mt-7 w-full rounded-[16px] bg-sage py-[15px] text-[15.5px] font-semibold text-ink transition hover:brightness-[1.06] active:scale-[.985]"
          >
            Calcular mi TDEE
          </button>
        </div>

        {/* ── RIGHT: result card ── */}
        <div className="flex justify-center lg:sticky lg:top-28 lg:justify-end">
          {result ? (
            <ResultCard
              tdee={result.tdee}
              deficit1lb={result.deficit1lb}
              deficit2lb={result.deficit2lb}
              deficitKg={result.deficitKg}
            />
          ) : (
            <EmptyCard />
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <p className="relative mx-auto max-w-4xl px-6 pb-10 text-center text-[11.5px] leading-relaxed text-paper/28 lg:px-16">
        El TDEE es una estimación. El gasto real varía según la composición corporal, el metabolismo individual y el estado de salud. Consulta siempre con un profesional médico antes de hacer cambios dietéticos significativos.
      </p>
    </section>
  );
}
