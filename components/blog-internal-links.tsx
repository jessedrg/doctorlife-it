import type { LinkGroup } from "@/lib/blog-internal-links";

/**
 * Bloque de enlazado interno geográfico. Renderiza silos de enlaces
 * (ciudades cercanas, otros tratamientos, guías nacionales) en columnas.
 * Son enlaces reales en el HTML: mejoran navegación y rastreo/indexación.
 */
export function BlogInternalLinks({ groups }: { groups: LinkGroup[] }) {
  if (!groups.length) return null;

  return (
    <section
      aria-label="Enlaces relacionados por ciudad y tratamiento"
      className="mx-auto mt-14 max-w-[760px] px-5 lg:max-w-[820px] 2xl:max-w-[900px]"
    >
      <div className="rounded-[24px] border border-ink/10 bg-warm/60 p-6 sm:p-8">
        <div className="mb-7 flex items-center gap-3">
          <span aria-hidden className="h-px flex-1 bg-ink/10" />
          <h2 className="text-[13px] font-semibold uppercase tracking-[.16em] text-clay">
            Explora por ubicación
          </h2>
          <span aria-hidden className="h-px flex-1 bg-ink/10" />
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <div key={group.title} className="flex flex-col">
              <h3 className="text-[15px] font-medium leading-snug text-ink">{group.title}</h3>
              {group.intro && (
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-mute">{group.intro}</p>
              )}
              <ul className="mt-4 flex flex-col gap-2.5">
                {group.items.map((item) => (
                  <li key={item.href} className="flex items-start gap-2 text-[14.5px] leading-snug">
                    <span aria-hidden className="mt-[3px] text-clay">
                      →
                    </span>
                    <a
                      href={item.href}
                      className="text-ink-soft underline decoration-clay/30 underline-offset-4 transition-colors hover:text-ink hover:decoration-clay"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
