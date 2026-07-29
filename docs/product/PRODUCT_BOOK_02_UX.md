# Beaux Rivages — Spécification UX

Version : 1.0  
Auteur : Product Management & Design  
Statut : document de référence

## 1. Objet

Ce document décrit les écrans, comportements, états et règles d’interaction de la plateforme Beaux Rivages. Il complète la [Vision produit](PRODUCT_BOOK_01_VISION.md).

Il sert de référence aux équipes produit, design, développement, contenu, exploitation et recette. Lorsqu’un comportement n’est pas précisé, la décision doit favoriser l’hospitalité, la simplicité, la fiabilité et le minimum de clics.

## 2. Principes d’expérience

### Voyageur

- Émotion avant transaction.
- Une action principale identifiable par écran.
- Prix, disponibilité et conditions compréhensibles avant engagement.
- Personnalisation présentée comme une attention ou une expérience, jamais comme une vente agressive.
- Continuité entre découverte, réservation, préparation, séjour et fidélisation.

### Équipe Beaux Rivages

- Priorités du jour avant données historiques.
- Une information saisie une seule fois.
- Actions importantes confirmées et journalisées.
- État du système visible : chargé, synchronisé, hors ligne, en erreur.
- Interfaces utilisables debout, sur mobile et avec une seule main lorsque pertinent.

## 3. Navigation globale

### En-tête public

L’en-tête donne accès aux maisons, destinations, expériences, Carnet, personnalisation et réservation.

Comportements :

- logo renvoyant à l’accueil ;
- menu clavier et tactile ;
- indication de la page active ;
- bouton de réservation toujours identifiable sans dominer l’univers éditorial ;
- réduction progressive de l’en-tête au défilement sans masquer le contenu ;
- menu mobile plein écran ou panneau accessible, avec blocage du défilement arrière ;
- touche `Échap` et bouton explicite pour fermer.

### Pied de page

Le pied de page regroupe navigation secondaire, contacts, informations légales, destinations, maisons et inscription à la newsletter.

Toute inscription affiche un état de progression, une confirmation ou une erreur actionnable. Aucun formulaire ne perd sa saisie après une erreur.

## 4. États communs

Chaque écran dynamique prévoit :

- **chargement initial** : skeleton stable, sans déplacement brutal ;
- **chargement d’action** : bouton désactivé avec libellé explicite ;
- **vide** : explication et prochaine action utile ;
- **erreur récupérable** : message humain et bouton Réessayer ;
- **erreur bloquante** : contexte, conséquence et moyen de contacter Beaux Rivages ;
- **succès** : confirmation près de l’action, annoncée aux technologies d’assistance ;
- **hors ligne** : état visible et distinction entre données consultables et actions différées ;
- **permission insuffisante** : aucune donnée sensible affichée, retour vers un écran autorisé.

## 5. Accueil

### Objectif

Faire ressentir l’univers Beaux Rivages avant d’exposer les tarifs.

### Structure

1. Hero immersif avec promesse de marque.
2. Présentation des trois maisons.
3. Découverte des îles et destinations.
4. Expériences et gestes d’hospitalité.
5. Mot de Stéphanie et Bruno.
6. Preuves de confiance et engagements.
7. Appel à choisir une maison ou préparer un séjour.

### Comportements

- médias optimisés, poster pour les vidéos et lecture respectant les préférences système ;
- aucun son automatique ;
- parallaxe légère désactivée avec `prefers-reduced-motion` ;
- cartes entièrement accessibles sans lien imbriqué ;
- images accompagnées de textes alternatifs utiles.

## 6. Maisons

### Liste `/maisons`

Présente les trois maisons avec image réelle du logement, localisation, capacité, personnalité et bénéfice principal.

Filtres éventuels limités aux critères décisifs : destination, capacité, animaux, proximité plage. Les résultats s’actualisent sans perdre la position de lecture.

### Fiche maison

Routes :

