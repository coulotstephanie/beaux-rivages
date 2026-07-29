"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type AppSession = {
  userId: string;
  email: string;
  role?: string;
} | null;

type SessionContextValue = {
  session: AppSession;
  setSession: (session: AppSession) => void;
  clearSession: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({
  children,
  initialSession = null,
}: {
  children: ReactNode;
  initialSession?: AppSession;
}) {
  const [session, setSession] = useState<AppSession>(initialSession);
  const clearSession = useCallback(() => setSession(null), []);
  const value = useMemo(() => ({ session, setSession, clearSession }), [session, clearSession]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useSession must be used within SessionProvider");
  return context;
}
