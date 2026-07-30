# Manuel officiel des développeurs — Beaux Rivages

| Propriété            | Valeur                                       |
| -------------------- | -------------------------------------------- |
| Version du document  | 1.0                                          |
| Statut               | Référence officielle                         |
| Public               | Futurs développeurs et mainteneurs autorisés |
| Périmètre            | Plateforme privée Beaux Rivages              |
| Release de référence | `1.0.0-rc.1`, gelée et **NO-GO production**  |
| Dernière mise à jour | 30 juillet 2026                              |

Ce manuel est le point d'entrée de toute contribution technique. Il explique
l'intention du produit, l'architecture, les règles de travail et oriente vers
les sources détaillées. En cas de contradiction, une décision d'architecture
(ADR) acceptée et les documents canoniques qu'elle désigne prévalent. Une
divergence doit être corrigée par une Pull Request documentaire explicite, pas
par une interprétation silencieuse.

La présence d'une capacité dans le dépôt ou dans la roadmap ne prouve ni sa
recette complète, ni son autorisation en production. Consulter les rapports de
traçabilité, la certification et la décision Go/No-Go avant toute conclusion.

## 1. Présentation du projet

### 1.1 Vision

Beaux Rivages est la plateforme numérique privée qui accompagne l'exploitation
des maisons de la marque. Elle réunit le site éditorial, la réservation directe,
les disponibilités, les paiements et contrats, le parcours voyageur, le Carnet
local et les outils internes nécessaires à l'accueil et à l'exploitation.

La vision est celle d'une source de vérité unique, fiable et agréable à
utiliser. La technique doit servir trois résultats :

- offrir une expérience voyageur attentive, cohérente et premium ;
- sécuriser les réservations, paiements, contrats et opérations ;
- réduire le travail manuel de Stéphanie, Bruno et des collaborateurs autorisés.

### 1.2 Objectifs

Toute évolution doit produire au moins un bénéfice direct et mesurable :

1. améliorer l'expérience du voyageur ;
2. augmenter ou sécuriser les réservations directes ;
3. réduire une tâche manuelle ou un risque d'exploitation ;
4. fiabiliser les disponibilités, paiements, contrats ou communications ;
5. améliorer la connaissance voyageur et la qualité de l'accueil ;
6. faciliter le pilotage des maisons ;
7. renforcer la sécurité, la résilience ou la conformité.

### 1.3 Limites

Le dépôt ne doit pas devenir une solution générique d'hébergement. Sont hors
périmètre :

- le multi-tenant pour des entreprises clientes ;
- le multi-marques pour des exploitants indépendants ;
- l'onboarding autonome d'établissements ou de propriétaires tiers ;
- les abonnements et la facturation SaaS ;
- une marketplace ouverte ;
- une API publique généraliste et un SDK de plugins ;
- les fonctions conçues uniquement pour vendre ou administrer le logiciel.

Le multilingue voyageur, les rôles internes, la RLS, les environnements isolés
et les connecteurs privés restent nécessaires. Ils ne transforment pas la
plateforme en produit SaaS.

### 1.4 Décision de plateforme privée

La décision officielle est consignée dans
[`../ROADMAP_PRIVATE_PLATFORM.md`](../ROADMAP_PRIVATE_PLATFORM.md). Beaux
Rivages demeure un logiciel métier exclusivement destiné aux maisons de la
marque et à leurs collaborateurs autorisés.

Une proposition réintroduisant le multi-tenant, une marketplace, des
abonnements ou la commercialisation du logiciel est incompatible avec la
direction validée. Elle exige une nouvelle décision d'architecture explicite
qui annule la décision actuelle ; elle ne peut pas entrer par simple refactoring
ou anticipation technique.

## 2. Architecture

### 2.1 Vue d'ensemble

