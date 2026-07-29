import { Info } from "lucide-react";

/** Aviso médico obligatorio en contenido YMYL de salud. */
export function MedicalDisclaimer({ reviewer }: { reviewer?: string }) {
  return (
    <aside
      role="note"
      aria-label="Aviso médico"
      className="mt-10 flex items-start gap-3 rounded-[16px] bg-cream/50 px-5 py-4 text-[13px] leading-relaxed text-ink-mute"
    >
      <Info aria-hidden className="mt-0.5 h-4 w-4 flex-shrink-0 text-clay" />
      <p>
        Este contenido tiene fines informativos y no sustituye el consejo, diagnóstico ni
        tratamiento de un profesional sanitario. No inicies, cambies ni interrumpas ningún
        tratamiento sin una valoración médica. Los tratamientos con análogos del GLP‑1 requieren
        receta y seguimiento de un profesional colegiado.
        {reviewer ? ` Contenido revisado por ${reviewer}.` : ""}
      </p>
    </aside>
  );
}
