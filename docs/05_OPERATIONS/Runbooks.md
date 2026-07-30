# Runbook d’exploitation Beaux Rivages

Version 1.0 — document permanent.

## Règle de preuve

Chaque information opérationnelle porte l’un des statuts suivants :

- **Vérifié** : preuve reproductible ou résultat observé ;
- **Non vérifié** : aucune preuve disponible ;
- **À confirmer** : validation explicite d’un responsable requise.

Une valeur non vérifiée n’est jamais utilisée comme prérequis d’un Go Live.

## 1. Inventaire de l’infrastructure

Dernière revue technique : 29 juillet 2026.

| Élément         | Propriétaire | Environnement                                                       | Statut                                                                      | Sauvegarde                                                                    | Restauration                                             | Fréquence recommandée                                     | Dernière vérification                    |
| --------------- | ------------ | ------------------------------------------------------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------- | --------------------------------------------------------- | ---------------------------------------- |
| PostgreSQL 17.6 | Non vérifié  | projet lié `ydqtqfkzmovjdkmldhqr`, usage production à confirmer     | **Vérifié** : actif, `eu-west-1` ; plan non vérifié                         | sauvegarde physique Supabase si disponible, sinon dump natif                  | nouveau projet miroir ou `pg_restore` sur cible isolée   | avant chaque migration + quotidienne à confirmer          | 2026-07-29 : CLI et lint                 |
| Supabase        | Non vérifié  | un seul projet visible ; qualification production à confirmer       | **Vérifié** : `ACTIVE_HEALTHY` ; **Non vérifié** : plan/backups             | mécanisme natif selon plan + inventaire configuration                         | Restore to a New Project si disponible                   | quotidienne et avant release, rétention à confirmer       | 2026-07-29 : `projects list`             |
| Storage         | Non vérifié  | lié au projet Supabase                                              | **Vérifié** : buckets privés déclarés ; contenu distant non inventorié      | copie récursive séparée des objets et métadonnées                             | recréer buckets/policies puis recopier les objets        | avant release + quotidienne à confirmer                   | 2026-07-29 : migrations/tests uniquement |
| Auth            | Non vérifié  | Supabase Auth prévu ; activation distante à confirmer               | **Vérifié** : code JWT/RLS ; état utilisateurs non vérifié                  | inclus dans clone physique ; paramètres exportés séparément                   | clone ou restauration DB puis reconfiguration Auth       | avant changement Auth + quotidienne DB                    | 2026-07-29 : audit code                  |
| Edge Functions  | Non vérifié  | aucune fonction inventoriée dans le dépôt                           | **Non vérifié** côté Dashboard                                              | code source + inventaire config/secrets                                       | redéploiement depuis source validée                      | à chaque release                                          | Non vérifié                              |
| Secrets         | Non vérifié  | local/Vercel/Supabase, périmètre exact à confirmer                  | **Vérifié** : aucune valeur commise ; rotation non vérifiée                 | inventaire des noms et coffre externe, jamais Git                             | recréation depuis coffre et rotation                     | revue avant release, rotation selon politique à confirmer | 2026-07-29 : scan dépôt                  |
| Vercel          | Non vérifié  | Preview observée dans les PR précédentes ; production non inspectée | **À confirmer**                                                             | code Git, variables inventoriées hors Git, configuration exportée             | redéployer un commit sain                                | à chaque release                                          | 2026-07-29 : configuration dépôt         |
| DNS             | Non vérifié  | domaine public configuré dans le code ; fournisseur non identifié   | **Non vérifié**                                                             | export de zone chez le fournisseur                                            | import de zone ou correction des enregistrements         | après chaque changement + export trimestriel proposé      | Non vérifié                              |
| Stripe          | Non vérifié  | architecture TEST ; clés absentes localement                        | **Vérifié** : signature/idempotence dans le code ; recette réelle non faite | configuration et identifiants exportés hors Git ; Stripe conserve ses données | recréer webhooks/secrets et réconcilier par identifiants | avant release paiement et après rotation                  | 2026-07-29 : tests statiques             |

### Informations encore requises

- propriétaires et suppléants de chaque service ;
- plan Supabase et dernière sauvegarde ;
- inventaire Storage/Auth/Edge Functions ;
- projets et variables Vercel ;
- fournisseur DNS et export de zone ;
- comptes Stripe et canaux d’escalade ;
- RPO, RTO et fréquences officiellement approuvés.

