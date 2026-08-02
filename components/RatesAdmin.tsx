"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { StaffAccess } from "@/components/admin/StaffAccess";

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
type PricingCenterSnapshot = {
  seasons: Array<{
    id: string;
    name: string;
    kind: string;
    begins_on: string;
    ends_on: string;
    minimum_nights: number | null;
    rates?: Array<{ nightly_rate_cents: number }>;
  }>;
  promotions: Array<{
    id: string;
    name: string;
    kind: string;
    percentage: number;
    fixed_discount_cents?: number | null;
    enabled: boolean;
  }>;
  options: Array<{
    price_cents: number;
    enabled: boolean;
    options: { code: string; name: string; pricing_mode: string } | null;
  }>;
  rules: { allowed_arrival_weekdays: number[] };
  history: Array<{
    id: string;
    entity_type: string;
    action: string;
    changed_at: string;
    changed_by: string | null;
  }>;
  connections: Array<{
    provider: string;
    status: string;
    last_synchronization_at: string | null;
    automatic_push_enabled: false;
  }>;
};
const weekdayLabels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
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
  const [authenticated, setAuthenticated] = useState(false);
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
  const [center, setCenter] = useState<PricingCenterSnapshot | null>(null);
  const [seasonDraft, setSeasonDraft] = useState({
    name: "Haute saison",
    kind: "high",
    startsOn: `${new Date().getFullYear()}-07-01`,
    endsOn: `${new Date().getFullYear()}-08-31`,
    nightlyRate: "",
    minimumNights: "7",
  });
  const [promotionDraft, setPromotionDraft] = useState({
    name: "Offre ponctuelle",
    mode: "percentage",
    value: "5",
    startsOn: `${new Date().getFullYear()}-01-01`,
    endsOn: `${new Date().getFullYear()}-12-31`,
  });
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
    if (!authenticated) return;
    const controller = new AbortController();
    fetch(`/api/admin/revenue-management?year=${year}`, {
      signal: controller.signal,
    })
      .then((response) => response.json() as Promise<{ properties?: RevenueKpi[] }>)
      .then((payload) => setKpis(payload.properties ?? []))
      .catch(() => setKpis([]));
    return () => controller.abort();
  }, [authenticated, year]);

  const loadCenter = useCallback(async () => {
    const response = await fetch(`/api/admin/pricing-center?property=${property}`);
    const payload = (await response.json()) as PricingCenterSnapshot & { error?: string };
    if (!response.ok || payload.error) throw new Error(payload.error ?? "Centre indisponible");
    setCenter(payload);
  }, [property]);

  useEffect(() => {
    if (!authenticated) return;
    void loadCenter().catch(() =>
      setMessage("Les paramètres détaillés sont momentanément indisponibles."),
    );
  }, [authenticated, loadCenter]);

  const mutateCenter = async (body: Record<string, unknown>, success: string) => {
    const response = await fetch("/api/admin/pricing-center", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertySlug: property, ...body }),
    });
    const payload = (await response.json()) as { error?: string };
    if (!response.ok || payload.error)
      return setMessage(payload.error ?? "Enregistrement impossible.");
    await loadCenter();
    setMessage(success);
  };

  const exportCsv = () => {
    const content = [
      "date;prix_eur;saison;minimum_nuits",
      ...days.map((day) => `${day.date};${day.rate};${day.season};${day.minimumNights}`),
    ].join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
    link.download = `tarifs-${property}-${year}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const importCsv = async (file: File) => {
    const rows = (await file.text()).split(/\r?\n/).slice(1).filter(Boolean);
    let imported = 0;
    for (const row of rows) {
      const [date, rate, , minimum] = row.split(";");
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number(rate)) continue;
      const response = await fetch("/api/rates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertySlug: property,
          name: "Import CSV",
          kind: "manual",
          start: date,
          end: date,
          nightlyRate: Number(rate),
          minimumNights: Number(minimum) || undefined,
        }),
      });
      if (response.ok) imported += 1;
    }
    setMessage(`${imported} tarif(s) importé(s) et historisé(s).`);
    const refreshed = await fetch(`/api/rates?property=${property}&year=${year}`);
    setDays(((await refreshed.json()) as { days: RateDay[] }).days);
    await loadCenter();
  };

  const months = useMemo(
    () =>
      monthNames.map((name, month) => ({
        name,
        days: days.filter((day) => new Date(`${day.date}T12:00:00Z`).getUTCMonth() === month),
      })),
    [days],
  );
  const rateStats = useMemo(() => {
    const values = days.map((day) => day.rate);
    return values.length
      ? {
          average: Math.round(values.reduce((sum, value) => sum + value, 0) / values.length),
          minimum: Math.min(...values),
          maximum: Math.max(...values),
        }
      : { average: 0, minimum: 0, maximum: 0 };
  }, [days]);

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
      headers: { "Content-Type": "application/json" },
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

  const open = async () => {
    const response = await fetch(`/api/admin/revenue-management?year=${year}`);
    if (!response.ok) {
      setMessage("Accès au moteur tarifaire impossible.");
      return;
    }
    const payload = (await response.json()) as { properties?: RevenueKpi[] };
    setKpis(payload.properties ?? []);
    setAuthenticated(true);
  };

  if (!authenticated) {
    return <StaffAccess busy={false} message={message} onAuthenticated={open} />;
  }

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
        <button
          type="button"
          disabled={!selection.start || !selection.end || !bulkRate}
          onClick={() => void save()}
        >
          Appliquer à la plage
        </button>
      </div>
      <div className="rates-admin__actions" aria-label="Import et duplication">
        <button type="button" onClick={exportCsv}>
          Exporter l’année en CSV
        </button>
        <label className="rates-admin__file">
          Importer un CSV
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={(event) => event.target.files?.[0] && void importCsv(event.target.files[0])}
          />
        </label>
        <button
          type="button"
          onClick={() =>
            void mutateCenter(
              { action: "copy-year", fromYear: year, toYear: year + 1 },
              `Saisons ${year} dupliquées vers ${year + 1}.`,
            )
          }
        >
          Dupliquer vers {year + 1}
        </button>
        <button
          type="button"
          onClick={() => {
            const target = houses.find((house) => house.slug !== property)?.slug;
            if (target)
              void mutateCenter(
                { action: "copy-property", targetPropertySlug: target },
                "Saisons, règles et suppléments copiés vers l’autre logement.",
              );
          }}
        >
          Copier vers une autre maison
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
      <div className="admin-kpis admin-kpis--revenue" aria-label="Indicateurs du Centre Tarifaire">
        <article>
          <span>Tarif moyen</span>
          <strong>{rateStats.average} €</strong>
          <small>Sur l’année affichée</small>
        </article>
        <article>
          <span>Prix minimum</span>
          <strong>{rateStats.minimum} €</strong>
          <small>Sur l’année affichée</small>
        </article>
        <article>
          <span>Prix maximum</span>
          <strong>{rateStats.maximum} €</strong>
          <small>Sur l’année affichée</small>
        </article>
        {kpis
          .filter((item) => item.propertySlug === property)
          .map((item) => (
            <article key={`forecast-${item.propertySlug}`}>
              <span>Prévision</span>
              <strong>{item.occupancyRate} %</strong>
              <small>
                Occupation · CA estimé {Math.round(item.revenueCents / 100).toLocaleString("fr-FR")}{" "}
                €
              </small>
            </article>
          ))}
      </div>
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
      {center && (
        <div className="rates-center-grid">
          <section>
            <h2>Saisons</h2>
            <div className="rates-center-list">
              {center.seasons.map((season) => (
                <article key={season.id}>
                  <i data-season={season.kind} />
                  <div>
                    <strong>{season.name}</strong>
                    <small>
                      {season.begins_on} → {season.ends_on} ·{" "}
                      {season.rates?.[0]
                        ? `${season.rates[0].nightly_rate_cents / 100} €`
                        : "Prix à compléter"}{" "}
                      · {season.minimum_nights ?? 1} nuit(s)
                    </small>
                  </div>
                </article>
              ))}
            </div>
            <div className="rates-center-form">
              <input
                aria-label="Nom de la saison"
                value={seasonDraft.name}
                onChange={(e) => setSeasonDraft({ ...seasonDraft, name: e.target.value })}
              />
              <select
                aria-label="Type de saison"
                value={seasonDraft.kind}
                onChange={(e) => setSeasonDraft({ ...seasonDraft, kind: e.target.value })}
              >
                <option value="low">Basse saison</option>
                <option value="mid">Moyenne saison</option>
                <option value="high">Haute saison</option>
                <option value="custom">Très haute saison</option>
              </select>
              <input
                aria-label="Début de saison"
                type="date"
                value={seasonDraft.startsOn}
                onChange={(e) => setSeasonDraft({ ...seasonDraft, startsOn: e.target.value })}
              />
              <input
                aria-label="Fin de saison"
                type="date"
                value={seasonDraft.endsOn}
                onChange={(e) => setSeasonDraft({ ...seasonDraft, endsOn: e.target.value })}
              />
              <input
                aria-label="Prix par nuit"
                type="number"
                placeholder="Prix €"
                value={seasonDraft.nightlyRate}
                onChange={(e) => setSeasonDraft({ ...seasonDraft, nightlyRate: e.target.value })}
              />
              <input
                aria-label="Minimum de nuits"
                type="number"
                min="1"
                value={seasonDraft.minimumNights}
                onChange={(e) => setSeasonDraft({ ...seasonDraft, minimumNights: e.target.value })}
              />
              <button
                type="button"
                disabled={!seasonDraft.nightlyRate}
                onClick={() =>
                  void mutateCenter(
                    {
                      action: "season",
                      ...seasonDraft,
                      nightlyRate: Number(seasonDraft.nightlyRate),
                      minimumNights: Number(seasonDraft.minimumNights),
                    },
                    "Saison créée et historisée.",
                  )
                }
              >
                Créer la saison
              </button>
            </div>
          </section>
          <section>
            <h2>Jours d’arrivée</h2>
            <div className="rates-weekdays">
              {weekdayLabels.map((label, index) => {
                const day = index + 1;
                const active = center.rules.allowed_arrival_weekdays.includes(day);
                return (
                  <button
                    type="button"
                    aria-pressed={active}
                    className={active ? "is-active" : ""}
                    key={label}
                    onClick={() => {
                      const weekdays = active
                        ? center.rules.allowed_arrival_weekdays.filter((value) => value !== day)
                        : [...center.rules.allowed_arrival_weekdays, day].sort();
                      if (weekdays.length)
                        void mutateCenter(
                          { action: "arrival-days", weekdays },
                          "Jours d’arrivée mis à jour.",
                        );
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <h2>Suppléments</h2>
            <div className="rates-options">
              {center.options.map(
                (option) =>
                  option.options && (
                    <label key={option.options.code}>
                      <span>
                        {option.options.name}
                        <small>{option.options.pricing_mode.replaceAll("_", " ")}</small>
                      </span>
                      <input
                        aria-label={`Prix ${option.options.name}`}
                        type="number"
                        defaultValue={option.price_cents / 100}
                        onBlur={(event) =>
                          void mutateCenter(
                            {
                              action: "option",
                              code: option.options!.code,
                              price: Number(event.target.value),
                              enabled: option.enabled,
                            },
                            `${option.options!.name} mis à jour.`,
                          )
                        }
                      />{" "}
                      €
                    </label>
                  ),
              )}
            </div>
          </section>
          <section>
            <h2>Promotions</h2>
            <div className="rates-center-list">
              {center.promotions.map((promotion) => (
                <article key={promotion.id}>
                  <div>
                    <strong>{promotion.name}</strong>
                    <small>
                      {promotion.fixed_discount_cents
                        ? `${promotion.fixed_discount_cents / 100} €`
                        : `${promotion.percentage} %`}{" "}
                      · {promotion.enabled ? "Active" : "Inactive"}
                    </small>
                  </div>
                </article>
              ))}
            </div>
            <div className="rates-center-form">
              <input
                aria-label="Nom de la promotion"
                value={promotionDraft.name}
                onChange={(e) => setPromotionDraft({ ...promotionDraft, name: e.target.value })}
              />
              <select
                aria-label="Type de réduction"
                value={promotionDraft.mode}
                onChange={(e) => setPromotionDraft({ ...promotionDraft, mode: e.target.value })}
              >
                <option value="percentage">Pourcentage</option>
                <option value="fixed">Montant fixe</option>
              </select>
              <input
                aria-label="Valeur de la réduction"
                type="number"
                min="0.01"
                max={promotionDraft.mode === "percentage" ? 100 : 10000}
                value={promotionDraft.value}
                onChange={(e) => setPromotionDraft({ ...promotionDraft, value: e.target.value })}
              />
              <input
                aria-label="Début promotion"
                type="date"
                value={promotionDraft.startsOn}
                onChange={(e) => setPromotionDraft({ ...promotionDraft, startsOn: e.target.value })}
              />
              <input
                aria-label="Fin promotion"
                type="date"
                value={promotionDraft.endsOn}
                onChange={(e) => setPromotionDraft({ ...promotionDraft, endsOn: e.target.value })}
              />
              <button
                type="button"
                onClick={() =>
                  void mutateCenter(
                    {
                      action: "promotion",
                      kind: "seasonal",
                      name: promotionDraft.name,
                      startsOn: promotionDraft.startsOn,
                      endsOn: promotionDraft.endsOn,
                      percentage:
                        promotionDraft.mode === "percentage" ? Number(promotionDraft.value) : 0,
                      fixedAmount:
                        promotionDraft.mode === "fixed" ? Number(promotionDraft.value) : undefined,
                    },
                    "Promotion créée et historisée.",
                  )
                }
              >
                Créer la promotion
              </button>
            </div>
          </section>
          <section>
            <h2>Synchronisations futures</h2>
            <p className="rates-center-note">
              Architecture prête. Aucun prix n’est envoyé automatiquement.
            </p>
            <div className="rates-center-list">
              {center.connections.map((connection) => (
                <article key={connection.provider}>
                  <div>
                    <strong>{connection.provider === "airbnb" ? "Airbnb" : "Booking"}</strong>
                    <small>
                      {connection.status === "not_connected"
                        ? "Non connecté"
                        : connection.status === "connected"
                          ? "Connecté"
                          : "Synchronisation disponible"}{" "}
                      · Dernière synchronisation :{" "}
                      {connection.last_synchronization_at
                        ? new Date(connection.last_synchronization_at).toLocaleString("fr-FR")
                        : "jamais"}
                    </small>
                  </div>
                </article>
              ))}
            </div>
            <h2>Historique récent</h2>
            <div className="rates-history">
              {center.history.slice(0, 12).map((entry, index) => (
                <p key={entry.id}>
                  <strong>{entry.action}</strong> · {entry.entity_type}
                  <time>{new Date(entry.changed_at).toLocaleString("fr-FR")}</time>
                  {index === 0 && entry.action !== "restore" && (
                    <button
                      type="button"
                      onClick={() =>
                        void mutateCenter(
                          { action: "undo", changeId: entry.id },
                          "Dernière modification annulée.",
                        )
                      }
                    >
                      Annuler
                    </button>
                  )}
                </p>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
