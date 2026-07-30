"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

type Locale = "fr" | "en" | "de" | "es";
type Catalog = {
  categories: { id: string; code: string; label: string; description: string }[];
  experiences: {
    id: string;
    categoryId: string;
    code: string;
    title: string;
    description: string;
    inclusions: string[];
    priceCents: number;
    pricingUnit: string;
    requiresConfirmation: boolean;
  }[];
};

const ui = {
  fr: {
    sections: [
      "Accueil",
      "Expériences",
      "Services",
      "Paniers gourmands",
      "Bien-être",
      "Famille",
      "Animaux",
      "Mobilité",
      "Demandes spéciales",
      "Mon panier",
      "Historique",
    ],
    loading: "Préparation de vos expériences…",
    unavailable: "Le catalogue est momentanément indisponible.",
    welcomeEyebrow: "Quelques attentions, choisies pour vous",
    welcomeTitle: "Composez un séjour qui vous ressemble.",
    welcomeCopy:
      "Chaque expérience est préparée avec soin par Stéphanie, Bruno et leurs partenaires locaux.",
    historyTitle: "Retrouvez vos demandes confirmées.",
    historyCopy:
      "Votre historique détaillé est associé à votre réservation et apparaît dans votre Carnet Beaux Rivages. Pour préserver vos données, il n’est jamais stocké dans ce navigateur.",
    available: "Disponible",
    confirmation: "Selon disponibilité",
    onRequest: "Sur demande",
    add: "Ajouter à mon séjour",
    added: "Ajouté",
    suggestion: "Suggestion personnalisée",
    suggestionTitle: "Une attention juste, jamais superflue.",
    suggestionCopy:
      "En couple, découvrez l’Escapade Romance. Avec un bébé, privilégiez l’équipement famille. Avec votre chien, l’accueil animal rassemble gamelles, balades et plages autorisées. Pour un séjour plus long, un panier gourmand accompagne les premiers instants.",
    reference: "Référence de réservation",
    bookingEmail: "E-mail de la réservation",
    cartTitle: "Les expériences de votre séjour",
    quantity: "Quantité",
    remove: "Retirer",
    estimatedTotal: "Total estimé",
    privilege: "Code privilège",
    note: "Un mot pour nous",
    send: "Envoyer ma demande",
    empty: "Votre sélection est encore vide.",
    sent: "Votre demande est transmise. Stéphanie vous confirmera chaque expérience avant le paiement.",
    failed: "Demande impossible.",
    specialEyebrow: "Une attention imaginée pour vous",
    specialTitle: "Parlez-nous de votre projet.",
    occasion: "Occasion",
    request: "Votre demande",
    allergies: "Allergies éventuelles",
    diet: "Régime alimentaire",
    entrust: "Confier ma demande",
    specialSent: "Votre demande a bien été transmise à Stéphanie et Bruno.",
    occasions: [
      "Anniversaire",
      "Mariage",
      "Demande en mariage",
      "Bébé",
      "Surprise",
      "Allergies",
      "Régime alimentaire",
      "Autre",
    ],
  },
  en: {
    sections: [
      "Home",
      "Experiences",
      "Services",
      "Gourmet baskets",
      "Wellness",
      "Family",
      "Pets",
      "Mobility",
      "Special requests",
      "My basket",
      "History",
    ],
    loading: "Preparing your experiences…",
    unavailable: "The catalogue is temporarily unavailable.",
    welcomeEyebrow: "Thoughtful touches, chosen for you",
    welcomeTitle: "Create a stay that feels like you.",
    welcomeCopy:
      "Every experience is carefully prepared by Stéphanie, Bruno and their local partners.",
    historyTitle: "Find your confirmed requests.",
    historyCopy:
      "Your detailed history is linked to your booking and appears in your Beaux Rivages Guide. To protect your data, it is never stored in this browser.",
    available: "Available",
    confirmation: "Subject to availability",
    onRequest: "On request",
    add: "Add to my stay",
    added: "Added",
    suggestion: "Personalised suggestion",
    suggestionTitle: "A thoughtful touch, never an unnecessary extra.",
    suggestionCopy:
      "For couples, discover the Romance Escape. Travelling with a baby? Choose the family equipment. With your dog, the pet welcome includes bowls, walking ideas and permitted beaches. For longer stays, a gourmet basket makes arrival easier.",
    reference: "Booking reference",
    bookingEmail: "Booking email",
    cartTitle: "Experiences for your stay",
    quantity: "Quantity",
    remove: "Remove",
    estimatedTotal: "Estimated total",
    privilege: "Privilege code",
    note: "A note for us",
    send: "Send my request",
    empty: "Your selection is still empty.",
    sent: "Your request has been sent. Stéphanie will confirm every experience before payment.",
    failed: "The request could not be sent.",
    specialEyebrow: "A personal touch designed for you",
    specialTitle: "Tell us about your plans.",
    occasion: "Occasion",
    request: "Your request",
    allergies: "Any allergies",
    diet: "Dietary requirements",
    entrust: "Send my request",
    specialSent: "Your request has been sent to Stéphanie and Bruno.",
    occasions: [
      "Birthday",
      "Wedding",
      "Marriage proposal",
      "Baby",
      "Surprise",
      "Allergies",
      "Dietary requirements",
      "Other",
    ],
  },
  de: {
    sections: [
      "Start",
      "Erlebnisse",
      "Services",
      "Genusskörbe",
      "Wohlbefinden",
      "Familie",
      "Haustiere",
      "Mobilität",
      "Besondere Wünsche",
      "Mein Warenkorb",
      "Verlauf",
    ],
    loading: "Ihre Erlebnisse werden vorbereitet…",
    unavailable: "Der Katalog ist vorübergehend nicht verfügbar.",
    welcomeEyebrow: "Aufmerksamkeiten, die zu Ihnen passen",
    welcomeTitle: "Gestalten Sie Ihren persönlichen Aufenthalt.",
    welcomeCopy:
      "Jedes Erlebnis wird von Stéphanie, Bruno und ihren lokalen Partnern sorgfältig vorbereitet.",
    historyTitle: "Ihre bestätigten Wünsche.",
    historyCopy:
      "Der Verlauf ist mit Ihrer Buchung verknüpft und erscheint in Ihrem Beaux Rivages Reiseführer. Zum Schutz Ihrer Daten wird er nie in diesem Browser gespeichert.",
    available: "Verfügbar",
    confirmation: "Je nach Verfügbarkeit",
    onRequest: "Auf Anfrage",
    add: "Zu meinem Aufenthalt hinzufügen",
    added: "Hinzugefügt",
    suggestion: "Persönliche Empfehlung",
    suggestionTitle: "Eine passende Aufmerksamkeit – nie überflüssig.",
    suggestionCopy:
      "Für Paare empfehlen wir die romantische Auszeit. Mit Baby erleichtert die Familienausstattung die Reise. Für Ihren Hund umfasst der Tierempfang Näpfe, Spazierideen und erlaubte Strände. Bei längeren Aufenthalten begleitet ein Genusskorb die ersten Momente.",
    reference: "Buchungsnummer",
    bookingEmail: "E-Mail der Buchung",
    cartTitle: "Erlebnisse für Ihren Aufenthalt",
    quantity: "Menge",
    remove: "Entfernen",
    estimatedTotal: "Voraussichtlicher Gesamtpreis",
    privilege: "Vorteilscode",
    note: "Ihre Nachricht",
    send: "Anfrage senden",
    empty: "Ihre Auswahl ist noch leer.",
    sent: "Ihre Anfrage wurde gesendet. Stéphanie bestätigt jedes Erlebnis vor der Zahlung.",
    failed: "Die Anfrage konnte nicht gesendet werden.",
    specialEyebrow: "Eine persönliche Aufmerksamkeit für Sie",
    specialTitle: "Erzählen Sie uns von Ihrem Wunsch.",
    occasion: "Anlass",
    request: "Ihr Wunsch",
    allergies: "Mögliche Allergien",
    diet: "Ernährungswünsche",
    entrust: "Anfrage senden",
    specialSent: "Ihre Anfrage wurde an Stéphanie und Bruno gesendet.",
    occasions: [
      "Geburtstag",
      "Hochzeit",
      "Heiratsantrag",
      "Baby",
      "Überraschung",
      "Allergien",
      "Ernährungswünsche",
      "Sonstiges",
    ],
  },
  es: {
    sections: [
      "Inicio",
      "Experiencias",
      "Servicios",
      "Cestas gourmet",
      "Bienestar",
      "Familia",
      "Mascotas",
      "Movilidad",
      "Peticiones especiales",
      "Mi cesta",
      "Historial",
    ],
    loading: "Preparando sus experiencias…",
    unavailable: "El catálogo no está disponible temporalmente.",
    welcomeEyebrow: "Detalles pensados para usted",
    welcomeTitle: "Cree una estancia a su medida.",
    welcomeCopy:
      "Stéphanie, Bruno y sus colaboradores locales preparan cada experiencia con esmero.",
    historyTitle: "Consulte sus solicitudes confirmadas.",
    historyCopy:
      "Su historial está vinculado a la reserva y aparece en su Guía Beaux Rivages. Para proteger sus datos, nunca se guarda en este navegador.",
    available: "Disponible",
    confirmation: "Sujeto a disponibilidad",
    onRequest: "Bajo petición",
    add: "Añadir a mi estancia",
    added: "Añadido",
    suggestion: "Sugerencia personalizada",
    suggestionTitle: "Un detalle acertado, nunca superfluo.",
    suggestionCopy:
      "Para parejas, descubra la Escapada Romántica. Si viaja con un bebé, elija el equipamiento familiar. Para su perro, la bienvenida incluye cuencos, paseos y playas autorizadas. En estancias largas, una cesta gourmet acompaña los primeros momentos.",
    reference: "Referencia de la reserva",
    bookingEmail: "Correo electrónico de la reserva",
    cartTitle: "Experiencias para su estancia",
    quantity: "Cantidad",
    remove: "Quitar",
    estimatedTotal: "Total estimado",
    privilege: "Código de ventaja",
    note: "Un mensaje para nosotros",
    send: "Enviar mi solicitud",
    empty: "Su selección todavía está vacía.",
    sent: "Su solicitud ha sido enviada. Stéphanie confirmará cada experiencia antes del pago.",
    failed: "No se ha podido enviar la solicitud.",
    specialEyebrow: "Un detalle personal pensado para usted",
    specialTitle: "Cuéntenos su proyecto.",
    occasion: "Ocasión",
    request: "Su solicitud",
    allergies: "Posibles alergias",
    diet: "Necesidades alimentarias",
    entrust: "Enviar mi solicitud",
    specialSent: "Su solicitud ha sido enviada a Stéphanie y Bruno.",
    occasions: [
      "Cumpleaños",
      "Boda",
      "Petición de matrimonio",
      "Bebé",
      "Sorpresa",
      "Alergias",
      "Necesidades alimentarias",
      "Otro",
    ],
  },
} satisfies Record<Locale, Record<string, string | string[]>>;

