const moneyFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const shortDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "short",
  timeStyle: "short",
});

export const statusLabels: Record<string, string> = {
  draft: "Brouillon",
  pending_payment: "Paiement attendu",
  requested: "Demande",
  confirmed: "Confirmée",
  cancelled: "Annulée",
  completed: "Terminée",
  declined: "Refusée",
  paid: "Payé",
  pending: "En attente",
  signed: "Signé",
  generated: "Généré",
  sent: "Envoyé",
  viewed: "Consulté",
  healthy: "Opérationnel",
  success: "Réussi",
  failed: "Échec",
  warning: "Attention",
  error: "Erreur",
  queued: "En attente",
  delivered: "Livré",
  bounced: "Rejeté",
  opened: "Ouvert",
  authorized: "Autorisé",
};

export function money(cents: number) {
  return moneyFormatter.format(cents / 100);
}

export function shortDate(value: string | null) {
  return value ? shortDateFormatter.format(new Date(`${value.slice(0, 10)}T12:00:00`)) : "—";
}

export function dateTime(value: string | null) {
  return value ? dateTimeFormatter.format(new Date(value)) : "Jamais";
}

export function Status({ value }: { value: string }) {
  return (
    <span className={`admin-status admin-status--${value}`}>{statusLabels[value] ?? value}</span>
  );
}
