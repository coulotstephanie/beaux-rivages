"use client";

import { FormEvent, useEffect, useState } from "react";

type Setting = {
  id: string;
  propertyName: string;
  propertySlug: string;
  municipality: string;
  intercommunality: string;
  accommodationCategory: string;
  classification: "unclassified" | "1" | "2" | "3" | "4" | "5";
  calculationMode: "proportional" | "fixed";
  rateValue: number;
  additionalRatePercent: number;
  nightlyCapCents: number;
  effectiveFrom: string;
  effectiveTo: string | null;
  enabled: boolean;
  sourceUrl: string | null;
};

type FinancialSettings = {
  depositPercentage: number;
  fullPaymentThresholdDays: number;
  balanceDueDays: number;
  securityDepositCents: number;
};

export function FiscalityAdmin({
  token,
  notify,
}: {
  token: string;
  notify: (value: string) => void;
}) {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [financial, setFinancial] = useState<FinancialSettings | null>(null);
  const [busy, setBusy] = useState(true);
  const load = async () => {
    setBusy(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [taxResponse, financialResponse] = await Promise.all([
        fetch("/api/admin/tourist-tax", { headers }),
        fetch("/api/admin/financial-settings", { headers }),
      ]);
      const [taxBody, financialBody] = await Promise.all([
        taxResponse.json(),
        financialResponse.json(),
      ]);
      if (!taxResponse.ok) return notify(taxBody.error ?? "Fiscalité indisponible.");
      if (!financialResponse.ok)
        return notify(financialBody.error ?? "Paramètres financiers indisponibles.");
      setSettings(taxBody.settings);
      setFinancial(financialBody.settings);
    } finally {
      setBusy(false);
    }
  };
  const saveFinancial = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!financial) return;
    setBusy(true);
    try {
      const response = await fetch("/api/admin/financial-settings", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(financial),
      });
      const body = await response.json();
      if (!response.ok) return notify(body.error ?? "Enregistrement impossible.");
      setFinancial(body.settings);
      notify("Règles financières enregistrées.");
    } finally {
      setBusy(false);
    }
  };
  useEffect(() => {
    void load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const save = async (event: FormEvent<HTMLFormElement>, setting: Setting) => {
    event.preventDefault();
    setBusy(true);
    try {
      const response = await fetch("/api/admin/tourist-tax", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(setting),
      });
      const body = await response.json();
      if (!response.ok) return notify(body.error ?? "Enregistrement impossible.");
      setSettings(body.settings);
      notify("Paramètres de taxe de séjour enregistrés.");
    } finally {
      setBusy(false);
    }
  };
  const update = (id: string, patch: Partial<Setting>) =>
    setSettings((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );

  return (
    <section className="admin-panel">
      <div className="admin-panel__heading">
        <div>
          <p className="eyebrow">Fiscalité</p>
          <h2>Taxe de séjour</h2>
        </div>
        <a className="button" href="/api/admin/export?entity=tourist_tax">
          Exporter la déclaration
        </a>
      </div>
      <p>
        Les paramètres sont historisés par logement. Le montant enregistré lors d’une réservation
        reste figé.
      </p>
      {financial ? (
        <form className="admin-card" onSubmit={(event) => void saveFinancial(event)}>
          <h3>Conditions de paiement</h3>
          <p>Ces règles s’appliquent uniquement aux nouvelles réservations.</p>
          <label>
            Acompte à la réservation (%)
            <input
              type="number"
              min="0"
              max="100"
              value={financial.depositPercentage}
              onChange={(event) =>
                setFinancial({ ...financial, depositPercentage: Number(event.target.value) })
              }
            />
          </label>
          <label>
            Paiement intégral à partir de J-
            <input
              type="number"
              min="0"
              max="365"
              value={financial.fullPaymentThresholdDays}
              onChange={(event) =>
                setFinancial({
                  ...financial,
                  fullPaymentThresholdDays: Number(event.target.value),
                })
              }
            />
          </label>
          <label>
            Échéance du solde à J-
            <input
              type="number"
              min="0"
              max="365"
              value={financial.balanceDueDays}
              onChange={(event) =>
                setFinancial({ ...financial, balanceDueDays: Number(event.target.value) })
              }
            />
          </label>
          <p className="admin-form-note">Aucun dépôt de garantie n’est demandé.</p>
          <button disabled={busy} type="submit">
            Enregistrer les règles financières
          </button>
        </form>
      ) : null}
      <div className="admin-card-grid">
        {settings.map((setting) => (
          <form
            className="admin-card"
            key={setting.id}
            onSubmit={(event) => void save(event, setting)}
          >
            <h3>{setting.propertyName}</h3>
            <label>
              Commune
              <input
                value={setting.municipality}
                onChange={(e) => update(setting.id, { municipality: e.target.value })}
              />
            </label>
            <label>
              Intercommunalité
              <input
                value={setting.intercommunality}
                onChange={(e) => update(setting.id, { intercommunality: e.target.value })}
              />
            </label>
            <label>
              Catégorie
              <input
                value={setting.accommodationCategory}
                onChange={(e) => update(setting.id, { accommodationCategory: e.target.value })}
              />
            </label>
            <label>
              Classement
              <select
                value={setting.classification}
                onChange={(e) =>
                  update(setting.id, {
                    classification: e.target.value as Setting["classification"],
                  })
                }
              >
                <option value="unclassified">Non classé</option>
                {[1, 2, 3, 4, 5].map((star) => (
                  <option key={star} value={star}>
                    {star}★
                  </option>
                ))}
              </select>
            </label>
            <label>
              Type de calcul
              <select
                value={setting.calculationMode}
                onChange={(e) =>
                  update(setting.id, {
                    calculationMode: e.target.value as Setting["calculationMode"],
                  })
                }
              >
                <option value="proportional">Tarif proportionnel</option>
                <option value="fixed">Tarif fixe classé</option>
              </select>
            </label>
            <label>
              {setting.calculationMode === "proportional"
                ? "Taux (%)"
                : "Tarif (€ / adulte / nuit)"}
              <input
                type="number"
                min="0"
                step="0.01"
                value={setting.rateValue}
                onChange={(e) => update(setting.id, { rateValue: Number(e.target.value) })}
              />
            </label>
            <label>
              Taxes additionnelles (%)
              <input
                type="number"
                min="0"
                step="0.01"
                value={setting.additionalRatePercent}
                onChange={(e) =>
                  update(setting.id, { additionalRatePercent: Number(e.target.value) })
                }
              />
            </label>
            <label>
              Plafond par adulte et par nuit (€)
              <input
                type="number"
                min="0"
                step="0.01"
                value={setting.nightlyCapCents / 100}
                onChange={(e) =>
                  update(setting.id, { nightlyCapCents: Math.round(Number(e.target.value) * 100) })
                }
              />
            </label>
            <label>
              Date d’effet
              <input
                type="date"
                value={setting.effectiveFrom}
                onChange={(e) => update(setting.id, { effectiveFrom: e.target.value })}
              />
            </label>
            <label>
              <input
                type="checkbox"
                checked={setting.enabled}
                onChange={(e) => update(setting.id, { enabled: e.target.checked })}
              />{" "}
              Paramètre actif
            </label>
            <button disabled={busy} type="submit">
              Enregistrer
            </button>
          </form>
        ))}
      </div>
      {!busy && settings.length === 0 ? <p>Aucun paramètre fiscal configuré.</p> : null}
    </section>
  );
}
