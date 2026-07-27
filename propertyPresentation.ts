import { propertyMedia } from "@/media/properties";

export type PropertyPresentation = {
  storyEyebrow: string;
  storyTitle: string;
  storyImage: string;
  timeline: { time: string; title: string; copy: string }[];
  dayStory: {
    phase: "La maison se réveille" | "Le matin" | "L’après-midi" | "Le coucher du soleil" | "La soirée";
    title: string;
    copy: string;
    image: string;
    quote: string;
    align?: "left" | "right";
  }[];
  map: {
    centerLabel: string;
    places: { name: string; type: string; distance: string; x: number; y: number }[];
  };
  experiences?: {
    title: string;
    copy: string;
    image: string;
    alt: string;
  }[];
  experiencesHeading?: {
    eyebrow: string;
    title: string;
    description: string;
  };
};

export const propertyPresentations: Record<string, PropertyPresentation> = {
  "chai-des-tortues": {
    storyEyebrow: "Pierres d’origine · Ancien chai",
    storyTitle: "Les pierres d’un ancien chai, la chaleur d’une maison de famille.",
    storyImage: propertyMedia["chai-des-tortues"].hero.src,
    timeline: [
      { time: "08:30", title: "Le marché à pied", copy: "Choisir les produits du jour aux Halles de Rivedoux." },
      { time: "11:00", title: "L’île à vélo", copy: "Suivre les pistes entre villages, plages et marais." },
      { time: "17:30", title: "Retour par l’océan", copy: "Poser les vélos et rejoindre la plage à quelques pas." },
      { time: "20:00", title: "La grande table", copy: "Ouvrir les huîtres et prolonger le dîner en famille." },
    ],
    dayStory: [
      { phase: "La maison se réveille", title: "La lumière retrouve les pierres.", copy: "Dans l’ancien chai, le jour révèle les matières préservées et le calme d’une maison encore silencieuse.", image: propertyMedia["chai-des-tortues"].hero.src, quote: "Les premiers instants appartiennent encore à la maison.", align: "left" },
      { phase: "Le matin", title: "Le marché donne le ton.", copy: "On rejoint les Halles à pied, un panier à la main, en imaginant déjà ce qui sera posé sur la grande table.", image: propertyMedia["chai-des-tortues"].lifestyle[4].src, quote: "À Rivedoux, le déjeuner commence sur les étals.", align: "right" },
      { phase: "L’après-midi", title: "L’île se découvre à vélo.", copy: "Les pistes ouvrent la route vers les villages, les marais et l’océan. La maison attend le retour, à quelques pas de la plage.", image: propertyMedia["chai-des-tortues"].lifestyle[0].src, quote: "Rouler doucement, s’arrêter souvent.", align: "left" },
      { phase: "Le coucher du soleil", title: "Le rivage change de lumière.", copy: "On revient par la plage, lorsque l’air devient plus doux et que la journée semble vouloir durer encore.", image: propertyMedia["chai-des-tortues"].lifestyle[3].src, quote: "L’heure où l’île ralentit.", align: "right" },
      { phase: "La soirée", title: "La cuisine devient le cœur de la maison.", copy: "Les huîtres s’ouvrent, les assiettes circulent et le dîner se prolonge autour d’une table pensée pour les retrouvailles.", image: propertyMedia["chai-des-tortues"].lifestyle[2].src, quote: "Les souvenirs se composent souvent autour d’un repas.", align: "left" },
    ],
    map: {
      centerLabel: "Le Chai",
      places: [
        { name: "Plage de Rivedoux", type: "Océan", distance: "250 m", x: 76, y: 25 },
        { name: "Halles de Rivedoux", type: "Marché", distance: "À pied", x: 28, y: 28 },
        { name: "Pistes cyclables", type: "Vélo", distance: "À proximité", x: 20, y: 72 },
        { name: "Port de Rivedoux", type: "Village", distance: "8 min", x: 74, y: 75 },
      ],
    },
    experiences: [
      { title: "Petit-déjeuner", copy: "Commencer la journée avec des viennoiseries encore tièdes, avant que le village ne s’anime.", image: propertyMedia["chai-des-tortues"].editorial.breakfast.src, alt: propertyMedia["chai-des-tortues"].editorial.breakfast.alt },
      { title: "Apéritif", copy: "Retrouver l’air marin et laisser le premier verre ouvrir doucement la soirée.", image: propertyMedia["chai-des-tortues"].editorial.aperitif.src, alt: propertyMedia["chai-des-tortues"].editorial.aperitif.alt },
      { title: "Retour du marché", copy: "Revenir des Halles à pied, le panier rempli de produits choisis pour la grande table.", image: propertyMedia["chai-des-tortues"].editorial.market.src, alt: propertyMedia["chai-des-tortues"].editorial.market.alt },
      { title: "Fruits de mer", copy: "Ouvrir les huîtres et préparer un plateau avec les ustensiles déjà disponibles dans la cuisine.", image: propertyMedia["chai-des-tortues"].editorial.seafood.src, alt: propertyMedia["chai-des-tortues"].editorial.seafood.alt },
      { title: "Vacances en famille", copy: "Partager une maison équipée pour les enfants, les repas et les journées sans programme.", image: propertyMedia["chai-des-tortues"].editorial.family.src, alt: propertyMedia["chai-des-tortues"].editorial.family.alt },
      { title: "Animaux", copy: "Voyager avec son compagnon, accueilli dans la maison selon les conditions Beaux Rivages.", image: propertyMedia["chai-des-tortues"].editorial.pets.src, alt: propertyMedia["chai-des-tortues"].editorial.pets.alt },
      { title: "Plage", copy: "Marcher 250 mètres et retrouver le rivage, sans reprendre la voiture.", image: propertyMedia["chai-des-tortues"].editorial.beach.src, alt: propertyMedia["chai-des-tortues"].editorial.beach.alt },
      { title: "Vélo", copy: "Partir depuis Rivedoux et suivre les pistes entre villages, marais et océan.", image: propertyMedia["chai-des-tortues"].editorial.cycling.src, alt: propertyMedia["chai-des-tortues"].editorial.cycling.alt },
      { title: "Cuisine", copy: "Transformer les produits du marché en un repas qui rassemble toute la maison.", image: propertyMedia["chai-des-tortues"].editorial.kitchen.src, alt: propertyMedia["chai-des-tortues"].editorial.kitchen.alt },
    ],
  },
  "villa-raie-manta": {
    storyEyebrow: "Vue mer · Salon à l’étage",
    storyTitle: "La lumière pour matière, l’océan comme horizon.",
    storyImage: propertyMedia["villa-raie-manta"].livingRoom[1].src,
    timeline: [
      { time: "08:00", title: "Le premier café face à la mer", copy: "Regarder la lumière entrer dans le salon à l’étage." },
      { time: "11:30", title: "Rivedoux côté océan", copy: "Rejoindre le littoral et les Halles sans presser le pas." },
      { time: "17:00", title: "La terrasse", copy: "Retrouver la maison pour un moment dehors en famille." },
      { time: "21:00", title: "Le pont dans la lumière", copy: "Voir l’horizon changer depuis le salon panoramique." },
    ],
    dayStory: [
      { phase: "La maison se réveille", title: "L’océan entre avec le jour.", copy: "Au salon, la lumière glisse sur les lignes contemporaines et révèle le pont de l’Île de Ré dans le lointain.", image: propertyMedia["villa-raie-manta"].livingRoom[1].src, quote: "Ici, l’horizon fait partie de l’architecture.", align: "left" },
      { phase: "Le matin", title: "Le premier café prend de la hauteur.", copy: "Installé à l’étage, le salon offre un réveil face à la mer, dans une lumière qui transforme chaque matin.", image: propertyMedia["villa-raie-manta"].hero.src, quote: "Prendre le temps de regarder la lumière changer.", align: "right" },
      { phase: "L’après-midi", title: "La maison s’ouvre et se partage.", copy: "La terrasse prolonge les espaces de vie. On y revient après l’océan pour déjeuner, lire ou simplement rester dehors.", image: propertyMedia["villa-raie-manta"].terrace[0].src, quote: "Dedans, dehors : la même sensation d’espace.", align: "left" },
      { phase: "Le coucher du soleil", title: "Le pont devient une ligne de lumière.", copy: "Depuis le salon panoramique, le ciel et la mer changent de couleur tandis que l’île retrouve son calme.", image: propertyMedia["villa-raie-manta"].exterior[0].src, quote: "Le spectacle est déjà là.", align: "right" },
      { phase: "La soirée", title: "Une grande table pour se retrouver.", copy: "La cuisine et la salle à manger réunissent la maison autour d’un dîner simple, prolongé par les derniers reflets sur l’océan.", image: propertyMedia["villa-raie-manta"].details[0].src, quote: "Partager la maison comme on partage la soirée.", align: "left" },
    ],
    map: {
      centerLabel: "Villa Raie Manta",
      places: [
        { name: "Océan", type: "Vue mer", distance: "Quelques pas", x: 78, y: 24 },
        { name: "Pont de l’Île de Ré", type: "Horizon", distance: "Vue directe", x: 20, y: 25 },
        { name: "Halles de Rivedoux", type: "Marché", distance: "350 m", x: 25, y: 74 },
        { name: "Plage sud", type: "Plage", distance: "À pied", x: 75, y: 74 },
      ],
    },
    experiencesHeading: {
      eyebrow: "Vivre face à l’océan",
      title: "Une maison guidée par la lumière.",
      description: "De la première lueur sur le pont aux dîners sur la terrasse, chaque espace accompagne un moment différent de la journée.",
    },
    experiences: [
      { title: "Petit-déjeuner face à la mer", copy: "Monter au salon encore silencieux et regarder le pont apparaître dans la lumière du matin.", image: propertyMedia["villa-raie-manta"].hero.src, alt: propertyMedia["villa-raie-manta"].hero.alt },
      { title: "Cuisine ouverte", copy: "Préparer ensemble les produits rapportés des Halles dans une cuisine reliée à la grande table.", image: propertyMedia["villa-raie-manta"].kitchen[0].src, alt: propertyMedia["villa-raie-manta"].kitchen[0].alt },
      { title: "Déjeuner en terrasse", copy: "Ouvrir la maison sur l’extérieur et laisser le déjeuner suivre le rythme doux des vacances.", image: propertyMedia["villa-raie-manta"].terrace[0].src, alt: propertyMedia["villa-raie-manta"].terrace[0].alt },
      { title: "Une maison pour se retrouver", copy: "Réunir famille et amis dans quatre chambres, puis se retrouver dans les grands espaces communs.", image: propertyMedia["villa-raie-manta"].details[0].src, alt: propertyMedia["villa-raie-manta"].details[0].alt },
      { title: "L’océan à pied", copy: "Quitter la maison sans voiture et rejoindre le rivage pour une promenade ou une baignade improvisée.", image: propertyMedia["villa-raie-manta"].exterior[0].src, alt: propertyMedia["villa-raie-manta"].exterior[0].alt },
      { title: "Le pont à l’heure bleue", copy: "Retrouver le salon panoramique lorsque le pont s’allume et que l’horizon devient le décor de la soirée.", image: propertyMedia["villa-raie-manta"].livingRoom[1].src, alt: propertyMedia["villa-raie-manta"].livingRoom[1].alt },
    ],
  },
  "nid-d-ete": {
    storyEyebrow: "Monument Historique · Maison Heureuse",
    storyTitle: "Un refuge dans une résidence historique, entre peupliers et océan.",
    storyImage: propertyMedia["nid-d-ete"].lifestyle[3].src,
    timeline: [
      { time: "08:30", title: "Sous les grands peupliers", copy: "Commencer doucement la journée dans le calme de la résidence." },
      { time: "10:00", title: "Le portail privé", copy: "Traverser quelques mètres et rejoindre la plage des Saumonards." },
      { time: "15:00", title: "La forêt et le sable", copy: "Alterner baignade, promenade et jeux en famille." },
      { time: "20:30", title: "Fort Boyard à l’horizon", copy: "Regarder la lumière du soir depuis la plage." },
    ],
    dayStory: [
      { phase: "La maison se réveille", title: "Le vent passe dans les peupliers.", copy: "Dans la résidence historique de la Maison Heureuse, le matin commence dans l’ombre douce des grands arbres.", image: propertyMedia["nid-d-ete"].lifestyle[3].src, quote: "Le calme avant les premiers pas vers la plage.", align: "left" },
      { phase: "Le matin", title: "Le portail s’ouvre sur le sable.", copy: "Quelques mètres suffisent pour quitter la maison et rejoindre la plage des Saumonards, sans route et sans voiture.", image: propertyMedia["nid-d-ete"].hero.src, quote: "La plage devient le prolongement naturel de la maison.", align: "right" },
      { phase: "L’après-midi", title: "La journée appartient à l’océan.", copy: "Jeux sur le sable, promenade en forêt et baignade composent un rythme simple, pensé pour les familles.", image: propertyMedia["nid-d-ete"].lifestyle[4].src, quote: "Rien à organiser, seulement profiter.", align: "left" },
      { phase: "Le coucher du soleil", title: "Fort Boyard reste à l’horizon.", copy: "La lumière descend sur la plage et dessine au loin la silhouette familière du fort.", image: propertyMedia["nid-d-ete"].lifestyle[5].src, quote: "Chaque soir offre une autre couleur.", align: "right" },
      { phase: "La soirée", title: "Le silence revient sous les arbres.", copy: "Dans le jardin clos, la résidence retrouve son calme. La maison devient un refuge après une journée dehors.", image: propertyMedia["nid-d-ete"].lifestyle[3].src, quote: "Le luxe discret d’une soirée paisible.", align: "left" },
    ],
    map: {
      centerLabel: "Le Nid d’Été",
      places: [
        { name: "Plage des Saumonards", type: "Accès privé", distance: "20 m", x: 77, y: 25 },
        { name: "Fort Boyard", type: "Horizon", distance: "Face à la plage", x: 25, y: 22 },
        { name: "Forêt des Saumonards", type: "Nature", distance: "À proximité", x: 22, y: 74 },
        { name: "Boyardville", type: "Village", distance: "Quelques minutes", x: 75, y: 76 },
      ],
    },
    experiencesHeading: {
      eyebrow: "Vivre entre forêt et océan",
      title: "La liberté d’une maison au bord du sable.",
      description: "Le Nid d’Été simplifie les vacances : sortir à pied, suivre les sentiers et revenir lorsque la lumière descend sur Fort Boyard.",
    },
    experiences: [
      { title: "Le premier passage vers la plage", copy: "Ouvrir le portail privé et rejoindre les Saumonards avant que la journée ne commence vraiment.", image: propertyMedia["nid-d-ete"].hero.src, alt: propertyMedia["nid-d-ete"].hero.alt },
      { title: "Jeux sur le sable", copy: "Emporter le matériel prévu pour les enfants et laisser la plage devenir leur terrain d’aventure.", image: propertyMedia["nid-d-ete"].lifestyle[4].src, alt: propertyMedia["nid-d-ete"].lifestyle[4].alt },
      { title: "Déjeuner à l’ombre", copy: "Retrouver la fraîcheur des arbres et le calme du jardin après une matinée face à l’océan.", image: propertyMedia["nid-d-ete"].lifestyle[3].src, alt: propertyMedia["nid-d-ete"].lifestyle[3].alt },
      { title: "La forêt à vélo", copy: "Suivre les pistes de la forêt des Saumonards vers Boyardville, entre pins et air salin.", image: propertyMedia["nid-d-ete"].lifestyle[6].src, alt: propertyMedia["nid-d-ete"].lifestyle[6].alt },
      { title: "Fort Boyard à l’horizon", copy: "Revenir sur la plage lorsque le fort se découpe dans la lumière plus douce de la fin du jour.", image: propertyMedia["nid-d-ete"].lifestyle[1].src, alt: propertyMedia["nid-d-ete"].lifestyle[1].alt },
      { title: "Une soirée sous les peupliers", copy: "Refermer le portail, retrouver le jardin clos et écouter le silence revenir dans la résidence.", image: propertyMedia["nid-d-ete"].lifestyle[7].src, alt: propertyMedia["nid-d-ete"].lifestyle[7].alt },
    ],
  },
};

export function getPropertyPresentation(slug: string) {
  const presentation = propertyPresentations[slug];
  if (!presentation) throw new Error(`Unknown property presentation: ${slug}`);
  return presentation;
}
