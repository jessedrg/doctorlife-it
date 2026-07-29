import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { QuizProvider } from "@/components/quiz-context";
import { QuizTrigger } from "@/components/quiz-trigger";
import { DeficitHero } from "@/components/tools/deficit-hero";

export const metadata: Metadata = {
  title: "Calculadora de Déficit Calórico | DoctorLife",
  description:
    "Calcula tu déficit calórico diario para perder peso a tu ritmo. Basado en tu TDEE, peso objetivo y nivel de actividad. Gratis, en segundos.",
};

const overview = [
  {
    h3: "¿Qué es el déficit calórico?",
    body: "Un déficit calórico ocurre cuando consumes menos calorías de las que tu cuerpo necesita para mantener el peso actual (tu TDEE). Ese déficit obliga al organismo a recurrir a sus reservas de grasa para obtener energía, lo que produce pérdida de peso.",
  },
  {
    h3: "¿Cuánto déficit es seguro?",
    body: "La mayoría de guías clínicas consideran seguro un déficit de 500–750 kcal/día, que equivale a perder entre 0,5 y 0,75 kg por semana. Déficits más agresivos (más de 1 000 kcal/día) pueden provocar pérdida de masa muscular, fatiga y carencias nutricionales, y solo deben hacerse con supervisión médica.",
  },
  {
    h3: "¿Por qué necesito saber mi TDEE?",
    body: "El TDEE (Gasto Energético Diario Total) es la base de cualquier cálculo de déficit. Sin saber cuántas calorías quemas al día, no puedes saber cuántas debes comer. Esta calculadora estima tu TDEE usando la fórmula Mifflin-St Jeor o Katch-McArdle (si introduces tu % de grasa) y luego aplica el déficit según el ritmo que eliges.",
  },
  {
    h3: "¿Por qué el cuerpo se adapta y se ralentiza la pérdida?",
    body: "Con el tiempo, la pérdida de peso se ralentiza porque tu TDEE disminuye al pesar menos. Es el llamado 'plateau'. Recalcular periódicamente tu déficit —o añadir supervisión médica— ayuda a superar esos estancamientos.",
  },
];

const faq = [
  {
    q: "¿Cuántas calorías debo comer para perder 5 kg?",
    a: "Depende de tu TDEE actual. Un déficit de 550 kcal/día (aprox.) produce unos 0,5 kg/semana, lo que equivale a 10 semanas para perder 5 kg. Introduce tus datos en la calculadora para ver tu estimación personalizada.",
  },
  {
    q: "¿Es seguro estar siempre en déficit?",
    a: "No indefinidamente. El cuerpo necesita periodos de mantenimiento para evitar adaptaciones metabólicas, pérdida de músculo y fatiga. Se recomienda alternar fases de déficit con pausas de mantenimiento, siempre con orientación profesional.",
  },
  {
    q: "¿Qué pasa si como por debajo de 1 200 kcal/día?",
    a: "Comer muy poco reduce el metabolismo, provoca pérdida de músculo y dificulta cubrir los micronutrientes necesarios. La calculadora nunca sugiere menos de 1 200 kcal/día. Por debajo de ese umbral es imprescindible la supervisión médica.",
  },
  {
    q: "¿Puedo usar este resultado como dieta?",
    a: "La calculadora es una estimación orientativa, no una prescripción dietética. La distribución de macronutrientes, las comorbilidades y los medicamentos que tomes pueden cambiar significativamente las recomendaciones. Consulta siempre a un médico o dietista.",
  },
  {
    q: "¿En qué se diferencia esta calculadora de la del TDEE?",
    a: "La calculadora TDEE te dice cuánto quemas. Esta calculadora de déficit parte de ese dato y te indica cuánto debes comer según el ritmo de pérdida que deseas y tu peso objetivo, añadiendo además la estimación de tiempo para llegar a la meta.",
  },
];

