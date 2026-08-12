# Référencement international — lancement

## Déjà préparé dans le site

- URLs publiques en français, anglais, allemand, espagnol et néerlandais.
- Canonical, `hreflang` et `x-default` centralisés.
- Sitemap multilingue et règles robots pour les espaces privés.
- Données structurées `Organization`, `WebSite`, `VacationRental`, `TouristDestination`,
  `BreadcrumbList` et `FAQPage` selon les pages.
- Emplacements sécurisés pour les codes de vérification Google et Bing.

## Variables de vérification

À enregistrer dans l’hébergement, jamais dans le code :

- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
- `NEXT_PUBLIC_BING_SITE_VERIFICATION`

Après déploiement en production, soumettre `https://www.beaux-rivages.com/sitemap.xml` dans
Google Search Console et Bing Webmaster Tools.

## Google Business Profile

Créer ou revendiquer la fiche avec le nom commercial réel, le téléphone, le site officiel,
les zones desservies et des photographies authentiques. Ne pas créer de fiche séparée pour une
maison sans présence et accueil éligibles selon les règles Google.

## Point à valider avant indexation internationale intensive

Les traductions visibles sont actuellement appliquées dans le navigateur. Une migration vers un
rendu serveur par langue est recommandée afin que le HTML initial, les titres et les données
structurées soient nativement traduits pour chaque URL internationale. Les URL peuvent rester
identiques lors de cette migration.
