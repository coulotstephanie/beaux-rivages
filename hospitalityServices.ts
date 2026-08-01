export type HospitalityServiceSlug =
  | "essentiel"
  | "bebe"
  | "animaux"
  | "experience-signature"
  | "romance"
  | "demande-en-mariage"
  | "anniversaire";
export type HospitalityService = {
  slug: HospitalityServiceSlug;
  title: string;
  icon: string;
  badge: string;
  price: number | null;
  intro: string;
  image: string;
  imageAlt: string;
  sections: { title: string; items: string[] }[];
  gallery: { src: string; alt: string }[];
  action: "included" | "booking" | "quote";
  practical?: { label: string; value: string }[];
  faq?: { question: string; answer: string }[];
  linenIncluded?: boolean;
  sources?: { label: string; href: string }[];
};

export const hospitalityServices: HospitalityService[] = [
  {
    slug: "essentiel",
    icon: "🌿",
    title: "Séjour Essentiel",
    badge: "Inclus dans toutes les réservations",
    price: 0,
    action: "included",
    intro:
      "L’essentiel Beaux Rivages est déjà là lorsque vous ouvrez la porte : une maison équipée, des repères clairs et nos conseils personnels pour vivre les îles simplement.",
    image: "/images/properties/chai-des-tortues/hero/chai-espace-de-vie.jpeg",
    imageAlt: "Pièce de vie du Chai des Tortues prête à accueillir les voyageurs",
    sections: [
      {
        title: "Toujours inclus",
        items: [
          "Arrivée autonome",
          "Maison entièrement équipée",
          "Wi-Fi",
          "Guide d’accueil",
          "Carnet Beaux Rivages",
          "Conseils de Stéphanie & Bruno",
          "Jeux et livres",
          "Équipements de plage selon le logement",
          "Équipement bébé selon le logement",
        ],
      },
      {
        title: "Le linge, à votre choix",
        items: [
          "Afin de répondre aux attentes de tous nos voyageurs, le linge de maison est proposé en option. Certains voyageurs préfèrent utiliser leur propre linge, notamment depuis l’évolution des habitudes liées au Covid. Cette formule permet à chacun de choisir la solution qui lui convient tout en conservant un tarif de séjour plus avantageux.",
        ],
      },
    ],
    practical: [
      { label: "Disponibilité", value: "Toute l’année · les trois maisons" },
      { label: "Tarif", value: "Inclus dans le prix du séjour" },
      { label: "Linge", value: "Optionnel, à sélectionner lors de la réservation" },
    ],
    faq: [
      {
        question: "Le linge est-il obligatoire ?",
        answer: "Non. Vous pouvez choisir le forfait linge ou apporter le vôtre.",
      },
      {
        question: "Les maisons sont-elles entièrement équipées ?",
        answer: "Oui. Les équipements propres à chaque maison sont détaillés sur sa fiche.",
      },
    ],
    gallery: [
      {
        src: "/images/properties/chai-des-tortues/kitchen/cuisine-et-table.jpeg",
        alt: "Cuisine et table équipées",
      },
      {
        src: "/images/properties/nid-d-ete/airbnb-salon-1.jpeg",
        alt: "Salon accueillant du Nid d’Été",
      },
    ],
  },
  {
    slug: "bebe",
    icon: "👶",
    title: "Les Tout-Petits sont les Bienvenus",
    badge: "Offert",
    price: 0,
    action: "included",
    intro:
      "Parce que voyager avec un tout-petit demande beaucoup d’organisation, nous mettons gratuitement à votre disposition une sélection d’équipements afin de vous permettre de voyager plus léger.",
    image: "/images/properties/nid-d-ete/editorial/lecture-bebe-et-chat.png",
    imageAlt: "Moment calme avec un bébé dans une maison Beaux Rivages",
    sections: [
      {
        title: "Dans les maisons",
        items: [
          "Lit parapluie",
          "Chaise haute",
          "Baignoire pliante",
          "Transat",
          "Tapis d’éveil",
          "Vaisselle bébé",
          "Jeux adaptés",
        ],
      },
      {
        title: "Selon le logement",
        items: ["Poussette au Chai des Tortues", "Tente anti-UV au Nid d’Été"],
      },
    ],
    practical: [
      { label: "Tarif", value: "Offert, sur demande préalable" },
      { label: "Poussette", value: "Le Chai des Tortues uniquement" },
      { label: "Tente anti-UV", value: "Le Nid d’Été uniquement" },
    ],
    faq: [
      {
        question: "Faut-il réserver les équipements ?",
        answer: "Oui. Indiquez vos besoins avant l’arrivée afin que nous préparions la maison.",
      },
      {
        question: "Le matériel est-il disponible dans toutes les maisons ?",
        answer:
          "Le socle commun l’est sur demande ; la poussette et la tente anti-UV dépendent du logement indiqué.",
      },
    ],
    gallery: [
      {
        src: "/images/properties/villa-raie-manta/editorial/chambre-enfants-famille.png",
        alt: "Chambre préparée pour une famille",
      },
      {
        src: "/images/properties/nid-d-ete/editorial/chambre-anniversaire-enfant.png",
        alt: "Chambre d’enfant du Nid d’Été",
      },
    ],
  },
  {
    slug: "animaux",
    icon: "🐶",
    title: "Vos Compagnons sont les Bienvenus",
    badge: "25 € par animal et par séjour",
    price: 25,
    action: "booking",
    intro:
      "Les animaux font partie du voyage. Nous préparons des repères utiles pour profiter des plages, forêts et promenades dans le respect des maisons et des îles.",
    image: "/images/destination/editorial/enfants-jouent-avec-chien.png",
    imageAlt: "Enfants jouant avec un chien sur la plage",
    sections: [
      {
        title: "L’accueil",
        items: [
          "Gamelles",
          "Villa Raie Manta : cour totalement close",
          "Le Nid d’Été : jardin totalement clos",
          "Suggestion de balade matinale",
          "Suggestion de balade en soirée",
        ],
      },
      {
        title: "Accès aux plages · informations officielles",
        items: [
          "Rivedoux-Plage : plage du Défend et plage Nord, hors promenade Théodore Porsain, tolérées de 20 h à 10 h avec chien tenu en laisse ; restrictions renforcées du 1er juin au 30 septembre.",
          "Saint-Georges-d’Oléron : les animaux ne sont pas acceptés sur la plage des Sables Vignier ; l’arrêté municipal affiché à l’entrée de chaque plage reste la référence.",
          "Les règles pouvant évoluer, vérifier systématiquement l’affichage municipal avant l’accès à la plage.",
        ],
      },
      {
        title: "Forêts, eau et ombre",
        items: [
          "Île de Ré : boisements et sentiers de Rivedoux, puis massifs du Lizay et de Trousse-Chemise selon les conditions d’accès officielles.",
          "Île d’Oléron : forêts domaniales des Saumonards, de Domino et de Saint-Trojan ; chiens sous contrôle et en laisse lorsque la réglementation l’impose.",
          "Points d’eau : littoral et points d’eau potable publics signalés sur place ; prévoir toujours une gourde et une gamelle, l’eau naturelle n’étant pas garantie potable.",
          "Zones ombragées : forêt des Saumonards, forêt de Domino et venelles arborées des villages ; privilégier matin et soirée en période chaude.",
        ],
      },
      {
        title: "Les règles essentielles",
        items: [
          "Apporter le couchage de votre animal",
          "Pas sur les lits ni les canapés",
          "Chien en laisse dans La Maison Heureuse",
          "Ramasser les déjections",
        ],
      },
    ],
    practical: [
      { label: "Tarif", value: "25 € par animal et par séjour" },
      {
        label: "Île de Ré",
        value: "Règlement détaillé : Office de tourisme Destination Île de Ré",
      },
      {
        label: "Île d’Oléron",
        value:
          "Règlement affiché à l’entrée de chaque plage et informations de l’Office de tourisme",
      },
      {
        label: "Forêt",
        value:
          "Du 15 avril au 30 juin, laisse obligatoire hors allées forestières ; respecter les restrictions temporaires.",
      },
    ],
    faq: [
      {
        question: "Les extérieurs sont-ils clos ?",
        answer: "La cour de Villa Raie Manta et le jardin du Nid d’Été sont totalement clos.",
      },
      {
        question: "Puis-je aller sur toutes les plages ?",
        answer:
          "Non. Les autorisations varient selon la commune, la plage, la saison et l’horaire. L’affichage municipal en vigueur fait foi.",
      },
      {
        question: "Dois-je apporter de l’eau ?",
        answer:
          "Oui. Emportez une gourde et une gamelle ; aucun point d’eau naturel ne doit être considéré comme potable.",
      },
    ],
    sources: [
      {
        label: "Destination Île de Ré · Chiens sur les plages",
        href: "https://www.iledere.com/sinformer/informations-locales-et-pratiques/chiens-sur-les-plages/",
      },
      {
        label: "Office de tourisme Île d’Oléron · Plage des Sables Vignier",
        href: "https://www.ile-oleron-marennes.com/preparer-mes-vacances/quoi-faire/activites-nautiques/plages/plage-des-sables-vignier",
      },
      {
        label: "Office national des forêts · Forêt domaniale de l’Île d’Oléron",
        href: "https://www.onf.fr/vivre-la-foret/foret-domaniale-pres-de-chez-moi/%2B/19c4%3A%3Aforet-domaniale-de-ile-oleron.html?lang=fr",
      },
    ],
    gallery: [
      {
        src: "/images/destination/editorial/famille-cerf-volant-chien.png",
        alt: "Famille et chien sur une plage de l’Atlantique",
      },
      {
        src: "/images/destination/editorial/enfants-jouent-avec-chien.png",
        alt: "Jeu avec un chien au bord de l’océan",
      },
    ],
  },
  {
    slug: "experience-signature",
    icon: "⭐",
    title: "Expérience Signature Beaux Rivages",
    badge: "145 € par séjour",
    price: 145,
    action: "booking",
    intro:
      "Une maison prête à vivre, le confort jusque sur la plage et un accueil gourmand choisi selon vos envies.",
    image: "/images/properties/villa-raie-manta/editorial/table-fruits-de-mer.png",
    imageAlt: "Grande table préparée pour l’Expérience Signature",
    sections: [
      {
        title: "Une maison prête à vivre",
        items: [
          "Lits faits",
          "Linge de toilette complet",
          "Tapis de bain",
          "Essuie-mains cuisine",
          "Essuie-mains toilettes avec lave-mains",
        ],
      },
      {
        title: "Le confort jusqu’à la plage",
        items: ["Serviettes de plage", "Deux peignoirs", "Deux paires de chaussons"],
      },
      {
        title: "Accueil gourmand au choix",
        items: [
          "Panier Apéritif : vin Pelletier de l’Île de Ré au choix, biscuits apéritifs, terrine artisanale",
          "Panier Douceur : biscuits artisanaux, confiture locale, caramels au beurre salé, jus de fruits",
          "Carte des producteurs et recommandations de Stéphanie & Bruno",
        ],
      },
      {
        title: "Les attentions",
        items: [
          "Carafe d’eau fraîche au réfrigérateur",
          "Le linge fourni est soigneusement lavé puis désinfecté entre chaque séjour afin de garantir une hygiène irréprochable et un confort digne des standards hôteliers.",
          "Attention personnalisée",
          "Arrivée anticipée ou départ tardif selon disponibilité",
          "Accès privilégié au Carnet Beaux Rivages",
        ],
      },
    ],
    linenIncluded: true,
    practical: [
      { label: "Tarif", value: "145 € par séjour" },
      { label: "Maisons", value: "Disponible dans les trois maisons" },
      { label: "Préparation", value: "Installée avant votre arrivée" },
    ],
    faq: [
      {
        question: "Le linge est-il compris ?",
        answer:
          "Oui. Les lits sont faits et le linge inclus est préparé selon le protocole de soin Beaux Rivages.",
      },
      {
        question: "Peut-on choisir le panier ?",
        answer: "Oui, parmi les propositions disponibles au moment de votre séjour.",
      },
    ],
    gallery: [
      {
        src: "/images/properties/chai-des-tortues/editorial/chambre-attention.png",
        alt: "Chambre préparée avec une attention",
      },
      {
        src: "/images/properties/villa-raie-manta/editorial/ilot-aperitif.png",
        alt: "Panier apéritif présenté sur l’îlot",
      },
      {
        src: "/images/properties/nid-d-ete/editorial/table-en-famille.png",
        alt: "Table du Nid d’Été préparée pour un séjour Signature",
      },
    ],
  },
  {
    slug: "romance",
    icon: "❤️",
    title: "Expérience Romance Signature",
    badge: "149 € par séjour",
    price: 149,
    action: "booking",
    intro:
      "Une lumière douce, une attention personnelle et un moment gourmand à partager à deux, préparés avec discrétion avant votre arrivée.",
    image: "/images/properties/villa-raie-manta/editorial/diner-romantique-ocean.png",
    imageAlt: "Dîner romantique face à l’océan",
    sections: [
      {
        title: "Ambiance romantique",
        items: [
          "Bougies LED",
          "Pétales de roses disposés en forme de cœur sur le lit",
          "Carte personnalisée",
        ],
      },
      {
        title: "À savourer à deux",
        items: [
          "Champagne, vin moelleux ou alternative sans alcool premium",
          "Deux flûtes",
          "Gourmandises artisanales",
        ],
      },
      {
        title: "Confort et liberté",
        items: [
          "Linge complet",
          "Deux peignoirs",
          "Deux paires de chaussons",
          "Huile de massage",
          "Playlist romantique par QR Code",
          "Arrivée anticipée ou départ tardif selon disponibilité",
          "Attention personnalisée",
          "Carafe d’eau fraîche au réfrigérateur",
        ],
      },
    ],
    linenIncluded: true,
    practical: [
      { label: "Tarif", value: "149 € par séjour" },
      { label: "Maisons", value: "Disponible dans les trois maisons" },
      { label: "Préparation", value: "Discrètement installée avant votre arrivée" },
    ],
    faq: [
      {
        question: "Le linge complet est-il inclus ?",
        answer: "Oui, avec les lits préparés pour votre arrivée.",
      },
      {
        question: "Une alternative sans alcool est-elle possible ?",
        answer: "Oui, une alternative premium peut remplacer la bouteille alcoolisée.",
      },
    ],
    gallery: [
      {
        src: "/images/properties/villa-raie-manta/editorial/chambre-romance.png",
        alt: "Chambre préparée pour une escapade romantique",
      },
      {
        src: "/images/properties/chai-des-tortues/editorial/diner-romantique-aux-chandelles.png",
        alt: "Dîner romantique aux chandelles",
      },
      {
        src: "/images/properties/nid-d-ete/editorial/diner-romantique.png",
        alt: "Soirée romantique au Nid d’Été",
      },
    ],
  },
  {
    slug: "demande-en-mariage",
    icon: "💍",
    title: "Expérience Demande en Mariage",
    badge: "Organisation sur mesure · devis personnalisé",
    price: null,
    action: "quote",
    intro:
      "Vous souhaitez faire votre demande en mariage dans un cadre exceptionnel ? Nous vous accompagnons avec discrétion afin de créer une expérience entièrement personnalisée.",
    image: "/images/destination/experiences/demande-mariage-ocean.jpg",
    imageAlt: "Demande en mariage face à l’océan",
    sections: [
      {
        title: "Nous pouvons notamment organiser",
        items: [
          "Décoration romantique",
          "Bouquet de fleurs",
          "Champagne ou alternative premium",
          "Gourmandises artisanales",
          "Carte personnalisée",
          "Photographe professionnel ou séance photo en option",
          "Choix du lieu et coucher de soleil",
          "Toute demande spécifique",
        ],
      },
    ],
    gallery: [
      {
        src: "/images/destination/experiences/demande-mariage-ocean.jpg",
        alt: "Demande en mariage au coucher du soleil",
      },
      {
        src: "/images/properties/villa-raie-manta/editorial/diner-romantique-ocean.png",
        alt: "Décoration romantique face à l’océan",
      },
    ],
  },
  {
    slug: "anniversaire",
    icon: "🎂",
    title: "Expérience Anniversaire",
    badge: "Organisation sur mesure · devis personnalisé",
    price: null,
    action: "quote",
    intro:
      "Racontez-nous la personne, l’âge et l’atmosphère souhaitée. Nous préparons une célébration personnelle, adaptée à la maison et à votre histoire.",
    image: "/images/properties/villa-raie-manta/editorial/table-anniversaire.png",
    imageAlt: "Table dressée pour un anniversaire",
    sections: [
      {
        title: "Nous pouvons notamment organiser",
        items: [
          "Décoration et ballons",
          "Gâteau",
          "Bouquet de fleurs",
          "Champagne ou alternative premium",
          "Gourmandises",
          "Carte personnalisée",
          "Photographe en option",
          "Réservation de restaurant",
          "Toute autre demande spécifique",
        ],
      },
    ],
    gallery: [
      {
        src: "/images/properties/villa-raie-manta/editorial/anniversaire-multigenerationnel.png",
        alt: "Anniversaire multigénérationnel",
      },
      {
        src: "/images/properties/nid-d-ete/editorial/chambre-anniversaire-enfant.png",
        alt: "Chambre préparée pour un anniversaire",
      },
      {
        src: "/images/properties/villa-raie-manta/editorial/table-anniversaire.png",
        alt: "Table d’anniversaire dressée",
      },
    ],
  },
];

export function getHospitalityService(slug: string) {
  return hospitalityServices.find((service) => service.slug === slug);
}
