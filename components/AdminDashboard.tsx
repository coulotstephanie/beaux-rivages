"use client";

import { useState } from "react";

type Dashboard = {
  year: number;
  totals: { estimatedRevenue: number; confirmedDirectRevenue: number; occupiedNights: number; directReservations: number; requests: number };
  caveat: string;
  houses: { propertySlug: string; property: string; occupancyRate: number; occupiedNights: number; estimatedRevenue: number; sourceNights: Record<string, number>; monthly: { month: number; occupiedNights: number; estimatedRevenue: number }[] }[];
};

export function AdminDashboard() {
  const [token, setToken] = useState("");
  const [data, setData] = useState<Dashboard | null>(null);
  const [message, setMessage] = useState("Authentification requise.");
  const load = async () => {
    const response = await fetch("/api/admin/dashboard", { headers: { Authorization: `Bearer ${token}` } });
    const payload = await response.json() as Dashboard & { error?: string };
    if (!response.ok) return setMessage(payload.error ?? "Accès impossible.");
    setData(payload);
    setMessage("Données actualisées.");
  };
  const download = async (entity: "reservations" | "payments" | "audit_logs") => {
    const response = await fetch(`/api/admin/export?entity=${entity}`, { headers: { Authorization: `Bearer ${token}` } });
    if (!response.ok) return setMessage("Export impossible.");
    const url = URL.createObjectURL(await response.blob());
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `beaux-rivages-${entity}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage("Export préparé.");
  };
  return (
    <div className="admin-dashboard">
      <form onSubmit={(event) => { event.preventDefault(); void load(); }}><label htmlFor="dashboard-token">Jeton administrateur</label><input id="dashboard-token" type="password" value={token} onChange={(event) => setToken(event.target.value)} required /><button type="submit">Afficher le tableau de bord</button></form>
      <p role="status">{message}</p>
      {data ? <><div className="admin-dashboard__totals"><article><span>Revenu plateformes estimé</span><strong>{data.totals.estimatedRevenue.toLocaleString("fr-FR")} €</strong></article><article><span>Revenu direct confirmé</span><strong>{data.totals.confirmedDirectRevenue.toLocaleString("fr-FR")} €</strong></article><article><span>Nuits occupées</span><strong>{data.totals.occupiedNights}</strong></article><article><span>Réservations directes</span><strong>{data.totals.directReservations}</strong></article><article><span>Demandes</span><strong>{data.totals.requests}</strong></article></div>
      <div className="admin-dashboard__exports" aria-label="Exports administratifs"><button type="button" onClick={() => void download("reservations")}>Exporter les réservations</button><button type="button" onClick={() => void download("payments")}>Exporter les paiements</button><button type="button" onClick={() => void download("audit_logs")}>Exporter le journal d’audit</button></div>
      <div className="admin-dashboard__houses">{data.houses.map((house) => <section key={house.propertySlug}><h2>{house.property}</h2><div className="admin-dashboard__score"><strong>{house.occupancyRate} %</strong><span>occupation estimée {data.year}</span></div><dl><div><dt>Revenu estimé</dt><dd>{house.estimatedRevenue.toLocaleString("fr-FR")} €</dd></div><div><dt>Airbnb</dt><dd>{house.sourceNights.airbnb} nuits</dd></div><div><dt>Booking</dt><dd>{house.sourceNights.booking} nuits</dd></div><div><dt>Abritel</dt><dd>{house.sourceNights.abritel} nuits</dd></div></dl><div className="admin-dashboard__chart" aria-label={`Évolution mensuelle de ${house.property}`}>{house.monthly.map((month) => <span key={month.month} title={`${month.occupiedNights} nuits`} style={{ height: `${Math.max(4, month.occupiedNights / 31 * 100)}%` }}><i>{month.month}</i></span>)}</div></section>)}</div><p>{data.caveat}</p></> : null}
    </div>
  );
}
