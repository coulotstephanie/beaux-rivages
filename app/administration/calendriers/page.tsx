import type { Metadata } from "next";
import { CalendarAdmin } from "@/components/CalendarAdmin";
import { BrandLogo } from "@/components/BrandLogo";

export const metadata: Metadata = {
  title: "Administration des calendriers | Beaux Rivages",
  robots: { index: false, follow: false },
};

export default function CalendarAdministrationPage() {
  return (
    <main className="calendar-admin-page">
      <header><BrandLogo /><p>Administration privée</p></header>
      <div className="shell">
        <p className="eyebrow">Calendriers</p>
        <h1>Synchronisation des maisons</h1>
        <p>État des imports Airbnb, Booking, Abritel et Google Calendar. Les URL privées ne sont jamais renvoyées au navigateur.</p>
        <CalendarAdmin />
      </div>
    </main>
  );
}
