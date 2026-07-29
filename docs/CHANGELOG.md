# Changelog Beaux Rivages

Les changements notables sont documentés ici selon les principes de
[Keep a Changelog](https://keepachangelog.com/fr/1.1.0/) et les commits
conventionnels du projet.

## Non publié

### Ajouté

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
- Quatre tests dédiés à l’authentification et à la protection des routes.

### Modifié

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
- Le bouton « Musique classique » diffuse *Le Printemps — II. Largo*, extrait
  des *Quatre Saisons* de Vivaldi, dans un enregistrement du domaine public et
  uniquement après action explicite du visiteur. Une version AAC/M4A assure
  désormais sa lecture sur Safari, avec OGG comme format alternatif.
