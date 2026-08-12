import type { Metadata } from "next";
import { HospitalityServicePage } from "@/components/experiences/HospitalityServicePage";
import { getHospitalityService } from "@/hospitalityServices";
import { languageAlternates } from "@/seo";

const service = getHospitalityService("essentiel")!;

export const metadata: Metadata = {
  title: `${service.title} | Beaux Rivages`,
  description: service.intro,
  alternates: { canonical: "/essentiel", languages: languageAlternates("/essentiel") },
  openGraph: { images: [service.image] },
};

export default function Page() {
  return <HospitalityServicePage service={service} />;
}
