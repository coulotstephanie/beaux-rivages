"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type {
  CrmTravelerDetail,
  CrmTravelerSummary,
  LoyaltyStatus,
} from "@/platform/crm/contracts";

type Props = { token: string; notify: (message: string) => void };
const money = (cents: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(cents / 100);
const shortDate = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(
        new Date(`${value.slice(0, 10)}T12:00:00Z`),
      )
    : "—";
const loyaltyLabels: Record<LoyaltyStatus, string> = {
  new: "Nouveau voyageur",
  loyal: "Client fidèle",
  regular: "Client régulier",
  vip: "Client VIP",
};

export function PremiumCrmAdmin({ token, notify }: Props) {
  const [travelers, setTravelers] = useState<CrmTravelerSummary[]>([]);
  const [detail, setDetail] = useState<CrmTravelerDetail | null>(null);
  const [query, setQuery] = useState("");
  const [loyalty, setLoyalty] = useState("");
  const [pets, setPets] = useState(false);
  const [children, setChildren] = useState(false);
  const [locale, setLocale] = useState("");
  const [busy, setBusy] = useState(false);

  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);
  const loadList = useCallback(async () => {
    const parameters = new URLSearchParams();
    if (query.trim()) parameters.set("q", query.trim());
    if (loyalty) parameters.set("loyalty", loyalty);
    if (pets) parameters.set("pets", "true");
    if (children) parameters.set("children", "true");
    if (locale) parameters.set("locale", locale);
    const response = await fetch(`/api/admin/crm?${parameters}`, { headers, cache: "no-store" });
    const payload = (await response.json()) as { travelers?: CrmTravelerSummary[]; error?: string };
    if (!response.ok) throw new Error(payload.error);
    setTravelers(payload.travelers ?? []);
  }, [children, headers, locale, loyalty, pets, query]);
  const open = useCallback(
    async (id: string) => {
      setBusy(true);
      try {
        const response = await fetch(`/api/admin/crm?profileId=${id}`, {
          headers,
          cache: "no-store",
        });
        const payload = (await response.json()) as CrmTravelerDetail & { error?: string };
        if (!response.ok) throw new Error(payload.error);
        setDetail(payload);
        const url = new URL(window.location.href);
        url.searchParams.set("view", "voyageurs");
        url.searchParams.set("profile", id);
        window.history.replaceState({}, "", url);
      } catch (error) {
        notify(error instanceof Error ? error.message : "Fiche indisponible.");
      } finally {
        setBusy(false);
      }
    },
    [headers, notify],
  );
  const mutate = async (body: Record<string, unknown>, message: string) => {
    if (!detail) return;
    setBusy(true);
    try {
      const response = await fetch("/api/admin/crm", {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ profileId: detail.id, ...body }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error);
      await Promise.all([open(detail.id), loadList()]);
      notify(message);
    } catch (error) {
      notify(error instanceof Error ? error.message : "Modification impossible.");
      setBusy(false);
    }
  };
  useEffect(() => {
    const timer = window.setTimeout(
      () => void loadList().catch(() => notify("CRM indisponible.")),
      180,
    );
    return () => window.clearTimeout(timer);
  }, [loadList, notify]);
  useEffect(() => {
    const parameters = new URL(window.location.href).searchParams;
    const id = parameters.get("profile");
    const guestId = parameters.get("guest");
    if (id) void open(id);
    else if (guestId) {
      setBusy(true);
      void fetch(`/api/admin/crm?guestId=${guestId}`, { headers, cache: "no-store" })
        .then(async (response) => {
          const payload = (await response.json()) as CrmTravelerDetail & { error?: string };
          if (!response.ok) throw new Error(payload.error);
          setDetail(payload);
        })
        .catch((error) => notify(error instanceof Error ? error.message : "Fiche indisponible."))
        .finally(() => setBusy(false));
    }
  }, [headers, notify, open]);

  const currentYear = new Date().getFullYear();
  const returningThisYear = travelers.filter(
    (item) => item.stays > 1 && item.lastVisit?.startsWith(String(currentYear)),
  ).length;
  const dormant = travelers.filter(
    (item) => item.lastVisit && item.lastVisit < `${currentYear - 1}-01-01`,
  ).length;

  if (detail)
    return (
      <TravelerFile
        detail={detail}
        busy={busy}
        onBack={() => {
          setDetail(null);
          const url = new URL(window.location.href);
          url.searchParams.delete("profile");
          window.history.replaceState({}, "", url);
        }}
        mutate={mutate}
      />
    );

  return (
    <section className="admin-panel crm-premium">
      <div className="admin-panel__heading">
        <div>
          <p className="eyebrow">Connaissance voyageurs</p>
          <h2>CRM Premium</h2>
        </div>
        <p>{travelers.length} dossier(s) unique(s)</p>
      </div>
      <div className="admin-kpis">
        <article>
          <span>Nouveaux voyageurs</span>
          <strong>{travelers.filter((item) => item.loyalty === "new").length}</strong>
        </article>
        <article>
          <span>Revenus récurrents</span>
          <strong>{returningThisYear}</strong>
          <small>voyageurs revenus cette année</small>
        </article>
        <article>
          <span>À retrouver</span>
          <strong>{dormant}</strong>
          <small>absents depuis plus d’un an</small>
        </article>
        <article>
          <span>Meilleur client</span>
          <strong>{travelers[0] ? money(travelers[0].totalSpentCents) : "—"}</strong>
          <small>
            {travelers[0] ? `${travelers[0].firstName} ${travelers[0].lastName}` : "Aucun séjour"}
          </small>
        </article>
      </div>
      <div className="crm-filters">
        <label>
          Recherche globale
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Nom, e-mail, téléphone, réservation, maison…"
          />
        </label>
        <label>
          Fidélité
          <select value={loyalty} onChange={(event) => setLoyalty(event.target.value)}>
            <option value="">Tous les statuts</option>
            {Object.entries(loyaltyLabels).map(([value, label]) => (
              <option value={value} key={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Langue
          <select value={locale} onChange={(event) => setLocale(event.target.value)}>
            <option value="">Toutes</option>
            <option value="fr">Français</option>
            <option value="en">Anglais</option>
            <option value="de">Allemand</option>
            <option value="es">Espagnol</option>
          </select>
        </label>
        <label className="crm-check">
          <input
            type="checkbox"
            checked={pets}
            onChange={(event) => setPets(event.target.checked)}
          />{" "}
          Avec animaux
        </label>
        <label className="crm-check">
          <input
            type="checkbox"
            checked={children}
            onChange={(event) => setChildren(event.target.checked)}
          />{" "}
          Avec enfants
        </label>
      </div>
      <div className="admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Voyageur</th>
              <th>Séjours</th>
              <th>Dépenses</th>
              <th>Dernière visite</th>
              <th>Profil</th>
              <th>Fidélité</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {travelers.map((traveler) => (
              <tr key={traveler.id}>
                <td>
                  <strong>
                    {traveler.firstName} {traveler.lastName}
                  </strong>
                  <small>
                    {traveler.email}
                    <br />
                    {traveler.phone}
                  </small>
                </td>
                <td>{traveler.stays}</td>
                <td>{money(traveler.totalSpentCents)}</td>
                <td>{shortDate(traveler.lastVisit)}</td>
                <td>
                  {[
                    traveler.children && "Famille",
                    traveler.pets && "Animal",
                    traveler.locale.toUpperCase(),
                    traveler.countryCode,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </td>
                <td>
                  <span className={`loyalty-badge loyalty-badge--${traveler.loyalty}`}>
                    {loyaltyLabels[traveler.loyalty]}
                  </span>
                </td>
                <td>
                  <button type="button" disabled={busy} onClick={() => void open(traveler.id)}>
                    Ouvrir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!travelers.length && (
        <p className="admin-empty">Aucun voyageur ne correspond aux filtres.</p>
      )}
    </section>
  );
}

function TravelerFile({
  detail,
  busy,
  onBack,
  mutate,
}: {
  detail: CrmTravelerDetail;
  busy: boolean;
  onBack: () => void;
  mutate: (body: Record<string, unknown>, message: string) => Promise<void>;
}) {
  const submitProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const value = (name: string) => String(form.get(name) ?? "").trim() || null;
    void mutate(
      {
        action: "update",
        first_name: value("first_name"),
        last_name: value("last_name"),
        phone: value("phone"),
        address_line1: value("address_line1"),
        address_line2: value("address_line2"),
        postal_code: value("postal_code"),
        city: value("city"),
        country_code: value("country_code"),
        locale: value("locale"),
        floor_preference: value("floor_preference"),
        room_preference: value("room_preference"),
        sleeping_preferences: value("sleeping_preferences"),
        arrival_preferences: value("arrival_preferences"),
        allergies: value("allergies"),
        dietary_preferences: value("dietary_preferences"),
        useful_comments: value("useful_comments"),
        internal_notes: value("internal_notes"),
        loyalty_override: value("loyalty_override"),
      },
      "Dossier voyageur mis à jour et historisé.",
    );
  };
  const submitActivity = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    void mutate(
      {
        action: "activity",
        kind: form.get("kind"),
        direction: "internal",
        subject: form.get("subject"),
        details: String(form.get("details") ?? "") || null,
        reservation_id: null,
      },
      "Interaction ajoutée à la chronologie.",
    );
    event.currentTarget.reset();
  };
  return (
    <section className="admin-panel crm-file">
      <div className="admin-panel__heading">
        <div>
          <button type="button" className="admin-link-button" onClick={onBack}>
            ← Tous les voyageurs
          </button>
          <p className="eyebrow">Dossier voyageur unique</p>
          <h2>
            {detail.firstName} {detail.lastName}
          </h2>
        </div>
        <span className={`loyalty-badge loyalty-badge--${detail.loyalty}`}>
          {loyaltyLabels[detail.loyalty]}
        </span>
      </div>
      <div className="admin-kpis">
        <article>
          <span>Séjours</span>
          <strong>{detail.stays}</strong>
        </article>
        <article>
          <span>Total dépensé</span>
          <strong>{money(detail.totalSpentCents)}</strong>
        </article>
        <article>
          <span>Moyenne / séjour</span>
          <strong>{money(detail.averageSpendCents)}</strong>
        </article>
        <article>
          <span>Première → dernière visite</span>
          <strong>{shortDate(detail.firstVisit)}</strong>
          <small>→ {shortDate(detail.lastVisit)}</small>
        </article>
      </div>
      <form className="admin-editor" onSubmit={submitProfile}>
        <h3>Identité & préférences</h3>
        <div className="admin-form-grid">
          <label>
            Prénom
            <input name="first_name" defaultValue={detail.firstName} required />
          </label>
          <label>
            Nom
            <input name="last_name" defaultValue={detail.lastName} required />
          </label>
          <label>
            E-mail
            <input value={detail.email} disabled />
          </label>
          <label>
            Téléphone
            <input name="phone" defaultValue={detail.phone} />
          </label>
          <label>
            Adresse
            <input name="address_line1" defaultValue={detail.address.line1} />
          </label>
          <label>
            Complément
            <input name="address_line2" defaultValue={detail.address.line2} />
          </label>
          <label>
            Code postal
            <input name="postal_code" defaultValue={detail.address.postalCode} />
          </label>
          <label>
            Ville
            <input name="city" defaultValue={detail.address.city} />
          </label>
          <label>
            Pays
            <input name="country_code" defaultValue={detail.countryCode || "FR"} maxLength={2} />
          </label>
          <label>
            Langue
            <select name="locale" defaultValue={detail.locale}>
              {["fr", "en", "de", "es"].map((locale) => (
                <option key={locale}>{locale}</option>
              ))}
            </select>
          </label>
          <label>
            Étage préféré
            <input name="floor_preference" defaultValue={detail.preferences.floor} />
          </label>
          <label>
            Chambre préférée
            <input name="room_preference" defaultValue={detail.preferences.room} />
          </label>
          <label>
            Literie / équipements
            <input name="sleeping_preferences" defaultValue={detail.preferences.sleeping} />
          </label>
          <label>
            Arrivée habituelle
            <input name="arrival_preferences" defaultValue={detail.preferences.arrival} />
          </label>
          <label>
            Allergies
            <textarea name="allergies" defaultValue={detail.preferences.allergies} />
          </label>
          <label>
            Préférences alimentaires
            <textarea name="dietary_preferences" defaultValue={detail.preferences.dietary} />
          </label>
          <label className="wide">
            Commentaires utiles
            <textarea name="useful_comments" defaultValue={detail.preferences.comments} />
          </label>
          <label className="wide">
            Notes internes privées
            <textarea name="internal_notes" defaultValue={detail.preferences.internalNotes} />
          </label>
          <label>
            Fidélité
            <select name="loyalty_override" defaultValue={detail.loyalty}>
              <option value="">Calcul automatique</option>
              {Object.entries(loyaltyLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button disabled={busy}>Enregistrer</button>
      </form>
      <div className="crm-file-grid">
        <article className="admin-card">
          <h3>Historique des séjours</h3>
          {detail.staysHistory.map((stay) => (
            <div className="crm-timeline-item" key={String(stay.id)}>
              <strong>
                {String(stay.propertyName)} · {String(stay.reference)}
              </strong>
              <span>
                {shortDate(String(stay.arrival))} → {shortDate(String(stay.departure))} ·{" "}
                {String(stay.nights)} nuit(s)
              </span>
              <small>
                {String(stay.channel)} · {String(Number(stay.adults) + Number(stay.children))}{" "}
                voyageur(s) · {money(Number(stay.total_cents))}
              </small>
              <a href={`?view=reservations&reservation=${stay.id}`}>Ouvrir le séjour</a>
              {Array.isArray(stay.items) && stay.items.length > 0 && (
                <ul>
                  {stay.items.map((item: Record<string, unknown>) => (
                    <li key={String(item.id)}>
                      {String(item.label)} · {money(Number(item.total_cents))}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </article>
        <article className="admin-card">
          <h3>Communications & notes</h3>
          <form onSubmit={submitActivity} className="crm-activity-form">
            <select name="kind">
              <option value="call">Appel noté</option>
              <option value="internal_note">Note interne</option>
              <option value="message">Message</option>
              <option value="email">E-mail</option>
              <option value="reminder">Relance</option>
            </select>
            <input name="subject" placeholder="Objet" required />
            <textarea name="details" placeholder="Détails" />
            <button disabled={busy}>Ajouter</button>
          </form>
          {detail.activities.map((item) => (
            <div className="crm-timeline-item" key={String(item.id)}>
              <strong>{String(item.subject)}</strong>
              <span>
                {String(item.kind)} · {new Date(String(item.occurred_at)).toLocaleString("fr-FR")}
              </span>
              <small>{String(item.details ?? "")}</small>
            </div>
          ))}
        </article>
        <article className="admin-card">
          <h3>Documents</h3>
          {detail.documents.map((document) => (
            <div className="crm-timeline-item" key={`${document.type}-${document.id}`}>
              <strong>{String(document.number ?? document.type)}</strong>
              <span>
                {String(document.type)} · {String(document.status)}
              </span>
            </div>
          ))}
          {!detail.documents.length && <p className="admin-empty">Aucun document.</p>}
        </article>
        <article className="admin-card">
          <h3>Paiements</h3>
          {detail.payments.map((payment) => (
            <div className="crm-timeline-item" key={String(payment.id)}>
              <strong>{money(Number(payment.amount_cents))}</strong>
              <span>
                {String(payment.kind)} · {String(payment.status)}
              </span>
            </div>
          ))}
        </article>
        <article className="admin-card">
          <h3>Animaux</h3>
          {detail.petsHistory.map((pet) => (
            <div key={String(pet.id)} className="crm-timeline-item">
              <strong>{String(pet.name ?? pet.animal_type)}</strong>
              <small>{String(pet.useful_information ?? "")}</small>
            </div>
          ))}
          <CompanionForm kind="pet" busy={busy} mutate={mutate} />
        </article>
        <article className="admin-card">
          <h3>Enfants & équipements</h3>
          {detail.childrenHistory.map((child) => (
            <div key={String(child.id)} className="crm-timeline-item">
              <strong>{String(child.first_name ?? "Enfant")}</strong>
              <small>
                {Array.isArray(child.equipment_preferences)
                  ? child.equipment_preferences.join(" · ")
                  : ""}
              </small>
            </div>
          ))}
          <CompanionForm kind="child" busy={busy} mutate={mutate} />
        </article>
      </div>
    </section>
  );
}

function CompanionForm({
  kind,
  busy,
  mutate,
}: {
  kind: "pet" | "child";
  busy: boolean;
  mutate: (body: Record<string, unknown>, message: string) => Promise<void>;
}) {
  return (
    <form
      className="crm-companion-form"
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        if (kind === "pet")
          void mutate(
            {
              action: "pet",
              name: String(form.get("name") ?? "") || null,
              animal_type: form.get("type") || "chien",
              useful_information: String(form.get("info") ?? "") || null,
            },
            "Animal ajouté.",
          );
        else
          void mutate(
            {
              action: "child",
              first_name: String(form.get("name") ?? "") || null,
              birth_year: Number(form.get("year")) || null,
              equipment_preferences: form.getAll("equipment"),
              useful_information: String(form.get("info") ?? "") || null,
            },
            "Informations enfant ajoutées.",
          );
      }}
    >
      <input name="name" placeholder={kind === "pet" ? "Nom" : "Prénom"} />
      {kind === "pet" ? (
        <input name="type" placeholder="Type (chien, chat…)" defaultValue="chien" required />
      ) : (
        <>
          <input name="year" type="number" min="2000" max="2100" placeholder="Année de naissance" />
          <label>
            <input type="checkbox" name="equipment" value="lit-parapluie" /> Lit parapluie
          </label>
          <label>
            <input type="checkbox" name="equipment" value="chaise-haute" /> Chaise haute
          </label>
          <label>
            <input type="checkbox" name="equipment" value="baignoire" /> Baignoire
          </label>
          <label>
            <input type="checkbox" name="equipment" value="poussette" /> Poussette
          </label>
        </>
      )}
      <input name="info" placeholder="Informations utiles" />
      <button disabled={busy}>Ajouter</button>
    </form>
  );
}
