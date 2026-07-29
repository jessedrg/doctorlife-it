import type { Metadata } from "next";
import { QuizProvider } from "@/components/quiz-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationSchema, breadcrumbSchema, SITE_URL, BRAND } from "@/lib/seo";
import { experts } from "@/lib/data";
import { BadgeCheck, Stethoscope, ShieldCheck, Users, HeartPulse, Clock } from "lucide-react";
import { MedicalTeamSection } from "@/components/medical-team-section";

export const metadata: Metadata = {
  title: `Sobre nosotros — Quiénes somos | ${BRAND}`,
  description:
    "DoctorLife es una plataforma de telemedicina fundada en España con médicos colegiados. Conoce nuestra misión, nuestro equipo y cómo seleccionamos a los profesionales que cuidan de ti.",
  alternates: { canonical: `${SITE_URL}/sobre-nosotros` },
  openGraph: {
    title: `Sobre nosotros | ${BRAND}`,
    description:
      "DoctorLife es una plataforma de telemedicina fundada en España con médicos colegiados. Conoce nuestra misión y cómo seleccionamos a los profesionales que cuidan de ti.",
    url: `${SITE_URL}/sobre-nosotros`,
    type: "website",
    locale: "es_ES",
    siteName: BRAND,
  },
};

const values = [
  {
    icon: Stethoscope,
    title: "Medicina basada en evidencia",
    body: "Cada recomendación que hacemos está respaldada por guías clínicas actualizadas y revisada por médicos colegiados.",
  },
  {
    icon: ShieldCheck,
    title: "Seguridad antes que velocidad",
    body: "No prescribimos si no es lo correcto para ti. La valoración médica determina si el tratamiento es adecuado para tu caso.",
  },
  {
    icon: Users,
    title: "Accesibilidad real",
    body: "Consulta médica de calidad sin listas de espera, sin desplazamientos y con respuesta en horas, no semanas.",
  },
  {
    icon: HeartPulse,
    title: "Seguimiento continuo",
    body: "No te dejamos sólo con una receta. Ajustamos el tratamiento con seguimiento médico real, mes a mes.",
  },
  {
    icon: Clock,
    title: "Sin permanencia",
    body: "Cancela cuando quieras. Creemos que la confianza se construye con resultados, no con contratos.",
  },
  {
    icon: BadgeCheck,
    title: "Transparencia total",
    body: "Conoces el precio, el médico que te valora y exactamente qué incluye cada visita antes de comenzar.",
  },
];

const breadcrumbs = breadcrumbSchema([
  { name: "Inicio", url: SITE_URL },
  { name: "Sobre nosotros", url: `${SITE_URL}/sobre-nosotros` },
]);

