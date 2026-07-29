import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SITE_URL } from "./lib/seo";

// Único dominio que SÍ debe ser indexado por Google (derivado del SITE_URL
// centralizado en messages/{locale}/seo.json — cambia solo ahí).
const PRODUCTION_HOST = new URL(SITE_URL).hostname;

/**
 * En cualquier host que no sea producción (dev.doctorlife.io, previews de
 * Vercel *.vercel.app, localhost, etc.) añadimos la cabecera
 * `X-Robots-Tag: noindex, nofollow` a TODAS las respuestas. Así ningún
 * entorno de desarrollo se indexa aunque tenga contenido idéntico al de
 * producción (evita canibalización y contenido duplicado).
 */
export function proxy(request: NextRequest) {
  const host = (request.headers.get("host") || "").toLowerCase().split(":")[0];

  const isProduction = host === PRODUCTION_HOST || host === `www.${PRODUCTION_HOST}`;

  const response = NextResponse.next();

  if (!isProduction) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  /**
   * Geolocalización en el edge (Vercel). Detectamos la ciudad/región REAL del
   * visitante por IP y la guardamos en una cookie legible por el cliente, para
   * personalizar el saludo de las landings/hubs ("Atendemos en {tu ciudad}")
   * SIN que el usuario escriba el municipio y SIN cloaking: el HTML indexado
   * por Google no cambia; solo un componente cliente añade el saludo local.
   * Las páginas son estáticas (ISR), por eso se resuelve en cliente vía cookie.
   */
  const city = request.headers.get("x-vercel-ip-city");
  const region = request.headers.get("x-vercel-ip-country-region");
  if (city) {
    const value = JSON.stringify({
      city: decodeURIComponent(city),
      region: region ? decodeURIComponent(region) : "",
    });
    response.cookies.set("user_geo", value, {
      path: "/",
      maxAge: 60 * 60 * 24, // 24h
      sameSite: "lax",
      httpOnly: false, // el componente cliente necesita leerla
    });
  }

  return response;
}

export const config = {
  // Aplica a todo excepto assets estáticos internos de Next.
  matcher: ["/((?!_next/static|_next/image|favicon.svg).*)"],
};