const sectionIds = [
  "home",
  "experiences",
  "services",
  "gourmet",
  "wellness",
  "family",
  "pets",
  "mobility",
  "special",
  "cart",
  "history",
];
const experienceEs: Record<string, { title: string; description: string; inclusions: string[] }> = {
  signature: {
    title: "Pack Signature Beaux Rivages",
    description: "La estancia preparada hasta el último detalle.",
    inclusions: [
      "Ropa de casa completa",
      "Toallas de playa",
      "Dos albornoces",
      "Llegada anticipada si está disponible",
      "Regalo de bienvenida",
      "Cesta a elegir",
      "Detalle personalizado",
    ],
  },
  romance: {
    title: "Escapada Romántica",
    description: "Un ambiente delicado preparado para dos.",
    inclusions: [
      "Velas LED",
      "Pétalos",
      "Bombones",
      "Tarjeta personalizada",
      "Albornoces",
      "Aceite de masaje",
      "Salida tardía según disponibilidad",
    ],
  },
  "basket-aperitif": {
    title: "Cesta de aperitivo",
    description: "Sabores locales para compartir a su llegada.",
    inclusions: ["Productos locales", "Bebida sin alcohol", "Aperitivos salados"],
  },
  "basket-breakfast": {
    title: "Cesta de desayuno",
    description: "Un primer despertar lleno de dulzura.",
    inclusions: ["Bollería", "Mermelada local", "Zumo", "Bebida caliente"],
  },
  linen: {
    title: "Ropa de casa completa",
    description: "Camas preparadas y ropa de baño.",
    inclusions: ["Sábanas", "Toallas", "Camas preparadas"],
  },
  "early-checkin": {
    title: "Llegada anticipada",
    description: "Disfrute de la casa un poco antes, según disponibilidad.",
    inclusions: [],
  },
  "late-checkout": {
    title: "Salida tardía",
    description: "Prolongue los últimos momentos, según disponibilidad.",
    inclusions: [],
  },
  "baby-kit": {
    title: "Equipamiento para bebé",
    description: "Viaje más ligero con lo esencial para el bebé.",
    inclusions: ["Cuna", "Trona", "Vajilla infantil"],
  },
  "pet-welcome": {
    title: "Bienvenida para mascotas",
    description: "Cuencos, ideas de paseos y playas autorizadas.",
    inclusions: ["Cuencos", "Guía de paseos", "Consejos sobre playas"],
  },
  bikes: {
    title: "Bicicletas entregadas en casa",
    description: "Alquiler y entrega por un colaborador local.",
    inclusions: ["Entrega", "Candado", "Consejos de rutas"],
  },
  massage: {
    title: "Masaje a domicilio",
    description: "Un momento de bienestar con un colaborador seleccionado.",
    inclusions: [],
  },
  "oyster-tasting": {
    title: "Degustación de ostras",
    description: "Un encuentro gastronómico con un productor local.",
    inclusions: [],
  },
};
const experienceDe: Record<string, { title: string; description: string; inclusions: string[] }> = {
  signature: {
    title: "Beaux Rivages Signature-Paket",
    description: "Ein Aufenthalt, der bis ins kleinste Detail vorbereitet ist.",
    inclusions: [
      "Komplettes Wäschepaket",
      "Strandtücher",
      "Zwei Bademäntel",
      "Frühe Anreise nach Verfügbarkeit",
      "Willkommensgeschenk",
      "Korb nach Wahl",
      "Persönliche Aufmerksamkeit",
    ],
  },
  romance: {
    title: "Romantische Auszeit",
    description: "Eine stimmungsvolle Atmosphäre für zwei.",
    inclusions: [
      "LED-Kerzen",
      "Blütenblätter",
      "Pralinen",
      "Persönliche Karte",
      "Bademäntel",
      "Massageöl",
      "Späte Abreise nach Verfügbarkeit",
    ],
  },
  "basket-aperitif": {
    title: "Aperitifkorb",
    description: "Lokale Spezialitäten zum Teilen bei Ihrer Ankunft.",
    inclusions: ["Lokale Produkte", "Alkoholfreies Getränk", "Salziges Gebäck"],
  },
  "basket-breakfast": {
    title: "Frühstückskorb",
    description: "Ein genussvoller erster Morgen.",
    inclusions: ["Französisches Gebäck", "Lokale Konfitüre", "Saft", "Heißgetränk"],
  },
  linen: {
    title: "Komplettes Wäschepaket",
    description: "Bezogene Betten und Handtücher.",
    inclusions: ["Bettwäsche", "Handtücher", "Bezogene Betten"],
  },
  "early-checkin": {
    title: "Früher Check-in",
    description: "Genießen Sie das Haus nach Verfügbarkeit etwas früher.",
    inclusions: [],
  },
  "late-checkout": {
    title: "Später Check-out",
    description: "Verlängern Sie die letzten Urlaubsmomente nach Verfügbarkeit.",
    inclusions: [],
  },
  "baby-kit": {
    title: "Babyausstattung",
    description: "Reisen Sie leichter mit allem Wichtigen für Ihr Baby.",
    inclusions: ["Babybett", "Hochstuhl", "Kindergeschirr"],
  },
  "pet-welcome": {
    title: "Willkommen für Haustiere",
    description: "Näpfe, Spazierideen und Hinweise zu erlaubten Stränden.",
    inclusions: ["Näpfe", "Spazierführer", "Strandhinweise"],
  },
  bikes: {
    title: "Fahrradlieferung zum Haus",
    description: "Miete und Lieferung durch einen lokalen Partner.",
    inclusions: ["Lieferung", "Schloss", "Routentipps"],
  },
  massage: {
    title: "Massage im Haus",
    description: "Entspannung mit einem ausgewählten Partner.",
    inclusions: [],
  },
  "oyster-tasting": {
    title: "Austernverkostung",
    description: "Eine kulinarische Begegnung mit einem lokalen Produzenten.",
    inclusions: [],
  },
};

