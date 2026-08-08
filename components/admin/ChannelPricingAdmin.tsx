"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const houses = [
  { slug: "nid-d-ete", label: "Le Nid d’Été" },
  { slug: "chai-des-tortues", label: "Le Chai des Tortues" },
  { slug: "villa-raie-manta", label: "Villa Raie Manta" },
] as const;
type House = (typeof houses)[number]["slug"];
type ChannelPrice = {
  nightlyRate: number;
  cleaningFee: number;
  commission: number;
  commissionPercentage: number;
  activePromotions: Array<{ id: string; label: string; percentage: number; discount: number }>;
  promotionDiscount: number;
  estimatedNetRevenue: number;
  manualOverride: boolean;
};
type Day = {
  date: string;
  season: string;
  minimumNights: number;
  cleaningFee: number;
  direct: ChannelPrice;
  airbnb: ChannelPrice;
  booking: ChannelPrice;
  netDifference: { airbnbVsDirect: number; bookingVsDirect: number };
};
type Snapshot = {
  property: { slug: House; name: string };
  start: string;
  end: string;
  days: Day[];
  promotions: Array<{ id: string; label: string; enabled: boolean }>;
};

const iso = (date: Date) => date.toISOString().slice(0, 10);
const rollingDates = () => {
  const start = new Date();
  const exclusive = new Date(start);
  exclusive.setUTCMonth(exclusive.getUTCMonth() + 12);
  exclusive.setUTCDate(exclusive.getUTCDate() - 1);
  return { start: iso(start), end: iso(exclusive) };
};
const initialEnd = () => {
  const value = new Date();
  value.setUTCDate(value.getUTCDate() + 30);
  return iso(value) > rollingDates().end ? rollingDates().end : iso(value);
};
const euro = (value: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);

