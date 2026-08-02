import "server-only";
import { getDatabaseClient, isDatabaseConfigured } from "@/platform/database/client";

export const paymentMethodCodes = ["bank_transfer", "holiday_vouchers", "card"] as const;
export type PaymentMethodCode = (typeof paymentMethodCodes)[number];

export type PaymentMethodSetting = {
  method: PaymentMethodCode;
  label: string;
  enabled: boolean;
};

const safeDefaults: PaymentMethodSetting[] = [
  { method: "bank_transfer", label: "Virement bancaire", enabled: true },
  { method: "holiday_vouchers", label: "Chèques-Vacances", enabled: false },
  { method: "card", label: "Carte bancaire", enabled: false },
];

export async function listPaymentMethods(): Promise<PaymentMethodSetting[]> {
  if (!isDatabaseConfigured()) return safeDefaults;
  const { data, error } = await getDatabaseClient()
    .from("payment_method_settings")
    .select("method,label,enabled")
    .order("method");
  if (error || !data?.length) return safeDefaults;
  return paymentMethodCodes.map((method) => {
    const row = data.find((candidate) => candidate.method === method);
    return row
      ? { method, label: row.label, enabled: row.enabled }
      : safeDefaults.find((candidate) => candidate.method === method)!;
  });
}

export async function assertPaymentMethodEnabled(method: PaymentMethodCode) {
  const settings = await listPaymentMethods();
  if (!settings.some((setting) => setting.method === method && setting.enabled)) {
    throw new Error("PAYMENT_METHOD_DISABLED");
  }
}