function pageLocale(pathname: string): Locale {
  const candidate = pathname.split("/")[1];
  return candidate === "en" || candidate === "de" || candidate === "es" ? candidate : "fr";
}

function serverLocale(locale: Locale): Exclude<Locale, "es"> {
  return locale === "es" ? "fr" : locale;
}

function localizeCatalog(catalog: Catalog, locale: Locale): Catalog {
  if (locale !== "es" && locale !== "de") return catalog;
  const categoryLabels: Record<string, string> =
    locale === "es"
      ? {
          signature: "Experiencias",
          services: "Servicios",
          gourmet: "Cestas gourmet",
          wellness: "Bienestar",
          family: "Familia",
          pets: "Mascotas",
          mobility: "Movilidad",
          activities: "Descubrimientos",
        }
      : {
          signature: "Erlebnisse",
          services: "Services",
          gourmet: "Genusskörbe",
          wellness: "Wohlbefinden",
          family: "Familie",
          pets: "Haustiere",
          mobility: "Mobilität",
          activities: "Entdeckungen",
        };
  return {
    categories: catalog.categories.map((category) => ({
      ...category,
      label: categoryLabels[category.code] ?? category.label,
    })),
    experiences: catalog.experiences.map((experience) => ({
      ...experience,
      ...((locale === "es" ? experienceEs : experienceDe)[experience.code] ?? {}),
    })),
  };
}