- `/maisons/chai-des-tortues`
- `/maisons/villa-raie-manta`
- `/maisons/nid-d-ete`

Structure :

1. Hero propre à la maison.
2. Résumé pratique : voyageurs, chambres, salles d’eau, localisation.
3. Galerie et visite visuelle.
4. Pièces et équipements.
5. Expériences recommandées.
6. Informations pratiques et règles.
7. Disponibilités et appel à réserver.

La galerie fonctionne au clavier, au toucher et au zoom. Fermer la visionneuse restaure le focus sur l’image d’origine.

## 7. Aide au choix

### `/choisir`

Compare les maisons selon les besoins réels du voyageur. Le résultat explique pourquoi une maison est recommandée et laisse toujours consulter les autres.

### `/construisez-votre-sejour`

Questionnaire progressif :

- profil du groupe ;
- intérêts ;
- durée ;
- besoins bébé ou animal ;
- rythme souhaité.

La progression est visible. Les réponses peuvent être modifiées sans recommencer. Le résultat alimente le parcours de réservation et le Carnet, sans créer de profil nominatif avant consentement.

## 8. Réservation directe `/reserver`

### Étapes

1. Maison.
2. Dates et disponibilité.
3. Voyageurs.
4. Expériences et attentions.
5. Coordonnées.
6. Récapitulatif.
7. Paiement ou demande selon le mode actif.
8. Confirmation.

### Règles

- une barre d’étapes indique position et étapes restantes ;
- retour en arrière sans perte de saisie ;
- contrôles de capacité et de dates au plus tôt ;
- nouvelle vérification de disponibilité avant création ;
- décompte détaillé : nuits, ménage, taxe de séjour, expériences, remise, acompte et solde ;
- aucune case commerciale précochée ;
- erreurs reliées à leur champ et résumées en tête de l’étape ;
- double clic ou réessai réseau sans double réservation grâce à l’idempotence ;
- confirmation avec référence, prochaine étape et copie envoyée au voyageur.

Sur mobile, le récapitulatif devient un panneau repliable et le bouton d’étape reste accessible sans masquer le contenu.

## 9. Personnalisation `/personnaliser`

### Menu

Accueil, Expériences, Services, Paniers gourmands, Bien-être, Famille, Animaux, Mobilité, Demandes spéciales, Mon panier et Historique.

### Catalogue

Les cartes présentent bénéfice, contenu, tarif ou mention « sur demande », disponibilité conditionnelle et bouton « Ajouter à mon séjour ».

### Panier

- modification de quantité ;
- suppression immédiate avec possibilité d’annuler brièvement ;
- total recalculé côté interface puis vérifié côté serveur ;
- code privilège ;
- référence et e-mail de réservation pour vérifier l’identité ;
- confirmation précisant que les expériences soumises à disponibilité seront validées avant paiement.

### Demande spéciale

Formulaire pour anniversaire, mariage, demande en mariage, bébé, surprise, allergies et régimes alimentaires. Les informations sensibles sont limitées au nécessaire et visibles uniquement par les rôles autorisés.

## 10. Expériences

### Liste `/experiences`

Collection éditoriale avec images immersives, durée, saison idéale, public et maison recommandée.

### Détail `/experiences/[slug]`

Présente déroulé, inclusions, conditions, partenaire éventuel, saisonnalité et actions « Ajouter au séjour » ou « Demander conseil ».

Une expérience indisponible reste consultable si elle apporte de l’inspiration, mais son statut et ses alternatives sont explicites.

## 11. Destinations et Carnet

### Destinations

`/destinations` présente Île de Ré, Île d’Oléron et La Rochelle. Chaque fiche `/destinations/[slug]` regroupe paysages, marchés, plages, patrimoine, gastronomie et accès.

### Carnet `/carnet`

Guide éditorial public avec :

- cartes interactives ;
- bonnes adresses ;
- itinéraires ;
- plages ;
- marchés et producteurs ;
- recommandations saisonnières ;
- idées selon la météo.

