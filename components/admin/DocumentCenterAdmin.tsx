"use client";
import { useEffect, useMemo, useState } from "react";
import type { DocumentCenterSnapshot, DocumentKind } from "@/platform/documents/contracts";
const labels: Record<DocumentKind, string> = {
  quote: "Devis",
  contract: "Contrat",
  deposit_invoice: "Facture d’acompte",
  balance_invoice: "Facture de solde",
  final_invoice: "Facture finale",
  credit_note: "Avoir",
  receipt: "Reçu",
  payment_statement: "État des paiements",
  certificate: "Attestation",
};
const date = (v: string | null) =>
  v
    ? new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" }).format(
        new Date(v),
      )
    : "—";
const money = (v: number | null) =>
  v === null
    ? "—"
    : new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(v / 100);
export function DocumentCenterAdmin({
  token,
  notify,
}: {
  token: string;
  notify: (value: string) => void;
}) {
  const [data, setData] = useState<DocumentCenterSnapshot | null>(null);
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("all");
  const [busy, setBusy] = useState(false);
  const load = async () => {
    const response = await fetch("/api/admin/documents", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    if (response.ok) setData(body);
    else notify(body.error ?? "Documents indisponibles.");
  };
  const call = async (payload: Record<string, unknown>) => {
    setBusy(true);
    try {
      const response = await fetch("/api/admin/documents", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await response.json();
      notify(
        response.ok ? "Opération documentaire enregistrée." : (body.error ?? "Action impossible."),
      );
      if (response.ok) await load();
    } finally {
      setBusy(false);
    }
  };
  useEffect(() => {
    void load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const rows = useMemo(
    () =>
      data?.documents.filter((document) => {
        const q = query.toLocaleLowerCase("fr");
        return (
          (kind === "all" || document.kind === kind) &&
          (!q ||
            [
              document.number,
              document.reservationReference,
              document.propertyName,
              document.guestName,
              labels[document.kind],
            ].some((value) => value.toLocaleLowerCase("fr").includes(q)))
        );
      }) ?? [],
    [data, query, kind],
  );
  if (!data)
    return (
      <section className="admin-panel">
        <p>Chargement du coffre documentaire…</p>
      </section>
    );
  return (
    <section className="admin-panel document-center">
      <div className="admin-panel__heading">
        <div>
          <p className="eyebrow">Coffre documentaire</p>
          <h2>Documents Premium</h2>
        </div>
        <p>Une source unique pour chaque voyageur, séjour et logement.</p>
      </div>
      <div className="admin-kpis">
        <K label="Documents" value={data.metrics.total} />
        <K label="À signer" value={data.metrics.toSign} />
        <K label="Envoyés" value={data.metrics.sent} />
        <K label="Signés" value={data.metrics.signed} />
        <K label="Archivés" value={data.metrics.archived} />
      </div>
      <div className="admin-toolbar">
        <label>
          Recherche
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Nom, numéro, logement, année…"
          />
        </label>
        <label>
          Type
          <select value={kind} onChange={(event) => setKind(event.target.value)}>
            <option value="all">Tous les documents</option>
            {Object.entries(labels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <GenerateForm data={data} busy={busy} submit={call} />
      <div className="admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Document</th>
              <th>Voyageur</th>
              <th>Séjour</th>
              <th>Logement</th>
              <th>Montant</th>
              <th>Statut</th>
              <th>Signature / envoi</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((document) => (
              <tr key={document.id}>
                <td>
                  <strong>{document.number}</strong>
                  <br />
                  <small>
                    {labels[document.kind]} · v{document.version}
                  </small>
                </td>
                <td>{document.guestName}</td>
                <td>{document.reservationReference}</td>
                <td>{document.propertyName}</td>
                <td>{money(document.amountCents)}</td>
                <td>{document.status}</td>
                <td>{document.signatureStatus ?? document.deliveryStatus ?? "—"}</td>
                <td>
                  <div className="admin-inline-actions">
                    {document.kind === "contract" && (
                      <button
                        disabled={busy}
                        onClick={() => {
                          const recipient = window.prompt("Adresse e-mail du signataire");
                          if (recipient)
                            void call({
                              action: "prepare_signature",
                              documentId: document.id,
                              signerEmail: recipient,
                            });
                        }}
                      >
                        Envoyer à signer
                      </button>
                    )}
                    <button
                      disabled={busy}
                      onClick={() => {
                        const recipient = window.prompt("Adresse e-mail du destinataire");
                        if (recipient)
                          void call({
                            action: "record_delivery",
                            documentId: document.id,
                            recipient,
                            channel: "email",
                            status: "prepared",
                          });
                      }}
                    >
                      Envoyer
                    </button>
                    <button
                      disabled={busy}
                      onClick={() => {
                        const reason = window.prompt("Motif d’archivage obligatoire");
                        if (reason)
                          void call({ action: "archive", documentId: document.id, reason });
                      }}
                    >
                      Archiver
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!rows.length && (
        <p className="admin-empty">Aucun document ne correspond à cette recherche.</p>
      )}
      <div className="admin-two-columns">
        <TemplateForm data={data} busy={busy} submit={call} />
        <SettingsForm data={data} busy={busy} submit={call} />
      </div>
      <article className="admin-card">
        <h3>Historique sécurisé</h3>
        <div className="admin-list">
          {data.audit.slice(0, 30).map((item) => (
            <div className="admin-health-row" key={item.id}>
              <div>
                <strong>{item.action}</strong>
                <span>{date(item.createdAt)}</span>
              </div>
              <span className="admin-status">{item.origin}</span>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
function K({ label, value }: { label: string; value: number }) {
  return (
    <article>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
function GenerateForm({
  data,
  busy,
  submit,
}: {
  data: DocumentCenterSnapshot;
  busy: boolean;
  submit: (payload: Record<string, unknown>) => Promise<void>;
}) {
  return (
    <form
      className="admin-editor"
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        void submit({
          action: "generate",
          reservationId: form.get("reservationId"),
          kind: form.get("kind"),
        });
      }}
    >
      <h3>Générer depuis les données du séjour</h3>
      <div className="admin-form-grid">
        <label>
          Séjour
          <select name="reservationId" required>
            {data.reservations.map((item) => (
              <option value={item.id} key={item.id}>
                {item.reference} · {item.guestName} · {item.propertyName}
              </option>
            ))}
          </select>
        </label>
        <label>
          Document
          <select name="kind">
            {Object.entries(labels).map(([value, label]) => (
              <option value={value} key={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button disabled={busy}>Générer une version</button>
    </form>
  );
}
function TemplateForm({
  data,
  busy,
  submit,
}: {
  data: DocumentCenterSnapshot;
  busy: boolean;
  submit: (payload: Record<string, unknown>) => Promise<void>;
}) {
  return (
    <form
      className="admin-card"
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        void submit({
          action: "save_template",
          kind: form.get("kind"),
          name: form.get("name"),
          primaryColor: form.get("primaryColor"),
          footerText: form.get("footerText"),
          legalText: form.get("legalText"),
          active: true,
        });
      }}
    >
      <h3>Modèles</h3>
      <p>{data.templates.length} modèle(s) configuré(s).</p>
      <label>
        Type
        <select name="kind">
          {Object.entries(labels).map(([value, label]) => (
            <option value={value} key={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Nom
        <input name="name" required />
      </label>
      <label>
        Couleur
        <input name="primaryColor" type="color" defaultValue={data.settings.primaryColor} />
      </label>
      <label>
        Pied de page
        <textarea name="footerText" />
      </label>
      <label>
        Mentions
        <textarea name="legalText" />
      </label>
      <button disabled={busy}>Créer le modèle</button>
    </form>
  );
}
function SettingsForm({
  data,
  busy,
  submit,
}: {
  data: DocumentCenterSnapshot;
  busy: boolean;
  submit: (payload: Record<string, unknown>) => Promise<void>;
}) {
  const s = data.settings;
  return (
    <form
      className="admin-card"
      onSubmit={(event) => {
        event.preventDefault();
        const f = new FormData(event.currentTarget);
        void submit({
          action: "save_settings",
          legalName: f.get("legalName"),
          address: f.get("address"),
          phone: f.get("phone"),
          email: f.get("email"),
          iban: f.get("iban"),
          bic: f.get("bic"),
          vatNumber: f.get("vatNumber"),
          vatEnabled: f.get("vatEnabled") === "on",
          logoPath: f.get("logoPath"),
          primaryColor: f.get("primaryColor"),
          footerText: f.get("footerText"),
          legalMentions: f.get("legalMentions"),
          ownerSignaturePath: f.get("ownerSignaturePath"),
        });
      }}
    >
      <h3>Identité documentaire</h3>
      <label>
        Raison sociale
        <input name="legalName" defaultValue={s.legalName} required />
      </label>
      <label>
        Adresse
        <textarea name="address" defaultValue={s.address} />
      </label>
      <label>
        Téléphone
        <input name="phone" defaultValue={s.phone} />
      </label>
      <label>
        E-mail
        <input type="email" name="email" defaultValue={s.email} required />
      </label>
      <label>
        IBAN
        <input name="iban" defaultValue={s.iban} />
      </label>
      <label>
        BIC
        <input name="bic" defaultValue={s.bic} />
      </label>
      <label>
        Numéro TVA
        <input name="vatNumber" defaultValue={s.vatNumber} />
      </label>
      <label>
        <input type="checkbox" name="vatEnabled" defaultChecked={s.vatEnabled} /> TVA activée
      </label>
      <label>
        Chemin du logo
        <input name="logoPath" defaultValue={s.logoPath} />
      </label>
      <label>
        Couleur
        <input name="primaryColor" type="color" defaultValue={s.primaryColor} />
      </label>
      <label>
        Signature propriétaire
        <input name="ownerSignaturePath" defaultValue={s.ownerSignaturePath} />
      </label>
      <label>
        Pied de page
        <textarea name="footerText" defaultValue={s.footerText} />
      </label>
      <label>
        Mentions légales
        <textarea name="legalMentions" defaultValue={s.legalMentions} />
      </label>
      <button disabled={busy}>Enregistrer les paramètres</button>
    </form>
  );
}
