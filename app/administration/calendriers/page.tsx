import type { Metadata } from "next";
import { ProfessionalCalendar } from "@/features/back-office";

export const metadata: Metadata = {
  title: "Calendrier professionnel | Beaux Rivages",
  robots: { index: false, follow: false },
};

export default function CalendarAdministrationPage() {
  return <ProfessionalCalendar />;
}
