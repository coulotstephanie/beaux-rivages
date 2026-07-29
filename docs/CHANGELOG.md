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
