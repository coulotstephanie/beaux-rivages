import type { LoyaltyBenefit, LoyaltyTier, RevenuePromotion, TravelerCommercialProfile, UpsellContext } from "./contracts";

export const loyaltyRules: Record<LoyaltyTier, { label: string; minimumStays: number; minimumSpendCents: number; benefits: LoyaltyBenefit[] }> = {
  decouverte: { label: "Découverte", minimumStays: 0, minimumSpendCents: 0, benefits: [{ code: "welcome", label: "Attention de bienvenue", kind: "gift" }] },
  insulaire: { label: "Insulaire", minimumStays: 2, minimumSpendCents: 150_000, benefits: [{ code: "priority", label: "Priorité de réservation", kind: "priority" }, { code: "late", label: "Départ tardif selon disponibilité", kind: "late-check-out" }] },
  "grand-large": { label: "Grand Large", minimumStays: 4, minimumSpendCents: 400_000, benefits: [{ code: "discount-5", label: "Avantage fidélité de 5 %", kind: "discount", value: 5 }, { code: "early", label: "Arrivée anticipée selon disponibilité", kind: "early-check-in" }] },
  ambassadeur: { label: "Ambassadeur", minimumStays: 7, minimumSpendCents: 800_000, benefits: [{ code: "discount-10", label: "Avantage fidélité de 10 %", kind: "discount", value: 10 }, { code: "signature", label: "Attention Signature selon les règles du séjour", kind: "signature" }, { code: "priority", label: "Priorité de réservation", kind: "priority" }] },
};

export function calculateLoyaltyTier(profile: Pick<TravelerCommercialProfile, "stays" | "totalSpentCents">): LoyaltyTier {
  const ordered: LoyaltyTier[] = ["ambassadeur", "grand-large", "insulaire", "decouverte"];
  return ordered.find((tier) => profile.stays >= loyaltyRules[tier].minimumStays && profile.totalSpentCents >= loyaltyRules[tier].minimumSpendCents) ?? "decouverte";
}

export const premiumExperiences = [
  { code: "signature", label: "Pack Signature", description: "Une arrivée mise en scène avec les attentions Beaux Rivages.", priceCents: 14900, image: "/images/destination/pique-nique-plage.jpg" },
  { code: "romance", label: "Pack Romance", description: "Une attention délicate pour célébrer le séjour à deux.", priceCents: 8900, image: "/images/properties/chai-des-tortues/editorial/chambre-romance.png" },
  { code: "aperitif", label: "Panier Apéritif", description: "Une sélection locale à partager dès l’arrivée.", priceCents: 5900, image: "/images/properties/villa-raie-manta/editorial/aperitif-coucher-soleil.png" },
  { code: "sweet", label: "Panier Douceur", description: "Une parenthèse gourmande préparée dans la maison.", priceCents: 3900, image: "/images/destination/petit-dejeuner-ocean.jpg" },
  { code: "linen", label: "Linge préparé", description: "Lits et linge prêts pour voyager plus léger.", priceCents: 2500, image: "/images/properties/nid-d-ete/editorial/chambre-attention.png" },
  { code: "beach-towels", label: "Serviettes de plage", description: "Le nécessaire prêt pour rejoindre le rivage.", priceCents: 1200, image: "/images/destination/plage-ganivelles.jpeg" },
  { code: "bathrobes", label: "Peignoirs", description: "Une attention confortable pour les matins tranquilles.", priceCents: 1800, image: "/images/properties/chai-des-tortues/editorial/chambre-attention.png" },
  { code: "late-check-out", label: "Départ tardif", description: "Prolonger la dernière matinée, selon disponibilité.", priceCents: 6000, image: "/images/destination/marais-coucher-soleil.jpeg" },
  { code: "early-check-in", label: "Arrivée anticipée", description: "Commencer la parenthèse plus tôt, après confirmation.", priceCents: 6000, image: "/images/destination/guide-port-saint-martin.jpg" },
  { code: "personal-arrival", label: "Arrivée personnalisée", description: "Un accueil personnel pensé avec Stéphanie et Bruno.", priceCents: 4500, image: "/images/properties/villa-raie-manta/editorial/attention-arrivee.png" },
  { code: "pet", label: "Accueil de votre compagnon", description: "Des attentions utiles pour son arrivée dans la maison.", priceCents: 3500, image: "/images/destination/famille-coucher-soleil.jpg" },
] as const;

