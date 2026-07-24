import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BookingRequestForm } from "@/components/BookingRequestForm";

export const metadata: Metadata = {
  title: "Réserver en direct | Beaux Rivages",
  description: "Préparez votre séjour Beaux Rivages et recevez une réponse personnalisée de Stéphanie.",
};

export default function BookingPage() {
  return (
    <main>
      <Header />
      <section className="booking-page">
        <div className="booking-intro">
          <p className="eyebrow light">Réservation directe</p>
          <h1>Votre séjour, pensé dans les moindres détails.</h1>
          <p>Choisissez votre maison, vos dates et les attentions souhaitées. Stéphanie vérifiera personnellement la disponibilité et vous transmettra le tarif définitif.</p>
          <div className="booking-trust"><span>Réponse personnalisée</span><span>Sans frais de plateforme</span><span>Options sur mesure</span><span>Carnet Beaux Rivages inclus</span></div>
        </div>
        <BookingRequestForm />
      </section>
      <Footer />
    </main>
  );
}
