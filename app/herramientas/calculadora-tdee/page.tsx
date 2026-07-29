import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { QuizProvider } from "@/components/quiz-context";
import { QuizTrigger } from "@/components/quiz-trigger";
import { TdeeHero } from "@/components/tools/tdee-hero";
import { SITE_URL, BRAND } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Calcolatore TDEE (Dispendio Energetico Totale) | ${BRAND}`,
  description:
    "Calcola il tuo TDEE — le calorie che bruci al giorno secondo peso, altezza, età, sesso e livello di attività. Scopri quante calorie ti servono per mantenere o perdere peso.",
  openGraph: {
    title: `Calcolatore TDEE | ${BRAND}`,
    description:
      "Calcola il tuo dispendio energetico giornaliero totale e scopri quante calorie ti servono per perdere peso in modo sostenibile.",
    url: `${SITE_URL}/herramientas/calculadora-tdee`,
  },
};

export default function TdeePage() {
  return (
    <QuizProvider>
      <div className="min-h-screen bg-paper font-sans text-ink">
        <Navbar />

        {/* ── Hero interactivo ── */}
        <TdeeHero />

        {/* ── Overview ── */}
        <section className="mx-auto max-w-3xl px-5 py-20 md:px-8">
          <h2 className="mb-10 font-serif text-4xl font-semibold leading-tight text-ink md:text-5xl">
            Overview
          </h2>

          {/* Qué es el TDEE */}
          <div className="mb-12">
            <h3 className="mb-4 text-2xl font-semibold text-ink">¿Qué es el TDEE?</h3>
            <p className="leading-relaxed text-ink/70">
              TDEE son las siglas en inglés de <em>Total Daily Energy Expenditure</em> (gasto energético
              total diario). Es la estimación de las calorías que tu cuerpo quema a lo largo de un día
              teniendo en cuenta tanto tu metabolismo basal como tu nivel de actividad física. Conocerlo
              es el primer paso para decidir si quieres mantener tu peso, perderlo o ganarlo.
            </p>
          </div>

          {/* Cómo se calcula */}
          <div className="mb-12">
            <h3 className="mb-4 text-2xl font-semibold text-ink">¿Cómo se calcula?</h3>
            <p className="mb-4 leading-relaxed text-ink/70">
              El cálculo parte de tu <strong className="text-ink">Tasa Metabólica Basal (TMB)</strong>,
              que es la energía mínima que tu cuerpo necesita en reposo para mantener las funciones
              vitales: respiración, circulación, temperatura corporal. La fórmula más precisa es la de
              Mifflin–St Jeor:
            </p>
            <div className="mb-4 rounded-2xl bg-espresso p-6 font-mono text-sm text-sage">
              <p className="mb-1">
                <span className="text-paper/50">Hombres: </span>
                <span className="text-paper">10 × peso(kg) + 6,25 × talla(cm) − 5 × edad + 5</span>
              </p>
              <p>
                <span className="text-paper/50">Mujeres: </span>
                <span className="text-paper">10 × peso(kg) + 6,25 × talla(cm) − 5 × edad − 161</span>
              </p>
            </div>
            <p className="mb-4 leading-relaxed text-ink/70">
              La TMB se multiplica después por un <strong className="text-ink">factor de actividad</strong>{" "}
              para obtener el TDEE:
            </p>
            <div className="overflow-x-auto rounded-2xl border border-ink/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-espresso text-paper">
                  <tr>
                    <th className="px-5 py-3 font-medium">Nivel de actividad</th>
                    <th className="px-5 py-3 font-medium">Factor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/8">
                  {[
                    ["Sedentario (sin ejercicio)", "× 1,2"],
                    ["Ligeramente activo (1–3 días/sem)", "× 1,375"],
                    ["Moderadamente activo (3–5 días/sem)", "× 1,55"],
                    ["Muy activo (6–7 días/sem)", "× 1,725"],
                    ["Extremadamente activo (deporte + trabajo físico)", "× 1,9"],
                  ].map(([label, factor]) => (
                    <tr key={label} className="even:bg-ink/[0.02]">
                      <td className="px-5 py-3 text-ink/70">{label}</td>
                      <td className="px-5 py-3 font-semibold text-ink">{factor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Qué hacer con tu TDEE */}
          <div className="mb-12">
            <h3 className="mb-4 text-2xl font-semibold text-ink">¿Qué hacer con tu TDEE?</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  title: "Perder peso",
                  desc: "Come por debajo de tu TDEE. Un déficit de 500 kcal/día equivale a perder ~0,5 kg por semana de forma sostenible.",
                  color: "bg-amber-50 border-amber-200",
                  dot: "bg-amber-400",
                },
                {
                  title: "Mantener peso",
                  desc: "Come exactamente tu TDEE. Si la ingesta iguala el gasto, tu peso se mantiene estable.",
                  color: "bg-sage/10 border-sage/30",
                  dot: "bg-sage",
                },
                {
                  title: "Ganar masa muscular",
                  desc: "Come por encima de tu TDEE. Un superávit moderado de 200–300 kcal/día minimiza el acúmulo de grasa.",
                  color: "bg-espresso/5 border-espresso/20",
                  dot: "bg-espresso",
                },
              ].map((item) => (
                <div key={item.title} className={`rounded-2xl border p-5 ${item.color}`}>
                  <div className="mb-3 flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${item.dot}`} />
                    <span className="font-semibold text-ink">{item.title}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-ink/65">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Limitaciones */}
          <div className="mb-12">
            <h3 className="mb-4 text-2xl font-semibold text-ink">Limitaciones de la calculadora</h3>
            <p className="leading-relaxed text-ink/70">
              El TDEE es una estimación. Factores como el porcentaje de masa muscular, el estado
              hormonal, la genética o las enfermedades metabólicas pueden hacer que tu gasto real sea
              distinto al calculado. Si tienes diabetes, hipotiroidismo u otra condición que afecte al
              metabolismo, consulta siempre a un médico antes de cambiar tu ingesta calórica.
            </p>
          </div>

          {/* FAQ */}
          <div className="mb-16">
            <h3 className="mb-6 text-2xl font-semibold text-ink">Preguntas frecuentes</h3>
            <div className="space-y-5">
              {[
                {
                  q: "¿Cuántas calorías debo comer para adelgazar?",
                  a: "Resta entre 300 y 500 kcal a tu TDEE. Déficits mayores pueden provocar pérdida de masa muscular y efecto rebote. Lo más sostenible es una pérdida de 0,5–1 kg por semana.",
                },
                {
                  q: "¿El TDEE cambia con el tiempo?",
                  a: "Sí. Si pierdes peso, tu TMB baja porque hay menos masa corporal que mantener. Por eso hay que recalcular el TDEE periódicamente durante un proceso de pérdida de peso.",
                },
                {
                  q: "¿Es lo mismo TDEE que metabolismo basal?",
                  a: "No. La TMB es las calorías que quemarías en reposo absoluto. El TDEE incluye además la energía del ejercicio, la digestión y cualquier actividad física diaria.",
                },
                {
                  q: "¿Necesito contar calorías exactamente?",
                  a: "No necesariamente. Conocer tu TDEE orientativo te ayuda a tomar mejores decisiones, pero un plan médico supervisado va más allá del conteo: tiene en cuenta tus hábitos, tu salud metabólica y el tratamiento más adecuado.",
                },
              ].map((item) => (
                <details
                  key={item.q}
                  className="group rounded-2xl border border-ink/10 bg-white open:border-sage/40"
                >
                  <summary className="flex cursor-pointer select-none items-center justify-between gap-4 px-6 py-5 font-medium text-ink marker:content-none">
                    {item.q}
                    <span className="shrink-0 text-ink/40 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="px-6 pb-5 text-sm leading-relaxed text-ink/65">{item.a}</p>
                </details>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="overflow-hidden rounded-3xl bg-espresso">
            <div className="flex flex-col items-start gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-10">
              <div className="space-y-2">
                <span className="inline-block rounded-full bg-sage/20 px-3 py-1 text-xs font-medium uppercase tracking-wider text-sage">
                  Primera visita gratis
                </span>
                <p className="text-2xl font-semibold text-paper md:text-3xl text-balance">
                  ¿List@ para empezar?
                </p>
                <p className="max-w-sm text-sm leading-relaxed text-paper/60">
                  Reserva tu primera visita gratis y empieza con un plan
                  diseñado en torno a ti.
                </p>
              </div>
              <div className="flex flex-col gap-3 shrink-0">
                <QuizTrigger className="rounded-full bg-sage px-8 py-3 text-sm font-semibold text-espresso transition-opacity hover:opacity-90 whitespace-nowrap">
                  Reservar primera visita
                </QuizTrigger>
                <a
                  href="/precios"
                  className="rounded-full border border-paper/20 px-8 py-3 text-center text-sm font-semibold text-paper transition-colors hover:bg-paper/5 whitespace-nowrap"
                >
                  Ver planes
                </a>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </QuizProvider>
  );
}
