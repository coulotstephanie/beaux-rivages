import type { Metadata } from "next";
import { PricingStudio } from "@/features/back-office";

export const metadata: Metadata = {
  title: "Tarifs et offres | Beaux Rivages",
  robots: { index: false, follow: false },
};

export default function RatesAdministrationPage() {
  return <PricingStudio />;
}
