import type { Source } from "@/lib/articles";
import { ExternalLink } from "lucide-react";

/** Lista de fuentes oficiales (E‑E‑A‑T). */
export function SourcesList({ sources }: { sources: Source[] }) {
  if (sources.length === 0) return null;
  return (
    <section aria-labelledby="sources-heading" className="mt-12 border-t border-ink/10 pt-8">
      <h2
        id="sources-heading"
        className="text-[13px] font-semibold uppercase tracking-[.16em] text-clay"
      >
        Fuentes
      </h2>
      <ul className="mt-4 flex flex-col gap-3">
        {sources.map((s) => (
          <li key={s.href} className="text-[15px] leading-relaxed">
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex items-start gap-2 text-ink underline decoration-clay/40 underline-offset-4 hover:decoration-clay"
            >
              <span className="font-medium">{s.org}</span>
              <span className="text-ink-soft no-underline">— {s.label}</span>
              <ExternalLink aria-hidden className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-ink-mute" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