```text
 Voyageur / Équipe interne
            │
            ▼
┌───────────────────────────────────────────────────────┐
│ Next.js 15 — App Router                              │
│ pages, layouts, Server Components, routes API        │
└───────────────┬───────────────────────┬───────────────┘
                │                       │
                ▼                       ▼
┌──────────────────────────┐  ┌─────────────────────────┐
│ Features métier          │  │ UI et contenus         │
│ services, schemas, hooks │  │ components, media, i18n│
└───────────────┬──────────┘  └─────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────────────┐
│ Platform — contrats et capacités transverses         │
│ auth, réservation, paiement, calendrier, opérations  │
└───────────────┬───────────────────────┬───────────────┘
                │                       │
                ▼                       ▼
┌──────────────────────────┐  ┌─────────────────────────┐
│ Repositories             │  │ Fournisseurs privés    │
│ seule couche de données  │  │ Stripe, email, iCal…   │
└───────────────┬──────────┘  └─────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────────────┐
│ Supabase / PostgreSQL                                │
│ migrations, contraintes, RLS, Auth, audit            │
└───────────────────────────────────────────────────────┘
```

La chaîne métier prioritaire est :

```text
Disponibilité → Réservation → Paiement → Contrat → Guest Journey
              → Arrivée → Séjour → Départ → Avis → Fidélisation
```

Les tableaux de bord et automatisations consomment cette chaîne. Ils ne créent
pas de seconde source de vérité.

### 2.2 Composants et responsabilités

| Composant                               | Responsabilité                                                                         |
| --------------------------------------- | -------------------------------------------------------------------------------------- |
| `app/`                                  | Routage Next.js, layouts, pages, endpoints HTTP, métadonnées et états globaux          |
| `features/`                             | Capacités verticales Feature First, avec API publique par domaine                      |
| `platform/`                             | Contrats et services transverses ou historiques : auth, données, paiements, opérations |
| `components/`                           | Primitives UI, compositions, providers, états et composants partagés                   |
| `content/`                              | Contenu éditorial typé et organisé par langue                                          |
| `media/`                                | Manifests typés des médias des maisons et du site                                      |
| `i18n/`                                 | Configuration et catalogues français, anglais et allemand                              |
| `lib/`, `hooks/`, `services/`, `types/` | Utilitaires et contrats partagés, sans logique métier ambiguë                          |
| `supabase/`                             | Schéma PostgreSQL versionné, rollbacks, configuration et tests SQL                     |
| `tests/`                                | Tests d'intégrité, de contrats, d'intégration et E2E                                   |
| `public/`                               | Ressources statiques servies au navigateur                                             |
| `docs/`                                 | Gouvernance, produit, architecture, ingénierie et exploitation                         |

### 2.3 Règles de dépendance

- Les Server Components sont le choix par défaut.
- Un Client Component n'est introduit que pour une interaction navigateur.
- Une vue ne contient pas de logique métier ni de SQL.
- Une route valide l'entrée, authentifie, autorise, puis délègue à un service.
- Un service orchestre le cas d'usage.
- Le **Repository Pattern** impose que les repositories soient la seule couche
  autorisée à dialoguer avec Supabase.
- Les entrées externes sont validées par des schémas Zod.
- Un domaine `features/<domaine>` expose son API publique depuis `index.ts`.
- Les domaines historiques de `platform/` migrent seulement par tranche
  verticale atomique, testée et sans rupture de contrat.

Les sources détaillées sont
[`SYSTEM_ARCHITECTURE.md`](SYSTEM_ARCHITECTURE.md),
[`PRODUCT_BOOK_08_TECHNICAL_ARCHITECTURE.md`](PRODUCT_BOOK_08_TECHNICAL_ARCHITECTURE.md)
et les [ADR](03_ARCHITECTURE/decisions/README.md).

## 3. Organisation du dépôt

### 3.1 Arborescence de travail

```text
beaux-rivages-final/
├── app/                    application Next.js et routes API
├── components/             UI partagée et compositions
├── content/                contenus éditoriaux localisés
├── features/               domaines Feature First
│   ├── _template/          gabarit obligatoire d'un nouveau domaine
│   ├── carnet/
│   ├── reservations/
│   └── revenue-management/
├── platform/               services, contrats et repositories transverses
├── media/                  catalogues de médias typés
├── i18n/                   configuration multilingue
├── lib/ hooks/ services/   utilitaires partagés
├── public/                 images, vidéos, audio et identité
├── supabase/
│   ├── migrations/         source de vérité du schéma
│   ├── rollbacks/          retours arrière correspondants
│   └── tests/              tests PostgreSQL
├── tests/                  intégrité, intégration et E2E
├── scripts/                vérification, sauvegarde et génération
├── docs/                   documentation structurée
└── .github/workflows/      intégration continue
```

