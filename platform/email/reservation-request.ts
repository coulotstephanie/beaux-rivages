const houseNames: Record<string, string> = {
  "chai-des-tortues": "Le Chai des Tortues",
  "villa-raie-manta": "Villa Raie Manta",
  "nid-d-ete": "Le Nid d’Été",
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function shell(title: string, content: string) {
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(title)}</title></head><body style="margin:0;background:#f7f3ea;color:#16354a;font-family:Arial,sans-serif"><table role="presentation" width="100%"><tr><td align="center" style="padding:24px"><table role="presentation" width="100%" style="max-width:640px;background:#fff"><tr><td style="padding:28px;background:#16354a;color:#fff;font-family:Georgia,serif;font-size:26px">BEAUX RIVAGES</td></tr><tr><td style="padding:36px">${content}</td></tr><tr><td style="padding:20px 36px;background:#16354a;color:#d8c3a5;font-size:12px">Stéphanie & Bruno · Beaux Rivages</td></tr></table></td></tr></table></body></html>`;
}

export type ReservationEmailInput = {
  reference: string;
  propertySlug: string;
  arrival: string;
  departure: string;
  total: number;
  guest: { firstName: string; lastName: string; email: string; phone?: string };
  options?: string[];
};

function basketSummary(options: string[] = []) {
  const included = options.find((item) => item.startsWith("Panier inclus ·"));
  const extra = options.find(
    (item) =>
      !item.startsWith("Panier inclus ·") &&
      (item.includes("Panier Apéritif") || item.includes("Panier Douceur")),
  );
  return `<p><strong>Accueil gourmand</strong><br>Panier inclus : ${escapeHtml(included?.replace("Panier inclus · ", "") ?? extra ?? "Aucun")}<br>Panier supplémentaire : ${escapeHtml(included && extra ? `${extra} · 45 €` : "Aucun")}</p>`;
}

export function travelerRequestEmail(input: ReservationEmailInput) {
  const house = houseNames[input.propertySlug] ?? input.propertySlug;
  return {
    subject: `Demande ${input.reference} bien reçue · Beaux Rivages`,
    html: shell(
      "Votre demande est bien reçue",
      `<p>Bonjour ${escapeHtml(input.guest.firstName)},</p><h1 style="font-family:Georgia,serif;font-weight:400">Votre demande est entre de bonnes mains.</h1><p>Nous avons enregistré votre demande pour <strong>${escapeHtml(house)}</strong>, du ${escapeHtml(input.arrival)} au ${escapeHtml(input.departure)}, pour un total de ${input.total.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}.</p>${basketSummary(input.options)}<p>Référence : <strong>${escapeHtml(input.reference)}</strong></p><p>Aucun paiement n’a été débité. Stéphanie ou Bruno vous répondra avant toute confirmation définitive.</p>`,
    ),
  };
}

export function ownerRequestEmail(input: ReservationEmailInput) {
  const house = houseNames[input.propertySlug] ?? input.propertySlug;
  return {
    subject: `Nouvelle demande ${input.reference} · ${house}`,
    html: shell(
      "Nouvelle demande de réservation",
      `<h1 style="font-family:Georgia,serif;font-weight:400">Une nouvelle demande vient d’arriver.</h1><p><strong>${escapeHtml(input.guest.firstName)} ${escapeHtml(input.guest.lastName)}</strong><br>${escapeHtml(input.guest.email)}${input.guest.phone ? `<br>${escapeHtml(input.guest.phone)}` : ""}</p><p>${escapeHtml(house)}<br>Du ${escapeHtml(input.arrival)} au ${escapeHtml(input.departure)}<br>Total calculé : ${input.total.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}</p>${basketSummary(input.options)}<p>Référence : <strong>${escapeHtml(input.reference)}</strong></p>`,
    ),
  };
}
