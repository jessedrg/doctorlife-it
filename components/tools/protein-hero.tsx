"use client";

import { useState, useCallback } from "react";
import { QuizTrigger } from "@/components/quiz-trigger";

/* ─── Types ─── */
type Sex = "hombre" | "mujer";
type Goal = "perder" | "mantener" | "ganar" | "rendimiento";
type Activity = "sedentario" | "ligero" | "moderado" | "activo" | "muy-activo";
type Unit = "metric" | "imperial";

const ACTIVITY_LABELS: Record<Activity, string> = {
  sedentario: "Sedentario (sin ejercicio)",
  ligero: "Ligero (1–2 días/semana)",
  moderado: "Moderado (3–5 días/semana)",
  activo: "Activo (6–7 días/semana)",
  "muy-activo": "Muy activo (2× al día)",
};

const GOAL_LABELS: Record<Goal, string> = {
  perder: "Perder peso",
  mantener: "Mantener peso",
  ganar: "Ganar músculo",
  rendimiento: "Rendimiento deportivo",
};

/* ─── Protein calculation ─── */
// Ranges in g/kg of bodyweight:
// Source: ISSN Position Stand + WHO recommendations
const PROTEIN_RANGES: Record<Activity, Record<Goal, [number, number]>> = {
  sedentario: {
    perder:      [1.2, 1.6],
    mantener:    [0.8, 1.2],
    ganar:       [1.6, 2.0],
    rendimiento: [1.4, 1.8],
  },
  ligero: {
    perder:      [1.4, 1.8],
    mantener:    [1.0, 1.4],
    ganar:       [1.8, 2.2],
    rendimiento: [1.6, 2.0],
  },
  moderado: {
    perder:      [1.6, 2.0],
    mantener:    [1.2, 1.6],
    ganar:       [1.8, 2.4],
    rendimiento: [1.8, 2.2],
  },
  activo: {
    perder:      [1.8, 2.2],
    mantener:    [1.4, 1.8],
    ganar:       [2.0, 2.5],
    rendimiento: [2.0, 2.4],
  },
  "muy-activo": {
    perder:      [2.0, 2.4],
    mantener:    [1.6, 2.0],
    ganar:       [2.2, 2.8],
    rendimiento: [2.2, 2.6],
  },
};

function calcIdealWeight(heightCm: number, sex: Sex): number {
  // Devine formula (kg)
  const inchesOver5ft = (heightCm / 2.54) - 60;
  const base = sex === "hombre" ? 50 : 45.5;
  return Math.max(base + 2.3 * inchesOver5ft, 40);
}

function calcProtein(
  weightKg: number,
  heightCm: number,
  bodyFatPct: number | null,
  sex: Sex,
  activity: Activity,
  goal: Goal,
): { min: number; max: number; leanMassKg: number | null } {
  const [lo, hi] = PROTEIN_RANGES[activity][goal];

  // If body fat known, use lean mass as the multiplier base
  if (bodyFatPct !== null && bodyFatPct > 0 && bodyFatPct < 60) {
    const leanMassKg = weightKg * (1 - bodyFatPct / 100);
    // For lean-mass calc, use slightly higher multiplier
    const leanLo = lo * 1.15;
    const leanHi = hi * 1.15;
    return {
      min: Math.round(leanMassKg * leanLo),
      max: Math.round(leanMassKg * leanHi),
      leanMassKg: Math.round(leanMassKg * 10) / 10,
    };
  }

  return {
    min: Math.round(weightKg * lo),
    max: Math.round(weightKg * hi),
    leanMassKg: null,
  };
}

/* ─── Shared input styles ─── */
const inputCls =
  "w-full rounded-2xl border border-ink/15 bg-paper/60 px-4 py-3 text-sm text-ink placeholder:text-ink/35 outline-none focus:border-sage focus:ring-2 focus:ring-sage/25 transition";
const labelCls = "block text-[13px] font-medium text-ink/60 mb-1.5";

