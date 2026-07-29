import type { Metadata } from "next";
import Image from "next/image";
import {
  ShieldCheck,
  Video,
  Stethoscope,
  CalendarCheck,
  ClipboardList,
  HeartPulse,
  Lock,
  BadgeCheck,
} from "lucide-react";
import { QuizProvider } from "@/components/quiz-context";
import { QuizTrigger } from "@/components/quiz-trigger";
import { Navbar } from "@/components/navbar";
import { BrandLogo } from "@/components/brand-logo";
import { TrustBox } from "@/components/trustbox";
import { BeforeAfterCarousel } from "@/components/before-after-carousel";
import { SITE_URL, BRAND } from "@/lib/articles";

const PATH = "/consulta-control-de-peso";

export const metadata: Metadata = {
  title: "Consulta médica online para el control de peso | DoctorLife",
  description:
    "Valoración con médicos colegiados para el control de peso, 100% online. Plan personalizado y seguimiento continuo. Primera visita gratis, sin permanencia.",
  alternates: { canonical: `${SITE_URL}${PATH}` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE_URL}${PATH}`,
    title: "Consulta médica online para el control de peso | DoctorLife",
    description:
      "Valoración con médicos colegiados, 100% online. Plan personalizado y seguimiento. Primera visita gratis, sin permanencia.",
  },
};

const serviceLd = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: BRAND,
  url: `${SITE_URL}${PATH}`,
  medicalSpecialty: "Endocrinology",
  description:
    "Servicio de telemedicina para el control de peso con médicos colegiados en España. Valoración clínica, plan personalizado y seguimiento continuo.",
  areaServed: "ES",
  priceRange: "€€",
};

const steps = [
  {
    icon: ClipboardList,
    title: "Cuéntanos tu caso",
    text: "Completas un cuestionario clínico sencillo sobre tu historia, hábitos y objetivos. Solo unos minutos.",
  },
  {
    icon: Video,
    title: "Videoconsulta con tu médico",
    text: "Un médico colegiado valora tu situación por videollamada y resuelve tus dudas con calma.",
  },
  {
    icon: HeartPulse,
    title: "Plan y seguimiento",
    text: "Recibes un plan personalizado y acompañamiento continuo por chat. Si tu médico lo considera clínicamente indicado, puede prescribir tratamiento y ajustarlo a tu evolución.",
  },
];

const benefits = [
  {
    icon: Stethoscope,
    title: "Endocrinos y médicos colegiados",
    text: "Especialistas en endocrinología y nutrición, colegiados e inscritos en el Registro Estatal de Profesionales Sanitarios (REPS).",
  },
  {
    icon: Video,
    title: "100% online, desde casa",
    text: "Sin desplazamientos ni salas de espera. Tú eliges el horario que mejor te venga.",
  },
  {
    icon: CalendarCheck,
    title: "Seguimiento continuo",
    text: "No es una consulta suelta: te acompañamos mes a mes y ajustamos el plan a tu ritmo.",
  },
  {
    icon: ShieldCheck,
    title: "Sin permanencia",
    text: "Una única suscripción transparente. Puedes pausar o cancelar cuando quieras.",
  },
];

const faqs = [
  {
    q: "¿Qué incluye la primera visita?",
    a: "Una valoración clínica completa con un médico colegiado por videollamada, en la que se revisa tu historia y tus objetivos y se define el punto de partida. La primera visita es gratis, sin compromiso.",
  },
  {
    q: "¿Los médicos están colegiados?",
    a: "Sí. Todos nuestros profesionales son médicos colegiados en España e inscritos en el Registro Estatal de Profesionales Sanitarios (REPS), incluidos especialistas en endocrinología y nutrición. Verificamos su titulación y colegiación antes de incorporarlos.",
  },
  {
    q: "¿El médico puede recetar tratamiento?",
    a: "Sí. Cuando la valoración clínica lo justifica, el médico o endocrino puede prescribir el tratamiento que considere adecuado para tu caso y hacer su seguimiento. La indicación depende siempre de una valoración médica individual; no todos los casos requieren medicación.",
  },
  {
    q: "¿Cuánto cuesta?",
    a: "La primera valoración es gratis. Si decides continuar, eliges tu plan: suscripción de 139 €/mes sin permanencia, pack de 5 meses por 449 € o nutricionista + GLP1 por 649 €. Incluye seguimiento por chat con tu médico y ajuste del plan.",
  },
  {
    q: "¿Necesito acudir presencialmente?",
    a: "No es necesario: el servicio es 100% online. Si en algún momento tu médico considera que necesitas una valoración o prueba presencial, te lo indicará y te orientará sobre cómo hacerlo.",
  },
  {
    q: "¿Mis datos están protegidos?",
    a: "Sí. Tratamos tus datos de salud conforme al RGPD y la LOPDGDD, con medidas de seguridad reforzadas y confidencialidad médica.",
  },
];

export default function LandingControlDePeso() {
  return (
    <QuizProvider>
      <div className="overflow-x-clip bg-paper">
        <Navbar />

        <main>
          {/* ── Hero ── */}
          <section className="mx-auto mt-5 max-w-none px-3 sm:px-4 lg:px-5">
            <div className="relative w-full overflow-hidden rounded-[36px]">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(155deg,#6b774a 0%,#5f6a3e 45%,#454d2e 100%)",
                }}
              />

              <div className="relative z-[2] grid grid-cols-1 items-center gap-10 px-5 py-12 sm:px-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-12 lg:px-14 lg:py-16">
                <div className="max-w-[620px]">
                  <span className="inline-flex items-center gap-2 rounded-full bg-paper/12 px-3 py-1.5 text-[12.5px] font-semibold uppercase tracking-[.16em] text-sage backdrop-blur-sm">
                    <BadgeCheck aria-hidden className="h-4 w-4" />
                    Endocrinos colegiados · 100% online
                  </span>
                  <h1 className="mt-5 text-balance text-[clamp(30px,5vw,60px)] font-light leading-[1.04] tracking-[-.03em] text-paper">
                    Tratamiento{" "}
                    <span className="font-serif italic text-sage">GLP-1</span> con{" "}
                    <span className="font-serif italic text-sage">
                      supervisión médica
                    </span>
                    , desde casa
                  </h1>
                  <p className="mt-4 text-[15px] font-medium text-paper/75">
                    Tratamiento con GLP-1, si el endocrino lo cree adecuado para
                    tu caso.
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <QuizTrigger
                      plan="ads-control-peso"
                      className="rounded-full bg-sage px-8 py-[15px] text-[16px] font-semibold text-ink shadow-lg"
                    >
                      Reservar primera visita gratis
                    </QuizTrigger>
                    <span className="text-[13.5px] text-paper/70">
                      Gratis · sin compromiso
                    </span>
                  </div>

                  <div className="mt-7 max-w-[280px]">
                    <TrustBox theme="dark" alignment="left" />
                  </div>
                </div>

                {/* Carrusel de casos before/after */}
                <div className="mx-auto w-full max-w-[440px] lg:max-w-none">
                  <BeforeAfterCarousel />
                </div>
              </div>
            </div>
          </section>

          {/* ── Barra de confianza ── */}
          <section className="mx-auto max-w-[1100px] px-5 pt-10">
            <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { icon: Stethoscope, label: "Endocrinos colegiados (REPS)" },
                { icon: ClipboardList, label: "Prescripción si está indicada" },
                { icon: ShieldCheck, label: "Sin permanencia" },
                { icon: Lock, label: "Datos protegidos (RGPD)" },
              ].map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-3 rounded-[16px] border border-ink/10 bg-warm px-4 py-3.5"
                >
                  <Icon aria-hidden className="h-5 w-5 flex-shrink-0 text-olive" />
                  <span className="text-[13.5px] font-medium leading-tight text-ink">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* ── Cómo funciona ── */}
          <section
            aria-labelledby="como-funciona"
            className="mx-auto max-w-[1100px] px-5 pt-16"
          >
            <span className="text-[13px] font-semibold uppercase tracking-[.16em] text-clay">
              Cómo funciona
            </span>
            <h2
              id="como-funciona"
              className="mt-3 max-w-[20ch] text-balance text-[clamp(26px,3.4vw,40px)] font-light leading-[1.1] text-ink"
            >
              Tres pasos para empezar con seguridad
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {steps.map(({ icon: Icon, title, text }, i) => (
                <div
                  key={title}
                  className="relative rounded-[24px] border border-ink/10 bg-warm p-7"
                >
                  <span className="text-[13px] font-semibold text-clay">
                    0{i + 1}
                  </span>
                  <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-full bg-sage/50">
                    <Icon aria-hidden className="h-6 w-6 text-olive" />
                  </div>
                  <h3 className="mt-5 text-[20px] font-medium text-ink">{title}</h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Por qué con supervisión médica ── */}
          <section
            aria-labelledby="beneficios"
            className="mx-auto max-w-[1100px] px-5 pt-16"
          >
            <div className="overflow-hidden rounded-[32px] bg-espresso px-6 py-12 text-paper sm:px-12">
              <span className="text-[13px] font-semibold uppercase tracking-[.16em] text-sage">
                Por qué con un médico
              </span>
              <h2
                id="beneficios"
                className="mt-3 max-w-[24ch] text-balance text-[clamp(24px,3.2vw,38px)] font-light leading-[1.12]"
              >
                El peso tiene causas fisiológicas. Tratarlas requiere criterio médico.
              </h2>
              <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
                {benefits.map(({ icon: Icon, title, text }) => (
                  <div key={title} className="flex gap-4">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-paper/10">
                      <Icon aria-hidden className="h-5 w-5 text-sage" />
                    </div>
                    <div>
                      <h3 className="text-[17px] font-medium text-paper">{title}</h3>
                      <p className="mt-1.5 text-[14.5px] leading-relaxed text-paper/75">
                        {text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Precio transparente ── */}
          <section
            aria-labelledby="precio"
            className="mx-auto max-w-[1100px] px-5 pt-16"
          >
            <div className="grid grid-cols-1 items-center gap-8 rounded-[32px] border border-ink/10 bg-warm p-8 sm:p-12 md:grid-cols-[1.1fr_1fr]">
              <div>
                <span className="text-[13px] font-semibold uppercase tracking-[.16em] text-clay">
                  Precio transparente
                </span>
                <h2
                  id="precio"
                  className="mt-3 text-balance text-[clamp(24px,3.2vw,38px)] font-light leading-[1.1] text-ink"
                >
                  Empieza gratis y decide con calma
                </h2>
                <p className="mt-4 max-w-[46ch] text-[15.5px] leading-relaxed text-ink-soft">
                  La primera valoración es gratis. Si decides continuar, eliges tu plan desde 139 €/mes (o pack de 5 meses por 449 €) que cubre el seguimiento
                  con tu médico y el ajuste de tu plan. Sin permanencia y sin
                  sorpresas.
                </p>
                <ul className="mt-6 flex flex-col gap-2.5 text-[15px] text-ink">
                  {[
                    "Valoración con médico colegiado",
                    "Plan personalizado a tu caso",
                    "Chat de seguimiento con tu médico",
                    "Cancela cuando quieras",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5">
                      <BadgeCheck
                        aria-hidden
                        className="h-[18px] w-[18px] flex-shrink-0 text-olive"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[24px] bg-espresso p-8 text-paper">
                <p className="text-[14px] text-paper/70">Primera visita</p>
                <p className="mt-1 flex items-end gap-2">
                  <span className="text-[48px] font-light leading-none">Gratis</span>
                  <span className="mb-1 text-[14px] text-paper/70">sin compromiso</span>
                </p>
                <div className="my-6 h-px bg-paper/15" />
                <p className="text-[14px] text-paper/70">Si continúas · oferta de lanzamiento</p>
                <p className="mt-1 flex items-end gap-2">
                  <span className="text-[32px] font-light leading-none">Gratis</span>
                  <span className="mb-1 text-[14px] text-paper/70">primera valoración, luego desde 139 €/mes</span>
                </p>
                <QuizTrigger
                  plan="ads-control-peso-precio"
                  className="mt-7 block w-full rounded-full bg-sage px-7 py-[15px] text-center text-[16px] font-semibold text-ink"
                >
                  Reservar primera visita
                </QuizTrigger>
                <p className="mt-3 text-center text-[12.5px] text-paper/60">
                  Sin permanencia · cancela cuando quieras
                </p>
              </div>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section
            aria-labelledby="faq"
            className="mx-auto max-w-[860px] px-5 pt-16"
          >
            <h2
              id="faq"
              className="text-balance text-[clamp(24px,3.2vw,36px)] font-light leading-[1.1] text-ink"
            >
              Preguntas frecuentes
            </h2>
            <div className="mt-8 divide-y divide-ink/10 overflow-hidden rounded-[24px] border border-ink/10 bg-warm">
              {faqs.map(({ q, a }) => (
                <details key={q} className="group px-6 py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[16.5px] font-medium text-ink">
                    {q}
                    <span
                      aria-hidden
                      className="text-[22px] font-light text-clay transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                    {a}
                  </p>
                </details>
              ))}
            </div>
          </section>

          {/* ── CTA final ── */}
          <section
            aria-labelledby="cta-final"
            className="mx-auto max-w-[1100px] px-5 py-16"
          >
            <div className="overflow-hidden rounded-[32px] bg-espresso text-paper">
              <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr]">
                <div className="p-8 sm:p-12">
                  <h2
                    id="cta-final"
                    className="text-balance text-[clamp(24px,3.2vw,36px)] font-light leading-[1.1]"
                  >
                    Da el primer paso hoy, con un médico de tu lado
                  </h2>
                  <p className="mt-4 max-w-[46ch] text-[15.5px] leading-relaxed text-paper/75">
                    Reserva tu primera visita gratis. Sin desplazamientos, sin
                    permanencia y con el rigor de médicos colegiados.
                  </p>
                  <QuizTrigger
                    plan="ads-control-peso-final"
                    className="mt-8 inline-block rounded-full bg-sage px-8 py-[15px] text-[16px] font-semibold text-ink"
                  >
                    Reservar primera visita gratis
                  </QuizTrigger>
                  <p className="mt-5 text-[14px] text-paper/70">
                    ¿Quieres conocernos mejor?{" "}
                    <a
                      href="/#product"
                      className="font-medium text-paper underline decoration-paper/40 underline-offset-4 transition-colors hover:decoration-paper"
                    >
                      Descubre cómo funciona DoctorLife
                    </a>
                  </p>
                </div>
                <div className="relative min-h-[260px] md:min-h-full">
                  <Image
                    src="/landing/consulta-online.png"
                    alt="Consulta médica online de control de peso"
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(90deg,#171009 0%,transparent 55%)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Aviso médico compliant (sin nombres de fármacos) */}
            <p className="mx-auto mt-8 max-w-[70ch] text-center text-[12.5px] leading-relaxed text-ink-mute">
              Servicio de telemedicina prestado por médicos colegiados en España.
              La indicación de cualquier tratamiento depende siempre de una
              valoración médica individual. Este servicio no garantiza resultados
              concretos y no sustituye la atención presencial cuando sea necesaria.
              Tratamos tus datos conforme al RGPD y la LOPDGDD.
            </p>
          </section>
        </main>

        {/* ── Footer limpio y compliant (sin nombres de fármacos) ── */}
        <footer className="px-3 pb-6 pt-[40px] sm:px-4 lg:px-5">
          <div className="mx-auto max-w-none overflow-hidden rounded-[32px] bg-ink text-paper">
            <div className="grid grid-cols-1 gap-x-10 gap-y-8 px-8 pb-10 pt-12 md:grid-cols-[1.6fr_1fr_1fr] md:px-14">
              <div>
                <a
                  href="/"
                  aria-label="DoctorLife — inicio"
                  className="inline-flex no-underline"
                >
                  <BrandLogo
                    boxed
                    markSize={28}
                    textSize={23}
                    textClassName="text-paper"
                  />
                </a>
                <p className="mt-5 max-w-[320px] text-[15px] leading-relaxed text-paper/65">
                  Plataforma de telemedicina que conecta a pacientes con médicos
                  colegiados independientes para el control de peso con supervisión
                  médica.
                </p>
                <QuizTrigger
                  plan="ads-control-peso-footer"
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-sage px-6 py-[12px] text-[15px] font-semibold text-ink"
                >
                  Reservar primera visita gratis
                  <span className="text-[13px]">↗</span>
                </QuizTrigger>
                <TrustBox theme="dark" alignment="left" className="mt-6 max-w-[260px]" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-[.14em] text-sage">
                  Servicio
                </span>
                <ul className="mt-4 flex flex-col gap-3 text-[15px] text-paper/75">
                  <li>
                    <a href="#como-funciona" className="no-underline hover:text-paper">
                      Cómo funciona
                    </a>
                  </li>
                  <li>
                    <a href="#precio" className="no-underline hover:text-paper">
                      Precio
                    </a>
                  </li>
                  <li>
                    <a href="#faq" className="no-underline hover:text-paper">
                      Preguntas frecuentes
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <span className="text-xs uppercase tracking-[.14em] text-sage">
                  Legal
                </span>
                <ul className="mt-4 flex flex-col gap-3 text-[15px] text-paper/75">
                  <li>
                    <a
                      href="/legal/privacy-policy"
                      className="no-underline hover:text-paper"
                    >
                      Política de privacidad
                    </a>
                  </li>
                  <li>
                    <a
                      href="/legal/terms-of-services"
                      className="no-underline hover:text-paper"
                    >
                      Términos y condiciones
                    </a>
                  </li>
                  <li>
                    <a href="/cookies" className="no-underline hover:text-paper">
                      Política de cookies
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-1 border-t border-paper/10 px-8 py-7 text-[12.5px] text-paper/45 md:flex-row md:items-center md:justify-between md:px-14">
              <span>© 2026 DoctorLife · doctorlife.io</span>
              <span>Servicio sujeto a valoración médica individual.</span>
            </div>
          </div>
        </footer>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }}
      />
    </QuizProvider>
  );
}
