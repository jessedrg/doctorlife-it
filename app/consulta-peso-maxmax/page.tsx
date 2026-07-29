import type { Metadata } from "next";
import { WeightLossLanding } from "@/components/weight-loss-landing";
import { SITE_URL } from "@/lib/articles";

const PATH = "/consulta-peso-maxmax";

export const metadata: Metadata = {
  title: "Adelgaza con tratamiento médico e inyección indolora | DoctorLife",
  description:
    "Programa de control de peso con inyección indolora, supervisado por endocrinos colegiados 100% online. Resultados reales. Primera visita gratis.",
  alternates: { canonical: `${SITE_URL}${PATH}` },
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <WeightLossLanding
      config={{
        path: PATH,
        planPrefix: "ads-peso-maxmax",
        eyebrow: "Inyección indolora · Supervisión médica",
        headline: (
          <>
            Adelgaza de verdad con{" "}
            <span className="font-serif italic text-sage">inyección indolora</span>{" "}
            y seguimiento médico
          </>
        ),
        subtitle:
          "Programa de control de peso con inyección indolora semanal, supervisado por endocrinos colegiados. Resultados visibles con acompañamiento médico continuo.",
        photos: 3,
      }}
    />
  );
}
