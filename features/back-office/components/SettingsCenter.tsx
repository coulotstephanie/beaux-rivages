"use client";

import { Building2, CreditCard, Database, Mail, PawPrint, Save, ShieldCheck, Smartphone, Users } from "lucide-react";
import { useState } from "react";

const sections = [
  { id: "etablissement", label: "Établissement", icon: Building2 },
  { id: "commercial", label: "Règles commerciales", icon: PawPrint },
  { id: "messages", label: "Modèles", icon: Mail },
  { id: "equipe", label: "Utilisateurs & rôles", icon: Users },
  { id: "integrations", label: "Synchronisations", icon: Database },
];

export function SettingsCenter() {
  const [active, setActive] = useState("etablissement");
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  return (
    <main className="bo-page">
      <header className="bo-page__heading">
        <div>
          <p className="bo-eyebrow">Centre de paramètres</p>
          <h1>Votre maison, vos règles</h1>
          <p>Une configuration claire, sans exposer les secrets techniques.</p>
        </div>
        <button className="bo-primary" type="button" onClick={save}><Save /> Enregistrer</button>
      </header>

      {saved && <p className="bo-toast" role="status"><ShieldCheck /> Modifications enregistrées dans cette démonstration.</p>}

      <div className="bo-settings-layout">
        <nav className="bo-settings-nav" aria-label="Rubriques des paramètres">
          {sections.map(({ id, label, icon: Icon }) => (
            <button key={id} type="button" className={active === id ? "is-active" : ""} onClick={() => setActive(id)}>
              <Icon /> {label}
            </button>
          ))}
        </nav>

        <section className="bo-card bo-settings-panel">
          {active === "etablissement" && <>
            <div className="bo-card__heading"><div><h2>Coordonnées</h2><p className="bo-muted">Informations affichées dans les échanges et documents.</p></div></div>
            <div className="bo-settings-fields">
              <label>Nom commercial<input defaultValue="Beaux Rivages" /></label>
              <label>Téléphone<input type="tel" defaultValue="+33 6 00 00 00 00" /></label>
              <label>Email<input type="email" defaultValue="bonjour@beaux-rivages.fr" /></label>
              <label>IBAN<input defaultValue="FR76 •••• •••• •••• 0123" aria-describedby="iban-help" /></label>
            </div>
            <small id="iban-help" className="bo-secure-note"><ShieldCheck /> L’IBAN est masqué. Les secrets ne sont jamais affichés dans l’interface.</small>
          </>}

          {active === "commercial" && <>
            <div className="bo-card__heading"><div><h2>Règles commerciales</h2><p className="bo-muted">Valeurs communes aux trois maisons.</p></div></div>
            <div className="bo-settings-fields">
              <label>Taxe de séjour (€ / adulte)<input type="number" defaultValue="1.65" step="0.01" /></label>
              <label>Frais animaux (€ / séjour)<input type="number" defaultValue="35" /></label>
              <label>Animaux acceptés<select defaultValue="yes"><option value="yes">Oui, sur demande</option><option value="no">Non</option></select></label>
              <label>Pack Signature (€)<input type="number" defaultValue="149" /></label>
            </div>
            <div className="bo-settings-links"><a href="/administration/tarifs">Ouvrir le calendrier tarifaire</a><a href="/administration/tarifs">Gérer les services additionnels</a></div>
          </>}

          {active === "messages" && <>
            <div className="bo-card__heading"><div><h2>Modèles de communication</h2><p className="bo-muted">Les modèles sont préparés ici et édités dans le Centre de Communication.</p></div></div>
            <div className="bo-settings-list">
              {["Email de bienvenue", "Email avant arrivée", "SMS code boîte à clés", "Email de remerciement"].map((label, index) => <article key={label}><span>{index === 2 ? <Smartphone /> : <Mail />}<strong>{label}</strong></span><i>Actif</i><a href="/administration/communications">Modifier</a></article>)}
            </div>
          </>}

          {active === "equipe" && <>
            <div className="bo-card__heading"><div><h2>Utilisateurs & permissions</h2><p className="bo-muted">Définissez précisément les droits de chaque rôle.</p></div></div>
            <div className="bo-settings-list">
              <article><span><Users /><strong>Stéphanie</strong><small>Administratrice</small></span><i>Actif</i><button type="button">Gérer</button></article>
              <article><span><Users /><strong>Bruno</strong><small>Administrateur</small></span><i>Actif</i><button type="button">Gérer</button></article>
            </div>
            <div className="bo-permission-matrix" role="table" aria-label="Permissions par rôle">
              <div role="row"><strong>Permission</strong><strong>Administrateur</strong><strong>Exploitation</strong><strong>Lecture</strong></div>
              {["Réservations", "Tarifs", "Voyageurs", "Communications", "CMS", "Paramètres"].map((permission, index) => <div role="row" key={permission}><span>{permission}</span><input aria-label={`${permission} administrateur`} type="checkbox" defaultChecked /><input aria-label={`${permission} exploitation`} type="checkbox" defaultChecked={index < 4} /><input aria-label={`${permission} lecture`} type="checkbox" defaultChecked={index !== 1 && index !== 5} /></div>)}
            </div>
            <button className="bo-secondary" type="button">Inviter un utilisateur</button>
          </>}

          {active === "integrations" && <>
            <div className="bo-card__heading"><div><h2>Synchronisations & services</h2><p className="bo-muted">État indicatif : aucune connexion n’est créée depuis cette interface.</p></div></div>
            <div className="bo-integration-grid">
              <article><Database /><div><strong>Supabase</strong><small>Données et authentification</small></div><i>À configurer</i></article>
              <article><CreditCard /><div><strong>Stripe</strong><small>Paiements sécurisés</small></div><i>À configurer</i></article>
              <article><Database /><div><strong>Calendriers externes</strong><small>Airbnb · Booking · Abritel</small></div><i>Prévu</i></article>
              <article><Smartphone /><div><strong>Fournisseur SMS</strong><small>Aucun fournisseur connecté</small></div><i>Inactif</i></article>
            </div>
            <div className="bo-settings-links"><a href="/administration/parametres/integrations">Ouvrir le centre des intégrations</a></div>
          </>}
        </section>
      </div>
    </main>
  );
}