export function ChannelPricingAdmin({
  token,
  notify,
}: {
  token: string;
  notify: (message: string) => void;
}) {
  const allowedDates = useMemo(rollingDates, []);
  const [property, setProperty] = useState<House>("nid-d-ete");
  const [start, setStart] = useState(iso(new Date()));
  const [end, setEnd] = useState(initialEnd);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [bulkPrice, setBulkPrice] = useState("");
  const [bulkMinimum, setBulkMinimum] = useState("");
  const [busy, setBusy] = useState(false);
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const load = useCallback(async () => {
    setBusy(true);
    const response = await fetch(
      `/api/admin/pricing-channels?property=${property}&start=${start}&end=${end}`,
      { headers, cache: "no-store" },
    );
    const payload = (await response.json()) as Snapshot & { error?: string };
    setBusy(false);
    if (!response.ok) return notify(payload.error ?? "Tarifs & Canaux indisponible.");
    setSnapshot(payload);
    setSelectedDate((current) =>
      current && payload.days.some((day) => day.date === current)
        ? current
        : (payload.days[0]?.date ?? null),
    );
  }, [end, headers, notify, property, start]);
  useEffect(() => {
    void load();
  }, [load]);

  const mutate = async (body: Record<string, unknown>, success: string) => {
    setBusy(true);
    const response = await fetch("/api/admin/pricing-channels", {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const payload = (await response.json()) as { error?: string };
    setBusy(false);
    if (!response.ok) return notify(payload.error ?? "Modification impossible.");
    notify(success);
    await load();
  };
  const applyBulk = async () => {
    const nightlyRate = Number(bulkPrice.replace(",", "."));
    const minimumNights = bulkMinimum ? Number(bulkMinimum) : undefined;
    if (!snapshot || !Number.isFinite(nightlyRate) || nightlyRate <= 0)
      return notify("Indiquez un prix valide.");
    await mutate(
      {
        action: "master-bulk",
        propertySlug: property,
        entries: snapshot.days.map((day) => ({
          date: day.date,
          nightlyRate,
          ...(minimumNights ? { minimumNights } : {}),
        })),
      },
      `Tarif maître appliqué à ${snapshot.days.length} date(s). Airbnb et Booking ont été recalculés.`,
    );
  };
  const editMaster = async (day: Day) => {
    const value = window.prompt(
      `Nouveau tarif Beaux Rivages pour le ${day.date}`,
      String(day.direct.nightlyRate),
    );
    if (!value) return;
    const nightlyRate = Number(value.replace(",", "."));
    if (!Number.isFinite(nightlyRate) || nightlyRate <= 0) return notify("Prix invalide.");
    await mutate(
      {
        action: "master-bulk",
        propertySlug: property,
        entries: [{ date: day.date, nightlyRate, minimumNights: day.minimumNights }],
      },
      "Tarif maître modifié et canaux recalculés.",
    );
  };
  const override = async (day: Day, channel: "airbnb" | "booking") => {
    const current = day[channel];
    if (current.manualOverride)
      return mutate(
        { action: "channel-override-delete", propertySlug: property, channel, date: day.date },
        `Surcharge ${channel} supprimée : retour au calcul automatique.`,
      );
    const value = window.prompt(
      `Tarif manuel ${channel} pour le ${day.date}`,
      String(current.nightlyRate),
    );
    if (!value) return;
    const nightlyRate = Number(value.replace(",", "."));
    if (!Number.isFinite(nightlyRate) || nightlyRate <= 0) return notify("Prix invalide.");
    await mutate(
      {
        action: "channel-override",
        propertySlug: property,
        channel,
        date: day.date,
        nightlyRate,
        reason: "Surcharge depuis Tarifs & Canaux",
      },
      `Surcharge ${channel} enregistrée.`,
    );
  };
  const selected = snapshot?.days.find((day) => day.date === selectedDate) ?? null;

  return (
    <section className="admin-panel channel-pricing">
      <div className="admin-panel__heading">
        <div>
          <p className="eyebrow">Source maître privée</p>
          <h2>Tarifs & Canaux</h2>
        </div>
        <p>Comparaisons visibles uniquement dans l’administration · aucune connexion plateforme</p>
      </div>
      <div className="channel-pricing__filters">
        <label>
          Maison
          <select value={property} onChange={(event) => setProperty(event.target.value as House)}>
            {houses.map((house) => (
              <option key={house.slug} value={house.slug}>
                {house.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Du
          <input
            type="date"
            min={allowedDates.start}
            max={allowedDates.end}
            value={start}
            onChange={(event) => setStart(event.target.value)}
          />
        </label>
        <label>
          Au
          <input
            type="date"
            min={start > allowedDates.start ? start : allowedDates.start}
            max={allowedDates.end}
            value={end}
            onChange={(event) => setEnd(event.target.value)}
          />
        </label>
        <button type="button" disabled={busy} onClick={() => void load()}>
          {busy ? "Chargement…" : "Afficher la période"}
        </button>
      </div>
      <div className="channel-pricing__bulk">
        <strong>Modification en masse de la période affichée</strong>
        <label>
          Prix maître / nuit
          <input
            inputMode="decimal"
            value={bulkPrice}
            onChange={(event) => setBulkPrice(event.target.value)}
            placeholder="470"
          />
        </label>
        <label>
          Minimum de nuits
          <input
            inputMode="numeric"
            value={bulkMinimum}
            onChange={(event) => setBulkMinimum(event.target.value)}
            placeholder="Conserver"
          />
        </label>
        <button
          type="button"
          disabled={busy || !snapshot?.days.length}
          onClick={() => void applyBulk()}
        >
          Appliquer à {snapshot?.days.length ?? 0} date(s)
        </button>
      </div>
      <div className="channel-pricing__calendar" aria-label="Calendrier des tarifs">
        {snapshot?.days.map((day) => (
          <button
            type="button"
            key={day.date}
            className={selectedDate === day.date ? "active" : ""}
            onClick={() => setSelectedDate(day.date)}
          >
            <span>
              {new Date(`${day.date}T12:00:00Z`).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "short",
              })}
            </span>
            <strong>{euro(day.direct.nightlyRate)}</strong>
            <small>
              {day.minimumNights} nuit(s)
              {day.airbnb.manualOverride || day.booking.manualOverride ? " · surcharge" : ""}
            </small>
          </button>
        ))}
      </div>
      {selected && (
        <div className="channel-pricing__detail">
          <header>
            <div>
              <p className="eyebrow">
                {selected.date} · {selected.season}
              </p>
              <h3>Comparaison privée des revenus</h3>
            </div>
            <button type="button" onClick={() => void editMaster(selected)}>
              Modifier le prix maître
            </button>
          </header>
          <div className="channel-pricing__cards">
            <article>
              <h4>Beaux Rivages</h4>
              <strong>{euro(selected.direct.nightlyRate)} / nuit</strong>
              <dl>
                <div>
                  <dt>Ménage / séjour</dt>
                  <dd>{euro(selected.cleaningFee)}</dd>
                </div>
                <div>
                  <dt>Minimum</dt>
                  <dd>{selected.minimumNights} nuit(s)</dd>
                </div>
                <div>
                  <dt>Commission</dt>
                  <dd>{euro(0)}</dd>
                </div>
                <div>
                  <dt>Revenu net estimé</dt>
                  <dd>{euro(selected.direct.estimatedNetRevenue)}</dd>
                </div>
              </dl>
            </article>
            <article>
              <h4>Airbnb {selected.airbnb.manualOverride ? <em>Surcharge manuelle</em> : null}</h4>
              <strong>{euro(selected.airbnb.nightlyRate)} / nuit</strong>
              <dl>
                <div>
                  <dt>Ménage / séjour</dt>
                  <dd>{euro(selected.cleaningFee)}</dd>
                </div>
                <div>
                  <dt>Commission estimée ({selected.airbnb.commissionPercentage} %)</dt>
                  <dd>{euro(selected.airbnb.commission)}</dd>
                </div>
                <div>
                  <dt>Revenu net estimé</dt>
                  <dd>{euro(selected.airbnb.estimatedNetRevenue)}</dd>
                </div>
                <div>
                  <dt>Écart vs direct</dt>
                  <dd>{euro(selected.netDifference.airbnbVsDirect)}</dd>
                </div>
              </dl>
              <button type="button" onClick={() => void override(selected, "airbnb")}>
                {selected.airbnb.manualOverride ? "Supprimer la surcharge" : "Surcharge manuelle"}
              </button>
            </article>
            <article>
              <h4>
                Booking {selected.booking.manualOverride ? <em>Surcharge manuelle</em> : null}
              </h4>
              <strong>{euro(selected.booking.nightlyRate)} / nuit</strong>
              <dl>
                <div>
                  <dt>Ménage / séjour</dt>
                  <dd>{euro(selected.cleaningFee)}</dd>
                </div>
                <div>
                  <dt>Commission estimée ({selected.booking.commissionPercentage} %)</dt>
                  <dd>{euro(selected.booking.commission)}</dd>
                </div>
                <div>
                  <dt>Promotions actives</dt>
                  <dd>
                    {selected.booking.activePromotions.length
                      ? selected.booking.activePromotions
                          .map((promotion) => `${promotion.label} −${promotion.percentage}%`)
                          .join(" · ")
                      : "Aucune"}
                  </dd>
                </div>
                <div>
                  <dt>Revenu net estimé</dt>
                  <dd>{euro(selected.booking.estimatedNetRevenue)}</dd>
                </div>
                <div>
                  <dt>Écart vs direct</dt>
                  <dd>{euro(selected.netDifference.bookingVsDirect)}</dd>
                </div>
              </dl>
              <button type="button" onClick={() => void override(selected, "booking")}>
                {selected.booking.manualOverride ? "Supprimer la surcharge" : "Surcharge manuelle"}
              </button>
            </article>
          </div>
        </div>
      )}
    </section>
  );
}
