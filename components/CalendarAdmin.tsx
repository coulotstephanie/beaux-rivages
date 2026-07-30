"use client";

import { useState } from "react";
import { StaffAccess } from "@/components/admin/StaffAccess";

type AdminPayload = {
  configuration: {
    id: string;
    propertySlug: string;
    provider: string;
    configured: boolean;
    environmentVariable: string;
  }[];
  calendars: {
    propertySlug: string;
    sources: {
      sourceId: string;
      provider: string;
      status: string;
      imported: number;
      syncedAt: string;
      error?: string;
    }[];
  }[];
};

export function CalendarAdmin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [data, setData] = useState<AdminPayload | null>(null);
  const [message, setMessage] = useState("Connectez-vous pour consulter les synchronisations.");
  const [busy, setBusy] = useState(false);

  const request = async (url: string, init?: RequestInit) => {
    setBusy(true);
    try {
      const response = await fetch(url, {
        ...init,
        headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
      });
      const payload = (await response.json()) as AdminPayload & { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Erreur inattendue.");
      setData(payload.configuration ? payload : data);
      setMessage("Synchronisation terminée.");
      if (!payload.configuration) await load();
      return true;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erreur inattendue.");
      return false;
    } finally {
      setBusy(false);
    }
  };
  const load = () => request("/api/calendar/admin");
  const synchronize = (propertySlug: string) =>
    request("/api/calendar/admin", { method: "POST", body: JSON.stringify({ propertySlug }) });
  const open = async () => {
    if (await load()) setAuthenticated(true);
  };

  if (!authenticated) {
    return <StaffAccess busy={busy} message={message} onAuthenticated={open} />;
  }

  return (
    <div className="calendar-admin">
      <p role="status">{message}</p>
      {data ? (
        <div className="calendar-admin__properties">
          {data.calendars.map((calendar) => (
            <section key={calendar.propertySlug}>
              <div>
                <h2>{calendar.propertySlug}</h2>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void synchronize(calendar.propertySlug)}
                >
                  Forcer la synchronisation
                </button>
              </div>
              <ul>
                {data.configuration
                  .filter((source) => source.propertySlug === calendar.propertySlug)
                  .map((source) => {
                    const sync = calendar.sources.find((item) => item.sourceId === source.id);
                    return (
                      <li key={source.id}>
                        <strong>{source.provider}</strong>
                        <span>{source.configured ? "Configuré" : "Non configuré"}</span>
                        <small>
                          {sync
                            ? `${sync.status} · ${sync.imported} imports · ${new Date(sync.syncedAt).toLocaleString("fr-FR")}`
                            : source.environmentVariable}
                        </small>
                        {sync?.error ? <em>{sync.error}</em> : null}
                      </li>
                    );
                  })}
              </ul>
            </section>
          ))}
        </div>
      ) : null}
      <aside>
        <h2>Gestion des sources</h2>
        <p>
          Les URL contiennent des jetons privés. Dans cette version, leur ajout et leur modification
          restent réalisés dans les variables chiffrées Vercel. Le contrat{" "}
          <code>CalendarSourceRepository</code> permet de brancher ensuite un coffre persistant ou
          un channel manager sans modifier les API publiques.
        </p>
      </aside>
    </div>
  );
}
