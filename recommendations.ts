export type RecommendationCategory =
  | "Producteurs"
  | "Gourmandises"
  | "Marchés"
  | "Bien-être"
  | "Services";

export type HostRecommendation = {
  slug: string;
  name: string;
  category: RecommendationCategory;
  location: string;
  island: "Île de Ré" | "Île d’Oléron";
  title: string;
  description: string;
  hostNote: string;
  favorites?: string[];
  practicalTip?: string;
  website: string;
  featured?: boolean;
  photoPermission?: boolean;
};

export const hostRecommendations: HostRecommendation[] = [
  {
    slug: "chez-nina-metayer",
    name: "Chez Nina · Nina Métayer",
    category: "Gourmandises",
    location: "Rivedoux-Plage",
    island: "Île de Ré",
    title: "La pâtisserie mondiale au cœur du village",
    description:
      "Distinguée Pâtissière Mondiale 2023 puis World’s Best Pastry Chef 2024, Nina Métayer signe à Rivedoux des créations de saison, des viennoiseries et des gâteaux à partager.",
    hostNote:
      "Notre conseil : la chocolatine praliné. Une gourmandise que nous aimons aller chercher à quelques minutes de nos maisons.",
    favorites: ["Chocolatine praliné", "Créations de saison", "Gâteaux à partager"],
    practicalTip:
      "Les créations les plus demandées peuvent être précommandées en ligne avec un retrait Chez Nina, au 190 rue Jules-Ferry à Rivedoux-Plage.",
    website: "https://larochelle.delicatisserie.com/",
    featured: true,
  },
  {
    slug: "amore-di-nonna",
    name: "Amore di Nonna",
    category: "Gourmandises",
    location: "Lagord · Agglomération de La Rochelle",
    island: "Île de Ré",
    title: "L’Italie faite maison sur la route de l’île",
    description:
      "Charlotte et Marine préparent chaque jour pâtes fraîches, lasagnes, tiramisu et spécialités italiennes, complétés par une épicerie fine approvisionnée directement auprès de producteurs italiens.",
    hostNote:
      "Nos favoris : le saucisson à la truffe, les gnocchis maison, les pâtes fraîches, le dôme de chèvre à la truffe et la focaccia.",
    favorites: ["Saucisson à la truffe", "Gnocchis maison", "Pâtes fraîches", "Dôme de chèvre à la truffe", "Focaccia"],
    practicalTip:
      "La boutique se trouve au Parc Commercial du Fief Rose à Lagord. Elle propose aussi le déjeuner sur place et des plateaux sur commande.",
    website: "https://amoredinonna.com/",
    featured: true,
  },
  {
    slug: "huitres-et-ma-re",
    name: "Huîtres et Ma Ré",
    category: "Producteurs",
    location: "Rivedoux-Plage",
    island: "Île de Ré",
    title: "Notre ostréiculteur de confiance",
    description:
      "Une adresse locale authentique pour découvrir les huîtres de Rivedoux-Plage et composer un plateau de fruits de mer à savourer à la maison.",
    hostNote:
      "C’est ici que nous achetons toutes nos huîtres, pour nos repas en famille comme pour les grandes occasions.",
    practicalTip:
      "Prévoyez votre passage avant un déjeuner ou un dîner à la maison : les cuisines Beaux Rivages disposent de tout le nécessaire pour ouvrir et déguster les coquillages.",
    website: "https://www.huitresetmare.fr/",
    featured: true,
  },
  {
    slug: "cremerie-marianne",
    name: "Crèmerie Marianne",
    category: "Gourmandises",
    location: "La Flotte",
    island: "Île de Ré",
    title: "Notre fromager favori",
    description:
      "Une adresse idéale pour composer un plateau de fromages à partager à l’apéritif ou au retour du marché.",
    hostNote:
      "Nous vous conseillons tout particulièrement la Tomme aux Fleurs et le Kelbasch, deux de nos favoris.",
    favorites: ["Tomme aux Fleurs", "Kelbasch"],
    website:
      "https://www.guide-charente-maritime.com/fr/adresses-utiles/alimentation/fromageries/la-flotte-187/cremerie-marianne-11801.html",
    featured: true,
  },
  {
    slug: "la-martiniere",
    name: "La Martinière",
    category: "Gourmandises",
    location: "Plusieurs boutiques sur l’Île de Ré",
    island: "Île de Ré",
    title: "Une institution glacée de l’île",
    description:
      "Maison familiale de l’Île de Ré, La Martinière imagine plus de soixante parfums, des macarons et pâtisseries glacés, des verrines et des créations à emporter.",
    hostNote:
      "Bruno adore le macaron glacé à la réglisse. Stéphanie choisit le fraisier glacé.",
    favorites: ["Macaron glacé réglisse", "Fraisier glacé", "Macarons glacés"],
    practicalTip:
      "En haute saison, commandez avant 18 h sur le site pour un retrait dès le lendemain matin. Le Glacier de Saint-Martin ne prend pas les retraits internet : choisissez plutôt l’Atelier, La Flotte, Le Bois-Plage, le Phare des Baleines, la Manufacture ou Les Portes.",
    website: "https://la-martiniere.fr",
    featured: true,
    photoPermission: true,
  },
  {
    slug: "la-tartentiere",
    name: "La Tartentière",
    category: "Gourmandises",
    location: "La Flotte",
    island: "Île de Ré",
    title: "Le déjeuner que l’on rapporte à la maison",
    description:
      "Depuis 2011, cet atelier prépare des tartes salées et sucrées avec une pâte croustillante à la farine bio, des légumes frais et des produits régionaux au fil des saisons.",
    hostNote:
      "Nous aimons l’idée d’une belle tarte choisie à La Flotte, à partager simplement à la maison après le marché ou la plage.",
    favorites: ["Tartes salées de saison", "Tartes sucrées", "Formule à partager"],
    practicalTip:
      "Commandez au moins la veille au 05 16 85 49 85 pour être certain de retrouver votre tarte préférée. Une livraison sur toute l’Île de Ré est également proposée.",
    website: "https://www.latartentiere.com",
    featured: true,
  },
  {
    slug: "marche-rivedoux-plage",
    name: "Marché de Rivedoux-Plage",
    category: "Marchés",
    location: "Rivedoux-Plage",
    island: "Île de Ré",
    title: "Le marché à quelques pas de nos maisons",
    description:
      "Un rendez-vous vivant pour retrouver les produits de saison, préparer un déjeuner à la maison et profiter de l’atmosphère du village.",
    hostNote:
      "Nous aimons y aller tôt, lorsque les étals sont encore bien garnis et que l’ambiance est plus paisible.",
    website:
      "https://www.iledere.com/sinformer/shopping-commerces-services/marche-de-rivedoux-plage-rivedoux-plage-fr-1261072/",
  },
  {
    slug: "reeduk-coach",
    name: "Özlem Ergin · Ré Eduk Coach",
    category: "Bien-être",
    location: "Rivedoux-Plage",
    island: "Île de Ré",
    title: "Santé, mouvement et bien-être face à la mer",
    description:
      "Özlem et son équipe de cinq kinés-coachs réunissent soins, cours en petits groupes et pauses bien-être : Pilates, gym douce ou dos, yoga de Gasquet, marche aquatique et massages.",
    hostNote:
      "Ce sont nos kinés. Nous aimons leur approche professionnelle, chaleureuse et très attentive au mouvement juste.",
    favorites: ["Pilates", "Marche aquatique", "Gym dos", "Massage bien-être"],
    practicalTip:
      "Consultez le planning actualisé et réservez avant le séjour : les cours semi-collectifs accueillent seulement quatre à six personnes.",
    website: "https://www.reedukcoach.fr",
    featured: true,
    photoPermission: true,
  },
  {
    slug: "bio-sens-coiffure",
    name: "Bio Sens Coiffure",
    category: "Services",
    location: "Île de Ré",
    island: "Île de Ré",
    title: "Le coiffeur de Stéphanie",
    description:
      "Une adresse locale de confiance à conserver dans son carnet pour prendre soin de soi pendant un séjour prolongé sur l’île.",
    hostNote:
      "C’est le salon que Stéphanie fréquente personnellement.",
    website: "https://www.facebook.com/biosensiledere/?locale=fr_FR",
  },
];

export const recommendationCategories: RecommendationCategory[] = [
  "Producteurs",
  "Gourmandises",
  "Marchés",
  "Bien-être",
  "Services",
];
