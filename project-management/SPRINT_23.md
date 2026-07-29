# Sprint 23 — API publique et webhooks

## Objectif

Permettre des intégrations externes stables sans exposer l’architecture interne.

## Périmètre

- contrats API versionnés ;
- authentification, scopes et quotas ;
- idempotence des commandes ;
- webhooks signés, rejouables et historisés ;
- portail de documentation et environnement de test ;
- politique de dépréciation.

Les endpoints publics réutilisent les cas d’usage applicatifs existants et ne
contournent jamais les règles métier.
