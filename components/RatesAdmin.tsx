"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { StaffAccess } from "@/components/admin/StaffAccess";
import { isInsideRollingWindow } from "@/platform/pricing/channels";

const houses = [
  { slug: "chai-des-tortues", label: "Le Chai des Tortues" },
  { slug: "villa-raie-manta", label: "Villa Raie Manta" },
  { slug: "nid-d-ete", label: "Le Nid d’Été" },
] as const;
type RateDay = { date: string; rate: number; season: string; minimumNights: number };
type ReferenceDay = {
  date: string;
  kind: "school_holiday" | "public_holiday" | "bridge";
  label: string;
  zone?: "A" | "B" | "C" | "DE" | "BE";
  country?: "FR" | "DE" | "BE";
};
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
    valid_range?: string | null;
  }>;
  options: Array<{
    price_cents: number;
    enabled: boolean;
    options: { code: string; name: string; pricing_mode: string } | null;
  }>;
  rules: { allowed_arrival_weekdays: number[]; optimize_calendar_gaps?: boolean };
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
  overrides: Array<{ id: string; begins_on: string; ends_on: string; name: string }>;
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
  const [referenceDays, setReferenceDays] = useState<ReferenceDay[]>([]);
  const [days, setDays] = useState<RateDay[]>([]);
  const [calendarView, setCalendarView] = useState<"future" | "all" | "past">("all");
  const [historyEditing, setHistoryEditing] = useState(false);
  const [selection, setSelection] = useState<string[]>([]);
  const [bulkRate, setBulkRate] = useState("");
  const [bulkOperation, setBulkOperation] = useState<
    "fixed" | "add" | "subtract" | "increase" | "decrease"
  >("fixed");
  const [weekRate, setWeekRate] = useState("");
  const [weekendRate, setWeekendRate] = useState("");
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
  const [editingSeasonId, setEditingSeasonId] = useState<string | null>(null);
  const [editingPromotionId, setEditingPromotionId] = useState<string | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvImporting, setCsvImporting] = useState(false);
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
    Promise.all(
      (["A", "B", "C", "DE", "BE"] as const).map((zone) =>
        fetch(
          `/api/admin/reference-calendar?year=${year}&zone=${zone}&country=${["DE", "BE"].includes(zone) ? zone : "FR"}`,
          {
            signal: controller.signal,
          },
        ).then(
          (response) => response.json() as Promise<{ days?: ReferenceDay[]; warning?: string }>,
        ),
      ),
    )
      .then((payloads) => {
        const unique = new Map<string, ReferenceDay>();
        for (const payload of payloads)
          for (const day of payload.days ?? [])
            unique.set(`${day.date}:${day.kind}:${day.zone ?? "national"}`, day);
        setReferenceDays([...unique.values()]);
        if (payloads.every((payload) => payload.warning))
          setMessage(
            "Les vacances scolaires sont momentanément indisponibles ; les jours fériés restent affichés.",
          );
      })
      .catch(() => setMessage("Le calendrier scolaire officiel est momentanément indisponible."));
    return () => controller.abort();
  }, [authenticated, year]);

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

  const loadRates = useCallback(async () => {
    const response = await fetch(`/api/rates?property=${property}&year=${year}`);
    const payload = (await response.json()) as { days?: RateDay[]; error?: string };
    if (!response.ok || payload.error) throw new Error(payload.error ?? "Calendrier indisponible");
    setDays(payload.days ?? []);
  }, [property, year]);

  const loadKpis = useCallback(async () => {
    const response = await fetch(`/api/admin/revenue-management?year=${year}`);
    const payload = (await response.json()) as { properties?: RevenueKpi[]; error?: string };
    if (!response.ok || payload.error)
      throw new Error(payload.error ?? "Statistiques indisponibles");
    setKpis(payload.properties ?? []);
  }, [year]);

  useEffect(() => {
    if (!authenticated) return;
    void loadCenter().catch(() =>
      setMessage("Les paramètres détaillés sont momentanément indisponibles."),
    );
  }, [authenticated, loadCenter]);

  const mutateCenter = async (
    body: Record<string, unknown>,
    success: string,
    refreshCalendar = false,
  ) => {
    const response = await fetch("/api/admin/pricing-center", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertySlug: property, ...body }),
    });
    const payload = (await response.json()) as { error?: string };
    if (!response.ok || payload.error)
      return setMessage(payload.error ?? "Enregistrement impossible.");
    await Promise.all([loadCenter(), ...(refreshCalendar ? [loadRates(), loadKpis()] : [])]);
    setMessage(success);
  };

  const parseRange = (value?: string | null) => {
    if (!value) return { startsOn: "", endsOn: "" };
    const [startsOn = "", endsOn = ""] = value.slice(1, -1).split(",");
    return { startsOn, endsOn };
  };

  const seasonHasOverrides = (startsOn: string, endsOn: string) =>
    center?.overrides.some(
      (override) => override.begins_on <= endsOn && override.ends_on >= startsOn,
    ) ?? false;

  const saveSeason = async () => {
    let replaceOverrides = false;
    if (seasonHasOverrides(seasonDraft.startsOn, seasonDraft.endsOn)) {
      replaceOverrides = window.confirm(
        "Des prix personnalisés existent sur cette période.\n\nOK : remplacer tous les prix personnalisés.\nAnnuler : conserver les exceptions.",
      );
    }
    await mutateCenter(
      {
        action: editingSeasonId ? "season-update" : "season",
        ...(editingSeasonId ? { id: editingSeasonId } : {}),
        ...seasonDraft,
        nightlyRate: Number(seasonDraft.nightlyRate),
        minimumNights: Number(seasonDraft.minimumNights),
        replaceOverrides,
      },
      editingSeasonId
        ? "Saison modifiée et calendrier recalculé."
        : "Saison créée et calendrier recalculé.",
      true,
    );
    setEditingSeasonId(null);
  };

  const savePromotion = async () => {
    await mutateCenter(
      {
        action: editingPromotionId ? "promotion-update" : "promotion",
        ...(editingPromotionId ? { id: editingPromotionId } : { kind: "seasonal" }),
        name: promotionDraft.name,
        startsOn: promotionDraft.startsOn,
        endsOn: promotionDraft.endsOn,
        percentage: promotionDraft.mode === "percentage" ? Number(promotionDraft.value) : 0,
        fixedAmount: promotionDraft.mode === "fixed" ? Number(promotionDraft.value) : undefined,
      },
      editingPromotionId ? "Promotion modifiée." : "Promotion créée et historisée.",
    );
    setEditingPromotionId(null);
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
    setCsvImporting(true);
    try {
      const lines = (await file.text())
        .replace(/^\uFEFF/, "")
        .split(/\r?\n/)
        .filter(Boolean);
      const delimiter = lines[0]?.includes(";") ? ";" : ",";
      const entries = lines.slice(1).flatMap((row) => {
        const [rawDate = "", rawRate = "", , rawMinimum = ""] = row.split(delimiter);
        const date = rawDate.trim();
        const nightlyRate = Number(rawRate.trim().replace(",", "."));
        const minimumNights = Number(rawMinimum.trim());
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || nightlyRate <= 0) return [];
        return [
          {
            date,
            nightlyRate,
            ...(Number.isInteger(minimumNights) && minimumNights > 0 ? { minimumNights } : {}),
          },
        ];
      });
      if (!entries.length) {
        setMessage("Aucune ligne valide. Format attendu : date;prix_eur;saison;minimum_nuits.");
        return;
      }
      const today = new Date().toISOString().slice(0, 10);
      const eligibleEntries = entries.filter((entry) => isInsideRollingWindow(entry.date, today));
      const excluded = entries.length - eligibleEntries.length;
      if (!eligibleEntries.length) {
        setMessage("Aucun tarif du fichier ne se trouve dans les 12 mois glissants autorisés.");
        return;
      }
      let imported = 0;
      for (let offset = 0; offset < eligibleEntries.length; offset += 366) {
        const batch = eligibleEntries.slice(offset, offset + 366);
        const response = await fetch("/api/rates", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            propertySlug: property,
            name: "Import CSV",
            kind: "manual",
            entries: batch,
          }),
        });
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        if (!response.ok) {
          setMessage(
            imported
              ? `${imported} tarif(s) importé(s), puis l’import s’est arrêté : ${payload?.error ?? "erreur serveur"}.`
              : (payload?.error ?? "L’import CSV a échoué. Vérifiez le fichier et réessayez."),
          );
          return;
        }
        imported += batch.length;
      }
      await Promise.all([loadRates(), loadCenter(), loadKpis()]);
      setCsvFile(null);
      setMessage(
        `${imported} tarif(s) importé(s) et historisé(s) pour ${file.name}.${excluded ? ` ${excluded} ligne(s) hors fenêtre ignorée(s).` : ""}`,
      );
    } catch {
      setMessage("La connexion a été interrompue pendant l’import. Aucun tarif n’a été confirmé.");
    } finally {
      setCsvImporting(false);
    }
  };

  const months = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const visibleDays = days.filter((day) => {
      if (calendarView === "future") return day.date >= today;
      if (calendarView === "past") return day.date < today;
      return true;
    });
    return monthNames.map((name, month) => ({
      name,
      days: visibleDays.filter((day) => new Date(`${day.date}T12:00:00Z`).getUTCMonth() === month),
    }));
  }, [calendarView, days]);
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
  const referencesByDate = useMemo(() => {
    const map = new Map<string, ReferenceDay[]>();
    for (const day of referenceDays) map.set(day.date, [...(map.get(day.date) ?? []), day]);
    return map;
  }, [referenceDays]);

  const selected = (date: string) => selection.includes(date);
  const select = (date: string, extend: boolean) => {
    const isPast = date < new Date().toISOString().slice(0, 10);
    if (isPast && !historyEditing) {
      setMessage(
        "Cette date passée est conservée en lecture seule. Activez « Modifier l’historique » pour une correction exceptionnelle.",
      );
      return;
    }
    if (extend && selection.length) {
      const anchor = selection.at(-1)!;
      const [start, end] = anchor < date ? [anchor, date] : [date, anchor];
      const range = days
        .filter((day) => day.date >= start && day.date <= end)
        .map((day) => day.date);
      setSelection((current) => [...new Set([...current, ...range])].sort());
      return;
    }
    setSelection((current) =>
      current.includes(date)
        ? current.filter((value) => value !== date)
        : [...current, date].sort(),
    );
  };

  const goToToday = () => {
    const today = new Date().toISOString().slice(0, 10);
    setYear(new Date().getFullYear());
    setCalendarView("all");
    window.setTimeout(
      () =>
        document
          .querySelector<HTMLElement>(`[data-rate-date="${today}"]`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" }),
      150,
    );
  };

  const goToYearStart = () => {
    setCalendarView("all");
    window.setTimeout(
      () =>
        document
          .querySelector<HTMLElement>(".rates-year")
          ?.scrollIntoView({ behavior: "smooth", block: "start" }),
      50,
    );
  };
  const computeRate = (current: number) => {
    const value = Number(bulkRate);
    if (bulkOperation === "add") return current + value;
    if (bulkOperation === "subtract") return current - value;
    if (bulkOperation === "increase") return current * (1 + value / 100);
    if (bulkOperation === "decrease") return current * (1 - value / 100);
    return value;
  };
  const persistEntries = async (
    entries: Array<{ date: string; nightlyRate: number; minimumNights?: number }>,
    name = rateName,
    kind = rateKind,
  ) => {
    if (!entries.length) return setMessage("Sélectionnez au moins une date modifiable.");
    const detail = `${entries.length} jour(s) · ${name}`;
    if (!window.confirm(`Vous allez modifier ${detail}.\n\nConfirmer ?`)) return;
    try {
      const response = await fetch("/api/rates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertySlug: property, name, kind, entries }),
      });
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        setMessage(payload?.error ?? "Le tarif n'a pas pu être enregistré. Réessayez.");
        return;
      }
      await Promise.all([loadRates(), loadCenter()]);
      setSelection([]);
      setMessage(
        `${entries.length} tarif(s) enregistré(s). La modification peut être annulée dans l’historique.`,
      );
    } catch {
      setMessage("La connexion a été interrompue. Vos dates restent sélectionnées : réessayez.");
    }
  };
  const save = async () => {
    const entries = selection.map((date) => {
      const day = days.find((candidate) => candidate.date === date)!;
      return {
        date,
        nightlyRate: Math.max(1, Math.round(computeRate(day.rate) * 100) / 100),
        minimumNights: minimumNights ? Number(minimumNights) : undefined,
      };
    });
    await persistEntries(entries);
  };
  const applyWeekPattern = async () => {
    const protectedKinds = new Set(["Vacances scolaires", "Jour férié", "Pont", "Évènement"]);
    const candidates = (selection.length ? days.filter((day) => selected(day.date)) : days).filter(
      (day) => !protectedKinds.has(day.season),
    );
    const entries = candidates
      .map((day) => {
        const weekday = new Date(`${day.date}T12:00:00Z`).getUTCDay();
        const weekend = weekday === 5 || weekday === 6;
        return {
          date: day.date,
          nightlyRate: Number(weekend ? weekendRate : weekRate),
          minimumNights: minimumNights ? Number(minimumNights) : undefined,
        };
      })
      .filter((entry) => entry.nightlyRate > 0);
    await persistEntries(entries, `Semaine / week-end ${year}`, "weekend");
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
          Action tarifaire
          <select
            value={bulkOperation}
            onChange={(event) => setBulkOperation(event.target.value as typeof bulkOperation)}
          >
            <option value="fixed">Définir un prix fixe</option>
            <option value="add">Ajouter (€)</option>
            <option value="subtract">Retirer (€)</option>
            <option value="increase">Augmenter (%)</option>
            <option value="decrease">Diminuer (%)</option>
          </select>
        </label>
        <label>
          Valeur
          <input
            type="number"
            min="0.01"
            step="0.01"
            inputMode="numeric"
            value={bulkRate}
            onChange={(event) => setBulkRate(event.target.value)}
          />
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
        <button type="button" disabled={!selection.length || !bulkRate} onClick={() => void save()}>
          Modifier {selection.length || "les"} jour(s)
        </button>
      </div>
      <div className="rates-selection-bar" aria-label="Actions sur la sélection">
        <strong>{selection.length} date(s) sélectionnée(s)</strong>
        <span>Cliquez pour sélectionner librement · Maj + clic pour une plage</span>
        <button type="button" disabled={!selection.length} onClick={() => setSelection([])}>
          Annuler la sélection
        </button>
      </div>
      <div className="rates-week-pattern">
        <strong>Prix semaine / week-end</strong>
        <label>
          Dimanche à jeudi
          <input
            type="number"
            min="1"
            value={weekRate}
            onChange={(event) => setWeekRate(event.target.value)}
          />{" "}
          €
        </label>
        <label>
          Vendredi et samedi
          <input
            type="number"
            min="1"
            value={weekendRate}
            onChange={(event) => setWeekendRate(event.target.value)}
          />{" "}
          €
        </label>
        <button
          type="button"
          disabled={!weekRate || !weekendRate}
          onClick={() => void applyWeekPattern()}
        >
          Appliquer {selection.length ? "à la sélection" : `à ${year}`}
        </button>
        <small>Les vacances, jours fériés, ponts et événements identifiés sont protégés.</small>
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
            onChange={(event) => setCsvFile(event.target.files?.[0] ?? null)}
          />
        </label>
        <button
          type="button"
          disabled={!csvFile || csvImporting}
          onClick={() => csvFile && void importCsv(csvFile)}
        >
          {csvImporting ? "Import en cours…" : "Valider l’import CSV"}
        </button>
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
        <span className="is-past-date">Date passée · lecture seule</span>
        <span className="is-school-holiday-a">Vacances · Zone A</span>
        <span className="is-school-holiday-b">Vacances · Zone B</span>
        <span className="is-school-holiday-c">Vacances · Zone C</span>
        <span className="is-school-holiday-de">Vacances · Allemagne</span>
        <span className="is-school-holiday-be">Vacances · Belgique</span>
        <span className="is-public-holiday">Jour férié</span>
        <span className="is-bridge">Pont possible</span>
      </div>
      <div className="rates-calendar-controls" aria-label="Affichage du calendrier tarifaire">
        <label>
          Dates affichées
          <select
            value={calendarView}
            onChange={(event) => {
              setCalendarView(event.target.value as typeof calendarView);
              setSelection([]);
            }}
          >
            <option value="future">Uniquement les dates futures</option>
            <option value="all">Toute l’année</option>
            <option value="past">Uniquement les dates passées</option>
          </select>
        </label>
        <button type="button" onClick={goToToday}>
          Aujourd’hui
        </button>
        <button type="button" onClick={goToYearStart}>
          Début de l’année
        </button>
        <label className="rates-history-toggle">
          <input
            type="checkbox"
            checked={historyEditing}
            onChange={(event) => {
              setHistoryEditing(event.target.checked);
              setSelection([]);
            }}
          />
          Modifier l’historique
        </label>
      </div>
      <div className="rates-year">
        {months.map((month) => (
          <section key={month.name}>
            <h2>{month.name}</h2>
            <div>
              {month.days.map((day) =>
                (() => {
                  const references = referencesByDate.get(day.date) ?? [];
                  const referenceClasses = references
                    .map((item) => `is-${item.kind.replaceAll("_", "-")}`)
                    .join(" ");
                  const labels = references.map((item) => item.label).join(", ");
                  const isPast = day.date < new Date().toISOString().slice(0, 10);
                  return (
                    <button
                      type="button"
                      key={day.date}
                      data-rate-date={day.date}
                      className={`${day.season === "Week-end" ? "is-weekend" : day.season !== "Tarif standard" ? "is-season" : ""}${selected(day.date) ? " is-selected" : ""}${isPast ? " is-past" : ""} ${referenceClasses}`}
                      onClick={(event) => select(day.date, event.shiftKey)}
                      aria-pressed={selected(day.date)}
                      title={labels || undefined}
                      aria-label={`${new Date(`${day.date}T12:00:00Z`).toLocaleDateString("fr-FR")}, ${day.rate} euros, ${day.season}${labels ? `, ${labels}` : ""}`}
                    >
                      <span>
                        {new Date(`${day.date}T12:00:00Z`)
                          .toLocaleDateString("fr-FR", { weekday: "short", timeZone: "UTC" })
                          .replace(".", "")}{" "}
                        {Number(day.date.slice(-2))}
                      </span>
                      <strong>{day.rate} €</strong>
                      {references.length > 0 && (
                        <span className="rates-reference-markers" aria-hidden="true">
                          {references.map((reference) => (
                            <i
                              key={`${reference.kind}-${reference.zone ?? "national"}`}
                              data-kind={reference.kind}
                              data-zone={reference.zone}
                            />
                          ))}
                        </span>
                      )}
                    </button>
                  );
                })(),
              )}
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
                  <div className="rates-center-actions">
                    <button
                      type="button"
                      onClick={() => {
                        const rate = season.rates?.[0]?.nightly_rate_cents ?? 0;
                        setEditingSeasonId(season.id);
                        setSeasonDraft({
                          name: season.name,
                          kind: season.kind,
                          startsOn: season.begins_on,
                          endsOn: season.ends_on,
                          nightlyRate: String(rate / 100),
                          minimumNights: String(season.minimum_nights ?? 1),
                        });
                      }}
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const rate = season.rates?.[0]?.nightly_rate_cents ?? 0;
                        setEditingSeasonId(null);
                        setSeasonDraft({
                          name: `${season.name} (copie)`,
                          kind: season.kind,
                          startsOn: season.begins_on,
                          endsOn: season.ends_on,
                          nightlyRate: String(rate / 100),
                          minimumNights: String(season.minimum_nights ?? 1),
                        });
                      }}
                    >
                      Dupliquer
                    </button>
                    <button
                      type="button"
                      className="is-danger"
                      onClick={() => {
                        if (
                          !window.confirm(
                            `Supprimer définitivement « ${season.name} » ?\n\nLes dates retrouveront le tarif standard ou la saison précédente.`,
                          )
                        )
                          return;
                        void mutateCenter(
                          { action: "season-delete", id: season.id },
                          "Saison supprimée et calendrier recalculé.",
                          true,
                        );
                      }}
                    >
                      Supprimer
                    </button>
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
                onClick={() => void saveSeason()}
              >
                {editingSeasonId ? "Enregistrer la saison" : "Créer la saison"}
              </button>
              {editingSeasonId && (
                <button type="button" onClick={() => setEditingSeasonId(null)}>
                  Annuler la modification
                </button>
              )}
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
            <label className="rates-gap-optimization">
              <input
                type="checkbox"
                checked={center.rules.optimize_calendar_gaps ?? true}
                onChange={(event) =>
                  void mutateCenter(
                    { action: "gap-optimization", enabled: event.target.checked },
                    "Optimisation des trous du calendrier mise à jour.",
                  )
                }
              />
              Autoriser un séjour plus court lorsqu’il remplit exactement un trou entre deux
              réservations
            </label>
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
              {center.promotions.length === 0 && (
                <p className="rates-center-note">Aucune promotion.</p>
              )}
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
                  <div className="rates-center-actions">
                    <button
                      type="button"
                      onClick={() => {
                        const range = parseRange(promotion.valid_range);
                        const fallbackYear = new Date().getFullYear();
                        setEditingPromotionId(promotion.id);
                        setPromotionDraft({
                          name: promotion.name,
                          mode: promotion.fixed_discount_cents ? "fixed" : "percentage",
                          value: String(
                            promotion.fixed_discount_cents
                              ? promotion.fixed_discount_cents / 100
                              : promotion.percentage,
                          ),
                          startsOn: range.startsOn || `${fallbackYear}-01-01`,
                          endsOn: range.endsOn || `${fallbackYear}-12-31`,
                        });
                      }}
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const range = parseRange(promotion.valid_range);
                        const fallbackYear = new Date().getFullYear();
                        setEditingPromotionId(null);
                        setPromotionDraft({
                          name: `${promotion.name} (copie)`,
                          mode: promotion.fixed_discount_cents ? "fixed" : "percentage",
                          value: String(
                            promotion.fixed_discount_cents
                              ? promotion.fixed_discount_cents / 100
                              : promotion.percentage,
                          ),
                          startsOn: range.startsOn || `${fallbackYear}-01-01`,
                          endsOn: range.endsOn || `${fallbackYear}-12-31`,
                        });
                      }}
                    >
                      Dupliquer
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        void mutateCenter(
                          {
                            action: "promotion-toggle",
                            id: promotion.id,
                            enabled: !promotion.enabled,
                          },
                          promotion.enabled ? "Promotion désactivée." : "Promotion activée.",
                        )
                      }
                    >
                      {promotion.enabled ? "Désactiver" : "Activer"}
                    </button>
                    <button
                      type="button"
                      className="is-danger"
                      onClick={() => {
                        if (
                          !window.confirm(
                            `Supprimer définitivement cette promotion ?\n\n« ${promotion.name} »\n\nCette action est irréversible.`,
                          )
                        )
                          return;
                        void mutateCenter(
                          { action: "promotion-delete", id: promotion.id },
                          "Promotion supprimée définitivement.",
                        );
                      }}
                    >
                      Supprimer
                    </button>
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
              <button type="button" onClick={() => void savePromotion()}>
                {editingPromotionId ? "Enregistrer la promotion" : "Créer la promotion"}
              </button>
              {editingPromotionId && (
                <button type="button" onClick={() => setEditingPromotionId(null)}>
                  Annuler la modification
                </button>
              )}
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
