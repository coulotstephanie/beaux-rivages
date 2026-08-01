export type WeatherDestination = "ile-de-re" | "ile-d-oleron" | "la-rochelle";
export type TideState = "basse" | "montante" | "haute" | "descendante";
export type Season = "printemps" | "ete" | "automne" | "hiver";

export type WeatherSnapshot = {
  temperature: number;
  apparentTemperature: number;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  maxTemperature: number;
  precipitationProbability: number;
  season: Season;
};

export type SmartRecommendation = {
  title: string;
  reason: string;
  detail: string;
  href: string;
  label: string;
};

export const weatherDestinations = {
  "ile-de-re": {
    label: "Île de Ré",
    latitude: 46.19,
    longitude: -1.39,
    tideUrl: "https://diffusion.shom.fr/services-numeriques/api-shom.html",
  },
  "ile-d-oleron": {
    label: "Île d’Oléron",
    latitude: 45.94,
    longitude: -1.31,
    tideUrl: "https://diffusion.shom.fr/services-numeriques/api-shom.html",
  },
  "la-rochelle": {
    label: "La Rochelle",
    latitude: 46.16,
    longitude: -1.15,
    tideUrl: "https://diffusion.shom.fr/services-numeriques/api-shom.html",
  },
} as const;

export function getSeason(date = new Date()): Season {
  const month = date.getMonth() + 1;
  if (month >= 3 && month <= 5) return "printemps";
  if (month >= 6 && month <= 8) return "ete";
  if (month >= 9 && month <= 11) return "automne";
  return "hiver";
}

export function windCardinal(degrees: number) {
  const directions = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"] as const;
  return directions[Math.round(degrees / 45) % 8];
}

function indoorRecommendations(destination: WeatherDestination): SmartRecommendation[] {
  if (destination === "la-rochelle") {
    return [
      {
        title: "Aquarium La Rochelle",
        reason: "Une immersion à l’abri",
        detail: "Réservez un billet horodaté, idéalement à l’ouverture ou en fin de journée.",
        href: "https://www.aquarium-larochelle.com/",
        label: "Site officiel",
      },
      {
        title: "Musée maritime",
        reason: "Comprendre la ville portuaire",
        detail: "Navires patrimoniaux et mémoire du port dans l’ancien bassin des chalutiers.",
        href: "https://museemaritime.larochelle.fr/",
        label: "Site officiel",
      },
      {
        title: "Marché central",
        reason: "La pluie devient gourmande",
        detail: "Composez un déjeuner sous les halles avant de rejoindre les arcades.",
        href: "/carnet#marches",
        label: "Voir le Carnet",
      },
    ];
  }
  return [
    {
      title: "Une escapade à La Rochelle",
      reason: "Aquarium, musées et halles",
      detail: "Un programme abrité qui conserve un lien fort avec l’océan.",
      href: "/destinations/la-rochelle",
      label: "Voir le guide",
    },
    {
      title: "Le marché puis la cuisine",
      reason: "Vivre pleinement la maison",
      detail: "Choisissez les produits du jour puis prenez le temps de cuisiner ensemble.",
      href: "/carnet#marches",
      label: "Voir les marchés",
    },
    {
      title: "Atelier macarons et pâtisserie",
      reason: "Un moment à partager",
      detail:
        "Une activité gourmande chez Confetti à Rivedoux-Plage, adaptée aux familles et aux journées grises.",
      href: "/experiences/atelier-macarons",
      label: "Découvrir",
    },
  ];
}

export function buildSmartRecommendations(
  snapshot: WeatherSnapshot,
  destination: WeatherDestination,
  tide: TideState,
): SmartRecommendation[] {
  const rain =
    snapshot.precipitation > 0.2 ||
    snapshot.precipitationProbability >= 55 ||
    snapshot.weatherCode >= 51;
  const hot = snapshot.temperature >= 28 || snapshot.maxTemperature >= 30;
  const strongWind = snapshot.windSpeed >= 25;
  const westWind = snapshot.windDirection >= 225 && snapshot.windDirection <= 315;

  if (rain) return indoorRecommendations(destination);

  if (hot) {
    return [
      {
        title:
          destination === "ile-d-oleron" ? "Forêt des Saumonards" : "Marais et chemins ombragés",
        reason: "Fraîcheur naturelle",
        detail:
          "Partez tôt, faites une vraie pause aux heures chaudes et emportez suffisamment d’eau.",
        href: "/carnet#guides",
        label: "Préparer la balade",
      },
      {
        title: "Le marché au réveil",
        reason: "Avant la chaleur",
        detail:
          "Achetez tôt, rentrez déjeuner à la maison et gardez la plage pour la fin de journée.",
        href: "/carnet#marches",
        label: "Voir les marchés",
      },
      {
        title: "L’océan après 18 heures",
        reason: "Lumière plus douce",
        detail: "Privilégiez une plage surveillée et vérifiez les consignes locales.",
        href: "/carnet#guides",
        label: "Choisir la plage",
      },
    ];
  }

  if (strongWind && westWind) {
    return [
      {
        title: destination === "ile-d-oleron" ? "Plage des Saumonards" : "Plage sud de Rivedoux",
        reason: "Plus abritée d’un vent d’ouest",
        detail:
          "La côte est ou le pertuis offrent souvent une atmosphère plus douce ; vérifiez toujours les drapeaux sur place.",
        href: "/carnet#guides",
        label: "Voir la fiche",
      },
      {
        title: "Villages et ruelles",
        reason: "À l’abri des rafales",
        detail:
          "Choisissez les venelles, les ports et une halte gourmande plutôt qu’une longue côte exposée.",
        href: "/carnet#guides",
        label: "Ouvrir le Carnet",
      },
      {
        title: "Retour face au vent évité",
        reason: "Conseil vélo",
        detail: "Construisez votre boucle pour garder le vent favorable au retour.",
        href: "/carnet#carte",
        label: "Voir les itinéraires",
      },
    ];
  }

  if (tide === "basse" || tide === "descendante") {
    return [
      {
        title: "Observer l’estran",
        reason: `Marée ${tide}`,
        detail:
          "Découvrez le rivage découvert sans vous éloigner des zones sûres et consultez l’heure de remontée officielle.",
        href: "/experiences/peche-a-pied",
        label: "Conseils utiles",
      },
      {
        title: "Longue marche sur la plage",
        reason: "Le paysage s’ouvre",
        detail: "Gardez un œil sur les chenaux et revenez largement avant la marée montante.",
        href: "/carnet#guides",
        label: "Choisir une plage",
      },
      {
        title: "Port et producteurs",
        reason: "Au rythme de l’eau",
        detail: "Prolongez par un port ostréicole ou une rencontre avec un producteur.",
        href: "/carnet#guides",
        label: "Voir le Carnet",
      },
    ];
  }

  return [
    {
      title: "La plage au bon moment",
      reason: `Marée ${tide}`,
      detail:
        "Choisissez une plage adaptée aux conditions et respectez les informations affichées sur place.",
      href: "/carnet#guides",
      label: "Voir les plages",
    },
    {
      title: "Une boucle à vélo",
      reason: `${snapshot.season} · vent ${windCardinal(snapshot.windDirection)}`,
      detail: "Adaptez la distance au vent et conservez une halte libre.",
      href: "/carnet#carte",
      label: "Voir la carte",
    },
    {
      title: "Le coucher du soleil",
      reason: "Terminer sans courir",
      detail: "Arrivez vingt minutes avant et restez après la disparition du soleil.",
      href: "/experiences/coucher-de-soleil",
      label: "Découvrir",
    },
  ];
}
