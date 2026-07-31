export type GalleryImage = { src: string; alt: string; caption?: string };
export type AmenityGroup = { title: string; items: string[] };
export type PropertySpace = { title: string; detail: string };
export type PracticalInformation = { label: string; value: string };
export type PropertyFaq = { question: string; answer: string };

function curateGallery(
  gallery: readonly GalleryImage[],
  positions: readonly number[],
): GalleryImage[] {
  return positions.flatMap((position) => (gallery[position] ? [gallery[position]] : []));
}

export type Property = {
  slug: string;
  title: string;
  kicker: string;
  location: string;
  capacity: string;
  intro: string;
  story: string;
  hero: string;
  highlights: string[];
  stats: { value: string; label: string }[];
  gallery: GalleryImage[];
  amenityGroups: AmenityGroup[];
  spaces: PropertySpace[];
  practicalInformation: PracticalInformation[];
  faq: PropertyFaq[];
  bookingTitle: string;
  bookingText: string;
  signatureTitle: string;
  signatureText: string;
  recommendationSlugs: string[];
  seoDescription: string;
};

export const properties: Property[] = [
  {
    slug: "chai-des-tortues",
    title: "Le Chai des Tortues",
    kicker: "Authenticité · Patrimoine · Convivialité",
    location: "Rivedoux-Plage · Île de Ré",
    capacity: "Jusqu’à 6 voyageurs et un bébé",
    intro:
      "À Rivedoux-Plage, l’océan, les Halles et les pistes cyclables se rejoignent à pied. Entre eux, un ancien chai de Pineau et de Cognac a retrouvé la chaleur d’une maison de famille.",
    story:
      "Avant de devenir une maison de famille, le lieu abritait le Pineau et le Cognac. Sa rénovation a préservé la pierre et la charpente qui racontent encore son histoire. Aujourd’hui, la cuisine en est le cœur : on revient des Halles à pied, on ouvre les huîtres, on prépare les fruits de mer et l’on prolonge le dîner autour de la table ronde. À 250 mètres, la plage ouvre la journée sur l’océan ; les vélos prennent ensuite le relais pour parcourir l’île.",
    hero: propertyMedia["chai-des-tortues"].hero.src,
    highlights: [
      "Plage à 250 mètres à pied",
      "Halles et marché à 300 mètres",
      "Trois chambres à l’étage et deux salles de bain",
      "Cuisine exceptionnellement équipée",
      "Ancien chai de Pineau et Cognac aux pierres préservées",
      "Équipements bébé et matériel de plage fournis",
      "Fibre très haut débit et arrivée autonome",
      "Pistes cyclables au départ de la maison",
    ],
    stats: [
      { value: "6", label: "voyageurs" },
      { value: "3", label: "chambres" },
      { value: "2", label: "salles de bain" },
      { value: "250 m", label: "de la plage" },
    ],
    gallery: curateGallery(
      propertyMedia["chai-des-tortues"].gallery,
      [0, 1, 2, 4, 6, 8, 9, 13, 15, 16, 17, 19, 20, 22, 23, 29, 30, 31, 35, 36, 39, 41, 42, 50],
    ),
    amenityGroups: [
      {
        title: "La cuisine, au cœur du Chai",
        items: [
          "Ninja Dual Air Fryer, Cookeo et robot Kenwood chauffant",
          "Nespresso, Senseo, Dolce Gusto et cafetière filtre",
          "Raclette, crêpière, plancha et trancheuse",
          "Faitout à moules et matériel complet pour fruits de mer",
          "Lave-vaisselle, four et grand réfrigérateur-congélateur",
        ],
      },
      {
        title: "Pour dormir et voyager léger",
        items: [
          "Lit king size dans la suite et deux lits doubles",
          "Rideaux occultants, couettes et oreillers supplémentaires",
          "Lit parapluie, chaise haute, poussette et baignoire pliante",
          "Livres, jeux, parasol, nattes et siège de plage",
          "Deux salles de bain et deux toilettes",
        ],
      },
      {
        title: "Le confort d’une maison de village",
        items: [
          "Fibre Orange, TV Orange et enceinte Bluetooth",
          "Deux bureaux pour travailler au calme",
          "Lave-linge séchant et matériel d’entretien",
          "Petit extérieur privatif pour le café ou l’apéritif",
          "Arrivée autonome et animaux bienvenus",
        ],
      },
    ],
    spaces: [
      {
        title: "La grande pièce de vie",
        detail:
          "Sous la charpente, le salon, la cuisine ouverte et la table ronde composent le cœur vivant de la maison.",
      },
      {
        title: "La suite parentale",
        detail:
          "À l’étage, un lit king size, des rangements et une salle de bain privative habillée de marbre.",
      },
      {
        title: "Les deux chambres doubles",
        detail: "Deux chambres à l’étage, chacune avec bureau, rangements et ventilateur.",
      },
      {
        title: "Les deux salles de bain",
        detail:
          "Une salle de bain privative dans la suite et une seconde pour le reste de la maison, avec deux toilettes réparties sur les niveaux.",
      },
      {
        title: "L’espace laverie",
        detail: "Lave-linge séchant, fer, étendoir et équipements utiles aux séjours prolongés.",
      },
      {
        title: "Le petit extérieur",
        detail:
          "Un espace de village intimiste, avec mange-debout et tabourets, pour le premier café ou l’apéritif après la plage.",
      },
    ],
    practicalInformation: [
      { label: "Arrivée", value: "À partir de 16 h, en autonomie par boîte à clés" },
      { label: "Départ", value: "Avant 10 h ; départ tardif sur demande et selon disponibilité" },
      { label: "Stationnement", value: "Places gratuites dans les rues et parkings à proximité" },
      {
        label: "Linge",
        value:
          "Kit de maison et serviettes de plage proposés en option ; linge de lit bébé non fourni",
      },
      { label: "Animaux", value: "Acceptés avec supplément, en prévoyant leur couchage" },
      { label: "Quiétude", value: "Maison non-fumeur ; calme demandé entre 23 h et 7 h" },
    ],
    faq: [
      {
        question: "La plage et les Halles sont-elles accessibles à pied ?",
        answer:
          "Oui. La plage se trouve à environ 250 mètres et les Halles, le marché, les commerces et les restaurants à environ 300 mètres.",
      },
      {
        question: "Comment sont réparties les chambres ?",
        answer:
          "Les trois chambres sont à l’étage : une suite avec lit king size et salle de bain privative, puis deux chambres avec lit double et bureau.",
      },
      {
        question: "Combien la maison compte-t-elle de salles de bain et de toilettes ?",
        answer:
          "Le Chai dispose de deux salles de bain, dont une privative, et de deux toilettes réparties entre le rez-de-chaussée et l’étage.",
      },
      {
        question: "La cuisine permet-elle de préparer de vrais repas de famille ?",
        answer:
          "Oui. Elle réunit un équipement très complet, de l’Airfryer au robot chauffant, ainsi que tout le nécessaire pour les huîtres, les moules et les produits rapportés du marché.",
      },
      {
        question: "Le Chai possède-t-il un jardin ?",
        answer:
          "La maison dispose d’un petit extérieur privatif avec mange-debout et tabourets. Il est adapté au café ou à l’apéritif, mais ce n’est pas un grand jardin.",
      },
      {
        question: "Peut-on venir avec un bébé ou un animal ?",
        answer:
          "Oui. Les équipements bébé sont disponibles gratuitement. Les animaux sont acceptés selon les conditions Beaux Rivages et avec supplément.",
      },
    ],
    bookingTitle: "Retrouver la pierre, l’océan et la grande table.",
    bookingText:
      "Choisissez vos dates et laissez-nous préparer un séjour entre plage, marché et douceur rétaise.",
    signatureTitle: "La cuisine comme lieu de retrouvailles",
    signatureText:
      "Pensée pour celles et ceux qui aiment cuisiner, recevoir et partager, elle permet de transformer le retour du marché en un véritable moment de vacances.",
    recommendationSlugs: [
      "chez-nina-metayer",
      "amore-di-nonna",
      "marche-rivedoux-plage",
      "huitres-et-ma-re",
      "la-tartentiere",
      "la-martiniere",
      "cremerie-marianne",
    ],
    seoDescription:
      "Le Chai des Tortues à Rivedoux-Plage : ancien chai rénové pour 6 voyageurs, 3 chambres, plage à 250 m, Halles à 300 m et cuisine remarquable.",
  },
  {
    slug: "villa-raie-manta",
    title: "Villa Raie Manta",
    kicker: "Océan · Design · Lumière",
    location: "Rivedoux-Plage · Île de Ré",
    capacity: "Jusqu’à 8 voyageurs et un bébé",
    intro:
      "À Rivedoux-Plage, la Villa Raie Manta réunit la vue sur l’océan, la plage à quelques pas et la vie du village à pied. Entièrement rénovée, elle accueille jusqu’à huit voyageurs et un bébé dans une maison lumineuse pensée pour les familles et les amis.",
    story:
      "Le salon a volontairement été installé à l’étage afin d’ouvrir la maison sur la mer et le pont de l’Île de Ré. C’est ici que commencent les journées, autour du premier café, et que l’on se retrouve lorsque l’horizon change de couleur. La villa distribue ses quatre chambres sur deux niveaux : au rez-de-chaussée, une suite avec dressing et salle d’eau privative peut communiquer avec la chambre aux lits superposés ; à l’étage, une chambre double et une chambre aux lits simples réunissables partagent une seconde salle d’eau. La grande cuisine équipée accompagne les retours du marché, tandis que le jardin clos, sa table, ses bains de soleil et son barbecue prolongent les repas dehors. Il suffit de traverser la route pour rejoindre la plage ; les Halles, les commerces et les restaurants de Rivedoux se trouvent à environ 350 mètres.",
    hero: propertyMedia["villa-raie-manta"].hero.src,
    highlights: [
      "Vue sur l’océan et le pont de l’Île de Ré",
      "Plage de Rivedoux à quelques pas",
      "Salon signature situé à l’étage",
      "Quatre chambres pour huit voyageurs et un bébé",
      "Maison entièrement rénovée",
      "Halles, commerces et restaurants à 350 mètres",
      "Arrivée autonome",
    ],
    stats: [
      { value: "8", label: "voyageurs" },
      { value: "4", label: "chambres" },
      { value: "2", label: "salles de bain" },
      { value: "3", label: "toilettes" },
    ],
    gallery: curateGallery(
      propertyMedia["villa-raie-manta"].gallery,
      [
        0, 1, 2, 3, 5, 7, 8, 9, 11, 12, 15, 16, 17, 20, 24, 25, 27, 28, 29, 31, 35, 36, 39, 41, 37,
        38,
      ],
    ),
    amenityGroups: [
      {
        title: "Vivre et partager",
        items: [
          "Salon panoramique avec Apple TV et enceinte Bluetooth",
          "Cuisine ouverte, Airfryer et robots de cuisine",
          "Jardin clos, mobilier extérieur et barbecue",
          "Fibre très haut débit et espace de travail",
          "Table de ping-pong, jeux et livres",
        ],
      },
      {
        title: "Dormir et voyager léger",
        items: [
          "Deux chambres avec lit 160 × 200",
          "Chambre avec deux lits 90 × 200 réunissables",
          "Chambre avec lits superposés",
          "Rideaux occultants et couchages supplémentaires",
          "Lit parapluie, chaise haute, baignoire et vaisselle bébé",
        ],
      },
      {
        title: "Au retour de la plage",
        items: [
          "Accès plage en traversant la route",
          "Parasol, nattes, fauteuils et jouets de plage",
          "Sèche-linge dans la maison",
          "Deux salles de bain et trois toilettes",
          "Animaux bienvenus selon les conditions Beaux Rivages",
        ],
      },
    ],
    spaces: [
      {
        title: "Le salon panoramique",
        detail:
          "À l’étage, un grand canapé, des fauteuils et l’Apple TV composent un espace tourné vers la mer et le pont.",
      },
      {
        title: "La cuisine et la grande table",
        detail:
          "Une cuisine généreusement équipée pour cuisiner à plusieurs, prolongée par l’espace repas.",
      },
      {
        title: "La suite du rez-de-chaussée",
        detail: "Lit 160 × 200, dressing, télévision et salle d’eau privative.",
      },
      {
        title: "La chambre enfants",
        detail:
          "Lits superposés, WC avec lave-mains et accès indépendant ou communicant avec la suite.",
      },
      {
        title: "Les deux chambres à l’étage",
        detail: "Un lit 160 × 200 dans l’une ; deux lits 90 × 200 réunissables dans l’autre.",
      },
      {
        title: "Le jardin clos",
        detail:
          "Grande table, bains de soleil et barbecue pour prolonger les journées dehors en famille.",
      },
    ],
    practicalInformation: [
      { label: "Arrivée", value: "À partir de 16 h, en autonomie par boîte à clés" },
      { label: "Départ", value: "Avant 10 h ; départ tardif sur demande et selon disponibilité" },
      {
        label: "Stationnement",
        value:
          "Gratuit dans les rues et parkings à proximité ; certaines zones nécessitent un disque bleu",
      },
      { label: "Linge", value: "Kit de maison et serviettes de plage proposés en option" },
      { label: "Animaux", value: "Acceptés avec supplément et dans le respect de la maison" },
      {
        label: "Mobilité",
        value: "Plage, Halles et commerces à pied ; réseau cyclable au départ de Rivedoux",
      },
    ],
    faq: [
      {
        question: "La plage est-elle accessible à pied ?",
        answer:
          "Oui. Il suffit de traverser la route pour rejoindre le rivage en quelques instants.",
      },
      {
        question: "Comment sont répartis les couchages ?",
        answer:
          "La villa accueille huit voyageurs dans quatre chambres : deux lits de 160 × 200, deux lits simples réunissables et des lits superposés.",
      },
      {
        question: "La maison convient-elle aux familles avec un bébé ?",
        answer:
          "Oui. Lit parapluie, chaise haute, baignoire pliante et vaisselle bébé sont mis à disposition gratuitement.",
      },
      {
        question: "Peut-on se garer près de la villa ?",
        answer:
          "Oui. Plusieurs parkings et places gratuites se trouvent à proximité ; un disque bleu est utile dans certaines zones de Rivedoux-Plage.",
      },
      {
        question: "Les animaux sont-ils acceptés ?",
        answer: "Oui, selon les conditions Beaux Rivages et avec un supplément par séjour.",
      },
      {
        question: "Combien la Villa compte-t-elle de salles de bain et de toilettes ?",
        answer:
          "Villa Raie Manta dispose de deux salles de bain, une à chaque niveau, et de trois toilettes.",
      },
      {
        question: "Le linge est-il compris ?",
        answer:
          "Le linge de maison et les serviettes de plage peuvent être ajoutés en option lors de la préparation du séjour.",
      },
    ],
    bookingTitle: "Voir l’océan entrer dans la maison.",
    bookingText:
      "Choisissez vos dates pour vivre Rivedoux à pied, du premier café face au pont au dîner sur la terrasse.",
    signatureTitle: "Un salon placé à la hauteur de l’horizon",
    signatureText:
      "L’espace de vie a été installé à l’étage pour offrir une relation permanente avec la mer. La vue devient un élément d’architecture et accompagne chaque moment de la journée.",
    recommendationSlugs: [
      "chez-nina-metayer",
      "amore-di-nonna",
      "huitres-et-ma-re",
      "marche-rivedoux-plage",
      "reeduk-coach",
      "bio-sens-coiffure",
    ],
    seoDescription:
      "Villa Raie Manta à Rivedoux-Plage : villa vue mer pour 8 voyageurs, 4 chambres, jardin clos, plage à pied et Halles à 350 m sur l’Île de Ré.",
  },
  {
    slug: "nid-d-ete",
    title: "Le Nid d’Été",
    kicker: "Nature · Plage · Sérénité",
    location: "Boyardville · Île d’Oléron",
    capacity: "Jusqu’à 6 voyageurs et un bébé",
    intro:
      "Dans la résidence historique de la Maison Heureuse, un portail privé mène directement à la plage des Saumonards, face à Fort Boyard.",
    story:
      "Le Nid d’Été offre une expérience rare : quitter la maison, traverser quelques mètres et rejoindre la plage sans prendre la voiture. Les grands peupliers apportent leur ombre, la résidence sécurisée protège le calme et la proximité immédiate de la forêt invite à ralentir.",
    hero: propertyMedia["nid-d-ete"].hero.src,
    highlights: [
      "Accès privé direct à la plage des Saumonards",
      "Fort Boyard face à la plage",
      "Résidence historique sécurisée et classée",
      "Maison neuve de plain-pied",
      "Deux stationnements privés et local à vélos sécurisé",
      "Literie premium et cuisine très équipée",
      "Équipements bébé et jeux pour la famille",
      "Animaux bienvenus selon les conditions Beaux Rivages",
    ],
    stats: [
      { value: "6", label: "voyageurs" },
      { value: "2", label: "chambres" },
      { value: "3", label: "couchages" },
      { value: "20 m", label: "du portail plage" },
    ],
    gallery: curateGallery(
      propertyMedia["nid-d-ete"].gallery,
      [0, 1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 16, 17, 18, 19, 22, 23, 26, 27, 29, 30, 32, 33],
    ),
    amenityGroups: [
      {
        title: "De la maison à la plage",
        items: [
          "Portail privé à 20 mètres",
          "Plage des Saumonards face à Fort Boyard",
          "Deux stationnements privatifs",
          "Local à vélos sécurisé",
          "Transats, tente anti-UV, jeux et matériel de plage",
        ],
      },
      {
        title: "Une maison pour les familles",
        items: [
          "Lit parapluie, chaise haute et baignoire pliante",
          "Transat et tapis d’éveil",
          "Vaisselle enfant, livres et jeux de société",
          "Table extérieure transformable en table de ping-pong",
          "Jardin clos et résidence sécurisée",
        ],
      },
      {
        title: "Le confort au quotidien",
        items: [
          "Fibre et espace de travail dédié",
          "Cuisine complète, robot multicuiseur et appareils conviviaux",
          "Lave-linge et lave-vaisselle",
          "Terrasse, voile d’ombrage et plancha électrique",
          "Arrivée autonome et animaux bienvenus",
        ],
      },
    ],
    spaces: [
      {
        title: "Le séjour",
        detail:
          "Un salon convivial avec canapé convertible, grande table, télévision et enceinte Bluetooth.",
      },
      {
        title: "La cuisine",
        detail:
          "Four, lave-vaisselle, réfrigérateur-congélateur, cafetières et équipement pour raclette, crêpes, moules et fruits de mer.",
      },
      {
        title: "La chambre principale",
        detail:
          "Lit king size 180 × 200 avec surmatelas, télévision, rangements et ventilateur de plafond.",
      },
      {
        title: "La seconde chambre",
        detail: "Lit double 140 × 200, rangements et ventilateur de plafond.",
      },
      {
        title: "La salle d’eau",
        detail: "Grande douche à l’italienne, WC suspendu, sèche-cheveux et rangements.",
      },
      {
        title: "La terrasse et le jardin clos",
        detail: "Table pour six, transats, voile d’ombrage en saison et plancha électrique.",
      },
    ],
    practicalInformation: [
      { label: "Arrivée", value: "À partir de 16 h, en autonomie par boîte à clés" },
      { label: "Départ", value: "Avant 10 h ; départ tardif sur demande et selon disponibilité" },
      {
        label: "Stationnement",
        value: "Deux places privatives ; circulation et stationnement interdits dans les allées",
      },
      {
        label: "Linge",
        value: "Kit draps et serviettes proposé en option ; linge de lit bébé non fourni",
      },
      { label: "Animaux", value: "Acceptés avec supplément ; prévoir leur couchage" },
      { label: "Quiétude", value: "Résidence non-fumeur ; calme demandé entre 23 h et 7 h" },
    ],
    faq: [
      {
        question: "À quelle distance se trouve réellement la plage ?",
        answer:
          "Le portail privé de la résidence se trouve à environ 20 mètres de la maison et ouvre directement sur le chemin de la plage des Saumonards.",
      },
      {
        question: "Comment sont répartis les six couchages ?",
        answer:
          "Deux chambres accueillent un lit king size et un lit double ; le canapé convertible du séjour offre deux couchages supplémentaires.",
      },
      {
        question: "La maison est-elle de plain-pied ?",
        answer: "Oui. Le logement ne comporte pas d’escalier intérieur.",
      },
      {
        question: "Peut-on venir avec un bébé ?",
        answer:
          "Oui. Lit parapluie, chaise haute, baignoire pliante, transat, tapis d’éveil et tente anti-UV sont disponibles gratuitement.",
      },
      {
        question: "Quel équipement peut-on utiliser dehors ?",
        answer:
          "La terrasse dispose d’une table, de transats, d’une voile d’ombrage saisonnière et d’une plancha électrique. Les appareils au gaz sont interdits dans la résidence classée.",
      },
      {
        question: "Le linge est-il fourni ?",
        answer:
          "Un kit comprenant draps, serviettes, torchons et tapis de bain est proposé en option. Le linge du lit bébé n’est pas fourni.",
      },
      {
        question: "Peut-on stationner devant la maison ?",
        answer:
          "Deux places privatives sont réservées aux voyageurs. Pour préserver la résidence, il est interdit de circuler ou de stationner dans les allées communes.",
      },
    ],
    bookingTitle: "Ouvrir le portail, rejoindre le sable.",
    bookingText:
      "Choisissez vos dates pour une parenthèse entre forêt, plage des Saumonards et Fort Boyard.",
    signatureTitle: "Ouvrir le portail et rejoindre la plage",
    signatureText:
      "Le Nid d’Été se trouve à côté du portail privé de la résidence. En quelques pas, la forêt et le sable remplacent la route : un privilège rare pour les familles comme pour les amoureux de nature.",
    recommendationSlugs: [],
    seoDescription:
      "Le Nid d’Été à Boyardville : maison de plain-pied pour 6, accès privé à la plage à 20 m face à Fort Boyard, jardin clos et parking sur l’Île d’Oléron.",
  },
];

export function getProperty(slug: string) {
  const property = properties.find((item) => item.slug === slug);
  if (!property) throw new Error(`Unknown property: ${slug}`);
  return property;
}
import { propertyMedia } from "@/media/properties";
