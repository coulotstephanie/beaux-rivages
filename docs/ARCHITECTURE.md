# Architecture technique

## Principes

- `DEVELOPER_HANDBOOK.md` : normes officielles de développement et définition
  de Done.
- `SYSTEM_ARCHITECTURE.md` : vue globale des couches, infrastructures et flux
  métier de référence.
- `BUSINESS_RULES.md` : source unique de vérité des règles et invariants métier.
- `app/` : routes Next.js App Router et composition des pages.
- `features/` : destination Feature First des nouvelles capacités et gabarit
  de migration verticale des domaines historiques.
- `components/` : composants de présentation et interactions client.
- `components/ui`, `components/layouts`, `components/providers` et
  `components/states` : primitives partagées, compositions applicatives et
  états transverses.
- `content/`, `data.ts`, `experiences.ts`, `recommendations.ts` : contenu officiel actuel.
- `media/` : registres typés ; une propriété ne peut référencer que ses médias.
- `platform/` : contrats métier indépendants de Next.js et des fournisseurs.
- `platform/auth/` : identité Supabase Auth, rôles et autorisation des API.
- `i18n/` : locales cibles et premiers catalogues traduisibles.

`platform/` n’est pas déplacé en masse. Chaque domaine est migré vers
`features/` dans une PR atomique, en conservant temporairement ses exports
publics pour protéger les fonctionnalités existantes.

`features/reservations` constitue la première migration verticale : la feature
orchestre les calendriers et la tarification historiques derrière des
repositories injectables. L’ancien import du calendrier reste un export de
compatibilité pendant la convergence.

## Frontières

Les pages publiques peuvent lire les snapshots officiels. Elles ne doivent jamais
écrire directement dans des fichiers. Toute future mutation passe par
`ContentAdminService`, un `AdminAuthorizer` et un `ContentRepository` inséré par
dépendance.

Les connecteurs externes implémentent des interfaces :

- `CalendarConnector` pour les flux iCal ;
- `ReservationRepository` pour la persistance ;
- `PaymentGateway` pour un paiement futur ;
- `ContentRepository` pour JSON, Git, base SQL ou CMS.

Cette séparation permet de changer de fournisseur sans modifier les composants
publics.

## Authentification administrative

La route `/api/auth/staff` obtient une session auprès de Supabase Auth avec la
clé publique et la place dans un cookie `HttpOnly`. `authorizeStaff()` vérifie
ce jeton côté serveur, charge le rôle depuis `app_user_roles` et applique la
permission avant l’utilisation du client Supabase privilégié. Le client
d’authentification et le client privilégié restent deux instances séparées.

Le secret administrateur historique est un mécanisme de migration. Il doit être
désactivé avec `ADMIN_TOKEN_FALLBACK_ENABLED=false` après activation des comptes
individuels.

## Événements métier

`EVENT_CATALOG.md` définit les noms officiels. La cible utilise des machines à
états dans le domaine et une outbox PostgreSQL transactionnelle. Les
consommateurs sont indépendants, idempotents et rejouables. Cette couche n’est
pas encore implémentée : les appels existants restent en place jusqu’à leur
migration verticale et testée.

## Rendu

Le contenu éditorial reste rendu côté serveur et pré-généré autant que possible.
Les composants clients sont réservés aux filtres, galeries, comparateurs,
calendriers et formulaires. Aucun secret ne doit porter le préfixe
`NEXT_PUBLIC_`.
