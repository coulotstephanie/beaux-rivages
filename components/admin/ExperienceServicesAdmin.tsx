"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
type ExperienceRow = {
  id: string;
  code: string;
  label: string;
  description: string;
  price_cents: number;
  enabled: boolean;
  image_path: string | null;
  gallery_paths: string[];
  translations: Record<string, unknown>;
  content: Record<string, unknown>;
  availability: Record<string, unknown>;
  sort_order: number;
};
type RequestRow = {
  id: string;
  experience_code: string;
  name: string;
  email: string;
  phone: string;
  desired_date: string;
  property_slug: string;
  budget: string | null;
  project_description: string;
  status: string;
  created_at: string;
};

export function ExperienceServicesAdmin({
  token,
  notify,
}: {
  token: string;
  notify: (message: string) => void;
}) {
  const [experiences, setExperiences] = useState<ExperienceRow[]>([]);
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [selected, setSelected] = useState<ExperienceRow | null>(null);
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    const response = await fetch("/api/admin/experiences", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = (await response.json()) as {
      experiences?: ExperienceRow[];
      requests?: RequestRow[];
      error?: string;
    };
    if (!response.ok) return notify(body.error ?? "Expériences indisponibles.");
    setExperiences(body.experiences ?? []);
    setRequests(body.requests ?? []);
  }, [notify, token]);
  useEffect(() => {
    void load();
  }, [load]);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    const data = new FormData(event.currentTarget);
    const parseJson = (name: string) => {
      try {
        return JSON.parse(String(data.get(name) || "{}"));
      } catch {
        return {};
      }
    };
    const response = await fetch("/api/admin/experiences", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        id: selected?.id,
        code: data.get("code"),
        label: data.get("label"),
        description: data.get("description"),
        priceCents: Math.round(Number(data.get("price")) * 100),
        enabled: data.get("enabled") === "on",
        imagePath: data.get("imagePath") || null,
        galleryPaths: String(data.get("galleryPaths") || "")
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean),
        translations: parseJson("translations"),
        content: parseJson("content"),
        availability: parseJson("availability"),
        sortOrder: Number(data.get("sortOrder")),
      }),
    });
    setBusy(false);
    if (!response.ok) return notify("Enregistrement impossible.");
    setSelected(null);
    notify("Expérience enregistrée.");
    await load();
  };
  const updateStatus = async (requestId: string, status: string) => {
    const response = await fetch("/api/admin/experiences", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, status }),
    });
    if (!response.ok) return notify("Statut non modifié.");
    await load();
  };
  return (
    <section className="admin-panel">
      <div className="admin-panel__heading">
        <div>
          <p className="eyebrow">Expériences & Services</p>
          <h2>Catalogue d’hospitalité</h2>
        </div>
        <p>{experiences.length} expérience(s)</p>
      </div>
      <form className="admin-editor" key={selected?.id ?? "new"} onSubmit={submit}>
        <div className="admin-form-grid">
          <label>
            Nom
            <input name="label" required defaultValue={selected?.label} />
          </label>
          <label>
            Code
            <input name="code" required pattern="[a-z0-9-]+" defaultValue={selected?.code} />
          </label>
          <label>
            Prix en euros
            <input
              name="price"
              required
              type="number"
              min="0"
              step="0.01"
              defaultValue={selected ? selected.price_cents / 100 : 0}
            />
          </label>
          <label>
            Ordre
            <input
              name="sortOrder"
              required
              type="number"
              min="0"
              defaultValue={selected?.sort_order ?? 100}
            />
          </label>
          <label className="wide">
            Description
            <textarea name="description" required defaultValue={selected?.description} />
          </label>
          <label>
            Image principale
            <input name="imagePath" defaultValue={selected?.image_path ?? ""} />
          </label>
          <label>
            Galerie
            <input name="galleryPaths" defaultValue={selected?.gallery_paths?.join(", ")} />
          </label>
          <label className="wide">
            Traductions JSON
            <textarea
              name="translations"
              defaultValue={JSON.stringify(selected?.translations ?? {}, null, 2)}
            />
          </label>
          <label className="wide">
            Contenu JSON
            <textarea
              name="content"
              defaultValue={JSON.stringify(selected?.content ?? {}, null, 2)}
            />
          </label>
          <label>
            Disponibilité JSON
            <textarea
              name="availability"
              defaultValue={JSON.stringify(
                selected?.availability ?? { mode: "on_request" },
                null,
                2,
              )}
            />
          </label>
          <label>
            <input name="enabled" type="checkbox" defaultChecked={selected?.enabled ?? true} />{" "}
            Expérience active
          </label>
        </div>
        <div className="admin-form-actions">
          <button type="submit" disabled={busy}>
            {busy ? "Enregistrement…" : selected ? "Mettre à jour" : "Créer"}
          </button>
          {selected && (
            <button type="button" onClick={() => setSelected(null)}>
              Annuler
            </button>
          )}
        </div>
      </form>
      <div className="admin-list">
        {experiences.map((experience) => (
          <article className="admin-reservation-row" key={experience.id}>
            <div>
              <strong>{experience.label}</strong>
              <span>
                {experience.code} · {(experience.price_cents / 100).toLocaleString("fr-FR")} €
              </span>
            </div>
            <span className="admin-status">{experience.enabled ? "Active" : "Masquée"}</span>
            <button type="button" onClick={() => setSelected(experience)}>
              Modifier
            </button>
          </article>
        ))}
      </div>
      <div className="admin-panel__heading">
        <div>
          <p className="eyebrow">Demandes sur mesure</p>
          <h2>Projets à accompagner</h2>
        </div>
        <p>{requests.length} demande(s)</p>
      </div>
      <div className="admin-list">
        {requests.map((item) => (
          <article className="admin-reservation-row" key={item.id}>
            <div>
              <strong>
                {item.name} · {item.experience_code}
              </strong>
              <span>
                {item.desired_date} · {item.property_slug} · {item.email} · {item.phone}
              </span>
              <p>{item.project_description}</p>
            </div>
            <select
              aria-label={`Statut de la demande de ${item.name}`}
              value={item.status}
              onChange={(event) => void updateStatus(item.id, event.target.value)}
            >
              <option value="new">Nouvelle</option>
              <option value="contacted">Contactée</option>
              <option value="proposal_sent">Devis envoyé</option>
              <option value="accepted">Acceptée</option>
              <option value="declined">Refusée</option>
              <option value="cancelled">Annulée</option>
            </select>
          </article>
        ))}
      </div>
    </section>
  );
}
