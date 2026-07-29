# Changelog Beaux Rivages

Les changements notables sont documentés ici selon les principes de
[Keep a Changelog](https://keepachangelog.com/fr/1.1.0/) et les commits
conventionnels du projet.

## Non publié

### Ajouté

- Rapports de cohérence des migrations, sauvegarde/restauration et décision
  Go/No-Go, accompagnés d’un contrôle automatisé des paires up/down.
- Rapport Backup Readiness comparant les sauvegardes gérées Supabase, CLI,
  PostgreSQL natif et Docker, avec procédure miroir sans écriture en production.
- Procédure d’exploitation Backup & Restore réutilisable avant chaque migration,
  avec contrôles d’intégrité, recette miroir et critères Go/No-Go.
- Runbook d’exploitation transmissible : inventaire statué, matrice des risques,
  checklists avant/après release, procédures d’incident et journal permanent.
- Réintégration du Yield Management déjà présent dans Supabase afin de
  réconcilier l’historique local et distant avant production.
- Audit complet de préparation production, score documenté, dette priorisée,
  guide de déploiement et checklist Go Live.
- Sonde de santé sans cache destinée à la supervision de PostgreSQL.
- ADR-0009 « Choix du fournisseur IA » : comparaison OpenAI, Azure OpenAI,
  Anthropic et Mistral, critères RGPD et protocole d’évaluation réversible.
- Revenue Management : périodes tarifaires persistantes, garde-fous
  minimum/maximum, calendrier visuel et prise en charge des événements locaux.
- Indicateurs annuels par maison : revenu, occupation, ADR et RevPAR.
- CMS éditorial versionné du Carnet Beaux Rivages : rubriques, médias,
  coordonnées, horaires, recommandations, mises en avant et métadonnées SEO.
- Recherche publique avec filtres combinables par texte, rubrique, destination
  et favoris, utilisable au clavier.

- Moteur de recherche de réservation Feature First : disponibilité, sélection
  des dates, tarification saisonnière et validation centralisée.
- Repositories injectables, hook de calendrier et tests des chevauchements,
  dates et identifiants de séjour.
- Fondations du Sprint 1 : architecture Feature First progressive, Design
  System étendu, layouts, providers et états transverses.
- Outillage qualité avec Prettier, EditorConfig, Husky, lint-staged,
  commitlint, Vitest, Testing Library et Playwright.
- Pipeline GitHub Actions exécutant validation complète et tests E2E Chromium.
- Pages système 401, 403, 500 et maintenance, avec chargement et reprise
  accessibles.
- Rapport d’audit du dépôt, guides d’installation et de contribution, et points
  d’entrée documentaires demandés.
- Kit de pilotage `/project-management` : cadre permanent, backlog, roadmap des
  Sprints 01 à 40, modèles de PR/issues et checklists QA/release.
- Connexion individuelle du personnel avec Supabase Auth et permissions
  centralisées par rôle pour toutes les API administratives.
- Provisionnement automatique des profils liés à `auth.users`, sans attribution
  implicite de privilèges.
- Documentation consolidée de la base, des API et des décisions d’architecture.
- Intégration du Product Book 07 et de la matrice de traçabilité des workflows.
- Intégration du Product Book 08 et de la matrice de convergence vers
  l’architecture SaaS cible.
- Ajout du catalogue officiel des événements et des exigences d’automatisation,
  scheduler, cache, monitoring, sauvegarde et production.
- Formalisation de la stratégie multi-tenant, des tests anti-fuite et du
  catalogue cible des permissions déclaratives.
- Intégration de la roadmap produit officielle V1 à V10 et de sa matrice
  d’avancement réel.
- Intégration du Brand Book et harmonisation des libellés voyageurs autour des
  expériences et attentions.
- Intégration du Developer Handbook, de sa définition de Done et de la matrice
  de conformité du dépôt.
- Intégration de l’architecture système officielle, de ses flux métier et de la
  traçabilité des infrastructures réellement activées.
- Intégration des règles métier officielles et de la matrice des écarts de
  statuts, contrats, disponibilité, historique et audit.
- Création du portail documentaire structuré en huit espaces, avec liens vers
  les sources canoniques et identification explicite des documents à construire.
- Adoption de l’ADR-0001 qui formalise DDD, Clean Architecture, Feature First,
  Repository Pattern, Event Driven, TypeScript Strict et Documentation First.
- Adoption des ADR-0002 à ADR-0008 concernant PostgreSQL, Next.js,
  l’authentification, les événements, les médias, l’UI et la documentation,
  accompagnés d’une matrice d’application réelle.
- Création du Feature Catalog officiel, avec identifiants stables, priorités,
  états observables, dépendances et preuves de tests et documentation.
- Formalisation des user stories US-0010 à US-0200 et des critères
  d’acceptation associés, avec séparation entre preuves acquises et validations
  restant nécessaires avant la production.
- Ajout du portail public du manuel d’exploitation, de la politique de
  classification et d’un garde-fou empêchant la publication accidentelle de la
  documentation opérationnelle confidentielle.
- Création du Beaux Rivages Hospitality Playbook : standards d’accueil,
  moments de service, communication, résolution, rituels, transmission et
  registre des pratiques restant à valider par Stéphanie & Bruno.
- Enrichissement du Playbook avec la philosophie, les dix engagements, les
  standards invisibles, les attentions, la cartographie émotionnelle et la
  promesse Beaux Rivages ; ajout du blueprint de la future Academy.
- Quatre tests dédiés à l’authentification et à la protection des routes.

### Modifié

- PostCSS et Sharp sont verrouillés sur leurs versions corrigées ; l’audit des
  dépendances de production ne signale plus de vulnérabilité connue.
- Playwright utilise un port local réservé et refuse de réutiliser un ancien
  serveur, afin que les E2E valident toujours le commit courant.
- Le limiteur local purge ses entrées et borne sa mémoire ; la vidéo d’accueil
  ne précharge plus sur connexion contrainte.
- Le sitemap ne publie plus de date de modification artificielle.
- Le Back Office accepte désormais les sessions Supabase vérifiées côté serveur.
  Le jeton historique reste temporairement disponible comme filet de migration
  désactivable.

### Corrigé

- La photographie principale « Le séjour, pensé pour se retrouver » du Nid
  d’Été bénéficie d’une retouche lumineuse naturelle, tout en conservant
  strictement la pièce, son mobilier et son architecture réels.
- Le visuel basse définition « Une pause face à l’océan » du Chai des Tortues
  est remplacé par une photographie nette adaptée aux écrans haute définition.
- La galerie du Chai suit désormais une visite naturelle : arrivée, extérieur,
  pièce de vie, cuisine, chambres, salles d’eau, détails puis découverte de
  l’Île de Ré.
- Les galeries des trois maisons suivent la même logique de visite. Les
  toilettes sont désormais visibles pour chaque maison lorsque l’annonce
  Airbnb fournit un visuel dédié ; la buanderie du Chai est également ajoutée.
- Le visuel flou « L’art de vivre face à l’océan » de Villa Raie Manta est
  remplacé par sa vue réelle et nette sur l’océan.
- La photo « Déjeuner à l’ombre » est retirée de la galerie du Nid d’Été.
- La vidéo d’accueil reste disponible avec un bouton Lecture/Pause lorsque
  l’autoplay est refusé, l’économie de données est active ou la réduction des
  animations est demandée.
- Le Nid d’Été est désormais présenté par une photographie réelle de son
  intérieur ; la salle d’eau est mise en avant et la vue de cour vide a été
  retirée, ainsi que les visuels génériques « Voyager léger » et « Le confort
  des longs séjours ». La photo technique de la boîte à clés est retirée de la
  galerie publique et, avec le plan vers D12, réservée à l’e-mail d’arrivée.
- Le bouton « Musique classique » diffuse _Le Printemps — II. Largo_, extrait
  des _Quatre Saisons_ de Vivaldi, dans un enregistrement du domaine public et
  uniquement après action explicite du visiteur. Une version AAC/M4A assure
  désormais sa lecture sur Safari, avec OGG comme format alternatif.