### 3.2 Où placer une modification

- Une nouvelle capacité métier va dans `features/<nom>`, sur le modèle de
  `features/_template`.
- Une primitive visuelle générique va dans `components/ui`.
- Une composition transversale va dans `components/layouts`,
  `components/providers` ou `components/states`.
- Un contrat avec un fournisseur privé reste derrière une interface de
  `platform/`.
- Un média est déclaré dans un manifest typé ; il n'est pas référencé par une
  chaîne dispersée.
- Une évolution de schéma va dans `supabase/migrations`, jamais ailleurs.
- Une décision durable et structurante donne lieu à un ADR.

Ne pas entreprendre de réorganisation globale « pour nettoyer ». La convergence
Feature First est incrémentale afin de préserver routes, imports, historiques
et contrats publics.

## 4. Standards de développement

### 4.1 Code

- TypeScript reste en mode `strict`.
- `any` est interdit ; utiliser `unknown` puis valider.
- Les types métiers et états sont explicites.
- Les états impossibles sont rendus non représentables lorsque raisonnable.
- La duplication et les abstractions sans responsabilité claire sont refusées.
- Composition plutôt qu'héritage ; état local minimal.
- Les effets React sont réservés à la synchronisation externe.
- Les listes utilisent des clés stables.
- Chargement, vide, erreur et succès sont traités.
- Un composant ne devrait pas dépasser **250 lignes** ; au-delà, rechercher des
  responsabilités séparables, sans découpage artificiel.
- Une primitive existante du Design System n'est pas recréée localement.
- L'accessibilité vise WCAG AA : clavier, focus visible, labels, contrastes,
  erreurs accessibles et ARIA pertinente.
- Les interfaces sont vérifiées sur mobile, tablette, laptop, desktop et ultra
  wide selon leur exposition.
- Les secrets et données personnelles ne figurent ni dans le code, ni dans les
  tests, ni dans les journaux.

### 4.2 Git

- Partir d'un `main` à jour.
- Utiliser `feature/`, `fix/`, `refactor/`, `docs/` ou `hotfix/`.
- Une branche correspond à un sujet cohérent et à une Pull Request atomique.
- Aucun commit direct sur `main`.
- Les messages suivent Conventional Commits, par exemple
  `feat(reservations): prevent overlapping stays`.
- Ne pas mélanger refactoring opportuniste et changement fonctionnel.
- Ne pas réécrire une migration déjà partagée ou appliquée.
- Une PR doit être lisible, testable et réversible.

### 4.3 Tests

La stratégie est proportionnée au risque :

- tests unitaires pour règles pures, calculs et composants ;
- tests d'intégration pour services, repositories, contrats et routes ;
- tests SQL pour contraintes, fonctions et politiques RLS ;
- tests E2E Playwright pour les parcours critiques ;
- vérifications accessibilité, responsive et sécurité ;
- test de non-régression pour chaque correction.

La cible de couverture minimale est **80 %**. Elle est une cible à mesurer, pas
une conformité présumée : une fonctionnalité sans mesure ne peut pas être
déclarée conforme. Ne jamais réduire un seuil ou supprimer un test pour faire
passer la CI sans décision documentée.

Commandes principales :

```bash
npm run test
npm run test:unit
npm run test:e2e
npm run db:test
npm run validate
```

### 4.4 Revue

Au moins un relecteur autorisé vérifie, selon le risque :

- adéquation au besoin, critères d'acceptation et limites de périmètre ;
- sens des dépendances et respect du Repository Pattern ;
- typage, lisibilité, gestion des erreurs et absence de duplication ;
- authentification, autorisation, RLS, secrets et données personnelles ;
- migrations, compatibilité, sauvegarde et stratégie de rollback ;
- tests, cas limites et preuves de validation ;
- WCAG AA, responsive, performance et Core Web Vitals ;
- documentation, Changelog, ADR et procédures d'exploitation impactés.

