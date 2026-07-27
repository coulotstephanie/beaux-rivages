import type { Metadata } from "next";
import { BrandLogo } from "@/components/BrandLogo";
import { RatesAdmin } from "@/components/RatesAdmin";

export const metadata: Metadata = {
  title: "Administration tarifaire | Beaux Rivages",
  robots: { index: false, follow: false },
};

export default function RatesAdministrationPage() {
  return (
    <main className="rates-admin-page">
      <header><BrandLogo /><p>Administration privée</p></header>
      <div className="shell">
        <p className="eyebrow">Moteur tarifaire</p>
        <h1>Une année de tarifs, jour par jour.</h1>
        <p>Saisons, week-ends, règles de séjour, options et promotions restent pilotés par Beaux Rivages — jamais extraits des plateformes.</p>
        <RatesAdmin />
      </div>
    </main>
  );
}
