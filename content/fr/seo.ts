export type Breadcrumb = {
  name: string;
  path: string;
};

export type PageSchemaType =
  | "WebSite"
  | "Organization"
  | "WebPage"
  | "CollectionPage";

export type PageSeoConfig = {
  title: string;
  description: string;
  path: `/${string}` | "/";
  breadcrumbs: readonly Breadcrumb[];
  schemaTypes: readonly PageSchemaType[];
};

export type StaticPageSeo = PageSeoConfig;

const home = { name: "Accueil", path: "/" } as const;
const houses = { name: "Nos maisons", path: "/maisons" } as const;

export const staticPageSeo = {
  "/": {
    title: "Maisons de caractère sur Ré et Oléron | Beaux Rivages",
    description: "Trois maisons de caractère sur les îles de Ré et d’Oléron, portées par une hospitalité attentive.",
    path: "/",
    breadcrumbs: [home],
    schemaTypes: ["WebSite", "Organization"],
  },
  "/maisons": {
    title: "Nos maisons | Beaux Rivages",
    description: "Découvrez les trois maisons Beaux Rivages sur les îles de Ré et d’Oléron, chacune pensée pour une autre façon de vivre l’océan.",
    path: "/maisons",
    breadcrumbs: [home, houses],
    schemaTypes: ["CollectionPage"],
  },
  "/avis": {
    title: "Avis voyageurs | Beaux Rivages",
    description: "Découvrez ce que les voyageurs apprécient au Chai des Tortues, à la Villa Raie Manta et au Nid d’Été.",
    path: "/avis",
    breadcrumbs: [home, { name: "Avis voyageurs", path: "/avis" }],
    schemaTypes: ["CollectionPage"],
  },
  "/carnet": {
    title: "Le Carnet Beaux Rivages | Magazine des îles de Ré et d’Oléron",
    description: "Restaurants, producteurs, marchés, plages, balades et expériences : le magazine de voyage personnel de Stéphanie et Bruno sur Ré et Oléron.",
    path: "/carnet",
    breadcrumbs: [home, { name: "Le Carnet", path: "/carnet" }],
    schemaTypes: ["CollectionPage"],
  },
  "/choisir": {
    title: "Quelle maison choisir sur Ré ou Oléron ? | Beaux Rivages",
    description: "Comparez les maisons Beaux Rivages selon votre séjour : couple, famille, vélo, télétravail, accès plage ou vue mer.",
    path: "/choisir",
    breadcrumbs: [home, { name: "Choisir sa maison", path: "/choisir" }],
    schemaTypes: ["WebPage"],
  },
  "/construisez-votre-sejour": {
    title: "Construisez votre séjour sur Ré ou Oléron | Beaux Rivages",
    description: "Créez un séjour personnalisé selon vos voyageurs et vos envies : gastronomie, vélo, plages, patrimoine, nature ou sports nautiques.",
    path: "/construisez-votre-sejour",
    breadcrumbs: [home, { name: "Construisez votre séjour", path: "/construisez-votre-sejour" }],
    schemaTypes: ["WebPage"],
  },
  "/avant-arrivee": {
    title: "Avant votre arrivée sur Ré ou Oléron | Beaux Rivages",
    description: "Checklist, météo intelligente, marées, marchés, restaurants et carte interactive pour préparer votre arrivée chez Beaux Rivages.",
    path: "/avant-arrivee",
    breadcrumbs: [home, { name: "Avant votre arrivée", path: "/avant-arrivee" }],
    schemaTypes: ["WebPage"],
  },
  "/conseils": {
    title: "Les conseils de Stéphanie et Bruno | Beaux Rivages",
    description: "Bonnes adresses, producteurs, restaurants, balades et astuces personnelles de Stéphanie et Bruno sur les îles de Ré et d’Oléron.",
    path: "/conseils",
    breadcrumbs: [home, { name: "Conseils de Stéphanie et Bruno", path: "/conseils" }],
    schemaTypes: ["CollectionPage"],
  },
  "/mot-de-stephanie": {
    title: "Le mot de Stéphanie | L’hospitalité Beaux Rivages",
    description: "La lettre de Stéphanie, l’histoire familiale et la philosophie d’accueil qui donnent vie aux maisons Beaux Rivages.",
    path: "/mot-de-stephanie",
    breadcrumbs: [home, { name: "Le mot de Stéphanie", path: "/mot-de-stephanie" }],
    schemaTypes: ["WebPage"],
  },
  "/inspiration": {
    title: "Inspirez-moi | Votre séjour personnalisé Beaux Rivages",
    description: "Trouvez votre maison idéale, vos expériences et vos bonnes adresses selon votre façon de voyager et vos envies.",
    path: "/inspiration",
    breadcrumbs: [home, { name: "Inspirez-moi", path: "/inspiration" }],
    schemaTypes: ["WebPage"],
  },
  "/sejour": {
    title: "Votre séjour avec Beaux Rivages | De J-30 au retour",
    description: "Découvrez l’accompagnement Beaux Rivages avant, pendant et après votre séjour sur Ré ou Oléron.",
    path: "/sejour",
    breadcrumbs: [home, { name: "Votre séjour", path: "/sejour" }],
    schemaTypes: ["WebPage"],
  },
  "/saisons": {
    title: "Les saisons sur Ré et Oléron | Beaux Rivages",
    description: "Printemps, été, automne, Noël, hiver ou Pâques : découvrez comment les maisons et les îles vivent au fil des saisons.",
    path: "/saisons",
    breadcrumbs: [home, { name: "Les saisons", path: "/saisons" }],
    schemaTypes: ["CollectionPage"],
  },
  "/faq": {
    title: "FAQ séjour sur Ré et Oléron | Beaux Rivages",
    description: "Réponses sur les maisons, destinations, réservations, animaux, enfants, vélos et plages.",
    path: "/faq",
    breadcrumbs: [home, { name: "Questions fréquentes", path: "/faq" }],
    schemaTypes: ["WebPage"],
  },
  "/pourquoi-beaux-rivages": {
    title: "Pourquoi Beaux Rivages ? | Notre hospitalité",
    description: "Découvrez la philosophie, l’histoire familiale, les valeurs et les engagements qui façonnent l’hospitalité Beaux Rivages.",
    path: "/pourquoi-beaux-rivages",
    breadcrumbs: [home, { name: "Pourquoi Beaux Rivages", path: "/pourquoi-beaux-rivages" }],
    schemaTypes: ["WebPage"],
  },
  "/carnet-voyageur": {
    title: "Le Carnet voyageur | Beaux Rivages",
    description: "L’accompagnement Beaux Rivages avant, pendant et après votre séjour sur les îles.",
    path: "/carnet-voyageur",
    breadcrumbs: [home, { name: "Carnet voyageur", path: "/carnet-voyageur" }],
    schemaTypes: ["WebPage"],
  },
  "/coulisses": {
    title: "Les coulisses | Beaux Rivages",
    description: "Découvrez le soin apporté à la préparation de chaque séjour Beaux Rivages.",
    path: "/coulisses",
    breadcrumbs: [home, { name: "Les coulisses", path: "/coulisses" }],
    schemaTypes: ["WebPage"],
  },
  "/destinations": {
    title: "Les îles | Beaux Rivages",
    description: "Explorez l’Île de Ré, l’Île d’Oléron et les escapades choisies par Beaux Rivages.",
    path: "/destinations",
    breadcrumbs: [home, { name: "Les îles", path: "/destinations" }],
    schemaTypes: ["CollectionPage"],
  },
  "/engagements": {
    title: "Nos engagements | Beaux Rivages",
    description: "Les engagements d’hospitalité, de transparence et de respect des îles de Beaux Rivages.",
    path: "/engagements",
    breadcrumbs: [home, { name: "Nos engagements", path: "/engagements" }],
    schemaTypes: ["WebPage"],
  },
  "/experiences": {
    title: "Expériences premium sur Ré et Oléron | Beaux Rivages",
    description: "Découvrez 12 expériences Beaux Rivages : romance, gastronomie, vélo, bien-être, famille et attentions personnalisées sur Ré et Oléron.",
    path: "/experiences",
    breadcrumbs: [home, { name: "Expériences", path: "/experiences" }],
    schemaTypes: ["WebPage"],
  },
  "/personnaliser": {
    title: "Personnaliser votre séjour | Beaux Rivages",
    description: "Composez les attentions et options qui rendront votre séjour Beaux Rivages personnel.",
    path: "/personnaliser",
    breadcrumbs: [home, { name: "Personnaliser", path: "/personnaliser" }],
    schemaTypes: ["WebPage"],
  },
  "/phototheque": {
    title: "Photothèque Beaux Rivages | Maisons de Ré et d’Oléron",
    description: "Explorez la photothèque immersive Beaux Rivages : extérieurs, chambres, cuisines, détails, instants de vie et destinations.",
    path: "/phototheque",
    breadcrumbs: [home, { name: "Photothèque", path: "/phototheque" }],
    schemaTypes: ["CollectionPage"],
  },
  "/pourquoi-revenir": {
    title: "Pourquoi revenir | Beaux Rivages",
    description: "Les maisons, les îles et les attentions qui donnent envie de retrouver Beaux Rivages.",
    path: "/pourquoi-revenir",
    breadcrumbs: [home, { name: "Pourquoi revenir", path: "/pourquoi-revenir" }],
    schemaTypes: ["WebPage"],
  },
  "/reserver": {
    title: "Préparer votre séjour | Beaux Rivages",
    description: "Imaginez votre séjour Beaux Rivages : maison, dates, voyageurs et attentions personnalisées sur les îles.",
    path: "/reserver",
    breadcrumbs: [home, { name: "Réserver", path: "/reserver" }],
    schemaTypes: ["WebPage"],
  },
} as const satisfies Record<string, PageSeoConfig>;
