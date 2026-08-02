export type PetitBonheur = {
  slug: string;
  title: string;
  image: string;
  additionalImages?: string[];
  imageAlt: string;
  anecdote: string;
  tip?: string;
  officialUrl?: string;
  officialLabel?: string;
  mapUrl?: string;
  destination: "ile_de_re" | "all";
};

export const petitsBonheurs: PetitBonheur[] = [
  {
    slug: "brunch-dimanche-hr-hotel",
    title: "Le brunch du dimanche au Richelieu, face à l’océan",
    image: "/images/destination/petits-bonheurs/brunch-richelieu-01.jpeg",
    additionalImages: ["/images/destination/petits-bonheurs/brunch-richelieu-02.jpeg"],
    imageAlt: "Véritable brunch du Richelieu servi face à l’océan à La Flotte",
    anecdote:
      "S’il y a une tradition que nous aimons partager en famille ou entre amis, c’est le brunch du dimanche au restaurant du Richelieu — aujourd’hui HR Hôtel & Spa Marin — à La Flotte. Face à l’océan, le buffet est particulièrement généreux : viennoiseries, pains, crêpes, fruits frais, fromages, charcuteries, huîtres, crustacés, plats chauds et desserts. Chaque saison apporte ses spécialités et nous aimons y revenir toute l’année.",
    tip: "Réservez quelques jours à l’avance, surtout en été, puis profitez d’une promenade sur le front de mer de La Flotte.",
    officialUrl: "https://hotel-hr-spamarin.fr/menus/",
    officialLabel: "Découvrir le brunch du Richelieu",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=HR+Hotel+Spa+Marin+La+Flotte",
    destination: "ile_de_re",
  },
  {
    slug: "moules-port-saint-martin",
    title: "Une marmite de moules face au port de Saint-Martin-de-Ré",
    image: "/images/destination/petits-bonheurs/moules-frites-saint-martin.jpeg",
    imageAlt: "Marmite de moules-frites servie en terrasse à Saint-Martin-de-Ré",
    anecdote:
      "Parmi nos petits plaisirs, il y en a un que nous retrouvons avec le même bonheur à chaque saison : partager une grande marmite de moules-frites face au port de Saint-Martin-de-Ré. Nous choisissons une terrasse avec vue sur les voiliers et profitons simplement de l’animation du port. Ce sont souvent ces repas simples qui deviennent les plus beaux souvenirs de vacances.",
    tip: "Arrivez un peu avant le déjeuner ou en début de soirée. Après le repas, flânez le long des remparts classés par l’UNESCO et perdez-vous dans les ruelles.",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Port+de+Saint-Martin-de-Ré",
    destination: "ile_de_re",
  },
  {
    slug: "glace-la-martiniere",
    title: "Une glace après une balade à vélo",
    image: "/images/destination/petits-bonheurs/la-martiniere-01.jpeg",
    additionalImages: ["/images/destination/petits-bonheurs/la-martiniere-02.jpeg"],
    imageAlt: "Macarons glacés dégustés chez La Martinière",
    anecdote:
      "Après une balade à vélo dans les pinèdes, nous faisons presque toujours une pause chez La Martinière. Une glace artisanale, une gaufre ou un macaron glacé : c’est devenu notre petit rituel. Stéphanie adore le fraisier glacé. Bruno choisit presque toujours le macaron glacé à la réglisse.",
    tip: "En été, commandez directement à l’atelier afin d’éviter les files d’attente.",
    officialUrl: "https://la-martiniere.fr/",
    officialLabel: "Découvrir La Martinière",
    destination: "ile_de_re",
  },
  {
    slug: "chez-nina",
    title: "Une parenthèse gourmande Chez Nina",
    image: "/images/destination/nina-metayer/selection-patisseries.jpg",
    imageAlt: "Sélection de pâtisseries Chez Nina",
    anecdote:
      "Lorsque les journées deviennent plus fraîches, nous aimons faire une halte Chez Nina, le salon de thé de Nina Métayer à Rivedoux-Plage. Notre gourmandise préférée ? Une chocolatine au chocolat praliné, accompagnée d’un chocolat chaud ou d’un café. Le feuilletage est croustillant, le cœur praliné généreux et l’ambiance chaleureuse.",
    tip: "Les créations évoluent au fil des saisons : n’hésitez pas à revenir plusieurs fois pendant votre séjour.",
    officialUrl: "https://larochelle.delicatisserie.com/",
    officialLabel: "Découvrir les créations de Nina Métayer",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Chez+Nina+Rivedoux-Plage",
    destination: "ile_de_re",
  },
  {
    slug: "cocktail-apres-sortie-mer",
    title: "Un cocktail après une sortie en mer",
    image: "/images/destination/petits-bonheurs/re-glisse-01.jpeg",
    additionalImages: [
      "/images/destination/petits-bonheurs/re-glisse-02.jpeg",
      "/images/destination/petits-bonheurs/re-glisse-03.jpeg",
    ],
    imageAlt: "Sortie en jet-ski avec Ré Glisse au large de Rivedoux-Plage",
    anecdote:
      "Après une sortie en jet-ski avec Ré Glisse, nous aimons prolonger ce moment autour d’un cocktail sans alcool. C’est une belle façon de terminer une journée passée sur l’océan.",
    tip: "Installez-vous en terrasse au coucher du soleil pour profiter pleinement de l’ambiance du bord de mer.",
    officialUrl: "https://www.reglisse.fr/",
    officialLabel: "Découvrir Ré Glisse",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Ré+Glisse+Rivedoux-Plage",
    destination: "ile_de_re",
  },
  {
    slug: "rugby-pizza-tethys",
    title: "Rugby, pizza et bonne humeur",
    image: "/images/destination/petits-bonheurs/tethys-01.jpeg",
    additionalImages: ["/images/destination/petits-bonheurs/tethys-02.jpeg"],
    imageAlt: "Façade fleurie de la brasserie-pizzeria Le Téthys à Rivedoux-Plage",
    anecdote:
      "Lorsque le Stade Rochelais joue, il nous arrive souvent de retrouver des amis au Téthys. Une bonne pizza, un match sur grand écran et une ambiance conviviale. Parfois, les meilleurs souvenirs sont aussi les plus simples.",
    tip: "Même sans retransmission sportive, leurs pizzas valent le détour.",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Le+Téthys+Rivedoux-Plage",
    destination: "ile_de_re",
  },
  {
    slug: "premieres-fraises",
    title: "Les premières fraises de l’année",
    image: "/images/destination/re-authentique/marche-fruits.jpg",
    imageAlt: "Fraises et fruits frais au marché",
    anecdote:
      "Chaque printemps, nous attendons avec impatience les premières fraises du maraîcher du marché de Rivedoux. Dans notre famille, une tradition perdure : lorsque nous dégustons la première fraise de l’année, chacun fait un vœu. Une petite habitude toute simple qui nous accompagne depuis de nombreuses années.",
    tip: "Venez au marché le matin, lorsque les étals viennent d’être installés et que le village s’éveille.",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Marché+de+Rivedoux-Plage",
    destination: "ile_de_re",
  },
  {
    slug: "huitres-grandes-occasions",
    title: "Les huîtres des grandes occasions",
    image: "/images/destination/huitres-vin-blanc.jpg",
    imageAlt: "Huîtres et vin blanc servis à table",
    anecdote:
      "Pour les anniversaires, les repas de famille ou les fêtes, nous achetons toujours nos huîtres chez Huîtres et Ma Ré, à Rivedoux-Plage. Nous apprécions autant la qualité des produits que l’accueil chaleureux qui nous est réservé.",
    tip: "Dégustez-les simplement avec un bon pain frais, un filet de citron et un verre de vin blanc de l’Île de Ré.",
    officialUrl: "https://www.huitresetmare.fr/",
    officialLabel: "Découvrir Huîtres et Ma Ré",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Huîtres+et+Ma+Ré+Rivedoux-Plage",
    destination: "ile_de_re",
  },
  {
    slug: "cafe-re-monde",
    title: "Observer la vie du village",
    image: "/images/destination/guides/marche-rivedoux.jpg",
    imageAlt: "Le marché et la vie du village de Rivedoux-Plage",
    anecdote:
      "Nous aimons nous installer à la terrasse de Chez Ré Monde. Un café à la main, nous regardons le marché s’animer, les habitants se retrouver, les commerçants installer leurs étals et les cyclistes traverser le cœur du village. Ces petits instants racontent la véritable vie de Rivedoux-Plage.",
    tip: "Choisissez un matin de marché et laissez-vous simplement porter par le rythme du village.",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Chez+Ré+Monde+Rivedoux-Plage",
    destination: "ile_de_re",
  },
  {
    slug: "ballets-kitesurf-rivedoux",
    title: "Les ballets de kitesurf de Rivedoux-Plage",
    image: "/images/destination/petits-bonheurs/kitesurf-rivedoux-01.jpeg",
    additionalImages: ["/images/destination/petits-bonheurs/kitesurf-rivedoux-02.jpeg"],
    imageAlt: "Nombreux kitesurfeurs et ailes colorées sur l’océan à Rivedoux-Plage",
    anecdote:
      "À l’automne et en hiver, lorsque le vent souffle sur Rivedoux-Plage, nous aimons nous promener sur la plage pour admirer les nombreux kitesurfeurs qui profitent des meilleures conditions de vent de l’année. Les ailes colorées dessinent un véritable ballet dans le ciel tandis que les riders glissent sur l’océan et réalisent des sauts spectaculaires. Même sans pratiquer ce sport, nous ne nous lassons jamais d’observer ce spectacle. Les grandes marées, les immenses ciels d’hiver et la lumière si particulière de cette saison donnent à la plage une ambiance sauvage et apaisante. C’est une autre façon de découvrir l’Île de Ré, loin de l’effervescence estivale.",
    tip: "Si vous séjournez entre octobre et mars, profitez d’une journée ventée pour faire une promenade sur la plage de Rivedoux-Plage. Même avec une simple boisson chaude, observer les kitesurfeurs évoluer sur l’océan est un véritable moment de détente. Pour celles et ceux qui souhaitent découvrir cette discipline ou prendre un cours, nous recommandons Site Surf, école de glisse reconnue sur l’Île de Ré.",
    officialUrl: "https://www.sitesurf.fr/",
    officialLabel: "Découvrir Site Surf",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Plage+nord+Rivedoux-Plage+kitesurf",
    destination: "ile_de_re",
  },
];
