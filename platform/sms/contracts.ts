export interface SmsProvider {
  send(input: { to: string; body: string; idempotencyKey: string }): Promise<{ messageId: string; status: "queued" | "sent" }>;
}