export default function SobreNosotrosPage() {
  return (
    <QuizProvider>
      <JsonLd data={[organizationSchema, breadcrumbs]} />
      <div className="overflow-x-clip bg-paper">
        <Navbar />
        <main>
          {/* ── Hero ── */}
          <section className="mx-auto max-w-[860px] px-5 pb-16 pt-14">
            <nav aria-label="Migas de pan" className="mb-8 flex items-center gap-2 text-[13px] text-ink-mute">
              <a href="/" className="hover:text-ink">Inicio</a>
              <span aria-hidden>/</span>
              <span className="text-ink">Sobre nosotros</span>
            </nav>

            <span className="text-[13px] font-semibold uppercase tracking-[.16em] text-clay">
              Quiénes somos
            </span>
            <h1 className="mt-3 text-balance text-[clamp(32px,5vw,56px)] font-light leading-[1.05] tracking-[-0.03em] text-ink">
              Medicina real, accesible y sin esperas
            </h1>
            <p className="mt-5 max-w-[62ch] text-[18px] leading-[1.7] text-ink-soft">
              DoctorLife es una plataforma de telemedicina fundada en España con el
              propósito de acercar el cuidado médico de calidad a cualquier persona,
              independientemente de dónde viva o de sus horarios. Trabajamos con
              médicos colegiados que ejercen de forma independiente en la plataforma
              y que son responsables clínicos de cada caso.
            </p>
          </section>

          {/* ── Misión ── */}
          <section className="bg-espresso">
            <div className="mx-auto max-w-[860px] px-5 py-16">
              <h2 className="text-balance text-[clamp(24px,3.5vw,38px)] font-light leading-[1.1] tracking-[-0.025em] text-paper">
                Nuestra misión es devolverle a la medicina su función real:{" "}
                <span className="font-serif italic text-sage">
                  entender a la persona, no solo el síntoma.
                </span>
              </h2>
              <p className="mt-6 max-w-[64ch] text-[17px] leading-[1.7] text-paper/75">
                El sistema sanitario actual dificulta el acceso a especialistas de
                forma rápida y personalizada. DoctorLife nació para cubrir ese hueco:
                ofrecer valoración médica especializada, tratamiento supervisado y
                seguimiento continuo, todo desde una plataforma diseñada para que el
                paciente esté siempre informado y en control.
              </p>
            </div>
          </section>

          {/* ── Cómo seleccionamos médicos ── */}
          <section className="mx-auto max-w-[860px] px-5 py-16">
            <span className="text-[13px] font-semibold uppercase tracking-[.16em] text-olive">
              Nuestros estándares
            </span>
            <h2 className="mt-3 text-balance text-[clamp(22px,3vw,34px)] font-light leading-[1.1] tracking-[-0.025em] text-ink">
              Cómo seleccionamos a los médicos de la plataforma
            </h2>
            <p className="mt-4 max-w-[62ch] text-[17px] leading-[1.7] text-ink-soft">
              Todos los médicos que trabajan en DoctorLife pasan por un proceso de
              verificación riguroso antes de atender su primer paciente:
            </p>
            <ul className="mt-8 flex flex-col gap-4">
              {[
                "Colegiación activa y verificada en el Colegio Oficial de Médicos de España.",
                "Especialización acreditada en endocrinología, medicina interna, salud hormonal o metabólica.",
                "Revisión de formación continuada y actualización en guías clínicas vigentes (AACE, SEEN, NICE).",
                "Entrevista de incorporación con el equipo médico de DoctorLife.",
                "Supervisión periódica de la calidad de las valoraciones y el seguimiento a pacientes.",
                "Cumplimiento de la normativa de telemedicina vigente en España (Ley 41/2002).",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[16.5px] leading-relaxed text-ink-soft">
                  <BadgeCheck aria-hidden className="mt-0.5 h-5 w-5 flex-shrink-0 text-olive" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* ── Valores ── */}
          <section className="bg-cream">
            <div className="mx-auto max-w-[860px] px-5 py-16">
              <span className="text-[13px] font-semibold uppercase tracking-[.16em] text-clay">
                Nuestros principios
              </span>
              <h2 className="mt-3 text-balance text-[clamp(22px,3vw,34px)] font-light leading-[1.1] tracking-[-0.025em] text-ink">
                Lo que guía cada decisión en DoctorLife
              </h2>
              <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {values.map(({ icon: Icon, title, body }) => (
                  <div key={title} className="rounded-[20px] bg-paper p-6 shadow-[0_2px_16px_-4px_rgba(34,29,23,.1)]">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-olive/10">
                      <Icon aria-hidden className="h-5 w-5 text-olive" />
                    </div>
                    <h3 className="mt-4 text-[17px] font-medium text-ink">{title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Equipo médico ── */}
          <MedicalTeamSection />

          {/* ── Contacto ── */}
          <section className="bg-espresso">
            <div className="mx-auto flex max-w-[860px] flex-col items-center gap-6 px-5 py-14 text-center">
              <h2 className="text-balance text-[clamp(22px,3vw,34px)] font-light leading-tight tracking-[-0.025em] text-paper">
                ¿Tienes alguna pregunta sobre DoctorLife?
              </h2>
              <p className="max-w-[48ch] text-[16px] text-paper/70">
                Nuestro equipo responde en menos de 3 horas en días laborables.
              </p>
              <a
                href="mailto:hello@doctorlife.io"
                className="rounded-full bg-clay px-7 py-3 text-[15px] font-semibold text-paper transition-opacity hover:opacity-90"
              >
                Contactar con el equipo
              </a>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </QuizProvider>
  );
}
