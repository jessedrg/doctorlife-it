"use client";

import { useState } from "react";
import { footerColumns } from "@/lib/data";

/**
 * Columnas de enlaces del footer.
 * - Móvil: cada columna es un acordeón plegable (cerrado por defecto) para
 *   reducir drásticamente la altura del footer.
 * - Escritorio (md+): siempre desplegadas; el botón no es interactivo y se
 *   oculta el chevron. La visibilidad se controla con clases (md:block gana).
 */
export function FooterColumns() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <>
      {footerColumns.map((col) => {
        const isOpen = open === col.title;
        return (
          <div
            key={col.title}
            className="col-span-2 border-t border-paper/10 md:col-span-1 md:border-0"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : col.title)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between py-4 text-left md:pointer-events-none md:py-0 md:pb-5"
            >
              <span className="text-xs uppercase tracking-[.14em] text-sage">
                {col.title}
              </span>
              <span
                className={`text-paper/50 transition-transform duration-200 md:hidden ${
                  isOpen ? "rotate-180" : ""
                }`}
                aria-hidden
              >
                ▾
              </span>
            </button>
            <div
              className={`flex-col gap-[13px] pb-4 text-[15px] text-paper/70 md:flex md:pb-0 ${
                isOpen ? "flex" : "hidden"
              }`}
            >
              {col.links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="text-inherit no-underline transition-colors hover:text-paper"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}
