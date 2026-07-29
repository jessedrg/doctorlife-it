import type { Metadata } from "next";
import {
  ValoracionMedicaLanding,
  type ValoracionConfig,
} from "@/components/valoracion-medica-landing";
import { SITE_URL } from "@/lib/articles";

const PATH = "/valoracion-medica-6";

const config: ValoracionConfig = {
  path: PATH,
  planPrefix: "ads-valoracion-6",
  // Versión completa: reseñas, distintivo GLP-1 inyectable y botones de formulario activos.
  hideReviews: false,
  showGlpBadge: true,
  glpBadgeText:
    "Tratamiento médico GLP-1 inyectable, si el médico lo considera adecuado",
  hideCta: false,
};

export const metadata: Metadata = {
  title: "Valoración médica online para el control de peso — DoctorLife",
  description:
    "Completa un cuestionario de salud y un médico colegiado en España valora tu caso en videoconsulta. Primera valoración gratis, con seguimiento continuo y sin desplazamientos.",
  alternates: { canonical: `${SITE_URL}${PATH}` },
  robots: { index: false, follow: true },
};

export default function Page() {
  return <ValoracionMedicaLanding config={config} />;
}
