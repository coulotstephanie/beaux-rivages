import type { Metadata } from "next";
import { BrandLogo } from "@/components/BrandLogo";
import { RatesAdmin } from "@/components/RatesAdmin";

export const metadata: Metadata = {
  title: "Centre Tarifaire | Administration Beaux Rivages",
  robots: { index: false, follow: false },
};

export default function RatesAdministrationPage() {
  return (
    <main className="rates-admin-page">
      <header>
        <BrandLogo />
        <p>Administration privée</p>
      </header>
      <div className="shell">
        <p className="eyebrow">Source unique de vérité</p>
        <h1>Centre Tarifaire</h1>
        <p>
          Tarifs, saisons, règles de séjour, suppléments et promotions sont pilotés ici par Beaux
          Rivages — jamais extraits des plateformes.
        </p>
        <RatesAdmin />
      </div>
    </main>
  );
}