Les filtres sont conservés pendant la navigation. Une carte possède toujours une alternative en liste.

### Carnet voyageur `/carnet-voyageur`

Espace lié au séjour : compte à rebours, programme, favoris, recommandations météo et informations pratiques. Les codes d’accès ne sont visibles qu’au moment autorisé et après vérification du droit d’accès.

## 12. Inspiration et contenus de marque

Routes concernées : `/inspiration`, `/saisons`, `/coulisses`, `/mot-de-stephanie`, `/pourquoi-beaux-rivages`, `/pourquoi-revenir`, `/engagements`, `/conseils` et `/sejour`.

Ces écrans privilégient récit, photographie et respiration. Ils utilisent une navigation éditoriale courte, des liens contextuels et un appel à l’action discret. Aucun carrousel automatique ne doit imposer son rythme.

## 13. Photothèque `/phototheque`

Collections filtrables par maison, destination et ambiance.

Comportements :

- ouverture en visionneuse ;
- navigation précédent/suivant au clavier et au toucher ;
- préchargement limité aux images voisines ;
- fermeture par bouton et touche `Échap` ;
- focus piégé dans la visionneuse puis restauré ;
- image de remplacement et message si un média échoue.

## 14. FAQ, avis et avant-arrivée

### FAQ `/faq`

Accordéons accessibles avec état ouvert annoncé. Recherche simple si le volume augmente.

### Avis `/avis`

Avis authentifiés ou clairement attribués, filtres sobres et lien vers la plateforme source lorsque possible.

### Avant-arrivée `/avant-arrivee`

Explique les étapes précédant le séjour, les informations attendues et le moment d’envoi des accès. Cet écran ne révèle aucune donnée privée.

## 15. Espace voyageur

### Accueil

Affiche le prochain séjour, le compte à rebours, les actions attendues et les messages récents.

### Rubriques

- réservation et voyageurs ;
- paiements et factures ;
- contrat ;
- expériences ;
- messages ;
- Carnet ;
- informations d’arrivée ;
- favoris ;
- historique ;
- avis après départ.

Les informations sont cloisonnées par réservation. Les accès expirés ne donnent plus accès aux codes sensibles. Toute modification importante est confirmée et historisée.

## 16. Authentification administrative

L’écran d’accès explique le périmètre sécurisé sans révéler l’existence de données. Les erreurs d’authentification restent génériques et les tentatives sont limitées.

À terme, les rôles sont : administrateur, Stéphanie, Bruno, concierge, personnel ménage et lecture seule. Chaque rôle ne voit que les menus et actions autorisés.

## 17. Back Office — tableau de bord

L’accueil répond à trois questions :

1. Que se passe-t-il aujourd’hui ?
2. Qu’est-ce qui exige une action ?
3. Que se passe-t-il dans les sept prochains jours ?

Widgets : arrivées, départs, séjours en cours, demandes, messages programmés, paiements, contrats, cautions, ménage, maintenance et notifications.

Les cartes d’alerte ouvrent directement la liste filtrée correspondante.

## 18. Back Office — recherche globale

Recherche voyageurs, réservations, maisons, contrats, factures et paiements.

Comportements :

- résultats dès deux caractères ;
- regroupement par type ;
- navigation au clavier ;
- surbrillance du terme ;
- aucune donnée hors permission ;
- ouverture de la fiche sans perdre la recherche.

## 19. Réservations et calendrier

### Calendrier

Vues jour, semaine, mois et année. Couleurs par maison et marqueurs par origine. Affiche réservations, blocages, ménage et maintenance.

Le glisser-déposer présente l’effet avant validation, vérifie les conflits et permet d’annuler. Une alternative clavier est obligatoire.

### Liste

Filtres : maison, plateforme, dates, paiement, statut, voyageur et pays. Les filtres sont reflétés dans l’URL ou conservés pendant la session.

