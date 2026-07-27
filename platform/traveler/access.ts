import { createHmac, timingSafeEqual } from "node:crypto";
import type { StayAccessPayload } from "./contracts";

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) throw new Error("Traveler portal authentication is not configured.");
  return value;
}
function signature(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createStayAccessToken(data: StayAccessPayload) {
  const payload = Buffer.from(JSON.stringify(data)).toString("base64url");
  return `${payload}.${signature(payload)}`;
}

export function verifyStayAccessToken(token: string): StayAccessPayload {
  const [payload, supplied] = token.split(".");
  if (!payload || !supplied) throw new Error("Invalid stay access token.");
  const expected = signature(payload);
  const suppliedBuffer = Buffer.from(supplied);
  const expectedBuffer = Buffer.from(expected);
  if (suppliedBuffer.length !== expectedBuffer.length || !timingSafeEqual(suppliedBuffer, expectedBuffer)) throw new Error("Invalid stay access token.");
  const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as StayAccessPayload;
  if (Date.parse(data.expiresAt) <= Date.now()) throw new Error("Stay access token has expired.");
  return data;
}
