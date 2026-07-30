import type {
  CalendarEvent,
  DashboardMetric,
  Offer,
  PropertyId,
  RateRule,
  GuestProfile,
} from "./types";

export const properties: {
  id: PropertyId;
  name: string;
  shortName: string;
  color: string;
}[] = [
  { id: "chai", name: "Le Chai des Tortues", shortName: "Le Chai", color: "#b47b55" },
  { id: "villa", name: "Villa Raie Manta", shortName: "La Villa", color: "#557f89" },
  { id: "nid", name: "Le Nid d’Été", shortName: "Le Nid", color: "#7b8d68" },
];

export const dashboardMetrics: DashboardMetric[] = [
  { label: "Arrivées aujourd’hui", value: "3", detail: "9 voyageurs attendus", tone: "positive" },
  { label: "Départs aujourd’hui", value: "2", detail: "Ménages planifiés" },
  { label: "Logements occupés", value: "2 / 3", detail: "Le Nid disponible" },
  { label: "Logements disponibles", value: "1", detail: "Réservable dès ce soir" },
  { label: "Réservations en attente", value: "4", detail: "2 à confirmer aujourd’hui", tone: "warning" },
  { label: "Paiements à recevoir", value: "3 480 €", detail: "5 échéances", tone: "warning" },
  { label: "Contrats non signés", value: "3", detail: "Relance proposée", tone: "warning" },
  { label: "Messages non lus", value: "7", detail: "2 prioritaires", tone: "danger" },
  { label: "Incidents", value: "1", detail: "Intervention prévue à 14 h", tone: "danger" },
  { label: "Revenus du mois", value: "28 640 €", detail: "+ 12 % vs. N-1", tone: "positive" },
  { label: "Taux d’occupation", value: "78 %", detail: "Objectif mensuel : 75 %", tone: "positive" },
];

export const calendarEvents: CalendarEvent[] = [
  { id: "e1", propertyId: "chai", title: "Séjour direct", guest: "Famille Martin", startsOn: "2026-08-03", endsOn: "2026-08-08", kind: "direct" },
  { id: "e2", propertyId: "villa", title: "Airbnb", guest: "Sophie Bernard", startsOn: "2026-08-01", endsOn: "2026-08-06", kind: "external" },
  { id: "e3", propertyId: "nid", title: "Ménage", startsOn: "2026-08-02", endsOn: "2026-08-02", kind: "housekeeping" },
  { id: "e4", propertyId: "nid", title: "Séjour propriétaire", startsOn: "2026-08-04", endsOn: "2026-08-07", kind: "owner" },
  { id: "e5", propertyId: "chai", title: "Maintenance", startsOn: "2026-08-09", endsOn: "2026-08-09", kind: "maintenance" },
  { id: "e6", propertyId: "villa", title: "Dates bloquées", startsOn: "2026-08-08", endsOn: "2026-08-10", kind: "blocked" },
];

export const rateRules: RateRule[] = [
  { id: "r1", propertyId: "chai", label: "Très haute saison", period: "11 juillet — 23 août", nightlyRate: 420, minimumNights: 7, closedDays: ["Dim."], status: "active" },
  { id: "r2", propertyId: "villa", label: "Été face à l’océan", period: "4 juillet — 30 août", nightlyRate: 560, minimumNights: 7, closedDays: [], status: "active" },
  { id: "r3", propertyId: "nid", label: "Vacances d’été", period: "27 juin — 30 août", nightlyRate: 235, minimumNights: 5, closedDays: [], status: "active" },
  { id: "r4", propertyId: "chai", label: "Arrière-saison", period: "31 août — 18 octobre", nightlyRate: 285, minimumNights: 3, closedDays: [], status: "draft" },
];

export const offers: Offer[] = [
  { id: "o1", label: "Séjour 7 nuits", description: "Réduction automatique dès 7 nuits", value: "− 8 %", enabled: true, kind: "promotion" },
  { id: "o2", label: "RETOUR10", description: "Code réservé aux voyageurs fidèles", value: "− 10 %", enabled: true, kind: "code" },
  { id: "o3", label: "Pack Signature", description: "Accueil, petit-déjeuner et expérience locale", value: "290 €", enabled: true, kind: "pack" },
  { id: "o4", label: "Arrivée anticipée", description: "Selon disponibilité de la maison", value: "45 €", enabled: true, kind: "service" },
  { id: "o5", label: "Départ tardif", description: "Jusqu’à 14 h selon disponibilité", value: "55 €", enabled: false, kind: "service" },
];

