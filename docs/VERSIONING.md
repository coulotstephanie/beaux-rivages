# Gouvernance des versions

## Convention

Beaux Rivages adopte Semantic Versioning :

- `MAJOR` : rupture fonctionnelle, contractuelle ou technique ;
- `MINOR` : capacité compatible ajoutée ;
- `PATCH` : correction compatible ;
- `-rc.N` : candidate non autorisée en production.

Une version est identifiée par un tag Git signé ou protégé uniquement après
décision GO. Une PR, une branche ou une valeur dans `package.json` ne constitue
pas à elle seule une release.

## Cycle

1. périmètre de version défini ;
2. branche et PR atomiques ;
3. tests et documentation ;
4. Release Candidate gelée ;
5. sauvegarde/restauration et recette miroir ;
6. décision Go/No-Go ;
7. fusion et déploiement contrôlés ;
8. recette post-déploiement ;
9. tag stable et notes de version ;
10. surveillance et clôture.

## Roadmap par versions

Les contenus restent soumis au Product Book et seront affinés avant engagement.

| Version      | Objectif indicatif                             | Statut                         |
| ------------ | ---------------------------------------------- | ------------------------------ |
| `1.0.0-rc.1` | candidate initiale, exploitation à valider     | NO-GO                          |
| `1.0.0`      | première production contrôlée                  | bloquée par Backup & Restore   |
| `1.1`        | améliorations UX, accessibilité et performance | projet                         |
| `1.2`        | programme de fidélité                          | projet                         |
| `1.3`        | synchronisations avancées                      | projet                         |
| `1.4`        | portail propriétaires                          | projet                         |
| `1.5`        | observabilité                                  | projet                         |
| `2.0`        | Concierge IA                                   | projet, ADR fournisseur requis |
| `2.1`        | assistant IA hôte                              | projet                         |
| `2.2`        | multi-propriétaires                            | projet                         |
| `2.3`        | marketplace                                    | projet                         |
| `3.0`        | plateforme SaaS complète                       | vision                         |

Les numéros futurs n’autorisent aucun développement avant cadrage, règles
métier, risques, dépendances et critères d’acceptation validés.

## Correctifs

- correction avant production : nouvelle RC (`rc.2`, `rc.3`) ;
- correction compatible après production : patch (`1.0.1`) ;
- urgence production : hotfix, tests ciblés puis complets, nouvelle sauvegarde
  et décision de release.

## Traçabilité

Chaque release met à jour :

- notes de version ;
- Changelog ;
- journal des vérifications ;
- migrations et rollbacks ;
- Runbook si l’exploitation évolue ;
- décision Go/No-Go.
