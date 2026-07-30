import type { Metadata } from "next";
import { GuestCrm } from "@/features/back-office";

export const metadata: Metadata = {
  title: "Voyageurs CRM | Beaux Rivages",
  robots: { index: false, follow: false },
};

export default function GuestCrmPage() {
  return <GuestCrm />;
}
