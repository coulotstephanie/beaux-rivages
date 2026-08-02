import { NextRequest } from "next/server";
import { bookingExperiences, stayOptions } from "@/booking";
import { noStoreJson, rateLimit } from "@/platform/http/security";
import { listPaymentMethods } from "@/platform/payments/methods";

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, 80);
  if (limited) return limited;
  return noStoreJson({
    options: stayOptions,
    experiences: bookingExperiences,
    paymentMethods: (await listPaymentMethods())
      .filter((method) => method.enabled)
      .map((method) => method.method.replaceAll("_", "-")),
    paymentsEnabled: false,
  });
}
