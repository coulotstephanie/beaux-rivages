# Contribution

## Flux Git

1. Partir de `main` à jour.
2. Créer une branche `feature/`, `fix/`, `refactor/`, `docs/` ou `hotfix/`.
3. Limiter la branche à un seul domaine.
4. Ajouter code, tests, documentation et changelog.
5. Exécuter `npm run validate`.
6. Ouvrir une Pull Request en brouillon, puis demander une revue.

Les commits suivent Conventional Commits. Les hooks locaux exécutent
lint-staged avant le commit et commitlint sur son message.

## Architecture

Une nouvelle capacité vit dans `features/<nom>` et expose uniquement son API
publique depuis `index.ts`. Les composants React ne dialoguent jamais
directement avec Supabase : ils utilisent un service applicatif, lui-même
branché sur une interface de repository.

Le dossier `_template` décrit la structure attendue. Les domaines historiques
restent dans `platform/` tant qu’une migration verticale, testée et atomique
n’est pas engagée.

## Revue

La revue vérifie le typage, la sécurité, les erreurs, l’accessibilité, le
responsive, les performances, les tests et les éventuelles migrations.
