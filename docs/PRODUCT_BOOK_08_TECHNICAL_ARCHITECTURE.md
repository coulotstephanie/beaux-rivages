# PRODUCT_BOOK_08_TECHNICAL_ARCHITECTURE.md

Version : 1.0  
Projet : Beaux Rivages  
Statut : Référence technique  
Dernière mise à jour : 29 juillet 2026

## 1. Vision technique

Construire une plateforme SaaS premium capable de gérer plusieurs propriétés,
marques et utilisateurs. Les priorités sont la maintenabilité, l’évolutivité, la
sécurité, les performances et l’expérience développeur.

## 2. Principes

- Clean Architecture ;
- Domain Driven Design ;
- SOLID ;
- DRY ;
- KISS ;
- Feature First ;
- composition plutôt qu’héritage.

## 3. Stack

Frontend : Next.js 15 App Router, React 19, TypeScript strict, Tailwind CSS,
shadcn/ui, React Hook Form, Zod, TanStack Query et Framer Motion.

Backend : Supabase, PostgreSQL, Auth, Storage, Realtime, Edge Functions et
tâches planifiées.

Déploiement : Vercel, GitHub et GitHub Actions.

## 4. Architecture générale

```text
Presentation
    ↓
Application
    ↓
Domain
    ↓
Infrastructure
```

La logique métier ne dépend jamais de Next.js ni de Supabase.

## 5. Structure cible

```text
apps/
  web/
packages/
  ui/
  domain/
  application/
  infrastructure/
  shared/
supabase/
docs/
scripts/
tests/
.github/
```

Cette structure est une cible d’évolution. Toute migration doit rester
incrémentale et préserver les fonctionnalités existantes.

## 6. Modules métiers

Réservation, Property, Guest Journey, CRM, Pricing, Contracts, Payments,
Concierge, Maintenance, Housekeeping, Analytics, Dashboard et Auth.

Chaque module peut contenir :

```text
components/
hooks/
services/
repositories/
schemas/
types/
actions/
tests/
```

Aucun code partagé ne doit être copié.

## 7. Domain Driven Design

Les domaines principaux sont Reservation, Property, Guest, CRM, Revenue,
Concierge, Housekeeping et Maintenance. Les règles métier, états et événements
appartiennent au domaine et restent indépendants des fournisseurs.

## 8. Clean Architecture

```text
UI
 ↓
Use Cases
 ↓
Domain
 ↓
Repository Interface
 ↓
Repository Supabase
```

Les composants React ne connaissent jamais directement Supabase.

## 9. Frontend

Les Server Components sont privilégiés. Les Client Components sont limités aux
interactions. L’organisation cible distingue `app`, `components`, `features`,
`hooks`, `providers`, `styles` et `lib`.

## 10. Backend

Le backend utilise PostgreSQL, Supabase Auth, Storage, Realtime, Edge Functions
et Cron Jobs. Aucune logique critique ne réside uniquement dans le navigateur.

## 11. Base de données

Les tables métier possèdent lorsque cela est pertinent un UUID, les dates de
création et mise à jour, les acteurs de ces modifications et un statut. Les
relations sont explicites, les suppressions sensibles sont logiques, et chaque
modification passe par une migration versionnée.

## 12. API

La cible publique est versionnée :

```text
/api/v1/reservations
/api/v1/payments
/api/v1/contracts
/api/v1/crm
```

Format cible :

```json
{
  "success": true,
  "data": {},
  "error": null,
  "meta": {}
}
```

Les routes existantes restent compatibles pendant la migration.

## 13. Authentification et rôles

Supabase Auth prend en charge e-mail et mot de passe, Magic Link et OAuth si
activé. La MFA est prévue.

Rôles cibles : Super Admin, Administrateur, Hôte, Concierge, Personnel ménage,
Maintenance et Voyageur. Les permissions sont appliquées par les API et les
politiques RLS PostgreSQL.

## 14. Sécurité

Les entrées sont validées avec Zod, nettoyées et journalisées lorsque
nécessaire. La plateforme protège contre XSS, CSRF, injections SQL et brute
force. Les secrets restent dans les variables d’environnement.

## 15. Gestion des fichiers

Supabase Storage devient la source des documents et médias administrables.
Organisation cible :

```text
properties/
  chai-des-tortues/
  villa-raie-manta/
  le-nid-d-ete/
guests/
contracts/
invoices/
uploads/
```

