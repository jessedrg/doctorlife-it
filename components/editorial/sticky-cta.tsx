"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { analytics } from "@/lib/analytics";

const INCLUYE = [
  "Hasta un 22,5% de pérdida de peso",
  "Receta médica en 3 horas laborables",
  "Valoración y seguimiento con médico colegiado",
  "Sin cita previa ni desplazamientos",
] as const;

const PHONE = "711267223";
const WA_URL = `https://wa.me/34${PHONE}?text=${encodeURIComponent(
  "Me gustaría recibir más información sobre el tratamiento con GLP-1.",
)}`;

function openWhatsApp(source: string) {
  analytics.whatsappClicked(source);
  window.open(WA_URL, "_blank");
}

/** Barra inferior sticky (siempre visible) con vídeo de fondo que abre WhatsApp. */
export function StickyCTA() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[80] px-3 pb-3 sm:px-5 sm:pb-5">
      <div className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl text-paper shadow-[0_20px_50px_-16px_rgba(34,29,23,.55)] ring-1 ring-white/10 sm:rounded-3xl">
        {/* vídeo de las plumas de fondo (como en la landing) */}
        <video
          src="/products/pills-pen.mp4"
          autoPlay
          loop
          muted
          playsInline
          disablePictureInPicture
          preload="metadata"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "center 35%" }}
        />
        {/* overlay para legibilidad */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-ink/92 via-ink/82 to-ink/55"
        />

        <button
          type="button"
          aria-label="Cerrar aviso"
          onClick={() => setDismissed(true)}
          className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/20 text-paper/70 backdrop-blur-sm transition-colors hover:bg-black/40 hover:text-paper"
        >
          <X aria-hidden className="h-4 w-4" />
        </button>

        <div className="relative flex items-center gap-3 px-3 py-3 sm:gap-6 sm:px-6 sm:py-5">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <p className="text-[17px] font-semibold leading-tight sm:text-[21px]">
                Consulta médica online para adelgazar
              </p>
              <span className="rounded-full bg-[#6B774A] px-2.5 py-0.5 text-[14px] font-bold text-white sm:text-[15px]">
                Gratis
              </span>
            </div>
            <p className="mt-1 text-[13.5px] leading-snug text-paper/75 sm:text-[14px]">
              <span className="font-semibold text-[#8fa663]">Pierde peso de forma segura</span>{" "}
              · primera consulta gratis · respuesta en minutos
            </p>

            {/* Qué incluye — grande en desktop */}
            <ul className="mt-3 hidden gap-x-6 gap-y-2 sm:grid sm:grid-cols-2">
              {INCLUYE.map((item) => (
                <li key={item} className="flex items-center gap-2 text-[15px] font-medium text-paper/95">
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#6B774A]">
                    <Check aria-hidden className="h-3.5 w-3.5 text-white" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={() => openWhatsApp("sticky_bar")}
            className="flex-shrink-0 rounded-full bg-[#6B774A] px-4 py-3 text-[13.5px] font-semibold text-white shadow-lg shadow-[#6B774A]/30 transition-transform duration-200 hover:scale-[1.03] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B774A] focus-visible:ring-offset-2 focus-visible:ring-offset-ink sm:px-8 sm:py-4 sm:text-[16px]"
          >
            Empieza ahora
          </button>
        </div>

        {/* Qué incluye — chips en móvil */}
        <ul className="relative flex flex-wrap gap-1.5 px-3 pb-3 sm:hidden">
          {INCLUYE.map((item) => (
            <li
              key={item}
              className="flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1.5 text-[13px] font-medium leading-none text-paper/95 backdrop-blur-sm"
            >
              <Check aria-hidden className="h-3.5 w-3.5 flex-shrink-0 text-[#8fa663]" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
