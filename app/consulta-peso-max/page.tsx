import type { Metadata } from "next";
import { WeightLossLanding } from "@/components/weight-loss-landing";
import { SITE_URL } from "@/lib/articles";

const PATH = "/consulta-peso-max";

export const metadata: Metadata = {
  title: "Pierde peso con GLP-1 y seguimiento médico | DoctorLife",
  description:
    "Programa de control de peso con GLP-1 supervisado por endocrinos colegiados, 100% online. Empieza hoy tu valoración. Primera visita gratis.",
  alternates: { canonical: `${SITE_URL}${PATH}` },
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <WeightLossLanding
      config={{
        path: PATH,
        planPrefix: "ads-peso-max",
        eyebrow: "Pierde peso con GLP-1 · Supervisión médica",
        headline: (
          <>
            Pierde peso con{" "}
            <span className="font-serif italic text-sage">GLP-1</span> y{" "}
            <span className="font-serif italic text-sage">seguimiento médico</span>
          </>
        ),
        subtitle:
          "Programa de control de peso con GLP-1 supervisado por endocrinos colegiados. Empieza hoy tu valoración.",
        photos: 3,
      }}
    />
  );
}
