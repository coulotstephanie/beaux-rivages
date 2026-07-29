# Backup Readiness — 29 juillet 2026

## Statut : NO-GO

La production n’a pas été modifiée. Aucun dump complet ni exercice de
restauration n’a encore abouti. Une seule instance Supabase est visible depuis
la CLI ; aucun environnement miroir n’existe actuellement.

## Comparaison des solutions

| Méthode                      | Couverture                                    | Avantages                                           | Limites                                                                             | Décision                    |
| ---------------------------- | --------------------------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------- | --------------------------- |
| Restore to a New Project     | base complète, rôles et Auth                  | méthode gérée, isolée, fidèle, sans écriture source | plan payant + sauvegarde physique, projet facturable, Storage/config à compléter    | **retenue en priorité**     |
| Sauvegarde Dashboard logique | base selon disponibilité                      | téléchargement simple                               | réservée à certains anciens projets logiques ; paramètres et objets Storage absents | secours                     |
| Supabase CLI `db dump`       | public par défaut, données/rôles avec options | reproductible et versionnable hors Git              | Docker requis ; `auth` et `storage` exclus par défaut                               | complément                  |
| `pg_dump` PostgreSQL natif   | schémas sélectionnés et données               | contrôle fin, aucun Docker                          | client et mot de passe DB requis ; restauration plus délicate                       | complément recommandé       |
| Docker + CLI                 | identique à CLI                               | versions PostgreSQL maîtrisées                      | Docker indisponible sur le poste actuel                                             | non exécutable actuellement |
| sauvegardes automatiques     | base quotidienne selon plan                   | gérées et surveillées par Supabase                  | rétention dépend du plan ; Storage exclu ; état du plan non visible via CLI         | à vérifier au Dashboard     |

Supabase indique que les sauvegardes quotidiennes sont disponibles sur les
plans Pro, Team et Enterprise, avec respectivement 7, 14 et jusqu’à 30 jours de
rétention. La restauration vers un nouveau projet est réservée aux plans
payants utilisant les sauvegardes physiques. Elle copie la base et les données
Auth, mais pas les objets Storage ni plusieurs paramètres de projet.

Références officielles :

- [Database backups](https://supabase.com/features/database-backups)
- [Restore to a new project](https://supabase.com/docs/guides/platform/clone-project)
- [CLI `db dump`](https://supabase.com/docs/reference/cli/supabase-db-dump)
- [Restore Dashboard backup](https://supabase.com/docs/guides/platform/migrating-within-supabase/dashboard-restore)

## Méthode retenue

### Voie A — recommandée

1. vérifier dans **Database > Backups** le plan, le type de sauvegarde, la
   dernière sauvegarde réussie et sa date ;
2. choisir **Restore to a New Project** depuis le dernier point valide ;
3. vérifier le coût annoncé et obtenir l’accord explicite avant création ;
4. créer le miroir dans `eu-west-1`, sans connexion Vercel ni webhook externe ;
5. désactiver immédiatement `pg_cron`, `pg_net`, wrappers et toute intégration
   susceptible d’écrire hors du miroir ;
6. exporter puis recopier séparément les objets Storage ;
7. recopier manuellement les paramètres Auth, Realtime, Storage et webhooks
   avec des secrets TEST dédiés ;
8. effectuer les contrôles de restauration ci-dessous ;
9. appliquer les trois migrations uniquement au miroir ;
10. lancer toute la recette et conserver le procès-verbal.

Cette opération est en lecture sur la source et ne modifie pas la production.

### Voie B — si la restauration gérée est indisponible

Prérequis : PostgreSQL client compatible 17, mot de passe DB, répertoire
chiffré, espace disque suffisant et projet cible isolé.

```bash
export BR_BACKUP_DIR="/volume-chiffre/beaux-rivages"
export DATABASE_URL="postgresql://...session-pooler..."
npm run db:backup
sha256sum "$BR_BACKUP_DIR"/beaux-rivages-*.dump
```

Le dump applicatif doit être complété par :

```bash
supabase db dump --linked --schema public,auth,storage \
  --file "$BR_BACKUP_DIR/full-schema.sql"
supabase db dump --linked --data-only --use-copy \
  --file "$BR_BACKUP_DIR/public-data.sql"
supabase storage cp ss:/// "$BR_BACKUP_DIR/storage" -r --experimental
```

Les commandes exactes doivent être validées sur le plan et les privilèges du
projet. Aucun secret ou dump ne doit entrer dans Git.

## Procédure de restauration

1. créer une cible vide et récupérer sa chaîne **Session pooler** ;
2. neutraliser les appels externes et utiliser uniquement des clés TEST ;
3. restaurer le dump avec `pg_restore` pour un format custom ou `psql` pour un
   fichier SQL ;
4. accepter uniquement les erreurs documentées liées aux objets Supabase déjà
   présents ;
5. restaurer les objets Storage dans les buckets recréés ;
6. réappliquer les paramètres non stockés en base ;
7. comparer source et cible sans exposer de données personnelles ;
8. faire tourner migrations, RLS, tests, recette et contrôle des journaux.

## Tests de restauration obligatoires

- toutes les tables, vues, fonctions, triggers, index et politiques présents ;
- nombres de lignes comparés par table ;
- réservations, paiements et audits échantillonnés ;
- utilisateurs Auth présents, aucun e-mail réel envoyé ;
- buckets, métadonnées et objets Storage comparés ;
- rôles anonymous/authenticated/staff testés ;
- checksum des exports conservé hors Git ;
- RPO et RTO mesurés ;
- destruction ou conservation encadrée du miroir.

## Temps et indisponibilité

- préparation : 30 à 60 minutes ;
- création/restauration du miroir : généralement 30 à 120 minutes, dépendante du
  volume et de l’activité WAL ;
- recette : 2 à 4 heures ;
- indisponibilité production : **zéro** pour le test miroir ;
- objectif de rollback inférieur à 10 minutes : non démontré avant exercice
  chronométré.

## Risques

- coût du projet miroir ;
- absence possible de sauvegarde physique sur le plan actuel ;
- Storage et paramètres oubliés ;
- déclenchement accidentel d’e-mails/webhooks depuis le clone ;
- données personnelles présentes dans le miroir ;
- incompatibilité de version des clients PostgreSQL.

## Résultat du test

**Non exécuté.** Le Dashboard Supabase doit confirmer le plan et proposer
« Restore to a New Project ». La création est potentiellement facturable et
requiert une validation explicite. La voie CLI locale reste bloquée par
l’absence de Docker/`pg_dump` et de mot de passe DB.

Le P0 Backup & Restore reste donc ouvert.
