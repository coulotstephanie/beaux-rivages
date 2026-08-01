import type { BackOfficeSnapshot } from "@/platform/admin/contracts";
import { dateTime, money, shortDate, Status } from "./format";
import { ReservationList } from "./ReservationList";

export function TodayOverview({ data }: { data: BackOfficeSnapshot }) {
  const openMaintenance = data.operations.maintenance.filter(
    (item) => !["resolved", "closed"].includes(item.status),
  );
  return (
    <section className="admin-panel">
      <div className="admin-panel__heading">
        <div>
          <p className="eyebrow">{shortDate(data.today)}</p>
          <h2>La journée en un regard</h2>
        </div>
        <p>Les priorités opérationnelles, mises à jour depuis Supabase.</p>
      </div>
      <div className="admin-kpis">
        <article>
          <span>Réservations</span>
          <strong>{data.reservations.length}</strong>
          <small>tous canaux</small>
        </article>
        <article>
          <span>CA du mois</span>
          <strong>{money(data.metrics.revenueMonthCents)}</strong>
        </article>
        <article>
          <span>CA annuel</span>
          <strong>{money(data.metrics.revenueYearCents)}</strong>
        </article>
        <article>
          <span>Panier moyen</span>
          <strong>
            {money(
              data.reservations.length
                ? Math.round(
                    data.reservations.reduce((sum, item) => sum + item.totalCents, 0) /
                      data.reservations.length,
                  )
                : 0,
            )}
          </strong>
        </article>
        <article>
          <span>Part directe</span>
          <strong>{data.metrics.directShare} %</strong>
        </article>
        <article>
          <span>Séjour moyen</span>
          <strong>{data.metrics.averageStayNights}</strong>
          <small>nuits</small>
        </article>
        <article>
          <span>Arrivées</span>
          <strong>{data.operational.arrivals.length}</strong>
          <small>aujourd’hui</small>
        </article>
        <article>
          <span>Départs</span>
          <strong>{data.operational.departures.length}</strong>
          <small>aujourd’hui</small>
        </article>
        <article>
          <span>Sur place</span>
          <strong>{data.operational.inHouse.length}</strong>
          <small>séjour en cours</small>
        </article>
        <article className={data.operational.requests.length ? "needs-attention" : ""}>
          <span>Demandes</span>
          <strong>{data.operational.requests.length}</strong>
          <small>à traiter</small>
        </article>
        <article className={data.operational.pendingPayments.length ? "needs-attention" : ""}>
          <span>Paiements</span>
          <strong>{data.operational.pendingPayments.length}</strong>
          <small>{money(data.metrics.pendingPaymentsCents)} à suivre</small>
        </article>
        <article className={data.operational.unsignedContracts.length ? "needs-attention" : ""}>
          <span>Contrats</span>
          <strong>{data.operational.unsignedContracts.length}</strong>
          <small>non signés</small>
        </article>
        <article className={openMaintenance.length ? "needs-attention" : ""}>
          <span>Maintenance</span>
          <strong>{openMaintenance.length}</strong>
          <small>incident(s) ouvert(s)</small>
        </article>
        <article>
          <span>Notifications</span>
          <strong>{data.operations.notifications.filter((item) => !item.readAt).length}</strong>
          <small>non lue(s)</small>
        </article>
      </div>
      <div className="admin-two-columns">
        <article className="admin-card">
          <h3>Arrivées aujourd’hui</h3>
          <ReservationList rows={data.operational.arrivals} empty="Aucune arrivée aujourd’hui." />
        </article>
        <article className="admin-card">
          <h3>Départs aujourd’hui</h3>
          <ReservationList rows={data.operational.departures} empty="Aucun départ aujourd’hui." />
        </article>
        <article className="admin-card">
          <h3>Voyageurs actuellement présents</h3>
          <ReservationList rows={data.operational.inHouse} empty="Aucun séjour direct en cours." />
        </article>
        <article className="admin-card">
          <h3>Demandes à traiter</h3>
          <ReservationList
            rows={data.operational.requests}
            empty="Toutes les demandes sont traitées."
          />
        </article>
        <article className="admin-card">
          <h3>Les 7 prochains jours</h3>
          <ReservationList rows={data.operational.upcoming7Days} empty="Aucune arrivée prévue." />
        </article>
        <article className="admin-card">
          <h3>Préparations des maisons</h3>
          {data.operations.housekeeping.slice(0, 6).map((task) => (
            <div className="admin-health-row" key={task.id}>
              <div>
                <strong>{task.propertyName}</strong>
                <span>
                  {dateTime(task.scheduledFor)} ·{" "}
                  {task.checklist.filter((item) => item.done).length}/{task.checklist.length}{" "}
                  contrôles
                </span>
              </div>
              <Status value={task.status} />
            </div>
          ))}
        </article>
      </div>
    </section>
  );
}
