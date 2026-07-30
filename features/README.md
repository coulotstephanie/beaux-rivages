# Features

Les nouveaux domaines utilisent une architecture Feature First. Une feature
porte sa présentation, ses cas d’usage et ses contrats sans dépendre d’une autre
feature concrète.

```text
features/<feature>/
  components/
  hooks/
  services/
  repositories/
  schemas/
  types/
  tests/
  README.md
```

Les dépendances partagées appartiennent à `components/`, `hooks/`, `lib/`,
`services/` ou `types/`. Les modules historiques de `platform/` migrent
verticalement, un domaine à la fois, avec des façades de compatibilité.

Le modèle de création se trouve dans [`_template`](./_template/README.md).
