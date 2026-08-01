import type { DashboardView } from "./navigation";
import { dashboardNavigation } from "./navigation";

type SearchResult = { id: string; label: string; view: DashboardView };

export function DashboardHeader({
  view,
  onView,
  query,
  onQuery,
  results,
  onResult,
  dark,
  onTheme,
  onSignOut,
  busy,
  onRefresh,
}: {
  view: DashboardView;
  onView: (view: DashboardView) => void;
  query: string;
  onQuery: (value: string) => void;
  results: SearchResult[];
  onResult: (result: SearchResult) => void;
  dark: boolean;
  onTheme: () => void;
  onSignOut: () => void;
  busy: boolean;
  onRefresh: () => void;
}) {
  return (
    <div className="admin-workspace__bar">
      <nav aria-label="Rubriques du Back Office">
        {dashboardNavigation.map((group) => (
          <div className="admin-nav-group" key={group.category} aria-label={group.category}>
            <span className="admin-nav-group__label">{group.category}</span>
            {group.items.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-current={view === item.id ? "page" : undefined}
                onClick={() => onView(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </nav>
      <div className="admin-global-search">
        <input
          aria-label="Recherche globale"
          type="search"
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder="Rechercher partout…"
        />
        {results.length > 0 && (
          <div>
            {results.map((result) => (
              <button
                type="button"
                key={`${result.view}-${result.id}`}
                onClick={() => onResult(result)}
              >
                {result.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <button
        type="button"
        className="admin-theme"
        aria-label={dark ? "Activer le mode clair" : "Activer le mode sombre"}
        onClick={onTheme}
      >
        {dark ? "☀ Clair" : "☾ Sombre"}
      </button>
      <button type="button" className="admin-theme" onClick={onSignOut}>
        Se déconnecter
      </button>
      <button type="button" className="admin-refresh" disabled={busy} onClick={onRefresh}>
        {busy ? "Actualisation…" : "Actualiser"}
      </button>
    </div>
  );
}
