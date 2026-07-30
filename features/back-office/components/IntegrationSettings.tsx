import { CalendarSync, CheckCircle2, CircleDashed, CreditCard, Mail, MessageSquareText, ShieldCheck } from "lucide-react";
import type { IntegrationStatus } from "@/platform/integrations/status";

const icons = { stripe: CreditCard, email: Mail, sms: MessageSquareText, ical: CalendarSync, "google-calendar": CalendarSync };

export function IntegrationSettings({ statuses }: { statuses: IntegrationStatus[] }) {
  return <main className="bo-page">
    <header className="bo-page__heading"><div><p className="bo-eyebrow">Connecteurs serveur</p><h1>Intégrations</h1><p>Configurez les services sans jamais exposer leurs secrets dans le navigateur.</p></div></header>
    <p className="bo-secure-banner"><ShieldCheck /> Les clés restent dans l’environnement serveur. Cet écran n’affiche que l’état de configuration.</p>
    <section className="bo-integration-settings">
      {statuses.map((status) => {
        const Icon = icons[status.id];
        return <article key={status.id}>
          <header><i><Icon /></i><div><h2>{status.label}</h2><small>{status.mode}</small></div><span className={status.configured ? "is-connected" : ""}>{status.configured ? <CheckCircle2 /> : <CircleDashed />}{status.configured ? "Configuré" : "À configurer"}</span></header>
          <p>{status.configured ? "Les variables requises sont présentes. Une validation fonctionnelle reste nécessaire avant activation." : `Variables attendues : ${status.missing.join(", ")}`}</p>
          <footer><button type="button" disabled={!status.configured}>Tester la configuration</button><button type="button">Voir la documentation</button></footer>
        </article>;
      })}
    </section>
    <section className="bo-card"><div className="bo-card__heading"><div><p className="bo-eyebrow">Sécurité</p><h2>Activation contrôlée</h2></div></div><ul className="bo-integration-rules"><li>Stripe reste en mode test tant que `STRIPE_ALLOW_LIVE` vaut `false`.</li><li>iCal importe uniquement des flux HTTPS provenant d’hôtes autorisés.</li><li>Google Calendar utilise OAuth 2.0 et le périmètre minimal nécessaire.</li><li>Email et SMS exigent une clé d’idempotence pour limiter les doublons.</li><li>Aucun secret n’est enregistré depuis cette interface.</li></ul></section>
  </main>;
}
