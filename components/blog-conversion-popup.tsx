"use client";

import { useEffect, useState } from "react";
import { X, Check, Stethoscope } from "lucide-react";
import { QuizTrigger } from "@/components/quiz-trigger";
import { analytics } from "@/lib/analytics";

const STORAGE_KEY = "dl-blog-popup-dismissed";

const INCLUDES = [
  "Consulta con endocrino colegiado",
  "Receta de GLP‑1 si la necesitas",
  "Chat directo con tu médico",
  "Seguimiento y ajustes mensuales",
];

/**
 * Card de conversión que aparece tras un tiempo navegando el artículo.
 * Muestra la imagen de una paciente, qué incluye el tratamiento y un CTA
 * para reservar la primera visita. No intrusiva: se puede cerrar y no
 * vuelve a aparecer en la misma sesión.
 *
 * @param delayMs Tiempo en ms que el usuario debe llevar navegando antes de mostrarla.
 */
export function BlogConversionPopup({
  delayMs = 5000,
  image = "/testimonials/maria.png",
  imageAlt = "María, paciente de DoctorLife, sonriendo",
}: {
  delayMs?: number;
  image?: string;
  imageAlt?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY) === "1") {
      setDismissed(true);
      return;
    }
    const t = setTimeout(() => {
      setMounted(true);
      analytics.blogPopupShown();
      // siguiente frame para activar la transición de entrada
      requestAnimationFrame(() => setOpen(true));
    }, delayMs);
    return () => clearTimeout(t);
  }, [delayMs]);

  function close() {
    setOpen(false);
    sessionStorage.setItem(STORAGE_KEY, "1");
    setTimeout(() => setDismissed(true), 300);
  }

  if (dismissed || !mounted) return null;

  return (
    <>
      {/* Backdrop sutil — solo en móvil para enfocar la atención */}
      <button
        type="button"
        aria-label="Cerrar"
        onClick={close}
        className={`fixed inset-0 z-[90] bg-espresso/40 backdrop-blur-[2px] transition-opacity duration-300 sm:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        role="dialog"
        aria-modal="false"
        aria-label="Empieza tu tratamiento con DoctorLife"
        className={`fixed z-[95] transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)]
          inset-x-3 bottom-3
          sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[380px]
          ${open ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
      >
        <div className="relative overflow-hidden rounded-[26px] bg-espresso text-paper shadow-[0_30px_80px_-20px_rgba(23,16,9,.7)] ring-1 ring-paper/10">
          {/* Botón cerrar */}
          <button
            type="button"
            aria-label="Cerrar aviso"
            onClick={close}
            className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-espresso/40 text-paper/80 backdrop-blur-md transition-colors hover:bg-espresso/70 hover:text-paper"
          >
            <X aria-hidden className="h-[18px] w-[18px]" />
          </button>

          {/* Imagen */}
          <div className="relative h-[180px] w-full sm:h-[200px]">
            <img
              src={image || "/placeholder.svg"}
              alt={imageAlt}
              className="absolute inset-0 h-full w-full object-cover object-[center_22%]"
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: "linear-gradient(180deg,rgba(23,16,9,0) 35%,#171009 100%)" }}
            />
            <div className="absolute bottom-4 left-5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sage px-3 py-[5px] text-[11.5px] font-semibold uppercase tracking-[.1em] text-ink">
                <Stethoscope aria-hidden className="h-3.5 w-3.5" />
                Primera visita gratis
              </span>
            </div>
          </div>

          {/* Contenido */}
          <div className="px-6 pb-6 pt-5">
            <h3 className="text-balance text-[22px] font-light leading-[1.15]">
              Tu plan de pérdida de peso, diseñado por médicos
            </h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-paper/70">
              Sin protocolos genéricos. Desde 139 €/mes sin permanencia, o pack de 5 meses por 449 €.
            </p>

            <ul className="mt-4 flex flex-col gap-2.5">
              {INCLUDES.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-[14px] text-paper/90">
                  <span className="flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full bg-sage">
                    <Check aria-hidden className="h-3 w-3 text-ink" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <QuizTrigger
              plan="blog-popup"
              className="mt-5 block w-full rounded-full bg-sage px-6 py-[14px] text-center text-[15px] font-semibold text-ink"
            >
              Reservar mi primera visita
            </QuizTrigger>
            <p className="mt-2.5 text-center text-[12px] text-paper/55">
              Primera visita gratis · Sin compromiso
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
