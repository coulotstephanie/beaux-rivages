# Carnet Beaux Rivages — CMS éditorial

## Objectif

Le Carnet conserve son expérience publique, sa carte OpenStreetMap, la météo,
les marées et ses recommandations actuelles. Le CMS ajoute une source de vérité
éditoriale administrable sans modifier le code.

## Utilisation

1. Ouvrir **Administration → Carnet CMS**.
2. Créer la fiche en brouillon et compléter son titre, sa rubrique, sa
   destination et son résumé.
3. Ajouter les liens officiels, coordonnées GPS, horaires, médias et conseils.
4. Préparer le SEO avec un meta-title de 70 caractères maximum et une
   meta-description de 170 caractères maximum.
5. Publier après vérification des informations et des droits des médias.

Chaque modification crée une version historique. L’archivage remplace la
suppression éditoriale.

## Recherche et favoris

La recherche publique ignore les accents et couvre le nom, le type, la
destination, la description, l’adresse et le conseil des hôtes. Les filtres
rubrique, destination et favoris sont combinables. Les favoris fonctionnent
hors connexion dans le navigateur ; la table `carnet_favorites` permet leur
synchronisation future pour les voyageurs authentifiés.

## Médias

Les champs image, galerie, vidéo et Open Graph réutilisent les chemins de la
médiathèque existante. Aucun fichier n’est supprimé automatiquement lorsqu’une
fiche est archivée. Une suppression physique nécessite un contrôle préalable
des références et des droits.

## Sécurité et performances

- seuls les contenus `published` sont lisibles publiquement grâce à RLS ;
- les brouillons et versions sont réservés au personnel ;
- les écritures passent par validation Zod et contrôle de rôle ;
- les index GIN accélèrent texte, tags et mises en avant ;
- le contenu statique actuel demeure le repli tant que la migration n’est pas
  appliquée et les fiches validées.

## Migration

Appliquer `20260730001000_guest_premium_space.sql`, puis importer les contenus
statiques seulement après une revue éditoriale. Aucun texte métier n’est inventé
automatiquement.
