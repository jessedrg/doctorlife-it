import {
  ShieldCheck,
  Stethoscope,
  ClipboardList,
  MessageSquareText,
  Lock,
  BadgeCheck,
  FileCheck2,
  Check,
  Star,
  CalendarCheck,
  Video,
  HeartPulse,
  ChevronDown,
  Pill,
} from "lucide-react";
import { QuizProvider } from "@/components/quiz-context";
import { QuizTrigger } from "@/components/quiz-trigger";
import { BrandLogo } from "@/components/brand-logo";
import { TrustBox } from "@/components/trustbox";
import { BRAND } from "@/lib/articles";
import { StickyValoracionCTA } from "@/components/sticky-valoracion-cta";

export type ValoracionConfig = {
  /** Ruta canónica, p. ej. "/valoracion-medica" */
  path: string;
  /** Prefijo para los eventos de analítica, p. ej. "ads-valoracion" */
  planPrefix: string;
  /** Oculta el widget TrustBox y la sección de opiniones de Trustpilot */
  hideReviews?: boolean;
  /** Muestra un distintivo de tratamiento médico GLP-1 en el hero */
  showGlpBadge?: boolean;
  /** Texto del distintivo GLP-1 del hero (por defecto "Tratamiento médico GLP-1, si el médico lo considera adecuado") */
  glpBadgeText?: string;
  /** Oculta todos los botones de formulario/valoración (hero, precio, CTA final y sticky) */
  hideCta?: boolean;
};

const heroPoints = [
  { icon: Stethoscope, label: "Valoración con un médico colegiado en España" },
  { icon: Video, label: "Videoconsulta sin cita previa ni desplazamientos" },
  { icon: MessageSquareText, label: "Seguimiento con el equipo médico por chat" },
  { icon: Lock, label: "Tus datos de salud siempre protegidos" },
];

const steps = [
  {
    icon: ClipboardList,
    title: "Completa el cuestionario de salud",
    text: "Nos cuentas tu historia clínica y tus objetivos en unos minutos, desde el móvil o el ordenador.",
  },
  {
    icon: Video,
    title: "Videoconsulta con tu médico",
    text: "Un médico colegiado en España revisa tu caso y valora la opción más adecuada para ti.",
  },
  {
    icon: HeartPulse,
    title: "Seguimiento continuo",
    text: "Acompañamos tu evolución y ajustamos el plan cuando haga falta, con tu médico siempre disponible por chat.",
  },
];

const planIncludes = [
  "Videoconsulta con un médico colegiado en España",
  "Valoración clínica personalizada de tu caso",
  "Plan adaptado a tu historia clínica y tus objetivos",
  "Seguimiento con el equipo médico durante todo el proceso",
  "Chat con tu médico siempre que lo necesites",
  "Recomendaciones personalizadas según tu valoración clínica",
];

const TRUSTPILOT_URL = "https://es.trustpilot.com/review/doctorlife.io";
const TRUSTPILOT_GREEN = "#00b67a";

/** Reseñas reales verificadas en Trustpilot, centradas en la atención y el servicio. */
const reviews = [
  {
    name: "Eric Jenkins",
    initial: "E",
    stars: 5,
    title: "Todo online sin perder cercanía",
    text: "Lo que más me gustó fue poder hacerlo todo online sin perder la sensación de estar bien atendido. El equipo médico responde rápido y con cercanía.",
    timeAgo: "Hace 3 días",
  },
  {
    name: "Samuel Shah",
    initial: "S",
    stars: 5,
    title: "Seguimiento excelente",
    text: "Empecé con bastante miedo porque había probado muchas cosas sin éxito. El seguimiento con el equipo médico ha sido excelente y me he sentido acompañado en todo momento.",
    timeAgo: "Hace 3 días",
  },
  {
    name: "Max",
    initial: "M",
    stars: 5,
    title: "Trato inmejorable",
    text: "La verdad que 10/10, muy contento con la atención y el trato del equipo médico.",
    timeAgo: "Hace 4 días",
  },
  {
    name: "Zachary Moore",
    initial: "Z",
    stars: 4,
    title: "Un equipo que entiende el problema",
    text: "Por fin encontré un equipo que entiende de verdad el problema y que se implica en el proceso. Muy recomendable.",
    timeAgo: "Hace 3 días",
  },
];

