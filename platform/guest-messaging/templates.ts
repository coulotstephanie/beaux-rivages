import type {
  ArrivalSecrets,
  GuestMessage,
  GuestMessageData,
  MessageType,
  PropertyId,
} from "./contracts";

const logo = "https://www.beaux-rivages.com/brand/logo-horizontal-blanc.svg";
const publicOrigin = "https://www.beaux-rivages.com";
const e = (value: string | number) =>
  String(value).replace(
    /[&<>"']/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!,
  );
const textDate = (value: string, locale: GuestMessageData["locale"] = "fr") =>
  new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : locale === "de" ? "de-DE" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  }).format(new Date(`${value}T12:00:00+02:00`));

export const properties: Record<
  PropertyId,
  { name: string; shortName: string; editorial: string; booking: string; address: string }
> = {
  "chai-des-tortues": {
    name: "Le Chai des Tortues",
    shortName: "Le Chai des Tortues",
    editorial: "Authenticité, patrimoine et art de vivre insulaire",
    booking:
      "Au Chai des Tortues, vous découvrirez une maison de caractère où la pierre de l’Île de Ré, le bois et la convivialité se rencontrent.\n\nÀ seulement 250 mètres de la plage et à quelques pas du marché, des commerces et des restaurants, la maison est idéale pour profiter de Rivedoux-Plage à pied ou à vélo.",
    address: "Le Chai des Tortues\n165 rue de la Fontaine\n17940 Rivedoux-Plage",
  },
  "villa-raie-manta": {
    name: "Villa Raie Manta",
    shortName: "Villa Raie Manta",
    editorial: "Océan, design et lumière",
    booking:
      "À la Villa Raie Manta, la lumière et l’océan accompagnent chaque moment du séjour.\n\nFace à la mer, à quelques pas du rivage et à proximité du marché de Rivedoux-Plage, la maison a été imaginée comme un lieu contemporain, lumineux et généreux, où l’on se retrouve en famille ou entre amis.",
    address: "Villa Raie Manta\n113 bis avenue Sarrault\n17940 Rivedoux-Plage",
  },
  "nid-d-ete": {
    name: "Le Nid d’Été — La Maison Heureuse",
    shortName: "Le Nid d’Été",
    editorial: "Nature, sérénité et accès direct à la plage",
    booking:
      "Le Nid d’Été vous accueille au cœur de La Maison Heureuse, résidence historique de Saint-Georges-d’Oléron.\n\nDepuis la résidence, un portail privé permet de rejoindre directement la plage des Saumonards, face à Fort Boyard. Un cadre privilégié pour profiter de la nature, de la mer et de la douceur de vivre oléronaise.",
    address:
      "Le Nid d’Été\nLa Maison Heureuse — Appartement D12\n355 route des Saumonards\n17190 Saint-Georges-d’Oléron",
  },
};

export function nights(data: GuestMessageData) {
  return Math.round(
    (Date.parse(`${data.departureDate}T12:00:00Z`) - Date.parse(`${data.arrivalDate}T12:00:00Z`)) /
      86_400_000,
  );
}

export function guestComposition(data: GuestMessageData) {
  const parts: string[] = [`${data.adults} adulte${data.adults > 1 ? "s" : ""}`];
  if (data.children)
    parts.push(
      `${data.children} enfant${data.children > 1 ? "s" : ""}${data.childrenAges?.length ? ` (${data.childrenAges.join(", ")} ans)` : ""}`,
    );
  if (data.babies) parts.push(`${data.babies} bébé${data.babies > 1 ? "s" : ""}`);
  if (data.pets) parts.push(data.pets === 1 ? "leur chien" : `${data.pets} animaux`);
  return parts.length === 2
    ? parts.join(" et ")
    : parts
        .map((part, index) => (index === parts.length - 1 ? `et ${part}` : part))
        .join(", ")
        .replace(", et ", " et ");
}

