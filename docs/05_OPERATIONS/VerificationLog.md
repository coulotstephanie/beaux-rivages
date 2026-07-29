# Journal des vérifications de release

Ce registre ne contient aucune donnée sensible. Les preuves détaillées sont
conservées dans l’espace d’exploitation approuvé, puis référencées par un
identifiant non secret.

| Date UTC   | Version / commit                           | Responsable | Sauvegarde validée | Restauration testée | Tests                                                                        | Décision  | Référence des preuves |
| ---------- | ------------------------------------------ | ----------- | ------------------ | ------------------- | ---------------------------------------------------------------------------- | --------- | --------------------- |
| 2026-07-29 | `3392de6231e48f6779ba15dc4c8f30462f3d54dd` | Non vérifié | Non                | Non                 | Local : 121 intégration, 20 unitaires, 10 E2E, build ; CI finale à confirmer | **NO-GO** | `GO_NO_GO_2026-07-29` |

## Modèle à recopier

| Date UTC   | Version / commit | Responsable | Sauvegarde validée | Restauration testée | Tests             | Décision   | Référence des preuves |
| ---------- | ---------------- | ----------- | ------------------ | ------------------- | ----------------- | ---------- | --------------------- |
| AAAA-MM-JJ | SHA complet      | À confirmer | Oui / Non          | Oui / Non           | résumé vérifiable | GO / NO-GO | identifiant           |

Une décision GO exige le nom du responsable, une sauvegarde validée, une
restauration testée et des tests verts sur le même commit.
