import Image from "next/image";
import {
  ShieldCheck,
  Stethoscope,
  ClipboardList,
  MessageSquareText,
  Clock,
  Lock,
  BadgeCheck,
  FileCheck2,
  Check,
  Star,
  TrendingDown,
  Truck,
  CalendarCheck,
  ChevronDown,
} from "lucide-react";
import { QuizProvider } from "@/components/quiz-context";
import { QuizTrigger } from "@/components/quiz-trigger";
import { BrandLogo } from "@/components/brand-logo";
import { Navbar } from "@/components/navbar";
import { TrustBox } from "@/components/trustbox";
import { Counter } from "@/components/counter";
import { HeroVideo } from "@/components/hero-video";
import { SITE_URL, BRAND } from "@/lib/articles";

export type ClinicConfig = {
  /** Ruta canónica, p. ej. "/consulta-medica-online" */
  path: string;
  /** Prefijo para los eventos de analítica, p. ej. "ads-clinica" */
  planPrefix: string;
};

const heroPoints = [
  { icon: TrendingDown, label: "Reduce hasta un 25% de tu peso con tratamiento GLP-1" },
  { icon: Stethoscope, label: "Asesoría y llamada con un médico colegiado en España" },
  { icon: MessageSquareText, label: "Seguimiento en vivo por chat, cuando quieras" },
  { icon: FileCheck2, label: "Receta médica emitida si el médico lo prescribe" },
  { icon: Truck, label: "Recíbelo en casa, sin colas ni desplazamientos" },
];

const stats = [
  { to: 14, prefix: "−", suffix: " kg", label: "Media con seguimiento*" },
  { to: 4.8, prefix: "", suffix: "/5", label: "Valoración de pacientes" },
  { to: 3, prefix: "<", suffix: " h", label: "Respuesta de tu médico" },
];

const packIncludes = [
  "Videoconsulta con un médico colegiado en España",
  "Cita y prescripción del tratamiento GLP-1, si el médico lo prescribe",
  "Seguimiento con el endocrino durante todo el tratamiento",
  "Chat en vivo con tu médico siempre que lo necesites",
  "Inyección semanal indolora y fácil de aplicar en casa",
];

const steps = [
  {
    icon: ClipboardList,
    title: "Rellena el cuestionario médico",
    text: "Completas un cuestionario clínico sencillo sobre tu historia, hábitos y objetivos. Solo unos minutos.",
  },
  {
    icon: FileCheck2,
    title: "Un médico colegiado te valora",
    text: "Un médico colegiado revisa tu solicitud, emite un diagnóstico y, si procede, prescribe un tratamiento GLP-1 adecuado para tu caso.",
  },
  {
    icon: MessageSquareText,
    title: "Recíbelo y haz seguimiento",
    text: "Recibes tu tratamiento en casa y escribes a tu médico ante cualquier duda, efecto o ajuste que necesites.",
  },
];

/** Reseñas reales verificadas en Trustpilot (es.trustpilot.com/review/doctorlife.io) */
const reviews = [
  {
    name: "Eric Jenkins",
    initial: "E",
    stars: 5,
    title: "Todo online sin perder cercanía",
    text: "Lo que más me gustó de Dr. Life fue poder hacer todo online sin perder la sensación de estar bien atendido. He bajado 14 kg y mis analíticas han mejorado muchísimo.",
    timeAgo: "Hace 3 días",
  },
  {
    name: "Samuel Shah",
    initial: "S",
    stars: 5,
    title: "18 kg en 5 meses",
    text: "Empecé el tratamiento con bastante miedo porque había probado muchas dietas sin éxito. En 5 meses he perdido 18 kg y el seguimiento con el endocrino ha sido excelente. Me he sentido acompañado en todo momento.",
    timeAgo: "Hace 3 días",
  },
  {
    name: "Max",
    initial: "M",
    stars: 5,
    title: "Tratamiento GLP-1 10/10",
    text: "Hice tratamiento glp1 y la verdad que 10/10, contento con el resultado y el trato.",
    timeAgo: "Hace 4 días",
  },
  {
    name: "Zachary Moore",
    initial: "Z",
    stars: 4,
    title: "Por fin un tratamiento que funciona",
    text: "Después de años luchando con mi peso, por fin encontré un tratamiento que funciona y un equipo que entiende el problema de la obesidad. Muy recomendable.",
    timeAgo: "Hace 3 días",
  },
];

