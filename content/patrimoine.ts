export type HeritageHouseLink = {
  name: string;
  href: string;
  origin: string;
};

export type HeritageSite = {
  slug: string;
  island: "Île de Ré" | "Île d’Oléron";
  title: string;
  subtitle: string;
  introduction: string;
  history: string;
  architecture: string;
  visit: string;
  duration: string;
  access: string;
  price: string;
  audiences: string[];
  advice: string;
  coordinates: { lat: number; lng: number };
  mapQuery: string;
  images: { src: string; alt: string; credit?: string; creditHref?: string }[];
  source: { label: string; href: string };
  landmark: boolean;
};

export const heritageHouses: HeritageHouseLink[] = [
  {
    name: "Le Chai des Tortues",
    href: "/maisons/chai-des-tortues",
    origin: "Le Chai des Tortues, Rivedoux-Plage",
  },
  {
    name: "Villa Raie Manta",
    href: "/maisons/villa-raie-manta",
    origin: "Villa Raie Manta, Rivedoux-Plage",
  },
  {
    name: "Le Nid d’Été",
    href: "/maisons/nid-d-ete",
    origin: "Le Nid d'Été, Boyardville",
  },
];

export const heritageSites: HeritageSite[] = [
  {
    slug: "fort-boyard",
    island: "Île d’Oléron",
    title: "Fort Boyard",
    subtitle: "Une forteresse impossible devenue l’icône de l’Atlantique",
    introduction:
      "Entre Aix et Oléron, sa silhouette de pierre semble flotter sur l’océan. Fort Boyard raconte autant la démesure d’un chantier maritime que la capacité d’un monument à changer de destin.",
    history:
      "Commencés en 1803 pour protéger la rade et l’arsenal de Rochefort, les travaux s’étendent sur plus de soixante ans. Devenu trop tardivement utile sur le plan militaire, le fort sert notamment de prison avant d’être déclassé, abandonné puis sauvé. Le Département de la Charente-Maritime en est propriétaire depuis 1989.",
    architecture:
      "Édifié sur un banc de sable, le vaisseau de pierre repose sur un enrochement artificiel. Sa forme oblongue, ses niveaux de casemates et sa cour intérieure répondent aux contraintes d’un ouvrage défensif isolé en pleine mer.",
    visit:
      "Le fort ne se visite pas librement. On le découvre depuis les plages de Boyardville et des Saumonards, ou au cours d’une promenade en mer proposée par les compagnies locales.",
    duration: "1 h 30 à 2 h pour une sortie en mer",
    access: "Point de vue libre depuis la côte ; approche en bateau selon la saison",
    price: "Panorama gratuit ; croisière selon l’opérateur",
    audiences: ["Famille", "Couple", "Photographie", "Histoire maritime"],
    advice:
      "Depuis Le Nid d’Été, rejoignez la plage des Saumonards au début de la matinée. La lumière révèle alors les volumes du fort et le rivage reste paisible.",
    coordinates: { lat: 45.9996, lng: -1.2139 },
    mapQuery: "Fort Boyard",
    images: [
      {
        src: "/images/destination/patrimoine/fort-boyard-vue-rapprochee.jpg",
        alt: "Fort Boyard vu de près depuis l’océan",
      },
      {
        src: "/images/destination/patrimoine/fort-boyard-crepuscule-arthur-habudzik.jpg",
        alt: "Fort Boyard dans la lumière rose du crépuscule",
        credit: "Arthur Habudzik",
      },
      {
        src: "/images/destination/patrimoine/fort-boyard-coucher-soleil.jpg",
        alt: "Silhouette de Fort Boyard au coucher du soleil",
      },
      {
        src: "/images/destination/patrimoine/fort-boyard-archives-comparaison.jpg",
        alt: "Document d’archives comparant Fort Boyard entre 1910-1930 et 2022",
      },
    ],
    source: {
      label: "Département de la Charente-Maritime",
      href: "https://la.charente-maritime.fr/culture-patrimoine/fort-boyard",
    },
    landmark: true,
  },
  {
    slug: "phare-des-baleines",
    island: "Île de Ré",
    title: "Le Phare des Baleines",
    subtitle: "Là où la terre s’efface pour laisser place à l’océan",
    introduction:
      "À l’extrémité occidentale de l’Île de Ré, le phare accompagne les voyageurs jusqu’au grand large. L’ascension offre un panorama où les marais, les plages et l’Atlantique se rejoignent.",
    history:
      "Construit entre 1849 et 1853 puis inauguré en 1854, le Grand Phare succède à la Vieille Tour mise en service en 1682. Les deux édifices composent aujourd’hui un ensemble patrimonial exceptionnel.",
    architecture:
      "La tour de pierre s’élève à 57 mètres. Ses 257 marches conduisent à une plateforme panoramique, tandis que la Vieille Tour et le musée racontent l’évolution de la signalisation maritime.",
    visit:
      "Prévoyez l’ascension, le parc et la Vieille Tour. Les horaires et tarifs évoluent selon la saison : consultez toujours le site officiel avant le départ.",
    duration: "1 h 30 à 2 h",
    access: "Parking sur site ; plateforme sommitale accessible par escalier",
    price: "Accès au parc libre ; visite du phare payante",
    audiences: ["Famille", "Couple", "Vélo", "Panorama"],
    advice:
      "Venez en fin d’après-midi, après le principal pic de fréquentation, puis prolongez jusqu’au coucher du soleil sur la côte sauvage.",
    coordinates: { lat: 46.2441, lng: -1.5611 },
    mapQuery: "Phare des Baleines, Saint-Clément-des-Baleines",
    images: [
      {
        src: "/images/destination/re-authentique/phare-des-baleines.jpg",
        alt: "Le Phare des Baleines depuis la plage",
      },
      {
        src: "/images/destination/re-authentique/vieille-tour-des-baleines.jpg",
        alt: "La Vieille Tour des Baleines face à l’océan",
      },
      {
        src: "/images/destination/re-authentique/cairn-plage.jpg",
        alt: "Cairn de galets sur la côte sauvage rétaise",
      },
    ],
    source: {
      label: "Destination Île de Ré — Phare des Baleines",
      href: "https://www.iledere.com/organiser-activites-et-loisirs/sites-de-visites-patrimoine-culture/musees-et-monuments/phare-des-baleines-le-grand-phare-saint-clement-des-baleines-fr-107514/",
    },
    landmark: true,
  },
  {
    slug: "fort-la-pree",
    island: "Île de Ré",
    title: "Fort La Prée",
    subtitle:
      "Le plus ancien fort militaire de l’Île de Ré, témoin de quatre siècles d’histoire face à l’océan Atlantique.",
    introduction:
      "Entre Rivedoux-Plage et La Flotte, Fort La Prée veille sur la côte orientale de l’île. Plus intime que les remparts de Saint-Martin, il permet de traverser quatre siècles d’histoire militaire au plus près de la pierre et de l’océan.",
    history:
      "Construit en 1625-1626 sous Louis XIII pour affirmer l’autorité royale et surveiller les accès maritimes, le fort participe aux événements de 1627. Remanié à plusieurs reprises, notamment dans le système défensif réorganisé par Vauban, il connaît ensuite des usages militaires, pénitentiaires, allemands puis sociaux.",
    architecture:
      "Son noyau bastionné, ses courtines, ses fossés, sa place d’armes et ses extensions successives permettent de lire plusieurs époques de la fortification côtière. Les parties hautes ouvrent un vaste panorama vers le pertuis.",
    visit:
      "La visite libre ou guidée traverse les salles, les expositions, les hauteurs et les extérieurs. Les horaires et animations varient selon la saison : consultez toujours le site officiel avant votre venue.",
    duration: "45 minutes à 1 h 30",
    access: "Route de Rivedoux, à la sortie de La Flotte ; ouverture saisonnière",
    price: "Visite payante ; tarifs et programmation à vérifier sur le site officiel",
    audiences: ["Famille", "Histoire", "Vélo", "Panorama"],
    advice:
      "Nous préférons la première visite du matin : le lieu est plus calme, la pierre garde encore la fraîcheur et la vue depuis les hauteurs est souvent très nette. Vérifiez l’ouverture avant de partir.",
    coordinates: { lat: 46.1825, lng: -1.2956 },
    mapQuery: "Fort La Prée, La Flotte",
    images: [
      {
        src: "/images/destination/patrimoine/fort-la-pree-photo-a-venir.svg",
        alt: "Emplacement réservé à une photographie du Fort La Prée fournie par Stéphanie",
      },
    ],
    source: {
      label: "Fort La Prée — site officiel",
      href: "https://www.fort-la-pree.com/",
    },
    landmark: true,
  },
  {
    slug: "fortifications-vauban-saint-martin-de-re",
    island: "Île de Ré",
    title: "Les fortifications Vauban",
    subtitle:
      "Entre remparts classés à l’UNESCO, ruelles pavées et port historique, Saint-Martin-de-Ré raconte plus de quatre siècles d’histoire maritime.",
    introduction:
      "Les remparts dessinent autour de Saint-Martin un paysage spectaculaire. Ici, la promenade relie histoire militaire, vues sur le pertuis et douceur d’un port toujours vivant.",
    history:
      "Louis XIV confie à Vauban la protection de Saint-Martin-de-Ré afin de défendre l’arsenal de Rochefort. Conçues comme refuge pour la population de l’île, les fortifications sont inscrites avec le Réseau des sites majeurs de Vauban au patrimoine mondial de l’UNESCO depuis 2008.",
    architecture:
      "Bastions, fossés, glacis et portes composent une enceinte pensée pour réduire les angles morts et désorienter l’assaillant. La citadelle elle-même reste un établissement pénitentiaire et ne se visite pas.",
    visit:
      "Parcourez librement les remparts, de la plage de la Cible au parc de la Barbette et au port. L’Office de tourisme propose aussi des visites guidées.",
    duration: "1 h 30 à 2 h 30",
    access: "Promenade extérieure en accès libre ; citadelle non visitable",
    price: "Accès libre ; visites guidées payantes",
    audiences: ["Famille", "Couple", "Vélo", "UNESCO"],
    advice:
      "Commencez côté plage de la Cible en fin de journée. La marche vers le port suit les remparts dans une lumière plus douce et offre de beaux points de vue.",
    coordinates: { lat: 46.2033, lng: -1.3658 },
    mapQuery: "Fortifications de Saint-Martin-de-Ré",
    images: [
      {
        src: "/images/destination/guide-port-saint-martin.jpg",
        alt: "Port de Saint-Martin-de-Ré entouré de ses fortifications",
      },
      {
        src: "/images/destination/re-authentique/saint-martin-port-nuit.jpg",
        alt: "Port de Saint-Martin-de-Ré illuminé à la nuit tombée",
      },
      {
        src: "/images/destination/re-authentique/pont-coucher-soleil-velo.jpg",
        alt: "Cycliste face au soleil couchant sur l’Île de Ré",
      },
    ],
    source: {
      label: "Destination Île de Ré — Fortifications Vauban",
      href: "https://www.iledere.com/decouvrir/les-incontournables/les-fortifications-de-vauban-a-saint-martin-de-re/",
    },
    landmark: true,
  },
  {
    slug: "abbaye-des-chateliers",
    island: "Île de Ré",
    title: "L’Abbaye des Châteliers",
    subtitle:
      "Depuis près de neuf siècles, les majestueuses ruines de l’Abbaye des Châteliers témoignent du passé spirituel et maritime de l’Île de Ré.",
    introduction:
      "À La Flotte, les ruines de l’abbaye dressent leur silhouette claire entre les champs et la mer. Le lieu invite autant à comprendre qu’à contempler.",
    history:
      "Fondée en 1156 par des moines cisterciens, l’abbaye participe au développement économique de l’île, notamment par la vigne et les marais salants. Classé Monument historique, le site reste accessible toute l’année.",
    architecture:
      "L’église à ciel ouvert, les galeries, les traces du cloître et du réfectoire permettent encore de lire l’organisation de l’ensemble monastique.",
    visit:
      "La visite est libre. Des panneaux accompagnent la découverte et le Musée du Platin propose ponctuellement des visites guidées.",
    duration: "45 min à 1 h 15",
    access: "Accès libre toute l’année ; stationnement à proximité",
    price: "Gratuit hors visite guidée",
    audiences: ["Famille", "Couple", "Vélo", "Photographie"],
    advice:
      "Arrivez une heure avant le coucher du soleil. La pierre devient dorée et la perspective vers la mer donne au site toute sa poésie.",
    coordinates: { lat: 46.1747, lng: -1.3118 },
    mapQuery: "Abbaye des Châteliers, La Flotte",
    images: [
      {
        src: "/images/destination/re-authentique/abbaye-chateliers-jardins.jpg",
        alt: "Ruines de l’Abbaye des Châteliers et jardins",
      },
      {
        src: "/images/destination/re-authentique/abbaye-chateliers-interieur.jpg",
        alt: "Nef à ciel ouvert de l’Abbaye des Châteliers",
      },
      {
        src: "/images/destination/pont-ile-de-re-rose.jpg",
        alt: "Lumière du soir sur l’Île de Ré",
      },
    ],
    source: {
      label: "Destination Île de Ré — Abbaye des Châteliers",
      href: "https://www.iledere.com/decouvrir/les-incontournables/labbaye-des-chateliers/",
    },
    landmark: true,
  },
  {
    slug: "lilleau-des-niges",
    island: "Île de Ré",
    title: "Réserve naturelle nationale de Lilleau des Niges",
    subtitle:
      "Au cœur des marais de l’Île de Ré, un refuge où les oiseaux font escale entre l’Europe et l’Afrique",
    introduction:
      "Dans la baie du Fier d’Ars, anciennes salines, prés salés et vasières composent un sanctuaire vivant. Chaque saison renouvelle les lumières, les migrations et les silences.",
    history:
      "Créée le 31 janvier 1980, la réserve naturelle nationale protège 121 hectares aux Portes-en-Ré. Elle est gérée par la LPO pour le compte de l’État.",
    architecture:
      "Le paysage reprend la trame historique des marais salants : bassins, bosses herbeuses, digues, prés salés et vasières alternativement découverts et recouverts par la marée.",
    visit:
      "La réserve elle-même est protégée. Sa découverte s’effectue depuis les itinéraires autorisés, la Maison du Fier et les sorties accompagnées de la LPO.",
    duration: "1 h 30 à une demi-journée",
    access:
      "Maison du Fier, Route du Vieux Port, Les Portes-en-Ré ; chemins et points d’observation autorisés",
    price: "Observation extérieure gratuite ; musée et sorties selon programmation",
    audiences: ["Famille", "Nature", "Oiseaux", "Vélo"],
    advice:
      "Venez tôt, avec des jumelles, et parlez doucement. La meilleure observation est souvent celle qui laisse suffisamment de temps aux oiseaux pour oublier notre présence.",
    coordinates: { lat: 46.2318, lng: -1.4936 },
    mapQuery: "Maison du Fier, Les Portes-en-Ré",
    images: [
      {
        src: "/images/destination/patrimoine/lilleau-des-niges-photo-a-venir.svg",
        alt: "Emplacement réservé à une photographie de Lilleau des Niges fournie par Stéphanie",
      },
    ],
    source: {
      label: "LPO — Réserve naturelle de Lilleau des Niges",
      href: "https://www.lpo.fr/la-lpo-en-actions/preservation-des-espaces-naturels/nos-reserves-naturelles/rnn-de-lilleau-des-niges",
    },
    landmark: true,
  },
  {
    slug: "fier-d-ars",
    island: "Île de Ré",
    title: "Le Fier d’Ars",
    subtitle:
      "Là où l’océan rencontre les marais, l’un des paysages les plus sauvages et changeants de l’Île de Ré",
    introduction:
      "Baie presque fermée tournée vers le pertuis Breton, le Fier d’Ars change de visage au rythme de l’eau. Les reflets, les vasières, les oiseaux et les salines en font un paysage à observer lentement.",
    history:
      "Les premiers marais salants apparaissent au XIVe siècle. La sédimentation permet leur extension autour d’Ars et de Loix au début du XVe siècle, puis le sel façonne durablement l’économie et le paysage du nord de l’île.",
    architecture:
      "Chenaux, digues, bassins salicoles, prés salés et vasières forment une architecture paysagère où les gestes des sauniers s’accordent aux marées.",
    visit:
      "Le Fier s’observe depuis Ars-en-Ré, les pistes et points d’observation autorisés ainsi que les abords de Lilleau des Niges. Restez sur les itinéraires balisés.",
    duration: "2 heures à une journée",
    access: "À vélo depuis Ars-en-Ré ou Les Portes-en-Ré ; stationnement dans les zones autorisées",
    price: "Gratuit",
    audiences: ["Nature", "Oiseaux", "Vélo", "Photographie"],
    advice:
      "Choisissez le lever du jour ou la lumière du soir, puis arrêtez-vous plusieurs fois : les reflets et les oiseaux transforment le paysage à chaque marée.",
    coordinates: { lat: 46.2269, lng: -1.4718 },
    mapQuery: "Fier d'Ars, Ars-en-Ré",
    images: [
      {
        src: "/images/destination/patrimoine/fier-d-ars-photo-a-venir.svg",
        alt: "Emplacement réservé à une photographie du Fier d’Ars fournie par Stéphanie",
      },
    ],
    source: {
      label: "Destination Île de Ré — Marais et Fier d’Ars",
      href: "https://www.iledere.com/organiser-activites-et-loisirs/sites-de-visites-patrimoine-culture/marais-et-fier-dars-ars-en-re-fr-5459591/",
    },
    landmark: true,
  },
  {
    slug: "ecluses-a-poissons-ile-de-re",
    island: "Île de Ré",
    title: "Les Écluses à Poissons",
    subtitle:
      "À marée basse, des murs de pierre pluriséculaires racontent l’ingéniosité des habitants de l’Île de Ré",
    introduction:
      "Lorsque l’océan se retire, de grands fers à cheval de pierre apparaissent sur l’estran. Ces pêcheries traditionnelles utilisent simplement la marée pour retenir les poissons.",
    history:
      "Apparues à la fin du Moyen Âge, les écluses constituaient une ressource alimentaire essentielle. L’île en comptait encore 140 en activité en 1900 ; une quinzaine environ demeure aujourd’hui visible et protégée.",
    architecture:
      "Deux bras de pierres sèches dessinent un fer à cheval ouvert vers la côte. À marée descendante, l’eau s’évacue tandis que les poissons sont guidés vers la partie basse de l’ouvrage.",
    visit:
      "Observez les écluses depuis les zones autorisées à marée basse ou participez à une visite de l’ADEPIR. Il est interdit de pénétrer ou pêcher à moins de 25 mètres des ouvrages.",
    duration: "1 h 30 à 2 h",
    access:
      "Plages de la côte sauvage, notamment Montamer à Sainte-Marie-de-Ré ; horaires liés aux marées",
    price: "Observation gratuite ; visites guidées selon programmation",
    audiences: ["Famille", "Patrimoine maritime", "Nature", "Grandes marées"],
    advice:
      "Consultez impérativement les marées, gardez vos distances et ne déplacez aucune pierre. Une visite accompagnée permet de comprendre ce patrimoine sans le fragiliser.",
    coordinates: { lat: 46.146, lng: -1.325 },
    mapQuery: "Plage de Montamer, Sainte-Marie-de-Ré",
    images: [
      {
        src: "/images/destination/patrimoine/ecluses-poissons-photo-a-venir.svg",
        alt: "Emplacement réservé à une photographie des écluses à poissons fournie par Stéphanie",
      },
    ],
    source: {
      label: "Destination Île de Ré — Les écluses à poissons",
      href: "https://www.iledere.com/decouvrir/les-incontournables/les-ecluses-a-poissons/",
    },
    landmark: true,
  },
  {
    slug: "pont-de-l-ile-de-re",
    island: "Île de Ré",
    title: "Le Pont de l’Île de Ré",
    subtitle:
      "Quelques kilomètres suspendus entre ciel et océan : le passage entre le quotidien et les vacances",
    introduction:
      "Depuis La Rochelle, la chaussée s’élève et l’horizon s’ouvre. La traversée révèle l’océan, les voiliers puis Rivedoux-Plage : pour beaucoup, les vacances commencent précisément ici.",
    history:
      "Mis en service en 1988 après moins de deux ans de travaux, le pont remplace une desserte maritime longtemps tributaire des horaires et de la météo.",
    architecture:
      "Long de 2 926,5 mètres, l’ouvrage repose sur 28 piles et 796 voussoirs préfabriqués assemblés par précontrainte. Son tablier accueille la route, une piste cyclable et un cheminement piéton.",
    visit:
      "La traversée est possible en voiture, bus, navette, à vélo ou à pied. Les cyclistes et piétons passent gratuitement ; les véhicules motorisés acquittent l’écotaxe en direction de l’île.",
    duration: "Quelques minutes en véhicule ; environ 20 à 30 minutes à vélo",
    access: "Entre La Repentie à La Rochelle et Sablanceaux à Rivedoux-Plage ; ouvert 24 h/24",
    price: "Gratuit à pied et à vélo ; écotaxe variable pour les véhicules motorisés",
    audiences: ["Famille", "Vélo", "Architecture", "Panorama"],
    advice:
      "En arrivant en fin de journée, prolongez jusqu’à Rivedoux-Plage et regardez le pont reprendre toute sa courbe dans la lumière du soir.",
    coordinates: { lat: 46.17, lng: -1.238 },
    mapQuery: "Pont de l'Île de Ré",
    images: [
      {
        src: "/images/destination/patrimoine/pont-ile-de-re-photo-a-venir.svg",
        alt: "Emplacement réservé à une photographie du Pont de l’Île de Ré fournie par Stéphanie",
      },
    ],
    source: {
      label: "Département de la Charente-Maritime — Pont de l’Île de Ré",
      href: "https://la.charente-maritime.fr/routes-transports/ponts/pont-lile-re",
    },
    landmark: true,
  },
  {
    slug: "marais-salants-ile-de-re",
    island: "Île de Ré",
    title: "Les marais salants",
    subtitle: "Un paysage millénaire façonné par l’eau, le vent et le geste",
    introduction:
      "Les marais ne sont pas un décor immobile. Ils forment un paysage productif et vivant, rythmé par les saisons, les oiseaux migrateurs et le travail précis des sauniers.",
    history:
      "L’exploitation salicole se développe dès le Moyen Âge et se transmet de génération en génération. En 2023, le sel et la fleur de sel de l’Île de Ré ont obtenu l’Indication Géographique Protégée.",
    architecture:
      "Le réseau de bassins et de chenaux conduit l’eau de mer jusqu’aux œillets où le sel cristallise. Cette géométrie hydraulique compose un patrimoine autant technique que paysager.",
    visit:
      "Explorez les pistes autorisées à vélo et privilégiez les visites encadrées pour comprendre le métier sans pénétrer dans les propriétés ni déranger la faune.",
    duration: "1 h 30 à une demi-journée",
    access: "Pistes cyclables et points d’observation ; respecter les zones de travail",
    price: "Balade libre ; visites selon le prestataire",
    audiences: ["Famille", "Couple", "Vélo", "Nature"],
    advice:
      "Choisissez le début de matinée ou la lumière rasante du soir. Roulez doucement : les reflets changent à chaque bassin et les oiseaux sont souvent proches.",
    coordinates: { lat: 46.2149, lng: -1.4758 },
    mapQuery: "Écomusée du Marais Salant, Loix",
    images: [
      {
        src: "/images/destination/editorial/marais-salants-lumiere-du-soir.png",
        alt: "Marais salants de l’Île de Ré dans la lumière du soir",
      },
      { src: "/images/destination/saunier.jpeg", alt: "Saunier au travail dans les marais" },
      {
        src: "/images/destination/marais-coucher-soleil.jpeg",
        alt: "Coucher de soleil sur les marais salants",
      },
    ],
    source: {
      label: "Destination Île de Ré — Marais salants",
      href: "https://www.iledere.com/decouvrir/bienvenue-ile-de-re/un-ecrin-naturel/les-marais-salants/",
    },
    landmark: false,
  },
  {
    slug: "port-de-la-flotte",
    island: "Île de Ré",
    title: "Le port de La Flotte",
    subtitle: "Pierres blondes, marché ancien et horizon de bateaux",
    introduction:
      "Le port de La Flotte se découvre sans itinéraire imposé : un quai, une venelle, le marché médiéval, puis le retour de la lumière sur les façades.",
    history:
      "Le village doit une grande part de son identité à son activité maritime et commerciale. Son patrimoine se lit dans le port, les quais, le marché d’inspiration médiévale et la proximité de l’Abbaye des Châteliers.",
    architecture:
      "Les maisons claires, les arcades du marché et le bassin protégé forment un ensemble à échelle humaine où la pierre rétaise dialogue avec les gréements.",
    visit:
      "Associez le port au marché et aux rues piétonnes. Les jours et horaires du marché variant selon la saison, vérifiez-les auprès de l’Office de tourisme.",
    duration: "1 h 30 à 2 h",
    access: "Centre ancien principalement piéton ; parkings en périphérie",
    price: "Gratuit",
    audiences: ["Famille", "Couple", "Vélo", "Gourmand"],
    advice:
      "Venez tôt pour le marché, puis revenez sur le port à l’heure bleue. Ce sont deux atmosphères très différentes et toutes deux racontent La Flotte.",
    coordinates: { lat: 46.1875, lng: -1.3262 },
    mapQuery: "Port de La Flotte, Île de Ré",
    images: [
      {
        src: "/images/destination/patrimoine/port-la-flotte.jpg",
        alt: "Vieux port de La Flotte sur l’Île de Ré",
        credit: "Pline · CC BY-SA 3.0",
        creditHref:
          "https://commons.wikimedia.org/wiki/File:Port-de-La-Flotte-Ile-de-R%C3%A9-DSC_4533.jpg",
      },
      {
        src: "/images/destination/re-authentique/marche-la-flotte-allee.jpg",
        alt: "Allée du marché traditionnel de La Flotte",
      },
      {
        src: "/images/destination/re-authentique/marche-la-flotte-primeur.jpg",
        alt: "Étal de primeur au marché de La Flotte",
      },
    ],
    source: {
      label: "Destination Île de Ré — La Flotte",
      href: "https://www.iledere.com/decouvrir/une-ile-10-villages/la-flotte/",
    },
    landmark: false,
  },
  {
    slug: "foret-des-saumonards",
    island: "Île d’Oléron",
    title: "La forêt des Saumonards",
    subtitle: "Des pins, des dunes et Fort Boyard en ligne d’horizon",
    introduction:
      "À Boyardville, la forêt accompagne le chemin jusqu’à la plage. L’air résineux, le sable et la silhouette de Fort Boyard composent l’un des paysages les plus apaisants d’Oléron.",
    history:
      "Cette forêt littorale s’inscrit dans l’histoire des dunes protégées par les boisements. Elle forme aujourd’hui un milieu naturel fragile où forêt, plage et espaces ostréicoles se rencontrent.",
    architecture:
      "Ici, l’architecture est paysagère : pins maritimes, sous-bois, dune et laisse de mer forment des étages naturels qui protègent le trait de côte.",
    visit:
      "Restez sur les chemins balisés et les accès aménagés afin de préserver les dunes. Une randonnée guidée officielle permet ponctuellement de comprendre la faune, la flore et la formation dunaire.",
    duration: "1 h à 2 h 30",
    access: "Sentiers forestiers et accès plage ; terrain naturel parfois meuble",
    price: "Gratuit hors sortie guidée",
    audiences: ["Famille", "Couple", "Vélo", "Nature"],
    advice:
      "Partez directement du Nid d’Été à pied, tôt le matin. La forêt est calme, la plage presque vide et Fort Boyard apparaît au bout du chemin.",
    coordinates: { lat: 45.9946, lng: -1.3162 },
    mapQuery: "Forêt des Saumonards, Saint-Georges-d'Oléron",
    images: [
      {
        src: "/images/destination/patrimoine/saumonards-plage.jpg",
        alt: "Plage des Saumonards et lisière de la forêt sous un ciel bleu",
      },
      {
        src: "/images/destination/patrimoine/saumonards-fort-boyard-pins.jpeg",
        alt: "Fort Boyard apparaissant au bout d’un chemin dans les pins des Saumonards",
      },
      {
        src: "/images/destination/patrimoine/saumonards-dune-coucher-soleil.jpeg",
        alt: "Dunes et plage des Saumonards dans la lumière du soir",
      },
    ],
    source: {
      label: "Office de tourisme Marennes Oléron — Mer et forêt",
      href: "https://www.ile-oleron-marennes.com/preparer-mes-vacances/quoi-faire/visites-guidees-et-sorties-nature/randonnee-entre-mer-foret",
    },
    landmark: false,
  },
  {
    slug: "citadelle-du-chateau-d-oleron",
    island: "Île d’Oléron",
    title: "La Citadelle du Château-d’Oléron",
    subtitle: "Une place forte tournée vers le pertuis",
    introduction:
      "Depuis ses remparts, la citadelle embrasse le port ostréicole, le pertuis et le pont d’Oléron. La promenade relie l’histoire défensive à la création contemporaine.",
    history:
      "Construite sur les ruines du château des Ducs d’Aquitaine, la place forte participe à la protection de l’arsenal de Rochefort. Bombardée en 1945, elle a été progressivement restaurée par la commune.",
    architecture:
      "Remparts, portes, poudrière, arsenal et plan régulier témoignent de l’urbanisme militaire. Les hauteurs offrent des perspectives remarquables sur le port et les chenaux.",
    visit:
      "La citadelle se parcourt librement toute l’année. Des expositions temporaires occupent la poudrière et l’arsenal à certaines périodes.",
    duration: "1 h 30 à 2 h",
    access: "Accès libre ; certaines parties présentent pavés, pentes et remparts",
    price: "Gratuit hors événements ou visites spécifiques",
    audiences: ["Famille", "Couple", "Histoire", "Panorama"],
    advice:
      "Commencez par les remparts puis descendez vers les cabanes colorées. En fin de journée, la lumière relie magnifiquement la pierre, l’eau et les façades peintes.",
    coordinates: { lat: 45.884, lng: -1.1961 },
    mapQuery: "Citadelle du Château-d'Oléron",
    images: [
      {
        src: "/images/destination/patrimoine/citadelle-chateau-oleron-porte.jpg",
        alt: "Porte monumentale de la Citadelle du Château-d’Oléron",
      },
      {
        src: "/images/destination/patrimoine/citadelle-oleron-vauban.jpg",
        alt: "Remparts Vauban de la Citadelle du Château-d’Oléron",
        credit: "Jacques Le Letty · CC BY-SA 3.0",
        creditHref: "https://commons.wikimedia.org/wiki/File:Citadelle_Ol%C3%A9ron_Vauban.JPG",
      },
      {
        src: "/images/destination/patrimoine/citadelle-oleron-port.jpg",
        alt: "Le port observé depuis la Citadelle du Château-d’Oléron",
        credit: "Jacques Le Letty · CC BY-SA 3.0",
        creditHref: "https://commons.wikimedia.org/wiki/File:Citadelle_Oleron_port.JPG",
      },
    ],
    source: {
      label: "Office de tourisme Marennes Oléron — Le Château-d’Oléron",
      href: "https://www.ile-oleron-marennes.com/decouvrir/l-ile-d-oleron/le-chateau-d-oleron",
    },
    landmark: true,
  },
  {
    slug: "cabanes-ostreicoles-chateau-d-oleron",
    island: "Île d’Oléron",
    title: "Les cabanes ostréicoles",
    subtitle: "Couleurs, savoir-faire et création au bord des chenaux",
    introduction:
      "Au Château-d’Oléron, les anciennes cabanes de travail composent un paysage unique. Ostréiculteurs, artistes et artisans y partagent encore un même territoire de bois et d’eau.",
    history:
      "Le port reste marqué par l’activité ostréicole. Une partie des cabanes a accueilli des ateliers de créateurs, donnant une nouvelle vie au bâti sans effacer la mémoire du travail maritime.",
    architecture:
      "Petites constructions en bois alignées le long des chenaux, les cabanes se distinguent par leurs couleurs franches et leur relation directe avec les claires et les voies d’eau.",
    visit:
      "Cheminez à pied entre les ateliers et les exploitations en respectant les zones de travail. Les ouvertures des créateurs varient : privilégiez la journée.",
    duration: "1 h à 1 h 30",
    access: "Promenade plane en grande partie ; vigilance près des chenaux",
    price: "Gratuit",
    audiences: ["Famille", "Couple", "Artisanat", "Gourmand"],
    advice:
      "Prenez le temps d’échanger avec les artisans et les producteurs. Le meilleur souvenir n’est pas seulement une photo, mais l’histoire d’un geste racontée sur place.",
    coordinates: { lat: 45.8812, lng: -1.2001 },
    mapQuery: "Cabanes de créateurs, Le Château-d'Oléron",
    images: [
      {
        src: "/images/destination/patrimoine/cabanes-ostreicoles-chateau-oleron.jpg",
        alt: "Cabanes ostréicoles colorées du Château-d’Oléron",
        credit: "Philippe Rio · CC BY 2.0",
        creditHref:
          "https://commons.wikimedia.org/wiki/File:Cabanes_ostr%C3%A9icoles_au_Ch%C3%A2teau-d%27Ol%C3%A9ron.jpg",
      },
      {
        src: "/images/destination/patrimoine/cabanes-renovees-chateau-oleron.jpg",
        alt: "Anciennes cabanes ostréicoles devenues ateliers de créateurs",
        credit: "Myrabella · CC BY-SA 3.0",
        creditHref: "https://commons.wikimedia.org/wiki/File:Chateau_Oleron_cabanes_renovees.JPG",
      },
      { src: "/images/destination/bateau-calme.jpeg", alt: "Bateau près des chenaux ostréicoles" },
    ],
    source: {
      label: "Office de tourisme Marennes Oléron — Le Château-d’Oléron",
      href: "https://www.ile-oleron-marennes.com/decouvrir/l-ile-d-oleron/le-chateau-d-oleron",
    },
    landmark: false,
  },
  {
    slug: "maison-heureuse-boyardville",
    island: "Île d’Oléron",
    title: "La Maison Heureuse",
    subtitle: "Un lieu de mémoire ouvert sur la lumière, la forêt et l’océan",
    introduction:
      "À Boyardville, sa façade jaune et blanche veille sur un domaine né de l’histoire maritime. Ancien lieu d’accueil pour les enfants, la Maison Heureuse abrite aujourd’hui Le Nid d’Été et prolonge une histoire où l’air, la lumière et la nature occupent la première place.",
    history:
      "Le site est lié au développement de Boyardville et à l’aventure de Fort Boyard. Transformé au XXe siècle par l’architecte Clément Camus, avec l’intervention du décorateur André Hellé, il devient une colonie de vacances pensée selon les principes des écoles de plein air. La Maison Heureuse est protégée au titre des Monuments historiques depuis 2004.",
    architecture:
      "Volumes largement vitrés, composition symétrique, terrasses, galeries et relation directe avec le paysage traduisent une architecture conçue pour faire entrer l’air et la lumière. La restauration récente a préservé cette identité tout en permettant de nouveaux usages.",
    visit:
      "La résidence demeure un lieu privé. Les voyageurs du Nid d’Été en découvrent les perspectives, les allées et l’accès privé conduisant vers la plage des Saumonards, dans le respect de la tranquillité des résidents.",
    duration: "À vivre au fil du séjour au Nid d’Été",
    access: "Résidence privée ; accès réservé aux résidents et à leurs voyageurs",
    price: "Inclus dans le séjour au Nid d’Été",
    audiences: ["Architecture", "Mémoire", "Famille", "Océan"],
    advice:
      "Le matin, empruntez tranquillement l’allée vers le portail de la plage. Le passage de l’architecture aux pins, puis des pins à l’océan, raconte à lui seul l’esprit du lieu.",
    coordinates: { lat: 45.9782, lng: -1.3012 },
    mapQuery: "La Maison Heureuse, Boyardville",
    images: [
      {
        src: "/images/properties/nid-d-ete/authentique/maison-heureuse-facade.jpeg",
        alt: "Façade jaune et blanche de la Maison Heureuse à Boyardville",
      },
      {
        src: "/images/destination/patrimoine/maison-heureuse-vue-aerienne-groupe-francois-1er.jpg",
        alt: "Vue aérienne de la Maison Heureuse, du chenal de Boyardville et de l’océan",
        credit: "Groupe François 1er",
      },
      {
        src: "/images/properties/nid-d-ete/acces-plage.jpeg",
        alt: "Chemin privé vers la plage depuis la Maison Heureuse",
      },
    ],
    source: {
      label: "Ministère de la Culture — POP, notice PA17000066",
      href: "https://pop.culture.gouv.fr/notice/merimee/PA17000066",
    },
    landmark: true,
  },
  {
    slug: "boyardville",
    island: "Île d’Oléron",
    title: "Boyardville",
    subtitle: "Un village né d’un chantier impossible, entre chenal, forêt et grand large",
    introduction:
      "Boyardville ne s’est pas installé par hasard face à Fort Boyard. Le village s’est développé au rythme du chantier, des transports de matériaux et de la vie maritime, avant de devenir un port de promenade tourné vers le pertuis.",
    history:
      "Au XIXe siècle, l’édification du fort en pleine mer exige une base terrestre capable de recevoir hommes, outils et matériaux. Le village grandit autour de cette activité. Lorsque le chantier s’achève, le port poursuit sa vie grâce à la pêche, aux échanges et, plus tard, aux liaisons et promenades maritimes.",
    architecture:
      "Le chenal de la Perrotine structure le paysage : quais, maisons basses, installations portuaires et lisière forestière composent un village où l’on passe rapidement de l’animation du port au silence des pins.",
    visit:
      "Promenez-vous le long du chenal, observez les départs vers Fort Boyard, puis gagnez la forêt et la plage des Saumonards. Le village se comprend mieux à pied ou à vélo, en reliant ses différents paysages.",
    duration: "Une demi-journée",
    access: "Port accessible à pied et à vélo ; stationnement selon la saison",
    price: "Promenade gratuite ; sorties en mer payantes",
    audiences: ["Famille", "Port", "Vélo", "Histoire maritime"],
    advice:
      "Venez tôt pour le port, puis rejoignez la plage avant le déjeuner. En fin de journée, revenez près du chenal : les bateaux rentrent et le village retrouve une lumière très douce.",
    coordinates: { lat: 45.9755, lng: -1.3046 },
    mapQuery: "Port de Boyardville",
    images: [
      {
        src: "/images/destination/patrimoine/port-boyardville-stephanie.jpg",
        alt: "Port de plaisance et chenal de Boyardville sous un ciel lumineux",
      },
      {
        src: "/images/destination/patrimoine/boyardville-souvenir.webp",
        alt: "Vue souvenir de Boyardville réunissant le port, Fort Boyard et le littoral",
      },
      {
        src: "/images/properties/nid-d-ete/fort-boyard-saumonards.jpg",
        alt: "Fort Boyard vu depuis le littoral de Boyardville",
      },
    ],
    source: {
      label: "Office de tourisme de l’Île d’Oléron — circuit de Boyardville",
      href: "https://www.ile-oleron-marennes.com/sites/default/files/filestodownload/circuit-decouverte-de-boyardville-2025.pdf",
    },
    landmark: false,
  },
  {
    slug: "phare-de-chassiron",
    island: "Île d’Oléron",
    title: "Le Phare de Chassiron",
    subtitle: "La sentinelle rayée de la pointe nord de l’Île d’Oléron",
    introduction:
      "À la pointe de Chassiron, l’île se termine face à un océan puissant. Le phare noir et blanc, ses jardins et le paysage rocheux composent l’un des grands panoramas de l’archipel charentais.",
    history:
      "La pointe est depuis longtemps un repère stratégique pour les navigateurs approchant le pertuis d’Antioche. Le phare actuel succède à une première tour et accompagne l’évolution de la signalisation maritime, des gardiens et des techniques d’éclairage.",
    architecture:
      "La tour cylindrique se reconnaît à ses bandes noires et blanches, ajoutées pour la distinguer de jour. Son escalier conduit vers une vue circulaire sur Oléron, Antioche, Ré et le large. Au pied, le jardin paysager évoque la rose des vents et les usages littoraux.",
    visit:
      "Associez l’ascension, le parcours muséographique, les jardins et une marche sur la côte. Par vent fort, le spectacle est saisissant mais les conditions d’accès peuvent évoluer : vérifiez les informations officielles.",
    duration: "1 h 30 à 2 h",
    access: "Parking et pistes cyclables ; sommet accessible uniquement par escalier",
    price: "Jardins accessibles librement ; visite du phare payante",
    audiences: ["Famille", "Panorama", "Histoire maritime", "Photographie"],
    advice:
      "Après la visite, éloignez-vous de quelques centaines de mètres le long de la côte. C’est en prenant du recul que les bandes du phare et l’immensité du ciel composent la plus belle image.",
    coordinates: { lat: 46.0468, lng: -1.4102 },
    mapQuery: "Phare de Chassiron",
    images: [
      {
        src: "/images/destination/patrimoine/chassiron-vue-aerienne.jpg",
        alt: "Phare de Chassiron, ses jardins et l’océan vus du ciel",
      },
      {
        src: "/images/destination/patrimoine/chassiron-coucher-soleil.jpg",
        alt: "Phare de Chassiron dans la lumière dorée du soleil couchant",
      },
      {
        src: "/images/destination/patrimoine/chassiron-lanterne.jpeg",
        alt: "Lanterne et bandes noires et blanches du phare de Chassiron",
      },
    ],
    source: {
      label: "Office de tourisme de l’Île d’Oléron — Phare de Chassiron",
      href: "https://www.ile-oleron-marennes.com/decouvrir/l-ile-d-oleron/saint-denis-d-oleron/le-phare-de-chassiron",
    },
    landmark: true,
  },
];

export function getHeritageSite(slug: string) {
  return heritageSites.find((site) => site.slug === slug);
}
