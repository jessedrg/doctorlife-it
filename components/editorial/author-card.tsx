import type { Author } from "@/lib/articles";
import { ShieldCheck } from "lucide-react";

function initials(name: string) {
  const parts = name.replace("Dra.", "").replace("Dr.", "").trim().split(" ");
  return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
}

/**
 * Byline / tarjeta de autoría médica con número de colegiado (E‑E‑A‑T).
 * variant "byline": compacta para la cabecera del artículo.
 * variant "review": destacado "Revisado médicamente por".
 */
export function AuthorCard({
  author,
  reviewer,
}: {
  author: Author;
  reviewer: Author;
}) {
  return (
    <div className="mt-6 flex flex-col gap-4 rounded-[18px] border border-ink/10 bg-warm px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-ink font-serif text-[16px] font-bold uppercase text-paper">
          {initials(author.name)}
        </span>
        <div className="text-[13.5px] leading-snug">
          <p className="text-ink-mute">Escrito por</p>
          <a
            href={`/autores/${author.slug}`}
            className="font-medium text-ink underline decoration-ink/20 underline-offset-2 hover:decoration-ink"
          >
            {author.name}
          </a>
          <p className="text-ink-mute">{author.jobTitle}</p>
          <p className="text-ink-mute">{author.colegiado}</p>
        </div>
      </div>

      <div className="flex items-start gap-2 border-t border-ink/10 pt-4 text-[13.5px] leading-snug sm:max-w-[240px] sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
        <ShieldCheck aria-hidden className="mt-0.5 h-4 w-4 flex-shrink-0 text-olive" />
        <div>
          <p className="text-ink-mute">Revisado médicamente por</p>
          <a
            href={`/autores/${reviewer.slug}`}
            className="font-medium text-ink underline decoration-ink/20 underline-offset-2 hover:decoration-ink"
          >
            {reviewer.name}
          </a>
          <p className="text-ink-mute">{reviewer.colegiado}</p>
        </div>
      </div>
    </div>
  );
}
