import { siteMedia } from "@/media/site";

export type CarnetCategoryId =
  | "restaurants"
  | "producteurs"
  | "marches"
  | "balades"
  | "velo"
  | "plages"
  | "couchers-de-soleil"
  | "fort-boyard"
  | "familles"
  | "gastronomie"
  | "bien-etre"
  | "meteo"
  | "saisons";

export type CarnetCategory = {
  id: CarnetCategoryId;
  eyebrow: string;
  title: string;
  intro: string;
  featured?: boolean;
};

export type CarnetEntry = {
  slug: string;
  categoryId: CarnetCategoryId;
  title: string;
  category: string;
  distance: string;
  time: string;
  description: string;
  hostTip: string;
  image: string;
  imageAlt: string;
  href: string;
  external?: boolean;
  island: "Île de Ré" | "Île d’Oléron" | "Les deux îles";
  season: "Toute l’année" | "Printemps" | "Été" | "Automne" | "Hiver";
};

export type CarnetSectionData = CarnetCategory & { entries: CarnetEntry[] };

const images = {
  sea: siteMedia.destination.sea,
  food: siteMedia.destination.food,
  marsh: siteMedia.destination.marsh,
  beach: siteMedia.destination.beach,
  bridge: siteMedia.destination.bridge,
  lane: siteMedia.destination.lane,
  salt: siteMedia.destination.salt,
  village: siteMedia.destination.village,
  boyard: siteMedia.properties["nid-d-ete"].lifestyle[1].src,
  cycling: siteMedia.properties["chai-des-tortues"].lifestyle[0].src,
  breakfast: siteMedia.properties["chai-des-tortues"].lifestyle[4].src,
  flowerDunes: siteMedia.destination.flowerDunes,
  beachFishing: siteMedia.destination.beachFishing,
  familySunset: siteMedia.destination.familySunset,
  morningSurf: siteMedia.destination.morningSurf,
  familyForeshore: siteMedia.destination.familyForeshore,
};

export const carnetCategories: CarnetCategory[] = [
  { id: "restaurants", eyebrow: "À table", title: "Restaurants", intro: "Des tables choisies selon l’envie, le jour d’ouverture et la lumière." },
  { id: "producteurs", eyebrow: "Celles et ceux qui font les îles", title: "Producteurs", intro: "Huîtres, sel et gestes patients : rencontrer le territoire par celles et ceux qui le cultivent." },
  { id: "marches", eyebrow: "Le début du repas", title: "Marchés", intro: "Choisir les produits, parler aux producteurs et imaginer le déjeuner avant de rentrer." },
  { id: "balades", eyebrow: "Prendre le temps", title: "Balades", intro: "Des chemins sans performance, pour suivre la côte, les villages et les marais." },
  { id: "velo", eyebrow: "Changer de rythme", title: "Vélo", intro: "Les îles se révèlent lorsqu’on les traverse lentement, panier au guidon." },
  { id: "plages", eyebrow: "Face à l’Atlantique", title: "Plages", intro: "Sauvages, familiales ou abritées : la bonne plage dépend du vent et du moment.", featured: true },
  { id: "couchers-de-soleil", eyebrow: "L’heure dorée", title: "Couchers de soleil", intro: "Nos endroits préférés pour regarder la lumière descendre et rester encore un peu." },
  { id: "fort-boyard", eyebrow: "À l’horizon", title: "Fort Boyard", intro: "Une silhouette qui accompagne Oléron et se découvre depuis le sable ou la mer." },
  { id: "familles", eyebrow: "Grandir ensemble", title: "Familles", intro: "Des expériences simples, testées ou choisies pour laisser de la place à la curiosité." },
  { id: "gastronomie", eyebrow: "Le goût du littoral", title: "Gastronomie", intro: "Huîtres, pâtisseries, glaces et produits du marché : nos plaisirs vraiment vécus." },
  { id: "bien-etre", eyebrow: "Prendre soin de soi", title: "Bien-être", intro: "Bouger, respirer et relâcher : des adresses choisies pour revenir du séjour vraiment reposé." },
  { id: "meteo", eyebrow: "Quel que soit le ciel", title: "Selon la météo", intro: "Vent, pluie ou grand soleil : chaque météo ouvre une autre façon de vivre les îles." },
  { id: "saisons", eyebrow: "Revenir autrement", title: "Selon la saison", intro: "Les mêmes paysages ne racontent jamais la même histoire au fil de l’année." },
];

