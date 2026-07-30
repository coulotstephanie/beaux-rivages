# ADR-0002 — Base de données

- **Statut :** Accepted
- **Date :** 2026-07-29

## Décision

La base de données de Beaux Rivages repose sur Supabase PostgreSQL.

## Pourquoi

- PostgreSQL est mature ;
- Row Level Security protège les données au plus près de leur stockage ;
- les extensions permettent une évolution contrôlée ;
- les sauvegardes et procédures de restauration peuvent être industrialisées ;
- SQL reste un standard ouvert et portable.

## Conséquences

Toutes les évolutions passent par des migrations versionnées.

Aucune modification manuelle de schéma n’est autorisée, quel que soit
l’environnement. Les migrations documentent contraintes, index, RLS, retour
arrière ou stratégie d’atténuation.