const experienceLabels = {
  essentiel: "Essentiel",
  confort: "Confort",
  signature: "Signature Beaux Rivages",
};
const experienceCopy = {
  essentiel:
    "Votre séjour comprend tout l’essentiel pour profiter pleinement de la maison et découvrir les îles en toute liberté.",
  confort:
    "Vous avez choisi la formule Confort. Les prestations et les options sélectionnées seront préparées avec soin afin de faciliter votre arrivée et de rendre votre séjour encore plus agréable.",
  signature:
    "Vous avez choisi l’expérience Signature Beaux Rivages. Nous préparerons votre arrivée avec une attention toute particulière afin que votre séjour commence dès les premiers instants dans une atmosphère chaleureuse et personnalisée.",
};

export function optionLabels(data: GuestMessageData) {
  const o = data.selectedOptions;
  return [
    o.linenPackage &&
      `Forfait linge pour ${o.linenGuestsCount ?? data.adults + data.children} personne${(o.linenGuestsCount ?? data.adults + data.children) > 1 ? "s" : ""}`,
    o.beachTowels && "Serviettes de plage",
    o.bathrobes && "Peignoirs",
    o.slippers && "Chaussons",
    o.earlyCheckIn && "Arrivée anticipée",
    o.lateCheckOut && "Départ tardif",
    o.personalizedArrival && "Arrivée personnalisée",
    o.aperitifBasket && "Panier Apéritif Beaux Rivages",
    o.sweetBasket && "Panier Douceur Beaux Rivages",
    o.romancePack && "Pack Romance",
    o.signatureRomancePack && "Pack Romance Signature",
    o.petOption && "Option animal",
  ].filter((item): item is string => Boolean(item));
}

const conditionalCopy = (data: GuestMessageData) => {
  const blocks: string[] = [];
  if (data.children || data.babies)
    blocks.push(
      `Nous avons bien noté que vous voyagerez avec ${[data.children && `${data.children} enfant${data.children > 1 ? "s" : ""}`, data.babies && `${data.babies} bébé${data.babies > 1 ? "s" : ""}`].filter(Boolean).join(" et ")}. Les équipements réservés ou inclus seront préparés avant votre arrivée.`,
    );
  if (data.pets)
    blocks.push(
      `Nous sommes heureux d’accueillir également votre compagnon à quatre pattes.\n\nDes gamelles seront mises à votre disposition. Merci de prévoir son couchage personnel et de veiller à ce qu’il ne monte pas sur les lits.${data.propertyId === "nid-d-ete" ? "\n\nDans les parties communes de La Maison Heureuse, les chiens doivent impérativement être tenus en laisse." : ""}`,
    );
  if (data.selectedOptions.linenPackage)
    blocks.push(
      `Le forfait linge a bien été enregistré pour ${data.selectedOptions.linenGuestsCount ?? data.adults + data.children} personne(s). Les lits et le linge prévus dans votre formule seront préparés selon les modalités de votre réservation.`,
    );
  if (data.selectedOptions.personalizedArrival)
    blocks.push(
      "Vous avez choisi l’Arrivée Personnalisée Beaux Rivages. Stéphanie ou Bruno prendra contact avec vous afin de confirmer l’horaire et les modalités de votre accueil.",
    );
  if (data.selectedOptions.earlyCheckIn)
    blocks.push(
      "Votre demande d’arrivée anticipée a bien été enregistrée. L’horaire définitif vous sera confirmé en fonction de l’organisation et de la disponibilité de la maison.",
    );
  if (data.selectedOptions.romancePack || data.selectedOptions.signatureRomancePack)
    blocks.push(
      "Une attention particulière sera préparée dans la maison conformément à votre réservation.",
    );
  return blocks;
};