const faqs = [
  {
    q: "¿Es seguro?",
    a: "Sí. Cada tratamiento lo valora y prescribe un médico colegiado en España tras revisar tu historia clínica. Además, tienes seguimiento médico continuo durante todo el proceso.",
  },
  {
    q: "¿Necesito una receta previa?",
    a: "No. Si el médico considera que el tratamiento es adecuado para tu caso, él mismo emite la prescripción tras tu valoración. Todo el proceso es online.",
  },
  {
    q: "¿Cuánto peso puedo perder?",
    a: "Depende de cada persona, tu punto de partida y tu constancia. Muchos pacientes logran pérdidas significativas con seguimiento, pero los resultados varían y no están garantizados.",
  },
  {
    q: "¿Tiene permanencia?",
    a: "No hay permanencia. Puedes pausar o cancelar cuando quieras, sin penalizaciones.",
  },
  {
    q: "¿Y si no soy apto para el tratamiento?",
    a: "Si tras la valoración el médico determina que el tratamiento no es adecuado para ti, no se te cobra el tratamiento y recibirás recomendaciones para tu caso.",
  },
  {
    q: "¿Cómo recibo el tratamiento?",
    a: "Si el médico lo prescribe, lo recibes en tu domicilio de forma discreta, sin necesidad de desplazarte a una farmacia.",
  },
];

const trustBar = [
  { icon: Stethoscope, label: "Médicos colegiados (REPS)" },
  { icon: Clock, label: "Respuesta en menos de 3 h" },
  { icon: ShieldCheck, label: "Sin permanencia" },
  { icon: Lock, label: "Datos protegidos (RGPD)" },
];

const payments = [
  { src: "/payments/visa.svg", alt: "Visa" },
  { src: "/payments/mastercard.svg", alt: "Mastercard" },
  { src: "/payments/paypal.svg", alt: "PayPal" },
  { src: "/payments/apple-pay.svg", alt: "Apple Pay" },
  { src: "/payments/google-pay.svg", alt: "Google Pay" },
];

const FIRST_VISIT = "Gratis";
const MONTHLY = "139 €/mes";

const TRUSTPILOT_URL = "https://es.trustpilot.com/review/doctorlife.io";
const TRUSTPILOT_GREEN = "#00b67a";

/** Fila de estrellas con el estilo verde de Trustpilot (cuadro verde + estrella blanca). */
function TrustpilotStars({ rating, size = 24 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-[2px]" aria-label={`${rating} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className="flex items-center justify-center"
          style={{
            width: size,
            height: size,
            backgroundColor: i < rating ? TRUSTPILOT_GREEN : "#dcdce6",
          }}
        >
          <Star
            aria-hidden
            className="fill-white text-white"
            style={{ width: size * 0.66, height: size * 0.66 }}
          />
        </span>
      ))}
    </div>
  );
}

