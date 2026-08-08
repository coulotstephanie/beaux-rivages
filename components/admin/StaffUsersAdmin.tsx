"use client";
import { useEffect, useState } from "react";
type User = {
  id: string;
  email?: string;
  roles: string[];
  lastSignInAt?: string;
  mfaRequired: boolean;
  idleTimeoutMinutes: number;
};
type Login = { id: number; user_id: string | null; outcome: string; created_at: string };
export function StaffUsersAdmin({
  token,
  notify,
}: {
  token: string;
  notify: (message: string) => void;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [logins, setLogins] = useState<Login[]>([]);
  const headers = { Authorization: `Bearer ${token}` };
  const load = async () => {
    const response = await fetch("/api/admin/users", { headers });
    const body = (await response.json()) as { users?: User[]; logins?: Login[]; error?: string };
    if (!response.ok) return notify(body.error ?? "Utilisateurs indisponibles.");
    setUsers(body.users ?? []);
    setLogins(body.logins ?? []);
  };
  useEffect(() => {
    void load();
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps
  const assign = async (userId: string, role: string) => {
    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role }),
    });
    if (!response.ok) return notify("Attribution impossible.");
    notify("Rôle attribué et journalisé.");
    await load();
  };
  const secure = async (
    user: User,
    patch: Partial<Pick<User, "mfaRequired" | "idleTimeoutMinutes">>,
  ) => {
    const response = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        mfaRequired: patch.mfaRequired ?? user.mfaRequired,
        idleTimeoutMinutes: patch.idleTimeoutMinutes ?? user.idleTimeoutMinutes,
      }),
    });
    if (!response.ok) return notify("Réglage de sécurité impossible.");
    notify("Sécurité du compte mise à jour.");
    await load();
  };
  const emailFor = (id: string | null) =>
    users.find((user) => user.id === id)?.email ?? "Compte inconnu";
  return (
    <section className="admin-panel">
      <div className="admin-panel__heading">
        <div>
          <p className="eyebrow">Accès et permissions</p>
          <h2>Utilisateurs</h2>
        </div>
      </div>
      <div className="admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Compte</th>
              <th>Rôles</th>
              <th>Dernière connexion</th>
              <th>Attribuer</th>
              <th>Sécurité</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.roles.join(", ") || "Aucun accès"}</td>
                <td>
                  {user.lastSignInAt
                    ? new Date(user.lastSignInAt).toLocaleString("fr-FR")
                    : "Jamais"}
                </td>
                <td>
                  <select
                    defaultValue="read_only"
                    onChange={(event) => void assign(user.id, event.target.value)}
                  >
                    <option value="read_only">Lecture seule</option>
                    <option value="concierge">Conciergerie</option>
                    <option value="editor">Éditeur</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </td>
                <td>
                  <label>
                    <input
                      type="checkbox"
                      checked={user.mfaRequired}
                      onChange={(event) => void secure(user, { mfaRequired: event.target.checked })}
                    />{" "}
                    MFA requis
                  </label>
                  <select
                    value={user.idleTimeoutMinutes}
                    onChange={(event) =>
                      void secure(user, { idleTimeoutMinutes: Number(event.target.value) })
                    }
                  >
                    <option value={15}>15 min</option>
                    <option value={30}>30 min</option>
                    <option value={60}>1 h</option>
                    <option value={120}>2 h</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h3>Journal des connexions</h3>
      <div className="admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Compte</th>
              <th>Résultat</th>
            </tr>
          </thead>
          <tbody>
            {logins.map((login) => (
              <tr key={login.id}>
                <td>{new Date(login.created_at).toLocaleString("fr-FR")}</td>
                <td>{emailFor(login.user_id)}</td>
                <td>{login.outcome}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