const money = (cents: number, locale: Locale) =>
  new Intl.NumberFormat(
    locale === "fr" ? "fr-FR" : locale === "de" ? "de-DE" : locale === "es" ? "es-ES" : "en-GB",
    {
      style: "currency",
      currency: "EUR",
    },
  ).format(cents / 100);

export function ConciergePremium() {
  const pathname = usePathname();
  const routeLocale = pageLocale(pathname);
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [active, setActive] = useState("home");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [message, setMessage] = useState("");
  const [locale, setLocale] = useState<Locale>(routeLocale);
  const copy = ui[locale];

  useEffect(() => setLocale(routeLocale), [routeLocale]);
  useEffect(() => {
    setCatalog(null);
    fetch(`/api/concierge?locale=${serverLocale(locale)}`)
      .then((response) => {
        if (!response.ok) throw new Error("CATALOG_UNAVAILABLE");
        return response.json() as Promise<Catalog>;
      })
      .then((result) => setCatalog(localizeCatalog(result, locale)))
      .catch(() => setMessage(String(copy.unavailable)));
  }, [copy.unavailable, locale]);

  const items = useMemo(
    () => catalog?.experiences.filter((item) => cart[item.id]) ?? [],
    [catalog, cart],
  );
  const total = items.reduce((sum, item) => sum + item.priceCents * cart[item.id], 0);
  const recommendations = useMemo(
    () =>
      catalog?.experiences.filter((item) =>
        ["romance", "baby-kit", "pet-welcome", "basket-aperitif"].includes(item.code),
      ) ?? [],
    [catalog],
  );
  const add = (id: string) => setCart((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 }));

  if (!catalog)
    return (
      <section className="shell concierge-premium-loading">
        <p>{message || copy.loading}</p>
      </section>
    );
  const visible =
    active === "experiences"
      ? catalog.experiences
      : catalog.experiences.filter(
          (item) =>
            catalog.categories.find((category) => category.id === item.categoryId)?.code === active,
        );

  return (
    <section className="concierge-premium shell" data-no-translate>
      <div className="concierge-premium__toolbar">
        <nav aria-label={String(copy.welcomeTitle)}>
          {sectionIds.map((id, index) => (
            <button
              type="button"
              key={id}
              aria-current={active === id ? "page" : undefined}
              onClick={() => setActive(id)}
            >
              {copy.sections[index]}
              {id === "cart" && items.length ? ` (${items.length})` : ""}
            </button>
          ))}
        </nav>
        <select
          aria-label="Language"
          value={locale}
          onChange={(event) => setLocale(event.target.value as Locale)}
        >
          <option value="fr">FR</option>
          <option value="en">EN</option>
          <option value="de">DE</option>
          <option value="es">ES</option>
        </select>
      </div>
      {active === "home" && (
        <>
          <div className="concierge-welcome">
            <p className="eyebrow">{copy.welcomeEyebrow}</p>
            <h2>{copy.welcomeTitle}</h2>
            <p>{copy.welcomeCopy}</p>
          </div>
          <div className="concierge-recommendations">
            {recommendations.map((item) => (
              <ExperienceCard
                key={item.id}
                item={item}
                quantity={cart[item.id] ?? 0}
                add={add}
                locale={locale}
              />
            ))}
          </div>
          <RecommendationNote locale={locale} />
        </>
      )}
      {!["home", "special", "cart", "history"].includes(active) && (
        <div className="concierge-catalog">
          {visible.map((item) => (
            <ExperienceCard
              key={item.id}
              item={item}
              quantity={cart[item.id] ?? 0}
              add={add}
              locale={locale}
            />
          ))}
        </div>
      )}
      {active === "special" && (
        <SpecialRequest locale={locale} message={message} setMessage={setMessage} />
      )}
      {active === "cart" && (
        <Cart
          locale={locale}
          catalog={catalog}
          cart={cart}
          setCart={setCart}
          total={total}
          message={message}
          setMessage={setMessage}
        />
      )}
      {active === "history" && (
        <div className="concierge-welcome">
          <p className="eyebrow">{copy.sections[10]}</p>
          <h2>{copy.historyTitle}</h2>
          <p>{copy.historyCopy}</p>
        </div>
      )}
    </section>
  );
}