/* ─── Component ─── */
export function ProteinHero() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [sex, setSex] = useState<Sex>("hombre");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [activity, setActivity] = useState<Activity>("moderado");
  const [goal, setGoal] = useState<Goal>("mantener");
  const [result, setResult] = useState<{ min: number; max: number; leanMassKg: number | null } | null>(null);
  const [calculated, setCalculated] = useState(false);

  const handleCalc = useCallback(() => {
    const wKg =
      unit === "metric"
        ? parseFloat(weight)
        : parseFloat(weight) * 0.453592;
    const hCm =
      unit === "metric"
        ? parseFloat(heightCm)
        : parseFloat(heightFt) * 30.48 + parseFloat(heightIn || "0") * 2.54;

    if (!wKg || wKg < 20 || wKg > 300) return;
    if (!hCm || hCm < 100 || hCm > 250) return;

    const bf = bodyFat !== "" ? parseFloat(bodyFat) : null;
    setResult(calcProtein(wKg, hCm, bf, sex, activity, goal));
    setCalculated(true);
  }, [unit, sex, weight, heightCm, heightFt, heightIn, bodyFat, activity, goal]);

  const midpoint = result ? Math.round((result.min + result.max) / 2) : null;

  // Fill % for visual bar (capped between min 0–max 250 g)
  const barMin = result ? Math.min((result.min / 250) * 100, 100) : 0;
  const barMid = result ? Math.min((midpoint! / 250) * 100, 100) : 0;
  const barMax = result ? Math.min((result.max / 250) * 100, 100) : 0;

  // Goal color accent
  const goalAccent: Record<Goal, string> = {
    perder: "text-amber",
    mantener: "text-sage",
    ganar: "text-amber",
    rendimiento: "text-amber",
  };

  return (
    <section className="bg-espresso text-paper">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20 lg:px-14">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">

          {/* ── Left: form ── */}
          <div>
            {/* Unit toggle */}
            <div className="mb-8 flex items-center gap-2">
              {(["metric", "imperial"] as Unit[]).map((u) => (
                <button
                  key={u}
                  onClick={() => setUnit(u)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    unit === u
                      ? "bg-paper text-espresso"
                      : "text-paper/50 hover:text-paper/80"
                  }`}
                >
                  {u === "metric" ? "Métrico (kg/cm)" : "Imperial (lb/in)"}
                </button>
              ))}
            </div>

            <h1 className="mb-2 font-serif text-4xl font-semibold leading-tight text-balance">
              Calculadora de proteína diaria
            </h1>
            <p className="mb-8 text-paper/60 leading-relaxed text-pretty">
              Calcula cuánta proteína necesitas cada día según tu peso, objetivo y nivel de actividad. Obtén un rango personalizado basado en la evidencia científica.
            </p>

            {/* Sex */}
            <div className="mb-5">
              <span className={labelCls}>Sexo biológico</span>
              <div className="grid grid-cols-2 gap-2">
                {(["hombre", "mujer"] as Sex[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSex(s)}
                    className={`rounded-2xl border py-3 text-sm font-medium transition ${
                      sex === s
                        ? "border-sage bg-sage/20 text-sage"
                        : "border-paper/20 text-paper/50 hover:border-paper/40 hover:text-paper/70"
                    }`}
                  >
                    {s === "hombre" ? "Hombre" : "Mujer"}
                  </button>
                ))}
              </div>
            </div>

            {/* Age + Weight */}
            <div className="mb-5 grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Edad</label>
                <input
                  type="number"
                  placeholder="Años"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  min={15}
                  max={100}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Peso ({unit === "metric" ? "kg" : "lb"})</label>
                <input
                  type="number"
                  placeholder={unit === "metric" ? "kg" : "lb"}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>

            {/* Height */}
            <div className="mb-5">
              <label className={labelCls}>Altura</label>
              {unit === "metric" ? (
                <input
                  type="number"
                  placeholder="cm"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  className={inputCls}
                />
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Pies"
                    value={heightFt}
                    onChange={(e) => setHeightFt(e.target.value)}
                    className={inputCls}
                  />
                  <input
                    type="number"
                    placeholder="Pulgadas"
                    value={heightIn}
                    onChange={(e) => setHeightIn(e.target.value)}
                    className={inputCls}
                  />
                </div>
              )}
            </div>

            {/* Activity */}
            <div className="mb-5">
              <label className={labelCls}>Nivel de actividad</label>
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value as Activity)}
                className={inputCls}
              >
                {(Object.entries(ACTIVITY_LABELS) as [Activity, string][]).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>

            {/* Goal */}
            <div className="mb-5">
              <label className={labelCls}>Objetivo</label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.entries(GOAL_LABELS) as [Goal, string][]).map(([v, l]) => (
                  <button
                    key={v}
                    onClick={() => setGoal(v)}
                    className={`rounded-2xl border py-2.5 text-sm font-medium transition text-left px-4 ${
                      goal === v
                        ? "border-amber bg-amber/15 text-amber"
                        : "border-paper/20 text-paper/50 hover:border-paper/40 hover:text-paper/70"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Body fat optional */}
            <div className="mb-8">
              <label className={labelCls}>
                % grasa corporal{" "}
                <span className="font-normal text-paper/40">(opcional — mejora la precisión)</span>
              </label>
              <input
                type="number"
                placeholder="%"
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value)}
                min={5}
                max={60}
                className={inputCls}
              />
            </div>

            <button
              onClick={handleCalc}
              className="w-full rounded-full bg-sage py-4 text-sm font-semibold text-espresso transition hover:brightness-110 active:scale-[.98]"
            >
              Calcular proteína
            </button>
          </div>

          {/* ── Right: results panel ── */}
          <div className="space-y-4">
            {/* Main result card */}
            <div className="rounded-[24px] bg-amber/15 border border-amber/25 p-7">
              <p className="mb-1 text-xs uppercase tracking-widest text-amber/70">Tu proteína diaria</p>

              {calculated && result ? (
                <>
                  <div className="flex items-end gap-2 mb-1">
                    <span className="text-6xl font-bold text-amber leading-none">{midpoint}</span>
                    <span className="mb-2 text-xl text-amber/70">g/día</span>
                  </div>
                  <p className="text-sm text-paper/50 mb-6">
                    Rango recomendado: <span className="text-paper/80 font-medium">{result.min}–{result.max} g/día</span>
                    {result.leanMassKg && (
                      <span className="block mt-0.5">Calculado sobre masa magra: <span className="text-paper/80">{result.leanMassKg} kg</span></span>
                    )}
                  </p>

                  {/* Visual range bar */}
                  <div className="relative h-3 rounded-full bg-espresso/40 mb-6">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-amber/30"
                      style={{ width: `${barMax}%` }}
                    />
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-amber/60"
                      style={{ width: `${barMid}%` }}
                    />
                    {/* Markers */}
                    <div className="absolute top-1/2 -translate-y-1/2 h-4 w-0.5 bg-amber/50 rounded-full" style={{ left: `${barMin}%` }} />
                    <div className="absolute top-1/2 -translate-y-1/2 h-5 w-1 bg-amber rounded-full -translate-x-0.5" style={{ left: `${barMid}%` }} />
                    <div className="absolute top-1/2 -translate-y-1/2 h-4 w-0.5 bg-amber/50 rounded-full" style={{ left: `${barMax}%` }} />
                  </div>

                  {/* Per-meal breakdown */}
                  <div className="grid grid-cols-3 gap-3">
                    {[3, 4, 5].map((meals) => (
                      <div key={meals} className="rounded-xl bg-espresso/40 p-3 text-center">
                        <p className="text-lg font-semibold text-paper">{Math.round(midpoint! / meals)}g</p>
                        <p className="text-[11px] text-paper/45">{meals} comidas</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-end gap-2 mb-6">
                    <span className="text-6xl font-bold text-amber/30 leading-none">—</span>
                    <span className="mb-2 text-xl text-amber/30">g/día</span>
                  </div>
                  <div className="h-3 rounded-full bg-espresso/40 mb-6" />
                  <p className="text-sm text-paper/35 text-center">Rellena el formulario y pulsa calcular</p>
                </>
              )}
            </div>

            {/* Multiplier reference cards */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Mínimo recomendado", mult: "0,8 g/kg", desc: "Requisito básico OMS" },
                { label: "Para perder peso", mult: "1,6–2,0 g/kg", desc: "Preserva masa muscular" },
                { label: "Para ganar músculo", mult: "1,8–2,5 g/kg", desc: "Máxima síntesis proteica" },
                { label: "Deportistas de élite", mult: "2,2–3,1 g/kg", desc: "Alto volumen de entreno" },
              ].map((c) => (
                <div key={c.label} className="rounded-2xl border border-paper/10 bg-paper/5 p-4">
                  <p className="text-xs text-paper/45 mb-1">{c.label}</p>
                  <p className="font-semibold text-paper text-sm">{c.mult}</p>
                  <p className="text-[11px] text-paper/35 mt-0.5">{c.desc}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            {calculated && result && (
              <div className="rounded-2xl bg-espresso/60 border border-paper/10 p-5">
                <p className="text-sm text-paper/70 mb-3">
                  ¿Quieres un plan personalizado de nutrición y peso con seguimiento médico?
                </p>
                <QuizTrigger className="w-full rounded-full bg-sage py-3 text-sm font-semibold text-espresso text-center transition hover:brightness-110">
                  Hablar con un médico
                </QuizTrigger>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
