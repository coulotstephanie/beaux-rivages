# Sprint 3 — Carnet Beaux Rivages Premium

Date de validation : 27 juillet 2026

## Résultat

Le Carnet Beaux Rivages a été transformé en guide premium responsive réunissant :

- 24 repères documentés sur l’Île de Ré, l’Île d’Oléron et La Rochelle ;
- une carte Leaflet/OpenStreetMap réellement interactive ;
- huit filtres : adresses, plages, producteurs, incontournables/Fort Boyard, marchés, vélo, parkings et bornes électriques ;
- des fiches avec coordonnées, adresse, distance depuis la maison de référence, temps à vélo, temps à pied, lien officiel, itinéraire et conseil des hôtes ;
- sept itinéraires « Une journée idéale » : famille, couple, gastronomie, vélo, nature, pluie et week-end ;
- un mode Inspiration immersif en trois scènes plein écran ;
- une liste Schema.org géolocalisée pour le Carnet ;
- des métadonnées OpenGraph et Twitter Card conservées via la couche SEO existante.

## Pages enrichies

- `/carnet` : guides, fiches, carte, filtres, informations pratiques et journées idéales.
- `/inspiration` : trois scènes immersives plein écran et accès direct au Carnet.
- `/destinations/ile-de-re` : guide existant complété par les nouvelles fiches du Carnet.
- `/destinations/ile-d-oleron` : guide existant complété par les nouvelles fiches du Carnet.
- `/destinations/la-rochelle` : guide existant complété par les nouvelles fiches du Carnet.

## Nouveaux composants

- `PremiumPlaceCollection` : collections éditoriales par destination.
- `PremiumInteractiveMap` : carte Leaflet, marqueurs, fiches et filtres.
- `PremiumInteractiveMapLoader` : chargement navigateur différé pour préserver le rendu statique et les Core Web Vitals.
- `IdealDays` : sept itinéraires horaires.
- `carnetPremiumData.ts` : données TypeScript strictes des lieux, cartes et itinéraires.

## Médias et droits

Aucune image protégée ni image extraite d’un site d’établissement n’a été téléchargée.

Le Sprint réutilise trois fichiers Wikimedia Commons déjà optimisés dans le projet :

| Image | Auteur | Licence | Source |
| --- | --- | --- | --- |
| Port de Saint-Martin-de-Ré | Angelo Brathot | Domaine public | https://commons.wikimedia.org/wiki/File:Port_de_St_Martin-de-R%C3%A9_T_%2845053203774%29.jpg |
| Pointe de Chassiron | Dimimis | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Pointe_de_Chassiron.jpg |
| Entrée du Vieux-Port de La Rochelle | Jebulon | CC0 | https://commons.wikimedia.org/wiki/File:Entrance_La_Rochelle_old_harbor.jpg |

Les crédits et licences sont affichés dans les fiches et le mode Inspiration. Les images passent par `next/image`, avec formats AVIF/WebP, tailles responsives et chargement différé hors contenu prioritaire.

## Liens officiels intégrés

- Destination Île de Ré : https://www.iledere.com/
- Itinéraires vélo de l’Île de Ré : https://www.iledere.com/organiser-activites-et-loisirs/itineraires-balades-et-randonnees/a-velo/
- Office de tourisme Île d’Oléron – Marennes : https://www.ile-oleron-marennes.com/
- Office de tourisme de La Rochelle : https://www.nous-larochelle.fr/fr
- Chez Nina · Nina Métayer : https://larochelle.delicatisserie.com/click-and-collect/
- Huîtres et Ma Ré : https://www.huitresetmare.fr/
- La Martinière : https://la-martiniere.fr/
- La Tartentière : https://www.latartentiere.com/
- Ré Eduk Coach : https://www.reedukcoach.fr/
- Bio Sens : https://www.planity.com/bio-sens-17940-rivedoux-plage
- Aquarium La Rochelle : https://www.aquarium-larochelle.com/
- Tours de La Rochelle : https://www.tours-la-rochelle.fr/
- Musée maritime : https://museemaritime.larochelle.fr/
- Parkings de La Rochelle : https://www.larochelle.fr/vie-quotidienne/stationnement/stationnement-parkings
- Bornes électriques de La Rochelle : https://www.larochelle.fr/vie-quotidienne/stationnement/foire-aux-questions
- Cartographie : https://www.openstreetmap.org/

Bio Sens ne publie pas de site autonome identifiable. Sa page de réservation vérifiée est utilisée sans la présenter comme un site propriétaire.

## Accessibilité

- filtres utilisables au clavier et état actif exposé avec `aria-pressed` ;
- marqueurs Leaflet nommés pour les technologies d’assistance ;
- liste HTML complète en complément de la carte visuelle ;
- libellé et statut de chargement de la carte ;
- textes alternatifs descriptifs ;
- crédits accessibles ;
- animations neutralisées avec `prefers-reduced-motion` ;
- anciennes ancres du Carnet conservées pour éviter les liens orphelins.

## SEO

- métadonnées canonical, OpenGraph et Twitter Card conservées ;
- schéma `ItemList` contenant les lieux, coordonnées `GeoCoordinates`, destination, image et URL officielle ;
- contenu éditorial rendu côté serveur ;
- carte chargée côté navigateur sans bloquer l’indexation du contenu ;
- URL internes et ancres vérifiées par crawl.

## Lighthouse mobile — `/carnet`

Mesure effectuée avec Lighthouse 12.8.2, même profil mobile.

| Catégorie | Avant, production | Après, build local |
| --- | ---: | ---: |
| Performance | 84 | 92 |
| Accessibilité | 100 | 100 |
| Bonnes pratiques | 100 | 100 |
| SEO | 100 | 100 |
| Total Blocking Time | 410 ms | 120 ms |
| Cumulative Layout Shift | 0 | 0 |

Le LCP mesuré varie de 2,6 s à 3,2 s sur cette exécution synthétique, tandis que le score global progresse grâce à la forte réduction du temps de blocage. Les résultats devront être complétés après mise en production par les données réelles Core Web Vitals.

## Vérifications

- `npm run lint` : réussi ;
- `npm run typecheck` : réussi ;
- `npm test` : 18/18 tests réussis ;
- `npm run build` : réussi, 44 pages générées ;
- crawl local : 67 URL et 85 ancres internes validées ;
- Lighthouse : 92 / 100 / 100 / 100.

