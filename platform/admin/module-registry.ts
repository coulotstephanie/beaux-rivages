/**
 * Registre canonique du Centre de Pilotage V4.
 *
 * L'interface, les permissions et la documentation doivent référencer ces
 * identifiants stables. Un module peut évoluer sans modifier la navigation
 * des autres domaines.
 */
export const pilotageModules = [
  { id: "dashboard", label: "Aujourd’hui", domain: "pilotage", phase: 1 },
  { id: "properties", label: "Maisons", domain: "content", phase: 2 },
  { id: "calendar", label: "Calendrier", domain: "distribution", phase: 1 },
  { id: "pricing", label: "Tarifs", domain: "distribution", phase: 1 },
  { id: "promotions", label: "Promotions", domain: "distribution", phase: 1 },
  { id: "media", label: "Photothèque", domain: "content", phase: 2 },
  { id: "videos", label: "Vidéos", domain: "content", phase: 2 },
  { id: "pages", label: "Contenus", domain: "content", phase: 2 },
  { id: "notebook", label: "Carnet", domain: "content", phase: 2 },
  { id: "seo", label: "Référencement SEO", domain: "content", phase: 2 },
  { id: "reviews", label: "Avis", domain: "reputation", phase: 3 },
  { id: "analytics", label: "Statistiques", domain: "analytics", phase: 3 },
  { id: "users", label: "Utilisateurs", domain: "identity", phase: 1 },
  { id: "settings", label: "Paramètres", domain: "platform", phase: 2 },
] as const;

export type PilotageModuleId = (typeof pilotageModules)[number]["id"];
export type PilotageDomain = (typeof pilotageModules)[number]["domain"];

export function getPilotageModule(id: PilotageModuleId) {
  return pilotageModules.find((module) => module.id === id)!;
}
