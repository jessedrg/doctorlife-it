import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { QuizProvider } from "@/components/quiz-context";
import { QuizTrigger } from "@/components/quiz-trigger";
import { ProteinHero } from "@/components/tools/protein-hero";

export const metadata: Metadata = {
  title: "Calculadora de Proteína Diaria | DoctorLife",
  description:
    "Calcula cuánta proteína necesitas al día según tu peso, objetivo y nivel de actividad. Rango personalizado basado en evidencia científica (ISSN / OMS).",
  openGraph: {
    title: "Calculadora de Proteína Diaria | DoctorLife",
    description:
      "Calcula cuánta proteína necesitas al día según tu peso, objetivo y nivel de actividad. Rango personalizado basado en evidencia científica.",
  },
};

export default function CalculadoraProteinaPage() {
  return (
    <QuizProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />

        <main>
          {/* Interactive hero */}
          <ProteinHero />

          {/* Overview */}
          <section className="mx-auto max-w-4xl px-6 py-16 lg:px-14">
            <h2 className="mb-8 font-serif text-3xl font-semibold text-ink">¿Por qué importa la proteína?</h2>

            <div className="prose prose-neutral max-w-none text-ink/75 leading-relaxed space-y-4">
              <p>
                La proteína es el macronutriente más importante cuando el objetivo es perder grasa preservando músculo, ganar masa muscular o simplemente mantener un cuerpo sano. A diferencia de los carbohidratos o las grasas, el organismo no la almacena en grandes cantidades, por lo que necesitas aportarla cada día.
              </p>
              <p>
                Cuando comes menos calorías de las que gastas, el cuerpo puede obtener energía tanto del tejido graso como del músculo. Una ingesta alta de proteína protege la masa muscular durante el déficit calórico, lo que significa que la mayor parte del peso que pierdes viene de la grasa y no del músculo.
              </p>
            </div>

            {/* 3-card benefit grid */}
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                {
                  title: "Preserva el músculo",
                  body: "Con déficit calórico, la proteína alta reduce la pérdida de masa muscular hasta un 50 % comparado con ingestas bajas.",
                },
                {
                  title: "Aumenta la saciedad",
                  body: "La proteína es el macronutriente más saciante. Te ayuda a comer menos sin pasar hambre.",
                },
                {
                  title: "Eleva el metabolismo",
                  body: "Digerir proteína consume más energía que digerir carbohidratos o grasa (efecto térmico del 20–30 %).",
                },
              ].map((c) => (
                <div key={c.title} className="rounded-2xl border border-ink/10 bg-paper p-6">
                  <h3 className="mb-2 font-semibold text-ink">{c.title}</h3>
                  <p className="text-sm text-ink/60 leading-relaxed">{c.body}</p>
                </div>
              ))}
            </div>

            {/* How we calculate */}
            <h2 className="mt-14 mb-6 font-serif text-3xl font-semibold text-ink">Cómo calculamos tu proteína</h2>
            <p className="text-ink/70 leading-relaxed mb-6">
              Usamos los rangos de la{" "}
              <strong className="text-ink">Sociedad Internacional de Nutrición Deportiva (ISSN)</strong> y las recomendaciones de la OMS, ajustados por tu nivel de actividad y objetivo:
            </p>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-ink/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-ink/5">
                  <tr>
                    <th className="px-5 py-3 font-semibold text-ink/70">Objetivo</th>
                    <th className="px-5 py-3 font-semibold text-ink/70">Rango (g/kg peso)</th>
                    <th className="px-5 py-3 font-semibold text-ink/70">Notas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/8">
                  {[
                    ["Mínimo saludable", "0,8 g/kg", "Requisito básico OMS"],
                    ["Perder peso", "1,6–2,0 g/kg", "Preservar músculo en déficit"],
                    ["Mantener peso", "1,2–1,6 g/kg", "Mantenimiento general"],
                    ["Ganar músculo", "1,8–2,5 g/kg", "Síntesis proteica óptima"],
                    ["Rendimiento deportivo", "2,0–2,6 g/kg", "Alto volumen de entreno"],
                    ["Masa magra (si se conoce %grasa)", "×1,15 del rango", "Más preciso que el peso total"],
                  ].map(([obj, range, note]) => (
                    <tr key={obj} className="even:bg-ink/[.02]">
                      <td className="px-5 py-3 font-medium text-ink">{obj}</td>
                      <td className="px-5 py-3 text-amber font-semibold">{range}</td>
                      <td className="px-5 py-3 text-ink/55">{note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Sources guide */}
            <h2 className="mt-14 mb-6 font-serif text-3xl font-semibold text-ink">Cómo distribuirla durante el día</h2>
            <p className="text-ink/70 leading-relaxed mb-4">
              La investigación muestra que distribuir la proteína en 3–5 comidas maximiza la síntesis muscular, ya que cada toma activa el anabolismo de forma independiente. Tomar más de 40–50 g en una sola ingesta no aporta ventajas adicionales en la mayoría de personas.
            </p>
            <ul className="list-none space-y-3 text-ink/70">
              {[
                "Desayuno con proteína: huevos, yogur griego, requesón o batido.",
                "Almuerzo y cena con fuente proteica magra: pollo, pescado, legumbres, tofu.",
                "Snack opcional post-entreno: proteína de suero o queso fresco.",
                "Intenta no dejar más de 5–6 horas entre tomas proteicas.",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-sage" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* FAQ */}
            <h2 className="mt-14 mb-6 font-serif text-3xl font-semibold text-ink">Preguntas frecuentes</h2>
            <div className="space-y-6">
              {[
                {
                  q: "¿Puedo comer demasiada proteína?",
                  a: "En personas sanas sin enfermedad renal, ingestas de hasta 3,5 g/kg se han descrito como seguras en estudios a corto plazo. Sin embargo, ingestas muy elevadas durante años sin supervisión no son necesarias y pueden desplazar otros nutrientes. Si tienes riñones sanos y no superas los 2,5 g/kg, no hay preocupación.",
                },
                {
                  q: "¿Las personas mayores necesitan más proteína?",
                  a: "Sí. A partir de los 60 años, el músculo es menos sensible al estímulo proteico (resistencia anabólica). Se recomienda al menos 1,2–1,6 g/kg al día, distribuidos en varias tomas con al menos 30–40 g por comida principal.",
                },
                {
                  q: "¿Importa la fuente de proteína (animal vs vegetal)?",
                  a: "La proteína animal tiene un perfil de aminoácidos esenciales más completo y mayor leucina. La proteína vegetal es perfectamente adecuada combinando fuentes (legumbres + cereal, soja, etc.) y aumentando ligeramente la cantidad total.",
                },
                {
                  q: "¿La proteína engorda?",
                  a: "La proteína en sí misma no engorda más que otros macronutrientes a igualdad de calorías. De hecho, su alto efecto térmico y su poder saciante la hacen especialmente útil en dietas de pérdida de peso.",
                },
                {
                  q: "¿Necesito suplementos de proteína?",
                  a: "No necesariamente. Si alcanzas tu objetivo proteico solo con alimentos, los suplementos no añaden beneficios. Son útiles cuando es difícil llegar al rango recomendado solo con la dieta habitual.",
                },
              ].map(({ q, a }) => (
                <div key={q} className="rounded-2xl border border-ink/10 bg-paper p-6">
                  <h3 className="mb-2 font-semibold text-ink">{q}</h3>
                  <p className="text-sm text-ink/65 leading-relaxed">{a}</p>
                </div>
              ))}
            </div>

            {/* Final CTA */}
            <div className="mt-14 rounded-[24px] bg-espresso px-8 py-10 text-paper flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <span className="inline-block mb-3 rounded-full bg-sage/20 px-3 py-1 text-xs font-medium text-sage">
                  Primera visita gratis
                </span>
                <h3 className="font-serif text-2xl font-semibold mb-1">¿List@ para empezar?</h3>
                <p className="text-paper/60 text-sm leading-relaxed max-w-sm">
                  Reserva tu primera visita gratis y empieza con un plan de nutrición y peso diseñado en torno a ti.
                </p>
              </div>
              <div className="flex flex-col gap-3 shrink-0">
                <QuizTrigger className="rounded-full bg-sage px-7 py-3.5 text-sm font-semibold text-espresso text-center transition hover:brightness-110">
                  Reservar primera visita
                </QuizTrigger>
                <a
                  href="/planes"
                  className="rounded-full border border-paper/30 px-7 py-3.5 text-sm font-medium text-paper text-center transition hover:border-paper/60"
                >
                  Ver planes
                </a>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </QuizProvider>
  );
}
