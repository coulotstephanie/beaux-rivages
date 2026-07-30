import type { Metadata } from "next";
import { OperationsTimeline } from "@/features/back-office";

export const metadata: Metadata = { title: "Historique | Beaux Rivages", robots: { index: false, follow: false } };
export default function ActivityPage() { return <OperationsTimeline />; }
