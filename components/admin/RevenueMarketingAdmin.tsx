"use client";

import Image from "next/image";
import { FormEvent, useCallback, useEffect, useState } from "react";

type RevenueSnapshot = {
  generatedAt: string;
  kpis: { directBookings: number; revenueCents: number; averageBasketCents: number; returningGuestRate: number; loyalTravelers: number; giftCardsSoldCents: number; promotionUses: number; signaturePacks: number };
  crm: { id: string; first_name: string; last_name: string; email: string; locale: string; country_code: string | null; acquisition_channel: string; stays: number; totalSpentCents: number; directStays: number; children: boolean; pets: boolean; experienceCodes: string[]; tier: string; loyaltyLabel: string; lastStay: string | null }[];
  giftCards: { id: string; public_code: string; initial_amount_cents: number; balance_cents: number; status: string; expires_at: string }[];
  promotions: { id: string; code: string; label: string; discount_type: string; value: number; enabled: boolean; usage_count: number; ends_at: string }[];
  campaigns: { id: string; name: string; kind: string; status: string; locale: string; scheduled_at: string | null; delivered_count: number; opened_count: number; revenue_cents: number }[];
  reviews: { platform: string; status: string; rating: number | null }[];
  experiences: { id: string; code: string; label: string; description: string; price_cents: number; image_path: string | null; enabled: boolean }[];
  analytics: { optionRevenue: { label: string; revenueCents: number; count: number }[]; channels: [string, number][]; directShare: number };
  recommendations: { priority: string; title: string; detail: string }[];
};

