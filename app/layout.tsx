import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Beaux Rivages | Maisons de caractère sur les îles",
  description:
    "Trois maisons de caractère sur l’Île de Ré et l’Île d’Oléron, portées par une hospitalité inspirée de trois générations d’expérience hôtelière.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