export const guests: GuestProfile[] = [
  {
    id: "g1", name: "Élodie & Thomas Martin", email: "elodie.martin@example.com",
    phone: "+33 6 12 34 56 78", city: "Nantes", language: "Français",
    birthday: "14 septembre", partnerBirthday: "3 février",
    tags: ["Famille", "Réservation directe", "Chien", "Fidèle"],
    preferences: ["Lit bébé", "Arrivée autonome", "Restaurants familiaux", "Plage calme"],
    pets: [{ name: "Nestor", type: "Chien", notes: "Labrador calme · panier souhaité" }],
    loyalty: { tier: "Or", stays: 4, nights: 27, value: 8640 },
    privateNotes: "Prévenir Élodie par SMS lorsque la maison est prête. Les enfants aiment les activités nautiques.",
    timeline: [
      { id: "t1", date: "30 juillet 2026", title: "Message avant arrivée", detail: "Guide du séjour envoyé · message ouvert", kind: "message" },
      { id: "t2", date: "28 juillet 2026", title: "Solde reçu", detail: "1 680 € · carte bancaire", kind: "payment" },
      { id: "t3", date: "22 juillet 2026", title: "Contrat signé", detail: "BR-2026-084 · signature électronique", kind: "contract" },
      { id: "t4", date: "20 juillet 2026", title: "Réservation confirmée", detail: "Le Chai des Tortues · 3 au 10 août", kind: "stay" },
      { id: "t5", date: "18 août 2025", title: "Facture acquittée", detail: "FA-2025-118 · 2 240 €", kind: "invoice" },
    ],
  },
  {
    id: "g2", name: "Sophie Bernard", email: "sophie.bernard@example.com",
    phone: "+33 6 98 76 54 32", city: "Lyon", language: "Français",
    birthday: "27 novembre", tags: ["Couple", "Océan", "Sans voiture"],
    preferences: ["Vue mer", "Location de vélos", "Adresses gastronomiques"],
    pets: [], loyalty: { tier: "Argent", stays: 2, nights: 12, value: 4380 },
    privateNotes: "Voyage en train. Proposer le transfert depuis La Rochelle.",
    timeline: [
      { id: "s1", date: "29 juillet 2026", title: "Question reçue", detail: "Demande sur les vélos · réponse à préparer", kind: "message" },
      { id: "s2", date: "25 juillet 2026", title: "Acompte reçu", detail: "1 314 € · carte bancaire", kind: "payment" },
      { id: "s3", date: "24 juillet 2026", title: "Séjour confirmé", detail: "Villa Raie Manta · 1 au 6 août", kind: "stay" },
    ],
  },
  {
    id: "g3", name: "Daniel & Marc Leroy", email: "daniel.leroy@example.com",
    phone: "+32 470 12 34 56", city: "Bruxelles", language: "Français",
    tags: ["Couple", "Belgique", "Gastronomie", "Fidèle"],
    preferences: ["Huîtres", "Marchés", "Départ tardif"],
    pets: [{ name: "Moka", type: "Chat", notes: "Voyage en caisse · reste en intérieur" }],
    loyalty: { tier: "Signature", stays: 7, nights: 48, value: 15780 },
    privateNotes: "Voyageurs historiques. Préparer leur bouteille habituelle et une recommandation de producteur.",
    timeline: [
      { id: "d1", date: "12 juin 2026", title: "Note privée", detail: "Souhaitent revenir pour les vendanges", kind: "note" },
      { id: "d2", date: "2 mai 2026", title: "Séjour terminé", detail: "Le Nid d’Été · 8 nuits · avis 5/5", kind: "stay" },
      { id: "d3", date: "20 avril 2026", title: "Facture acquittée", detail: "FA-2026-041 · 1 860 €", kind: "invoice" },
    ],
  },
];
