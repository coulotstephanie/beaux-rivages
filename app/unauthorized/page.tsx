import type { Metadata } from "next";
import { SystemState } from "@/components/states";

export const metadata: Metadata = {
  title: "Connexion requise — Beaux Rivages",
  robots: { index: false, follow: false },
};

export default function UnauthorizedPage() {
  return (
    <SystemState
      code="401"
      eyebrow="Accès privé"
      title="Une connexion est nécessaire."
      description="Identifiez-vous avec votre compte autorisé pour poursuivre."
      action={{ label: "Accéder à l’administration", href: "/administration" }}
    />
  );
}
