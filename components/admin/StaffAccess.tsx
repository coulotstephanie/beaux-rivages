"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type StaffAccessProps = {
  busy: boolean;
  message: string;
  onAuthenticated: () => Promise<void>;
};

export function StaffAccess({ busy, message, onAuthenticated }: StaffAccessProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authenticationError, setAuthenticationError] = useState("");
  const [mfa, setMfa] = useState<{ factorId: string; challengeId: string } | null>(null);
  const [code, setCode] = useState("");
  const authenticationCallback = useRef(onAuthenticated);

  useEffect(() => {
    authenticationCallback.current = onAuthenticated;
  }, [onAuthenticated]);

  useEffect(() => {
    void fetch("/api/auth/staff", { cache: "no-store" }).then(async (response) => {
      const result = (await response.json()) as { authenticated?: boolean };
      if (result.authenticated) {
        await authenticationCallback.current();
      }
    });
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthenticationError("");

    const response = await fetch("/api/auth/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const result = (await response.json()) as {
      error?: string;
      mfaRequired?: boolean;
      factorId?: string;
      challengeId?: string;
    };
    if (response.status === 202 && result.mfaRequired && result.factorId && result.challengeId) {
      setMfa({ factorId: result.factorId, challengeId: result.challengeId });
      return;
    }
    if (!response.ok) {
      setAuthenticationError(result.error ?? "Connexion impossible.");
      return;
    }
    await onAuthenticated();
  };

  const verifyMfa = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!mfa) return;
    const response = await fetch("/api/auth/staff", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...mfa, code }),
    });
    const result = (await response.json()) as { error?: string };
    if (!response.ok) return setAuthenticationError(result.error ?? "Vérification impossible.");
    await onAuthenticated();
  };

  return (
    <section className="admin-login" aria-labelledby="admin-login-title">
      <div>
        <p className="eyebrow">Accès sécurisé</p>
        <h2 id="admin-login-title">Ouvrir le Back Office</h2>
        <p>Connectez-vous avec votre compte professionnel Beaux Rivages.</p>
      </div>
      {mfa ? (
        <form onSubmit={verifyMfa}>
          <label htmlFor="staff-mfa">Code de vérification</label>
          <input
            id="staff-mfa"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            maxLength={6}
            value={code}
            onChange={(event) => setCode(event.target.value)}
            required
            autoFocus
          />
          <button type="submit" disabled={busy}>
            Vérifier et ouvrir
          </button>
        </form>
      ) : (
        <form onSubmit={submit}>
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
          <button type="submit" disabled={busy}>
            {busy ? "Ouverture…" : "Ouvrir le Back Office"}
          </button>
        </form>
      )}
      <p role="status">{authenticationError || message}</p>
    </section>
  );
}
