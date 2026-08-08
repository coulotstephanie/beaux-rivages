"use client";

import { FormEvent, useEffect, useState } from "react";
import type { CmsBlock, CmsPage, CmsPageVersion } from "@/platform/cms/contracts";

const emptyPage: CmsPage = {
  pageType: "page",
  slug: "",
  title: "",
  status: "draft",
  locale: "fr",
  seo: {},
  blocks: [],
};
const newBlock = (position: number): CmsBlock => ({
  blockType: "text",
  position,
  content: { title: "", body: "" },
  settings: {},
  visible: true,
});

export function CmsPagesAdmin({
  token,
  notify,
  mode = "content",
}: {
  token: string;
  notify: (message: string) => void;
  mode?: "content" | "seo";
}) {
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [page, setPage] = useState<CmsPage>(emptyPage);
  const [versions, setVersions] = useState<CmsPageVersion[]>([]);
  const [busy, setBusy] = useState(false);

  const headers = { Authorization: `Bearer ${token}` };
  const load = async () => {
    const response = await fetch("/api/admin/cms/pages", { headers });
    const payload = (await response.json()) as { pages?: CmsPage[]; error?: string };
    if (!response.ok) return notify(payload.error ?? "CMS indisponible.");
    setPages(payload.pages ?? []);
  };
  useEffect(() => {
    void load();
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const select = async (selected: CmsPage) => {
    setPage(structuredClone(selected));
    const response = await fetch(`/api/admin/cms/pages?versions=${selected.id}`, { headers });
    const payload = (await response.json()) as { versions?: CmsPageVersion[] };
    setVersions(payload.versions ?? []);
  };

  const setBlock = (index: number, patch: Partial<CmsBlock>) =>
    setPage((current) => ({
      ...current,
      blocks: current.blocks.map((block, position) =>
        position === index ? { ...block, ...patch } : block,
      ),
    }));
  const moveBlock = (index: number, offset: -1 | 1) =>
    setPage((current) => {
      const target = index + offset;
      if (target < 0 || target >= current.blocks.length) return current;
      const blocks = [...current.blocks];
      [blocks[index], blocks[target]] = [blocks[target], blocks[index]];
      return { ...current, blocks: blocks.map((block, position) => ({ ...block, position })) };
    });

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    const response = await fetch("/api/admin/cms/pages", {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ ...page, reason: "Modification depuis l’éditeur V4" }),
    });
    const payload = (await response.json()) as { id?: string; error?: string };
    setBusy(false);
    if (!response.ok) return notify(payload.error ?? "Enregistrement impossible.");
    notify(page.status === "published" ? "Page publiée immédiatement." : "Brouillon enregistré.");
    await load();
    if (payload.id) setPage((current) => ({ ...current, id: payload.id }));
  };

  const restore = async (version: number) => {
    if (!page.id || !window.confirm(`Restaurer la version ${version} ?`)) return;
    const response = await fetch("/api/admin/cms/pages", {
      method: "PATCH",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ id: page.id, version }),
    });
    if (!response.ok) return notify("Restauration impossible.");
    notify(`Version ${version} restaurée et historisée.`);
    await load();
  };

  return (
    <section className="admin-panel">
      <div className="admin-panel__heading">
        <div>
          <p className="eyebrow">CMS dynamique V4</p>
          <h2>{mode === "seo" ? "Référencement SEO" : "Pages et contenus"}</h2>
        </div>
        <button
          type="button"
          onClick={() => {
            setPage(emptyPage);
            setVersions([]);
          }}
        >
          Nouvelle page
        </button>
      </div>
      <div className="admin-two-columns">
        <aside className="admin-card">
          <h3>Pages</h3>
          {pages.map((item) => (
            <button
              className="admin-link-button"
              type="button"
              key={item.id}
              onClick={() => void select(item)}
            >
              <strong>{item.title}</strong> · {item.status}
            </button>
          ))}
        </aside>
        <form className="admin-editor" onSubmit={submit}>
          <div className="admin-form-grid">
            <label>
              Titre
              <input
                required
                minLength={2}
                value={page.title}
                onChange={(event) => setPage({ ...page, title: event.target.value })}
              />
            </label>
            <label>
              Adresse de page
              <input
                required
                pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                value={page.slug}
                onChange={(event) => setPage({ ...page, slug: event.target.value })}
              />
            </label>
            <label>
              Type
              <select
                value={page.pageType}
                onChange={(event) =>
                  setPage({ ...page, pageType: event.target.value as CmsPage["pageType"] })
                }
              >
                <option value="page">Page</option>
                <option value="property">Maison</option>
                <option value="article">Article</option>
                <option value="landing">Landing page</option>
                <option value="legal">Page légale</option>
              </select>
            </label>
            <label>
              État
              <select
                value={page.status}
                onChange={(event) =>
                  setPage({ ...page, status: event.target.value as CmsPage["status"] })
                }
              >
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
                <option value="archived">Archivé</option>
              </select>
            </label>
            <label className="wide">
              Titre SEO
              <input
                maxLength={70}
                value={page.seo.title ?? ""}
                onChange={(event) =>
                  setPage({ ...page, seo: { ...page.seo, title: event.target.value } })
                }
              />
            </label>
            <label className="wide">
              Meta description
              <textarea
                maxLength={180}
                value={page.seo.description ?? ""}
                onChange={(event) =>
                  setPage({ ...page, seo: { ...page.seo, description: event.target.value } })
                }
              />
            </label>
            <label>
              Canonical
              <input
                type="url"
                value={page.seo.canonical ?? ""}
                onChange={(event) =>
                  setPage({ ...page, seo: { ...page.seo, canonical: event.target.value } })
                }
              />
            </label>
            <label>
              Image Open Graph
              <input
                value={page.seo.openGraphImage ?? ""}
                onChange={(event) =>
                  setPage({ ...page, seo: { ...page.seo, openGraphImage: event.target.value } })
                }
              />
            </label>
            <label>
              Robots
              <select
                value={page.seo.robots ?? "index,follow"}
                onChange={(event) =>
                  setPage({ ...page, seo: { ...page.seo, robots: event.target.value } })
                }
              >
                <option>index,follow</option>
                <option>noindex,follow</option>
                <option>noindex,nofollow</option>
              </select>
            </label>
          </div>
          {mode === "content" && (
            <div className="admin-editor-blocks">
              <div className="admin-panel__heading">
                <h3>Chapitres</h3>
                <button
                  type="button"
                  onClick={() =>
                    setPage({ ...page, blocks: [...page.blocks, newBlock(page.blocks.length)] })
                  }
                >
                  Ajouter un chapitre
                </button>
              </div>
              {page.blocks.map((block, index) => (
                <fieldset key={`${block.id ?? "new"}-${index}`}>
                  <legend>Chapitre {index + 1}</legend>
                  <label>
                    Présentation
                    <select
                      value={block.blockType}
                      onChange={(event) => setBlock(index, { blockType: event.target.value })}
                    >
                      <option value="text">Texte</option>
                      <option value="hero">Hero</option>
                      <option value="image">Photo</option>
                      <option value="gallery">Galerie</option>
                      <option value="video">Vidéo</option>
                      <option value="faq">FAQ</option>
                      <option value="map">Carte</option>
                    </select>
                  </label>
                  <label>
                    Titre
                    <input
                      value={String(block.content.title ?? "")}
                      onChange={(event) =>
                        setBlock(index, {
                          content: { ...block.content, title: event.target.value },
                        })
                      }
                    />
                  </label>
                  <label className="wide">
                    Texte
                    <textarea
                      value={String(block.content.body ?? "")}
                      onChange={(event) =>
                        setBlock(index, { content: { ...block.content, body: event.target.value } })
                      }
                    />
                  </label>
                  <label>
                    Photo ou vidéo
                    <input
                      value={String(block.content.mediaUrl ?? "")}
                      onChange={(event) =>
                        setBlock(index, {
                          content: { ...block.content, mediaUrl: event.target.value },
                        })
                      }
                    />
                  </label>
                  <label>
                    Texte ALT
                    <input
                      value={String(block.content.alt ?? "")}
                      onChange={(event) =>
                        setBlock(index, { content: { ...block.content, alt: event.target.value } })
                      }
                    />
                  </label>
                  <div className="admin-actions">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveBlock(index, -1)}
                    >
                      Monter
                    </button>
                    <button
                      type="button"
                      disabled={index === page.blocks.length - 1}
                      onClick={() => moveBlock(index, 1)}
                    >
                      Descendre
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setPage({
                          ...page,
                          blocks: page.blocks
                            .filter((_, position) => position !== index)
                            .map((item, position) => ({ ...item, position })),
                        })
                      }
                    >
                      Supprimer
                    </button>
                  </div>
                </fieldset>
              ))}
            </div>
          )}
          <div className="admin-actions">
            <button disabled={busy} type="submit">
              {busy ? "Enregistrement…" : page.status === "published" ? "Publier" : "Enregistrer"}
            </button>
          </div>
          {page.id && (
            <details>
              <summary>Historique ({versions.length})</summary>
              {versions.map((version) => (
                <p key={version.version}>
                  <strong>Version {version.version}</strong> ·{" "}
                  {new Date(version.createdAt).toLocaleString("fr-FR")}{" "}
                  <button type="button" onClick={() => void restore(version.version)}>
                    Restaurer
                  </button>
                </p>
              ))}
            </details>
          )}
        </form>
      </div>
    </section>
  );
}
