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
    title: "Stéphanie vérifie avec vous",
    copy: "La disponibilité, le tarif et les options sont confirmés personnellement avant tout engagement.",
  },
  {
    number: "03",
    title: "Vous réservez en confiance",
    copy: "Aucun paiement n’est demandé par ce formulaire. Les conditions et le moyen de règlement sont confirmés ensuite.",
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
      </Container>
    </section>
  );
}
