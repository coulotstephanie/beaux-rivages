import type { Metadata } from "next";
import { CommandCenter } from "@/features/back-office";

export const metadata: Metadata = { title: "Command Center | Beaux Rivages", robots: { index: false, follow: false } };
export default function CommandCenterPage() { return <CommandCenter />; }
