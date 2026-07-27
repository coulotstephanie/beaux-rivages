# Rapport de livraison — Sprints 1, 2 et 3

Date : 26 juillet 2026

## Sprint 1 — Finalisation des trois propriétés

### Travail commun

- Comparaison des trois pages avec les annonces Airbnb publiques.
- Conservation des récits, timelines, scènes de journée, recommandations et séquences premium existantes.
- Réécriture des ouvertures pour présenter la destination avant l’inventaire de la maison.
- Ajout d’une présentation détaillée des pièces.
- Ajout d’informations pratiques et de FAQ spécifiques.
- Ajout du balisage structuré `FAQPage`.
- Personnalisation des appels à l’action selon la signature de chaque maison.
- Nouveaux libellés de conversion : « Imaginer mon séjour », « Voir les disponibilités » et « Choisir mes dates ».
- Titres SEO enrichis avec la localité et descriptions centrées sur les requêtes réellement différenciantes.

### Le Chai des Tortues

- Positionnement renforcé autour de l’ancien chai, de la pierre, de la cuisine et du retour des Halles.
- Ajout des six espaces essentiels : pièce de vie, suite, deux chambres doubles, salles de bain, laverie et petit extérieur.
- Équipements Airbnb intégrés : Airfryer Ninja, Cookeo, robot Kenwood, quatre types de cafetières, plancha, raclette, crêpière, matériel pour fruits de mer, lave-linge séchant et équipements de plage.
- FAQ enrichie sur les distances, la répartition des chambres, les deux salles de bain, la cuisine, le petit extérieur, les bébés et les animaux.
- Galerie conservée et relégendée autour de 30 images locales de qualité.

### Villa Raie Manta

- Positionnement renforcé autour du salon panoramique, de la lumière, de l’océan et du pont.
- Donnée propriétaire retenue : 2 salles de bain et 3 toilettes.
- Galerie resserrée à 15 images : les cadrages informatifs ou trop utilitaires restent archivés dans la médiathèque mais ne cassent plus le rythme hôtelier.
- Les quatre chambres et les deux salles de bain sont représentées.
- FAQ complétée sur les sanitaires, le linge, les couchages, le stationnement, les animaux et l’accès plage.
- CTA final dédié : « Voir l’océan entrer dans la maison ».

### Le Nid d’Été

- Positionnement renforcé autour du portail privé, de la forêt, de la plage et de Fort Boyard.
- Galerie resserrée à 18 images, associant intérieurs Airbnb et paysages Beaux Rivages.
- Les images annotées, les captures avec bandes noires et les visuels purement techniques ne sont plus présentés dans la galerie principale.
- Légendes corrigées après inspection visuelle de la résidence et de la terrasse.
- FAQ complétée sur le linge, les deux stationnements, les couchages, le plain-pied et les règles de la résidence.
- CTA final dédié : « Ouvrir le portail, rejoindre le sable ».

### Incohérences Airbnb conservées hors du discours commercial

- Villa Raie Manta : le résumé Airbnb indique 3 salles de bain ; la donnée confirmée est de 2 salles de bain et 3 toilettes.
- Villa Raie Manta : une phrase évoque un 9e couchage payant tandis que la capacité et le règlement limitent la maison à 8 voyageurs. Le site conserve 8 voyageurs.
- Le Chai des Tortues : le résumé Airbnb affiche « 1 salle de bain et 1 toilette » alors que le descriptif détaillé annonce 2 salles de bain et 2 toilettes. Le site suit le descriptif détaillé existant.
- Le Nid d’Été et le Chai : les listes Airbnb peuvent laisser penser que le linge est inclus, alors que les descriptions le présentent comme une option. Le site indique clairement l’option.

## Sprint 2 — Carnet Beaux Rivages

### Architecture

- Séparation des catégories et des articles dans `carnetData.ts`.
- Un article peut être ajouté par une seule entrée de données.
- Les sections sont générées automatiquement par `CarnetMagazine`.
- Les alternances de tons et les mises en avant sont pilotées par les catégories.
- Chaque article possède désormais une île, une saison, un texte alternatif, une durée, une distance et un conseil personnel.

### Catégories disponibles

1. Restaurants
2. Producteurs
3. Marchés
4. Balades
5. Vélo
6. Plages
7. Couchers de soleil
8. Fort Boyard
9. Familles
10. Gastronomie
11. Activités selon la météo
12. Activités selon la saison

### Ligne éditoriale

- Chaque recommandation contient « Le conseil de Stéphanie & Bruno ».
- Les textes évitent les listes impersonnelles et précisent pourquoi, quand et comment l’adresse ou l’expérience mérite le détour.
- Le SEO présente désormais le Carnet comme un magazine des îles de Ré et d’Oléron.

## Sprint 3 — Expériences premium

### Modèle de données

Chaque expérience contient :

- une image et son texte alternatif ;
- un titre et une promesse éditoriale ;
- une durée ;
- une période idéale ;
- une maison conseillée ;
- le public concerné ;
- une option de séjour éventuelle ;
- un bouton « Ajouter à mon séjour ».

### Collection créée

1. Pack Signature Beaux Rivages
2. Romance
3. Anniversaire
4. Demande en mariage
5. Plateau de fruits de mer
6. Atelier macarons
7. Lever de soleil
8. Coucher de soleil
9. Pêche à pied
10. Balade vélo
11. Bien-être
12. Famille

### Connexion au parcours de réservation

- Le bouton encode l’expérience, la maison conseillée et l’option éventuelle dans l’URL.
- La maison et l’option sont présélectionnées.
- Le nom de l’expérience est ajouté au message du projet de séjour.
- Stéphanie et Bruno peuvent ensuite confirmer la disponibilité, le tarif et les conditions réelles.

## Validation

- TypeScript : réussi.
- Tests d’intégrité : 7/7 réussis.
- Build Next.js de production : réussi.
- Génération statique : 24 pages.
- Crawl du site compilé : 34 URL internes, aucune erreur.
- Médias : tous les fichiers sont enregistrés dans la couche centralisée.
