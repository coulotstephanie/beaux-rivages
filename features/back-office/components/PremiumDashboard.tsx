import {
  AlertTriangle,
  ArrowRight,
  CloudSun,
  Droplets,
  MessageCircle,
} from "lucide-react";
import { dashboardMetrics, properties } from "../demo-data";

const priorities = [
  { time: "09:30", title: "Arrivée famille Martin", detail: "Le Chai · 4 voyageurs · accueil personnalisé" },
  { time: "11:00", title: "Départ Villa Raie Manta", detail: "Ménage confirmé avec Nadia" },
  { time: "14:00", title: "Intervention chauffe-eau", detail: "Le Nid d’Été · prestataire prévenu" },
  { time: "17:00", title: "Arrivée Sophie Bernard", detail: "Villa Raie Manta · contrat signé" },
];

export function PremiumDashboard() {
  return (
    <div className="bo-page">
      <div className="bo-page__heading">
        <div>
          <p className="bo-eyebrow">Jeudi 30 juillet 2026</p>
          <h1>Bonjour Stéphanie.</h1>
          <p>Voici l’essentiel de votre journée, sans rien laisser passer.</p>
        </div>
        <button className="bo-primary" type="button">+ Nouvelle réservation</button>
      </div>

      <section className="bo-weather-grid" aria-label="Météo et marées">
        <article>
          <CloudSun aria-hidden="true" />
          <div><small>Île de Ré</small><strong>24 °C · Ensoleillé</strong></div>
          <span>Vent 18 km/h</span>
        </article>
        <article>
          <Droplets aria-hidden="true" />
          <div><small>Marées</small><strong>Haute à 11:42</strong></div>
          <span>Basse à 17:58</span>
        </article>
      </section>

      <section className="bo-metrics" aria-label="Indicateurs du jour">
        {dashboardMetrics.map((metric) => (
          <article key={metric.label} data-tone={metric.tone ?? "default"}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.detail}</small>
          </article>
        ))}
      </section>

      <div className="bo-dashboard-grid">
        <section className="bo-card bo-agenda">
          <div className="bo-card__heading">
            <div><p className="bo-eyebrow">Aujourd’hui</p><h2>Les temps forts</h2></div>
            <button type="button">Voir le calendrier <ArrowRight /></button>
          </div>
          <ol>
            {priorities.map((item) => (
              <li key={`${item.time}-${item.title}`}>
                <time>{item.time}</time>
                <span />
                <div><strong>{item.title}</strong><small>{item.detail}</small></div>
              </li>
            ))}
          </ol>
        </section>

        <section className="bo-card">
          <div className="bo-card__heading">
            <div><p className="bo-eyebrow">Maisons</p><h2>Occupation</h2></div>
          </div>
          <div className="bo-house-status">
            {properties.map((property, index) => (
              <article key={property.id}>
                <i style={{ backgroundColor: property.color }} />
                <div><strong>{property.name}</strong><small>{index === 2 ? "Disponible · prête" : "Occupée jusqu’au 3 août"}</small></div>
                <span className={index === 2 ? "is-free" : ""}>{index === 2 ? "Libre" : "Occupée"}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="bo-card bo-attention">
          <div className="bo-card__heading">
            <div><p className="bo-eyebrow">À traiter</p><h2>Priorités</h2></div>
          </div>
          <button type="button"><AlertTriangle /><span><strong>1 incident ouvert</strong><small>Chauffe-eau · Nid d’Été</small></span><ArrowRight /></button>
          <button type="button"><MessageCircle /><span><strong>7 messages non lus</strong><small>2 attendent une réponse rapide</small></span><ArrowRight /></button>
        </section>
      </div>
    </div>
  );
}
