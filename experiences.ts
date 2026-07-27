import type { StayOptionId } from "@/booking";
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
};

export const experiences: Experience[] = [
  {
    slug: "pack-signature",
    title: "Pack Signature Beaux Rivages",
    eyebrow: "L’expérience complète",
    text: "Lits préparés, serviettes de plage, deux peignoirs, panier d’accueil et attention personnelle : la maison vous attend jusque dans les détails.",
    image: siteMedia.properties["chai-des-tortues"].kitchen[1].src,
    imageAlt: "Grande table préparée au Chai des Tortues",
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
    image: "/images/properties/villa-raie-manta/editorial/chambre-romance.png",
    imageAlt: "Suite de Villa Raie Manta préparée pour une soirée romantique",
    duration: "Une soirée",
    idealPeriod: "Toute l’année",
    recommendedProperty: { slug: "villa-raie-manta", label: "Villa Raie Manta" },
    audience: "Couples",
    option: "personal-arrival",
  },
  {
    slug: "anniversaire",
    title: "Un anniversaire sur l’île",
    eyebrow: "Célébrer",
    text: "Racontez-nous la personne et l’occasion. Nous imaginons une attention sincère, adaptée à la maison et à votre façon de célébrer.",
    image: "/images/properties/villa-raie-manta/editorial/chambre-anniversaire-18-ans.png",
    imageAlt: "Chambre de Villa Raie Manta décorée pour un anniversaire de 18 ans",
    duration: "Une arrivée ou une soirée",
    idealPeriod: "Toute l’année",
    recommendedProperty: { label: "Les trois maisons" },
    audience: "Familles, couples et groupes d’amis",
    option: "personal-arrival",
  },
  {
    slug: "lune-de-miel",
    title: "Une lune de miel sous les poutres",
    eyebrow: "Les premiers jours",
    text: "Le Chai se fait refuge : pétales, champagne et attentions délicates composent une arrivée intime, pensée autour de votre histoire.",
    image: "/images/properties/chai-des-tortues/editorial/chambre-lune-de-miel.png",
    imageAlt: "Chambre du Chai des Tortues préparée pour une lune de miel",
    duration: "Une soirée",
    idealPeriod: "Toute l’année",
    recommendedProperty: { slug: "chai-des-tortues", label: "Le Chai des Tortues" },
    audience: "Jeunes mariés",
    option: "personal-arrival",
  },
  {
    slug: "demande-en-mariage",
    title: "Une demande en mariage face à l’océan",
    eyebrow: "Un instant unique",
    text: "Choisir le lieu, anticiper la lumière et préparer une attention discrète pour laisser toute la place à votre histoire.",
    image: siteMedia.properties["villa-raie-manta"].exterior[0].src,
    imageAlt: "Océan face à Villa Raie Manta",
    duration: "2 à 3 h",
    idealPeriod: "Printemps à automne",
    recommendedProperty: { slug: "villa-raie-manta", label: "Villa Raie Manta" },
    audience: "Couples",
    option: "personal-arrival",
  },
  {
    slug: "plateau-fruits-de-mer",
    title: "Plateau de fruits de mer",
    eyebrow: "L’Atlantique à table",
    text: "Un plateau choisi auprès de producteurs locaux, à ouvrir dans la cuisine puis à partager sans quitter la maison.",
    image: siteMedia.destination.food,
    imageAlt: "Fruits de mer et produits de l’Atlantique",
    duration: "Une soirée",
    idealPeriod: "Toute l’année",
    recommendedProperty: { slug: "chai-des-tortues", label: "Le Chai des Tortues" },
    audience: "Gourmands, couples et familles",
    option: "personal-arrival",
  },
  {
    slug: "atelier-macarons",
    title: "Atelier macarons",
    eyebrow: "Testé par Stéphanie & Bruno",
    text: "Mettre la main à la pâte, comprendre le geste et repartir avec ses créations : un atelier que nous avons aimé vivre en famille.",
    image: siteMedia.destination.lane,
    imageAlt: "Ruelle rétaise menant à un atelier gourmand",
    duration: "Une demi-journée",
    idealPeriod: "Selon programmation",
    recommendedProperty: { slug: "chai-des-tortues", label: "Le Chai des Tortues" },
    audience: "Familles, adolescents et gourmands",
  },
  {
    slug: "lever-de-soleil",
    title: "Lever de soleil sur le rivage",
    eyebrow: "Avant le village",
    text: "Sortir lorsque tout est encore silencieux, marcher jusqu’à l’eau et regarder l’île commencer sa journée.",
    image: siteMedia.destination.beach,
    imageAlt: "Plage calme dans la lumière du matin",
    duration: "1 h",
    idealPeriod: "Printemps et été",
    recommendedProperty: { slug: "nid-d-ete", label: "Le Nid d’Été" },
    audience: "Lève-tôt, photographes et couples",
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
    title: "Une journée pensée pour la famille",
    eyebrow: "Petits et grands",
    text: "Plage sans voiture, jeux, goûter et retour au calme : une journée simple où chacun trouve son rythme.",
    image: siteMedia.properties["nid-d-ete"].lifestyle[4].src,
    imageAlt: "Enfants jouant sur la plage",
    duration: "Une journée",
    idealPeriod: "Vacances scolaires",
    recommendedProperty: { slug: "nid-d-ete", label: "Le Nid d’Été" },
    audience: "Familles avec enfants et bébé",
  },
];

export function getExperience(slug: string | undefined) {
  return experiences.find((experience) => experience.slug === slug);
}