function ExperienceCard({
  item,
  quantity,
  add,
  locale,
}: {
  item: Catalog["experiences"][number];
  quantity: number;
  add: (id: string) => void;
  locale: Locale;
}) {
  const copy = ui[locale];
  return (
    <article className={`concierge-experience concierge-experience--${item.code}`}>
      <span>{item.requiresConfirmation ? copy.confirmation : copy.available}</span>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      {item.inclusions.length > 0 && (
        <ul>
          {item.inclusions.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}
      <div>
        <strong>{item.priceCents ? money(item.priceCents, locale) : copy.onRequest}</strong>
        <button type="button" onClick={() => add(item.id)}>
          {quantity ? `${copy.added} · ${quantity}` : copy.add}
        </button>
      </div>
    </article>
  );
}

function RecommendationNote({ locale }: { locale: Locale }) {
  const copy = ui[locale];
  return (
    <aside className="concierge-ai">
      <p className="eyebrow">{copy.suggestion}</p>
      <h3>{copy.suggestionTitle}</h3>
      <p>{copy.suggestionCopy}</p>
    </aside>
  );
}

function IdentityFields({ locale }: { locale: Locale }) {
  const copy = ui[locale];
  return (
    <>
      <label>
        {copy.reference}
        <input name="reservationReference" required placeholder="BR-2026-…" />
      </label>
      <label>
        {copy.bookingEmail}
        <input name="email" type="email" required />
      </label>
    </>
  );
}

function Cart({
  locale,
  catalog,
  cart,
  setCart,
  total,
  message,
  setMessage,
}: {
  locale: Locale;
  catalog: Catalog;
  cart: Record<string, number>;
  setCart: (value: Record<string, number>) => void;
  total: number;
  message: string;
  setMessage: (value: string) => void;
}) {
  const copy = ui[locale];
  const chosen = catalog.experiences.filter((item) => cart[item.id]);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/concierge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "order",
        reservationReference: form.get("reservationReference"),
        email: form.get("email"),
        locale: serverLocale(locale),
        promotionCode: form.get("promotionCode") || undefined,
        message: form.get("message") || undefined,
        items: chosen.map((item) => ({ experienceId: item.id, quantity: cart[item.id] })),
      }),
    });
    const body = (await response.json()) as { error?: string };
    setMessage(response.ok ? String(copy.sent) : (body.error ?? String(copy.failed)));
    if (response.ok) setCart({});
  };
  return (
    <div className="concierge-cart">
      <h2>{copy.cartTitle}</h2>
      {chosen.length ? (
        <>
          {chosen.map((item) => (
            <div key={item.id}>
              <div>
                <strong>{item.title}</strong>
                <span>
                  {money(item.priceCents, locale)} × {cart[item.id]}
                </span>
              </div>
              <input
                aria-label={`${copy.quantity} ${item.title}`}
                type="number"
                min="1"
                max="30"
                value={cart[item.id]}
                onChange={(event) => setCart({ ...cart, [item.id]: Number(event.target.value) })}
              />
              <button
                type="button"
                onClick={() => {
                  const next = { ...cart };
                  delete next[item.id];
                  setCart(next);
                }}
              >
                {copy.remove}
              </button>
            </div>
          ))}
          <strong className="concierge-cart__total">
            {copy.estimatedTotal} · {money(total, locale)}
          </strong>
          <form onSubmit={submit}>
            <IdentityFields locale={locale} />
            <label>
              {copy.privilege}
              <input name="promotionCode" />
            </label>
            <label>
              {copy.note}
              <textarea name="message" rows={3} />
            </label>
            <button>{copy.send}</button>
          </form>
        </>
      ) : (
        <p>{copy.empty}</p>
      )}
      <p role="status">{message}</p>
    </div>
  );
}

