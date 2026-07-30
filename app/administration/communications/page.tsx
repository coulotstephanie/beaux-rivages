import type { Metadata } from "next";
import { CommunicationCenter } from "@/features/back-office";

export const metadata: Metadata = {
  title: "Centre de Communication | Beaux Rivages",
  robots: { index: false, follow: false },
};

export default function CommunicationsPage() {
  return <CommunicationCenter />;
}
