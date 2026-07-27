export type NewsletterConsent = { email: string; locale: string; consentedAt: string; source: string };
export interface NewsletterProvider {
  requestDoubleOptIn(consent: NewsletterConsent): Promise<{ subscriberId: string; status: "pending-confirmation" }>;
  unsubscribe(email: string): Promise<void>;
}
