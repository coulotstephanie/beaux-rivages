import type { Metadata } from "next";
import { SystemState } from "@/components/states";

export const metadata: Metadata = {
  title: "Accès non autorisé — Beaux Rivages",
  robots: { index: false, follow: false },
};

export default function ForbiddenPage() {
  return (
    <SystemState
      code="403"
      eyebrow="Accès limité"
      title="Vous n’avez pas accès à cet espace."
      description="Votre compte est bien reconnu, mais cette action nécessite une autre permission."
    />
  );
}
