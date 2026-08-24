import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/platform/database/database.types";

export function isStaffAuthConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}

export function getStaffAuthClient() {
  if (!isStaffAuthConfigured()) throw new Error("STAFF_AUTH_NOT_CONFIGURED");
  return createClient<Database>(
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
