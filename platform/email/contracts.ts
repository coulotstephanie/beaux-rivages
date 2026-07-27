export type TransactionalEmailProviderName = "resend" | "sendgrid" | "brevo";
export interface TransactionalEmailProvider {
  send(input: { to: string; subject: string; html: string; idempotencyKey: string }): Promise<{ messageId: string; status: "queued" | "sent" }>;
}

export class ConfigurableEmailProvider implements TransactionalEmailProvider {
  async send(input: { to: string; subject: string; html: string; idempotencyKey: string }): Promise<{ messageId: string; status: "queued" | "sent" }> {
    void input;
    const provider = process.env.EMAIL_PROVIDER as TransactionalEmailProviderName | undefined;
    if (!provider) throw new Error("Transactional email provider is not configured.");
    throw new Error(`${provider} adapter credentials are not configured.`);
  }
}