### Fiche réservation

Regroupe séjour, voyageurs, contacts, plateforme, composition du groupe, prix, taxe, caution, paiements, expériences, messages, contrat, ménage, incidents et notes internes.

Les actions sensibles sont regroupées et confirmées : annulation, remboursement, modification de dates et renvoi d’accès.

## 20. CRM voyageurs

La fiche CRM présente identité, langue, pays, historique, maison préférée, dépenses, fidélité, enfants, animaux, préférences, allergies autorisées, notes internes et consentements.

Une donnée déduite est distinguée d’une donnée déclarée. Les notes internes sont datées et attribuées.

## 21. Messages et Guest Journey

Étapes : réservation, préparation, pré-arrivée, arrivée, séjour, départ, remerciement, avis et fidélisation.

Pour chaque message :

- aperçu dans la langue du voyageur ;
- modification avant envoi ;
- duplication ;
- programmation ;
- envoi immédiat avec confirmation ;
- historique et statut ;
- raison visible en cas d’échec ;
- nouvelle tentative sans double envoi.

Les codes sensibles sont injectés uniquement au moment autorisé.

## 22. Contrats, factures et paiements

### Contrats

Génération, aperçu, téléchargement, signature, statut et historique. Une nouvelle version n’écrase jamais un document signé.

### Paiements

Acompte, solde, caution, remboursements et moyens de paiement. Les montants viennent du serveur. Les actions externes affichent leur état réel : en attente, autorisé, payé, échoué, remboursé.

### Comptabilité

À venir : journal financier, rapprochement, TVA, commissions plateformes, exports et bilans par maison.

## 23. Revenue & Marketing

Rubriques : dashboard, CRM, expériences, fidélité, cartes cadeaux, promotions, campagnes, avis et analyse.

Les campagnes restent en brouillon jusqu’à programmation explicite. Les audiences affichent leur volume avant envoi. Les codes privilège indiquent conditions, période et canaux.

## 24. Channel Manager

Rubriques : Dashboard, Calendrier, Plateformes, Synchronisations, Conflits, Logs et Paramètres.

Chaque plateforme affiche connexion, capacités réellement disponibles, dernière synchronisation et erreur éventuelle. Une synchronisation peut être rejouée. Les conflits présentent origine, dates, conséquence, proposition de résolution et historique.

Une capacité non connectée est affichée comme indisponible, jamais simulée.

## 25. Yield Management

Rubriques : Dashboard, Recommandations, Calendrier tarifaire, Événements, Stratégies et Historique.

Chaque recommandation affiche tarif actuel, tarif proposé, variation, confiance et facteurs explicatifs. Stéphanie accepte ou refuse. Aucun tarif n’est publié automatiquement.

Les stratégies définissent plancher, plafond, occupation cible et variation maximale.

## 26. Conciergerie interne

Affiche nouvelles demandes, demandes spéciales et expériences à préparer.

Les statuts suivent : demandée, confirmée, paiement attendu, payée, en préparation, livrée, refusée ou annulée. Toute décision déclenche la notification appropriée sans exposer les notes internes au voyageur.

## 27. Housekeeping & Maintenance

Rubriques : Tableau de bord, Planning ménage, Contrôles qualité, Inventaire, Maintenance, Interventions, Stocks, Consommables, Photos et Rapports.

### Check-list

- grandes cibles tactiles ;
- progression visible ;
- sauvegarde après chaque changement ;
- file hors ligne ;
- détection de conflit de version ;
- passage au contrôle qualité uniquement lorsque les éléments obligatoires sont terminés.

### Contrôle qualité

Évaluation de une à cinq étoiles, remarque et décision « Prêt » ou « À corriger ».

### Maintenance

Priorité, responsable, échéance, coût, photos et historique. Une urgence apparaît sur le tableau de bord et peut bloquer la maison.

## 28. Statistiques et Business Intelligence

