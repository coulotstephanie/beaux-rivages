"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createContext, useContext, useMemo, type ReactNode } from "react";

const SupabaseContext = createContext<SupabaseClient | null>(null);

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const client = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    return url && anonKey
      ? createClient(url, anonKey, {
          auth: { persistSession: true, autoRefreshToken: true },
        })
      : null;
  }, []);

  return <SupabaseContext.Provider value={client}>{children}</SupabaseContext.Provider>;
}

export function useSupabase() {
  return useContext(SupabaseContext);
}
