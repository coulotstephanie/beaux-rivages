# Standards de développement

- TypeScript strict et validation Zod aux frontières.
- Domaines feature-first avec contrats, moteur métier pur, repository serveur, API et tests.
- Composition plutôt qu’héritage ; aucune dépendance d’un domaine vers un composant React.
- Migrations additives et réversibles ; aucune modification manuelle du schéma.
- `apply_patch` pour les changements ciblés et commits conventionnels par sprint.
- Les capacités externes non connectées sont annoncées comme telles, jamais simulées.
