import type { Metadata } from "next";
import { SettingsCenter } from "@/features/back-office";

export const metadata: Metadata = {
  title: "Paramètres | Beaux Rivages",
  robots: { index: false, follow: false },
};

export default function SettingsPage() {
  return <SettingsCenter />;
}
