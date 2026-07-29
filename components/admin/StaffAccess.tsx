"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type StaffAccessProps = {
  busy: boolean;
  message: string;
  onAuthenticated: (accessToken: string) => Promise<void>;
};

export function StaffAccess({ busy, message, onAuthenticated }: StaffAccessProps) {
  const [supabaseConfigured, setSupabaseConfigured] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [legacyToken, setLegacyToken] = useState("");
  const [authenticationError, setAuthenticationError] = useState("");
  const authenticationCallback = useRef(onAuthenticated);

  useEffect(() => {
    authenticationCallback.current = onAuthenticated;
  }, [onAuthenticated]);

  useEffect(() => {
    void fetch("/api/auth/staff", { cache: "no-store" }).then(async (response) => {
      const result = await response.json() as {
        authenticated?: boolean;
        supabaseConfigured?: boolean;
      };
      if (result.authenticated) {
        await authenticationCallback.current("");
        return;
      }
      setSupabaseConfigured(Boolean(result.supabaseConfigured));
      const savedToken = window.sessionStorage.getItem("beaux-rivages-admin-token");
      if (savedToken) setLegacyToken(savedToken);
    });
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthenticationError("");

    if (!supabaseConfigured) {
      window.sessionStorage.setItem("beaux-rivages-admin-token", legacyToken);
      await onAuthenticated(legacyToken);
      return;
    }

    const response = await fetch("/api/auth/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const result = await response.json() as { error?: string };
    if (!response.ok) {
      setAuthenticationError(result.error ?? "Connexion impossible.");
      return;
    }
    await onAuthenticated("");
  };

  return (
    <section className="admin-login" aria-labelledby="admin-login-title">
      <div>
        <p className="eyebrow">Accès sécurisé</p>
        <h2 id="admin-login-title">Ouvrir le Back Office</h2>
        <p>
          {supabaseConfigured
            ? "Connectez-vous avec votre compte professionnel Beaux Rivages."
            : "Le jeton temporaire reste uniquement dans cette session de navigateur."}
        </p>
      </div>
      <form onSubmit={submit}>
        {supabaseConfigured ? (
          <>
            <label htmlFor="staff-email">Adresse e-mail</label>
            <input
              id="staff-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <label htmlFor="staff-password">Mot de passe</label>
            <input
              id="staff-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </>
        ) : (
          <>
            <label htmlFor="dashboard-token">Jeton administrateur temporaire</label>
            <input
              id="dashboard-token"
              autoComplete="current-password"
              type="password"
              value={legacyToken}
              onChange={(event) => setLegacyToken(event.target.value)}
              required
            />
          </>
        )}
        <button type="submit" disabled={busy}>
          {busy ? "Ouverture…" : "Ouvrir le Back Office"}
        </button>
      </form>
      <p role="status">{authenticationError || message}</p>
    </section>
  );
}
