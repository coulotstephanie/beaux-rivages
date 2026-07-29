# Installation locale

## Prérequis

- Node.js 22 (voir `.nvmrc`) ;
- npm ;
- Git ;
- Docker et la CLI Supabase uniquement pour les tests locaux de base.

## Démarrage

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Ouvrir `http://localhost:3000`. Les secrets réels ne doivent jamais être
commités. Les services externes restent optionnels pour parcourir les pages
publiques.

## Validation

```bash
npm run validate
npm run test:e2e:list
```

`validate` exécute format, lint, TypeScript strict, tests historiques, tests
Vitest et build de production. Les tests Playwright démarrent leur propre
serveur local.