## 2. Matrice des risques

Les probabilités et durées non mesurées restent explicitement à confirmer.

| Incident                    | Impact                                   | Probabilité | Détection                                   | Mitigation                                                     | Temps de restauration estimé  |
| --------------------------- | ---------------------------------------- | ----------- | ------------------------------------------- | -------------------------------------------------------------- | ----------------------------- |
| migration SQL défaillante   | indisponibilité ou corruption            | À confirmer | migration, healthcheck, logs SQL            | geler les écritures, rollback testé ou restauration            | Non vérifié                   |
| perte/corruption PostgreSQL | réservations et opérations indisponibles | À confirmer | `/api/health`, alertes DB, contrôles métier | clone/restauration depuis backup vérifié                       | Non vérifié                   |
| perte d’objets Storage      | médias ou preuves absents                | À confirmer | inventaire/checksums, erreurs 404           | recopier la sauvegarde Storage                                 | Non vérifié                   |
| permissions RLS incorrectes | fuite ou blocage de données              | À confirmer | tests par rôle, journaux 401/403            | retirer accès, corriger policy via migration                   | Non vérifié                   |
| secret compromis            | accès non autorisé                       | À confirmer | alertes fournisseur, activité anormale      | révoquer, faire tourner, auditer                               | À mesurer                     |
| Stripe indisponible         | paiements impossibles ou retardés        | À confirmer | statut Stripe, erreurs API/webhooks         | suspendre checkout, conserver réservation, reprise idempotente | dépend du fournisseur         |
| Supabase indisponible       | site dynamique et back-office dégradés   | À confirmer | healthcheck externe, statut Supabase        | mode maintenance, aucune écriture, reprise contrôlée           | dépend du fournisseur         |
| Vercel indisponible         | site inaccessible                        | À confirmer | moniteur externe et statut Vercel           | rollback/redéploiement ou procédure fournisseur                | Non vérifié                   |
| DNS incorrect/indisponible  | domaine inaccessible                     | À confirmer | résolution multi-réseaux                    | restaurer la zone exportée, réduire TTL avant changement       | dépend du TTL, non vérifié    |
| Edge Function absente       | automatisation ciblée indisponible       | Non vérifié | inventaire et logs de fonction              | redéployer la version Git et restaurer ses secrets             | Non vérifié                   |
| double webhook Stripe       | double traitement financier              | À confirmer | clé unique et audit des événements          | idempotence, rejet du doublon, rapprochement                   | immédiat si détection validée |
| erreur humaine              | données ou configuration altérées        | À confirmer | audit et revue à quatre yeux                | moindre privilège, backup, procédure signée                    | Non vérifié                   |

## 3. Checklist obligatoire avant chaque release

Copier cette section dans le journal de release. Une case cochée exige un lien
vers une preuve.

- [ ] commit exact, branche et périmètre consignés ;
- [ ] propriétaires et fenêtre de release confirmés ;
- [ ] sauvegarde PostgreSQL récente vérifiée ;
- [ ] sauvegarde Storage vérifiée ;
- [ ] inventaire Auth, secrets et paramètres vérifié ;
- [ ] restauration réussie sur miroir ;
- [ ] RPO/RTO mesurés et acceptés ;
- [ ] migrations locales/distantes réconciliées ;
- [ ] rollbacks présents et testés ;
- [ ] dry-run des migrations vérifié ;
- [ ] RLS testées par rôle sur le miroir ;
- [ ] Stripe TEST : acompte, solde, intégral, échec, doublon et remboursement ;
- [ ] tests unitaires, intégration et E2E réussis ;
- [ ] build production réussi ;
- [ ] Preview Vercel testée sur le commit exact ;
- [ ] responsive, accessibilité et multilingue signés ;
- [ ] `/api/health`, logs, monitoring et alertes testés ;
- [ ] CSP, dépendances et secrets vérifiés ;
- [ ] procédure de rollback chronométrée ;
- [ ] décision Go/No-Go signée.

## 4. Checklist après déploiement

Exécuter immédiatement, puis surveiller selon la fenêtre validée :

