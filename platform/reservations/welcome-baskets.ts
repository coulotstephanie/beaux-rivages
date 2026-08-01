export type BasketOption = { code: string; label?: string };

export function describeWelcomeBaskets(options: BasketOption[]) {
  const has = (code: string) => options.some((item) => item.code === code);
  const included = has("signature-aperitif")
    ? "Panier Apéritif"
    : has("signature-sweet")
      ? "Panier Douceur"
      : !has("signature") && has("aperitif-basket")
        ? "Panier Apéritif"
        : !has("signature") && has("basket")
          ? "Panier Douceur"
          : "Aucun";
  const extra = has("signature")
    ? has("aperitif-basket")
      ? "Panier Apéritif · 45 €"
      : has("basket")
        ? "Panier Douceur · 45 €"
        : "Aucun"
    : "Aucun";
  return { included, extra };
}
