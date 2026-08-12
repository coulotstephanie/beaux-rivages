import type { Metadata } from "next";
import { HospitalityServicePage } from "@/components/experiences/HospitalityServicePage";
import { getHospitalityService } from "@/hospitalityServices";
import { languageAlternates } from "@/seo";
const service = getHospitalityService("anniversaire")!;
export const metadata: Metadata = {
  title: `${service.title} | Beaux Rivages`,
  description:
    "Célébrez un anniversaire sur mesure dans une maison Beaux Rivages sur Ré ou Oléron, avec une préparation adaptée à votre histoire.",
  alternates: { canonical: "/anniversaire", languages: languageAlternates("/anniversaire") },
  openGraph: { images: [service.image] },
};
export default function Page() {
  return <HospitalityServicePage service={service} />;
}
