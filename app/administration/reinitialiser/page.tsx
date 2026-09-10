"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

export default function ResetStaffPasswordPage() {
  const [tokens, setTokens] = useState<{ accessToken: string; refreshToken: string } | null>(null);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("Vérification du lien sécurisé…");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    if (!accessToken || !refreshToken || params.get("type") !== "recovery") {
      setMessage(
        "Ce lien est incomplet ou a expiré. Demandez un nouveau lien depuis le Back Office.",
      );
      return;
    }
    setTokens({ accessToken, refreshToken });
    setMessage("Choisissez votre nouveau mot de passe.");
    window.history.replaceState(null, "", window.location.pathname);
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!tokens) return;
    if (password !== confirmation) {
      setMessage("Les deux mots de passe ne correspondent pas.");
      return;
    }
    const response = await fetch("/api/auth/staff/recovery", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...tokens, password }),
    });
    const result = (await response.json()) as { error?: string };
    if (!response.ok) {
      setMessage(result.error ?? "Réinitialisation impossible.");
      return;
    }
    setDone(true);
    setTokens(null);
    setMessage("Votre nouveau mot de passe est enregistré.");
  };

  return (
    <main className="admin-dashboard-page">
      <header>
        <Link href="/">Beaux Rivages</Link>
      </header>
      <div className="shell">
        <section className="admin-login" aria-labelledby="reset-title">
          <div>
            <p className="eyebrow">Accès sécurisé</p>
            <h1 id="reset-title">Nouveau mot de passe</h1>
            <p>{message}</p>
          </div>
          {tokens ? (
            <form onSubmit={submit}>
              <label htmlFor="new-password">Nouveau mot de passe</label>
              <input
                id="new-password"
                type="password"
                autoComplete="new-password"
                minLength={10}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <label htmlFor="confirm-password">Confirmer le mot de passe</label>
              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                minLength={10}
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                required
              />
              <button type="submit">Enregistrer le nouveau mot de passe</button>
            </form>
          ) : done ? (
            <Link href="/administration">Revenir au Back Office</Link>
          ) : (
            <Link href="/administration">Demander un nouveau lien</Link>
          )}
        </section>
      </div>
    </main>
  );
}