const faqs = [
  {
    q: "¿Quién realiza la valoración?",
    a: "Siempre un médico colegiado en España. Revisa tu cuestionario de salud y tu caso en una videoconsulta antes de recomendarte cualquier plan.",
  },
  {
    q: "¿Necesito cita previa o desplazarme?",
    a: "No. Todo el proceso es online: completas el cuestionario cuando quieras y la videoconsulta se realiza desde casa, sin colas ni salas de espera.",
  },
  {
    q: "¿Cuánto cuesta?",
    a: "La primera valoración es gratuita. Si decides continuar, eliges tu plan: suscripción de 139 €/mes sin permanencia, pack de 5 meses por 449 € o nutricionista + GLP1 por 649 €. Puedes cancelar la suscripción cuando quieras.",
  },
  {
    q: "¿Qué pasa después de la valoración?",
    a: "Si el médico lo considera adecuado, te propone un plan personalizado y hace seguimiento de tu evolución. Tú decides si quieres continuar en cada momento.",
  },
  {
    q: "¿Mis datos están protegidos?",
    a: "Sí. Tratamos tu información clínica conforme al RGPD y solo el personal médico autorizado accede a ella.",
  },
];

/** Fila de estrellas con el estilo verde de Trustpilot. */
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
          <Star aria-hidden className="fill-white text-white" style={{ width: size * 0.66, height: size * 0.66 }} />
        </span>
      ))}
    </div>
  );
}

