"use client";
import { useEffect, useState } from "react";
import type { HousekeepingSnapshot } from "@/platform/housekeeping/contracts";
type Section =
  | "dashboard"
  | "planning"
  | "quality"
  | "inventory"
  | "maintenance"
  | "interventions"
  | "stock"
  | "consumables"
  | "linen"
  | "photos"
  | "settings"
  | "reports";
const sections: Record<Section, string> = {
  dashboard: "Tableau de bord",
  planning: "Planning",
  quality: "Contrôles qualité",
  inventory: "Inventaire",
  maintenance: "Incidents",
  interventions: "Maintenance",
  stock: "Stocks",
  consumables: "Consommables",
  linen: "Linge",
  photos: "Photos",
  settings: "Paramètres",
  reports: "Journal",
};
const dt = (v: string | null) =>
  v
    ? new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" }).format(
        new Date(v),
      )
    : "—";
const money = (c: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(c / 100);
export function HousekeepingAdmin({
  token,
  notify,
}: {
  token: string;
  notify: (v: string) => void;
}) {
  const [data, setData] = useState<HousekeepingSnapshot | null>(null);
  const [section, setSection] = useState<Section>("dashboard");
  const [period, setPeriod] = useState<"today" | "tomorrow" | "week" | "month">("today");
  const [busy, setBusy] = useState(false);
  const call = async (payload?: Record<string, unknown>) => {
    setBusy(true);
    try {
      const response = await fetch("/api/admin/housekeeping", {
        method: payload ? "POST" : "GET",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: payload ? JSON.stringify(payload) : undefined,
      });
      const body = await response.json();
      if (!response.ok) {
        if (payload && !navigator.onLine) {
          const queue = JSON.parse(localStorage.getItem("br-housekeeping-queue") ?? "[]");
          localStorage.setItem("br-housekeeping-queue", JSON.stringify([...queue, payload]));
          return notify(
            "Modification conservée hors ligne. Elle sera synchronisée au retour du réseau.",
          );
        }
        return notify(body.error ?? "Action impossible.");
      }
      if (payload) notify("Donnée opérationnelle synchronisée.");
      const refresh = payload
        ? await fetch("/api/admin/housekeeping", { headers: { Authorization: `Bearer ${token}` } })
        : response;
      setData(payload ? await refresh.json() : body);
    } finally {
      setBusy(false);
    }
  };
  useEffect(() => {
    void call();
    const sync = async () => {
      const queue = JSON.parse(localStorage.getItem("br-housekeeping-queue") ?? "[]") as Record<
        string,
        unknown
      >[];
      for (const payload of queue) await call(payload);
      if (queue.length) localStorage.removeItem("br-housekeeping-queue");
    };
    window.addEventListener("online", sync);
    return () => window.removeEventListener("online", sync);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  if (!data)
    return (
      <section className="admin-panel">
        <p>{busy ? "Chargement du centre opérationnel…" : "Données indisponibles."}</p>
      </section>
    );
  return (
    <section className="admin-panel housekeeping-app">
      <div className="admin-panel__heading">
        <div>
          <p className="eyebrow">Centre opérationnel</p>
          <h2>Housekeeping & Maintenance</h2>
        </div>
        <span
          className={`network-state ${typeof navigator !== "undefined" && navigator.onLine ? "online" : "offline"}`}
        >
          {typeof navigator !== "undefined" && navigator.onLine ? "Synchronisé" : "Mode hors ligne"}
        </span>
      </div>
      <nav className="revenue-tabs" aria-label="Housekeeping">
        {(Object.keys(sections) as Section[]).map((id) => (
          <button
            key={id}
            type="button"
            aria-current={section === id ? "page" : undefined}
            onClick={() => setSection(id)}
          >
            {sections[id]}
          </button>
        ))}
      </nav>
      {section === "dashboard" && (
        <>
          <div className="admin-kpis">
            <K l="Arrivées" v={data.metrics.arrivals} />
            <K l="Départs" v={data.metrics.departures} />
            <K
              l="Ménages du jour"
              v={
                data.tasks.filter((task) => inPeriod(task.scheduledFor, data.today, "today")).length
              }
            />
            <K l="Maisons prêtes" v={data.metrics.ready} />
            <K l="En préparation" v={data.metrics.preparing} />
            <K l="En nettoyage" v={data.metrics.cleaning} />
            <K l="Bloquées" v={data.metrics.blocked} />
            <K l="Urgences" v={data.metrics.urgent} />
            <K
              l="Incidents ouverts"
              v={data.maintenance.filter((i) => !["resolved", "closed"].includes(i.status)).length}
            />
            <K l="Stocks faibles" v={data.metrics.lowStock} />
          </div>
          <div className="admin-two-columns">
            <article className="admin-card">
              <h3>Prévisions intelligentes</h3>
              {data.recommendations.map((item) => (
                <p key={item}>• {item}</p>
              ))}
              {!data.recommendations.length && (
                <p>Les niveaux actuels ne nécessitent aucun achat.</p>
              )}
            </article>
            <article className="admin-card">
              <h3>Performance</h3>
              <p>
                Temps moyen ménage :{" "}
                <strong>{data.metrics.averageCleaningMinutes || "—"} min</strong>
              </p>
              <p>
                Coûts maintenance : <strong>{money(data.metrics.maintenanceCostCents)}</strong>
              </p>
              <p>
                Incidents ouverts :{" "}
                <strong>
                  {
                    data.maintenance.filter((i) => !["resolved", "closed"].includes(i.status))
                      .length
                  }
                </strong>
              </p>
            </article>
          </div>
        </>
      )}
      {section === "planning" && (
        <>
          <div className="housekeeping-period" role="group" aria-label="Période">
            {(["today", "tomorrow", "week", "month"] as const).map((value) => (
              <button
                type="button"
                key={value}
                aria-pressed={period === value}
                onClick={() => setPeriod(value)}
              >
                {
                  { today: "Aujourd’hui", tomorrow: "Demain", week: "Semaine", month: "Mois" }[
                    value
                  ]
                }
              </button>
            ))}
          </div>
          <div className="housekeeping-board">
            {data.tasks
              .filter((task) => inPeriod(task.scheduledFor, data.today, period))
              .map((task) => (
                <TaskCard key={task.id} task={task} busy={busy} submit={call} />
              ))}
          </div>
        </>
      )}
      {section === "quality" && (
        <>
          <InspectionForm tasks={data.tasks} busy={busy} submit={call} />
          <div className="admin-list">
            {data.inspections.map((item) => (
              <Line
                key={item.id}
                title={`${item.propertyName} · ${"★".repeat(item.rating ?? 0)}${"☆".repeat(5 - (item.rating ?? 0))}`}
                detail={`${item.inspector} · ${item.remarks || "Sans remarque"} · ${dt(item.createdAt)}`}
                status={item.status}
              />
            ))}
          </div>
        </>
      )}
      {section === "inventory" && (
        <>
          <InventoryForm data={data} busy={busy} submit={call} />
          <Table
            heads={["Maison", "Pièce", "Équipement", "Nombre", "Valeur", "État"]}
            rows={data.inventory.map((i) => [
              i.propertyName,
              i.room,
              i.name,
              String(i.quantity),
              money(i.valueCents),
              i.condition,
            ])}
          />
        </>
      )}
      {section === "maintenance" && (
        <>
          <IncidentForm data={data} busy={busy} submit={call} />
          <div className="admin-list">
            {data.maintenance.map((i) => (
              <div className="admin-health-row" key={i.id}>
                <div>
                  <strong>
                    {i.propertyName} · {i.title}
                  </strong>
                  <span>
                    {i.description || "Sans commentaire"} · {dt(i.createdAt)}
                  </span>
                  {i.guestId && <a href={`?view=voyageurs&guest=${i.guestId}`}>Voyageur CRM</a>}
                </div>
                <span className={`admin-status priority-${i.priority}`}>
                  {i.priority} · {i.status}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
      {section === "interventions" && (
        <>
          <InterventionForm data={data} busy={busy} submit={call} />
          <div className="admin-list">
            {data.interventions.map((i) => (
              <div className="admin-health-row" key={i.id}>
                <div>
                  <strong>
                    {i.incidentTitle} · {i.propertyName}
                  </strong>
                  <span>
                    {i.assignee || i.provider || "Non attribuée"} · {dt(i.plannedFor)}
                  </span>
                </div>
                <select
                  value={i.status}
                  onChange={(e) =>
                    void call({
                      action: "update_intervention",
                      interventionId: i.id,
                      status: e.target.value,
                    })
                  }
                >
                  {[
                    "planned",
                    "assigned",
                    "postponed",
                    "in_progress",
                    "completed",
                    "cancelled",
                  ].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </>
      )}
      {(section === "stock" || section === "consumables") && (
        <div className="stock-grid">
          {data.stock
            .filter((i) =>
              section === "consumables" ? i.category === "consumable" : i.category !== "consumable",
            )
            .map((i) => (
              <article className={i.low ? "low-stock" : ""} key={i.id}>
                <span>{i.propertyName}</span>
                <h3>{i.name}</h3>
                <p>
                  {i.quantity} {i.unit} · seuil {i.threshold}
                </p>
                <label>
                  Nouveau niveau
                  <input
                    type="number"
                    min="0"
                    defaultValue={i.quantity}
                    onBlur={(e) =>
                      void call({
                        action: "adjust_stock",
                        stockId: i.id,
                        quantity: Number(e.target.value),
                      })
                    }
                  />
                </label>
                {i.low && (
                  <strong>
                    À renouveler : {Math.max(0, i.target - i.quantity)} {i.unit}
                  </strong>
                )}
              </article>
            ))}
        </div>
      )}
      {section === "linen" && (
        <>
          <LinenForm data={data} busy={busy} submit={call} />
          <Table
            heads={["Maison", "Séjour", "Article", "Quantité", "Mouvement", "Date"]}
            rows={data.linen.map((i) => [
              i.propertyName,
              i.reservationReference,
              i.item,
              String(i.quantity),
              i.direction,
              dt(i.recordedAt),
            ])}
          />
        </>
      )}
      {section === "photos" && (
        <div className="admin-callout">
          <h3>Photothèque opérationnelle privée</h3>
          <p>Photos avant/après ménage ou intervention, conservées dans un espace privé.</p>
          <PhotoForm data={data} token={token} notify={notify} refresh={() => call()} />
          <Table
            heads={["Maison", "Type", "Légende", "Date"]}
            rows={data.photos.map((i) => [i.propertyName, i.kind, i.caption, dt(i.takenAt)])}
          />
        </div>
      )}
      {section === "settings" && (
        <>
          <TemplateForm data={data} busy={busy} submit={call} />
          <Table
            heads={["Maison", "Modèle", "Type", "Étapes", "Actif"]}
            rows={data.templates.map((i) => [
              i.propertyName,
              i.name,
              i.taskType,
              String(i.checklist.length),
              i.active ? "Oui" : "Non",
            ])}
          />
          <h3>Catégories d’incidents</h3>
          <Table
            heads={["Catégorie", "Priorité", "Active"]}
            rows={data.categories.map((i) => [i.name, i.defaultPriority, i.active ? "Oui" : "Non"])}
          />
        </>
      )}
      {section === "reports" && (
        <>
          <div className="admin-kpis">
            <K l="Temps moyen ménage" v={`${data.metrics.averageCleaningMinutes || "—"} min`} />
            <K l="Contrôles" v={data.inspections.length} />
            <K l="Incidents" v={data.maintenance.length} />
            <K l="Coûts" v={money(data.metrics.maintenanceCostCents)} />
          </div>
          <div className="admin-list">
            {data.audit.map((item) => (
              <Line
                key={item.id}
                title={`${item.entityType} · ${item.action}`}
                detail={`${item.comment || "Modification opérationnelle"} · ${dt(item.createdAt)}`}
                status="historisé"
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
function K({ l, v }: { l: string; v: string | number }) {
  return (
    <article>
      <span>{l}</span>
      <strong>{v}</strong>
    </article>
  );
}
function Line({ title, detail, status }: { title: string; detail: string; status: string }) {
  return (
    <div className="admin-health-row">
      <div>
        <strong>{title}</strong>
        <span>{detail}</span>
      </div>
      <span className="admin-status">{status}</span>
    </div>
  );
}
function TaskCard({
  task,
  busy,
  submit,
}: {
  task: HousekeepingSnapshot["tasks"][number];
  busy: boolean;
  submit: (p: Record<string, unknown>) => Promise<void>;
}) {
  const update = (checklist: typeof task.checklist, status = task.operationalStatus) =>
    submit({
      action: "update_task",
      taskId: task.id,
      operationalStatus: status,
      checklist,
      offlineRevision: task.offlineRevision,
    });
  return (
    <article className="housekeeping-task">
      <div>
        <span>{dt(task.scheduledFor)}</span>
        <h3>{task.propertyName}</h3>
        <strong>{task.operationalStatus}</strong>
      </div>
      <select
        value={task.operationalStatus}
        disabled={busy}
        onChange={(e) => void update(task.checklist, e.target.value)}
      >
        {["to_prepare", "cleaning", "quality_control", "maintenance", "blocked", "urgent"].map(
          (s) => (
            <option key={s}>{s}</option>
          ),
        )}
        {task.operationalStatus === "ready" && <option value="ready">ready</option>}
      </select>
      <div className="admin-checklist">
        {task.checklist.map((i) => (
          <label key={i.id}>
            <input
              type="checkbox"
              checked={i.done}
              onChange={() =>
                void update(
                  task.checklist.map((x) => (x.id === i.id ? { ...x, done: !x.done } : x)),
                )
              }
            />
            {i.label}
          </label>
        ))}
      </div>
      <small>
        {task.assignee || "Non attribué"} · {task.checklist.filter((i) => i.done).length}/
        {task.checklist.length}
      </small>
      {task.guestId && <a href={`?view=voyageurs&guest=${task.guestId}`}>Voyageur CRM</a>}
      {task.reservationId && (
        <a href={`?view=reservations&reservation=${task.reservationId}`}>Ouvrir le séjour</a>
      )}
    </article>
  );
}
function InspectionForm({
  tasks,
  busy,
  submit,
}: {
  tasks: HousekeepingSnapshot["tasks"];
  busy: boolean;
  submit: (p: Record<string, unknown>) => Promise<void>;
}) {
  return (
    <form
      className="admin-editor"
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        void submit({
          action: "inspect",
          taskId: f.get("taskId"),
          inspector: f.get("inspector"),
          rating: Number(f.get("rating")) || undefined,
          remarks: f.get("remarks") || undefined,
          status: f.get("status"),
        });
      }}
    >
      <div className="admin-form-grid">
        <label>
          Maison
          <select name="taskId">
            {tasks.map((t) => (
              <option value={t.id} key={t.id}>
                {t.propertyName} · {dt(t.scheduledFor)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Responsable
          <input name="inspector" required />
        </label>
        <label>
          Évaluation
          <select name="rating">
            <option value="5">★★★★★</option>
            <option value="4">★★★★☆</option>
            <option value="3">★★★☆☆</option>
          </select>
        </label>
        <label>
          Décision
          <select name="status">
            <option value="approved">Prêt</option>
            <option value="correction_required">À corriger</option>
          </select>
        </label>
        <label className="wide">
          Remarque
          <input name="remarks" />
        </label>
      </div>
      <button disabled={busy}>Valider le contrôle</button>
    </form>
  );
}
function InventoryForm({
  data,
  busy,
  submit,
}: {
  data: HousekeepingSnapshot;
  busy: boolean;
  submit: (p: Record<string, unknown>) => Promise<void>;
}) {
  return (
    <form
      className="admin-editor"
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        void submit({
          action: "create_inventory",
          propertyId: f.get("propertyId"),
          room: f.get("room"),
          category: f.get("category"),
          name: f.get("name"),
          quantity: Number(f.get("quantity")),
          unitValueCents: Math.round(Number(f.get("value")) * 100),
          condition: f.get("condition"),
        });
      }}
    >
      <div className="admin-form-grid">
        <label>
          Maison
          <select name="propertyId">
            {data.properties.map((p) => (
              <option value={p.id} key={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Pièce
          <input name="room" required />
        </label>
        <label>
          Catégorie
          <input name="category" required />
        </label>
        <label>
          Équipement
          <input name="name" required />
        </label>
        <label>
          Nombre
          <input name="quantity" type="number" min="0" defaultValue="1" />
        </label>
        <label>
          Valeur unitaire (€)
          <input name="value" type="number" min="0" defaultValue="0" />
        </label>
        <label>
          État
          <select name="condition">
            <option value="new">Neuf</option>
            <option value="good">Bon</option>
            <option value="worn">Usé</option>
            <option value="damaged">Endommagé</option>
            <option value="missing">Manquant</option>
          </select>
        </label>
      </div>
      <button disabled={busy}>Ajouter à l’inventaire</button>
    </form>
  );
}
function InterventionForm({
  data,
  busy,
  submit,
}: {
  data: HousekeepingSnapshot;
  busy: boolean;
  submit: (p: Record<string, unknown>) => Promise<void>;
}) {
  return (
    <form
      className="admin-editor"
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        void submit({
          action: "plan_intervention",
          incidentId: f.get("incidentId"),
          assignee: f.get("assignee") || undefined,
          provider: f.get("provider") || undefined,
          plannedFor: new Date(String(f.get("plannedFor"))).toISOString(),
          notes: f.get("notes") || undefined,
        });
      }}
    >
      <div className="admin-form-grid">
        <label>
          Incident
          <select name="incidentId">
            {data.maintenance.map((i) => (
              <option value={i.id} key={i.id}>
                {i.propertyName} · {i.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          Responsable
          <input name="assignee" />
        </label>
        <label>
          Prestataire
          <input name="provider" />
        </label>
        <label>
          Date prévue
          <input name="plannedFor" type="datetime-local" required />
        </label>
        <label className="wide">
          Notes
          <input name="notes" />
        </label>
      </div>
      <button disabled={busy}>Planifier</button>
    </form>
  );
}
function IncidentForm({
  data,
  busy,
  submit,
}: {
  data: HousekeepingSnapshot;
  busy: boolean;
  submit: (p: Record<string, unknown>) => Promise<void>;
}) {
  return (
    <form
      className="admin-editor"
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        void submit({
          action: "create_incident",
          propertyId: f.get("propertyId"),
          reservationId: f.get("reservationId") || null,
          title: f.get("title"),
          description: f.get("description") || undefined,
          priority: f.get("priority"),
          dueAt: f.get("dueAt") ? new Date(String(f.get("dueAt"))).toISOString() : null,
        });
      }}
    >
      <h3>Signaler un incident</h3>
      <div className="admin-form-grid">
        <label>
          Maison
          <select name="propertyId" required>
            {data.properties.map((p) => (
              <option value={p.id} key={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Séjour
          <select name="reservationId">
            <option value="">Sans séjour</option>
            {data.tasks
              .filter((t) => t.reservationId)
              .map((t) => (
                <option value={t.reservationId ?? ""} key={t.id}>
                  {t.reservationReference}
                </option>
              ))}
          </select>
        </label>
        <label>
          Incident
          <input name="title" required />
        </label>
        <label>
          Priorité
          <select name="priority">
            <option value="low">Basse</option>
            <option value="normal">Normale</option>
            <option value="high">Haute</option>
            <option value="urgent">Urgente</option>
          </select>
        </label>
        <label>
          Date d’intervention
          <input name="dueAt" type="datetime-local" />
        </label>
        <label className="wide">
          Commentaire
          <textarea name="description" />
        </label>
      </div>
      <button disabled={busy}>Enregistrer l’incident</button>
    </form>
  );
}
function LinenForm({
  data,
  busy,
  submit,
}: {
  data: HousekeepingSnapshot;
  busy: boolean;
  submit: (p: Record<string, unknown>) => Promise<void>;
}) {
  return (
    <form
      className="admin-editor"
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        void submit({
          action: "record_linen",
          propertyId: f.get("propertyId"),
          reservationId: f.get("reservationId") || null,
          item: f.get("item"),
          quantity: Number(f.get("quantity")),
          direction: f.get("direction"),
          notes: f.get("notes") || undefined,
        });
      }}
    >
      <h3>Enregistrer une rotation</h3>
      <div className="admin-form-grid">
        <label>
          Maison
          <select name="propertyId">
            {data.properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Séjour
          <select name="reservationId">
            <option value="">Sans séjour</option>
            {data.tasks
              .filter((t) => t.reservationId)
              .map((t) => (
                <option key={t.id} value={t.reservationId ?? ""}>
                  {t.reservationReference}
                </option>
              ))}
          </select>
        </label>
        <label>
          Article
          <select name="item">
            {["Draps", "Housses", "Taies", "Serviettes", "Tapis de bain", "Torchons"].map((i) => (
              <option key={i}>{i}</option>
            ))}
          </select>
        </label>
        <label>
          Quantité
          <input name="quantity" type="number" min="1" defaultValue="1" required />
        </label>
        <label>
          Mouvement
          <select name="direction">
            <option value="prepared">Préparé</option>
            <option value="sent_to_laundry">Envoyé en blanchisserie</option>
            <option value="returned">Revenu propre</option>
            <option value="discarded">Écarté</option>
          </select>
        </label>
        <label>
          Notes
          <input name="notes" />
        </label>
      </div>
      <button disabled={busy}>Enregistrer</button>
    </form>
  );
}
function TemplateForm({
  data,
  busy,
  submit,
}: {
  data: HousekeepingSnapshot;
  busy: boolean;
  submit: (p: Record<string, unknown>) => Promise<void>;
}) {
  return (
    <form
      className="admin-editor"
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const labels = String(f.get("items") ?? "")
          .split("\n")
          .map((v) => v.trim())
          .filter(Boolean);
        void submit({
          action: "save_template",
          propertyId: f.get("propertyId") || null,
          name: f.get("name"),
          taskType: f.get("taskType"),
          checklist: labels.map((label, index) => ({
            id: `custom-${index + 1}`,
            label,
            done: false,
          })),
        });
      }}
    >
      <h3>Nouveau modèle de checklist</h3>
      <div className="admin-form-grid">
        <label>
          Maison
          <select name="propertyId">
            <option value="">Toutes les maisons</option>
            {data.properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Nom
          <input name="name" required />
        </label>
        <label>
          Type
          <select name="taskType">
            {["cleaning", "quality", "arrival", "linen", "experience", "stock"].map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        <label className="wide">
          Une étape par ligne
          <textarea
            name="items"
            required
            placeholder={"Réfrigérateur\nFour\nDouche\nContrôle final"}
          />
        </label>
      </div>
      <button disabled={busy}>Créer le modèle</button>
    </form>
  );
}
function PhotoForm({
  data,
  token,
  notify,
  refresh,
}: {
  data: HousekeepingSnapshot;
  token: string;
  notify: (value: string) => void;
  refresh: () => Promise<void>;
}) {
  return (
    <form
      className="admin-editor"
      encType="multipart/form-data"
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        void fetch("/api/admin/housekeeping/photo", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        }).then(async (response) => {
          const body = await response.json();
          notify(
            response.ok ? "Photo opérationnelle enregistrée." : (body.error ?? "Photo impossible."),
          );
          if (response.ok) await refresh();
        });
      }}
    >
      <div className="admin-form-grid">
        <label>
          Maison
          <select name="propertyId">
            {data.properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Type
          <select name="kind">
            <option value="before_cleaning">Avant ménage</option>
            <option value="after_cleaning">Après ménage</option>
            <option value="before_intervention">Avant intervention</option>
            <option value="after_intervention">Après intervention</option>
            <option value="quality">Contrôle qualité</option>
            <option value="incident">Incident</option>
          </select>
        </label>
        <label>
          Tâche
          <select name="taskId">
            <option value="">Aucune</option>
            {data.tasks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.propertyName} · {dt(t.scheduledFor)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Incident
          <select name="incidentId">
            <option value="">Aucun</option>
            {data.maintenance.map((i) => (
              <option key={i.id} value={i.id}>
                {i.propertyName} · {i.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          Légende
          <input name="caption" />
        </label>
        <label className="wide">
          Photo
          <input
            name="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            capture="environment"
            required
          />
        </label>
      </div>
      <button>Téléverser la photo</button>
    </form>
  );
}
function inPeriod(value: string, today: string, period: "today" | "tomorrow" | "week" | "month") {
  const date = value.slice(0, 10);
  const start = new Date(`${today}T12:00:00Z`);
  const target = new Date(`${date}T12:00:00Z`);
  const days = Math.round((target.getTime() - start.getTime()) / 86_400_000);
  return period === "today"
    ? days === 0
    : period === "tomorrow"
      ? days === 1
      : period === "week"
        ? days >= 0 && days < 7
        : days >= 0 && days < 31;
}
function Table({ heads, rows }: { heads: string[]; rows: string[][] }) {
  return (
    <div className="admin-table-wrap">
      <table>
        <thead>
          <tr>
            {heads.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((v, j) => (
                <td key={j}>{v}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
