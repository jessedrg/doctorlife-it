import type { Metadata } from "next";
import Link from "next/link";
import { BmiHero } from "@/components/tools/bmi-hero";
import { QuizTrigger } from "@/components/quiz-trigger";
import { QuizProvider } from "@/components/quiz-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SITE_URL, BRAND } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Calcolatore IMC gratis | ${BRAND}`,
  description:
    "Calcola il tuo Indice di Massa Corporea in pochi secondi. Scopri se il tuo peso è sano e ottieni raccomandazioni mediche personalizzate di DoctorLife.",
  alternates: { canonical: `${SITE_URL}/herramientas/calculadora-imc` },
};

/* ── Overview cards ── */
const OVERVIEW = [
  {
    bmi: "< 18.5",
    label: "Bajo peso",
    color: "#5fb3a3",
    text: "Tu IMC está por debajo del rango saludable. Habla con un profesional de la salud para descartar causas subyacentes y recibir orientación.",
  },
  {
    bmi: "18.5 – 24.9",
    label: "Normopeso",
    color: "#cdd9a0",
    text: "Tu peso se encuentra en el rango saludable para tu altura. Mantén tus hábitos de alimentación equilibrada y actividad física regular.",
  },
  {
    bmi: "25 – 29.9",
    label: "Sobrepeso",
    color: "#e3b582",
    text: "Tu IMC indica sobrepeso. Un pequeño cambio en hábitos o un plan médico supervisado puede marcar una gran diferencia.",
  },
  {
    bmi: "> 30",
    label: "Obesidad",
    color: "#c98a4f",
    text: "Tu IMC indica obesidad. Un especialista puede valorar si un tratamiento farmacológico supervisado (como semaglutida o tirzepatida) es adecuado para ti.",
  },
];

/* ── FAQ ── */
const FAQ = [
  {
    q: "¿Qué significa el IMC?",
    a: "El Índice de Masa Corporal (IMC) es una medida que relaciona tu peso y tu altura. Se calcula dividiendo el peso en kilogramos entre el cuadrado de la altura en metros. Es una herramienta de cribado útil, aunque no mide directamente la grasa corporal.",
  },
  {
    q: "¿Para qué sirve conocer mi IMC?",
    a: "El IMC es un indicador orientativo de si tu peso podría suponer un riesgo para tu salud. Si está fuera del rango saludable, puede ser un punto de partida para hablar con un médico sobre posibles mejoras.",
  },
  {
    q: "¿El IMC es suficiente para evaluar mi salud?",
    a: "No. El IMC es solo una estimación. No distingue entre masa muscular y grasa, ni tiene en cuenta la distribución de grasa corporal, la edad, el sexo o la composición corporal. Un profesional de la salud puede realizar una evaluación más completa.",
  },
  {
    q: "¿Qué hago si mi IMC indica sobrepeso u obesidad?",
    a: "El primer paso es una valoración médica. En DoctorLife puedes obtenerla gratis para saber si un plan de pérdida de peso con supervisión médica —incluyendo tratamientos GLP‑1 como semaglutida o tirzepatida— es adecuado para tu caso.",
  },
  {
    q: "¿Cómo se calcula el IMC?",
    a: "La fórmula es: IMC = peso (kg) ÷ altura² (m). Por ejemplo, si mides 1,70 m y pesas 75 kg: IMC = 75 ÷ (1,70 × 1,70) = 25,95.",
  },
];

