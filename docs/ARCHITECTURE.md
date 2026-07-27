# Architecture technique

## Principes

- `app/` : routes Next.js App Router et composition des pages.
- `components/` : composants de présentation et interactions client.
- `content/`, `data.ts`, `experiences.ts`, `recommendations.ts` : contenu officiel actuel.
- `media/` : registres typés ; une propriété ne peut référencer que ses médias.
- `platform/` : contrats métier indépendants de Next.js et des fournisseurs.
- `i18n/` : locales cibles et premiers catalogues traduisibles.

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

## Rendu

Le contenu éditorial reste rendu côté serveur et pré-généré autant que possible.
Les composants clients sont réservés aux filtres, galeries, comparateurs,
calendriers et formulaires. Aucun secret ne doit porter le préfixe
`NEXT_PUBLIC_`.
