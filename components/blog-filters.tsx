"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * Controles de búsqueda y filtrado por categoría del blog.
 * Actualiza la URL (?q=&cat=&page=) y deja que la página (Server Component)
 * vuelva a renderizar los resultados filtrados y paginados.
 */
export function BlogFilters({
  categories,
  activeCat,
  query,
}: {
  categories: string[];
  activeCat: string;
  query: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(query);

  // Mantén el input sincronizado si la query cambia desde fuera (p. ej. atrás/adelante).
  useEffect(() => setValue(query), [query]);

  function pushParams(next: { q?: string; cat?: string }) {
    const sp = new URLSearchParams(params.toString());
    if (next.q !== undefined) {
      if (next.q) sp.set("q", next.q);
      else sp.delete("q");
    }
    if (next.cat !== undefined) {
      if (next.cat && next.cat !== "Todos") sp.set("cat", next.cat);
      else sp.delete("cat");
    }
    sp.delete("page"); // cualquier cambio de filtro vuelve a la página 1
    const qs = sp.toString();
    startTransition(() => {
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  }

  // Debounce de la búsqueda en texto.
  useEffect(() => {
    if (value === query) return;
    const t = setTimeout(() => pushParams({ q: value.trim() }), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const chips = ["Todos", ...categories];

  return (
    <div className={`flex flex-col gap-5 ${isPending ? "opacity-70" : ""} transition-opacity`}>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          pushParams({ q: value.trim() });
        }}
        className="relative mx-auto w-full max-w-[520px]"
      >
        <label htmlFor="blog-search" className="sr-only">
          Buscar guías del blog
        </label>
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="pointer-events-none absolute left-5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-mute"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          id="blog-search"
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Busca por tratamiento o ciudad: «Wegovy Madrid»…"
          className="w-full rounded-full border border-ink/12 bg-warm py-[14px] pl-12 pr-5 text-[15px] text-ink outline-none ring-clay/30 transition focus:border-clay/50 focus:ring-2"
        />
      </form>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {chips.map((c) => {
          const isActive = c === activeCat || (c === "Todos" && !activeCat);
          return (
            <button
              key={c}
              type="button"
              onClick={() => pushParams({ cat: c })}
              aria-pressed={isActive}
              className={`rounded-full px-[15px] py-[7px] text-[13.5px] font-medium transition-colors ${
                isActive
                  ? "bg-ink text-paper"
                  : "border border-ink/12 bg-warm text-ink-soft hover:border-ink/25 hover:text-ink"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>
    </div>
  );
}
