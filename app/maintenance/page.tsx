import type { Metadata } from "next";
import { SystemState } from "@/components/states";

export const metadata: Metadata = {
  title: "Une courte pause — Beaux Rivages",
  robots: { index: false, follow: false },
};

export default function MaintenancePage() {
  return (
    <SystemState
      code="maintenance"
      eyebrow="Une courte pause"
      title="Nous préparons la suite avec soin."
      description="Le service sera de nouveau disponible très prochainement. Merci pour votre patience."
    />
  );
}
