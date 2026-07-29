import type { Metadata } from "next";
import { ClinicLanding, type ClinicConfig } from "@/components/clinic-landing";
import { SITE_URL } from "@/lib/articles";

const PATH = "/consulta-medica-online";

const config: ClinicConfig = {
  path: PATH,
  planPrefix: "ads-clinica",
};

export const metadata: Metadata = {
  title: "Tu médico online | Consulta médica online con médicos colegiados — DoctorLife",
  description:
    "Consulta médica online con médicos colegiados en España, sin esperas ni citas previas. Rellena un cuestionario y recibe una valoración clínica personalizada.",
  alternates: { canonical: `${SITE_URL}${PATH}` },
  robots: { index: false, follow: true },
};

export default function Page() {
  return <ClinicLanding config={config} />;
}