const cardText = (data: GuestMessageData) => {
  const p = properties[data.propertyId];
  const options = optionLabels(data);
  return [
    `Maison : ${p.name}`,
    `Arrivée : ${textDate(data.arrivalDate, data.locale)}`,
    `Départ : ${textDate(data.departureDate, data.locale)}`,
    `Durée : ${nights(data)} nuit${nights(data) > 1 ? "s" : ""}`,
    `Voyageurs : ${guestComposition(data)}`,
    `Formule : ${experienceLabels[data.experienceLevel]}`,
    ...(options.length ? [`Options : ${options.join(", ")}`] : []),
  ].join("\n");
};

const arrivalPractical = (data: GuestMessageData, secrets: ArrivalSecrets) => {
  const common = `ARRIVÉE AUTONOME\nLe logement est accessible à partir de 16 h, sauf arrivée anticipée expressément confirmée.\n\nCode de la boîte à clés : ${secrets.keyBoxCode}\n\nWI-FI\nNom du réseau : ${secrets.wifiName}\nMot de passe : ${secrets.wifiPassword}`;
  if (data.propertyId === "chai-des-tortues")
    return `${properties[data.propertyId].address}\nUne plaque noire portant le nom « Le Chai des Tortues » est fixée sur la porte. La maison se trouve à l’angle de la rue.\n\n${common}\nLa Livebox se trouve dans la buanderie, à côté de la cuisine.\n\nÉLECTRICITÉ\nEn cas de disjonction, abaissez tous les disjoncteurs puis relevez-les un par un.\n\nRESPECT DU VOISINAGE\nMerci de limiter les nuisances sonores, notamment en soirée et durant la nuit.\n\nGESTION DES DÉCHETS\nPoubelle verte : déchets ménagers. Poubelle jaune : emballages recyclables. Le verre doit être déposé dans les conteneurs du village.`;
  if (data.propertyId === "villa-raie-manta")
    return `${properties[data.propertyId].address}\nUne plaque noire portant le nom « Villa Raie Manta » est apposée sur la façade, juste en face du restaurant La Chaloupe.\n\n${common}\nLa box Internet se trouve à l’étage, derrière la télévision.\n\nÉLECTRICITÉ\nEn cas de disjonction, abaissez tous les disjoncteurs puis relevez-les un par un.\n\nCOMME À LA MAISON\nQuelques produits de première nécessité sont à votre disposition.`;
  if (!secrets.pedestrianGateCode) throw new Error("ARRIVAL_SECRETS_INCOMPLETE");
  return `${properties[data.propertyId].address}\n\nACCÈS À LA RÉSIDENCE\nEntrez par le portillon piéton : touche clé, code ${secrets.pedestrianGateCode}, puis touche verte.\n\nBOÎTE À CLÉS\nLa boîte se trouve à droite de l’appartement, sur le piquet en bois.\nCode : ${secrets.keyBoxCode}\n\nSTATIONNEMENT\nDeux places privées : n° 28 et n° 29.\n\nLES CLÉS\nUne clé pour l’appartement et une clé pour le local à vélos et le portail privé vers la plage.\n\nWI-FI\nNom du réseau : ${secrets.wifiName}\nMot de passe : ${secrets.wifiPassword}\n\nFORTES CHALEURS\nDeux ventilateurs sont dans le placard de l’entrée, avec des ventilateurs de plafond dans chaque chambre et des rideaux thermiques.\n\nRÉSIDENCE\nLa Maison Heureuse est une résidence calme. Les chiens doivent être tenus en laisse dans les parties communes.\n\nTÉLÉVISION\nhttps://www.samsung.com/be_fr/support/tv-audio-video/comment-utiliser-la-telecommande-samsung-one-remote/`;
};

const paragraphs = (value: string) =>
  value
    .split("\n\n")
    .map(
      (part) => `<p style="margin:0 0 18px;line-height:1.7">${e(part).replace(/\n/g, "<br>")}</p>`,
    )
    .join("");
