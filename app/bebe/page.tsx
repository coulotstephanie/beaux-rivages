import type { Metadata } from "next";
import { HospitalityServicePage } from "@/components/experiences/HospitalityServicePage";
import { getHospitalityService } from "@/hospitalityServices";
import { languageAlternates } from "@/seo";
const service = getHospitalityService("bebe")!;
export const metadata: Metadata = {
  title: `${service.title} | Beaux Rivages`,
  description:
    "Séjournez avec votre bébé sur Ré ou Oléron plus sereinement grâce aux équipements pour tout-petits mis à disposition dans les maisons Beaux Rivages.",
  alternates: { canonical: "/bebe", languages: languageAlternates("/bebe") },
  openGraph: { images: [service.image] },
};
export default function Page() {
  return <HospitalityServicePage service={service} />;
}
