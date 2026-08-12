import type { Metadata } from "next";
import { HospitalityServicePage } from "@/components/experiences/HospitalityServicePage";
import { getHospitalityService } from "@/hospitalityServices";
import { languageAlternates } from "@/seo";

const service = getHospitalityService("panier-douceur")!;
export const metadata: Metadata = {
  title: `${service.title} | Beaux Rivages`,
  description: service.intro,
  alternates: { canonical: "/panier-douceur", languages: languageAlternates("/panier-douceur") },
  openGraph: { title: service.title, description: service.intro, images: [service.image] },
};
export default function Page() {
  return <HospitalityServicePage service={service} />;
}