function SpecialRequest({
  locale,
  message,
  setMessage,
}: {
  locale: Locale;
  message: string;
  setMessage: (value: string) => void;
}) {
  const copy = ui[locale];
  const occasionValues = [
    "birthday",
    "wedding",
    "proposal",
    "baby",
    "surprise",
    "allergies",
    "diet",
    "other",
  ];
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/concierge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "special_request",
        reservationReference: form.get("reservationReference"),
        email: form.get("email"),
        occasion: form.get("occasion"),
        details: form.get("details"),
        allergies: form.get("allergies") || undefined,
        dietaryRequirements: form.get("diet") || undefined,
      }),
    });
    const body = (await response.json()) as { error?: string };
    setMessage(response.ok ? String(copy.specialSent) : (body.error ?? String(copy.failed)));
  };
  return (
    <form className="concierge-special" onSubmit={submit}>
      <p className="eyebrow">{copy.specialEyebrow}</p>
      <h2>{copy.specialTitle}</h2>
      <IdentityFields locale={locale} />
      <label>
        {copy.occasion}
        <select name="occasion">
          {occasionValues.map((value, index) => (
            <option value={value} key={value}>
              {copy.occasions[index]}
            </option>
          ))}
        </select>
      </label>
      <label>
        {copy.request}
        <textarea name="details" minLength={5} rows={5} required />
      </label>
      <label>
        {copy.allergies}
        <input name="allergies" />
      </label>
      <label>
        {copy.diet}
        <input name="diet" />
      </label>
      <button>{copy.entrust}</button>
      <p role="status">{message}</p>
    </form>
  );
}
