# Sprint 4 — Parcours premium et autonomie produit

## Livré

- Comparateur « Quelle maison est faite pour vous ? » avec critères, classement instantané et recommandation finale.
- Mode « Inspire-moi » combinant profil de voyage, centres d’intérêt, maison, expériences, adresses et itinéraire.
- Hero vidéo réutilisable avec ralenti, séquences successives, poster et contrôle de son optionnel.
- Timeline complète du séjour, de J−30 au retour.
- Page éditoriale des saisons : printemps, été, automne, Halloween, Noël, hiver et Pâques.
- Carte du Carnet enrichie et filtrable par restaurants, marchés, plages, producteurs, Fort Boyard, balades et vélo.
- Bloc d’indicateurs de satisfaction sur la page Avis.
- FAQ filtrable par maison, destination, réservation, animaux, enfants, vélo et plages.
- Page « Pourquoi Beaux Rivages ? » : philosophie, hospitalité, valeurs, engagements et histoire familiale.
- Une page SEO et éditoriale pour chacune des 13 expériences, avec conseils pratiques et ajout au séjour.
- Page « Personnaliser » transformée en configurateur avec sélection et estimation en direct.
- Navigation principale, menu mobile, pied de page, métadonnées et sitemap alignés sur les nouveaux parcours.

## Améliorations réalisées de notre propre initiative

- Réutilisation des données centrales existantes pour éviter les contenus divergents entre comparateur, réservation, expériences et Carnet.
- Conservation des contrats d’interface déjà couverts par les tests.
- Ajout de liens croisés entre collection d’expériences, pages détaillées et réservation.
- Présentation d’estimations comme indicatives afin de ne pas transformer une option saisonnière en promesse tarifaire ferme.
- Responsive dédié pour tous les nouveaux parcours.

## Opportunités proposées pour le sprint suivant

- Remplacer la séquence vidéo unique par cinq films sourcés et optimisés : océan, pont de Ré, Fort Boyard, maison, logo.
- Connecter la carte à de vraies coordonnées et à un fond cartographique sobre, avec calcul des distances depuis chaque maison.
- Alimenter les statistiques d’avis depuis une source vérifiable et datée ; les pourcentages éditoriaux devront être confirmés avant publication.
- Ajouter des photos saisonnières propriétaires pour Halloween, Noël, hiver et Pâques.
- Persister le parcours Inspiration dans la demande de réservation et dans le futur Carnet voyageur.
- Ajouter des données structurées `FAQPage` à la FAQ globale et `TouristAttraction` aux expériences pertinentes.

## Points faibles identifiés

- Un seul film vidéo propriétaire est actuellement disponible ; le composant est prêt pour plusieurs séquences, mais le récit complet dépend des futurs médias.
- La carte reste éditoriale et schématique, sans géolocalisation réelle.
- Certaines expériences utilisent encore des visuels d’ambiance faute d’une photographie dédiée.
- Les prix de personnalisation sont des estimations et doivent être validés avant mise en production commerciale.
- Les métriques 97 %, 98 % et 99 % doivent être reliées à une méthode de calcul explicite avant communication publique.

## Validation

- TypeScript : OK
- Tests d’intégrité : 9/9
- Build Next.js de production : OK
- 44 pages statiques ou dynamiques générées
