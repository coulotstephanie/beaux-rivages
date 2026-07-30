import type { Metadata } from "next";
import { PremiumDashboard } from "@/features/back-office";

export const metadata: Metadata = {
  title: "Tableau de bord Premium | Beaux Rivages",
  robots: { index: false, follow: false },
};

export default function AdministrationPage() {
  return <PremiumDashboard />;
}
