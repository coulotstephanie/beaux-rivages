# Guide développeur

## Installation

```bash
npm ci
npm run dev
```

Node 22 LTS est défini dans `.nvmrc`. Copier `.env.example` vers `.env.local`
uniquement lorsque des services externes sont branchés.

## Conventions

- TypeScript strict, pas de `any` implicite.
- Composants serveur par défaut ; `"use client"` uniquement pour une interaction.
- Données métier dans les modules racine ou `platform/`, jamais dupliquées dans
  une page.
- Médias via les manifests typés.
- Toute route publique possède metadata, canonical et données structurées.
- Toute mutation serveur nécessite authentification, autorisation et validation.

## Validation

```bash
npm run validate
npm run start -- --port 3100
SITE_URL=http://localhost:3100 npm run test:site
```

## Arborescence d’évolution

```text
platform/
  admin/          orchestration et permissions
  calendar/       normalisation des disponibilités
  content/        snapshot et dépôts de contenu
  media/          recherche et métadonnées
  reservations/   réservation et paiement
  traveler/       espace client
i18n/             locales et catalogues
docs/             décisions et guides
```
