# Sprint 03 — Paiements

## Objectif

Fiabiliser Stripe déjà présent derrière des contrats indépendants du
fournisseur.

## Périmètre

- `PaymentService`, `PaymentRepository` et `PaymentProvider` ;
- acompte et paiement complet ;
- remboursement contrôlé ;
- statuts, idempotence, historique et audit ;
- Dashboard des paiements ;
- tests des webhooks, erreurs réseau et doubles soumissions.

Les montants sont toujours recalculés côté serveur.