- [ ] commit et déploiement attendus confirmés ;
- [ ] DNS, TLS et page d’accueil disponibles ;
- [ ] connexion voyageur et connexion staff ;
- [ ] création de réservation TEST contrôlée ;
- [ ] disponibilité et prévention des chevauchements ;
- [ ] paiements et webhooks TEST/sondes autorisées ;
- [ ] contrats et téléchargements ;
- [ ] Revenue et Yield Management ;
- [ ] Carnet Beaux Rivages et médias ;
- [ ] Dashboard ;
- [ ] CRM ;
- [ ] Housekeeping ;
- [ ] Maintenance ;
- [ ] e-mails et automatisations autorisés ;
- [ ] logs applicatifs et SQL ;
- [ ] monitoring et `/api/health` ;
- [ ] alertes reçues par les destinataires ;
- [ ] métriques et erreurs comparées à l’avant-release ;
- [ ] clôture ou rollback signé.

## 5. Gestion des incidents

### Règles communes

1. noter heure UTC, déclarant, symptômes, version et environnement ;
2. qualifier sécurité, données, paiements et disponibilité ;
3. geler migrations et déploiements ;
4. éviter toute commande destructive ;
5. conserver journaux et preuves sans données personnelles ;
6. décider confinement, rollback ou attente fournisseur ;
7. valider la reprise puis rédiger le retour d’expérience.

### Rollback application

Déclencheur : régression applicative avec base compatible avec l’ancien commit.

1. suspendre la release ;
2. confirmer que le schéma reste rétrocompatible ;
3. redéployer le dernier commit sain déjà validé ;
4. contrôler accueil, connexion, réservation, paiements et healthcheck ;
5. surveiller les erreurs.

**Statut : procédure définie, exercice chronométré non vérifié.**

### Rollback base de données

Ne jamais exécuter automatiquement un fichier `.down.sql`.

1. geler les écritures ;
2. évaluer les données créées depuis la migration ;
3. tester le rollback sur un miroir ou restaurer un snapshot ;
4. obtenir l’accord du responsable Go Live ;
5. exécuter avec journal complet ;
6. vérifier intégrité, RLS, types et application.

**Statut : rollbacks présents ; exécution miroir non vérifiée.**

### Restauration d’une sauvegarde

Suivre exclusivement
[BackupRestoreSOP.md](./BackupRestoreSOP.md). Restaurer vers une cible isolée
avant tout basculement et comparer les données agrégées.

**Statut : procédure définie ; restauration réelle non vérifiée.**

### Perte d’une Edge Function

1. confirmer son existence et sa version dans l’inventaire ;
2. suspendre les événements qui l’appellent ;
3. redéployer le code signé ;
4. recréer les secrets depuis le coffre ;
5. tester sur événement synthétique puis reprendre les files.

**Statut : inventaire Edge Functions non vérifié.**

### Indisponibilité Stripe

1. vérifier le statut officiel et les logs ;
2. suspendre la création de nouvelles sessions si le résultat est incertain ;
3. ne jamais marquer un paiement manuellement ;
4. conserver réservations et clés d’idempotence ;
5. rapprocher Stripe/base au retour ;
6. rejouer uniquement les webhooks identifiés et audités.

**Statut : mécanismes applicatifs vérifiés ; exercice réel non vérifié.**

### Indisponibilité Supabase

1. confirmer depuis deux réseaux et consulter `/api/health` ;
2. placer les écritures en maintenance ;
3. ne pas restaurer tant qu’une panne fournisseur est probable ;
4. préserver les requêtes/événements idempotents ;
5. suivre le statut fournisseur ;
6. effectuer la recette de reprise.

**Statut : healthcheck vérifié ; monitoring externe non vérifié.**

### Indisponibilité Vercel

1. confirmer DNS/TLS puis le statut Vercel ;
2. geler les déploiements ;
3. distinguer panne fournisseur et régression du commit ;
4. redéployer le dernier commit sain si l’infrastructure l’autorise ;
5. contrôler les variables et domaines sans les exposer ;
6. effectuer la recette de reprise.

**Statut : procédure définie ; exercice non vérifié.**

## 6. Escalade et communication

Les noms, téléphones, suppléants et délais d’escalade ne sont pas présents dans
le dépôt public.

**Statut : À confirmer.**

Ils doivent être conservés dans le manuel confidentiel et testés avant Go Live.

## 7. Journal

Chaque release doit ajouter une ligne à
[VerificationLog.md](./VerificationLog.md) et conserver les preuves associées
hors Git lorsque celles-ci contiennent des données sensibles.