export default function Page() {
  return (
    <QuizProvider>
      <div className="flex min-h-screen flex-col bg-paper">
        <Navbar />

        {/* breadcrumb */}
        <nav aria-label="Breadcrumb" className="px-6 pt-6 text-[13px] text-ink/45 md:px-14">
          <ol className="flex items-center gap-1.5">
            <li><a href="/" className="hover:text-ink">Inicio</a></li>
            <li aria-hidden="true">/</li>
            <li><a href="/herramientas" className="hover:text-ink">Herramientas</a></li>
            <li aria-hidden="true">/</li>
            <li className="text-ink/70">Déficit calórico</li>
          </ol>
        </nav>

        {/* hero */}
        <DeficitHero />

        {/* overview */}
        <section className="mx-auto w-full max-w-6xl px-6 py-16 md:px-14">
          <h2 className="font-display text-[2rem] font-bold text-ink">Sobre el déficit calórico</h2>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {overview.map((item) => (
              <div key={item.h3} className="rounded-3xl border border-ink/8 bg-white px-7 py-7">
                <h3 className="font-display text-[1.15rem] font-semibold text-ink">{item.h3}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink/65">{item.body}</p>
              </div>
            ))}
          </div>

          {/* ranges table */}
          <div className="mt-12">
            <h3 className="font-display text-[1.4rem] font-bold text-ink">
              Guía de ritmos de pérdida
            </h3>
            <div className="mt-6 overflow-hidden rounded-3xl border border-ink/10">
              <table className="w-full border-collapse text-left text-[14px]">
                <thead>
                  <tr className="bg-espresso text-paper">
                    <th className="px-6 py-3.5 font-semibold">Ritmo</th>
                    <th className="px-6 py-3.5 font-semibold">Déficit diario</th>
                    <th className="px-6 py-3.5 font-semibold">Pérdida/semana</th>
                    <th className="px-6 py-3.5 font-semibold">Recomendación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/8 bg-white">
                  {[
                    ["Suave", "~275 kcal/día", "~0,25 kg", "Ideal para principiantes o los últimos kg"],
                    ["Moderado", "~550 kcal/día", "~0,5 kg", "Equilibrio eficaz y sostenible"],
                    ["Intenso", "~825 kcal/día", "~0,75 kg", "Requiere seguimiento nutricional"],
                    ["Agresivo", "~1 100 kcal/día", "~1 kg", "Solo con supervisión médica"],
                  ].map(([r, d, p, rec]) => (
                    <tr key={r}>
                      <td className="px-6 py-3.5 font-medium text-ink">{r}</td>
                      <td className="px-6 py-3.5 text-ink/70">{d}</td>
                      <td className="px-6 py-3.5 text-ink/70">{p}</td>
                      <td className="px-6 py-3.5 text-ink/60">{rec}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-14">
            <h3 className="font-display text-[1.4rem] font-bold text-ink">Preguntas frecuentes</h3>
            <div className="mt-6 flex flex-col divide-y divide-ink/10 rounded-3xl border border-ink/10 bg-white overflow-hidden">
              {faq.map((item) => (
                <div key={item.q} className="px-7 py-6">
                  <p className="font-semibold text-ink">{item.q}</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink/65">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* final CTA */}
        <section className="mx-auto w-full max-w-6xl px-6 pb-20 md:px-14">
          <div className="flex flex-col items-start gap-5 rounded-[28px] bg-espresso px-10 py-10 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="inline-block rounded-full bg-sage/20 px-3 py-1 text-xs font-semibold uppercase tracking-[.12em] text-sage">
                Primera visita gratis
              </span>
              <h2 className="mt-3 font-display text-[1.8rem] font-bold leading-tight text-paper text-balance">
                ¿List@ para empezar con un plan real?
              </h2>
              <p className="mt-2 max-w-md text-[15px] leading-relaxed text-paper/65">
                Reserva tu primera visita médica gratis y recibe un plan de adelgazamiento diseñado para ti.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3">
              <QuizTrigger className="rounded-full bg-sage px-8 py-3 text-[15px] font-semibold text-espresso hover:opacity-90 transition-opacity">
                Reservar primera visita
              </QuizTrigger>
              <a
                href="/planes"
                className="rounded-full border border-paper/25 px-8 py-3 text-center text-[15px] font-semibold text-paper hover:bg-paper/10 transition-colors"
              >
                Ver planes
              </a>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </QuizProvider>
  );
}
