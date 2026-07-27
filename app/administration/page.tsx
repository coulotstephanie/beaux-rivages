import type { Metadata } from "next";
import Link from "next/link";
import { AdminDashboard } from "@/components/AdminDashboard";
import { BrandLogo } from "@/components/BrandLogo";

export const metadata: Metadata = { title: "Tableau de bord | Beaux Rivages", robots: { index: false, follow: false } };
export default function AdministrationPage() {
  return <main className="admin-dashboard-page"><header><BrandLogo /><nav><Link href="/">Voir le site</Link><Link href="/administration/calendriers">Calendriers</Link><Link href="/administration/tarifs">Tarifs</Link></nav></header><div className="shell"><p className="eyebrow">Back Office Beaux Rivages</p><h1>Piloter chaque séjour, simplement.</h1><p className="admin-dashboard-page__intro">Arrivées, voyageurs, réservations, documents et supervision technique réunis dans un espace quotidien.</p><AdminDashboard /></div></main>;
}
