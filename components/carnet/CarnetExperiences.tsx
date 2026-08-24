import Link from "next/link";
import { Heading, Section } from "@/components/ui";

const experiences = [
  {
    title: "Petit-déjeuner",
    copy: "Une sélection matinale préparée pour profiter de la maison dès le réveil.",
  },
  {
    title: "Panier apéritif",
    copy: "Les saveurs artisanales de l’île à partager autour de la grande table.",
  },
  {
    title: "Pack Signature",
    copy: "Lits préparés, linge, panier et attentions réunis dans une seule expérience.",
  },
  {
    title: "Demande en mariage",
    copy: "Une arrivée pensée avec vous, discrètement et dans le respect de votre histoire.",
  },
  {
    title: "Anniversaire",
    copy: "Une attention personnelle pour marquer la date sans surcharger l’instant.",
  },
  {
    title: "Balade coucher de soleil",
    copy: "Notre itinéraire préféré pour rejoindre la plus belle lumière du jour.",
  },
  {
    title: "Pique-nique",
    copy: "Un moment dehors à composer selon la saison et votre destination.",
  },
  {
    title: "Atelier macarons et pâtisserie",
    copy: "Une expérience gourmande chez Confetti à Rivedoux-Plage, vécue et recommandée pour petits et grands.",
  },
  {
    title: "Observation des étoiles",
    copy: "Retrouver une plage calme lorsque l’île s’endort et lever les yeux.",
  },
];

export function CarnetExperiences() {
  return (
    <Section tone="dark" className="carnet-experiences">
      <Heading
        eyebrow="Les instants qui prolongent le souvenir"
        title="Vivre les îles autrement, simplement."
        description="Des attentions et des expériences à choisir selon la saison, vos envies et la maison qui vous accueille."
        light
      />
      <div className="carnet-experiences__grid">
        {experiences.map((experience, index) => (
          <article key={experience.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{experience.title}</h3>
            <p>{experience.copy}</p>
            <Link href="/reserver">
              Ajouter à mon séjour <span aria-hidden="true">→</span>
            </Link>
          </article>
        ))}
      </div>
    </Section>
  );
}