const nidArrivalMapUrl =
  "https://www.google.com/maps/search/?api=1&query=355%20route%20des%20Saumonards%2C%2017190%20Saint-Georges-d%27Ol%C3%A9ron";
const nidArrivalGuideText = () =>
  `\n\nCARTE ET PLAN D’ACCÈS\nOuvrir l’itinéraire : ${nidArrivalMapUrl}\nPhoto de la boîte à clés : ${publicOrigin}/images/properties/nid-d-ete/airbnb-cour-d-entree-1.jpeg\nPlan de la résidence vers D12 : ${publicOrigin}/images/properties/nid-d-ete/airbnb-exterieur-3-1.jpeg`;
const nidArrivalGuideHtml = () => `
    <div style="margin:28px 0;padding:22px;background:#f4f0e7;border-left:3px solid #b89a60">
      <h2 style="margin:0 0 12px;font:400 24px Georgia,serif">Carte et plan d’accès</h2>
      <p style="margin:0 0 18px;line-height:1.7">Suivez le plan depuis le portillon piéton jusqu’à l’appartement D12. Les places privées 28 et 29 y sont également indiquées.</p>
      <p style="margin:0 0 20px"><a href="${nidArrivalMapUrl}" style="display:inline-block;padding:12px 18px;background:#173b3b;color:#fff;text-decoration:none">Ouvrir l’itinéraire</a></p>
      <figure style="margin:0 0 22px">
        <img src="${publicOrigin}/images/properties/nid-d-ete/airbnb-exterieur-3-1.jpeg" width="596" alt="Plan d’accès au Nid d’Été dans la résidence La Maison Heureuse" style="display:block;width:100%;height:auto;border:0">
        <figcaption style="margin-top:8px;color:#5c6664;font-size:13px">Du portillon piéton à l’appartement D12 et aux parkings 28–29.</figcaption>
      </figure>
      <figure style="margin:0">
        <img src="${publicOrigin}/images/properties/nid-d-ete/airbnb-cour-d-entree-1.jpeg" width="596" alt="Emplacement de la boîte à clés du Nid d’Été" style="display:block;width:100%;height:auto;border:0">
        <figcaption style="margin-top:8px;color:#5c6664;font-size:13px">La boîte à clés se trouve à droite de l’appartement, sur le piquet en bois.</figcaption>
      </figure>
    </div>`;
const htmlShell = (data: GuestMessageData, title: string, preheader: string, body: string) => {
  const p = properties[data.propertyId];
  return `<!doctype html><html lang="${data.locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${e(title)}</title></head><body style="margin:0;background:#f4f0e7;color:#173b3b;font-family:Arial,sans-serif"><div style="display:none;max-height:0;overflow:hidden">${e(preheader)}</div><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:18px 10px"><table role="presentation" width="100%" style="max-width:640px;background:#fff" cellspacing="0" cellpadding="0"><tr><td style="padding:28px;background:#173b3b;color:#fff"><img src="${logo}" width="280" alt="Beaux Rivages" style="display:block;max-width:100%;height:auto"><p style="margin:18px 0 0;font-size:14px">${e(p.name)}<br><span style="color:#d7c18e">Une maison Beaux Rivages</span></p></td></tr><tr><td style="padding:clamp(24px,6vw,44px)">${body}</td></tr><tr><td style="padding:25px;background:#173b3b;color:#fff;line-height:1.6">Stéphanie et Bruno<br><span style="color:#d7c18e">Vos hôtes Beaux Rivages</span></td></tr></table></td></tr></table></body></html>`;
};
const stayCardHtml = (data: GuestMessageData) =>
  `<div style="margin:26px 0;padding:22px;background:#f4f0e7;border-left:3px solid #b89a60"><strong style="font-size:12px;letter-spacing:.12em">VOTRE SÉJOUR</strong>${paragraphs(cardText(data))}</div>`;