Un commentaire de sécurité, de perte de données ou de rupture de contrat bloque
la fusion jusqu'à résolution ou acceptation formelle du risque.

### 4.5 Politique de version

Le projet suit Semantic Versioning :

- `MAJOR` : rupture fonctionnelle, contractuelle ou technique ;
- `MINOR` : capacité compatible ;
- `PATCH` : correction compatible ;
- `-rc.N` : candidate non autorisée en production.

Une branche, une PR ou la valeur de `package.json` ne constitue pas une release.
La release est matérialisée par un tag Git protégé ou signé après décision GO.
Un correctif de candidate produit une nouvelle RC ; il ne modifie pas
silencieusement `1.0.0-rc.1`.

## 5. Workflow de développement

Le flux de référence est :

```text
GitHub → Actions → Preview → Validation → Production
```

### 5.1 De la branche à la Pull Request

1. Confirmer que le besoin est cadré, autorisé et associé à des critères
   d'acceptation.
2. Lire le Product Book, les règles métier, l'architecture, les ADR et le
   Runbook concernés.
3. Synchroniser `main`, puis créer une branche nommée selon la convention.
4. Développer la plus petite tranche verticale cohérente.
5. Ajouter ou adapter les tests au même moment que le comportement.
6. Mettre à jour la documentation et le Changelog selon l'impact.
7. Exécuter les tests ciblés, puis `npm run validate`.
8. Vérifier le diff, l'absence de secret et les migrations éventuelles.
9. Ouvrir une Pull Request en brouillon avec contexte, risques, preuves,
   captures si utiles et procédure de rollback.
10. Obtenir les revues et validations requises avant de rendre la PR fusionnable.

### 5.2 Preview et validation

La CI doit réussir au minimum le formatage, le lint, TypeScript strict, les
tests et le build. La Preview est parcourue sur les chemins touchés et, pour un
changement de site, avec :

```bash
npm run start -- --port 3100
SITE_URL=http://localhost:3100 npm run test:site
```

Une dérogation à un contrôle exige un motif, un risque, un propriétaire, une
échéance et une décision documentés.

### 5.3 Release Candidate, certification et Go Live

1. Définir et figer le périmètre de version.
2. Produire les notes de Release Candidate sur un commit exact.
3. Exécuter tous les contrôles sur ce commit.
4. Vérifier sauvegarde, restauration miroir, migrations et rollbacks.
5. Recetter sécurité, RLS, paiements TEST, responsive, accessibilité et métier.
6. Consolider les preuves dans la certification.
7. Prononcer une décision Go/No-Go humaine et explicite.
8. En cas de GO, fusionner la PR approuvée et déployer exactement le commit
   certifié.
9. Appliquer les migrations contrôlées, puis réaliser la recette
   post-déploiement.
10. Surveiller le système selon le Runbook et le playbook J+30.
11. Créer le tag stable uniquement après validation finale.

La RC `1.0.0-rc.1` reste gelée. Ce manuel n'autorise aucune modification,
fusion, migration distante, création de tag ou mise en production de cette RC.

### Définition de « Done »

Une contribution est terminée lorsque :

- le besoin et les critères d'acceptation sont satisfaits ;
- le code est typé, relu et conforme à l'architecture ;
- les tests pertinents sont verts et la couverture est mesurée ;
- sécurité, permissions et données personnelles sont contrôlées ;
- responsive, accessibilité et performance sont vérifiés ;
- migrations, rollback et impacts opérationnels sont traités ;
- la documentation et le Changelog sont à jour ;
- la Pull Request est approuvée ;
- les preuves de validation sont conservées.

« Fusionné » ou « déployé » ne remplace pas cette définition.

## 6. Environnement local

### 6.1 Prérequis

- Git ;
- Node.js 22 LTS, défini dans `.nvmrc` ;
- npm et une installation reproductible avec `npm ci` ;
- Docker et la CLI Supabase pour une base locale et les tests SQL ;
- un navigateur supporté ;
- les accès aux fournisseurs externes uniquement si le scénario les exige.

