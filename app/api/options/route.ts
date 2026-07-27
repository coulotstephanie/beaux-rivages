import { NextRequest } from "next/server";
import { bookingExperiences, stayOptions } from "@/booking";
import { noStoreJson, rateLimit } from "@/platform/http/security";

export function GET(request: NextRequest) {
  const limited = rateLimit(request, 80);
  if (limited) return limited;
  return noStoreJson({ options: stayOptions, experiences: bookingExperiences, paymentMethods: ["bank-transfer", "cash", "holiday-vouchers"], paymentsEnabled: false });
}
