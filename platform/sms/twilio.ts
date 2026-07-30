import type { SmsProvider } from "./contracts";

export class TwilioSmsAdapter implements SmsProvider {
  async send(input: { to: string; body: string; idempotencyKey: string }) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
    if (!accountSid || !authToken || !messagingServiceSid) throw new Error("Twilio SMS is not configured.");
    if (!/^\+[1-9]\d{7,14}$/.test(input.to)) throw new Error("SMS recipient must use E.164 format.");
    const body = new URLSearchParams({ To: input.to, Body: input.body, MessagingServiceSid: messagingServiceSid });
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: "POST",
      headers: { authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`, "content-type": "application/x-www-form-urlencoded", "x-idempotency-key": input.idempotencyKey },
      body,
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) throw new Error(`Twilio returned ${response.status}.`);
    const data = await response.json() as { sid?: string; status?: string };
    if (!data.sid) throw new Error("Twilio returned no message id.");
    return { messageId: data.sid, status: data.status === "sent" ? "sent" as const : "queued" as const };
  }
}
