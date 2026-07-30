import type { TransactionalEmailProvider } from "./contracts";

export class ResendEmailAdapter implements TransactionalEmailProvider {
  async send(input: { to: string; subject: string; html: string; idempotencyKey: string }) {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM;
    if (!apiKey || !from) throw new Error("Resend email is not configured.");
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json", "idempotency-key": input.idempotencyKey },
      body: JSON.stringify({ from, to: [input.to], subject: input.subject, html: input.html }),
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) throw new Error(`Resend returned ${response.status}.`);
    const data = await response.json() as { id?: string };
    if (!data.id) throw new Error("Resend returned no message id.");
    return { messageId: data.id, status: "queued" as const };
  }
}
