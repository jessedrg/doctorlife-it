import type { Faq } from "@/lib/articles";
import { Plus } from "lucide-react";

/** Sección FAQ visible que coincide exactamente con el JSON-LD FAQPage. */
export function FAQSection({ faqs }: { faqs: Faq[] }) {
  return (
    <section aria-labelledby="faq-heading" className="mt-14">
      <h2
        id="faq-heading"
        className="text-[clamp(22px,2.8vw,30px)] font-normal leading-[1.15] text-ink"
      >
        Preguntas frecuentes
      </h2>
      <div className="mt-6 flex flex-col gap-3">
        {faqs.map((f) => (
          <details
            key={f.pregunta}
            className="group rounded-[18px] border border-ink/10 bg-warm px-6 py-5 open:bg-cream/50"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-medium text-ink">
              {f.pregunta}
              <Plus
                aria-hidden
                className="h-5 w-5 flex-shrink-0 text-clay transition-transform group-open:rotate-45"
              />
            </summary>
            <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">{f.respuesta}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
