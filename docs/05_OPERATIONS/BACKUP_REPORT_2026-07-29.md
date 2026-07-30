# Rapport sauvegarde et restauration — 29 juillet 2026

## Décision

**Non validé — blocage Go Live P0.**

La tentative de dump lié a échoué avant toute écriture distante : la CLI
Supabase requiert Docker Desktop pour exécuter `pg_dump`, et `DATABASE_URL`,
`pg_dump` et `pg_restore` ne sont pas disponibles dans l’environnement courant.
Aucune migration n’a été appliquée.

## Périmètre exigé

Une preuve de sauvegarde doit couvrir :

1. schémas, données, fonctions, triggers et politiques PostgreSQL ;
2. utilisateurs et métadonnées Auth selon les mécanismes Supabase autorisés ;
3. objets et métadonnées Storage ;
4. paramètres de projet, secrets référencés par nom et configuration des
   webhooks, sans exporter les valeurs sensibles dans Git.

## Procédure de validation

1. installer Docker Desktop ou PostgreSQL client ;
2. créer un répertoire chiffré explicite avec permissions `0700` ;
3. générer les dumps schéma et données, calculer SHA-256 et dater la preuve ;
4. exporter l’inventaire Storage et copier les objets vers un stockage chiffré ;
5. inventorier Auth et paramètres via les exports/support Supabase adaptés au
   plan utilisé ;
6. restaurer dans un projet de recette vide et isolé ;
7. comparer volumes, tables, contraintes, RLS, utilisateurs et objets ;
8. mesurer le RTO et faire signer le procès-verbal.

## Objectifs opérationnels proposés

- RPO cible : 24 heures au maximum, à faire valider ;
- RTO cible : 60 minutes pour la base complète, à mesurer ;
- indisponibilité d’une migration applicative : moins de 10 minutes seulement
  si un rollback testé ne détruit aucune donnée.

Le retour arrière en moins de 10 minutes n’est actuellement **pas démontré**.
