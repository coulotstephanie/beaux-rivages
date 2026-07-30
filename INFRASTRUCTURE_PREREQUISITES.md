# Infrastructure Prerequisites — Beaux Rivages 1.0

## Statut

**Blocked by Infrastructure**

Ce document décrit exclusivement les prérequis nécessaires pour lever le P0
Backup & Restore. Il ne modifie ni la Release Candidate `1.0.0-rc.1`, ni son
statut `FAIL / NO-GO`.

## 1. Accès requis

### Dashboard Supabase

**Statut : À confirmer**

Accès Owner ou rôle suffisant pour consulter :

- **Organization > Billing** ;
- **Database > Backups** ;
- **Database > Settings / Connect** ;
- **Storage** ;
- **Authentication** ;
- paramètres du projet et journaux.

Preuve attendue : capture expurgée indiquant le projet, le plan et les
fonctionnalités de sauvegarde, sans clé ni chaîne de connexion.

### Plan Supabase

**Statut : Vérifié par confirmation écrite de la propriétaire — Free**

Confirmation reçue le 30 juillet 2026. La documentation officielle Supabase
indique que les sauvegardes automatiques et le PITR ne sont pas inclus dans le
plan Free.

Références :

- [Database Backups](https://supabase.com/docs/guides/platform/backups) ;
- [Supabase Pricing](https://supabase.com/pricing).

### Backups

**Statut : Vérifié — aucune sauvegarde automatique incluse dans le plan Free et
aucune sauvegarde physique listée par la CLI**

Le contrôle du 29 juillet 2026 retourne `backups: null` et
`physical_backup_data: {}`. Cela ne prouve pas l’absence d’une sauvegarde
logique visible uniquement dans le Dashboard. Supabase recommande aux projets
Free d’effectuer régulièrement un export avec `supabase db dump` et de conserver
les sauvegardes hors site.

Preuve encore attendue : un dump complet daté, intègre et restaurable.

### PITR

**Statut : Vérifié — désactivé**

La CLI retourne `pitr_enabled: false`.

Le PITR n’est pas inclus dans le plan Free. Une évolution du plan ou une
activation éventuelle est une décision d’infrastructure facturable. Elle ne doit
pas être effectuée automatiquement.

### Connexion PostgreSQL

**Statut : À confirmer**

Accès requis à la chaîne **Session pooler** ou à la connexion directe
officiellement fournie par Supabase, avec mot de passe géré hors Git.

Preuves attendues :

- connexion TLS réussie avec `psql` ;
- version serveur PostgreSQL 17 confirmée ;
- privilèges suffisants pour `pg_dump` ;
- secret absent des logs et du dépôt.

## 2. Outils requis

| Outil             | Version minimale recommandée                                                    | Statut actuel                                        | Justification                                                                     |
| ----------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------- |
| PostgreSQL client | major 17 (`pg_dump`, `pg_restore`, `psql`)                                      | absent                                               | doit être de même major que PostgreSQL 17 pour éviter une incompatibilité de dump |
| Supabase CLI      | `2.110.0`                                                                       | vérifié : `2.110.0`                                  | version utilisée par le dépôt et par les contrôles actuels                        |
| Docker            | version stable supportée par l’éditeur ; minimum exact non établi par le projet | absent                                               | nécessaire uniquement si la voie CLI conteneurisée est retenue                    |
| Git               | `2.39.5` minimum vérifié dans l’environnement                                   | vérifié : `2.39.5`                                   | version ayant exécuté le workflow local actuel                                    |
| Node.js           | 22 LTS                                                                          | configuration `.nvmrc` : `22`; session actuelle : 24 | la CI doit suivre `.nvmrc`, qui constitue la référence du projet                  |

### Règles d’installation

- utiliser les distributions officielles ou le gestionnaire de paquets approuvé ;
- ne jamais télécharger un binaire depuis une source non vérifiée ;
- enregistrer les versions dans le procès-verbal ;
- vérifier les checksums/signatures lorsqu’ils sont fournis ;
- ne pas installer Docker si la restauration gérée Supabase suffit ;
- ne jamais enregistrer le mot de passe PostgreSQL dans Git ou l’historique du
  shell.

## 3. Procédure de levée du P0

### Étape A — qualification obtenue

1. plan Free confirmé par la propriétaire ;
2. absence de sauvegardes automatiques sur Free confirmée par la documentation ;
3. PITR désactivé confirmé par la CLI ;
4. voie retenue : export officiel `supabase db dump`, exécuté via Docker ou avec
   les outils PostgreSQL officiels compatibles.

Critère restant : produire une sauvegarde récente et exploitable.

### Étape B — préparer la sauvegarde complète

Selon la capacité vérifiée :

- méthode préférée : sauvegarde physique Supabase puis **Restore to a New
  Project** ;
- méthode alternative officielle : client PostgreSQL 17 et dump complet ;
- dans les deux cas : copie séparée des objets Storage et inventaire des
  paramètres Auth, secrets, webhooks et configuration.

Preuves attendues :

- horodatage ;
- logs expurgés ;
- fichier ou point de restauration identifié ;
- checksum pour les exports locaux ;
- inventaires Storage/Auth/configuration ;
- emplacement chiffré et droits d’accès.

Critère de réussite : sauvegarde complète, intègre et accessible.

### Étape C — créer le miroir

1. obtenir l’accord explicite si la création est facturable ;
2. créer/restaurer un projet isolé dans la région appropriée ;
3. désactiver e-mails, webhooks, cron et appels externes ;
4. utiliser exclusivement Stripe TEST et des secrets dédiés ;
5. ne connecter aucun domaine ou service de production.

Preuves attendues :

- référence du miroir ;
- heure de début et de fin ;
- paramètres externes neutralisés ;
- journal de restauration expurgé.

Critère de réussite : miroir restauré sans écriture sur la source.

### Étape D — vérifier la restauration

Comparer :

- schémas, tables, vues, fonctions, triggers, index, contraintes et RLS ;
- nombre de lignes et agrégats non personnels ;
- réservations, paiements et audits échantillonnés ;
- comptes et rôles Auth ;
- buckets, nombres d’objets et tailles Storage ;
- configuration nécessaire à la recette.

Puis exécuter sur le miroir :

```bash
npm run db:verify-migrations
npx supabase db lint --linked --level warning
npm run validate
npm run test:e2e
```

Critère de réussite : aucun écart inexpliqué et tests verts.

### Étape E — décision

Le P0 passe de `FAIL` à `PASS` uniquement si :

- la sauvegarde complète est datée et vérifiée ;
- Storage/Auth/configuration sont couverts ;
- la restauration miroir réussit ;
- l’intégrité est démontrée ;
- RPO et RTO sont mesurés ;
- le procès-verbal et les responsables sont identifiés.

Un seul élément absent maintient `FAIL`.

## 4. Temps estimé

Ces durées sont des estimations de préparation, pas des mesures certifiées :

| Action                                              | Estimation                                |
| --------------------------------------------------- | ----------------------------------------- |
| vérification Dashboard et choix de méthode          | 15 à 30 minutes                           |
| installation et validation des outils si nécessaire | 30 à 90 minutes                           |
| sauvegarde base et inventaires                      | 30 à 120 minutes selon volume             |
| création/restauration du miroir                     | 30 à 120 minutes selon Supabase et volume |
| contrôles d’intégrité                               | 30 à 90 minutes                           |
| tests et recette initiale                           | 2 à 4 heures                              |

Temps total prévisionnel : environ une demi-journée à une journée une fois tous
les accès et outils disponibles.

Le RTO réel reste **Non vérifié** jusqu’à l’exercice chronométré.

## 5. Risques

Une mise en production sans lever le P0 expose à :

- perte irréversible de réservations, paiements, contrats ou audits ;
- impossibilité de revenir au schéma précédent ;
- indisponibilité prolongée ;
- restauration incomplète des médias Storage ;
- perte ou incohérence des comptes Auth ;
- absence de preuve comptable ou opérationnelle ;
- violation potentielle des obligations de sécurité et de protection des
  données ;
- intervention manuelle urgente sans procédure testée ;
- coûts et atteinte à la confiance des voyageurs.

## Conclusion

**Statut final : Blocked by Infrastructure — FAIL / NO-GO.**

Le dépôt et la Release Candidate sont prêts à reprendre la certification dès
que les accès, sauvegardes et outils officiels sont disponibles. Aucune action
supplémentaire sur le code n’est nécessaire ou autorisée pour lever ce blocage.

Aucune migration, fusion, création de tag ou mise en production ne doit être
réalisée avant validation complète de cette procédure.
