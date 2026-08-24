"use client";

import { FormEvent, useEffect, useState } from "react";

type Asset = {
  id: string;
  kind: string;
  bucket: string;
  storage_path: string;
  title: string | null;
  alt_text: string | null;
  tags: string[];
  url?: string;
};

export function MediaLibraryAdmin({
  token,
  notify,
  videosOnly = false,
}: {
  token: string;
  notify: (message: string) => void;
  videosOnly?: boolean;
}) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [busy, setBusy] = useState(false);
  const headers = { Authorization: `Bearer ${token}` };
  const load = async () => {
    const response = await fetch("/api/admin/cms/media", { headers });
    const payload = (await response.json()) as { assets?: Asset[]; error?: string };
    if (!response.ok) return notify(payload.error ?? "Médiathèque indisponible.");
    setAssets((payload.assets ?? []).filter((asset) => !videosOnly || asset.kind === "video"));
  };
  useEffect(() => {
    void load();
  }, [token, videosOnly]); // eslint-disable-line react-hooks/exhaustive-deps
  const upload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    const response = await fetch("/api/admin/cms/media", {
      method: "POST",
      headers,
      body: new FormData(event.currentTarget),
    });
    const payload = (await response.json()) as { error?: string };
    setBusy(false);
    if (!response.ok) return notify(payload.error ?? "Import impossible.");
    event.currentTarget.reset();
    notify("Média ajouté à la photothèque.");
    await load();
  };
  const archive = async (id: string) => {
    if (!window.confirm("Archiver ce média ?")) return;
    await fetch("/api/admin/cms/media", {
      method: "PATCH",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ id, archived: true }),
    });
    notify("Média archivé.");
    await load();
  };
  return (
    <section className="admin-panel">
      <div className="admin-panel__heading">
        <div>
          <p className="eyebrow">Médiathèque V4</p>
          <h2>{videosOnly ? "Vidéos" : "Photothèque"}</h2>
        </div>
        <p>{assets.length} média(s)</p>
      </div>
      <form className="admin-editor" onSubmit={upload}>
        <p>
          Choisissez une photo sur votre ordinateur, puis cliquez sur le bouton de validation. Le
          titre et la description sont préremplis et restent modifiables.
        </p>
        <div className="admin-form-grid">
          <label>
            Fichier
            <input
              name="file"
              type="file"
              required
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                const form = event.currentTarget.form;
                if (!file || !form) return;
                const label = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
                const title = form.elements.namedItem("title") as HTMLInputElement | null;
                const alt = form.elements.namedItem("altText") as HTMLInputElement | null;
                if (title && !title.value) title.value = label;
                if (alt && !alt.value) alt.value = label;
              }}
              accept={
                videosOnly
                  ? "video/mp4,video/webm"
                  : "image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm"
              }
            />
          </label>
          <label>
            Titre
            <input name="title" required />
          </label>
          <label className="wide">
            Texte ALT
            <input name="altText" required={!videosOnly} />
          </label>
          <label>
            Tags
            <input name="tags" placeholder="maison, chambre, été" />
          </label>
        </div>
        <button type="submit" disabled={busy}>
          {busy ? "Import en cours…" : "Valider et ajouter à la photothèque"}
        </button>
      </form>
      <div className="admin-property-grid">
        {assets.map((asset) => {
          const url =
            asset.url ??
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${asset.bucket}/${asset.storage_path}`;
          return (
            <article key={asset.id}>
              {asset.kind === "image" ? (
                <img src={url} alt={asset.alt_text ?? ""} loading="lazy" />
              ) : (
                <video src={url} controls preload="metadata" />
              )}
              <h3>{asset.title}</h3>
              <p>{asset.alt_text || "ALT manquant"}</p>
              <small>{asset.tags.join(" · ")}</small>
              <button type="button" onClick={() => void navigator.clipboard.writeText(url)}>
                Copier l’adresse
              </button>
              <button type="button" onClick={() => void archive(asset.id)}>
                Archiver
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
