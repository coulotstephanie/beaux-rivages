# Catalogue des événements métier

Statut : référence fonctionnelle et technique. L’implémentation de la couche
événementielle est suivie dans `WORKFLOW_TRACEABILITY.md`.

## Réservations

- `ReservationCreated`
- `ReservationUpdated`
- `ReservationCancelled`
- `ReservationConfirmed`
- `ReservationExpired`
- `ReservationModified`
- `ReservationCheckedIn`
- `ReservationCheckedOut`

## Paiements et facturation

- `PaymentCreated`
- `PaymentSucceeded`
- `PaymentFailed`
- `PaymentRefunded`
- `DepositReceived`
- `DepositReturned`
- `InvoiceGenerated`

## Contrats

- `ContractGenerated`
- `ContractSigned`
- `ContractExpired`
- `ContractArchived`

## Guest Journey

- `GuestJourneyStarted`
- `EmailSent`
- `SmsSent`
- `ReminderSent`
- `ArrivalInstructionsSent`
- `DepartureInstructionsSent`
- `ReviewRequestSent`

## CRM

- `GuestCreated`
- `GuestUpdated`
- `GuestSegmentChanged`
- `LoyaltyPointsAdded`
- `GuestBlacklisted`

## Housekeeping

- `CleaningScheduled`
- `CleaningStarted`
- `CleaningCompleted`
- `CleaningValidated`
- `CleaningIssueDetected`

## Maintenance

- `MaintenanceTicketCreated`
- `MaintenanceAssigned`
- `MaintenanceCompleted`
- `MaintenanceClosed`

## Concierge

- `OptionPurchased`
- `PackSignaturePurchased`
- `PackRomancePurchased`
- `BikeRentalBooked`
- `WelcomeBasketPrepared`

## Business Intelligence

- `DashboardUpdated`
- `DailyReportGenerated`
- `MonthlyReportGenerated`
- `ForecastCalculated`

## Enveloppe cible

```ts
type DomainEvent<TName extends string, TPayload> = {
  id: string;
  name: TName;
  version: number;
  aggregateType: string;
  aggregateId: string;
  occurredAt: string;
  correlationId: string;
  causationId: string | null;
  actorId: string | null;
  idempotencyKey: string;
  payload: TPayload;
};
```

Les événements sont immuables. Toute évolution incompatible crée une nouvelle
version. Les consommateurs doivent être idempotents et enregistrer leur
progression. Une outbox transactionnelle garantit que l’écriture métier et la
publication ne peuvent pas diverger.
