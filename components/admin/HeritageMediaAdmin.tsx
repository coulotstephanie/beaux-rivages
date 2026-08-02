"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { heritageSites } from "@/content/patrimoine";
import type { HeritageMedia } from "@/platform/heritage/media";

export function HeritageMediaAdmin({
  token,
  notify,
}: {
  token: string;
  notify: (message: string) => void;
}) {
  const [media, setMedia] = useState<HeritageMedia[]>([]);
  const [siteSlug, setSiteSlug] = useState(heritageSites[0].slug);
  const [busy, setBusy] = useState(false);
  const load = async () => {
    const response = await fetch("/api/admin/heritage-media", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = (await response.json()) as { media?: HeritageMedia[]; error?: string };
    if (!response.ok) return notify(body.error ?? "Photothèque Patrimoine indisponible.");
    setMedia(body.media ?? []);
  };
  useEffect(() => {
    void load();
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps
  const upload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    const response = await fetch("/api/admin/heritage-media", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: new FormData(event.currentTarget),
    });
    const body = (await response.json()) as { error?: string };
    setBusy(false);
    if (!response.ok) return notify(body.error ?? "Ajout impossible.");
    event.currentTarget.reset();
    notify("Photo Patrimoine ajoutée.");
    await load();
  };
  const update = async (item: HeritageMedia, changes: Partial<HeritageMedia>) => {
    const next = { ...item, ...changes };
    const response = await fetch("/api/admin/heritage-media", {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        id: next.id,
        siteSlug: next.siteSlug,
        altText: next.alt,
        caption: next.caption,
        sortOrder: next.sortOrder,
        isCover: next.isCover,
        status: next.status,
      }),
    });
    if (!response.ok) return notify("Modification impossible.");
    notify("Photothèque mise à jour.");
    await load();
  };
  const remove = async (item: HeritageMedia) => {
    if (!window.confirm("Supprimer définitivement cette photo ?")) return;
    const response = await fetch(`/api/admin/heritage-media?id=${item.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return notify("Suppression impossible.");
    notify("Photo supprimée.");
    await load();
  };
  const visible = media.filter((item) => item.siteSlug === siteSlug);
  return (
    <section className="admin-panel">
      <div className="admin-panel__heading">
        <div>
          <p className="eyebrow">Photothèque officielle</p>
          <h2>Patrimoine</h2>
        </div>
        <p>{visible.length} photo(s)</p>
      </div>
      <p>
        Ajoutez vos photos personnelles, choisissez la couverture, renseignez la légende et l’ALT,
        puis organisez la galerie sans modifier le site.
      </p>
      <form className="admin-editor" encType="multipart/form-data" onSubmit={upload}>
        <div className="admin-form-grid">
          <label>
            Lieu
            <select
              name="siteSlug"
              value={siteSlug}
              onChange={(event) => setSiteSlug(event.target.value)}
            >
              {heritageSites.map((site) => (
                <option key={site.slug} value={site.slug}>
                  {site.title}
                </option>
              ))}
            </select>
          </label>
          <label>
            Photo
            <input name="photo" type="file" accept="image/jpeg,image/png,image/webp" required />
          </label>
          <label className="wide">
            Texte alternatif SEO
            <input
              name="altText"
              minLength={3}
              maxLength={300}
              required
              placeholder="Décrivez précisément ce que montre la photo"
            />
          </label>
          <label className="wide">
            Légende
            <input name="caption" maxLength={500} />
          </label>
          <label>
            Ordre
            <input name="sortOrder" type="number" min="0" max="10000" defaultValue="100" />
          </label>
          <label>
            <input name="isCover" type="checkbox" /> Photo principale
          </label>
        </div>
        <button disabled={busy}>{busy ? "Téléversement…" : "Ajouter la photo"}</button>
      </form>
      <label>
        Afficher le lieu
        <select value={siteSlug} onChange={(event) => setSiteSlug(event.target.value)}>
          {heritageSites.map((site) => (
            <option key={site.slug} value={site.slug}>
              {site.title}
            </option>
          ))}
        </select>
      </label>
      <div className="admin-media-grid">
        {visible.map((item) => (
          <article key={item.id}>
            <div className="admin-media-grid__image">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="260px"
                unoptimized={item.src.startsWith("http")}
              />
            </div>
            <label>
              ALT
              <input
                defaultValue={item.alt}
                onBlur={(event) => {
                  if (event.target.value !== item.alt)
                    void update(item, { alt: event.target.value });
                }}
              />
            </label>
            <label>
              Légende
              <input
                defaultValue={item.caption}
                onBlur={(event) => {
                  if (event.target.value !== item.caption)
                    void update(item, { caption: event.target.value });
                }}
              />
            </label>
            <div className="admin-inline-actions">
              <button
                type="button"
                onClick={() => void update(item, { sortOrder: Math.max(0, item.sortOrder - 10) })}
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => void update(item, { sortOrder: item.sortOrder + 10 })}
              >
                ↓
              </button>
              <button
                type="button"
                disabled={item.isCover}
                onClick={() => void update(item, { isCover: true })}
              >
                {item.isCover ? "Photo principale" : "Choisir en couverture"}
              </button>
              <button type="button" onClick={() => void remove(item)}>
                Supprimer
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
