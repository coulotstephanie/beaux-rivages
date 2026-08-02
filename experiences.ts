import { SIGNATURE_PACK_IMAGE, type StayOptionId } from "@/booking";
import { siteMedia } from "@/media/site";

export type Experience = {
  slug: string;
  title: string;
  eyebrow: string;
  text: string;
  image: string;
  imageAlt: string;
  duration: string;
  idealPeriod: string;
  recommendedProperty: {
    slug?: "chai-des-tortues" | "villa-raie-manta" | "nid-d-ete";
    label: string;
  };
  audience: string;
  option?: StayOptionId;
  storyTitle?: string;
  story?: string;
  whyTitle?: string;
  advice?: string;
  checklist?: string[];
};

const canonicalExperienceRoutes: Record<string, string> = {
  "pack-signature": "/experience-signature",
  romance: "/romance",
  anniversaire: "/anniversaire",
  "demande-en-mariage": "/demande-en-mariage",
};

export function getExperienceHref(slug: string) {
  return canonicalExperienceRoutes[slug] ?? `/experiences/${slug}`;
}

export const experiences: Experience[] = [
  {
    slug: "pack-signature",
    title: "Pack Signature Beaux Rivages",
    eyebrow: "L’expérience complète",
    text: "Lits préparés, serviettes de plage, deux peignoirs, panier d’accueil et attention personnelle : la maison vous attend jusque dans les détails.",
    image: SIGNATURE_PACK_IMAGE,
    imageAlt:
      "Chambre authentique du Chai des Tortues préparée avec le linge de l’Expérience Signature",
    duration: "Tout le séjour",
    idealPeriod: "Toute l’année",
    recommendedProperty: { label: "Les trois maisons" },
    audience: "Voyageurs qui souhaitent arriver l’esprit libre",
    option: "signature",
  },
  {
    slug: "romance",
    title: "Romance sur l’île",
    eyebrow: "À deux",
    text: "Une arrivée délicate, une maison préparée et la lumière du rivage pour retrouver le plaisir de n’avoir rien d’autre à organiser.",
    image: "/images/properties/nid-d-ete/editorial/diner-romantique.png",
    imageAlt: "Dîner romantique préparé au Nid d’Été",
    duration: "Une soirée",
    idealPeriod: "Toute l’année",
    recommendedProperty: { slug: "villa-raie-manta", label: "Villa Raie Manta" },
    audience: "Couples",
    option: "personal-arrival",
    storyTitle: "Faire de l’horizon le seul décor.",
    story:
      "Nous vous aidons à choisir une plage calme, l’orientation la plus lumineuse et l’horaire juste selon la marée. Sur demande, le moment peut être prolongé par des fleurs, une bouteille fraîche, quelques images discrètes ou un dîner réservé à proximité. Rien n’est imposé : la mise en scène reste fidèle à votre histoire.",
    whyTitle: "Un moment préparé avec précision, vécu avec naturel.",
    advice:
      "L’emplacement et l’horaire sont confirmés quelques jours avant selon la météo, le vent et les marées. Un plan de repli élégant peut être prévu si les conditions changent.",
    checklist: [
      "Repérage du lieu et conseil sur le meilleur horaire",
      "Coordination discrète des attentions choisies",
      "Fleurs, champagne, photographe ou dîner selon vos envies",
    ],
  },
  {
    slug: "anniversaire",
    title: "Anniversaire sur mesure (sur demande)",
    eyebrow: "Célébrer",
    text: "Racontez-nous la personne et l’occasion. Après échange avec Stéphanie & Bruno, nous imaginons une attention sincère selon les disponibilités, adaptée à la maison et à votre façon de célébrer.",
    image: "/images/properties/villa-raie-manta/editorial/chambre-anniversaire-18-ans.png",
    imageAlt: "Chambre de Villa Raie Manta décorée pour un anniversaire de 18 ans",
    duration: "Une arrivée ou une soirée",
    idealPeriod: "Toute l’année",
    recommendedProperty: { label: "Les trois maisons" },
    audience: "Familles, couples et groupes d’amis",
    option: "personal-arrival",
  },
  {
    slug: "demande-en-mariage",
    title: "Demande en mariage (sur demande)",
    eyebrow: "Un instant unique",
    text: "Choisir le lieu, anticiper la lumière et préparer une attention discrète après échange avec Stéphanie & Bruno, selon les disponibilités, pour laisser toute la place à votre histoire.",
    image: "/images/destination/experiences/demande-mariage-ocean.jpg",
    imageAlt: "Demande en mariage à genoux face à l’océan",
    duration: "2 à 3 h",
    idealPeriod: "Printemps à automne",
    recommendedProperty: { slug: "villa-raie-manta", label: "Villa Raie Manta" },
    audience: "Couples",
    option: "personal-arrival",
  },
  {
    slug: "lune-de-miel",
    title: "Lune de miel (sur demande)",
    eyebrow: "Un voyage à deux",
    text: "Une maison préparée avec délicatesse, une lumière douce et quelques attentions choisies ensemble. Cette parenthèse est imaginée après échange avec Stéphanie & Bruno et proposée selon les disponibilités.",
    image: "/images/properties/villa-raie-manta/editorial/chambre-romance.png",
    imageAlt: "Chambre préparée avec des pétales pour une lune de miel Beaux Rivages",
    duration: "Selon votre séjour",
    idealPeriod: "Toute l’année, sur demande",
    recommendedProperty: { label: "Les trois maisons" },
    audience: "Jeunes mariés",
    option: "personal-arrival",
    storyTitle: "Prolonger la célébration dans la douceur des îles.",
    story:
      "Vous ouvrez la porte et découvrez une maison qui marque avec délicatesse le début de ce nouveau chapitre. Chaque détail est défini avec vous, sans formule imposée.",
    advice:
      "Parlez-nous de votre histoire et de ce que vous aimez : nous vous proposerons uniquement des attentions disponibles et réellement adaptées à votre séjour.",
  },
  {
    slug: "atelier-macarons",
    title: "Atelier macarons et pâtisserie",
    eyebrow: "Testé par Stéphanie & Bruno",
    text: "Mettre la main à la pâte, comprendre le geste et repartir avec ses créations : un atelier macarons et pâtisserie que nous avons aimé vivre en famille, réservable directement chez Confetti à Rivedoux-Plage.",
    image: "/images/destination/experiences/atelier-macarons.jpg",
    imageAlt: "Macarons colorés manipulés pendant un atelier gourmand",
    duration: "Une demi-journée",
    idealPeriod: "Selon programmation",
    recommendedProperty: { slug: "chai-des-tortues", label: "Le Chai des Tortues" },
    audience: "Familles, adolescents et gourmands",
    storyTitle: "Apprendre le geste, puis goûter ce que l’on a créé.",
    story:
      "Guidés par un artisan, petits et grands découvrent les étapes qui font la précision d’un macaron : préparation des coques, pochage, garniture et assemblage. L’atelier privilégie la participation et le plaisir de faire ensemble, avec une boîte de créations à rapporter à la maison.",
    whyTitle: "Une parenthèse gourmande qui réunit toutes les générations.",
    advice:
      "Les dates et les formats varient selon la programmation de l’artisan. Nous vérifions les places, l’âge minimum éventuel et les allergènes avant de confirmer.",
    checklist: [
      "Atelier pratique accompagné par un professionnel",
      "Ingrédients et matériel inclus selon la formule",
      "Créations à déguster sur place ou à emporter",
    ],
  },
  {
    slug: "lever-de-soleil",
    title: "Lever de soleil sur le rivage",
    eyebrow: "Avant le village",
    text: "Sortir lorsque tout est encore silencieux, marcher jusqu’à l’eau et regarder l’île commencer sa journée.",
    image: "/images/destination/experiences/lever-soleil-ocean.jpg",
    imageAlt: "Lever de soleil lumineux sur l’océan et la plage",
    duration: "1 h",
    idealPeriod: "Printemps et été",
    recommendedProperty: { slug: "nid-d-ete", label: "Le Nid d’Été" },
    audience: "Lève-tôt, photographes et couples",
    storyTitle: "Voir la plage avant que l’île ne s’éveille.",
    story:
      "Nous vous indiquons le point de départ le plus juste selon la saison. Quelques minutes de marche suffisent pour rejoindre le rivage dans le silence et observer la lumière gagner doucement l’eau.",
    whyTitle: "L’île semble entière lorsque l’on arrive avant les premiers pas.",
    advice:
      "L’heure de départ est adaptée au lever du soleil et à la météo. Prévoyez une couche chaude, même en été, et arrivez une quinzaine de minutes avant l’apparition du soleil.",
    checklist: [
      "Point d’observation conseillé selon la saison",
      "Horaire précis communiqué avant le séjour",
      "Suggestion de marche douce au retour",
    ],
  },
  {
    slug: "coucher-de-soleil",
    title: "Coucher de soleil sur les marais",
    eyebrow: "L’heure dorée",
    text: "Arriver avant la lumière, regarder les reflets changer et rester lorsque le ciel garde encore un peu de couleur.",
    image: siteMedia.destination.marsh,
    imageAlt: "Coucher de soleil reflété dans les marais",
    duration: "1 h 30",
    idealPeriod: "Toute l’année",
    recommendedProperty: { label: "Les trois maisons" },
    audience: "Tous les voyageurs",
    storyTitle: "Regarder la lumière descendre sur les marais.",
    story:
      "Un itinéraire court vous mène jusqu’à un point dégagé où le ciel et l’eau se répondent. Nous vous conseillons d’arriver avant l’heure dorée, de marcher un peu, puis de rester après la disparition du soleil, lorsque les couleurs deviennent plus profondes.",
    whyTitle: "Un rituel simple qui change chaque soir.",
    advice:
      "Le meilleur point de vue dépend de la couverture nuageuse et de votre île de départ. Nous partageons une option accessible en famille et une alternative plus sauvage.",
    checklist: [
      "Point de vue choisi selon votre maison",
      "Horaire adapté à la date du séjour",
      "Alternative familiale ou promenade plus confidentielle",
    ],
  },
  {
    slug: "peche-a-pied",
    title: "Pêche à pied à marée basse",
    eyebrow: "Au rythme des marées",
    text: "Lire l’estran, respecter les tailles et découvrir ce que l’océan laisse apparaître avant de tout recouvrir.",
    image: siteMedia.destination.sea,
    imageAlt: "Estran découvert à marée basse",
    duration: "2 h",
    idealPeriod: "Grandes marées",
    recommendedProperty: { slug: "nid-d-ete", label: "Le Nid d’Été" },
    audience: "Familles et curieux de nature",
  },
  {
    slug: "balade-velo",
    title: "Balade à vélo entre villages et marais",
    eyebrow: "Liberté",
    text: "Partir depuis la maison, rejoindre un marché, longer les marais et rentrer par l’océan sans regarder l’heure.",
    image: siteMedia.properties["chai-des-tortues"].lifestyle[0].src,
    imageAlt: "Vélo dans un village de l’Île de Ré",
    duration: "Une demi-journée",
    idealPeriod: "Mars à novembre",
    recommendedProperty: { slug: "chai-des-tortues", label: "Le Chai des Tortues" },
    audience: "Couples, amis et familles avec grands enfants",
  },
  {
    slug: "bien-etre",
    title: "Bien-être face à l’océan",
    eyebrow: "Respirer",
    text: "Yoga sur la plage, longe-côte ou séance douce en plein air avec une équipe locale que nous connaissons.",
    image: siteMedia.destination.beach,
    imageAlt: "Plage ouverte sur l’océan pour une séance de bien-être",
    duration: "1 à 2 h",
    idealPeriod: "Printemps à automne",
    recommendedProperty: { slug: "villa-raie-manta", label: "Villa Raie Manta" },
    audience: "Adultes, débutants bienvenus",
  },
  {
    slug: "famille",
    title: "Une journée en famille au rythme de l’océan",
    eyebrow: "Petits, grands et grands-parents",
    text: "Cerf-volant, château de sable, goûter sur la plage et retour au calme dans la maison : une journée simple où chaque génération trouve son rythme.",
    image: "/images/destination/editorial/famille-cerf-volant-chien.png",
    imageAlt: "Parents et enfants faisant voler un cerf-volant avec leur chien sur la plage",
    duration: "Une journée",
    idealPeriod: "Toute l’année selon la météo",
    recommendedProperty: { label: "Les trois maisons" },
    audience: "Familles, bébés et séjours multigénérationnels",
    storyTitle: "Des souvenirs à partager, sans programme imposé.",
    story:
      "Nous vous proposons une journée adaptée à l’âge des enfants, à la météo et à la marée : plage, balade courte, marché, jeux ou goûter dehors. Chaque idée reste facultative afin de laisser à toute la famille le temps de profiter de la maison et de se retrouver.",
    whyTitle: "Parce qu’une belle journée en famille doit rester facile à vivre.",
    advice:
      "Les équipements disponibles varient selon la maison. Indiquez-nous l’âge des enfants, la présence d’un bébé ou d’un animal : nous vous orienterons vers les activités et les lieux les plus adaptés.",
    checklist: [
      "Idées adaptées à l’âge des enfants et à la saison",
      "Horaires de marée et plage conseillée",
      "Équipements bébé disponibles selon la maison",
      "Solution intérieure lorsque la météo change",
    ],
  },
];

export function getExperience(slug: string | undefined) {
  return experiences.find((experience) => experience.slug === slug);
}
