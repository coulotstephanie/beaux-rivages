"use client";

import { FormEvent, useEffect, useState } from "react";
import type { CarnetEntry } from "@/features/carnet";
import { carnetCategories } from "@/features/carnet";

export function CarnetCmsAdmin({
  token,
  notify,
}: {
  token: string;
  notify: (message: string) => void;
}) {
  const [entries, setEntries] = useState<CarnetEntry[]>([]);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const response = await fetch("/api/admin/carnet", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = (await response.json()) as { entries?: CarnetEntry[]; error?: string };
    if (!response.ok) return notify(body.error ?? "Carnet indisponible.");
    setEntries(body.entries ?? []);
  };

  useEffect(() => {
    void load();
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    const data = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/carnet", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: data.get("slug"),
        category: data.get("category"),
        destination: data.get("destination"),
        title: data.get("title"),
        summary: data.get("summary"),
        body: data.get("body"),
        address: data.get("address") || undefined,
        officialUrl: data.get("officialUrl") || undefined,
        googleMapsUrl: data.get("googleMapsUrl") || undefined,
        phone: data.get("phone") || undefined,
        hostTip: data.get("hostTip") || undefined,
        galleryPaths: String(data.get("galleryPaths") ?? "")
          .split(",")
          .map((path) => path.trim())
          .filter(Boolean),
        videoUrl: data.get("videoUrl") || undefined,
        openingPeriod: data.get("openingPeriod") || undefined,
        openingHours: {},
        recommendationLevel: Number(data.get("recommendationLevel") ?? 0),
        highlights: data.getAll("highlights"),
        tags: String(data.get("tags") ?? "")
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        featured: data.get("featured") === "on",
        status: data.get("status"),
        metaTitle: data.get("metaTitle") || undefined,
        metaDescription: data.get("metaDescription") || undefined,
        openGraphImagePath: data.get("openGraphImagePath") || undefined,
      }),
    });
    const body = (await response.json()) as { error?: string };
    setBusy(false);
    if (!response.ok) return notify(body.error ?? "Enregistrement impossible.");
    event.currentTarget.reset();
    notify("Contenu du Carnet enregistré.");
    await load();
  };

  return (
    <section className="admin-panel">
      <div className="admin-panel__heading">
        <div>
          <p className="eyebrow">Carnet Beaux Rivages</p>
          <h2>Contenus voyageurs</h2>
        </div>
        <p>{entries.length} contenu(s)</p>
      </div>
      <form className="admin-editor" onSubmit={submit}>
        <div className="admin-form-grid">
          <label>
            Titre
            <input name="title" required minLength={2} />
          </label>
          <label>
            Identifiant
            <input name="slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" />
          </label>
          <label>
            Rubrique
            <select name="category">
              {carnetCategories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>
          <label>
            Destination
            <select name="destination">
              <option value="ile_de_re">Île de Ré</option>
              <option value="ile_oleron">Île d’Oléron</option>
              <option value="la_rochelle">La Rochelle</option>
              <option value="all">Toutes</option>
            </select>
          </label>
          <label className="wide">
            Résumé
            <textarea name="summary" required minLength={2} />
          </label>
          <label className="wide">
            Description
            <textarea name="body" />
          </label>
          <label>
            Adresse
            <input name="address" />
          </label>
          <label>
            Site officiel
            <input name="officialUrl" type="url" />
          </label>
          <label>
            Google Maps
            <input name="googleMapsUrl" type="url" />
          </label>
          <label>
            Téléphone
            <input name="phone" />
          </label>
          <label>
            Tags
            <input name="tags" placeholder="famille, pluie, vélo" />
          </label>
          <label>
            Galerie média
            <input name="galleryPaths" placeholder="/images/… , /images/…" />
          </label>
          <label>
            Vidéo
            <input name="videoUrl" type="url" />
          </label>
          <label>
            Période et horaires
            <input name="openingPeriod" placeholder="Avril à octobre · 9 h–19 h" />
          </label>
          <label>
            Recommandation
            <select name="recommendationLevel">
              {[0, 1, 2, 3, 4, 5].map((level) => (
                <option key={level} value={level}>
                  {level}/5
                </option>
              ))}
            </select>
          </label>
          <label className="wide">
            Conseil de Stéphanie & Bruno
            <textarea name="hostTip" />
          </label>
          <fieldset className="wide">
            <legend>Mises en avant</legend>
            {[
              ["stephanie_favorite", "Coup de cœur Stéphanie"],
              ["bruno_favorite", "Coup de cœur Bruno"],
              ["must_see", "Incontournable"],
              ["family", "Idéal en famille"],
              ["rainy_day", "Jour de pluie"],
              ["sunset", "Coucher de soleil"],
              ["bike_accessible", "Accessible à vélo"],
            ].map(([value, label]) => (
              <label key={value}>
                <input name="highlights" type="checkbox" value={value} /> {label}
              </label>
            ))}
          </fieldset>
          <label>
            Meta-title
            <input name="metaTitle" maxLength={70} />
          </label>
          <label>
            Image Open Graph
            <input name="openGraphImagePath" />
          </label>
          <label className="wide">
            Meta-description
            <textarea name="metaDescription" maxLength={170} />
          </label>
          <label>
            Publication
            <select name="status">
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
              <option value="archived">Archivé</option>
            </select>
          </label>
          <label>
            <input name="featured" type="checkbox" /> Mettre en avant
          </label>
        </div>
        <button type="submit" disabled={busy}>
          {busy ? "Enregistrement…" : "Ajouter au Carnet"}
        </button>
      </form>
      <div className="admin-list">
        {entries.map((entry) => (
          <article className="admin-reservation-row" key={entry.id}>
            <div>
              <strong>{entry.title}</strong>
              <span>
                {entry.category} · {entry.destination}
              </span>
            </div>
            <span className="admin-status">{entry.status}</span>
            <small>v{entry.version}</small>
          </article>
        ))}
      </div>
    </section>
  );
}
