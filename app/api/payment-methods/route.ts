import { listPaymentMethods } from "@/platform/payments/methods";
import { noStoreJson } from "@/platform/http/security";

export async function GET() {
  const methods = await listPaymentMethods();
  return noStoreJson({ methods: methods.filter((method) => method.enabled) });
}
