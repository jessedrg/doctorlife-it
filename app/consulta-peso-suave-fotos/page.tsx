import type { Metadata } from "next";
import { WeightLossLanding } from "@/components/weight-loss-landing";
import { SITE_URL } from "@/lib/articles";

const PATH = "/consulta-peso-suave-fotos";

export const metadata: Metadata = {
  title: "Consulta médica online para el control de peso | DoctorLife",
  description:
    "Valoración con médicos colegiados para el control de peso, 100% online. Plan personalizado y seguimiento. Primera visita gratis, sin permanencia.",
  alternates: { canonical: `${SITE_URL}${PATH}` },
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <WeightLossLanding
      config={{
        path: PATH,
        planPrefix: "ads-peso-suave-fotos",
        eyebrow: "Médicos colegiados · 100% online",
        headline: (
          <>
            Consulta médica online para el{" "}
            <span className="font-serif italic text-sage">control de peso</span>
          </>
        ),
        subtitle:
          "Valoración con endocrino colegiado y plan personalizado, desde casa.",
        photos: 3,
      }}
    />
  );
}
