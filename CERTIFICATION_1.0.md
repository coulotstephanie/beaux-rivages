# Production Readiness Certification — Beaux Rivages 1.0

## Décision

**Version évaluée :** `1.0.0-rc.1`  
**Commit applicatif gelé :** `2f1097f`  
**Commit RC évalué par la CI :** `d98306f1c32762d65d65163d153ddae630999456`  
**Date :** 29 juillet 2026  
**Statut global :** **FAIL**  
**Décision :** **NO-GO**

Cette certification évalue l’aptitude à exploiter la version 1.0 en production.
Un contrôle est `PASS` uniquement lorsqu’une preuve reproductible existe.
L’absence de preuve vaut `FAIL`; elle n’est jamais remplacée par une hypothèse.

## Synthèse certifiée

| Domaine                           | Statut   | Preuve                                                                                             | Écart restant                                                              |
| --------------------------------- | -------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Architecture applicative          | **PASS** | [Architecture](./docs/03_ARCHITECTURE/SystemArchitecture.md), build Next.js réussi, audit du dépôt | convergence SaaS future hors périmètre 1.0                                 |
| Qualité automatisée               | **PASS** | CI run `30491613818`, job `quality` : `npm ci` et `npm run validate` réussis                       | aucun écart bloquant automatisé                                            |
| Tests d’intégration               | **PASS** | 121 tests réussis sur RC1                                                                          | recette miroir séparée                                                     |
| Tests unitaires                   | **PASS** | 20 tests Vitest réussis sur RC1                                                                    | couverture chiffrée globale non publiée                                    |
| Tests E2E automatisés             | **PASS** | CI run `30491613818`, job `e2e-smoke` réussi ; 10 scénarios desktop/mobile réussis localement      | Safari, Firefox et appareils réels non signés                              |
| Recette métier complète           | **FAIL** | [Recette préproduction](./docs/05_OPERATIONS/PREPRODUCTION_ACCEPTANCE_2026-07-29.md)               | miroir, multilingue et scénarios manuels non validés                       |
| Documentation                     | **PASS** | Runbook, SOP Backup & Restore, Architecture, API, règles métier, Changelog et notes RC1 présents   | propriétaires opérationnels à confirmer                                    |
| CI                                | **PASS** | GitHub Actions run `30491613818`, jobs `quality` et `e2e-smoke` : succès                           | aucun                                                                      |
| CD / déploiement                  | **FAIL** | [Guide de déploiement](./docs/05_OPERATIONS/DeploymentGuide.md) uniquement                         | rollback et déploiement de production non exercés                          |
| Supabase — disponibilité actuelle | **PASS** | projet lié `ydqtqfkzmovjdkmldhqr`, `ACTIVE_HEALTHY`, PostgreSQL 17.6, lint distant sans erreur     | le plan reste non vérifié                                                  |
| Supabase — cohérence cible        | **FAIL** | [Rapport migrations](./docs/05_OPERATIONS/MIGRATION_COHERENCE_REPORT_2026-07-29.md)                | trois migrations locales non appliquées ; schéma Git et distant différents |
| Migrations et rollbacks dans Git  | **PASS** | `npm run db:verify-migrations` : 15 migrations, 15 rollbacks, aucun orphelin                       | exécution sur base vierge non prouvée                                      |
| RLS du schéma déjà distant        | **PASS** | tests SQL, migrations versionnées et `supabase db lint --linked` sans erreur                       | ne couvre pas les trois migrations en attente                              |
| RLS de la cible 1.0               | **FAIL** | [Rapport OWASP](./docs/04_ENGINEERING/SECURITY_OWASP_REPORT_2026-07-29.md)                         | tests par rôle sur miroir non exécutés                                     |
| Stripe — conception               | **PASS** | signature webhook, idempotence, contrôle serveur des montants et journalisation testés             | aucun pour la conception                                                   |
| Stripe — recette TEST réelle      | **FAIL** | [Rapport Stripe](./docs/05_OPERATIONS/STRIPE_TEST_ACCEPTANCE_2026-07-29.md)                        | clés TEST et webhooks réels non recettés                                   |
| OWASP / sécurité globale          | **FAIL** | [Rapport OWASP](./docs/04_ENGINEERING/SECURITY_OWASP_REPORT_2026-07-29.md)                         | CSP, rate limiting distribué, monitoring et fermeture du token historique  |
| Dépendances de production         | **PASS** | `npm audit --omit=dev --audit-level=high` : 0 vulnérabilité signalée                               | alertes de développement à traiter séparément                              |
| Sauvegarde PostgreSQL             | **FAIL** | [Backup Readiness](./docs/05_OPERATIONS/BACKUP_READINESS_REPORT_2026-07-29.md)                     | aucun dump complet vérifié                                                 |
| Sauvegarde Storage/Auth/config    | **FAIL** | [SOP Backup & Restore](./docs/05_OPERATIONS/BackupRestoreSOP.md)                                   | inventaires et copies non réalisés                                         |
| Test de restauration              | **FAIL** | [Rapport sauvegarde](./docs/05_OPERATIONS/BACKUP_REPORT_2026-07-29.md)                             | aucun miroir restauré                                                      |
| Retour arrière < 10 minutes       | **FAIL** | [Runbook](./docs/05_OPERATIONS/Runbooks.md)                                                        | exercice chronométré absent                                                |
| Monitoring et alertes             | **FAIL** | `/api/health` existe ; [Monitoring](./docs/05_OPERATIONS/Monitoring.md)                            | moniteur externe, APM et destinataires non démontrés                       |
| Go Live Checklist                 | **FAIL** | [Checklist](./docs/05_OPERATIONS/GO_LIVE_CHECKLIST.md)                                             | plusieurs P0/P1 ouverts                                                    |

