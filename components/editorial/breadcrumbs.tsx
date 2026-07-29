import { ChevronRight } from "lucide-react";

export type Crumb = { label: string; href?: string };

/** Migas de pan accesibles (Inicio › Pilar › Artículo). */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Migas de pan" className="text-[13px] text-ink-mute">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <a href={item.href} className="no-underline transition-colors hover:text-ink">
                  {item.label}
                </a>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className="text-ink-soft">
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRight aria-hidden className="h-3.5 w-3.5 text-ink-mute/60" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
