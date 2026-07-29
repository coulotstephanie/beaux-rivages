# ADR-0004 — Authentification

- **Statut :** Accepted
- **Date :** 2026-07-29

## Décision

Supabase Auth est le fournisseur d’identité.

## Méthodes

- Magic Link ;
- email et mot de passe ;
- OAuth dans une évolution future ;
- MFA dans une évolution future.

## Conséquences

L’authentification établit l’identité ; elle n’accorde pas seule une permission.
Les autorisations applicatives sont vérifiées côté serveur et les accès aux
données sont protégés par PostgreSQL RLS.

Aucun rôle privilégié n’est attribué implicitement lors de la création d’un
compte.