Les médias publics versionnés dans Git restent compatibles jusqu’à leur
migration contrôlée.

## 16. Observabilité

Logs structurés, traçabilité des erreurs, monitoring des performances et alertes
sur les erreurs critiques.

## 17. Tests

Objectif minimal de couverture : 80 %. Tests unitaires, intégration, E2E et
accessibilité.

## 18. CI/CD

Pipeline cible : lint, TypeScript, tests, build, Preview Vercel, validation puis
production.

## 19. Définition de Done

Une fonctionnalité est terminée lorsque le code est relu, les tests passent, la
documentation et les migrations sont à jour, les performances et la sécurité
sont validées, l’accessibilité est conforme et la Pull Request est approuvée.

## 20. Architecture événementielle

Chaque action métier importante produit un événement. Un module ne doit pas
appeler directement un autre domaine lorsqu’un événement permet de les
découpler.

```text
ReservationCreated
  ├─ CRM
  ├─ Guest Journey
  ├─ Analytics
  ├─ Revenue Management
  └─ Notifications
```

Le catalogue officiel est maintenu dans
`EVENT_CATALOG.md`. Les événements sont versionnés, traçables, idempotents et
rejouables.

## 21. Moteur d’automatisation

Une règle est composée d’un déclencheur, de conditions, d’actions et d’une
journalisation. Les règles sont configurables. Une confirmation de réservation
peut ainsi créer le contrat, la facture, le Guest Journey et les opérations CRM
sans couplage direct entre ces domaines.

## 22. Scheduler

Les tâches planifiées sont centralisées :

- quotidien 7 h : météo, marées et suggestions ;
- quotidien 2 h : Revenue, Dashboard et rapports ;
- horaire : Channel Manager, calendriers et paiements.

Chaque exécution possède une clé d’idempotence, un état, un historique, une
politique de nouvelle tentative et une alerte en cas d’échec.

## 23. Cache et performances

La stratégie combine cache navigateur, TanStack Query, cache Next.js, Supabase
et PostgreSQL. Chaque donnée possède une durée de vie explicite.

Objectifs :

| Mesure | Cible |
| --- | --- |
| ouverture | moins de 2 secondes |
| navigation | moins de 300 ms |
| recherche | moins de 500 ms |
| dashboard | moins de 1 seconde |

Les images utilisent AVIF ou WebP, chargement progressif et lazy loading. Les
Server Components, le streaming et la mesure réelle sont privilégiés.

## 24. Monitoring et sauvegardes

Les erreurs API et JavaScript, les performances et les opérations critiques sont
centralisées et reliées à des alertes administratives.

Les sauvegardes sont quotidiennes avec conservation de 30 jours, snapshots
hebdomadaires et mensuels, et procédure de restauration testée.

## 25. Sécurité avancée

Toutes les API appliquent rate limiting, JWT, permissions et audit. Les
opérations sensibles nécessitent une double validation. Les connexions sont
historisées et les activités inhabituelles détectées.

## 26. Design System technique

Les interfaces partagent Button, Card, Badge, Dialog, Drawer, Popover, Tooltip,
Tabs, Table, Calendar, DatePicker, Uploader, Gallery, Map, Timeline et Charts.
Aucun style spécifique ne doit être ajouté directement dans une page lorsqu’un
composant ou variant partagé peut porter cette responsabilité.

## 27. Conventions

- TypeScript strict, jamais de `any`, préférer `unknown` et les types métier ;
- Zod pour les entrées externes ;
- un composant React, une responsabilité, maximum recommandé de 250 lignes ;
- hooks, providers et composants métier réutilisables ;
- Tailwind factorisé en composants et variants ;
- branches `feature/`, `fix/`, `docs/`, `refactor/`, `release/` ;
- Conventional Commits.

Toute évolution actualise Changelog, Roadmap, Database, API, Architecture et
Workflows.

## 28. Déploiement et qualité

```text
Local → Preview → Staging → Production
```

Aucun déploiement manuel en production. Chaque Pull Request contrôle lint,
TypeScript, tests, accessibilité, responsive, performances et documentation.
Une fonctionnalité Production Ready possède une couverture supérieure à 80 %,
un Lighthouse validé, une accessibilité WCAG AA, une migration et un rollback,
une journalisation, un monitoring et une Pull Request approuvée.

## 29. Vision d’évolution

