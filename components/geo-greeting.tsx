"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

/**
 * Saludo local del artículo.
 *
 * - Si la página tiene una ubicación objetivo (`place`), la usamos SIEMPRE.
 *   Así una guía de Valladolid dice "Atendemos en Valladolid", nunca la
 *   ciudad del visitante (evita el contrasentido de mostrar "Madrid" en una
 *   página de Valladolid) y refuerza la coherencia local para SEO.
 * - Si la página NO es geográfica (`place` vacío), caemos a la geolocalización
 *   por IP (cookie `user_geo` fijada en el edge por proxy.ts) para personalizar
 *   con la ciudad real del visitante. No es cloaking: el HTML indexado no
 *   cambia; solo el navegador añade el saludo.
 * - Si no hay ninguna de las dos, no renderiza nada.
 */
export function GeoGreeting({
  place,
  className = "",
}: {
  place?: string;
  className?: string;
}) {
  const t = useTranslations("ui.geoGreeting");
  const [ipCity, setIpCity] = useState<string | null>(null);

  useEffect(() => {
    // Solo consultamos la IP cuando la página no trae ubicación propia.
    if (place) return;
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user_geo="));
    if (!match) return;
    try {
      const raw = decodeURIComponent(match.split("=").slice(1).join("="));
      const parsed = JSON.parse(raw) as { city?: string };
      if (parsed.city) setIpCity(parsed.city);
    } catch {
      // cookie malformada: ignoramos silenciosamente
    }
  }, [place]);

  const location = place || ipCity;
  if (!location) return null;

  return (
    <div
      className={`flex items-center gap-2 rounded-full border border-sage/40 bg-sage/10 px-4 py-2 text-[13.5px] text-ink ${className}`}
      role="note"
    >
      <span aria-hidden className="h-2 w-2 flex-shrink-0 rounded-full bg-sage" />
      <span className="text-pretty">
        {t("text")} <span className="font-semibold">{location}</span> {t("suffix")}
      </span>
    </div>
  );
}
