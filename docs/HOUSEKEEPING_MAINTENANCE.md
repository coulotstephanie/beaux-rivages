# Housekeeping & Maintenance

Le menu **Housekeeping** du Back Office centralise planning, check-lists par maison, contrôles qualité, inventaire, maintenance, interventions, stocks, consommables, photos et rapports.

## Modèle métier

- `housekeeping_tasks` reste la source des préparations liées aux séjours. Une révision optimiste protège les saisies mobiles concurrentes.
- `housekeeping_inspections` conserve l’évaluation de 1 à 5 étoiles, les remarques et demandes de correction.
- `inventory_items` décrit chaque équipement par maison et pièce, avec quantité, valeur, état, achat et garantie.
- `stock_items` couvre linge, serviettes, peignoirs, literie, vaisselle, électroménager, mobilier et consommables.
- `maintenance_incidents` reste le registre central des incidents.
- `maintenance_interventions` planifie l’attribution, le report et la clôture.
- `operational_photos` classe les images privées par maison, réservation, tâche ou incident.

## Mobile et hors ligne

L’interface est tactile et responsive. En cas de coupure, les actions sont placées dans une file locale puis rejouées au retour du réseau. `offline_revision` empêche d’écraser une version modifiée entre-temps : l’utilisateur doit alors actualiser et fusionner consciemment.

Pour une future PWA totalement hors ligne, le sprint suivant devra ajouter un Service Worker, IndexedDB chiffré et une stratégie explicite de résolution des conflits. La file locale actuelle couvre les coupures temporaires, pas une utilisation prolongée sans réseau.

## Photos

Le bucket Supabase `operations` est privé, limité à 10 Mo et aux formats JPEG, PNG et WebP. Les métadonnées ne contiennent que le chemin privé. Une route d’upload signée et le redimensionnement côté client restent à ajouter avant l’ouverture aux équipes terrain.

## Prévisions

Le moteur signale les consommables sous leur seuil et calcule la quantité nécessaire pour revenir au stock cible. Les futurs historiques permettront ensuite d’estimer la consommation par séjour, les remplacements et la maintenance préventive.

## Sécurité

Toutes les tables sont sous RLS. Les actions passent par `/api/admin/housekeeping`, avec authentification, contrôle d’origine, limitation de débit et validation Zod.