export const carnetArticles: CarnetEntry[] = [
  { slug: "table-selon-la-lumiere", categoryId: "restaurants", title: "La table juste pour votre soirée", category: "Sélection personnelle", distance: "Ré & Oléron", time: "Conseil avant séjour", description: "Cabane ostréicole, dîner face au port ou cuisine de marché : nous adaptons l’adresse à votre maison et à votre programme.", hostTip: "Écrivez-nous avant l’arrivée : une bonne recommandation dépend aussi du jour d’ouverture.", image: images.food, imageAlt: "Produits de la mer et table insulaire", href: "/reserver", island: "Les deux îles", season: "Toute l’année" },
  { slug: "huitres-et-ma-re", categoryId: "producteurs", title: "Huîtres et Ma Ré", category: "Ostréiculteur", distance: "Rivedoux-Plage", time: "À quelques minutes", description: "Des huîtres locales et des plateaux de fruits de mer à rapporter à la maison.", hostTip: "C’est ici que nous achetons les huîtres pour nos propres repas.", image: images.food, imageAlt: "Huîtres et fruits de mer de l’Atlantique", href: "https://www.huitresetmare.fr/", external: true, island: "Île de Ré", season: "Toute l’année" },
  { slug: "sauniers", categoryId: "producteurs", title: "Rencontrer les sauniers", category: "Savoir-faire", distance: "Marais salants", time: "Une demi-journée", description: "Comprendre le geste, le vent et l’eau derrière les paysages géométriques des marais.", hostTip: "Privilégiez la fin de journée, quand la lumière révèle les bassins.", image: images.salt, imageAlt: "Saunier dans les marais salants", href: "/destinations/ile-de-re#guide", island: "Île de Ré", season: "Été" },
  { slug: "marche-rivedoux", categoryId: "marches", title: "Le marché de Rivedoux-Plage", category: "Marché", distance: "À pied depuis nos maisons de Ré", time: "Le matin", description: "Des étals de saison et une atmosphère de village qui donnent le ton de la journée.", hostTip: "Nous aimons y aller tôt, lorsque les étals sont encore généreux.", image: images.breakfast, imageAlt: "Panier gourmand pour le retour du marché", href: "https://www.iledere.com/sinformer/shopping-commerces-services/marche-de-rivedoux-plage-rivedoux-plage-fr-1261072/", external: true, island: "Île de Ré", season: "Toute l’année" },
  { slug: "marais-au-ralenti", categoryId: "balades", title: "Marcher au bord des marais", category: "Balade douce", distance: "Île de Ré", time: "1 h 30", description: "Une promenade au rythme des oiseaux, des reflets et des chemins blancs.", hostTip: "Partez sans écouteurs : le silence et les oiseaux font partie de la balade.", image: images.marsh, imageAlt: "Marais au coucher du soleil", href: "/destinations/ile-de-re", island: "Île de Ré", season: "Printemps" },
  { slug: "villages-marais", categoryId: "velo", title: "Villages, marais et océan", category: "Itinéraire vélo", distance: "Depuis Rivedoux", time: "Une demi-journée", description: "Un itinéraire à composer selon le vent, les envies et les haltes gourmandes.", hostTip: "Gardez toujours une place dans le panier pour le retour du marché.", image: images.cycling, imageAlt: "Vélo dans un village de l’Île de Ré", href: "/experiences#balade-velo", island: "Île de Ré", season: "Printemps" },
  { slug: "saumonards", categoryId: "plages", title: "La plage des Saumonards", category: "Plage sauvage", distance: "20 m du Nid d’Été", time: "Quelques pas", description: "Une plage face à Fort Boyard, accessible par le portail privé de la résidence.", hostTip: "Revenez en fin de journée : la plage change entièrement d’atmosphère.", image: images.boyard, imageAlt: "Fort Boyard vu depuis la plage des Saumonards", href: "/maisons/nid-d-ete", island: "Île d’Oléron", season: "Été" },
  { slug: "plage-rivedoux", categoryId: "plages", title: "Rivedoux au premier matin", category: "Plage de village", distance: "À pied depuis les maisons", time: "Avant 9 h", description: "Le rivage encore calme, lorsque les vélos commencent à circuler et que le village s’éveille.", hostTip: "Prenez le premier café à la maison, puis partez marcher avant le marché.", image: images.beach, imageAlt: "Plage bordée de ganivelles", href: "/destinations/ile-de-re", island: "Île de Ré", season: "Toute l’année" },
  { slug: "lumiere-marais", categoryId: "couchers-de-soleil", title: "La lumière sur les marais", category: "Notre rituel", distance: "Île de Ré", time: "Fin de journée", description: "Un moment sans autre programme que celui de regarder les couleurs se refléter dans l’eau.", hostTip: "Arrivez vingt minutes avant le coucher du soleil et restez après.", image: images.marsh, imageAlt: "Coucher de soleil sur les marais", href: "/experiences#coucher-de-soleil", island: "Île de Ré", season: "Toute l’année" },
  { slug: "fort-depuis-sable", categoryId: "fort-boyard", title: "Fort Boyard depuis le sable", category: "Point de vue", distance: "Face aux Saumonards", time: "À marée changeante", description: "Le fort se découvre sans programme, simplement depuis la plage et au fil de la lumière.", hostTip: "Le soir offre souvent la silhouette la plus douce.", image: images.boyard, imageAlt: "Fort Boyard à l’horizon", href: "/maisons/nid-d-ete", island: "Île d’Oléron", season: "Toute l’année" },
  { slug: "premiere-vague", categoryId: "familles", title: "L’estran comme terrain de jeu", category: "Notre idée en famille", distance: "Ré & Oléron", time: "Autour de la marée basse", description: "Un ballon, quelques pas dans le sable et presque rien à organiser : les souvenirs naissent souvent des après-midi les plus simples.", hostTip: "Regardez l’horaire des marées avant de partir et gardez une tenue sèche dans le panier.", image: images.familyForeshore, imageAlt: "Famille jouant sur la plage à marée basse", href: "/experiences#famille", island: "Les deux îles", season: "Été" },
  { slug: "pecher-face-au-large", categoryId: "familles", title: "Pêcher face au large", category: "Moment à transmettre", distance: "Côte atlantique", time: "Deux heures", description: "Installer la canne, lire la mer et apprendre à patienter : une parenthèse qui rassemble les générations.", hostTip: "Demandez toujours conseil localement sur le lieu, la marée et la réglementation du moment.", image: images.beachFishing, imageAlt: "Canne à pêche face aux vagues de l’Atlantique", href: "/experiences#peche-a-pied", island: "Les deux îles", season: "Automne" },
  { slug: "atelier-macarons", categoryId: "familles", title: "Apprendre les macarons ensemble", category: "Testé en famille", distance: "Selon programmation", time: "Une demi-journée", description: "Mettre la main à la pâte, apprendre ensemble et repartir avec ses créations.", hostTip: "Nous avons vécu cet atelier avec les enfants : chacun y trouve sa place.", image: images.lane, imageAlt: "Ruelle insulaire près d’un atelier gourmand", href: "/experiences#atelier-macarons", island: "Île de Ré", season: "Toute l’année" },
  { slug: "surf-au-reveil", categoryId: "saisons", title: "L’Atlantique au réveil", category: "Matin d’océan", distance: "Côte ouest", time: "Selon les conditions", description: "Quand la houle et la lumière se rencontrent, regarder les premières vagues suffit déjà à donner un autre rythme à la journée.", hostTip: "Pour entrer dans l’eau, choisissez une école locale et vérifiez toujours les conditions.", image: images.morningSurf, imageAlt: "Surfeur sur une vague dans la lumière du matin", href: "/destinations/ile-d-oleron", island: "Île d’Oléron", season: "Automne" },
  { slug: "la-martiniere", categoryId: "gastronomie", title: "La Martinière", category: "Maison glacée familiale", distance: "Plusieurs boutiques sur Ré", time: "Après la plage", description: "Plus de soixante parfums, des macarons et pâtisseries glacés, des verrines et des créations qui accompagnent les étés rétais depuis des générations.", hostTip: "Bruno choisit le macaron glacé réglisse ; Stéphanie, le fraisier glacé. En saison, nous conseillons la commande en ligne et le retrait le lendemain matin.", image: images.village, imageAlt: "Village fleuri de l’Île de Ré, sur le chemin de La Martinière", href: "https://la-martiniere.fr", external: true, island: "Île de Ré", season: "Été" },
  { slug: "chez-nina-metayer", categoryId: "gastronomie", title: "Chez Nina · Nina Métayer", category: "Haute pâtisserie", distance: "Rivedoux-Plage", time: "À pied ou à quelques minutes", description: "Pâtissière Mondiale 2023 puis World’s Best Pastry Chef 2024, Nina Métayer a installé au cœur de Rivedoux une adresse où retrouver créations de saison, viennoiseries et gâteaux à partager.", hostTip: "Notre conseil : la chocolatine praliné. Pour les créations les plus demandées, précommandez en ligne et choisissez Chez Nina comme point de retrait.", image: images.food, imageAlt: "Dessert gourmand à partager dans une maison de l’Île de Ré", href: "https://larochelle.delicatisserie.com/", external: true, island: "Île de Ré", season: "Toute l’année" },
  { slug: "amore-di-nonna", categoryId: "gastronomie", title: "Amore di Nonna", category: "Épicerie fine & traiteur italien", distance: "Lagord, avant le pont de Ré", time: "Sur la route de l’île", description: "Deux sœurs, Charlotte et Marine, font vivre les recettes de leur grand-mère à travers des pâtes fraîches préparées chaque matin, des plats maison et une sélection de produits livrés directement d’Italie.", hostTip: "Nos favoris : le saucisson à la truffe, les gnocchis maison, les pâtes fraîches, le dôme de chèvre à la truffe et la focaccia.", image: images.food, imageAlt: "Table généreuse à partager au retour de La Rochelle", href: "https://amoredinonna.com/", external: true, island: "Île de Ré", season: "Toute l’année" },
  { slug: "la-tartentiere", categoryId: "gastronomie", title: "La Tartentière", category: "Atelier de tartes", distance: "La Flotte", time: "À commander la veille", description: "Des tartes salées et sucrées préparées avec une pâte à la farine bio, des légumes frais et des produits régionaux dont les saveurs changent avec la saison.", hostTip: "Nous la choisissons pour un déjeuner sans cérémonie à la maison. Appelez au moins un jour avant : les tartes préférées partent vite.", image: images.food, imageAlt: "Déjeuner gourmand à partager au retour de La Flotte", href: "https://www.latartentiere.com", external: true, island: "Île de Ré", season: "Toute l’année" },
  { slug: "reeduk-coach", categoryId: "bien-etre", title: "Özlem et Ré Eduk Coach", category: "Santé · Sport · Bien-être", distance: "Rivedoux-Plage", time: "Sur réservation", description: "Face à la mer, cinq kinés-coachs proposent soins, Pilates, gym douce ou dos, yoga de Gasquet, marche aquatique et massages dans une atmosphère attentive.", hostTip: "Ce sont nos kinés. Pour les cours semi-collectifs de quatre à six personnes, consultez le planning et réservez avant votre arrivée.", image: images.familySunset, imageAlt: "Fin de journée face à la mer à Rivedoux-Plage", href: "https://www.reedukcoach.fr", external: true, island: "Île de Ré", season: "Toute l’année" },
  { slug: "jour-de-pluie", categoryId: "meteo", title: "Marché, atelier et grande cuisine", category: "Quand il pleut", distance: "Depuis la maison", time: "À votre rythme", description: "Choisir de bons produits, découvrir un savoir-faire puis cuisiner ensemble sans attendre le soleil.", hostTip: "La pluie est souvent l’occasion de mieux profiter de la maison.", image: siteMedia.properties["villa-raie-manta"].kitchen[0].src, imageAlt: "Cuisine de Villa Raie Manta", href: "/experiences#atelier-macarons", island: "Les deux îles", season: "Toute l’année" },
  { slug: "ile-hors-saison", categoryId: "saisons", title: "Les îles quand elles ralentissent", category: "Automne & hiver", distance: "Ré & Oléron", time: "Un week-end", description: "Des plages presque seules, des marchés plus intimes et le plaisir de retrouver une maison chaleureuse.", hostTip: "Hors saison, prévoyez peu et laissez la météo décider du rythme.", image: images.sea, imageAlt: "Océan calme hors saison", href: "/pourquoi-revenir", island: "Les deux îles", season: "Hiver" },
];

export const carnetSections: Record<CarnetCategoryId, CarnetSectionData> = Object.fromEntries(
  carnetCategories.map((category) => [
    category.id,
    { ...category, entries: carnetArticles.filter((entry) => entry.categoryId === category.id) },
  ]),
) as Record<CarnetCategoryId, CarnetSectionData>;

export const carnetNavigation = carnetCategories.map(({ id, title }) => ({ id, title }));

export const carnetMapPoints = [
  { name: "Tables choisies selon le jour et la lumière", type: "Restaurants", x: 28, y: 28 },
  { name: "Marché de Rivedoux et marchés insulaires", type: "Marchés", x: 35, y: 70 },
  { name: "Saumonards, Rivedoux et plages atlantiques", type: "Plages", x: 77, y: 22 },
  { name: "Huîtres, sel et savoir-faire locaux", type: "Producteurs", x: 68, y: 68 },
  { name: "Fort Boyard depuis le sable et la mer", type: "Fort Boyard", x: 84, y: 52 },
  { name: "Marais, villages et chemins côtiers", type: "Balades", x: 18, y: 50 },
  { name: "Itinéraires depuis Rivedoux et Boyardville", type: "Vélo", x: 52, y: 38 },
];
