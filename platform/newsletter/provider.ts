import type { NewsletterConsent, NewsletterProvider } from "./contracts";

export class ConfigurableNewsletterProvider implements NewsletterProvider {
  async requestDoubleOptIn(consent: NewsletterConsent): Promise<{ subscriberId: string; status: "pending-confirmation" }> {
    void consent;
    const provider = process.env.NEWSLETTER_PROVIDER;
    if (!provider || !["brevo", "mailchimp"].includes(provider)) throw new Error("Newsletter provider is not configured.");
    // Les adaptateurs Brevo/Mailchimp utiliseront leur API transactionnelle ici.
    // Aucun abonnement n’est validé avant le clic de double opt-in.
    throw new Error(`${provider} adapter credentials are not configured.`);
  }
  async unsubscribe(email: string) {
    void email;
    if (!process.env.NEWSLETTER_PROVIDER) throw new Error("Newsletter provider is not configured.");
    throw new Error("Newsletter provider credentials are not configured.");
  }
}
