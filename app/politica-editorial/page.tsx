import type { Metadata } from "next";
import { QuizProvider } from "@/components/quiz-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, faqSchema, SITE_URL, BRAND } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Política editorial — Cómo creamos el contenido médico | ${BRAND}`,
  description:
    "Conoce cómo se crea, revisa y actualiza el contenido médico de DoctorLife: proceso editorial, criterios de evidencia científica, revisión por médicos colegiados y política de actualización.",
  alternates: { canonical: `${SITE_URL}/politica-editorial` },
  openGraph: {
    title: `Política editorial | ${BRAND}`,
    description:
      "Proceso editorial, criterios de evidencia científica, revisión por médicos colegiados y política de actualización del contenido de DoctorLife.",
    url: `${SITE_URL}/politica-editorial`,
    type: "website",
    locale: "es_ES",
    siteName: BRAND,
  },
};

const faqs = [
  {
    q: "¿Quién escribe el contenido médico de DoctorLife?",
    a: "El contenido es redactado por profesionales de la comunicación sanitaria y revisado por médicos colegiados especializados (endocrinólogos, internistas, especialistas en salud metabólica). Cada artículo indica su autor y revisor médico.",
  },
  {
    q: "¿Con qué frecuencia se actualiza el contenido?",
    a: "Revisamos todos los artículos al menos una vez al año, o antes si se publican nuevas guías clínicas relevantes (AACE, SEEN, NICE, ADA). La fecha de última actualización aparece visible en cada artículo.",
  },
  {
    q: "¿Qué fuentes científicas utilizáis?",
    a: "Usamos exclusivamente guías clínicas de sociedades médicas reconocidas, estudios publicados en revistas indexadas (PubMed, Cochrane) y fichas técnicas de la EMA. No usamos fuentes sin revisar por pares.",
  },
  {
    q: "¿El contenido de DoctorLife sustituye a una consulta médica?",
    a: "No. Todo el contenido del blog y de la web es informativo y educativo. Nunca sustituye el diagnóstico, tratamiento o consejo de un médico colegiado. Ante cualquier duda de salud, consulta con un profesional.",
  },
  {
    q: "¿Cómo notificáis los errores?",
    a: "Si detectas un error o información desactualizada, puedes escribirnos a hello@doctorlife.io con el asunto 'Corrección editorial'. Revisamos todas las notificaciones en un plazo de 5 días laborables.",
  },
];

const breadcrumbs = breadcrumbSchema([
  { name: "Inicio", url: SITE_URL },
  { name: "Política editorial", url: `${SITE_URL}/politica-editorial` },
]);

const steps = [
  {
    num: "01",
    title: "Identificación del tema",
    body: "El equipo editorial selecciona temas basándose en las preguntas reales de los pacientes, las guías clínicas más recientes y las búsquedas con mayor intención informativa en salud metabólica y hormonal.",
  },
  {
    num: "02",
    title: "Documentación y redacción",
    body: "Un redactor especializado en comunicación sanitaria investiga las fuentes primarias (guías clínicas, ensayos clínicos en PubMed/Cochrane) y redacta el artículo con lenguaje accesible, citando todas las referencias.",
  },
  {
    num: "03",
    title: "Revisión médica",
    body: "Un médico colegiado especializado en el área revisa la precisión clínica, corrige imprecisiones y valida que el contenido está alineado con las guías vigentes. Su nombre y número de colegiado se publican en el artículo.",
  },
  {
    num: "04",
    title: "Edición y publicación",
    body: "El equipo editorial hace una última revisión de claridad, estructura y cumplimiento de nuestras directrices de estilo médico. El artículo se publica con fecha de creación y fecha de última revisión visibles.",
  },
  {
    num: "05",
    title: "Actualización periódica",
    body: "Revisamos todos los artículos al menos una vez al año. Si se publican guías nuevas o cambia el consenso médico, actualizamos el artículo antes de esa revisión anual y marcamos la nueva fecha de modificación.",
  },
];

const sources = [
  { name: "SEEN — Sociedad Española de Endocrinología y Nutrición", url: "https://www.seen.es" },
  { name: "AACE — American Association of Clinical Endocrinology", url: "https://www.aace.com" },
  { name: "NICE — National Institute for Health and Care Excellence", url: "https://www.nice.org.uk" },
  { name: "ADA — American Diabetes Association", url: "https://www.diabetes.org" },
  { name: "EMA — Agencia Europea de Medicamentos", url: "https://www.ema.europa.eu" },
  { name: "PubMed / MEDLINE — NLM", url: "https://pubmed.ncbi.nlm.nih.gov" },
  { name: "Cochrane Library", url: "https://www.cochranelibrary.com" },
];

