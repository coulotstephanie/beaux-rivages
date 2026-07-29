# ADR-0003 — Frontend

- **Statut :** Accepted
- **Date :** 2026-07-29

## Décision

Le frontend utilise Next.js avec l’App Router.

## Pourquoi

- Server Components ;
- streaming ;
- SEO ;
- rendu côté serveur ;
- performances.

## Conséquences

Le Server Component est utilisé par défaut.

Un Client Component n’est introduit que lorsqu’une interaction navigateur,
un état local ou une API exclusivement cliente le nécessite. La frontière
`"use client"` doit rester aussi basse et petite que possible.

