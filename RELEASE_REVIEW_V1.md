# Beaux Rivages — Recette fonctionnelle V1.0

Date : 27 juillet 2026

## Périmètre contrôlé

- Accueil, index et fiches des trois maisons.
- Index et guides Île de Ré, Île d’Oléron et La Rochelle.
- Carnet Beaux Rivages, personnalisation, réservation et FAQ.
- Menu mobile, liens, ancres, filtres, accordéons, calendriers, sélecteurs,
  galeries et transmission des choix entre les parcours.
- Rendus 390 px, 768 px et 1440 px.
- Erreurs navigateur, débordements horizontaux, noms accessibles, contrastes,
  structure des titres, médias, métadonnées et données structurées.

## Anomalies détectées et corrigées

1. Quatre liens-images de la section « Les gestes des vacances » ne possédaient
   pas de nom accessible. Un libellé contextualisé est maintenant fourni.
2. L’en-tête blanc de la FAQ manquait de contraste sur son fond clair avant
   défilement. Le composant d’en-tête accepte désormais un contraste sombre,
   appliqué à cette page.
3. Plusieurs micro-textes du tunnel de réservation étaient sous le seuil WCAG :
   signatures des maisons, capacités, message d’aide, libellés du récapitulatif
   et estimation tarifaire. Leurs couleurs ont été renforcées.
4. Les numéros et libellés de navigation du Carnet étaient trop clairs. Ils
   utilisent désormais les teintes éditoriales à contraste renforcé.
5. Le composant `CountdownJourney`, sans import ni rendu dans la Candidate, a
   été supprimé.

La mention « Maison Heureuse » a été contrôlée : il s’agit bien du nom de la
résidence historique du Nid d’Été et non d’une quatrième maison de la marque.

## Scénarios fonctionnels validés

- Menu mobile : ouverture, fermeture par Échap, état `aria-expanded` et retrait
  correct de `inert`.
- Galeries : ouverture, focus initial, navigation clavier, compteur et fermeture
  par Échap.
- FAQ : neuf questions affichées, filtrage par thème et ouverture des réponses.
- Personnalisation : sélection d’options et conservation dans l’URL de
  réservation.
- Réservation : maison, arrivée, départ, voyageurs, expérience, récapitulatif
  et génération finale d’un lien `mailto:` explicite.
- Crawl : 67 URLs internes et 102 liens avec fragment contrôlés.

## UX, éditorial et qualité visuelle

- Les trois formats conservent la hiérarchie premium, la lisibilité des héros,
  la continuité des appels à l’action et l’accès au bouton Réserver.
- Aucun débordement horizontal de page n’a été relevé sur les parcours
  représentatifs.
- Les galeries horizontales et la navigation du Carnet débordent volontairement
  dans leur propre zone scrollable, sans élargir la page.
- Les textes, noms de maisons, destinations, capacités et promesses ont été
  recoupés avec les données centrales. Aucun doublon éditorial bloquant ni page
  manifestement inachevée n’a été relevé.

## Performance

- Build de production : 44 pages générées.
- JavaScript partagé : 102 kB.
- Parcours le plus chargé contrôlé : réservation, 132 kB au premier chargement.
- Images responsives Next.js en AVIF/WebP, vidéos avec poster et préchargement
  limité, animations désactivables via `prefers-reduced-motion`.

## Validation finale

- `npm run lint` : OK
- `npm run typecheck` : OK
- `npm test` : 18/18
- `npm run build` : OK
- `SITE_URL=http://localhost:3101 npm run test:site` : OK
- Recette navigateur : 21 combinaisons route/viewport représentatives,
  sans erreur console ni débordement de page.
- Parcours interactifs critiques : OK.

## Recommandations avant production

1. Publier les mentions légales, CGV et la politique de confidentialité validées.
2. Connecter le moteur de disponibilités et le paiement ; la V1 actuelle prépare
   une demande par e-mail et ne confirme pas une vente.
3. Confirmer tarifs, conditions des options et droits de diffusion des médias.
4. Documenter les indicateurs commerciaux chiffrés avant communication publique.
5. Effectuer une dernière recette sur iPhone, Android et tablette physiques.
6. Mesurer Lighthouse sur l’URL de production avec le CDN, le domaine et les
   conditions réseau réelles.

## Décision

Candidate apte à une présentation utilisateurs et à une collecte de premiers
retours. La mise en ligne commerciale reste conditionnée aux éléments juridiques,
aux disponibilités réelles et au dispositif de réservation.