export default function CalculadoraImcPage() {
  return (
    <QuizProvider>
      <Navbar />
      <main>
        {/* ── Interactive hero ── */}
        <BmiHero />

        {/* ── Overview ── */}
        <section className="bg-paper px-6 py-20 lg:px-16 xl:px-24" id="overview">
          <div className="mx-auto max-w-6xl">
            {/* breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-10">
              <ol className="flex items-center gap-2 text-[13px] text-ink-mute">
                <li><Link href="/" className="hover:text-ink">Inicio</Link></li>
                <li aria-hidden>/</li>
                <li><Link href="/herramientas" className="hover:text-ink">Herramientas</Link></li>
                <li aria-hidden>/</li>
                <li className="text-ink font-medium">Calculadora de IMC</li>
              </ol>
            </nav>

            <h2 className="text-4xl font-bold text-ink md:text-5xl">Overview</h2>
            <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-ink-soft">
              El IMC es un indicador práctico, pero lo que importa es lo que haces con él. Así se interpreta cada categoría y cuál es el siguiente paso recomendado.
            </p>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {OVERVIEW.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col rounded-[24px] p-7"
                  style={{ backgroundColor: `${item.color}18`, border: `1px solid ${item.color}40` }}
                >
                  <span
                    className="mb-3 inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[.12em]"
                    style={{ backgroundColor: `${item.color}30`, color: item.color }}
                  >
                    {item.label}
                  </span>
                  <span className="mb-4 text-2xl font-bold text-ink" style={{ color: item.color }}>
                    IMC {item.bmi}
                  </span>
                  <p className="flex-1 text-[14.5px] leading-relaxed text-ink-soft">{item.text}</p>
                </div>
              ))}
            </div>

            {/* IMC formula explanation */}
            <div className="mt-16 rounded-[28px] bg-cream px-10 py-10 md:px-14">
              <h3 className="text-2xl font-bold text-ink">¿Cómo se calcula el IMC?</h3>
              <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-ink-soft">
                La fórmula es muy sencilla: divide tu peso en kilos entre el cuadrado de tu altura en metros.
              </p>
              <div className="mt-7 inline-flex flex-col items-start gap-3 rounded-2xl bg-ink px-8 py-6 font-mono text-paper">
                <span className="text-paper/50 text-sm">Fórmula</span>
                <span className="text-xl font-semibold tracking-tight">IMC = peso (kg) ÷ altura² (m)</span>
                <span className="text-paper/40 text-sm mt-1">Ej: 75 kg ÷ (1,70 × 1,70) = <strong className="text-amber">25,95</strong></span>
              </div>
              <p className="mt-6 text-[14px] leading-relaxed text-ink-mute max-w-2xl">
                Ten en cuenta que el IMC no distingue entre masa muscular y masa grasa, y puede infraestimar o sobreestimar el riesgo en personas con alta musculatura, embarazadas, ancianos o menores. Úsalo siempre como punto de partida, no como diagnóstico definitivo.
              </p>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="bg-warm px-6 py-20 lg:px-16 xl:px-24">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-ink md:text-4xl">Preguntas frecuentes</h2>
            <div className="mt-10 flex flex-col divide-y divide-ink/10">
              {FAQ.map(({ q, a }) => (
                <details key={q} className="group py-6">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[16.5px] font-semibold text-ink">
                    {q}
                    <span className="mt-0.5 shrink-0 text-ink-mute transition-transform duration-300 group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="bg-ink px-6 py-20 lg:px-16">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center md:flex-row md:text-left">
            <div className="flex-1">
              <span className="mb-3 inline-block rounded-full bg-sage/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[.14em] text-sage">
                Primera visita gratis
              </span>
              <h2 className="text-balance text-3xl font-bold text-paper md:text-4xl">
                ¿List@ para empezar?
              </h2>
              <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-paper/65">
                Reserva tu primera visita gratis y empieza con un plan diseñado en torno a ti.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 md:items-end">
              <QuizTrigger className="rounded-full bg-sage px-8 py-4 text-[15px] font-semibold text-ink">
                Reservar primera visita
              </QuizTrigger>
              <Link
                href="/planes"
                className="rounded-full border border-paper/20 px-8 py-4 text-[15px] font-medium text-paper/80 transition hover:border-paper/40 hover:text-paper"
              >
                Ver planes
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </QuizProvider>
  );
}