export function ClinicLanding({ config }: { config: ClinicConfig }) {
  const { path, planPrefix } = config;

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: BRAND,
    url: `${SITE_URL}${path}`,
    medicalSpecialty: "Endocrinology",
    description:
      "Servicio de telemedicina con médicos colegiados en España. Valoración médica online del control de peso basada en cuestionario, con diagnóstico y plan si procede.",
    areaServed: "ES",
    priceRange: "€€",
  };

  return (
    <QuizProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }}
      />
      <div className="overflow-x-clip bg-paper">
        {/* ── Navegación del sitio ── */}
        <Navbar />

        <main className="pb-24 lg:pb-0">
          {/* ── Hero con oferta ── */}
          <section className="mx-auto mt-2 max-w-none px-3 sm:px-4 lg:px-5">
            <div className="relative w-full overflow-hidden rounded-[36px]">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(155deg,#6b774a 0%,#5f6a3e 45%,#454d2e 100%)",
                }}
              />

              <div className="relative z-[2] grid grid-cols-1 items-center gap-8 px-5 py-8 sm:px-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-12 lg:px-14 lg:py-14">
                <div className="max-w-[620px]">
                  <span className="inline-flex items-center gap-2 rounded-full bg-paper/12 px-3 py-1.5 text-[12.5px] font-semibold uppercase tracking-[.16em] text-sage backdrop-blur-sm">
                    <BadgeCheck aria-hidden className="h-4 w-4" />
                    Tratamiento GLP-1 con seguimiento médico
                  </span>
                  <h1 className="mt-5 text-balance text-[clamp(32px,4.8vw,56px)] font-light leading-[1.04] tracking-[-.03em] text-paper">
                    Pierde hasta un{" "}
                    <span className="font-serif italic text-sage">25%</span> de tu
                    peso con tratamiento GLP-1
                  </h1>

                  {/* Prueba social rápida */}
                  <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <div className="flex items-center gap-1 text-sage">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} aria-hidden className="h-[18px] w-[18px] fill-current" />
                      ))}
                    </div>
                    <span className="text-[14px] font-medium text-paper/85">
                      <span className="font-semibold text-paper">4,8/5</span> · valoración de nuestros pacientes
                    </span>
                  </div>

                  <ul className="mt-6 flex flex-col gap-2.5">
                    {heroPoints.map(({ icon: Icon, label }) => (
                      <li
                        key={label}
                        className="flex items-start gap-3 text-[14px] leading-snug text-paper/85 sm:text-[14.5px]"
                      >
                        <Icon
                          aria-hidden
                          className="mt-0.5 h-[18px] w-[18px] flex-shrink-0 text-sage"
                        />
                        {label}
                      </li>
                    ))}
                  </ul>

                  {/* Precio */}
                  <div className="mt-7">
                    <span className="text-[13px] font-medium uppercase tracking-[.14em] text-sage">
                      Primera valoración médica
                    </span>
                    <div className="mt-1 flex flex-wrap items-end gap-x-3 gap-y-1">
                      <span className="text-[clamp(40px,6vw,58px)] font-semibold leading-none text-paper">
                        {FIRST_VISIT}
                      </span>
                      <span className="mb-1 text-[15px] font-medium text-paper/75">
                        y luego {MONTHLY} · sin permanencia
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <QuizTrigger
                      plan={planPrefix}
                      className="rounded-full bg-clay px-9 py-[16px] text-[16.5px] font-bold text-paper shadow-lg transition-transform hover:scale-[1.02]"
                    >
                      Solicitar mi valoración
                    </QuizTrigger>
                    <span className="text-[13.5px] text-paper/70">
                      Sin compromiso · en unos minutos
                    </span>
                  </div>

                  <div className="mt-7 hidden max-w-[280px] lg:block">
                    <TrustBox theme="dark" alignment="left" />
                  </div>
                </div>

                <div className="relative mx-auto aspect-[4/3] w-full max-w-[440px] overflow-hidden rounded-[24px] shadow-2xl ring-1 ring-paper/15 lg:max-w-none">
                  <HeroVideo
                    src="/products/pills-pen.mp4"
                    poster="/landing/consulta-online.png"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  {/* Badge de resultado sobre el vídeo */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-[16px] bg-espresso/85 px-4 py-3 backdrop-blur-sm">
                    <TrendingDown aria-hidden className="h-6 w-6 text-sage" />
                    <div className="leading-tight">
                      <span className="block text-[20px] font-semibold text-paper">
                        hasta −25%
                      </span>
                      <span className="text-[12px] text-paper/75">
                        de tu peso corporal*
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Banda de estadísticas ── */}
          <section className="mx-auto max-w-[1100px] px-5 pt-10">
            <ul className="grid grid-cols-1 gap-4 rounded-[24px] border border-ink/10 bg-warm px-4 py-6 sm:grid-cols-3 md:px-8">
              {stats.map((s) => (
                <li key={s.label} className="text-center">
                  <Counter
                    to={s.to}
                    prefix={s.prefix}
                    suffix={s.suffix}
                    className="block text-[clamp(28px,4vw,40px)] font-semibold leading-none text-olive"
                  />
                  <span className="mt-2 block text-[13px] font-medium leading-tight text-ink-soft">
                    {s.label}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* ── Barra de confianza ── */}
          <section className="mx-auto max-w-[1100px] px-5 pt-6">
            <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {trustBar.map(({ icon: Icon, label }) => (
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

          {/* ── Precio + ¿Qué incluye tu programa? ── */}
          <section
            aria-labelledby="programa"
            className="mx-auto max-w-[1100px] px-5 pt-20"
          >
            <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-[1.1fr_.9fr]">
              {/* Qué incluye */}
              <div className="rounded-[28px] border border-ink/10 bg-warm p-8 sm:p-10">
                <span className="text-[13px] font-semibold uppercase tracking-[.16em] text-clay">
                  Tu programa
                </span>
                <h2
                  id="programa"
                  className="mt-3 text-balance text-[clamp(24px,3.2vw,36px)] font-light leading-[1.1] text-ink"
                >
                  ¿Qué incluye tu programa?
                </h2>
                <ul className="mt-7 flex flex-col gap-4">
                  {packIncludes.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-sage/60">
                        <Check aria-hidden className="h-4 w-4 text-olive" />
                      </span>
                      <span className="text-[15.5px] leading-relaxed text-ink-soft">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tarjeta de precio */}
              <div className="flex flex-col justify-center rounded-[28px] bg-espresso p-8 text-center text-paper sm:p-10">
                <span className="text-[13px] font-semibold uppercase tracking-[.16em] text-sage">
                  Primera valoración médica
                </span>
                <div className="mt-4 flex items-end justify-center gap-2">
                  <span className="text-[clamp(48px,8vw,68px)] font-semibold leading-none text-paper">
                    {FIRST_VISIT}
                  </span>
                </div>
                <p className="mt-3 text-[14px] text-paper/70">
                  Después{" "}
                  <span className="font-semibold text-paper">{MONTHLY}</span> de
                  seguimiento médico · sin permanencia
                </p>

                <QuizTrigger
                  plan={`${planPrefix}-precio`}
                  className="mt-7 w-full rounded-full bg-clay px-8 py-[16px] text-[16.5px] font-bold text-paper shadow-lg transition-transform hover:scale-[1.02]"
                >
                  Solicitar mi valoración
                </QuizTrigger>

                <ul className="mt-6 flex flex-col gap-2.5 text-left">
                  {[
                    "Sin compromiso ni permanencia",
                    "Si no eres apto, no pagas el tratamiento",
                    "Médicos colegiados en España",
                  ].map((t) => (
                    <li key={t} className="flex items-center gap-2.5 text-[13.5px] text-paper/85">
                      <Check aria-hidden className="h-4 w-4 flex-shrink-0 text-sage" />
                      {t}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex items-center justify-center gap-1.5 text-sage">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} aria-hidden className="h-4 w-4 fill-current" />
                  ))}
                  <span className="ml-1.5 text-[13px] text-paper/70">
                    Valorado por miles de pacientes
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ── ¿Cómo funciona? ── */}
          <section
            aria-labelledby="como-funciona"
            className="mx-auto max-w-[1100px] px-5 pt-20"
          >
            <div className="overflow-hidden rounded-[32px] bg-espresso px-6 py-12 text-paper sm:px-12">
              <span className="text-[13px] font-semibold uppercase tracking-[.16em] text-sage">
                ¿Cómo funciona?
              </span>
              <h2
                id="como-funciona"
                className="mt-3 max-w-[22ch] text-balance text-[clamp(24px,3.2vw,38px)] font-light leading-[1.12]"
              >
                Empieza hoy en tres sencillos pasos
              </h2>
              <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
                {steps.map(({ icon: Icon, title, text }, i) => (
                  <div
                    key={title}
                    className="rounded-[24px] bg-paper/[.06] p-7 ring-1 ring-paper/10"
                  >
                    <span className="text-[13px] font-semibold text-sage">
                      0{i + 1}
                    </span>
                    <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-full bg-paper/10">
                      <Icon aria-hidden className="h-6 w-6 text-sage" />
                    </div>
                    <h3 className="mt-5 text-[19px] font-medium text-paper">
                      {title}
                    </h3>
                    <p className="mt-2.5 text-[14.5px] leading-relaxed text-paper/75">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <QuizTrigger
                  plan={`${planPrefix}-como`}
                  className="inline-block rounded-full bg-clay px-8 py-[15px] text-[16px] font-bold text-paper transition-transform hover:scale-[1.02]"
                >
                  Solicitar mi valoración
                </QuizTrigger>
              </div>
            </div>
          </section>

          {/* ── Opiniones reales de Trustpilot ── */}
          <section
            aria-labelledby="testimonios"
            className="mx-auto max-w-[1100px] px-5 pt-20"
          >
            <div className="flex flex-col items-center text-center">
              <h2
                id="testimonios"
                className="max-w-[24ch] text-balance text-[clamp(26px,3.4vw,40px)] font-light leading-[1.1] text-ink"
              >
                Lo que dicen nuestros pacientes
              </h2>

              {/* Cabecera con TrustScore, estilo Trustpilot */}
              <div className="mt-6 flex flex-col items-center gap-3">
                <div className="flex items-center gap-2">
                  <Star
                    aria-hidden
                    className="h-6 w-6 fill-current"
                    style={{ color: TRUSTPILOT_GREEN }}
                  />
                  <span className="text-[20px] font-semibold text-ink">Trustpilot</span>
                </div>
                <TrustpilotStars rating={4} size={30} />
                <p className="text-[14px] text-ink-soft">
                  <span className="font-semibold text-ink">Excelente</span>{" "}
                  · TrustScore <span className="font-semibold text-ink">4,1</span>{" "}
                  · Basado en{" "}
                  <a
                    href={TRUSTPILOT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-ink underline underline-offset-2"
                  >
                    opiniones reales
                  </a>
                </p>
              </div>
            </div>

            {/* Tarjetas de reseñas con estilo Trustpilot */}
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {reviews.map((r) => (
                <figure
                  key={r.name}
                  className="flex flex-col rounded-[16px] border border-ink/10 bg-paper p-6"
                >
                  <TrustpilotStars rating={r.stars} size={22} />
                  <figcaption className="mt-4 flex items-center gap-3">
                    <span
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-[15px] font-semibold text-paper"
                      style={{ backgroundColor: TRUSTPILOT_GREEN }}
                      aria-hidden
                    >
                      {r.initial}
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-1.5">
                        <span className="truncate text-[14.5px] font-semibold text-ink">
                          {r.name}
                        </span>
                        <BadgeCheck
                          aria-label="Verificada"
                          className="h-4 w-4 flex-shrink-0"
                          style={{ color: TRUSTPILOT_GREEN }}
                        />
                      </span>
                      <span className="block text-[12px] text-ink-mute">
                        {r.timeAgo}
                      </span>
                    </span>
                  </figcaption>
                  <h3 className="mt-4 text-[15px] font-semibold leading-snug text-ink">
                    {r.title}
                  </h3>
                  <blockquote className="mt-2 flex-1 text-[14px] leading-relaxed text-ink-soft">
                    {r.text}
                  </blockquote>
                </figure>
              ))}
            </div>

            <div className="mt-8 text-center">
              <a
                href={TRUSTPILOT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-warm px-6 py-3 text-[14.5px] font-semibold text-ink transition-colors hover:bg-ink/[.04]"
              >
                <Star
                  aria-hidden
                  className="h-4 w-4 fill-current"
                  style={{ color: TRUSTPILOT_GREEN }}
                />
                Ver todas las opiniones en Trustpilot
              </a>
            </div>

            <p className="mx-auto mt-6 max-w-[60ch] text-center text-[11.5px] leading-relaxed text-ink-mute">
              Opiniones verificadas publicadas en Trustpilot. Reflejan
              experiencias individuales; los resultados varían según cada persona.
              Consulta siempre con tu médico.
            </p>
          </section>

          {/* ── Preguntas frecuentes ── */}
          <section
            aria-labelledby="faq"
            className="mx-auto max-w-[820px] px-5 pt-20"
          >
            <div className="text-center">
              <span className="text-[13px] font-semibold uppercase tracking-[.16em] text-clay">
                Preguntas frecuentes
              </span>
              <h2
                id="faq"
                className="mx-auto mt-3 max-w-[24ch] text-balance text-[clamp(26px,3.4vw,40px)] font-light leading-[1.1] text-ink"
              >
                Resolvemos tus dudas antes de empezar
              </h2>
            </div>
            <div className="mt-8 flex flex-col gap-3">
              {faqs.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-[18px] border border-ink/10 bg-warm px-5 py-4 [&_svg]:open:rotate-180"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[16px] font-medium text-ink marker:hidden">
                    {f.q}
                    <ChevronDown
                      aria-hidden
                      className="h-5 w-5 flex-shrink-0 text-olive transition-transform"
                    />
                  </summary>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </section>

          {/* ── Opiniones + pago seguro ── */}
          <section className="mx-auto max-w-[1100px] px-5 pt-20">
            <div className="grid grid-cols-1 items-center gap-6 rounded-[32px] border border-ink/10 bg-warm p-8 sm:p-10 md:grid-cols-2">
              <div>
                <span className="text-[13px] font-semibold uppercase tracking-[.16em] text-clay">
                  Opiniones
                </span>
                <h2 className="mt-3 text-balance text-[clamp(22px,2.8vw,32px)] font-light leading-[1.12] text-ink">
                  Miles de pacientes ya confían en nuestros médicos
                </h2>
                <div className="mt-5 max-w-[300px]">
                  <TrustBox alignment="left" />
                </div>
              </div>
              <div className="rounded-[24px] bg-paper p-7 ring-1 ring-ink/10">
                <div className="flex items-center gap-2 text-olive">
                  <Lock aria-hidden className="h-5 w-5" />
                  <span className="text-[15px] font-semibold text-ink">
                    Pago seguro
                  </span>
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-4">
                  {payments.map(({ src, alt }) => (
                    <span key={alt} className="relative block h-7 w-12">
                      <Image
                        src={src}
                        alt={alt}
                        fill
                        sizes="48px"
                        className="object-contain"
                      />
                    </span>
                  ))}
                </div>
                <p className="mt-6 text-[13.5px] leading-relaxed text-ink-mute">
                  Tus pagos y tus datos de salud se tratan de forma cifrada y
                  conforme al RGPD y la LOPDGDD.
                </p>
              </div>
            </div>
          </section>

          {/* ── CTA final ── */}
          <section
            aria-labelledby="cta-final"
            className="mx-auto max-w-[1100px] px-5 py-16"
          >
            <div className="overflow-hidden rounded-[32px] bg-espresso px-6 py-14 text-center text-paper sm:px-12">
              <div className="mx-auto mb-5 flex items-center justify-center gap-2 text-sage">
                <CalendarCheck aria-hidden className="h-5 w-5" />
                <span className="text-[13px] font-semibold uppercase tracking-[.16em]">
                  Plazas limitadas esta semana
                </span>
              </div>
              <h2
                id="cta-final"
                className="mx-auto max-w-[20ch] text-balance text-[clamp(26px,3.4vw,40px)] font-light leading-[1.1]"
              >
                Empieza hoy tu tratamiento GLP-1 supervisado
              </h2>
              <div className="mt-5 flex flex-wrap items-end justify-center gap-x-3 gap-y-1">
                <span className="text-[clamp(36px,6vw,52px)] font-semibold leading-none text-paper">
                  {FIRST_VISIT}
                </span>
                <span className="mb-1 text-[15px] font-medium text-paper/75">
                  y luego {MONTHLY} · sin permanencia
                </span>
              </div>
              <QuizTrigger
                plan={`${planPrefix}-final`}
                className="mt-7 inline-block rounded-full bg-clay px-9 py-[16px] text-[16.5px] font-bold text-paper transition-transform hover:scale-[1.02]"
              >
                Solicitar mi valoración
              </QuizTrigger>
              <p className="mx-auto mt-4 max-w-[52ch] text-[14px] leading-relaxed text-paper/70">
                Reserva tu plaza hoy · Sin permanencia · Médicos colegiados en
                España
              </p>
            </div>

            <p className="mx-auto mt-8 max-w-[70ch] text-center text-[12.5px] leading-relaxed text-ink-mute">
              *Dato orientativo basado en la evolución de pacientes con
              seguimiento; los resultados varían en cada persona. Servicio de
              telemedicina prestado por médicos colegiados en España. La
              indicación de cualquier tratamiento depende siempre de una
              valoración médica individual. Este servicio no garantiza resultados
              concretos y no sustituye la atención presencial cuando sea necesaria.
              Tratamos tus datos conforme al RGPD y la LOPDGDD.
            </p>
          </section>
        </main>

        {/* ── Barra CTA fija en móvil ── */}
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-warm/95 px-4 py-3 backdrop-blur-sm lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="leading-tight">
              <span className="block text-[18px] font-semibold text-ink">
                {FIRST_VISIT}
              </span>
              <span className="text-[11.5px] text-ink-mute">
                y luego {MONTHLY} · sin permanencia
              </span>
            </div>
            <QuizTrigger
              plan={`${planPrefix}-sticky`}
              className="rounded-full bg-clay px-6 py-[13px] text-[15px] font-bold text-paper shadow-md"
            >
              Empezar ahora
            </QuizTrigger>
          </div>
        </div>

        {/* ── Footer legal mínimo ── */}
        <footer className="border-t border-ink/10 bg-warm">
          <div className="mx-auto flex max-w-[1100px] flex-col items-center gap-4 px-5 py-10 text-center">
            <BrandLogo markSize={24} textSize={19} />
            <p className="max-w-[52ch] text-[13.5px] leading-relaxed text-ink-mute">
              Plataforma de telemedicina que conecta a pacientes con médicos
              colegiados en España para una atención rápida, segura y cercana.
            </p>
            <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-ink-soft">
              <a href="/aviso-legal" className="hover:text-ink">
                Aviso legal
              </a>
              <a href="/privacidad" className="hover:text-ink">
                Política de privacidad
              </a>
              <a href="/contacto" className="hover:text-ink">
                Contacto
              </a>
            </nav>
            <span className="text-[12.5px] text-ink-mute">
              © {new Date().getFullYear()} {BRAND}. Todos los derechos reservados.
            </span>
          </div>
        </footer>
      </div>
    </QuizProvider>
  );
}
