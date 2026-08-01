"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { legalDocuments, legalVersion } from "@/content/legal";

type Section = [string, string];
type LegalVersion = {
  id: string;
  documentKey: string;
  title: string;
  description: string;
  sections: Section[];
  version: string;
  effectiveFrom: string;
  published: boolean;
  createdAt: string;
};
const labels: Record<string, string> = {
  cgv: "Conditions Générales de Vente",
  mentions: "Mentions légales",
  privacy: "Confidentialité",
  cookies: "Cookies",
  cgu: "Conditions Générales d’Utilisation",
  cancellation: "Annulation",
  refunds: "Remboursement",
  quality: "Charte qualité",
  environment: "Environnement",
  animals: "Charte Animaux",
  neighborhood: "Bon voisinage",
  accessibility: "Accessibilité",
  legalFaq: "FAQ juridique",
};

export function LegalCenterAdmin({
  token,
  notify,
}: {
  token: string;
  notify: (value: string) => void;
}) {
  const keys = Object.keys(legalDocuments) as (keyof typeof legalDocuments)[];
  const [documentKey, setDocumentKey] = useState<string>(keys[0]);
  const fallback = legalDocuments[documentKey as keyof typeof legalDocuments] ?? legalDocuments.cgv;
  const [title, setTitle] = useState<string>(fallback.title);
  const [description, setDescription] = useState<string>(fallback.description);
  const [sectionsText, setSectionsText] = useState(
    fallback.sections.map(([heading, body]) => `${heading}\n${body}`).join("\n\n---\n\n"),
  );
  const [version, setVersion] = useState(legalVersion);
  const [effectiveFrom, setEffectiveFrom] = useState(new Date().toISOString().slice(0, 10));
  const [publish, setPublish] = useState(false);
  const [history, setHistory] = useState<LegalVersion[]>([]);
  const [busy, setBusy] = useState(true);

  const load = async () => {
    setBusy(true);
    try {
      const response = await fetch("/api/admin/legal", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await response.json();
      if (!response.ok) return notify(body.error ?? "Centre juridique indisponible.");
      setHistory(body.documents ?? []);
    } finally {
      setBusy(false);
    }
  };
  useEffect(() => {
    void load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const versions = useMemo(
    () => history.filter((item) => item.documentKey === documentKey),
    [history, documentKey],
  );
  const selectDocument = (key: string) => {
    setDocumentKey(key);
    const published = history.find((item) => item.documentKey === key && item.published);
    const source = published ?? legalDocuments[key as keyof typeof legalDocuments];
    setTitle(source.title);
    setDescription(source.description);
    setSectionsText(
      (source.sections as readonly (readonly [string, string])[])
        .map(([heading, body]) => `${heading}\n${body}`)
        .join("\n\n---\n\n"),
    );
    setVersion(`${new Date().toISOString().slice(0, 10).replaceAll("-", ".")}.1`);
  };
  const parseSections = (): Section[] =>
    sectionsText
      .split(/\n\s*---\s*\n/)
      .map((block): Section => {
        const [heading, ...body] = block.trim().split("\n");
        return [heading.trim(), body.join("\n").trim()];
      })
      .filter(([heading, body]) => Boolean(heading && body));
  const save = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      const response = await fetch("/api/admin/legal", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          documentKey,
          title,
          description,
          sections: parseSections(),
          version,
          effectiveFrom,
          publish,
        }),
      });
      const body = await response.json();
      if (!response.ok) return notify(body.error ?? "Enregistrement impossible.");
      setHistory(body.documents);
      notify(publish ? "Nouvelle version publiée." : "Nouvelle version enregistrée en brouillon.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="admin-panel">
      <div className="admin-panel__heading">
        <div>
          <p className="eyebrow">Gouvernance</p>
          <h2>Centre juridique</h2>
        </div>
        <p>Versions et historique intègres</p>
      </div>
      <p>
        Chaque enregistrement crée une nouvelle version. Une publication conserve les versions
        antérieures dans l’historique.
      </p>
      <div className="legal-admin-layout">
        <form className="admin-card legal-admin-editor" onSubmit={(event) => void save(event)}>
          <label>
            Document
            <select value={documentKey} onChange={(event) => selectDocument(event.target.value)}>
              {keys.map((key) => (
                <option key={key} value={key}>
                  {labels[key] ?? key}
                </option>
              ))}
            </select>
          </label>
          <label>
            Titre
            <input value={title} onChange={(event) => setTitle(event.target.value)} required />
          </label>
          <label>
            Description
            <input
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
            />
          </label>
          <label>
            Contenu{" "}
            <small>Une section = titre, nouvelle ligne, texte. Séparer les sections par ---.</small>
            <textarea
              rows={18}
              value={sectionsText}
              onChange={(event) => setSectionsText(event.target.value)}
              required
            />
          </label>
          <div className="legal-admin-fields">
            <label>
              Version
              <input
                value={version}
                onChange={(event) => setVersion(event.target.value)}
                required
              />
            </label>
            <label>
              Date d’effet
              <input
                type="date"
                value={effectiveFrom}
                onChange={(event) => setEffectiveFrom(event.target.value)}
                required
              />
            </label>
          </div>
          <label>
            <input
              type="checkbox"
              checked={publish}
              onChange={(event) => setPublish(event.target.checked)}
            />{" "}
            Publier cette version
          </label>
          <button type="submit" disabled={busy}>
            Enregistrer une nouvelle version
          </button>
        </form>
        <aside className="admin-card">
          <h3>Historique</h3>
          {versions.length ? (
            versions.map((item) => (
              <article className="admin-document-row" key={item.id}>
                <div>
                  <strong>Version {item.version}</strong>
                  <small>Effet : {item.effectiveFrom}</small>
                  <small>Créée le {new Date(item.createdAt).toLocaleString("fr-FR")}</small>
                </div>
                <span className="loyalty-badge">{item.published ? "Publiée" : "Archivée"}</span>
              </article>
            ))
          ) : (
            <p>
              Aucune version enregistrée en base. Le contenu éditorial du site reste la référence
              active.
            </p>
          )}
        </aside>
      </div>
    </section>
  );
}
