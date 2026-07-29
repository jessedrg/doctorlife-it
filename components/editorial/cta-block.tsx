import { QuizTrigger } from "@/components/quiz-trigger";

/**
 * Bloque de conversión reutilizable dentro de los artículos de la guía.
 * Replica el CTA del blog: empuja a reservar la primera visita (gratis) abriendo
 * el formulario de onboarding (quiz) mediante QuizTrigger.
 *
 * variant "compact": banda compacta a mitad del artículo.
 * variant "form": tarjeta grande con imagen al final del artículo / pilar.
 */
export function CTABlock({
  variant = "compact",
  source = "articulo",
  title,
  subtitle,
}: {
  variant?: "compact" | "form";
  source?: string;
  title?: string;
  subtitle?: string;
}) {
  if (variant === "compact") {
    return (
      <aside className="my-10 overflow-hidden rounded-[24px] bg-espresso px-7 py-8 text-paper sm:px-9">
        <span className="inline-block rounded-full bg-sage px-[13px] py-[5px] text-[12px] font-semibold text-ink">
          Primera visita gratis
        </span>
        <h3 className="mt-4 text-balance text-[clamp(20px,2.6vw,26px)] font-light leading-[1.15]">
          {title ?? "¿List@ para empezar?"}
        </h3>
        <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-paper/75">
          {subtitle ??
            "Reserva tu primera valoración gratis. Si continúas, eliges tu plan: 139 €/mes sin permanencia, pack de 5 meses por 449 € o nutricionista + GLP1 por 649 €, con chat con tu médico, receta de GLP‑1 si es necesaria y seguimiento."}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <QuizTrigger
            plan={source}
            className="rounded-full bg-sage px-7 py-[13px] text-[15px] font-semibold text-ink"
          >
            Reservar primera visita
          </QuizTrigger>
          <a
            href="/#planes"
            className="rounded-full border border-paper/25 px-7 py-[13px] text-[15px] font-medium text-paper no-underline transition-colors hover:bg-paper/10"
          >
            Ver planes
          </a>
        </div>
      </aside>
    );
  }

  return (
    <section aria-labelledby="cta-form-heading" className="my-12">
      <div className="overflow-hidden rounded-[28px] bg-espresso text-paper">
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr]">
          <div className="p-8 sm:p-10">
            <span className="inline-block rounded-full bg-sage px-[13px] py-[5px] text-xs font-semibold text-ink">
              Primera visita gratis
            </span>
            <h2
              id="cta-form-heading"
              className="mt-5 text-balance text-[clamp(24px,3vw,32px)] font-light leading-[1.1]"
            >
              {title ?? "¿List@ para empezar?"}
            </h2>
            <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-paper/75">
              {subtitle ??
                "Reserva tu primera valoración gratis. Si continúas, desde 139 €/mes sin permanencia, o pack de 5 meses por 449 €."}
            </p>
            <ul className="mt-6 flex flex-col gap-2.5 text-[14.5px] text-paper/85">
              <li className="flex items-center gap-2"><span aria-hidden className="text-sage">✓</span> Médicos colegiados de verdad</li>
              <li className="flex items-center gap-2"><span aria-hidden className="text-sage">✓</span> 100% online, desde casa</li>
              <li className="flex items-center gap-2"><span aria-hidden className="text-sage">✓</span> Sin compromiso ni permanencia</li>
            </ul>
            <div className="mt-7 flex flex-wrap gap-3">
              <QuizTrigger
                plan={source}
                className="rounded-full bg-sage px-7 py-[14px] text-[15px] font-semibold text-ink"
              >
                Reservar primera visita
              </QuizTrigger>
              <a
                href="/#planes"
                className="rounded-full border border-paper/25 px-7 py-[14px] text-[15px] font-medium text-paper no-underline transition-colors hover:bg-paper/10"
              >
                Ver planes
              </a>
            </div>
          </div>
          <div className="relative min-h-[240px] md:min-h-full md:max-h-[520px]">
            <img
              src="/hero/woman.png"
              alt="Paciente de DoctorLife sonriendo"
              className="absolute inset-0 h-full w-full object-cover object-[center_15%]"
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: "linear-gradient(90deg,#171009 0%,transparent 45%)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
