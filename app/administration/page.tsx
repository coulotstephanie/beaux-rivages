import type { Metadata } from "next";
import Link from "next/link";
import { AdminDashboard } from "@/components/AdminDashboard";
import { BrandLogo } from "@/components/BrandLogo";

export const metadata: Metadata = { title: "Tableau de bord | Beaux Rivages", robots: { index: false, follow: false } };
export default function AdministrationPage() {
  return <main className="admin-dashboard-page"><header><BrandLogo /><nav><Link href="/administration/calendriers">Calendriers</Link><Link href="/administration/tarifs">Tarifs</Link></nav></header><div className="shell"><p className="eyebrow">Pilotage Beaux Rivages</p><h1>Réservations, disponibilité et activité.</h1><AdminDashboard /></div></main>;
}
