# ADR-0006 — Gestion des médias

- **Statut :** Accepted
- **Date :** 2026-07-29

## Décision

La cible officielle stocke tous les médias administrables dans Supabase
Storage.

Les images sont :

- compressées ;
- versionnées ;
- taguées ;
- optimisées.

Les miniatures sont générées automatiquement.

## Conséquences

Les accès utilisent des repositories et des métadonnées typées. Les originaux
privés sont protégés par des politiques Storage ; seules les variantes destinées
au public sont distribuées.

Les médias actuellement versionnés dans `public/` restent en place jusqu’à une
migration inventoriée, testée et réversible. Cette décision ne les déclare pas
déjà migrés.

