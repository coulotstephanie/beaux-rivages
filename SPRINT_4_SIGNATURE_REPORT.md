# Sprint 4 — Expérience Beaux Rivages Signature

Date de recette : 27 juillet 2026

## Livraison

### Nouvelles pages

- `/construisez-votre-sejour` : assistant accessible en trois étapes (profil, envies, proposition de séjour et maison conseillée).
- `/avant-arrivee` : checklist locale, météo intelligente, contrôle manuel des marées, liens d’ouverture officiels et carte pratique.
- `/conseils` : sélection éditoriale de Stéphanie & Bruno présentée comme un magazine.

### Pages enrichies

- `/choisir` : comparateur complet des trois maisons.
- `/pourquoi-revenir` : synthèse thématique de 198 expériences Airbnb publiques déjà référencées.
- `/saisons` : galerie vidéo avec les films authentiques du Chai des Tortues.
- Galeries des maisons et photothèque : zoom, plein écran, diaporama, clavier, focus contenu et balayage tactile.

### Composants créés

- `SmartWeatherAdvisor` et moteur typé `weatherEngine`.
- `SignatureStayBuilder`.
- `HouseComparisonTable`.
- `ArrivalChecklist`.

## Qualité des données

- Météo actuelle : Open-Meteo, sans clé ni collecte de données personnelle.
- Les recommandations tiennent compte de la pluie, de la température, du vent et de sa direction, de la saison et de l’état de marée sélectionné.
- Les horaires de marchés et restaurants restent reliés aux offices et établissements officiels : aucune ouverture incertaine n’est présentée comme garantie.
- Les prédictions de marées SHOM nécessitant un abonnement API, aucune fausse donnée « en direct » n’a été inventée. Le voyageur indique l’état observé et dispose d’un lien de vérification SHOM.
- Les données Booking n’ont pas été reprises faute de source publique vérifiable et exploitable. Les graphiques et synthèses restent explicitement attribués aux avis Airbnb publics existants.

## Images et vidéos

- Aucun nouveau média externe n’a été téléchargé.
- Les nouvelles pages réemploient la photothèque déjà auditée et ses sources/licences existantes.
- Les deux vidéos ajoutées à la galerie des saisons proviennent du dossier média du Chai des Tortues et sont identifiées comme telles.

## Accessibilité, SEO et performance

- Nouvelles métadonnées centralisées, URL canoniques, données structurées et routes de sitemap.
- Contrôles tactiles de 44 px minimum, états `aria-pressed`, progression annoncée, navigation clavier et respect de `prefers-reduced-motion`.
- Cartes chargées côté client, images optimisées par Next.js et médias différés hors écran.

Mesures Lighthouse mobile en laboratoire :

| Page / état | Performance | Accessibilité | Bonnes pratiques | SEO |
| --- | ---: | ---: | ---: | ---: |
| Accueil production avant Sprint 4 | 92 | 100 | 100 | 100 |
| Accueil build Sprint 4 | 99 | 100 | 100 | 100 |
| Avant votre arrivée, build Sprint 4 | 98 | 100 | 100 | 100 |

Les scores de laboratoire peuvent légèrement varier selon le réseau et la machine.

## Vérifications

- `npm run lint` : réussi.
- `npm run typecheck` : réussi.
- `npm test` : 20/20 tests réussis.
- `npm run build` : réussi.
- Crawl de production local : 70 URL internes et 89 ancres vérifiées.
- Contrôle visuel desktop et mobile effectué sur les nouveaux parcours.

## Recommandation suivante

L’espace privé « Mon séjour » doit constituer un sprint distinct : authentification, autorisations par réservation, stockage sécurisé des contrats et codes d’arrivée, journal d’accès et conformité RGPD sont indispensables avant d’y exposer la moindre donnée voyageur.