Le cœur métier doit pouvoir servir plusieurs marques, propriétaires, équipes,
langues, devises, pays, moteurs de réservation, canaux et applications clientes
Web, Mobile et API, sans dépendre d’une technologie particulière.

## 30. Architecture multi-tenant

Hiérarchie cible :

```text
Tenant
  ↓
Brand
  ↓
Property
  ↓
Accommodation
  ↓
Reservation
  ↓
Guest
```

Les données possédées par une organisation sont reliées à `tenant_id` et, selon
leur niveau, à `brand_id`, `property_id` ou `accommodation_id`. La RLS garantit
l’isolation. La migration depuis le modèle mono-tenant suit
`MULTI_TENANCY_STRATEGY.md` et ne peut pas être réduite à l’ajout de colonnes
nullable.

## 31. Architecture modulaire

Les modules Auth, Reservation, Property, Pricing, Guest Journey, CRM,
Housekeeping, Maintenance, Concierge, Payments, Accounting, Analytics,
Dashboard, AI, Notifications, Storage, Maps, Media, Reviews, Loyalty,
Marketing, Contracts, Calendar, Channel Manager, Revenue et Yield isolent UI,
Application, Domain, Infrastructure, tests, documentation et migrations.

Ils communiquent par API ou événements métier, jamais par dépendance
d’infrastructure directe.

## 32. Convention des modules

```text
reservation/
  components/
  hooks/
  actions/
  services/
  repositories/
  schemas/
  types/
  constants/
  utils/
  tests/
  README.md
```

## 33. API Gateway, repositories et use cases

```text
Client → API → Validation → Permissions → Use Case → Repository → Supabase
```

React n’exécute aucune requête SQL. Les interfaces de repository ignorent
Supabase. Les règles résident dans des use cases comme `CreateReservation`,
`CancelReservation`, `GenerateContract`, `ScheduleCleaning` ou
`CalculatePrice`.

## 34. CQRS et événements persistés

Les commands modifient les agrégats et produisent des événements. Les lectures
utilisent des projections optimisées pour Dashboard, CRM et Analytics.

La table cible `domain_events` contient l’identifiant, l’agrégat, le nom, la
version, le payload, les dates, l’état, les tentatives et le contexte tenant.
Tous les événements sont rejouables.

## 35. Storage et moteur média

Les originaux sont conservés et versionnés. Les miniatures et formats AVIF,
WebP et JPEG sont générés automatiquement. Chaque média porte titre,
description, alt SEO, auteur, date, propriété, catégorie, orientation, tags,
GPS, compression, miniature et formats.

## 36. Internationalisation et SEO

Toutes les chaînes migrent vers des clés i18n contextualisées avec variables.
Langues cibles : français, anglais, allemand, espagnol, néerlandais et italien.

Chaque page possède title, description, OpenGraph, Twitter Card, Schema.org,
canonical, sitemap, breadcrumb et JSON-LD.

## 37. Cartographie

Un composant cartographique unique affiche et filtre points d’intérêt,
restaurants, marchés, plages, producteurs, pistes cyclables, Fort Boyard et
ports.

## 38. Notifications et templates

Canaux : e-mail, SMS, push, WhatsApp futur et notifications internes. Chaque
notification possède template, variables, langue, priorité, journal, statut,
historique et stratégie de retry.

Tous les messages utilisent le même moteur de templates et des variables
normalisées, sans duplication éditoriale.

## 39. Permissions déclaratives

Les permissions utilisent des clés comme `reservation.read`,
`reservation.create`, `payment.refund`, `crm.export`,
`maintenance.assign` ou `analytics.view`. Les rôles composent ces permissions.
La source officielle est `PERMISSIONS_CATALOG.md`.

## 40. Audit, monitoring et scalabilité

Les connexions, suppressions, paiements, contrats, exports, modifications et
annulations enregistrent acteur, IP, navigateur, date, ancienne et nouvelle
valeur.

Le monitoring couvre temps de réponse, erreurs, disponibilité, paiements,
synchronisations, e-mails, Storage, API et tâches planifiées.

L’architecture vise 10 à 10 000 logements sans modification majeure, par
partitionnement, projections, traitements asynchrones et observabilité mesurée.

## 41. Gouvernance

Chaque fonctionnalité doit être cohérente avec la vision, réutilisable,
documentée, testée, conforme aux conventions, compatible avec les modules futurs
et évolutive sans refonte.
