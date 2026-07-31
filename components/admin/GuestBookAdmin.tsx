"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import type { GuestBookEntry } from "@/features/guestbook";

const statusLabels = {
  photo_received: "Photo reçue",
  ocr_review: "OCR à vérifier",
  validated: "Validé",
  published: "Publié",
} as const;

export function GuestBookAdmin({
  token,
  notify,
}: {
  token: string;
  notify: (message: string) => void;
}) {
  const [entries, setEntries] = useState<GuestBookEntry[]>([]);
  const [selected, setSelected] = useState<GuestBookEntry | null>(null);
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    const response = await fetch("/api/admin/guestbook", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = (await response.json()) as { entries?: GuestBookEntry[]; error?: string };
    if (!response.ok) return notify(body.error ?? "Livre d’Or indisponible.");
    setEntries(body.entries ?? []);
  }, [notify, token]);
  useEffect(() => {
    void load();
  }, [load]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    const data = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/guestbook", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        id: selected?.id,
        house: data.get("house"),
        date: data.get("date"),
        language: data.get("language"),
        author: data.get("author"),
        text: data.get("text"),
        featured: data.get("featured") === "on",
        tags: String(data.get("tags") ?? "")
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        image: data.get("image") || null,
        status: data.get("status"),
      }),
    });
    const body = (await response.json()) as { error?: string };
    setBusy(false);
    if (!response.ok) return notify(body.error ?? "Enregistrement impossible.");
    setSelected(null);
    notify("Entrée du Livre d’Or enregistrée.");
    await load();
  };

  const remove = async (entry: GuestBookEntry) => {
    if (!window.confirm(`Supprimer l’entrée de ${entry.author} ?`)) return;
    const response = await fetch("/api/admin/guestbook", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ id: entry.id }),
    });
    if (!response.ok) return notify("Suppression impossible.");
    setSelected(null);
    notify("Entrée supprimée.");
    await load();
  };

  return (
    <section className="admin-panel">
      <div className="admin-panel__heading">
        <div>
          <p className="eyebrow">Livre d’Or</p>
          <h2>Souvenirs manuscrits</h2>
        </div>
        <p>{entries.length} entrée(s)</p>
      </div>
      <div className="admin-card guestbook-admin-workflow">
        <strong>Photo</strong>
        <span>→</span>
        <strong>OCR</strong>
        <span>→</span>
        <strong>Validation humaine</strong>
        <span>→</span>
        <strong>Publication</strong>
      </div>
      <form className="admin-editor" key={selected?.id ?? "new"} onSubmit={submit}>
        <div className="admin-form-grid">
          <label>
            Auteur
            <input name="author" required defaultValue={selected?.author} />
          </label>
          <label>
            Date
            <input
              name="date"
              required
              placeholder="2026-03 ou 2026-03-20"
              defaultValue={selected?.date}
            />
          </label>
          <label>
            Maison
            <select name="house" defaultValue={selected?.house ?? "chai-des-tortues"}>
              <option value="chai-des-tortues">Le Chai des Tortues</option>
              <option value="villa-raie-manta">Villa Raie Manta</option>
              <option value="nid-d-ete">Le Nid d’Été</option>
            </select>
          </label>
          <label>
            Langue
            <select name="language" defaultValue={selected?.language ?? "fr"}>
              <option value="fr">Français</option>
              <option value="en">Anglais</option>
              <option value="de">Allemand</option>
              <option value="es">Espagnol</option>
              <option value="nl">Néerlandais</option>
              <option value="other">Autre</option>
            </select>
          </label>
          <label className="wide">
            Transcription
            <textarea name="text" required minLength={2} defaultValue={selected?.text} />
          </label>
          <label>
            Thèmes
            <input
              name="tags"
              placeholder="Accueil, Famille, Retour"
              defaultValue={selected?.tags.join(", ")}
            />
          </label>
          <label>
            Photo source
            <input
              name="image"
              placeholder="/images/livre-d-or/…"
              defaultValue={selected?.image ?? ""}
            />
          </label>
          <label>
            Workflow
            <select name="status" defaultValue={selected?.status ?? "photo_received"}>
              {Object.entries(statusLabels).map(([value, label]) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <input name="featured" type="checkbox" defaultChecked={selected?.featured} /> Mettre en
            avant
          </label>
        </div>
        <div className="admin-form-actions">
          <button type="submit" disabled={busy}>
            {busy ? "Enregistrement…" : selected ? "Mettre à jour" : "Créer l’entrée"}
          </button>
          {selected && (
            <button type="button" onClick={() => setSelected(null)}>
              Annuler
            </button>
          )}
        </div>
      </form>
      <div className="admin-list">
        {entries.map((entry) => (
          <article className="admin-reservation-row" key={entry.id}>
            <div>
              <strong>{entry.author}</strong>
              <span>
                {entry.date} · {entry.house} · {entry.language}
              </span>
            </div>
            <span className="admin-status">{statusLabels[entry.status]}</span>
            <div>
              <button type="button" onClick={() => setSelected(entry)}>
                Modifier
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