## P0 bloquant

La sauvegarde complète et la restauration sur un environnement miroir n’ont pas
été démontrées. Aucune migration distante, fusion, création de tag stable ou
mise en production n’est autorisée.

## Autres risques ouverts

La restauration n’est pas le seul contrôle en `FAIL`. Même après sa réussite,
une nouvelle certification devra encore valider :

- les trois migrations et leurs RLS sur le miroir ;
- Stripe TEST de bout en bout ;
- la recette métier complète ;
- le monitoring et les alertes ;
- les contrôles de sécurité ouverts ;
- le rollback chronométré.

La fermeture du P0 Backup & Restore ne transforme donc pas automatiquement la
certification globale en `PASS`.

## Conditions de passage à PASS

1. confirmer le plan et la dernière sauvegarde Supabase ;
2. sauvegarder base, Storage, Auth et configuration ;
3. restaurer un miroir isolé et vérifier son intégrité ;
4. appliquer les trois migrations au miroir ;
5. tester RLS avec les rôles anonymous, authenticated et staff ;
6. effectuer la recette Stripe TEST complète ;
7. exécuter la recette fonctionnelle et responsive ;
8. activer et tester monitoring et alertes ;
9. fermer ou accepter formellement les risques OWASP restants ;
10. chronométrer le rollback ;
11. relancer CI, tests et build sur le commit exact ;
12. signer une nouvelle décision Go/No-Go.

## Promotion

Uniquement après certification globale `PASS` :

1. sortir la PR #11 du brouillon ;
2. obtenir la revue et l’approbation ;
3. appliquer les migrations selon le Runbook ;
4. fusionner et déployer le commit certifié ;
5. effectuer la recette post-déploiement ;
6. surveiller les logs et métriques ;
7. créer le tag `v1.0.0` ;
8. publier les notes de version.

## Gouvernance après 1.0

Le modèle de branches proposé pour la suite est :

- `main` : versions stables uniquement ;
- `develop` : intégration des évolutions ;
- `release/x.y.z` : préparation d’une version ;
- `hotfix/x.y.z` : correction urgente ;
- `feature/...` : fonctionnalité isolée.

Ce modèle n’est pas activé par cette certification. Sa mise en place devra être
validée avec les règles de protection GitHub afin d’éviter deux sources de
vérité ou des branches longues non maîtrisées.

Roadmap indicative :

- `1.0.x` : correctifs et stabilisation ;
- `1.1` : CRM, fidélité et marketing ;
- `1.2` : synchronisations et intégrations ;
- `1.3` : portail propriétaires et observabilité ;
- `2.0` : IA après choix du fournisseur et validation RGPD.

## Signature

| Rôle                     | Nom         | Date | Décision  |
| ------------------------ | ----------- | ---- | --------- |
| Release Manager          | À confirmer | —    | NO-GO     |
| Responsable exploitation | À confirmer | —    | Non signé |
| Responsable produit      | À confirmer | —    | Non signé |

La certification reste `FAIL / NO-GO` tant que ces preuves et signatures ne
sont pas complètes.
