"use client";

import { useEffect, useRef, useState } from "react";
import { getProperty } from "@/data";
import {
  editablePropertySlugs,
  type EditablePropertySlug,
  type PropertyEditorDocument,
  type PropertyVisualContent,
} from "@/platform/property-editor/contracts";

type Asset = {
  id: string;
  kind: string;
  bucket: string;
  storage_path: string;
  title: string | null;
  alt_text: string | null;
  url?: string;
};
const labels: Record<EditablePropertySlug, string> = {
  "chai-des-tortues": "Le Chai des Tortues",
  "villa-raie-manta": "Villa Raie Manta",
  "nid-d-ete": "Le Nid d’Été",
};

export function PropertyVisualEditorAdmin({
  token,
  notify,
}: {
  token: string;
  notify: (message: string) => void;
}) {
  const [slug, setSlug] = useState<EditablePropertySlug>("villa-raie-manta");
  const [document, setDocument] = useState<PropertyEditorDocument | null>(null);
  const [content, setContent] = useState<PropertyVisualContent | null>(null);
  const [history, setHistory] = useState<PropertyVisualContent[]>([]);
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const [showGuides, setShowGuides] = useState(true);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [mediaField, setMediaField] = useState("hero");
  const [mediaAddTarget, setMediaAddTarget] = useState<{ group: string; fields: string[] } | null>(
    null,
  );
  const [busy, setBusy] = useState(false);
  const preview = useRef<HTMLIFrameElement>(null);
  const headers = { Authorization: `Bearer ${token}` };

  const load = async (nextSlug = slug) => {
    const response = await fetch(`/api/admin/property-editor/${nextSlug}`, {
      headers,
      cache: "no-store",
    });
    const payload = (await response.json()) as PropertyEditorDocument & { error?: string };
    if (!response.ok) return notify(payload.error ?? "Éditeur indisponible.");
    setDocument(payload);
    setContent(payload.draft);
    setHistory([]);
  };
  useEffect(() => {
    void load(slug);
  }, [slug, token]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const receive = (
      event: MessageEvent<{
        type?: string;
        field?: keyof PropertyVisualContent | string;
        value?: string;
        fields?: string[];
        direction?: string;
      }>,
    ) => {
      if (event.origin !== window.location.origin) return;
      if (event.data.type === "property-preview-ready" && content) {
        preview.current?.contentWindow?.postMessage(
          { type: "property-preview-content", content },
          window.location.origin,
        );
        preview.current?.contentWindow?.postMessage(
          { type: "property-preview-editing", editing: showGuides },
          window.location.origin,
        );
      }
      if (
        event.data.type === "property-preview-change" &&
        event.data.field &&
        typeof event.data.value === "string"
      )
        update(event.data.field as keyof PropertyVisualContent, event.data.value);
      if (
        event.data.type === "property-preview-text-change" &&
        typeof event.data.field === "string" &&
        typeof event.data.value === "string"
      )
        setContent((current) => {
          if (!current) return current;
          setHistory((items) => [...items.slice(-29), current]);
          return {
            ...current,
            visualTextOverrides: {
              ...current.visualTextOverrides,
              [event.data.field as string]: event.data.value as string,
            },
          };
        });
      if (event.data.type === "property-preview-media") {
        setMediaAddTarget(null);
        setMediaField(String(event.data.field ?? "hero"));
        setMediaOpen(true);
      }
      if (
        event.data.type === "property-preview-add-media" &&
        typeof event.data.field === "string"
      ) {
        setMediaField(`${event.data.field}.added-${crypto.randomUUID()}`);
        setMediaAddTarget({ group: event.data.field, fields: event.data.fields ?? [] });
        setMediaOpen(true);
      }
      if (
        event.data.type === "property-preview-remove-media" &&
        typeof event.data.field === "string"
      ) {
        const removedField = event.data.field;
        setContent((current) => {
          if (!current) return current;
          setHistory((items) => [...items.slice(-29), current]);
          const visualMediaOverrides = { ...current.visualMediaOverrides };
          delete visualMediaOverrides[removedField];
          const group = removedField.split(".").slice(0, 2).join(".");
          return {
            ...current,
            visualMediaOverrides,
            visualMediaOrder: {
              ...current.visualMediaOrder,
              [group]: (current.visualMediaOrder[group] ?? []).filter(
                (field) => field !== removedField,
              ),
            },
          };
        });
      }
      if (
        event.data.type === "property-preview-reorder" &&
        typeof event.data.field === "string" &&
        event.data.fields?.length
      ) {
        const fields = [...event.data.fields];
        const index = fields.indexOf(event.data.field);
        const target = event.data.direction === "previous" ? index - 1 : index + 1;
        if (content && index >= 0 && target >= 0 && target < fields.length) {
          [fields[index], fields[target]] = [fields[target], fields[index]];
          const group = event.data.field.split(".").slice(0, 2).join(".");
          const next = {
            ...content,
            visualMediaOrder: { ...content.visualMediaOrder, [group]: fields },
          };
          setHistory((items) => [...items.slice(-29), content]);
          setContent(next);
          preview.current?.contentWindow?.postMessage(
            { type: "property-preview-content", content: next },
            window.location.origin,
          );
        }
      }
      if (
        event.data.type === "property-preview-order" &&
        typeof event.data.field === "string" &&
        event.data.fields?.length &&
        content
      ) {
        const next = {
          ...content,
          visualMediaOrder: { ...content.visualMediaOrder, [event.data.field]: event.data.fields },
        };
        setHistory((items) => [...items.slice(-29), content]);
        setContent(next);
        preview.current?.contentWindow?.postMessage(
          { type: "property-preview-content", content: next },
          window.location.origin,
        );
      }
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  });
  useEffect(() => {
    if (content)
      preview.current?.contentWindow?.postMessage(
        { type: "property-preview-content", content },
        window.location.origin,
      );
  }, [content]);
  useEffect(() => {
    preview.current?.contentWindow?.postMessage(
      { type: "property-preview-editing", editing: showGuides },
      window.location.origin,
    );
  }, [showGuides]);

  const update = (field: keyof PropertyVisualContent, value: string) =>
    setContent((current) => {
      if (!current || current[field] === value) return current;
      setHistory((items) => [...items.slice(-29), current]);
      return { ...current, [field]: value };
    });

  const save = async (action: "save-draft" | "publish" | "discard") => {
    if (!content) return;
    setBusy(true);
    const response = await fetch(`/api/admin/property-editor/${slug}`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(action === "discard" ? { action } : { action, content }),
    });
    const payload = (await response.json()) as {
      document?: PropertyEditorDocument;
      error?: string;
    };
    setBusy(false);
    if (!response.ok || !payload.document)
      return notify(payload.error ?? "Enregistrement impossible.");
    setDocument(payload.document);
    setContent(payload.document.draft);
    setHistory([]);
    notify(
      action === "publish"
        ? "Page publiée. L’aperçu et le site public utilisent maintenant cette même version."
        : action === "discard"
          ? "Modifications annulées."
          : "Brouillon enregistré sans modifier le site public.",
    );
  };

  const openMedia = async () => {
    const response = await fetch("/api/admin/cms/media", { headers });
    const payload = (await response.json()) as { assets?: Asset[] };
    setAssets((payload.assets ?? []).filter((asset) => asset.kind === "image"));
    setMediaOpen(true);
  };
  const openHeroMedia = () => {
    setMediaAddTarget(null);
    setMediaField("hero");
    setMediaOpen(true);
  };
  const openAddMedia = () => {
    const group = "editorial.0";
    setMediaField(`${group}.added-${crypto.randomUUID()}`);
    setMediaAddTarget({
      group,
      fields: content?.visualMediaOrder[group] ?? [`${group}.0`, `${group}.1`, `${group}.2`],
    });
    setMediaOpen(true);
  };
  useEffect(() => {
    if (mediaOpen && !assets.length) void openMedia();
  }, [mediaOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const dirty =
    !!content && !!document && JSON.stringify(content) !== JSON.stringify(document.draft);
  const chooseMedia = (url: string, alt: string) => {
    if (!content) return;
    const next =
      mediaField === "hero"
        ? { ...content, hero: url }
        : {
            ...content,
            visualMediaOverrides: {
              ...content.visualMediaOverrides,
              [mediaField]: { src: url, alt },
            },
            ...(mediaAddTarget
              ? {
                  visualMediaOrder: {
                    ...content.visualMediaOrder,
                    [mediaAddTarget.group]: [
                      ...(content.visualMediaOrder[mediaAddTarget.group] ?? mediaAddTarget.fields),
                      mediaField,
                    ],
                  },
                }
              : {}),
          };
    setHistory((items) => [...items.slice(-29), content]);
    setContent(next);
    // Send the selected source immediately. Relying only on the state effect can
    // leave the iframe on its previous image while the media dialog is unmounted.
    preview.current?.contentWindow?.postMessage(
      { type: "property-preview-content", content: next },
      window.location.origin,
    );
    setMediaAddTarget(null);
  };
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (dirty) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  return (
    <section className="visual-editor">
      <header className="visual-editor__toolbar">
        <label>
          Maison
          <select
            value={slug}
            onChange={(event) => {
              const next = event.target.value as EditablePropertySlug;
              if (
                !dirty ||
                window.confirm(
                  "Abandonner les modifications non enregistrées et changer de maison ?",
                )
              )
                setSlug(next);
            }}
          >
            {editablePropertySlugs.map((item) => (
              <option key={item} value={item}>
                {labels[item]}
              </option>
            ))}
          </select>
        </label>
        <div className="visual-editor__view">
          <button
            type="button"
            className={viewport === "desktop" ? "active" : ""}
            onClick={() => setViewport("desktop")}
          >
            Ordinateur
          </button>
          <button
            type="button"
            className={viewport === "mobile" ? "active" : ""}
            onClick={() => setViewport("mobile")}
          >
            Mobile
          </button>
        </div>
        <button type="button" disabled={!content} onClick={openHeroMedia}>
          Remplacer la grande photo
        </button>
        <button type="button" disabled={!content} onClick={openAddMedia}>
          + Ajouter une photo
        </button>
        <button type="button" onClick={() => setShowGuides((value) => !value)}>
          {showGuides ? "Aperçu propre" : "Afficher les repères"}
        </button>
        <button
          type="button"
          disabled={!history.length || busy}
          onClick={() => {
            const previous = history.at(-1);
            if (previous) {
              setContent(previous);
              setHistory((items) => items.slice(0, -1));
            }
          }}
        >
          Annuler
        </button>
        <button type="button" disabled={busy || !content} onClick={() => void save("discard")}>
          Abandonner les changements
        </button>
      </header>
      <p className="visual-editor__help">
        Cliquez directement dans la page, ou utilisez les boutons « Remplacer la grande photo » et «
        Ajouter une photo » ci-dessus.
      </p>
      <div className={`visual-editor__stage visual-editor__stage--${viewport}`}>
        <iframe
          ref={preview}
          title={`Aperçu de ${labels[slug]}`}
          src={`/administration/apercu-maison/${slug}`}
          onLoad={() => {
            if (content)
              preview.current?.contentWindow?.postMessage(
                { type: "property-preview-content", content },
                window.location.origin,
              );
            preview.current?.contentWindow?.postMessage(
              { type: "property-preview-editing", editing: showGuides },
              window.location.origin,
            );
          }}
        />
      </div>
      <div className="visual-editor__savebar" aria-label="Actions d’enregistrement">
        <span>
          {dirty
            ? "Modifications non enregistrées"
            : document?.hasUnpublishedChanges
              ? "Brouillon non publié"
              : "À jour"}
        </span>
        <button type="button" disabled={busy || !content} onClick={() => void save("save-draft")}>
          Enregistrer le brouillon
        </button>
        <button
          className="visual-editor__publish"
          type="button"
          disabled={busy || !content}
          onClick={() => void save("publish")}
        >
          {busy ? "Enregistrement…" : "Enregistrer et publier"}
        </button>
      </div>
      {mediaOpen && (
        <div className="visual-media" role="dialog" aria-modal="true">
          <div>
            <header>
              <h2>Choisir une photo</h2>
              <button type="button" onClick={() => setMediaOpen(false)}>
                Fermer
              </button>
            </header>
            <form
              action="/api/admin/cms/media"
              method="post"
              className="visual-media__upload"
              onSubmit={async (event) => {
                event.preventDefault();
                const response = await fetch("/api/admin/cms/media", {
                  method: "POST",
                  headers,
                  body: new FormData(event.currentTarget),
                });
                const payload = (await response.json().catch(() => ({}))) as {
                  error?: string;
                  asset?: Asset;
                };
                if (!response.ok || !payload.asset)
                  return notify(payload.error ?? "Import impossible.");
                const url =
                  payload.asset.url ??
                  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${payload.asset.bucket}/${payload.asset.storage_path}`;
                chooseMedia(url, payload.asset.alt_text ?? payload.asset.title ?? labels[slug]);
                setAssets((current) => [payload.asset!, ...current]);
                event.currentTarget.reset();
                setMediaOpen(false);
                notify("Photo importée et ajoutée à la page.");
              }}
            >
              <input
                name="file"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                required
              />
              <input name="title" placeholder="Titre de la photo" required />
              <input name="altText" placeholder="Description de la photo" required />
              <button>Importer</button>
            </form>
            <div className="visual-media__grid">
              {[
                ...new Map(
                  [
                    {
                      id: `current-${slug}`,
                      kind: "image",
                      bucket: "site",
                      storage_path: content?.hero ?? "",
                      title: "Photo actuelle",
                      alt_text: labels[slug],
                      url: content?.hero,
                    },
                    ...getProperty(slug).gallery.map((image, index) => ({
                      id: `site-${slug}-${index}`,
                      kind: "image",
                      bucket: "site",
                      storage_path: image.src,
                      title: image.caption ?? `Photo ${index + 1}`,
                      alt_text: image.alt,
                      url: image.src,
                    })),
                    ...assets,
                  ].map((asset) => [asset.url ?? `${asset.bucket}/${asset.storage_path}`, asset]),
                ).values(),
              ].map((asset) => {
                const url =
                  asset.url ??
                  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${asset.bucket}/${asset.storage_path}`;
                return (
                  <button
                    type="button"
                    key={asset.id}
                    onClick={() => {
                      chooseMedia(url, asset.alt_text ?? asset.title ?? labels[slug]);
                      setMediaOpen(false);
                    }}
                  >
                    <img src={url} alt={asset.alt_text ?? ""} />
                    <span>{asset.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