export default function PoliticaEditorialPage() {
  return (
    <QuizProvider>
      <JsonLd data={[breadcrumbs, faqSchema(faqs)]} />
      <div className="overflow-x-clip bg-paper">
        <Navbar />
        <main>
          {/* ── Hero ── */}
          <section className="mx-auto max-w-[820px] px-5 pb-12 pt-14">
            <nav aria-label="Migas de pan" className="mb-8 flex items-center gap-2 text-[13px] text-ink-mute">
              <a href="/" className="hover:text-ink">Inicio</a>
              <span aria-hidden>/</span>
              <span className="text-ink">Política editorial</span>
            </nav>
            <span className="text-[13px] font-semibold uppercase tracking-[.16em] text-clay">
              Transparencia editorial
            </span>
            <h1 className="mt-3 text-balance text-[clamp(30px,4.5vw,52px)] font-light leading-[1.05] tracking-[-0.03em] text-ink">
              Cómo creamos y revisamos el contenido médico
            </h1>
            <p className="mt-5 max-w-[62ch] text-[17.5px] leading-[1.7] text-ink-soft">
              Todo el contenido de DoctorLife es redactado por especialistas en
              comunicación sanitaria y revisado por médicos colegiados. Esta página
              explica exactamente cómo funciona ese proceso y qué estándares seguimos.
            </p>
            <p className="mt-3 text-[14px] text-ink-mute">
              Última revisión de esta política: julio de 2025
            </p>
          </section>

          {/* ── Disclaimer ── */}
          <div className="mx-auto max-w-[820px] px-5 pb-10">
            <div className="rounded-[16px] border border-amber/30 bg-amber/8 px-6 py-5">
              <p className="text-[15px] leading-relaxed text-ink-soft">
                <strong className="text-ink">Aviso importante:</strong> El contenido
                del blog y de la web de DoctorLife tiene exclusivamente carácter
                informativo y educativo. No constituye diagnóstico, consejo ni
                prescripción médica. Ante cualquier síntoma o duda de salud,
                consulta siempre con un médico colegiado.
              </p>
            </div>
          </div>

          {/* ── Proceso editorial ── */}
          <section className="mx-auto max-w-[820px] px-5 py-10">
            <span className="text-[13px] font-semibold uppercase tracking-[.16em] text-olive">
              Nuestro proceso
            </span>
            <h2 className="mt-3 text-balance text-[clamp(20px,2.8vw,32px)] font-light leading-[1.1] tracking-[-0.025em] text-ink">
              Del borrador a la publicación: 5 pasos
            </h2>
            <div className="mt-10 flex flex-col gap-0">
              {steps.map((s, i) => (
                <div key={s.num} className="flex gap-6">
                  {/* línea vertical */}
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-olive text-[13px] font-bold text-paper">
                      {s.num}
                    </div>
                    {i < steps.length - 1 && (
                      <div className="mt-1 w-px flex-1 bg-olive/20" style={{ minHeight: 32 }} />
                    )}
                  </div>
                  <div className="pb-10">
                    <h3 className="text-[17px] font-medium text-ink">{s.title}</h3>
                    <p className="mt-2 text-[15.5px] leading-relaxed text-ink-soft">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Fuentes ── */}
          <section className="bg-cream">
            <div className="mx-auto max-w-[820px] px-5 py-14">
              <span className="text-[13px] font-semibold uppercase tracking-[.16em] text-clay">
                Fuentes de referencia
              </span>
              <h2 className="mt-3 text-balance text-[clamp(20px,2.8vw,32px)] font-light leading-[1.1] tracking-[-0.025em] text-ink">
                Organizaciones y bases de datos que consultamos
              </h2>
              <p className="mt-4 text-[16px] leading-[1.7] text-ink-soft">
                Solo utilizamos fuentes de nivel primario: guías de sociedades médicas
                reconocidas, estudios revisados por pares y fichas técnicas oficiales.
              </p>
              <ul className="mt-8 flex flex-col gap-3">
                {sources.map((s) => (
                  <li key={s.name} className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-olive" />
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[15.5px] text-olive underline-offset-2 hover:underline"
                    >
                      {s.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section className="mx-auto max-w-[820px] px-5 py-14">
            <span className="text-[13px] font-semibold uppercase tracking-[.16em] text-olive">
              Preguntas frecuentes
            </span>
            <h2 className="mt-3 mb-8 text-balance text-[clamp(20px,2.8vw,32px)] font-light leading-[1.1] tracking-[-0.025em] text-ink">
              Sobre nuestro contenido
            </h2>
            <div className="flex flex-col divide-y divide-ink/10">
              {faqs.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[17px] font-medium text-ink">
                    {f.q}
                    <span className="mt-0.5 flex-shrink-0 text-ink-mute transition-transform group-open:rotate-180">
                      ▾
                    </span>
                  </summary>
                  <p className="mt-3 text-[15.5px] leading-relaxed text-ink-soft">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* ── Contacto editorial ── */}
          <section className="bg-espresso">
            <div className="mx-auto flex max-w-[820px] flex-col items-center gap-5 px-5 py-14 text-center">
              <h2 className="text-balance text-[clamp(20px,2.8vw,32px)] font-light leading-tight tracking-[-0.025em] text-paper">
                ¿Encontraste un error o información desactualizada?
              </h2>
              <p className="max-w-[48ch] text-[16px] text-paper/70">
                Escríbenos con el asunto "Corrección editorial". Revisamos todas las
                notificaciones en un plazo de 5 días laborables.
              </p>
              <a
                href="mailto:hello@doctorlife.io?subject=Corrección editorial"
                className="rounded-full bg-clay px-7 py-3 text-[15px] font-semibold text-paper transition-opacity hover:opacity-90"
              >
                Notificar un error
              </a>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </QuizProvider>
  );
}
