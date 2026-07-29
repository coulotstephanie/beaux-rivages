# Traçabilité des workflows

Référence : [PRODUCT_BOOK_07_WORKFLOWS.md](./PRODUCT_BOOK_07_WORKFLOWS.md).

| Workflow | État actuel | Fondations existantes | Écart principal |
| --- | --- | --- | --- |
| Réservation | Partiel | devis, disponibilité, réservation transactionnelle | alternatives et abandon |
| Paiement | Partiel | Stripe TEST, webhooks idempotents, remboursements | virement, ANCV, espèces et activation |
| Contrat | Partiel | HTML/PDF, statuts, stockage | signature électronique réelle |
| Guest Journey | Partiel | templates, planification, secrets | fournisseur d’envoi et automatisation |
| Housekeeping | Partiel avancé | missions, checklists, inspection, photos | orchestration automatique au départ |
| Maintenance | Partiel | incidents, priorités, interventions | blocage calendrier automatique |
| CRM | Partiel | voyageurs, préférences, dépenses, fidélité | événements et segmentation automatisée |
| Revenue | Partiel | règles, promotions, recommandations | concurrence et publication tarifaire |
| Concierge | Partiel avancé | catalogue, panier, commandes, validation | paiement après validation |
| Départ | Partiel | message et checklist | orchestration inspection/disponibilité |
| Fidélisation | Partiel | fidélité, campagnes, avis | automatisation multicanale |
| Annulation | Incomplet | statuts et remboursement Stripe | politique centralisée et liste d’attente |
| Incident | Partiel | tickets, suivi et clôture | notifications et SLA |
| IA | Préparé | contrats et recommandations locales | orchestration nocturne et gouvernance |

## Décision de mise en œuvre

Une future couche `platform/workflows/` devra fournir :

- des machines à états typées par domaine ;
- un registre versionné des événements métier ;
- une boîte d’envoi transactionnelle (`outbox`) ;
- des clés d’idempotence et un mécanisme de rejeu ;
- un journal des transitions et de leurs acteurs ;
- des tests de transitions autorisées, interdites et compensatoires.

Cette couche sera introduite progressivement. Aucun statut existant ne sera
renommé sans migration et stratégie de compatibilité.
