import type { Metadata } from "next";
import { HospitalityServicePage } from "@/components/experiences/HospitalityServicePage";
import { getHospitalityService } from "@/hospitalityServices";
import { languageAlternates } from "@/seo";
const service = getHospitalityService("romance")!;
export const metadata: Metadata = {
  title: `${service.title} | Beaux Rivages`,
  description:
    "Préparez une parenthèse romantique sur l’Île de Ré ou d’Oléron avec une attention personnelle imaginée sur demande avec Stéphanie et Bruno.",
  alternates: { canonical: "/romance", languages: languageAlternates("/romance") },
  openGraph: { images: [service.image] },
};
export default function Page() {
  return <HospitalityServicePage service={service} />;
}
