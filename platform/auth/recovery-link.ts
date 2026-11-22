/** Recovery material stays in the fragment, out of HTTP requests and referrer URLs. */
export function staffRecoveryEmail(tokenHash: string) {
  const url = new URL("/administration/reinitialiser", "https://www.beaux-rivages.com");
  url.hash = new URLSearchParams({ token_hash: tokenHash, type: "recovery" }).toString();
  return {
    subject: "Votre lien de récupération du Back Office · Beaux Rivages",
    html: `<p>Bonjour,</p><p>Vous avez demandé un nouveau mot de passe pour le Back Office Beaux Rivages.</p><p><a href="${url.toString().replaceAll("&", "&amp;")}">Choisir mon nouveau mot de passe</a></p><p>Ce lien est personnel, temporaire et à usage unique. Si vous n’êtes pas à l’origine de cette demande, ignorez cet email.</p><p>Beaux Rivages</p>`,
  };
}
