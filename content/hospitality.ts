import type { SupportedLocale } from "@/i18n/config";
import type { PropertySlug } from "@/platform/calendar/config";

export const cleaningFees: Record<PropertySlug, number> = {
  "chai-des-tortues": 125,
  "villa-raie-manta": 135,
  "nid-d-ete": 85,
};

export const hospitalityCopy: Record<
  SupportedLocale,
  { title: string; linen: string; essentials: string; cleaning: string }
> = {
  fr: {
    title: "Le linge, à votre convenance",
    linen:
      "Pour un séjour à votre image, vous êtes libres d’apporter votre linge ou de choisir notre forfait complet à 15 € par personne et par séjour, sur demande. Il comprend le linge de lit, les lits préparés selon les couchages convenus, les serviettes de toilette, les tapis de bain, les torchons, les essuie-mains et une éponge. Merci de préciser votre choix avant l’arrivée. Le linge du lit bébé reste à apporter. Les conditions des réservations déjà confirmées restent applicables.",
    essentials:
      "Du papier toilette, du gel douche et du shampoing sont à votre disposition à l’arrivée.",
    cleaning: "Ménage de fin de séjour",
  },
  en: {
    title: "Linen, as you prefer",
    linen:
      "You are welcome to bring your own linen or choose our complete linen package, available on request for €15 per person per stay. It includes bed linen, beds made up for the agreed sleeping arrangements, towels, bath mats, tea towels, kitchen hand towels and a sponge. Please let us know your preference before arrival. Please bring bedding for the travel cot. The terms of bookings already confirmed continue to apply.",
    essentials: "Toilet paper, shower gel and shampoo are provided on arrival.",
    cleaning: "End-of-stay cleaning",
  },
  de: {
    title: "Wäsche ganz nach Ihren Wünschen",
    linen:
      "Sie können eigene Wäsche mitbringen oder auf Anfrage unser komplettes Wäschepaket für 15 € pro Person und Aufenthalt wählen. Es umfasst Bettwäsche, nach Absprache bezogene Betten, Handtücher, Badematten, Geschirrtücher, Küchenhandtücher und einen Schwamm. Bitte teilen Sie uns Ihre Wahl vor der Anreise mit. Bettwäsche für das Reisebett bringen Sie bitte selbst mit. Für bereits bestätigte Buchungen gelten die vereinbarten Bedingungen weiterhin.",
    essentials: "Toilettenpapier, Duschgel und Shampoo stehen Ihnen bei der Ankunft zur Verfügung.",
    cleaning: "Endreinigung",
  },
  nl: {
    title: "Linnengoed, naar uw wens",
    linen:
      "U kunt uw eigen linnengoed meenemen of op aanvraag kiezen voor ons complete linnenpakket van €15 per persoon per verblijf. Het omvat beddengoed, opgemaakte bedden volgens de afgesproken slaapplaatsen, handdoeken, badmatten, theedoeken, keukenhanddoeken en een spons. Geef uw voorkeur vóór aankomst door. Neem zelf beddengoed voor het reisbedje mee. De voorwaarden van reeds bevestigde reserveringen blijven gelden.",
    essentials: "Bij aankomst zijn toiletpapier, douchegel en shampoo beschikbaar.",
    cleaning: "Eindschoonmaak",
  },
  es: {
    title: "La ropa de casa, a su elección",
    linen:
      "Puede traer su propia ropa de casa o elegir nuestro paquete completo, disponible previa solicitud por 15 € por persona y estancia. Incluye ropa de cama, camas preparadas según lo acordado, toallas, alfombrillas de baño, paños de cocina y una esponja. Indíquenos su elección antes de llegar. La ropa de la cuna debe traerla usted. Se mantienen las condiciones de las reservas ya confirmadas.",
    essentials: "A su llegada encontrará papel higiénico, gel de ducha y champú.",
    cleaning: "Limpieza final",
  },
};
