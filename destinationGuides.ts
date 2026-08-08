import { siteMedia } from "@/media/site";

export type DestinationGuide = {
  slug: "ile-de-re" | "ile-d-oleron" | "la-rochelle";
  title: string;
  kicker: string;
  introduction: string;
  hero: string;
  chapters: {
    eyebrow: string;
    title: string;
    copy: string;
    image: string;
    tips: string[];
  }[];
  essentials: { label: string; value: string }[];
  history: { title: string; copy: string; image: string };
  map: { label: string; href: string; points: { name: string; note: string }[] };
  addresses: { name: string; kind: string; advice: string }[];
  seasons: { season: string; advice: string }[];
  weather: { condition: string; ideas: string[] }[];
  audiences: { families: string[]; couples: string[] };
  itineraries: { duration: string; title: string; steps: string[] }[];
  faq: { question: string; answer: string }[];
  gallery: {
    src: string;
    alt: string;
    caption: string;
    credit?: string;
    license?: string;
    source?: string;
  }[];
};

export const destinationGuides: DestinationGuide[] = [
  {
    slug: "ile-de-re",
    title: "L’Île de Ré",
    kicker: "Villages blancs · Marais · Océan",
    introduction:
      "Une île à parcourir lentement, entre marchés du matin, chemins cyclables et lumières changeantes sur les marais.",
    hero: siteMedia.destination.marsh,
    essentials: [
      { label: "À privilégier", value: "Le vélo" },
      { label: "Notre moment", value: "La fin de journée" },
      { label: "Depuis Rivedoux", value: "Tout commence à proximité" },
    ],
    history: {
      title: "Une île façonnée par le sel et les passages",
      copy: "Villages fortifiés, marais salants et ports racontent une terre longtemps tournée vers la mer. Vauban a marqué Saint-Martin, tandis que les sauniers continuent de dessiner le paysage au rythme des saisons.",
      image: siteMedia.destination.village,
    },
    map: {
      label: "Nos repères sur l’Île de Ré",
      href: "https://www.openstreetmap.org/search?query=%C3%8Ele%20de%20R%C3%A9",
      points: [
        { name: "Rivedoux-Plage", note: "Le point de départ, entre deux plages" },
        { name: "Saint-Martin-de-Ré", note: "Port, remparts et marché" },
        { name: "Loix", note: "Marais, calme et routes à vélo" },
        { name: "Les Portes-en-Ré", note: "Le bout de l’île et les grandes plages" },
      ],
    },
    addresses: [
      {
        name: "Le marché de Rivedoux-Plage",
        kind: "Notre marché de départ",
        advice:
          "Commencez ici : nous y allons tôt, avec un panier et sans liste trop précise, avant de gagner la plage ou les pistes.",
      },
      {
        name: "La route des huîtres",
        kind: "Producteurs",
        advice: "Choisissez une cabane ouverte sur le marais et demandez l’arrivage du jour.",
      },
      {
        name: "Le port de La Flotte",
        kind: "Flânerie",
        advice: "À découvrir avant le déjeuner, lorsque les quais sont encore paisibles.",
      },
    ],
    seasons: [
      {
        season: "Printemps",
        advice: "La meilleure saison pour les longues boucles à vélo et les villages fleuris.",
      },
      {
        season: "Été",
        advice: "Partez tôt, rentrez pour déjeuner et retrouvez l’océan en fin de journée.",
      },
      {
        season: "Automne",
        advice: "Lumières profondes sur les marais, marchés plus calmes et air encore doux.",
      },
      {
        season: "Hiver",
        advice: "Une île dépouillée, idéale pour marcher puis cuisiner à la maison.",
      },
    ],
    weather: [
      {
        condition: "Grand soleil",
        ideas: [
          "Boucle à vélo vers Loix",
          "Baignade côté sud",
          "Coucher de soleil dans les marais",
        ],
      },
      {
        condition: "Vent",
        ideas: [
          "Rouler dans le sens du retour",
          "Observer les véliplanchistes à Rivedoux",
          "Choisir les ruelles abritées",
        ],
      },
      {
        condition: "Pluie",
        ideas: ["Marché de La Flotte", "Musée Ernest-Cognacq", "Déjeuner prolongé à la maison"],
      },
    ],
    audiences: {
      families: [
        "Plage sud de Rivedoux à marée adaptée",
        "Petites étapes à vélo avec pause glace",
        "Remparts et port de Saint-Martin",
      ],
      couples: [
        "Marais à l’heure dorée",
        "Dégustation dans une cabane ostréicole",
        "Traversée matinale des villages",
      ],
    },
    itineraries: [
      {
        duration: "Une journée",
        title: "Depuis Rivedoux, Ré essentielle",
        steps: [
          "Marché de Rivedoux-Plage",
          "La Flotte par la côte",
          "Saint-Martin et ses remparts",
          "Retour à Rivedoux au soleil couchant",
        ],
      },
      {
        duration: "Trois jours",
        title: "L’île en douceur",
        steps: ["Sud et villages", "Marais et Loix", "Phare des Baleines et plages de l’ouest"],
      },
    ],
    faq: [
      {
        question: "Faut-il une voiture ?",
        answer:
          "Elle reste pratique pour les longues distances, mais le vélo est souvent le plus beau moyen de découvrir l’île.",
      },
      {
        question: "Quand éviter la circulation ?",
        answer:
          "En été, privilégiez les départs avant 9 h 30 et les retours après le cœur de l’après-midi.",
      },
      {
        question: "Où voir le coucher de soleil ?",
        answer:
          "Nous aimons les marais à l’ouest et les plages autour de La Couarde ou des Portes.",
      },
    ],
    gallery: [
      {
        src: siteMedia.destination.reAerial,
        alt: "Île de Ré vue du ciel",
        caption: "L’île posée sur l’Atlantique",
      },
      {
        src: siteMedia.destination.reBridgeAerial,
        alt: "Pont de l’Île de Ré vu du ciel",
        caption: "Le passage entre La Rochelle et l’île",
      },
      {
        src: siteMedia.destination.reMap,
        alt: "Carte générale de l’Île de Ré",
        caption: "Les dix villages de l’île",
      },
      {
        src: siteMedia.destination.whalesLighthouse,
        alt: "Phare des Baleines derrière un cairn de galets",
        caption: "Le Phare des Baleines",
      },
      {
        src: siteMedia.destination.whalesOldTower,
        alt: "Vieille Tour des Baleines face à la mer",
        caption: "La Vieille Tour et son musée",
      },
      {
        src: siteMedia.destination.reLove,
        alt: "Sculpture AMOUR face au rivage",
        caption: "Un mot face à l’océan",
      },
      {
        src: siteMedia.destination.reMarketLane,
        alt: "Allée pavée du marché de La Flotte",
        caption: "Le marché de La Flotte",
      },
      {
        src: siteMedia.destination.reMarketGreengrocer,
        alt: "Étal de primeur au marché de La Flotte",
        caption: "Les étals sous les halles",
      },
      {
        src: siteMedia.destination.reMarketFish,
        alt: "Poissonnerie du marché de La Flotte",
        caption: "L’arrivage du matin",
      },
      {
        src: siteMedia.destination.reMarketSwordfish,
        alt: "Poissons frais et espadon au marché",
        caption: "La pêche sur l’étal",
      },
      {
        src: siteMedia.destination.reMarketCheese,
        alt: "Fromages régionaux au marché",
        caption: "Les fromages régionaux",
      },
      {
        src: siteMedia.destination.reMarketFruit,
        alt: "Fruits rouges et melons au marché",
        caption: "Les fruits de saison",
      },
      {
        src: siteMedia.destination.reMarketTomatoes,
        alt: "Tomates anciennes colorées au marché",
        caption: "Les couleurs des producteurs",
      },
      {
        src: siteMedia.destination.reMarketWine,
        alt: "Vins et pineaux proposés au marché",
        caption: "Les vins et pineaux de l’île",
      },
      {
        src: siteMedia.destination.reMarketProducerWine,
        alt: "Vins présentés par un producteur",
        caption: "À la rencontre des producteurs",
      },
      {
        src: siteMedia.destination.marsh,
        alt: "Marais rétais au coucher du soleil",
        caption: "La lumière sur les marais",
      },
      {
        src: siteMedia.destination.village,
        alt: "Village fleuri de l’Île de Ré",
        caption: "Les villages blancs et fleuris",
      },
      {
        src: siteMedia.destination.salt,
        alt: "Saunier dans les marais salants",
        caption: "Le geste des sauniers",
      },
      {
        src: siteMedia.destination.bridge,
        alt: "Pont de l’Île de Ré",
        caption: "L’arrivée sur l’île",
      },
      {
        src: siteMedia.destination.saintMartinPort,
        alt: "Port de Saint-Martin-de-Ré",
        caption: "Saint-Martin entre port et remparts",
        credit: "Angelo Brathot",
        license: "Domaine public",
        source:
          "https://commons.wikimedia.org/wiki/File:Port_de_St_Martin-de-R%C3%A9_T_%2845053203774%29.jpg",
      },
    ],
    chapters: [
      {
        eyebrow: "Le matin",
        title: "Rivedoux avant l’agitation",
        copy: "Commencez par les Halles, choisissez quelques produits et prenez le temps d’un café dans le village avant de partir.",
        image: siteMedia.destination.food,
        tips: ["Arriver tôt au marché", "Prévoir un panier à vélo"],
      },
      {
        eyebrow: "Sur les chemins",
        title: "L’île à hauteur de vélo",
        copy: "Les pistes relient les villages, les plages et les marais. Le trajet compte autant que la destination.",
        image: siteMedia.destination.bridge,
        tips: ["Adapter la boucle au vent", "Garder une halte non programmée"],
      },
      {
        eyebrow: "À l’heure dorée",
        title: "Les marais lorsque la lumière descend",
        copy: "À l’ouest, l’eau et le sel captent les dernières couleurs du jour dans un silence presque intact.",
        image: siteMedia.destination.salt,
        tips: ["Venir avant le coucher du soleil", "Rester quelques minutes après"],
      },
    ],
  },
  {
    slug: "ile-d-oleron",
    title: "L’Île d’Oléron",
    kicker: "Forêts · Plages · Fort Boyard",
    introduction:
      "Plus vaste et plus sauvage, Oléron alterne villages ostréicoles, forêt de pins et longues plages ouvertes sur l’Atlantique.",
    hero: siteMedia.destination.beach,
    essentials: [
      { label: "À privilégier", value: "Forêt et littoral" },
      { label: "Notre moment", value: "Fort Boyard au couchant" },
      { label: "Depuis le Nid", value: "La plage à pied" },
    ],
    history: {
      title: "Une île de marins, de pins et d’ostréiculteurs",
      copy: "Oléron s’est construite entre fortifications, commerce du sel et culture de l’huître. Ses villages et ses chenaux gardent la mémoire d’une île laborieuse, aujourd’hui encore profondément liée aux marées.",
      image: siteMedia.destination.salt,
    },
    map: {
      label: "Nos repères sur l’Île d’Oléron",
      href: "https://www.openstreetmap.org/search?query=%C3%8Ele%20d%27Ol%C3%A9ron",
      points: [
        { name: "Boyardville", note: "Port, forêt et départ vers Fort Boyard" },
        { name: "Plage des Saumonards", note: "La plage familiale près du Nid" },
        { name: "La Cotinière", note: "Port de pêche vivant" },
        { name: "Chassiron", note: "Phare et côte rocheuse" },
      ],
    },
    addresses: [
      {
        name: "Le marché de Boyardville",
        kind: "Notre marché de départ",
        advice:
          "Commencez la journée ici : quelques achats le matin, puis le déjeuner se décide avec l’arrivage avant la forêt ou les Saumonards.",
      },
      {
        name: "Les chenaux ostréicoles",
        kind: "Producteurs",
        advice:
          "Arrêtez-vous dans une cabane simple, là où l’on prend encore le temps d’expliquer.",
      },
      {
        name: "Le port de La Cotinière",
        kind: "Port",
        advice: "Venez au retour des bateaux pour sentir la vraie vie du port.",
      },
    ],
    seasons: [
      {
        season: "Printemps",
        advice: "Forêt parfumée, pistes tranquilles et premières tables dehors.",
      },
      {
        season: "Été",
        advice: "La plage tôt ou tard, la forêt aux heures chaudes et les marchés au réveil.",
      },
      {
        season: "Automne",
        advice: "Une belle saison pour les producteurs, la pêche à pied et les longues marches.",
      },
      { season: "Hiver", advice: "Côte spectaculaire, fruits de mer et soirées paisibles au Nid." },
    ],
    weather: [
      {
        condition: "Grand soleil",
        ideas: ["Saumonards le matin", "Pique-nique sous les pins", "Chassiron en fin de journée"],
      },
      {
        condition: "Vent",
        ideas: [
          "Côte sauvage depuis les points sécurisés",
          "Port de La Cotinière",
          "Forêt domaniale à l’abri",
        ],
      },
      {
        condition: "Pluie",
        ideas: ["Cité de l’Huître", "Marché couvert", "Cuisine en famille au Nid"],
      },
    ],
    audiences: {
      families: [
        "Plage des Saumonards",
        "Petit train de Saint-Trojan",
        "Pistes forestières faciles",
      ],
      couples: [
        "Cabanes colorées au Château",
        "Chassiron au couchant",
        "Dégustation face aux chenaux",
      ],
    },
    itineraries: [
      {
        duration: "Une journée",
        title: "Boyardville, notre point de départ",
        steps: [
          "Marché et port de Boyardville",
          "Plage des Saumonards",
          "Route des huîtres",
          "Phare de Chassiron",
        ],
      },
      {
        duration: "Trois jours",
        title: "Oléron sauvage et gourmande",
        steps: [
          "Forêt et Fort Boyard",
          "Chenaux et Château-d’Oléron",
          "La Cotinière et côte ouest",
        ],
      },
    ],
    faq: [
      {
        question: "Où apercevoir Fort Boyard ?",
        answer:
          "La plage des Saumonards offre l’une des vues les plus naturelles, particulièrement belle en fin de journée.",
      },
      {
        question: "La plage est-elle adaptée aux enfants ?",
        answer:
          "Les Saumonards est familiale, mais il faut toujours tenir compte de la marée, du vent et des consignes locales.",
      },
      {
        question: "Peut-on tout faire à vélo ?",
        answer:
          "De nombreuses pistes existent, mais Oléron est vaste : choisissez une zone par journée plutôt que de vouloir tout relier.",
      },
    ],
    gallery: [
      {
        src: siteMedia.destination.fortBoyardAerial,
        alt: "Fort Boyard vu du ciel",
        caption: "Fort Boyard au milieu du pertuis",
      },
      {
        src: siteMedia.destination.chassironPointAerial,
        alt: "Pointe de Chassiron vue du ciel",
        caption: "La pointe nord d’Oléron",
      },
      {
        src: siteMedia.destination.chassironGardensAerial,
        alt: "Jardins du phare de Chassiron vus du ciel",
        caption: "Les jardins en rose des vents",
      },
      {
        src: siteMedia.destination.chassironCoastAerial,
        alt: "Phare de Chassiron face à l’océan",
        caption: "La côte rocheuse de Chassiron",
      },
      {
        src: siteMedia.properties["nid-d-ete"].hero.src,
        alt: "Accès à la plage près du Nid d’Été",
        caption: "La plage au bout du chemin",
      },
      {
        src: siteMedia.destination.beach,
        alt: "Plage sauvage d’Oléron",
        caption: "Les grandes plages atlantiques",
      },
      {
        src: siteMedia.destination.food,
        alt: "Fruits de mer de l’Atlantique",
        caption: "L’île gourmande",
      },
      {
        src: siteMedia.properties["nid-d-ete"].lifestyle[3].src,
        alt: "Forêt près de Boyardville",
        caption: "Sous les pins",
      },
      {
        src: siteMedia.destination.chassiron,
        alt: "Pointe et phare de Chassiron",
        caption: "Le bout du monde oléronais",
        credit: "Dimimis",
        license: "CC BY-SA 3.0",
        source: "https://commons.wikimedia.org/wiki/File:Pointe_de_Chassiron.jpg",
      },
      {
        src: siteMedia.destination.flowerDunes,
        alt: "Dunes fleuries et barques sur le sable",
        caption: "Les couleurs du littoral au printemps",
      },
      {
        src: siteMedia.destination.morningSurf,
        alt: "Surfeur dans la lumière du matin",
        caption: "L’océan au réveil",
      },
      {
        src: siteMedia.destination.familyForeshore,
        alt: "Famille jouant sur l’estran à marée basse",
        caption: "La plage, simplement, en famille",
      },
      {
        src: siteMedia.destination.fortBoyard,
        alt: "Fort Boyard aperçu depuis la plage",
        caption: "Fort Boyard à l’horizon",
      },
      {
        src: siteMedia.destination.oceanBreakfast,
        alt: "Petit-déjeuner face à l’océan",
        caption: "Le premier café face aux vagues",
      },
      {
        src: siteMedia.destination.beachPicnic,
        alt: "Pique-nique sur la plage",
        caption: "Une fin de journée sur le sable",
      },
    ],
    chapters: [
      {
        eyebrow: "Les Saumonards",
        title: "Une plage face à Fort Boyard",
        copy: "Depuis Boyardville, la forêt accompagne les derniers mètres avant une plage familiale ouverte sur le pertuis.",
        image: siteMedia.properties["nid-d-ete"].hero.src,
        tips: ["Venir le matin en famille", "Revenir à l’heure dorée"],
      },
      {
        eyebrow: "Le goût de l’île",
        title: "Cabanes et ports ostréicoles",
        copy: "Les chenaux et les cabanes racontent une île façonnée par l’huître, les marées et le travail des producteurs.",
        image: siteMedia.destination.food,
        tips: ["Acheter directement au producteur", "Demander les horaires selon la marée"],
      },
      {
        eyebrow: "Sous les pins",
        title: "Traverser la forêt sans se presser",
        copy: "À pied ou à vélo, les pistes ombragées offrent une autre respiration entre deux baignades.",
        image: siteMedia.properties["nid-d-ete"].lifestyle[3].src,
        tips: ["Emporter de l’eau", "Choisir les heures les plus fraîches"],
      },
    ],
  },
  {
    slug: "la-rochelle",
    title: "La Rochelle",
    kicker: "Vieux-Port · Arcades · Horizon maritime",
    introduction:
      "Une escapade urbaine à taille humaine, entre tours médiévales, marché couvert et promenades tournées vers l’océan.",
    hero: siteMedia.destination.sea,
    essentials: [
      { label: "À privilégier", value: "Une journée à pied" },
      { label: "Notre moment", value: "Le port au matin" },
      { label: "Depuis Ré", value: "Une escapade facile" },
    ],
    history: {
      title: "Une cité libre tournée vers l’Atlantique",
      copy: "Les tours du port, les arcades et les hôtels particuliers racontent une ville marchande et maritime. La Rochelle cultive depuis des siècles une indépendance d’esprit que l’on retrouve encore dans ses quartiers.",
      image: siteMedia.destination.sea,
    },
    map: {
      label: "Nos repères à La Rochelle",
      href: "https://www.openstreetmap.org/search?query=La%20Rochelle",
      points: [
        { name: "Vieux-Port", note: "Le meilleur point de départ" },
        { name: "Marché central", note: "Produits locaux et déjeuner spontané" },
        { name: "Gabut", note: "Ancien quartier portuaire coloré" },
        { name: "Parc Charruyer", note: "Une respiration verte près du centre" },
      ],
    },
    addresses: [
      {
        name: "Marché central",
        kind: "Marché",
        advice: "Nous composons le déjeuner au fil des étals, surtout les jours de grand marché.",
      },
      {
        name: "Les quais du Vieux-Port",
        kind: "Promenade",
        advice: "À parcourir tôt, avant que les terrasses ne remplissent le paysage.",
      },
      {
        name: "Rue Saint-Nicolas",
        kind: "Quartier",
        advice: "Petites boutiques et cafés : prenez une rue de traverse plutôt qu’un programme.",
      },
    ],
    seasons: [
      {
        season: "Printemps",
        advice: "Terrasses, parcs et promenade vers la mer sans la foule estivale.",
      },
      {
        season: "Été",
        advice: "Le port au petit matin, les musées aux heures chaudes et le large le soir.",
      },
      { season: "Automne", advice: "Marché généreux, lumière douce et belle énergie culturelle." },
      {
        season: "Hiver",
        advice: "Arcades abritées, aquarium et tables chaleureuses près du port.",
      },
    ],
    weather: [
      {
        condition: "Grand soleil",
        ideas: ["Tours du port", "Promenade jusqu’aux Minimes", "Apéritif face aux bateaux"],
      },
      {
        condition: "Vent",
        ideas: ["Arcades du centre", "Musée maritime", "Parc Charruyer à l’abri"],
      },
      {
        condition: "Pluie",
        ideas: ["Aquarium", "Bunker de La Rochelle", "Halles puis longue table rochelaise"],
      },
    ],
    audiences: {
      families: ["Aquarium", "Parc Charruyer", "Bus de mer vers les Minimes"],
      couples: ["Tours au matin", "Ruelles Saint-Nicolas", "Croisière au soleil couchant"],
    },
    itineraries: [
      {
        duration: "Une journée",
        title: "La Rochelle à pied",
        steps: ["Tours et Vieux-Port", "Marché central", "Arcades", "Gabut et front de mer"],
      },
      {
        duration: "Un week-end",
        title: "Ville et horizon",
        steps: [
          "Centre historique",
          "Musées maritimes",
          "Traversée vers Aix ou promenade littorale",
        ],
      },
    ],
    faq: [
      {
        question: "Où se garer pour visiter à pied ?",
        answer:
          "Les parkings relais permettent de rejoindre le centre sans chercher une place près du port.",
      },
      {
        question: "Combien de temps prévoir ?",
        answer:
          "Une journée révèle l’essentiel ; un week-end permet d’ajouter musées, littoral et traversée maritime.",
      },
      {
        question: "La ville convient-elle aux familles ?",
        answer:
          "Oui : les distances sont raisonnables et l’aquarium, les parcs et le bus de mer rythment facilement la journée.",
      },
    ],
    gallery: [
      {
        src: siteMedia.destination.sea,
        alt: "Bateau près de La Rochelle",
        caption: "La ville tournée vers le large",
      },
      {
        src: siteMedia.destination.food,
        alt: "Produits de l’Atlantique",
        caption: "Le marché et les arrivages",
      },
      {
        src: siteMedia.destination.lane,
        alt: "Ruelle fleurie",
        caption: "Les rues à parcourir lentement",
      },
      {
        src: siteMedia.destination.bridge,
        alt: "Littoral charentais au coucher du soleil",
        caption: "Prolonger vers l’horizon",
      },
      {
        src: siteMedia.destination.laRochelleOldPort,
        alt: "Entrée du Vieux-Port de La Rochelle",
        caption: "Entrer dans la ville par ses tours",
        credit: "Jebulon",
        license: "CC0",
        source: "https://commons.wikimedia.org/wiki/File:Entrance_La_Rochelle_old_harbor.jpg",
      },
    ],
    chapters: [
      {
        eyebrow: "Le Vieux-Port",
        title: "Entrer dans la ville par ses tours",
        copy: "Les quais offrent la plus belle introduction à La Rochelle avant de rejoindre les rues sous les arcades.",
        image: siteMedia.destination.sea,
        tips: ["Arriver avant 10 heures", "Parcourir les quais à pied"],
      },
      {
        eyebrow: "Le marché",
        title: "Composer un déjeuner rochelais",
        copy: "Sous les halles du XIXe siècle, poissons, légumes et produits charentais racontent la proximité de l’océan.",
        image: siteMedia.destination.food,
        tips: ["Privilégier les jours de grand marché", "Goûter selon les arrivages"],
      },
      {
        eyebrow: "Prolonger",
        title: "L’Île d’Aix et le littoral",
        copy: "Une traversée ou une promenade vers le large permet de retrouver Fort Boyard sous un autre angle.",
        image: siteMedia.destination.bridge,
        tips: ["Réserver la traversée en saison", "Vérifier la météo marine"],
      },
    ],
  },
];

export function getDestinationGuide(slug: string) {
  const guide = destinationGuides.find((item) => item.slug === slug);
  if (!guide) throw new Error(`Unknown destination guide: ${slug}`);
  return guide;
}