Les écrans présentent occupation, chiffre d’affaires, ADR, RevPAR, panier moyen, canaux, fidélité, expériences, qualité et coûts.

Règles :

- période et périmètre toujours visibles ;
- comparaison avec période précédente ;
- graphiques accompagnés d’un tableau accessible ;
- définition de chaque KPI ;
- distinction entre données directes, plateformes et estimations ;
- export respectant les filtres.

## 29. Paramètres

Rubriques futures : organisation, maisons, utilisateurs, rôles, intégrations, paiements, modèles, notifications, sécurité, langues et données.

Chaque intégration affiche statut, dernière vérification, capacités et action de déconnexion confirmée. Les secrets ne sont jamais affichés après enregistrement.

## 30. Notifications

Le centre regroupe paiements, contrats, arrivées, départs, messages, maintenance, ménage, conciergerie et système.

Une notification comporte priorité, titre, contexte, date et action. Marquer comme lue ne supprime pas l’événement métier. Les alertes urgentes restent visibles jusqu’à résolution ou acquittement explicite.

## 31. Mode clair et sombre

Le choix respecte d’abord la préférence système, puis la préférence enregistrée. Les deux thèmes respectent WCAG AA. Aucune information ne dépend uniquement d’une couleur.

## 32. Responsive

### Mobile

- navigation simplifiée ;
- une colonne principale ;
- tableaux transformés en cartes ou défilement clairement indiqué ;
- actions principales accessibles au pouce ;
- aucun champ provoquant un zoom involontaire ;
- check-lists utilisables avec une seule main.

### Tablette

Deux colonnes lorsque la lecture le permet, navigation repliable et panneaux latéraux pleine hauteur.

### Desktop

Densité accrue sans réduction des cibles tactiles. Les larges tableaux utilisent en-têtes persistants et colonnes prioritaires.

## 33. Accessibilité

- conformité WCAG AA ;
- ordre de focus logique ;
- focus visible ;
- navigation clavier complète ;
- libellé pour chaque champ ;
- erreurs associées par `aria-describedby` ;
- dialogues avec titre, focus initial et restauration ;
- annonces `aria-live` pour chargements et confirmations ;
- contrastes suffisants ;
- alternative textuelle aux cartes, graphiques, sons et vidéos ;
- respect de `prefers-reduced-motion`.

## 34. Performance perçue

- Server Components pour le contenu stable ;
- streaming et skeleton pour les données lentes ;
- images responsives, formats modernes et dimensions réservées ;
- vidéos différées hors écran ;
- recherche et filtres instantanés sur les données déjà chargées ;
- invalidation ciblée après mutation ;
- aucune animation bloquant une action.

## 35. Sécurité visible

La sécurité doit rassurer sans alourdir :

- confirmation des actions irréversibles ;
- session et rôle visibles dans l’administration ;
- déconnexion accessible ;
- masquage des données sensibles ;
- explication lors d’un accès expiré ;
- aucun détail technique dans les erreurs utilisateur.

## 36. Critères de recette d’un écran

Un écran est prêt lorsque :

- son objectif et son action principale sont évidents ;
- chargement, vide, erreur, succès et permissions sont couverts ;
- clavier, lecteur d’écran, mobile, tablette et desktop sont testés ;
- les données viennent de la source métier autoritaire ;
- les actions sont validées, limitées et journalisées ;
- aucun contenu générique ou factice n’est présenté comme réel ;
- les performances et déplacements de mise en page sont acceptables ;
- la documentation et les tests sont à jour.

## 37. Ordre de livraison UX recommandé

1. Finaliser authentification et rôles.
2. Consolider le Design System administratif.
3. Terminer l’espace voyageur authentifié.
4. Finaliser Comptabilité et Business Intelligence.
5. Transformer Housekeeping en PWA terrain complète.
6. Connecter les APIs partenaires officielles.
7. Ajouter les automatisations et l’assistant IA sur des données suffisamment fiables.
