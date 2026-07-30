import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/platform/database/database.types";

let staffAuthClient: SupabaseClient<Database> | null = null;

export function isStaffAuthConfigured() {
  return Boolean(
    process.env.SUPABASE_URL
      && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

export function getStaffAuthClient() {
  if (!isStaffAuthConfigured()) throw new Error("STAFF_AUTH_NOT_CONFIGURED");
  if (!staffAuthClient) {
    staffAuthClient = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
        global: { headers: { "X-Client-Info": "beaux-rivages-staff-auth" } },
      },
    );
  }
  return staffAuthClient;
}
