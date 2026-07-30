# ADR-0005 — Architecture événementielle

- **Statut :** Accepted
- **Date :** 2026-07-29

## Décision

Toutes les actions métier importantes génèrent un événement métier.

## Exemple

```text
ReservationCreated
  ├── CRM
  ├── Analytics
  ├── Guest Journey
  └── Dashboard
```

## Conséquences

Les modules sont découplés. Les événements suivent le catalogue officiel,
possèdent un identifiant, une corrélation et une clé d’idempotence. Leur
publication fiable converge vers une outbox transactionnelle et leurs
consommateurs sont rejouables.

