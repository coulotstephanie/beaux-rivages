export type TransactionalEmailProviderName = "resend" | "sendgrid" | "brevo";
export interface TransactionalEmailProvider {
  send(input: {
    to: string;
    subject: string;
    html: string;
    idempotencyKey: string;
  }): Promise<{ messageId: string; status: "queued" | "sent" }>;
}

export class ConfigurableEmailProvider implements TransactionalEmailProvider {
  constructor(private readonly request: typeof fetch = fetch) {}

  async send(input: {
    to: string;
    subject: string;
    html: string;
    idempotencyKey: string;
  }): Promise<{ messageId: string; status: "queued" | "sent" }> {
    const provider = process.env.EMAIL_PROVIDER as TransactionalEmailProviderName | undefined;
    if (!provider) throw new Error("Transactional email provider is not configured.");
    if (provider !== "resend") throw new Error(`${provider} adapter is not implemented.`);

    const apiKey = process.env.EMAIL_PROVIDER_API_KEY?.trim();
    const from = process.env.EMAIL_FROM?.trim();
    if (!apiKey?.startsWith("re_") || !from) {
      throw new Error("Resend credentials are not configured.");
    }

    const response = await this.request("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": input.idempotencyKey,
        "User-Agent": "Beaux-Rivages/1.0",
      },
      body: JSON.stringify({ from, to: [input.to], subject: input.subject, html: input.html }),
    });
    const payload = (await response.json().catch(() => null)) as {
      id?: string;
      message?: string;
    } | null;
    if (!response.ok || !payload?.id) {
      throw new Error(`RESEND_SEND_FAILED:${response.status}:${payload?.message ?? "unknown"}`);
    }
    return { messageId: payload.id, status: "queued" };
  }
}
