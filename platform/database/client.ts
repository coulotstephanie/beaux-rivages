import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

let serverClient: SupabaseClient<Database> | null = null;

export function isDatabaseConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY);
}

export function getDatabaseClient() {
  if (!isDatabaseConfigured()) {
    throw new Error("SUPABASE_NOT_CONFIGURED");
  }
  if (!serverClient) {
    serverClient = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SECRET_KEY!,
      {
        auth: { autoRefreshToken: false, persistSession: false },
        global: { headers: { "X-Client-Info": "beaux-rivages-server" } },
      },
    );
  }
  return serverClient;
}

export function getUserDatabaseClient(accessToken: string) {
  if (!isDatabaseConfigured()) throw new Error("SUPABASE_NOT_CONFIGURED");
  return createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Client-Info": "beaux-rivages-cms",
      },
    },
  });
}