export function ValoracionMedicaLanding({ config }: { config: ValoracionConfig }) {
  const { planPrefix } = config;

  return (
    <QuizProvider variant="ads">
      <main className="min-h-screen bg-paper text-ink">
        {/* ── Cabecera mínima: solo logo (sin navbar) ── */}
        <header className="mx-auto flex max-w-[1100px] items-center justify-between px-5 py-5">
          <BrandLogo markSize={30} textSize={20} textClassName="text-ink" />
          <span className="hidden items-center gap-2 text-[13px] font-medium text-ink-soft sm:flex">
            <ShieldCheck aria-hidden className="h-4 w-4 text-olive" />
            Médicos colegiados en España
          </span>
        </header>

        {/* ── Hero (con imagen del médico en el móvil) ── */}
        <section className="relative overflow-hidden bg-espresso text-paper">
          <div className="mx-auto grid max-w-[1100px] grid-cols-1 items-center gap-10 px-5 py-16 sm:py-20 lg:grid-cols-[1.05fr_.95fr] lg:gap-12">
            {/* Columna de texto */}
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full bg-paper/10 px-4 py-1.5 text-[13px] font-medium text-paper/90 ring-1 ring-paper/15">
                <Stethoscope aria-hidden className="h-4 w-4 text-sage" />
                Valoración médica online
              </span>

              <h1 className="mt-6 text-balance text-[clamp(30px,5vw,52px)] font-light leading-[1.05] tracking-[-.03em] text-paper">
                Cuida tu peso con{" "}
                <span className="font-serif italic text-sage">apoyo médico</span>{" "}
                profesional
              </h1>

              <p className="mx-auto mt-5 max-w-[52ch] text-pretty text-[16px] leading-relaxed text-paper/80 lg:mx-0">
                Completa un breve cuestionario de salud y un médico colegiado en
                España valora tu caso en una videoconsulta. Si lo considera
                adecuado, te propone un plan personalizado con seguimiento
                continuo.
              </p>

              {config.showGlpBadge && (
                <div className="mt-5 flex justify-center lg:justify-start">
                  <span className="inline-flex items-center gap-2 rounded-full bg-sage/15 px-4 py-2 text-[13.5px] font-medium text-paper ring-1 ring-sage/30">
                    <Pill aria-hidden className="h-4 w-4 flex-shrink-0 text-sage" />
                    <span className="text-pretty">
                      {config.glpBadgeText ??
                        "Tratamiento médico GLP-1, si el médico lo considera adecuado"}
                    </span>
                  </span>
                </div>
              )}

              {/* Prueba social */}
              <div className="mt-6 flex items-center justify-center gap-2 lg:justify-start">
                <div className="flex items-center gap-1 text-sage">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} aria-hidden className="h-[18px] w-[18px] fill-current" />
                  ))}
                </div>
                <span className="text-[14px] font-medium text-paper/85">
                  <span className="font-semibold text-paper">4,1/5</span> · valoración de nuestros pacientes
                </span>
              </div>

              {!config.hideCta && (
                <div className="mt-8 flex flex-col items-center gap-3 lg:items-start">
                  <QuizTrigger
                    plan={`${planPrefix}-hero`}
                    className="w-full max-w-[360px] rounded-full bg-sage px-8 py-[16px] text-[16px] font-bold text-espresso"
                  >
                    Empezar mi valoración gratuita
                  </QuizTrigger>
                  <span className="text-[13px] text-paper/70">
                    Primera valoración gratis · sin compromiso
                  </span>
                </div>
              )}

              <ul className="mx-auto mt-10 grid max-w-[640px] grid-cols-1 gap-3 sm:grid-cols-2 lg:mx-0">
                {heroPoints.map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="flex items-center gap-3 rounded-2xl bg-paper/[.06] px-4 py-3 text-left text-[14px] leading-snug text-paper/90 ring-1 ring-paper/10"
                  >
                    <Icon aria-hidden className="h-[18px] w-[18px] flex-shrink-0 text-sage" />
                    {label}
                  </li>
                ))}
              </ul>
            </div>

            {/* Columna de imagen: médico en videollamada desde el móvil */}
            <div className="relative mx-auto w-full max-w-[420px] lg:max-w-none">
              {/* resplandor que funde la imagen en el fondo */}
              <div
                aria-hidden
                className="absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(179,196,168,.28) 0%, transparent 70%)" }}
              />
              <img
                src="/doctor-mobile.webp"
                alt="Médico colegiado de DoctorLife atendiendo una videoconsulta desde el móvil"
                className="relative mx-auto h-auto w-full max-w-[380px] object-contain lg:max-w-[440px]"
              />
            </div>
          </div>
        </section>

        {/* ── Cómo funciona ── */}
        <section aria-labelledby="como-funciona" className="mx-auto max-w-[1100px] px-5 pt-20">
          <div className="text-center">
            <span className="text-[13px] font-semibold uppercase tracking-[.16em] text-clay">
              Cómo funciona
            </span>
            <h2
              id="como-funciona"
              className="mx-auto mt-3 max-w-[24ch] text-balance text-[clamp(26px,3.4vw,40px)] font-light leading-[1.1] text-ink"
            >
              Tres pasos sencillos, siempre con un médico
            </h2>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <div key={title} className="rounded-[24px] border border-ink/10 bg-warm p-7">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sage/60 text-[15px] font-bold text-olive">
                    {i + 1}
                  </span>
                  <Icon aria-hidden className="h-6 w-6 text-olive" />
                </div>
                <h3 className="mt-5 text-[19px] font-medium text-ink">{title}</h3>
                <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-soft">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Precio + qué incluye ── */}
        <section aria-labelledby="precio" className="mx-auto max-w-[1100px] px-5 pt-20">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.1fr_.9fr] lg:gap-12">
            <div>
              <span className="text-[13px] font-semibold uppercase tracking-[.16em] text-clay">
                Qué incluye tu programa
              </span>
              <h2
                id="precio"
                className="mt-3 text-balance text-[clamp(26px,3.4vw,40px)] font-light leading-[1.1] text-ink"
              >
                Todo lo que necesitas, en un solo lugar
              </h2>
              <ul className="mt-7 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                {planIncludes.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] leading-snug text-ink-soft">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-olive">
                      <Check aria-hidden className="h-3.5 w-3.5 text-paper" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tarjeta de precio */}
            <div className="rounded-[28px] border border-ink/10 bg-warm p-7 sm:p-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-sage/50 px-3 py-1 text-[12.5px] font-semibold text-olive">
                <BadgeCheck aria-hidden className="h-4 w-4" />
                Primera valoración gratis
              </span>
              <div className="mt-5 flex items-end gap-2">
                <span className="text-[44px] font-light leading-none tracking-[-.03em] text-ink">0 €</span>
                <span className="pb-1 text-[15px] text-ink-mute">primera valoración</span>
              </div>
              <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">
                Si decides continuar con el seguimiento médico:
              </p>
              <ul className="mt-4 flex flex-col gap-2.5 text-[15px] text-ink">
                <li className="flex items-center justify-between border-b border-ink/10 pb-2.5">
                  <span>Suscripción mensual</span>
                  <span className="font-semibold">139 €/mes</span>
                </li>
                <li className="flex items-center justify-between border-b border-ink/10 pb-2.5">
                  <span>Pack 5 meses</span>
                  <span className="font-semibold">449 €</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Nutricionista + GLP1</span>
                  <span className="font-semibold">649 €</span>
                </li>
              </ul>
              {!config.hideCta && (
                <>
                  <QuizTrigger
                    plan={`${planPrefix}-precio`}
                    className="mt-6 block w-full rounded-full bg-ink px-8 py-[15px] text-center text-[16px] font-bold text-paper"
                  >
                    Empezar valoración gratuita
                  </QuizTrigger>
                  <p className="mt-3 flex items-center justify-center gap-2 text-center text-[12.5px] text-ink-mute">
                    <CalendarCheck aria-hidden className="h-4 w-4 text-olive" />
                    Sin permanencia · cancela cuando quieras
                  </p>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ── Confianza / TrustBox ── */}
        <section className="mx-auto max-w-[1100px] px-5 pt-20">
          <div className="rounded-[28px] border border-ink/10 bg-warm px-6 py-8 text-center">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              <span className="flex items-center gap-2 text-[14.5px] font-medium text-ink">
                <ShieldCheck aria-hidden className="h-5 w-5 text-olive" />
                Médicos colegiados en España
              </span>
              <span className="flex items-center gap-2 text-[14.5px] font-medium text-ink">
                <Lock aria-hidden className="h-5 w-5 text-olive" />
                Datos protegidos (RGPD)
              </span>
              <span className="flex items-center gap-2 text-[14.5px] font-medium text-ink">
                <FileCheck2 aria-hidden className="h-5 w-5 text-olive" />
                Seguimiento médico personalizado
              </span>
            </div>
            {!config.hideReviews && (
              <div className="mt-6 flex justify-center">
                <TrustBox />
              </div>
            )}
          </div>
        </section>

        {/* ── Opiniones reales (estilo Trustpilot) ── */}
        {!config.hideReviews && (
        <section aria-labelledby="opiniones" className="mx-auto max-w-[1100px] px-5 pt-20">
          <div className="flex flex-col items-center text-center">
            <h2
              id="opiniones"
              className="max-w-[24ch] text-balance text-[clamp(26px,3.4vw,40px)] font-light leading-[1.1] text-ink"
            >
              Lo que dicen nuestros pacientes
            </h2>
            <div className="mt-6 flex flex-col items-center gap-3">
              <div className="flex items-center gap-2">
                <Star aria-hidden className="h-6 w-6 fill-current" style={{ color: TRUSTPILOT_GREEN }} />
                <span className="text-[20px] font-semibold text-ink">Trustpilot</span>
              </div>
              <TrustpilotStars rating={4} size={30} />
              <p className="text-[14px] text-ink-soft">
                <span className="font-semibold text-ink">Excelente</span> · TrustScore{" "}
                <span className="font-semibold text-ink">4,1</span> · Basado en{" "}
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

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {reviews.map((r) => (
              <figure key={r.name} className="flex flex-col rounded-[16px] border border-ink/10 bg-paper p-6">
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
                      <span className="truncate text-[14.5px] font-semibold text-ink">{r.name}</span>
                      <BadgeCheck aria-label="Verificada" className="h-4 w-4 flex-shrink-0" style={{ color: TRUSTPILOT_GREEN }} />
                    </span>
                    <span className="block text-[12px] text-ink-mute">{r.timeAgo}</span>
                  </span>
                </figcaption>
                <h3 className="mt-4 text-[15px] font-semibold leading-snug text-ink">{r.title}</h3>
                <blockquote className="mt-2 flex-1 text-[14px] leading-relaxed text-ink-soft">{r.text}</blockquote>
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
              <Star aria-hidden className="h-4 w-4 fill-current" style={{ color: TRUSTPILOT_GREEN }} />
              Ver todas las opiniones en Trustpilot
            </a>
          </div>
        </section>
        )}

        {/* ── FAQ ── */}
        <section aria-labelledby="faq" className="mx-auto max-w-[760px] px-5 pt-20">
          <div className="text-center">
            <span className="text-[13px] font-semibold uppercase tracking-[.16em] text-clay">
              Preguntas frecuentes
            </span>
            <h2
              id="faq"
              className="mx-auto mt-3 max-w-[24ch] text-balance text-[clamp(26px,3.4vw,40px)] font-light leading-[1.1] text-ink"
            >
              Resolvemos tus dudas
            </h2>
          </div>
          <div className="mt-8 flex flex-col gap-3">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-[18px] border border-ink/10 bg-warm px-5 py-4 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[16px] font-medium text-ink">
                  {f.q}
                  <ChevronDown aria-hidden className="h-5 w-5 flex-shrink-0 text-ink-mute transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── CTA final ── */}
        <section className="mx-auto max-w-[1100px] px-5 py-20">
          <div className="overflow-hidden rounded-[32px] bg-espresso px-6 py-14 text-center text-paper sm:px-10">
            <h2 className="mx-auto max-w-[22ch] text-balance text-[clamp(26px,3.6vw,42px)] font-light leading-[1.08]">
              Da el primer paso hoy, sin coste
            </h2>
            <p className="mx-auto mt-4 max-w-[48ch] text-[15.5px] leading-relaxed text-paper/80">
              Tu primera valoración con un médico colegiado es gratuita y sin
              compromiso. Empieza cuando quieras, desde donde quieras.
            </p>
            {!config.hideCta && (
              <QuizTrigger
                plan={`${planPrefix}-cta-final`}
                className="mt-8 inline-block rounded-full bg-sage px-10 py-[16px] text-[16px] font-bold text-espresso"
              >
                Empezar mi valoración gratuita
              </QuizTrigger>
            )}
          </div>
        </section>

        {/* ── Footer mínimo ── */}
        <footer className="border-t border-ink/10 bg-warm">
          <div className="mx-auto max-w-[1100px] px-5 py-10">
            <div className="flex flex-col items-center gap-6 text-center">
              <BrandLogo markSize={28} textSize={19} textClassName="text-ink" />
              <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13.5px] text-ink-soft">
                <a href="/sobre-nosotros" className="hover:text-ink">Sobre nosotros</a>
                <a href="/politica-editorial" className="hover:text-ink">Política editorial</a>
                <a href="/privacidad" className="hover:text-ink">Privacidad</a>
                <a href="/terminos" className="hover:text-ink">Términos</a>
                <a href="/cookies" className="hover:text-ink">Cookies</a>
                <a href="/legal" className="hover:text-ink">Aviso legal</a>
              </nav>
              <p className="mx-auto max-w-[70ch] text-[12px] leading-relaxed text-ink-mute">
                {BRAND} es un servicio de consulta médica online prestado por
                médicos colegiados en España. La información de esta página tiene
                carácter general y no sustituye el consejo médico profesional.
                Cada caso se valora de forma individual. Consulta siempre con tu
                médico.
              </p>
              <p className="text-[12px] text-ink-mute">
                © {new Date().getFullYear()} {BRAND}. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </footer>

        {!config.hideCta && <StickyValoracionCTA planPrefix={planPrefix} />}
      </main>
    </QuizProvider>
  );
}
