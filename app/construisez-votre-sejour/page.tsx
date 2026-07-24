import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { StayBuilder } from "@/components/StayBuilder";

export const metadata: Metadata = {
  title: "Construisez votre séjour | Beaux Rivages",
  description:
    "Composez votre séjour sur l’Île de Ré ou l’Île d’Oléron et découvrez la maison, les expériences et les attentions Beaux Rivages qui vous correspondent.",
};

export default function BuildYourStayPage() {
  return (
    <main>
      <Header />
      <StayBuilder />
      <Footer />
    </main>
  );
}
