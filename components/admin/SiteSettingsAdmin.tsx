"use client";
import { FormEvent, useEffect, useState } from "react";
type Setting = { key: string; value: unknown; public: boolean; description: string | null };
type ManagedLink = { key: string; label: string; url: string; active: boolean };
export function SiteSettingsAdmin({
  token,
  notify,
}: {
  token: string;
  notify: (message: string) => void;
}) {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [links, setLinks] = useState<ManagedLink[]>([]);
  const headers = { Authorization: `Bearer ${token}` };
  const load = async () => {
    const response = await fetch("/api/admin/cms/settings", { headers });
    const body = (await response.json()) as {
      settings?: Setting[];
      links?: ManagedLink[];
      error?: string;
    };
    if (!response.ok) return notify(body.error ?? "Paramètres indisponibles.");
    setSettings(body.settings ?? []);
    setLinks(body.links ?? []);
  };
  useEffect(() => {
    void load();
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let value: unknown = String(data.get("value") ?? "");
    try {
      value = JSON.parse(String(data.get("value")));
    } catch {
      /* plain text */
    }
    const response = await fetch("/api/admin/cms/settings", {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        key: data.get("key"),
        value,
        public: data.get("public") === "on",
        description: data.get("description") || undefined,
      }),
    });
    if (!response.ok) return notify("Enregistrement impossible.");
    event.currentTarget.reset();
    notify("Paramètre mis à jour immédiatement.");
    await load();
  };
  const saveLink = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/cms/settings", {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "link",
        key: data.get("key"),
        label: data.get("label"),
        url: data.get("url"),
        active: true,
      }),
    });
    if (!response.ok) return notify("Lien invalide.");
    event.currentTarget.reset();
    notify("Lien externe mis à jour.");
    await load();
  };
  return (
    <section className="admin-panel">
      <div className="admin-panel__heading">
        <div>
          <p className="eyebrow">Configuration dynamique</p>
          <h2>Paramètres du site</h2>
        </div>
      </div>
      <form className="admin-editor" onSubmit={submit}>
        <div className="admin-form-grid">
          <label>
            Clé
            <input name="key" required placeholder="contact.phone" />
          </label>
          <label>
            Valeur
            <input name="value" required />
          </label>
          <label className="wide">
            Description
            <input name="description" />
          </label>
          <label>
            <input name="public" type="checkbox" /> Visible sur le site
          </label>
        </div>
        <button>Enregistrer</button>
      </form>
      <div className="admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Clé</th>
              <th>Valeur</th>
              <th>Publique</th>
            </tr>
          </thead>
          <tbody>
            {settings.map((setting) => (
              <tr key={setting.key}>
                <td>{setting.key}</td>
                <td>
                  {typeof setting.value === "string"
                    ? setting.value
                    : JSON.stringify(setting.value)}
                </td>
                <td>{setting.public ? "Oui" : "Non"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h3>Liens externes</h3>
      <form className="admin-editor" onSubmit={saveLink}>
        <div className="admin-form-grid">
          <label>
            Clé
            <input name="key" required placeholder="instagram" />
          </label>
          <label>
            Libellé
            <input name="label" required />
          </label>
          <label className="wide">
            Adresse
            <input name="url" required placeholder="https://…" />
          </label>
        </div>
        <button>Ajouter ou modifier</button>
      </form>
      <div className="admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Adresse</th>
              <th>Actif</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <tr key={link.key}>
                <td>{link.label}</td>
                <td>
                  <a href={link.url}>{link.url}</a>
                </td>
                <td>{link.active ? "Oui" : "Non"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
