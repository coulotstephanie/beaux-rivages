"use client";

import { useEffect, useMemo, useState } from "react";

const houses = [
  { slug: "chai-des-tortues", label: "Le Chai des Tortues" },
  { slug: "villa-raie-manta", label: "Villa Raie Manta" },
  { slug: "nid-d-ete", label: "Le Nid d’Été" },
] as const;
type RateDay = { date: string; rate: number; season: string; minimumNights: number };
type RevenueKpi = {
  propertySlug: string;
  propertyName: string;
  revenueCents: number;
  adrCents: number;
  revParCents: number;
  occupancyRate: number;
  reservations: number;
};
const monthNames = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

export function RatesAdmin() {
  const [property, setProperty] = useState<(typeof houses)[number]["slug"]>("chai-des-tortues");
  const [year, setYear] = useState(new Date().getFullYear());
  const [days, setDays] = useState<RateDay[]>([]);
  const [selection, setSelection] = useState<{ start: string | null; end: string | null }>({
    start: null,
    end: null,
  });
  const [bulkRate, setBulkRate] = useState("");
  const [rateName, setRateName] = useState("Ajustement calendrier");
  const [rateKind, setRateKind] = useState("manual");
  const [minimumNights, setMinimumNights] = useState("");
  const [kpis, setKpis] = useState<RevenueKpi[]>([]);
  const [token, setToken] = useState("");
  const [message, setMessage] = useState(
    "Sélectionnez une plage pour préparer une modification groupée.",
  );

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/rates?property=${property}&year=${year}`, { signal: controller.signal })
      .then((response) => response.json() as Promise<{ days: RateDay[] }>)
      .then((payload) => setDays(payload.days))
      .catch(() => setMessage("Impossible de charger le calendrier tarifaire."));
    return () => controller.abort();
  }, [property, year]);

  useEffect(() => {
    if (!token) return;
    const controller = new AbortController();
    fetch(`/api/admin/revenue-management?year=${year}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    })
      .then((response) => response.json() as Promise<{ properties?: RevenueKpi[] }>)
      .then((payload) => setKpis(payload.properties ?? []))
      .catch(() => setKpis([]));
    return () => controller.abort();
  }, [token, year]);

  const months = useMemo(
    () =>
      monthNames.map((name, month) => ({
        name,
        days: days.filter((day) => new Date(`${day.date}T12:00:00Z`).getUTCMonth() === month),
      })),
    [days],
  );

  const select = (date: string) => {
    if (!selection.start || selection.end || date < selection.start)
      setSelection({ start: date, end: null });
    else setSelection({ start: selection.start, end: date });
  };
  const selected = (date: string) =>
    Boolean(
      selection.start && date >= selection.start && date <= (selection.end ?? selection.start),
    );
  const save = async () => {
    const response = await fetch("/api/rates", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        propertySlug: property,
        name: rateName,
        kind: rateKind,
        ...selection,
        nightlyRate: Number(bulkRate),
        minimumNights: minimumNights ? Number(minimumNights) : undefined,
      }),
    });
    const payload = (await response.json()) as { error?: string };
    if (payload.error) return setMessage(payload.error);
    setMessage("Tarifs enregistrés.");
    setSelection({ start: null, end: null });
    const refreshed = await fetch(`/api/rates?property=${property}&year=${year}`);
    setDays(((await refreshed.json()) as { days: RateDay[] }).days);
  };

  return (
    <div className="rates-admin">
      <div className="rates-admin__toolbar">
        <label>
          Maison
          <select
            value={property}
            onChange={(event) => setProperty(event.target.value as typeof property)}
          >
            {houses.map((house) => (
              <option key={house.slug} value={house.slug}>
                {house.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Année
          <select value={year} onChange={(event) => setYear(Number(event.target.value))}>
            {[2026, 2027, 2028].map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        <label>
          Nouveau prix
          <input
            type="number"
            min="1"
            inputMode="numeric"
            value={bulkRate}
            onChange={(event) => setBulkRate(event.target.value)}
          />{" "}
          €
        </label>
        <label>
          Libellé
          <input value={rateName} onChange={(event) => setRateName(event.target.value)} />
        </label>
        <label>
          Type
          <select value={rateKind} onChange={(event) => setRateKind(event.target.value)}>
            <option value="manual">Période</option>
            <option value="weekend">Week-end</option>
            <option value="school_holiday">Vacances scolaires</option>
            <option value="public_holiday">Jour férié</option>
            <option value="event">Évènement</option>
          </select>
        </label>
        <label>
          Séjour minimum
          <input
            type="number"
            min="1"
            max="60"
            value={minimumNights}
            onChange={(event) => setMinimumNights(event.target.value)}
          />
        </label>
        <label>
          Jeton administrateur
          <input type="password" value={token} onChange={(event) => setToken(event.target.value)} />
        </label>
        <button
          type="button"
          disabled={!selection.start || !selection.end || !bulkRate || !token}
          onClick={() => void save()}
        >
          Appliquer à la plage
        </button>
      </div>
      <p role="status">{message}</p>
      {kpis.length > 0 && (
        <div className="admin-kpis admin-kpis--revenue">
          {kpis.map((item) => (
            <article key={item.propertySlug}>
              <span>{item.propertyName}</span>
              <strong>{item.occupancyRate} %</strong>
              <small>
                ADR {Math.round(item.adrCents / 100)} € · RevPAR{" "}
                {Math.round(item.revParCents / 100)} € · CA{" "}
                {Math.round(item.revenueCents / 100).toLocaleString("fr-FR")} €
              </small>
            </article>
          ))}
        </div>
      )}
      <div className="rates-admin__legend">
        <span>Tarif standard</span>
        <span>Week-end</span>
        <span>Saison</span>
        <span>Plage sélectionnée</span>
      </div>
      <div className="rates-year">
        {months.map((month) => (
          <section key={month.name}>
            <h2>{month.name}</h2>
            <div>
              {month.days.map((day) => (
                <button
                  type="button"
                  key={day.date}
                  className={`${day.season === "Week-end" ? "is-weekend" : day.season !== "Tarif standard" ? "is-season" : ""}${selected(day.date) ? " is-selected" : ""}`}
                  onClick={() => select(day.date)}
                  aria-pressed={selected(day.date)}
                  aria-label={`${new Date(`${day.date}T12:00:00Z`).toLocaleDateString("fr-FR")}, ${day.rate} euros, ${day.season}`}
                >
                  <span>{Number(day.date.slice(-2))}</span>
                  <strong>{day.rate} €</strong>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
      <aside>
        <h2>Copier une saison</h2>
        <p>
          Le domaine tarifaire représente les saisons par plages indépendantes. La future
          persistance permet de dupliquer une règle vers une autre année ou une autre maison sans
          modifier le moteur.
        </p>
      </aside>
    </div>
  );
}
