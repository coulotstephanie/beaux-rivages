import { reviewsVerifiedOn, totalPublicPlatformReviews, weightedAirbnbRating } from "@/reviews";
import { Container } from "./ui";

const steps = [
  {
    number: "01",
    title: "Vous composez votre séjour",
    copy: "Maison, dates, voyageurs et attentions : la demande reste modifiable jusqu’à votre envoi.",
  },
  {
    number: "02",
    title: "Le site vérifie, nous restons disponibles",
    copy: "Les calendriers connectés et les règles tarifaires contrôlent les dates, le prix total et les options. Stéphanie ou Bruno reste votre interlocuteur.",
  },
  {
    number: "03",
    title: "Vous réservez en confiance",
    copy: "La demande est enregistrée avec une référence claire. Aucun débit n’a lieu avant la présentation et l’acceptation des conditions contractuelles.",
  },
];

const assurances = [
  {
    title: "Annulation",
    copy: "La demande reste sans frais tant qu’elle n’est pas confirmée. Après confirmation, les conditions indiquées dans le contrat remis avant paiement s’appliquent.",
  },
  {
    title: "Règlement",
    copy: "Le règlement des réservations directes s’effectue actuellement exclusivement par virement bancaire, selon les instructions transmises après validation.",
  },
  {
    title: "Contact direct",
    copy: "Stéphanie et Bruno répondent au +33 6 17 26 00 94 et à coulotstephanie@gmail.com, sans intermédiaire ni centre d’appel.",
  },
  {
    title: "Réservation protégée",
    copy: "Le prix est calculé côté serveur, la disponibilité est revérifiée avant enregistrement et aucun moyen de paiement n’est transmis par le formulaire.",
  },
];

export function BookingTrustPanel() {
  return (
    <section className="booking-confidence" aria-labelledby="booking-confidence-title">
      <Container>
        <div className="booking-confidence__heading">
          <div>
            <p className="eyebrow">Réservation directe et accompagnée</p>
            <h2 id="booking-confidence-title">Une demande claire, sans paiement immédiat.</h2>
          </div>
          <p>
            Vous échangez directement avec Stéphanie et Bruno. Votre demande permet de vérifier
            chaque détail avant la confirmation définitive.
          </p>
        </div>
        <div className="booking-confidence__steps">
          {steps.map((step) => (
            <article key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </article>
          ))}
        </div>
        <div className="booking-confidence__proof">
          <strong>{weightedAirbnbRating}/5 sur Airbnb</strong>
          <span>{totalPublicPlatformReviews} avis publics recensés</span>
          <span>Données vérifiées le {reviewsVerifiedOn}</span>
        </div>
        <div
          className="booking-confidence__assurances"
          aria-label="Garanties de réservation directe"
        >
          {assurances.map((assurance) => (
            <article key={assurance.title}>
              <h3>{assurance.title}</h3>
              <p>{assurance.copy}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
