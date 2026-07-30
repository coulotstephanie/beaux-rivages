# Traçabilité de l’architecture système

Référence : [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md).

## État au 29 juillet 2026

| Élément | État | Preuve ou écart |
| --- | --- | --- |
| Vercel Edge Network | Conforme | previews et déploiements Vercel actifs |
| Cloudflare CDN + WAF | Non vérifié | aucune configuration versionnée dans le dépôt |
| Next.js, API Routes, middleware | Conforme partiel | App Router et routes présents ; couverture middleware limitée |
| Server Actions | Cible | architecture prévue, routes API encore majoritaires |
| Couche domaine indépendante | Partiel | contrats métier dans `platform/`, logique historique à migrer |
| Repository Interfaces | Partiel | interfaces présentes, audit des accès directs restant |
| PostgreSQL, Auth, Storage et RLS | Conforme partiel | migrations présentes ; environnement lié à valider |
| Supabase Edge Functions | Non activé | aucune fonction versionnée dans le dépôt |
| Sauvegardes | Incomplet | scripts documentés, restauration réelle non testée |
| Réservation transactionnelle | Partiel | validation serveur et protections présentes, production non ouverte |
| Stripe | Mode test | webhook et cycle testés, activation Live interdite sans recette |
| Facturation automatique | Incomplet | fondations présentes, chaîne de production à valider |
| Guest Journey | Partiel | messages et planification présents, fournisseur réel absent |
| Housekeeping | Partiel | domaine, checklists et API présents |
| Maintenance | Partiel | fondations présentes, workflow complet à éprouver |
| IA nocturne | Cible | aucun moteur autonome activé |
| Email | Partiel | génération présente, fournisseur transactionnel à brancher |
| SMS et Push | Absent | adaptateurs à concevoir |
| Channel Manager | Partiel | cœur et ICS présents, APIs partenaires non branchées |
| Multi-tenant | Préparé, non activé | stratégie dédiée, isolation tenant non migrée |

## Principes d’exploitation

- Cloudflare ne peut être déclaré actif sans preuve DNS, WAF et procédure
  d’exploitation.
- Une sauvegarde n’est validée qu’après un exercice de restauration.
- Un fournisseur externe n’est actif qu’après secrets, webhooks, sandbox,
  observabilité et recette documentés.
- Une chaîne événementielle n’est complète que si elle est idempotente,
  rejouable et observable.
- Les flux IA conservent une validation humaine pour toute décision sensible.

## Ordre de convergence

1. Fiabiliser la chaîne P0 réservation, paiement, contrat et Guest Journey.
2. Ajouter l’outbox transactionnelle et un premier flux vertical observable.
3. Brancher les fournisseurs transactionnels avec sandbox et procédures.
4. Tester sauvegarde, restauration et reprise après incident.
5. Activer l’isolation multi-tenant avant toute ouverture SaaS.

