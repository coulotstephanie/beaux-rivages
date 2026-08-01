export type DashboardView =
  | "dashboard"
  | "calendrier"
  | "reservations"
  | "messages"
  | "revenue"
  | "yield"
  | "channel"
  | "housekeeping"
  | "experiences-services"
  | "carnet"
  | "livre-or"
  | "voyageurs"
  | "logements"
  | "documents"
  | "paiements"
  | "conciergerie"
  | "menage"
  | "maintenance"
  | "statistiques"
  | "pilotage"
  | "fiscalite"
  | "juridique"
  | "parametres";

export const dashboardNavigation: {
  category: string;
  items: { id: DashboardView; label: string }[];
}[] = [
  { category: "Journée", items: [{ id: "dashboard", label: "Aujourd’hui" }] },
  {
    category: "Réservations",
    items: [
      { id: "calendrier", label: "Calendrier" },
      { id: "reservations", label: "Réservations" },
      { id: "messages", label: "Messages voyageurs" },
      { id: "channel", label: "Channel Manager" },
    ],
  },
  {
    category: "Voyageurs",
    items: [
      { id: "voyageurs", label: "Voyageurs" },
      { id: "conciergerie", label: "Conciergerie" },
    ],
  },
  {
    category: "Exploitation",
    items: [
      { id: "housekeeping", label: "Housekeeping" },
      { id: "menage", label: "Ménage" },
      { id: "maintenance", label: "Maintenance" },
      { id: "logements", label: "Logements" },
    ],
  },
  {
    category: "Contenu",
    items: [
      { id: "experiences-services", label: "Expériences & Services" },
      { id: "carnet", label: "Carnet CMS" },
      { id: "livre-or", label: "Livre d’Or" },
    ],
  },
  {
    category: "Finance",
    items: [
      { id: "revenue", label: "Revenue & Marketing" },
      { id: "yield", label: "Yield Management" },
      { id: "paiements", label: "Paiements" },
      { id: "fiscalite", label: "Fiscalité" },
      { id: "statistiques", label: "Statistiques" },
    ],
  },
  {
    category: "Paramètres",
    items: [
      { id: "documents", label: "Documents" },
      { id: "pilotage", label: "Pilotage" },
      { id: "juridique", label: "Centre juridique" },
      { id: "parametres", label: "Paramètres" },
    ],
  },
];

export const dashboardViews = dashboardNavigation.flatMap((group) => group.items);

export function isDashboardView(value: string | null): value is DashboardView {
  return dashboardViews.some((item) => item.id === value);
}
