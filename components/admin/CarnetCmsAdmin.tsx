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
  const [selected, setSelected] = useState<CarnetEntry | null>(null);
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
        id: selected?.id,
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
        imagePath: data.get("imagePath") || undefined,
        imageAlt: data.get("imageAlt") || undefined,
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
        sortOrder: Number(data.get("sortOrder") ?? 100),
        metaTitle: data.get("metaTitle") || undefined,
        metaDescription: data.get("metaDescription") || undefined,
        openGraphImagePath: data.get("openGraphImagePath") || undefined,
      }),
    });
    const body = (await response.json()) as { error?: string };
    setBusy(false);
    if (!response.ok) return notify(body.error ?? "Enregistrement impossible.");
    event.currentTarget.reset();
    setSelected(null);
    notify("Contenu du Carnet enregistré.");
    await load();
  };

  const remove = async (entry: CarnetEntry) => {
    if (!window.confirm(`Supprimer « ${entry.title} » ?`)) return;
    const response = await fetch(`/api/admin/carnet?id=${entry.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = (await response.json()) as { error?: string };
    if (!response.ok) return notify(body.error ?? "Suppression impossible.");
    if (selected?.id === entry.id) setSelected(null);
    notify("Contenu supprimé.");
    await load();
  };

  const move = async (entry: CarnetEntry, direction: -1 | 1) => {
    const nextOrder = Math.max(0, entry.sortOrder + direction * 10);
    const response = await fetch("/api/admin/carnet", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        id: entry.id,
        slug: entry.slug,
        category: entry.category,
        destination: entry.destination,
        title: entry.title,
        summary: entry.summary,
        body: entry.body,
        address: entry.address || undefined,
        officialUrl: entry.officialUrl || undefined,
        googleMapsUrl: entry.googleMapsUrl || undefined,
        phone: entry.phone || undefined,
        imagePath: entry.imagePath || undefined,
        imageAlt: entry.imageAlt || undefined,
        galleryPaths: entry.galleryPaths,
        videoUrl: entry.videoUrl || undefined,
        openingHours: entry.openingHours,
        openingPeriod: entry.openingPeriod || undefined,
        recommendationLevel: entry.recommendationLevel,
        highlights: entry.highlights,
        hostTip: entry.hostTip || undefined,
        tags: entry.tags,
        featured: entry.featured,
        status: entry.status,
        sortOrder: nextOrder,
        metaTitle: entry.metaTitle || undefined,
        metaDescription: entry.metaDescription || undefined,
        openGraphImagePath: entry.openGraphImagePath || undefined,
      }),
    });
    if (!response.ok) return notify("Réorganisation impossible.");
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
      <form className="admin-editor" key={selected?.id ?? "new"} onSubmit={submit}>
        <div className="admin-form-grid">
          <label>
            Titre
            <input name="title" required minLength={2} defaultValue={selected?.title} />
          </label>
          <label>
            Identifiant
            <input
              name="slug"
              required
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              defaultValue={selected?.slug}
            />
          </label>
          <label>
            Rubrique
            <select name="category" defaultValue={selected?.category ?? "restaurant"}>
              {carnetCategories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>
          <label>
            Destination
            <select name="destination" defaultValue={selected?.destination ?? "ile_de_re"}>
              <option value="ile_de_re">Île de Ré</option>
              <option value="ile_oleron">Île d’Oléron</option>
              <option value="la_rochelle">La Rochelle</option>
              <option value="all">Toutes</option>
            </select>
          </label>
          <label className="wide">
            Résumé
            <textarea name="summary" required minLength={2} defaultValue={selected?.summary} />
          </label>
          <label className="wide">
            Description
            <textarea name="body" defaultValue={selected?.body} />
          </label>
          <label>
            Adresse
            <input name="address" defaultValue={selected?.address} />
          </label>
          <label>
            Site officiel
            <input name="officialUrl" type="url" defaultValue={selected?.officialUrl} />
          </label>
          <label>
            Google Maps
            <input name="googleMapsUrl" type="url" defaultValue={selected?.googleMapsUrl} />
          </label>
          <label>
            Téléphone
            <input name="phone" defaultValue={selected?.phone} />
          </label>
          <label>
            Photo principale
            <input name="imagePath" placeholder="/images/…" defaultValue={selected?.imagePath} />
          </label>
          <label>
            Description de la photo
            <input name="imageAlt" defaultValue={selected?.imageAlt} />
          </label>
          <label>
            Tags
            <input
              name="tags"
              placeholder="famille, pluie, vélo"
              defaultValue={selected?.tags.join(", ")}
            />
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
            <textarea name="hostTip" defaultValue={selected?.hostTip} />
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
            <select name="status" defaultValue={selected?.status ?? "draft"}>
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
              <option value="archived">Archivé</option>
            </select>
          </label>
          <label>
            Ordre d’affichage
            <input
              name="sortOrder"
              type="number"
              min="0"
              defaultValue={selected?.sortOrder ?? 100}
            />
          </label>
          <label>
            <input name="featured" type="checkbox" /> Mettre en avant
          </label>
        </div>
        <button type="submit" disabled={busy}>
          {busy
            ? "Enregistrement…"
            : selected
              ? "Enregistrer les modifications"
              : "Ajouter au Carnet"}
        </button>
        {selected && (
          <button type="button" onClick={() => setSelected(null)}>
            Annuler la modification
          </button>
        )}
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
            <div className="admin-inline-actions">
              <button type="button" onClick={() => setSelected(entry)}>
                Modifier
              </button>
              <button
                type="button"
                onClick={() => void move(entry, -1)}
                aria-label={`Monter ${entry.title}`}
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => void move(entry, 1)}
                aria-label={`Descendre ${entry.title}`}
              >
                ↓
              </button>
              <button type="button" onClick={() => void remove(entry)}>
                Supprimer
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