export function renderGuestMessage(
  data: GuestMessageData,
  type: MessageType,
  secrets?: ArrivalSecrets,
  scheduledDate = type === "departure"
    ? new Date(Date.parse(`${data.departureDate}T12:00:00Z`) - 86_400_000)
        .toISOString()
        .slice(0, 10)
    : data.arrivalDate,
): GuestMessage {
  const p = properties[data.propertyId];
  const options = optionLabels(data);
  const idempotencyKey = `${data.reservationId}:${type}:${data.locale}:${scheduledDate}`;
  if (type === "booking_confirmation") {
    const subject = "Merci pour votre réservation";
    const text = `Bonjour ${data.guestFirstName},\n\nNous vous remercions chaleureusement d’avoir choisi ${p.name} pour votre prochain séjour.\n\nNous sommes heureux de confirmer votre réservation du ${textDate(data.arrivalDate, data.locale)} au ${textDate(data.departureDate, data.locale)} et nous nous réjouissons de vous accueillir prochainement.\n\nVOTRE SÉJOUR\n${cardText(data)}\n\n${experienceCopy[data.experienceLevel]}\n\n${p.booking}\n\n${options.length ? `VOS ATTENTIONS RÉSERVÉES\n${options.map((item) => `- ${item}`).join("\n")}\n\n` : ""}${conditionalCopy(data).join("\n\n")}${conditionalCopy(data).length ? "\n\n" : ""}Les informations détaillées concernant l’accès à la maison vous seront transmises avant votre arrivée.\n\nD’ici là, nous restons naturellement à votre disposition pour toute question ou demande particulière.\n\nMerci pour votre confiance.\n\nAvec toute notre sympathie,\n\nStéphanie et Bruno\nVos hôtes Beaux Rivages\n\n${p.shortName}\n${p.editorial}`;
    const body = `<p>Bonjour ${e(data.guestFirstName)},</p><h1 style="font:400 36px Georgia,serif">${subject}</h1>${paragraphs(`Nous vous remercions chaleureusement d’avoir choisi ${p.name} pour votre prochain séjour.\n\nNous sommes heureux de confirmer votre réservation du ${textDate(data.arrivalDate, data.locale)} au ${textDate(data.departureDate, data.locale)} et nous nous réjouissons de vous accueillir prochainement.`)}${stayCardHtml(data)}${paragraphs(experienceCopy[data.experienceLevel])}${paragraphs(p.booking)}${options.length ? `<div style="margin:24px 0"><strong>VOS ATTENTIONS RÉSERVÉES</strong><ul>${options.map((item) => `<li>${e(item)}</li>`).join("")}</ul></div>` : ""}${paragraphs(conditionalCopy(data).join("\n\n"))}${paragraphs("Les informations détaillées concernant l’accès à la maison vous seront transmises avant votre arrivée.\n\nD’ici là, nous restons naturellement à votre disposition pour toute question ou demande particulière.\n\nMerci pour votre confiance.\n\nAvec toute notre sympathie,")}<p style="font:italic 18px Georgia,serif">${e(p.shortName)}<br>${e(p.editorial)}</p>`;
    return {
      type,
      subject,
      preheader: `Votre séjour à ${p.name} est confirmé`,
      text,
      html: htmlShell(data, subject, `Votre séjour à ${p.name}`, body),
      idempotencyKey,
    };
  }
  if (type === "departure") {
    const subject = "À bientôt… et merci pour votre séjour 🌊";
    const island = data.propertyId === "nid-d-ete" ? "l’Île d’Oléron" : "l’Île de Ré";
    const propertyClosing =
      data.propertyId === "chai-des-tortues"
        ? "Nous espérons que vous garderez un beau souvenir de l’atmosphère chaleureuse du Chai des Tortues et de vos moments passés à Rivedoux-Plage."
        : data.propertyId === "villa-raie-manta"
          ? "Nous espérons que les levers de soleil, la lumière et la vue sur l’océan resteront parmi vos plus beaux souvenirs de l’Île de Ré."
          : "Nous espérons que vous conserverez un merveilleux souvenir de vos promenades sur la plage des Saumonards, de Fort Boyard et du calme de La Maison Heureuse.";
    const cards = [
      {
        title: "⏰ Heure de départ",
        copy: "Le départ est prévu demain avant 10 h.\n\nSi vous pensez partir plus tôt ou si un imprévu survient, un simple message nous permettra d’organiser au mieux la préparation de la maison.",
      },
      {
        title: "🍽 Avant votre départ",
        copy: "✓ Nous envoyer un petit message lorsque vous quittez le logement.\n✓ Laisser la cuisine propre en portant une attention particulière au plan de travail et aux appareils électroménagers.\n✓ Vider le lave-vaisselle et ranger la vaisselle propre.\n✓ Déposer les déchets dans les conteneurs prévus à cet effet.\n✓ Déposer les bouteilles et bocaux en verre dans les conteneurs à verre du village.\n\nLes emplacements sont indiqués dans le livret d’accueil.",
      },
      ...(data.selectedOptions.linenPackage
        ? [
            {
              title: "🧺 Forfait linge",
              copy: "Nous vous remercions de retirer les draps, les serviettes de toilette ainsi que le linge fourni, puis de les déposer à l’endroit indiqué dans le logement.",
            },
          ]
        : []),
      ...(data.propertyId === "villa-raie-manta"
        ? [
            {
              title: "🔥 Barbecue",
              copy: "Si vous avez utilisé le barbecue durant votre séjour, nous vous remercions de nettoyer la grille et de vider entièrement les cendres avant votre départ afin qu’il soit prêt à accueillir les prochains voyageurs.",
            },
          ]
        : []),
      {
        title: "🚪 Avant de quitter la maison",
        copy: "✓ Fermer les fenêtres.\n✓ Éteindre les lumières.\n✓ Fermer la porte d’entrée à clé.\n✓ Remettre les clés dans la boîte à clés.",
      },
      {
        title: "💙 Votre avis compte énormément",
        copy: "Nous espérons sincèrement que vous vous êtes senti ici comme chez vous.\n\nSi votre séjour vous a plu, quelques minutes suffisent pour partager votre expérience. Vos commentaires permettent à de futurs voyageurs de réserver en toute confiance et nous encouragent à continuer d’offrir la meilleure expérience possible.\n\nSi, selon vous, notre accueil, la qualité de la maison et notre disponibilité méritent cinq étoiles, nous vous serions très reconnaissants de nous attribuer cette note.\n\nNous lisons également avec beaucoup d’attention les commentaires privés. Toutes vos remarques nous permettent de continuer à améliorer l’expérience Beaux Rivages.",
      },
      {
        title: "🤍 Merci",
        copy: `Merci d’avoir choisi Beaux Rivages pour vos vacances.\n\nCe fut un véritable plaisir de vous accueillir. Nous espérons avoir l’occasion de vous recevoir à nouveau, que ce soit dans cette maison ou dans l’une de nos autres maisons Beaux Rivages.\n\nLes portes de Beaux Rivages vous seront toujours ouvertes.\n\n${propertyClosing}${data.pets ? "\n\n🐾\nNous espérons que votre compagnon à quatre pattes a lui aussi apprécié son séjour.\nMerci de votre confiance." : ""}${data.selectedOptions.personalizedArrival ? "\n\nNous avons été ravis de pouvoir vous accueillir personnellement et espérons que cette attention aura contribué à rendre votre séjour encore plus agréable." : ""}\n\nTrès belle route et à bientôt.`,
      },
    ];
    const intro = `Bonjour ${data.guestFirstName},\n\nNous espérons que vous avez passé un merveilleux séjour à ${p.name} et que vous avez pleinement profité de votre escapade sur ${island}.\n\nLe moment du départ approche déjà…\n\nNous espérons que cette parenthèse au bord de l’océan vous aura permis de créer de beaux souvenirs en famille, entre amis ou en couple.\n\nAfin de préparer la maison dans les meilleures conditions pour les prochains voyageurs, nous vous remercions de consacrer quelques instants aux quelques gestes ci-dessous.`;
    const text = `${intro}\n\n${cards.map((card) => `${card.title}\n${card.copy}`).join("\n\n")}\n\nStéphanie & Bruno\nVos hôtes Beaux Rivages`;
    const htmlCards = cards
      .map(
        (card) =>
          `<div style="margin:18px 0;padding:22px;border:1px solid #e1dbce;border-radius:2px;background:#fff"><h2 style="margin:0 0 14px;font:400 23px Georgia,serif">${e(card.title)}</h2>${paragraphs(card.copy)}</div>`,
      )
      .join("");
    const body = `<h1 style="font:400 34px Georgia,serif">${e(subject)}</h1>${paragraphs(intro.replace(`Bonjour ${data.guestFirstName},\n\n`, `Bonjour ${data.guestFirstName},\n\n`))}${htmlCards}`;
    return {
      type,
      subject,
      preheader: `Quelques repères avant votre départ de ${p.name}`,
      text,
      html: htmlShell(data, subject, `Votre départ de ${p.name}`, body),
      idempotencyKey,
    };
  }
  if (!secrets) throw new Error("ARRIVAL_SECRETS_REQUIRED");
  const subject =
    data.propertyId === "chai-des-tortues"
      ? "Bienvenue au Chai des Tortues 🌊🐢"
      : data.propertyId === "villa-raie-manta"
        ? "Bienvenue à la Villa Raie Manta ✨🌊"
        : "Bienvenue au Nid d’Été, à La Maison Heureuse 🌊☀️";
  const intro = `Votre arrivée approche à grands pas et nous sommes très heureux de vous accueillir prochainement ${data.propertyId === "nid-d-ete" ? "au Nid d’Été" : `à ${p.name}`}.\n\nNous avons préparé la maison avec soin afin que votre installation se déroule en toute simplicité et sérénité.`;
  const practical = arrivalPractical(data, secrets);
  const text = `Bonjour ${data.guestFirstName},\n\n${intro}\n\nVOTRE SÉJOUR\n${cardText(data)}\n\nADRESSE ET INFORMATIONS PRATIQUES\n${practical}${data.propertyId === "nid-d-ete" ? nidArrivalGuideText() : ""}\n\n${conditionalCopy(data).join("\n\n")}\n\nBESOIN D’AIDE\nStéphanie · 06 17 26 00 94${data.propertyId === "nid-d-ete" ? "\nMarion Têteart · +33 6 81 02 46 02" : ""}\n\nNous vous souhaitons une excellente route, une arrivée en toute sérénité et un merveilleux séjour.\n\nStéphanie et Bruno\nVos hôtes Beaux Rivages`;
  const body = `<p>Bonjour ${e(data.guestFirstName)},</p><h1 style="font:400 34px Georgia,serif">${e(subject)}</h1>${paragraphs(intro)}${stayCardHtml(data)}${paragraphs(practical)}${data.propertyId === "nid-d-ete" ? nidArrivalGuideHtml() : ""}${paragraphs(conditionalCopy(data).join("\n\n"))}${paragraphs(`BESOIN D’AIDE\nStéphanie · 06 17 26 00 94${data.propertyId === "nid-d-ete" ? "\nMarion Têteart · +33 6 81 02 46 02" : ""}\n\nNous vous souhaitons une excellente route, une arrivée en toute sérénité et un merveilleux séjour.`)}`;
  return {
    type,
    subject,
    preheader: `Toutes les informations pour votre arrivée à ${p.name}`,
    text,
    html: htmlShell(data, subject, `Votre arrivée à ${p.name}`, body),
    idempotencyKey,
  };
}