### 6.2 Démarrage

```bash
git clone <url-autorisée-du-dépôt>
cd beaux-rivages-final
npm ci
cp .env.example .env.local
npm run dev
```

Ouvrir `http://localhost:3000`.

Les pages publiques sont consultables sans connecter tous les fournisseurs. Ne
remplir que les variables nécessaires au scénario testé. Ne jamais copier une
clé de production dans l'environnement local ni committer `.env.local`.

### 6.3 Contrôles avant contribution

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run test:unit
npm run build
```

`npm run validate` agrège ces contrôles. Les tests E2E complets et SQL sont
ajoutés lorsque la modification les concerne. Voir
[`engineering/INSTALLATION.md`](engineering/INSTALLATION.md) pour la procédure
pratique et [`DEVELOPER_GUIDE.md`](DEVELOPER_GUIDE.md) pour le mémo.

## 7. Base de données

### 7.1 Source de vérité et migrations

PostgreSQL via Supabase est la persistance principale.
`supabase/migrations/` est l'unique source de vérité du schéma. Toute évolution
structurelle doit :

1. être une nouvelle migration horodatée et immuable ;
2. déclarer contraintes, index, triggers et politiques RLS nécessaires ;
3. avoir un rollback ou une stratégie d'atténuation correspondante dans
   `supabase/rollbacks/` ;
4. être vérifiée localement puis sur un environnement miroir ;
5. mettre à jour les types générés et la documentation ;
6. être sauvegardée, observée et approuvée avant production.

Commandes utiles :

```bash
npm run db:verify-migrations
npm run db:test
npm run db:types
npm run db:backup
```

`npm run db:push` cible un projet lié : vérifier explicitement le projet et
l'environnement avant exécution. Une roadmap, une PR ou ce manuel n'autorise
jamais à l'exécuter sur une cible distante.

### 7.2 Rollbacks

Un rollback n'est pas automatiquement sûr parce qu'un fichier `.down.sql`
existe. Avant exécution :

- identifier les données écrites depuis la migration ;
- sauvegarder et vérifier le point de restauration ;
- tester le script sur un miroir représentatif ;
- mesurer indisponibilité, perte potentielle et dépendances applicatives ;
- obtenir l'approbation prévue par le Runbook ;
- conserver les preuves et surveiller après l'opération.

Le rollback applicatif consiste normalement à redéployer le dernier commit sain.
Le rollback de données est une décision séparée.

### 7.3 Bonnes pratiques

- Aucun SQL ni appel Supabase direct dans React.
- Les repositories isolent la persistance des services métier.
- Les contraintes critiques existent en base, pas uniquement dans l'interface.
- Les migrations sont additives lorsque possible et compatibles avec le
  déploiement progressif.
- Les suppressions utilisent une séquence dépréciation, mesure, migration des
  données puis retrait.
- Les écritures sensibles sont idempotentes et auditables.
- Les tables privées activent RLS ; chaque rôle est testé positivement et
  négativement.
- La clé `SUPABASE_SECRET_KEY` reste exclusivement côté serveur.

Lire [`DATABASE.md`](DATABASE.md),
[`SUPABASE_ENTERPRISE_ARCHITECTURE.md`](SUPABASE_ENTERPRISE_ARCHITECTURE.md) et
[`05_OPERATIONS/BackupRestoreSOP.md`](05_OPERATIONS/BackupRestoreSOP.md) avant
toute intervention.

## 8. Sécurité

La sécurité est une responsabilité de chaque contribution :

- valider et, si nécessaire, assainir toute entrée externe ;
- authentifier puis autoriser toute mutation ;
- refuser l'accès par défaut et attribuer les rôles explicitement ;
- protéger les données en base par RLS et tester chaque rôle ;
- conserver les secrets côté serveur, sans préfixe `NEXT_PUBLIC_` ;
- ne jamais journaliser clé, token, mot de passe ou donnée voyageur inutile ;
- appliquer une limitation de débit proportionnée aux endpoints exposés ;
- rendre les webhooks et opérations sensibles idempotents ;
- vérifier origine, signature et rejeu lorsque le protocole le permet ;
- retourner des erreurs publiques sans détail interne sensible ;
- tracer les actions administratives et financières ;
- maintenir les dépendances et analyser les alertes sans mise à jour aveugle ;
- respecter minimisation, finalité, conservation et droits RGPD ;
- isoler local, Preview, préproduction et production ;
- garder un mode dégradé pour les fournisseurs non essentiels.

Tout soupçon d'incident suit
[`05_OPERATIONS/IncidentResponse.md`](05_OPERATIONS/IncidentResponse.md). Ne pas
inclure de secret ou de donnée personnelle dans une issue, une PR, une capture
ou un document du dépôt. Les documents eux-mêmes suivent la
[`classification opérationnelle`](05_OPERATIONS/DocumentationClassification.md).

Références : [`03_ARCHITECTURE/Security.md`](03_ARCHITECTURE/Security.md),
[`PERMISSIONS_CATALOG.md`](PERMISSIONS_CATALOG.md) et le
[`rapport OWASP`](04_ENGINEERING/SECURITY_OWASP_REPORT_2026-07-29.md).

## 9. Documentation

### 9.1 Règle d'usage

Lire du général vers le particulier : vision, produit, architecture, ADR,
standard d'ingénierie, puis procédure opérationnelle. Les fichiers historiques
à la racine de `docs/` restent présents pour les liens et tests existants ; les
portails thématiques indiquent la source canonique.

| Espace                                          | À utiliser pour                                                |
| ----------------------------------------------- | -------------------------------------------------------------- |
| [`docs/README.md`](README.md)                   | Trouver la famille documentaire responsable                    |
| [`00_EXECUTIVE/`](00_EXECUTIVE/README.md)       | Vision, stratégie et roadmap exécutive                         |
| [`01_PRODUCT/`](01_PRODUCT/README.md)           | Personas, catalogue, stories, workflows, règles et acceptation |
| [`02_BRAND/`](02_BRAND/README.md)               | Marque, éditorial, photo, vidéo et hospitalité                 |
| [`03_ARCHITECTURE/`](03_ARCHITECTURE/README.md) | Système, API, données, événements, sécurité et ADR             |
| [`04_ENGINEERING/`](04_ENGINEERING/README.md)   | Standards, tests, CI/CD et rapports d'ingénierie               |
| [`05_OPERATIONS/`](05_OPERATIONS/README.md)     | Déploiement, monitoring, incidents, sauvegarde et exploitation |
| [`06_AI/`](06_AI/README.md)                     | Gouvernance, architecture, workflows et prompts IA             |
| [`07_DESIGN/`](07_DESIGN/README.md)             | Design System, composants, UX et accessibilité                 |

### 9.2 Index des références transversales

| Document                                                                                                   | Quand l'utiliser                                   |
| ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| [`PRODUCT_MASTER_PLAN.md`](PRODUCT_MASTER_PLAN.md)                                                         | Comprendre le plan produit consolidé               |
| [`PRODUCT_BOOK_07_WORKFLOWS.md`](PRODUCT_BOOK_07_WORKFLOWS.md)                                             | Modifier un parcours métier                        |
| [`BUSINESS_RULES.md`](BUSINESS_RULES.md)                                                                   | Implémenter ou tester une règle métier             |
| [`ACCEPTANCE_CRITERIA.md`](ACCEPTANCE_CRITERIA.md)                                                         | Établir la preuve qu'une capacité est acceptée     |
| [`FEATURE_CATALOG.md`](FEATURE_CATALOG.md)                                                                 | Vérifier le périmètre fonctionnel                  |
| [`SYSTEM_ARCHITECTURE.md`](SYSTEM_ARCHITECTURE.md)                                                         | Comprendre composants et dépendances               |
| [`API.md`](API.md)                                                                                         | Créer ou modifier un contrat HTTP                  |
| [`DATABASE.md`](DATABASE.md)                                                                               | Modifier la persistance ou les rôles de données    |
| [`EVENT_CATALOG.md`](EVENT_CATALOG.md)                                                                     | Produire ou consommer un événement                 |
| [`DECISIONS.md`](DECISIONS.md)                                                                             | Retrouver le catalogue des décisions               |
| [`03_ARCHITECTURE/decisions/`](03_ARCHITECTURE/decisions/README.md)                                        | Comprendre une décision durable ou proposer un ADR |
| [`CODING_STANDARDS.md`](CODING_STANDARDS.md)                                                               | Retrouver les conventions de code                  |
| [`DEVELOPER_GUIDE.md`](DEVELOPER_GUIDE.md)                                                                 | Obtenir le mémo local et les commandes             |
| [`engineering/CONTRIBUTING.md`](engineering/CONTRIBUTING.md)                                               | Préparer branche, commits et PR                    |
| [`VERSIONING.md`](VERSIONING.md)                                                                           | Choisir version, RC, patch ou hotfix               |
| [`CHANGELOG.md`](CHANGELOG.md)                                                                             | Décrire les changements livrables                  |
| [`UI_GUIDELINES.md`](UI_GUIDELINES.md)                                                                     | Concevoir une interface cohérente                  |
| [`I18N.md`](I18N.md)                                                                                       | Modifier langues, dates ou contenus localisés      |
| [`BRAND_BOOK.md`](BRAND_BOOK.md)                                                                           | Respecter identité, ton et usages de marque        |
| [`05_OPERATIONS/BEAUX_RIVAGES_OPERATION_MANUAL.md`](05_OPERATIONS/BEAUX_RIVAGES_OPERATION_MANUAL.md)       | Exploiter la plateforme au quotidien               |
| [`05_OPERATIONS/Runbooks.md`](05_OPERATIONS/Runbooks.md)                                                   | Réagir à un événement opérationnel                 |
| [`05_OPERATIONS/BackupRestoreSOP.md`](05_OPERATIONS/BackupRestoreSOP.md)                                   | Sauvegarder ou restaurer selon la SOP              |
| [`05_OPERATIONS/DeploymentGuide.md`](05_OPERATIONS/DeploymentGuide.md)                                     | Préparer Preview, préproduction ou production      |
| [`05_OPERATIONS/GO_LIVE_CHECKLIST.md`](05_OPERATIONS/GO_LIVE_CHECKLIST.md)                                 | Contrôler une mise en ligne                        |
| [`05_OPERATIONS/OPERATIONS_PLAYBOOK_FIRST_30_DAYS.md`](05_OPERATIONS/OPERATIONS_PLAYBOOK_FIRST_30_DAYS.md) | Piloter la surveillance J+30                       |
| [`CERTIFICATION_1.0.md`](../CERTIFICATION_1.0.md)                                                          | Évaluer les preuves et blocages de la 1.0          |
| [`releases/1.0.0-rc.1.md`](releases/1.0.0-rc.1.md)                                                         | Connaître le périmètre et le gel de la RC          |
| [`../ROADMAP_PRIVATE_PLATFORM.md`](../ROADMAP_PRIVATE_PLATFORM.md)                                         | Préparer une évolution future autorisée            |

### 9.3 Documents spécialisés et traçabilité

Les documents racine spécialisés couvrent le Back Office, le CMS Carnet, les
calendriers et réservations, le Channel Manager, la conciergerie, les contrats,
le housekeeping, la maintenance, les permissions, le pricing, le revenue et le
yield management. Les consulter lorsqu'un domaine correspondant est touché.

Les fichiers suffixés `_TRACEABILITY.md`, les audits et les rapports datés
comparent la cible à l'état prouvé. Ils servent à vérifier une conformité, pas à
définir seuls une nouvelle architecture. Les rapports de sprint et de release
à la racine du dépôt constituent des preuves historiques ; ils ne remplacent
pas les sources canoniques actuelles.

Les archives éditoriales vivent dans [`archives/`](archives/README.md). Les
captures de preuve sont dans `docs/screenshots/` ou dans le dossier de leur
rapport. Les index `docs/api/`, `docs/architecture/`, `docs/database/`,
`docs/product/` et `docs/operations/` sont des portails de compatibilité.

### 9.4 Quand mettre à jour quoi

- Nouveau comportement : règles, critères, tests et Changelog.
- Nouveau contrat : API ou événements, consommateurs et compatibilité.
- Nouvelle persistance : Database, migration, rollback et tests RLS.
- Décision structurante : ADR avec contexte, options et conséquences.
- Changement UI : Design System, accessibilité et preuve responsive.
- Changement d'exploitation : manuel, Runbook, SOP et monitoring.
- Changement de version : Changelog, note de release, certification et
  décision Go/No-Go.

Un document ne doit contenir ni secret ni donnée personnelle active.

## 10. Évolutions futures

### 10.1 Roadmap officielle

La seule roadmap de direction active est
[`ROADMAP_PRIVATE_PLATFORM.md`](../ROADMAP_PRIVATE_PLATFORM.md) :

| Version      | Finalité                                                              |
| ------------ | --------------------------------------------------------------------- |
| `1.0.0-rc.1` | Candidate gelée ; certification uniquement                            |
| `1.0.0`      | Première mise en exploitation contrôlée, sans fonctionnalité nouvelle |
| `1.0.x`      | Stabilisation, observabilité, sécurité, accessibilité et performance  |
| `1.1`        | Relation voyageur et réservation directe                              |
| `1.2`        | Disponibilités, distribution et revenus                               |
| `1.3`        | Opérations internes automatisées                                      |
| `1.4`        | Carnet et conciergerie premium                                        |
| `2.0`        | Assistance intelligente responsable, sous contrôle humain             |

Ces numéros expriment une direction, pas une autorisation de développer. Aucune
version `3.0` n'est planifiée. Les anciennes ambitions SaaS, multi-tenant,
marketplace et portail pour propriétaires indépendants sont abandonnées.

### 10.2 Préparer une nouvelle version

1. Partir d'un besoin opérationnel observé et mesurable.
2. Vérifier son alignement avec la plateforme privée et les limites du projet.
3. Définir propriétaire, périmètre, dépendances, risques et critères
   d'acceptation.
4. Mettre à jour Product Book, règles métier et workflows.
5. Évaluer sécurité, RGPD, données, fournisseurs et coût d'exploitation.
6. Créer ou amender un ADR si une décision durable change.
7. Planifier une tranche verticale, les tests et la migration éventuelle.
8. Préparer monitoring, sauvegarde, rollback et mode dégradé.
9. Suivre le workflow branche → PR → Preview → certification.
10. Ne promouvoir qu'après décision Go/No-Go explicite.

La sûreté de production prime toujours sur une capacité avancée. Une nouvelle
fonctionnalité ne doit jamais être glissée dans une phase de certification ou
un correctif de RC.

## 11. Philosophie du projet

Beaux Rivages est développé comme un logiciel d'entreprise qui devra rester
compréhensible dans cinq ans, mais sa valeur ne vient pas de sa complexité. Les
principes suivants guident toute décision future :

1. **Le voyageur et l'exploitation avant la technologie.** Une abstraction
   n'est justifiée que par un besoin réel de Beaux Rivages.
2. **Une seule source de vérité.** Les vues, tableaux de bord et assistants
   dérivent des mêmes contrats et données métier.
3. **Le privé par conception.** Les permissions protègent les opérations
   internes ; elles ne préparent pas un SaaS.
4. **La simplicité réversible.** Préférer la plus petite solution lisible,
   testable, observable et réversible.
5. **La sécurité et les données dès la conception.** Refus par défaut,
   minimisation, RLS, secrets serveur et audit ne sont pas optionnels.
6. **Des preuves plutôt que des déclarations.** Test, recette, sauvegarde,
   restauration et mesure établissent la conformité.
7. **L'humain garde la décision.** Les choix financiers, contractuels,
   opérationnels et les futures suggestions IA restent contrôlés par une
   personne autorisée.
8. **La documentation fait partie du produit.** Une évolution non expliquée
   transmet une dette aux prochains développeurs.
9. **L'hospitalité reste la finalité.** Performance, automatisation et données
   doivent renforcer l'attention portée aux voyageurs, jamais la remplacer.

Avant de coder, comprendre. Avant de fusionner, prouver. Avant de déployer,
sauvegarder et savoir revenir en arrière.
