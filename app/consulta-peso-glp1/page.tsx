import type { Metadata } from "next";
import { WeightLossLanding } from "@/components/weight-loss-landing";
import { SITE_URL } from "@/lib/articles";

const PATH = "/consulta-peso-glp1";

export const metadata: Metadata = {
  title: "Tratamiento GLP-1 con supervisión médica online | DoctorLife",
  description:
    "Tratamiento GLP-1 con endocrinos colegiados, 100% online, si está clínicamente indicado. Plan personalizado y seguimiento. Primera visita gratis.",
  alternates: { canonical: `${SITE_URL}${PATH}` },
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <WeightLossLanding
      config={{
        path: PATH,
        planPrefix: "ads-peso-glp1",
        eyebrow: "Endocrinos colegiados · 100% online",
        headline: (
          <>
            Tratamiento{" "}
            <span className="font-serif italic text-sage">GLP-1</span> con{" "}
            <span className="font-serif italic text-sage">supervisión médica</span>
            , desde casa
          </>
        ),
        subtitle:
          "Tratamiento con GLP-1, si el endocrino lo cree adecuado para tu caso.",
        photos: 0,
      }}
    />
  );
}