export function recommendExperiences(context: UpsellContext) {
  const scores = new Map<string, { reason: string; score: number }>();
  const add = (code: string, score: number, reason: string) => {
    if (context.selectedCodes.includes(code)) return;
    const current = scores.get(code);
    if (!current || score > current.score) scores.set(code, { reason, score });
  };
  if (context.babies) add("linen", 10, "Voyager plus léger avec bébé");
  if (context.babies) add("early-check-in", 8, "Faciliter l’installation de la famille");
  if (context.adults === 2 && !context.children && !context.babies) add("romance", 9, "Une parenthèse pensée pour deux");
  if ([6, 7, 8].includes(new Date(`${context.arrival}T12:00:00Z`).getUTCMonth() + 1)) add("beach-towels", 8, "La plage fera partie du séjour");
  if (context.birthdayDuringStay) add("sweet", 10, "Célébrer un moment important sans révéler la surprise");
  if (context.pets) add("pet", 10, "Préparer l’arrivée de votre compagnon");
  if (context.adults + context.children >= 4) add("aperitif", 7, "Un premier moment à partager");
  add("signature", 5, "Commencer le séjour avec une attention particulière");
  return [...scores.entries()].sort((a, b) => b[1].score - a[1].score).slice(0, 4).map(([code, score]) => ({
    experience: premiumExperiences.find((item) => item.code === code)!,
    reason: score.reason,
  }));
}

export function validateRevenuePromotion(promotion: RevenuePromotion, input: {
  code: string; nights: number; channel: string; propertySlug: string; season: string; returningGuest: boolean; stayTotalCents: number; date?: Date;
}) {
  const now = input.date ?? new Date();
  if (!promotion.enabled || promotion.code.toUpperCase() !== input.code.trim().toUpperCase()) return null;
  if (now < new Date(promotion.startsAt) || now > new Date(promotion.endsAt)) return null;
  if (promotion.minimumStayNights && input.nights < promotion.minimumStayNights) return null;
  if (promotion.directOnly && input.channel !== "direct") return null;
  if (promotion.lowSeasonOnly && input.season !== "low") return null;
  if (promotion.returningGuestsOnly && !input.returningGuest) return null;
  if (promotion.propertySlugs.length && !promotion.propertySlugs.includes(input.propertySlug as RevenuePromotion["propertySlugs"][number])) return null;
  return Math.min(input.stayTotalCents, promotion.discountType === "fixed" ? promotion.value : Math.round(input.stayTotalCents * promotion.value / 100));
}

export function commercialRecommendations(input: { directShare: number; occupancyRate: number; averageBasketCents: number; topExperience?: string }) {
  return [
    input.directShare < 40 ? { priority: "high", title: "Renforcer la réservation directe", detail: "Réserver un avantage exclusif et non monétaire aux voyageurs qui reviennent en direct." } : null,
    input.occupancyRate < 55 ? { priority: "high", title: "Animer les périodes calmes", detail: "Préparer une campagne ciblée sur les anciens voyageurs, sans remise générale." } : null,
    input.averageBasketCents < 120_000 ? { priority: "medium", title: "Mieux présenter les expériences", detail: `Mettre en avant ${input.topExperience ?? "le Pack Signature"} au moment le plus pertinent du parcours.` } : null,
    { priority: "medium", title: "Cultiver la fidélité", detail: "Contacter les voyageurs 90 jours après leur séjour avec une recommandation liée à leur maison préférée." },
  ].filter((item): item is NonNullable<typeof item> => Boolean(item));
}