type Section = "dashboard" | "crm" | "experiences" | "loyalty" | "gift-cards" | "promotions" | "campaigns" | "reviews" | "analysis";
const sections: { id: Section; label: string }[] = [
  { id: "dashboard", label: "Vue commerciale" }, { id: "crm", label: "CRM voyageurs" },
  { id: "experiences", label: "Expériences" }, { id: "loyalty", label: "Fidélité" },
  { id: "gift-cards", label: "Cartes cadeaux" }, { id: "promotions", label: "Codes privilèges" },
  { id: "campaigns", label: "Campagnes" }, { id: "reviews", label: "Avis" }, { id: "analysis", label: "Assistant commercial" },
];
const money = (cents: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(cents / 100);

export function RevenueMarketingAdmin({ token, notify }: { token: string; notify: (message: string) => void }) {
  const [data, setData] = useState<RevenueSnapshot | null>(null);
  const [section, setSection] = useState<Section>("dashboard");
  const [busy, setBusy] = useState(false);
  const [giftPreview, setGiftPreview] = useState<{ code: string; qrDataUrl: string } | null>(null);
  const call = useCallback(async (init?: RequestInit) => fetch("/api/admin/revenue", { ...init, headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...(init?.headers ?? {}) } }), [token]);
  const load = useCallback(async () => {
    setBusy(true);
    try {
      const response = await call();
      const payload = await response.json() as RevenueSnapshot & { error?: string };
      if (!response.ok) return notify(payload.error ?? "Module commercial indisponible.");
      setData(payload);
    } finally { setBusy(false); }
  }, [call, notify]);
  useEffect(() => { void load(); }, [load]);
  const act = async (payload: Record<string, unknown>) => {
    setBusy(true);
    try {
      const response = await call({ method: "POST", body: JSON.stringify(payload) });
      const result = await response.json() as { error?: string; result?: { public_code?: string; qrDataUrl?: string } };
      if (!response.ok) return notify(result.error ?? "Création impossible.");
      if (payload.action === "create_gift_card" && result.result?.public_code && result.result.qrDataUrl) {
        setGiftPreview({ code: result.result.public_code, qrDataUrl: result.result.qrDataUrl });
      }
      notify("Élément commercial enregistré.");
      await load();
    } finally { setBusy(false); }
  };
  if (!data) return <section className="admin-panel"><p className="admin-empty">{busy ? "Lecture des données commerciales…" : "Aucune donnée commerciale disponible."}</p><button type="button" onClick={() => void load()}>Réessayer</button></section>;
  return <section className="admin-panel revenue-admin">
    <div className="admin-panel__heading"><div><p className="eyebrow">Revenue & Marketing Engine</p><h2>Développer la relation, avec justesse.</h2></div><p>Réservation directe, fidélité et expériences réunies sans pression commerciale.</p></div>
    <nav className="revenue-admin__nav" aria-label="Rubriques commerciales">{sections.map((item) => <button key={item.id} type="button" aria-current={section === item.id ? "page" : undefined} onClick={() => setSection(item.id)}>{item.label}</button>)}</nav>
    {section === "dashboard" && <><div className="admin-kpis admin-kpis--revenue"><article><span>Réservations directes</span><strong>{data.kpis.directBookings}</strong></article><article><span>Chiffre d’affaires</span><strong>{money(data.kpis.revenueCents)}</strong></article><article><span>Panier moyen</span><strong>{money(data.kpis.averageBasketCents)}</strong></article><article><span>Fidélisation</span><strong>{data.kpis.returningGuestRate} %</strong></article><article><span>Pack Signature</span><strong>{data.kpis.signaturePacks}</strong></article></div><div className="admin-two-columns"><article className="admin-card"><h3>Canaux d’acquisition</h3>{data.analytics.channels.map(([channel, count]) => <div className="revenue-line" key={channel}><span>{channel}</span><strong>{count}</strong></div>)}</article><article className="admin-card"><h3>Expériences les plus choisies</h3>{data.analytics.optionRevenue.slice(0, 6).map((item) => <div className="revenue-line" key={item.label}><span>{item.label} · {item.count}</span><strong>{money(item.revenueCents)}</strong></div>)}</article></div></>}
    {section === "crm" && <div className="admin-table-wrap"><table><thead><tr><th>Voyageur</th><th>Langue</th><th>Origine</th><th>Séjours</th><th>Dépensé</th><th>Profil</th><th>Fidélité</th></tr></thead><tbody>{data.crm.map((guest) => <tr key={guest.id}><td><strong>{guest.first_name} {guest.last_name}</strong><small>{guest.email}</small></td><td>{guest.locale.toUpperCase()}<small>{guest.country_code ?? "Pays non renseigné"}</small></td><td>{guest.acquisition_channel}</td><td>{guest.stays}<small>{guest.directStays} en direct</small></td><td>{money(guest.totalSpentCents)}</td><td>{[guest.children && "Famille", guest.pets && "Animal", ...guest.experienceCodes.slice(0, 2)].filter(Boolean).join(" · ") || "À enrichir"}</td><td><span className={`loyalty-badge loyalty-badge--${guest.tier}`}>{guest.loyaltyLabel}</span></td></tr>)}</tbody></table></div>}
    {section === "experiences" && <div className="revenue-experiences">{data.experiences.map((item) => <article key={item.id}>{item.image_path && <div><Image src={item.image_path} alt="" fill sizes="(max-width: 700px) 100vw, 33vw" /></div>}<span>Personnalisez votre séjour</span><h3>{item.label}</h3><p>{item.description}</p><strong>{money(item.price_cents)}</strong><button type="button">Ajouter</button></article>)}</div>}
    {section === "loyalty" && <div className="loyalty-levels">{[["Découverte","Première attention et découverte de l’univers."],["Insulaire","Priorité et départ tardif selon disponibilité."],["Grand Large","Avantage fidélité et arrivée anticipée."],["Ambassadeur","Priorité renforcée et attention Signature selon règles."]].map(([title, copy], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p><strong>{data.crm.filter((guest) => guest.loyaltyLabel === title).length} voyageur(s)</strong></article>)}</div>}
    {section === "gift-cards" && <><GiftCardForm busy={busy} submit={act} />{giftPreview && <aside className="gift-card-preview"><Image src={giftPreview.qrDataUrl} alt={`QR Code de la carte ${giftPreview.code}`} width={180} height={180} unoptimized /><div><span>Carte cadeau créée</span><strong>{giftPreview.code}</strong><p>Enregistrez ce QR Code maintenant : le jeton complet n’est jamais conservé en clair.</p></div></aside>}<div className="admin-table-wrap"><table><thead><tr><th>Code</th><th>Valeur</th><th>Solde</th><th>Expiration</th><th>Statut</th></tr></thead><tbody>{data.giftCards.map((card) => <tr key={card.id}><td><strong>{card.public_code}</strong></td><td>{money(card.initial_amount_cents)}</td><td>{money(card.balance_cents)}</td><td>{new Date(card.expires_at).toLocaleDateString("fr-FR")}</td><td>{card.status}</td></tr>)}</tbody></table></div></>}
    {section === "promotions" && <><PromotionForm busy={busy} submit={act} /><div className="admin-table-wrap"><table><thead><tr><th>Code</th><th>Privilège</th><th>Usage</th><th>Expiration</th><th>État</th></tr></thead><tbody>{data.promotions.map((promotion) => <tr key={promotion.id}><td><strong>{promotion.code}</strong></td><td>{promotion.discount_type === "percentage" ? `${promotion.value} %` : money(promotion.value)}</td><td>{promotion.usage_count}</td><td>{new Date(promotion.ends_at).toLocaleDateString("fr-FR")}</td><td>{promotion.enabled ? "Actif" : "Suspendu"}</td></tr>)}</tbody></table></div></>}
    {section === "campaigns" && <><CampaignForm busy={busy} submit={act} /><div className="admin-table-wrap"><table><thead><tr><th>Campagne</th><th>Type</th><th>Langue</th><th>Statut</th><th>Livrés</th><th>Ouverts</th><th>Revenu</th></tr></thead><tbody>{data.campaigns.map((campaign) => <tr key={campaign.id}><td><strong>{campaign.name}</strong></td><td>{campaign.kind}</td><td>{campaign.locale.toUpperCase()}</td><td>{campaign.status}</td><td>{campaign.delivered_count}</td><td>{campaign.opened_count}</td><td>{money(campaign.revenue_cents)}</td></tr>)}</tbody></table></div></>}
    {section === "reviews" && <div className="admin-kpis"><article><span>Demandes</span><strong>{data.reviews.length}</strong></article>{["airbnb","booking","google","direct"].map((platform) => <article key={platform}><span>{platform}</span><strong>{data.reviews.filter((review) => review.platform === platform && review.status === "reviewed").length}</strong><small>avis reçus</small></article>)}</div>}
    {section === "analysis" && <div className="commercial-advisor">{data.recommendations.map((item, index) => <article key={item.title}><span>0{index + 1} · priorité {item.priority}</span><h3>{item.title}</h3><p>{item.detail}</p><button type="button" onClick={() => setSection("campaigns")}>Préparer une campagne</button></article>)}</div>}
  </section>;
}

function GiftCardForm({ busy, submit }: { busy: boolean; submit: (value: Record<string, unknown>) => Promise<void> }) {
  return <form className="admin-editor" onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); const amount = Number(form.get("amount")); const custom = Number(form.get("custom")); void submit({ action: "create_gift_card", amountCents: (amount || custom) * 100, recipientName: form.get("recipient"), expiresAt: new Date(String(form.get("expiry"))).toISOString() }); }}><h3>Créer une carte cadeau</h3><div className="admin-form-grid"><label>Valeur<select name="amount" defaultValue="100"><option value="100">100 €</option><option value="250">250 €</option><option value="500">500 €</option><option value="">Personnalisée</option></select></label><label>Valeur personnalisée<input name="custom" type="number" min="50" max="5000" /></label><label>Destinataire<input name="recipient" /></label><label>Expiration<input name="expiry" type="date" required /></label></div><div className="admin-editor__actions"><button disabled={busy}>Générer avec QR Code</button></div></form>;
}
function PromotionForm({ busy, submit }: { busy: boolean; submit: (value: Record<string, unknown>) => Promise<void> }) {
  return <form className="admin-editor" onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); void submit({ action: "create_promotion", code: form.get("code"), label: form.get("label"), discountType: form.get("type"), value: Number(form.get("value")), minimumStayNights: Number(form.get("nights")) || undefined, directOnly: form.get("direct") === "on", returningGuestsOnly: form.get("returning") === "on", lowSeasonOnly: form.get("low") === "on", startsAt: new Date(String(form.get("start"))).toISOString(), endsAt: new Date(String(form.get("end"))).toISOString() }); }}><h3>Créer un code privilège</h3><div className="admin-form-grid"><label>Code<input name="code" required /></label><label>Nom interne<input name="label" required /></label><label>Type<select name="type"><option value="percentage">Pourcentage</option><option value="fixed">Montant fixe en centimes</option></select></label><label>Valeur<input name="value" type="number" min="1" required /></label><label>Séjour minimum<input name="nights" type="number" min="1" /></label><label>Début<input name="start" type="date" required /></label><label>Fin<input name="end" type="date" required /></label><label><input name="direct" type="checkbox" defaultChecked /> Réservation directe uniquement</label><label><input name="returning" type="checkbox" /> Anciens voyageurs</label><label><input name="low" type="checkbox" /> Basse saison</label></div><div className="admin-editor__actions"><button disabled={busy}>Créer le privilège</button></div></form>;
}
function CampaignForm({ busy, submit }: { busy: boolean; submit: (value: Record<string, unknown>) => Promise<void> }) {
  return <form className="admin-editor" onSubmit={(event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const form = new FormData(event.currentTarget); void submit({ action: "create_campaign", name: form.get("name"), kind: form.get("kind"), locale: form.get("locale"), subject: form.get("subject"), preheader: form.get("preheader") || undefined, contentBlocks: [{ type: "heading", content: form.get("heading") }, { type: "text", content: form.get("content") }], scheduledAt: form.get("schedule") ? new Date(String(form.get("schedule"))).toISOString() : undefined }); }}><h3>Éditeur de campagne</h3><div className="admin-form-grid"><label>Nom<input name="name" required /></label><label>Type<select name="kind"><option value="news">Actualités</option><option value="new-offer">Nouveautés</option><option value="school-holiday">Vacances scolaires</option><option value="last-availability">Dernières disponibilités</option><option value="christmas">Noël</option><option value="spring">Printemps</option><option value="summer">Été</option><option value="autumn">Automne</option></select></label><label>Langue<select name="locale"><option value="fr">Français</option><option value="en">English</option><option value="de">Deutsch</option></select></label><label>Programmation<input name="schedule" type="datetime-local" /></label><label className="wide">Objet<input name="subject" required /></label><label className="wide">Pré-en-tête<input name="preheader" /></label><label className="wide">Titre du message<input name="heading" required /></label><label className="wide">Texte<textarea name="content" rows={5} required /></label></div><div className="admin-editor__actions"><button disabled={busy}>Enregistrer sans envoyer</button></div></form>;
}
