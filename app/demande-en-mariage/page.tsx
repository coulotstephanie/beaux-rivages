import type { Metadata } from "next";
import { HospitalityServicePage } from "@/components/experiences/HospitalityServicePage";
import { getHospitalityService } from "@/hospitalityServices";
import { languageAlternates } from "@/seo";
const service = getHospitalityService("demande-en-mariage")!;
export const metadata: Metadata = {
  title: `${service.title} | Beaux Rivages`,
  description:
    "Imaginez une demande en mariage personnalisée dans une maison Beaux Rivages sur Ré ou Oléron, préparée avec discrétion selon vos souhaits.",
  alternates: { canonical: "/demande-en-mariage", languages: languageAlternates("/demande-en-mariage") },
  openGraph: { images: [service.image] },
};
export default function Page() {
  return <HospitalityServicePage service={service} />;
}
