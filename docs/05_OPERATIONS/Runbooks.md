# Runbooks

Statut : cadre minimal défini, répétitions requises avant production.

Chaque runbook devra préciser déclencheur, propriétaire, diagnostic, actions,
rollback, validation et escalade.

## Indisponibilité

Confirmer depuis deux réseaux, consulter `/api/health`, geler les déploiements
et noter heure et commit. Ne lancer aucune commande destructive. Afficher la
maintenance si les écritures ne sont pas sûres. Une restauration exige un
accord explicite.

## Paiement ou webhook

Suspendre les reprises si l’idempotence est incertaine. Comparer Stripe et la
base par identifiants, ne jamais corriger un montant manuellement, puis rejouer
uniquement l’événement identifié et journalisé.
