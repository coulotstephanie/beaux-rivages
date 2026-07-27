export type StayEmailData = {
  travelerName: string;
  propertyName: string;
  arrival: string;
  departure: string;
  portalUrl: string;
};

const shell = (title: string, preheader: string, content: string) => `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${title}</title></head>
<body style="margin:0;background:#F7F3EA;color:#16354A;font-family:Arial,sans-serif">
<div style="display:none;max-height:0;overflow:hidden">${preheader}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:24px">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#fff">
<tr><td style="padding:32px;background:#16354A;color:#fff"><img src="https://www.beaux-rivages.com/brand/logo-horizontal-blanc.svg" width="340" alt="BEAUX RIVAGES" style="display:block;max-width:100%;height:auto"><span style="display:none">BEAUX RIVAGES</span></td></tr>
<tr><td style="padding:42px 32px">${content}</td></tr>
<tr><td style="padding:24px 32px;background:#16354A;color:#D8C3A5;font-size:12px">Stéphanie & Bruno · +33 6 17 26 00 94 · Beaux Rivages</td></tr>
</table></td></tr></table></body></html>`;
const button = (url: string, label: string) => `<p style="margin:28px 0"><a href="${url}" style="display:inline-block;padding:14px 20px;background:#16354A;color:#fff;text-decoration:none">${label}</a></p>`;
const greeting = (data: StayEmailData) => `<p>Bonjour ${data.travelerName},</p>`;

export const stayEmailTemplates = {
  confirmation: (data: StayEmailData) => shell("Votre séjour est confirmé", `Votre réservation à ${data.propertyName}`, `${greeting(data)}<h1 style="font-family:Georgia,serif;font-weight:400">Votre parenthèse est réservée.</h1><p>${data.propertyName}, du ${data.arrival} au ${data.departure}.</p>${button(data.portalUrl, "Ouvrir Mon Séjour")}`),
  payment: (data: StayEmailData) => shell("Paiement reçu", "Votre paiement Beaux Rivages a bien été enregistré", `${greeting(data)}<h1 style="font-family:Georgia,serif;font-weight:400">Merci, votre paiement est enregistré.</h1>${button(data.portalUrl, "Consulter le détail")}`),
  depositReceived: (data: StayEmailData) => shell("Acompte reçu", "Votre acompte a bien été enregistré", `${greeting(data)}<h1 style="font-family:Georgia,serif;font-weight:400">Votre séjour est désormais confirmé.</h1><p>L’acompte est enregistré. Le solde et son échéance restent visibles dans Mon Séjour.</p>${button(data.portalUrl, "Voir mon paiement")}`),
  fullPaymentReceived: (data: StayEmailData) => shell("Paiement complet reçu", "Votre séjour est intégralement réglé", `${greeting(data)}<h1 style="font-family:Georgia,serif;font-weight:400">Tout est réglé.</h1><p>Nous pouvons maintenant nous consacrer entièrement à la préparation de votre arrivée.</p>${button(data.portalUrl, "Ouvrir Mon Séjour")}`),
  contractAvailable: (data: StayEmailData) => shell("Votre contrat est disponible", "Votre contrat Beaux Rivages est prêt", `${greeting(data)}<h1 style="font-family:Georgia,serif;font-weight:400">Votre contrat vous attend.</h1><p>Vous pouvez télécharger sa version PDF ou consulter sa version imprimable dans votre espace sécurisé.</p>${button(data.portalUrl, "Consulter mon contrat")}`),
  preArrival: (data: StayEmailData) => shell("Votre arrivée approche", "Les informations utiles pour votre arrivée", `${greeting(data)}<h1 style="font-family:Georgia,serif;font-weight:400">La maison se prépare.</h1><p>Retrouvez votre checklist, la météo et vos informations d’arrivée dans votre espace sécurisé.</p>${button(data.portalUrl, "Préparer mon arrivée")}`),
  arrival: (data: StayEmailData) => shell("Bienvenue", `Bienvenue à ${data.propertyName}`, `${greeting(data)}<h1 style="font-family:Georgia,serif;font-weight:400">La maison est prête.</h1><p>Vos informations d’accès et les derniers repères sont disponibles dans Mon Séjour.</p>${button(data.portalUrl, "Voir mes informations d’arrivée")}`),
  duringStay: (data: StayEmailData) => shell("Profitez des îles", "Une adresse ou une envie pendant le séjour ?", `${greeting(data)}<h1 style="font-family:Georgia,serif;font-weight:400">Comment se passe votre séjour ?</h1><p>Stéphanie & Bruno restent disponibles avec discrétion.</p>${button(data.portalUrl, "Voir mes recommandations")}`),
  departure: (data: StayEmailData) => shell("Votre départ", "Quelques repères avant de quitter la maison", `${greeting(data)}<h1 style="font-family:Georgia,serif;font-weight:400">Un dernier matin sur l’île.</h1><p>Retrouvez les consignes simples de départ dans Mon Séjour.</p>${button(data.portalUrl, "Voir les consignes")}`),
  thanks: (data: StayEmailData) => shell("Merci", "Merci d’avoir choisi Beaux Rivages", `${greeting(data)}<h1 style="font-family:Georgia,serif;font-weight:400">Merci d’avoir habité la maison.</h1><p>Nous espérons que les îles vous accompagneront encore un peu.</p>`),
};
