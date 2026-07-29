# Base de données

## Source de vérité

Le schéma PostgreSQL est défini exclusivement dans `supabase/migrations/`.
Chaque évolution structurelle possède un rollback dans `supabase/rollbacks/`.
Les types générés sont conservés dans
`platform/database/database.types.ts`.

## Domaines persistés

La base couvre les logements, tarifs, voyageurs, réservations, disponibilités,
paiements, documents, calendriers, messages, CRM, conciergerie, ménage,
maintenance, stocks, notifications et journaux d’audit.

## Identités et rôles

`auth.users` porte l’identité Supabase Auth. Le trigger
`handle_new_auth_user()` crée le profil minimal correspondant dans
`public.users`. Les permissions sont attribuées séparément dans
`public.app_user_roles`.

| Rôle | Usage |
| --- | --- |
| `admin` | administration complète et opérations sensibles |
| `concierge` | gestion des séjours et opérations quotidiennes |
| `read_only` | consultation et exports autorisés |

La création d’un compte n’accorde aucun rôle implicitement. L’accès reste refusé
tant qu’une attribution explicite n’a pas été livrée par une migration de
données contrôlée.

## RLS et accès serveur

Les tables privées activent Row Level Security. Les politiques utilisent
`current_app_role()` et `auth.uid()`. Les routes Next.js utilisent le client
serveur privilégié uniquement après l’autorisation applicative.

Variables nécessaires :

```text
SUPABASE_URL
SUPABASE_SECRET_KEY
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

La clé serveur ne doit jamais utiliser le préfixe `NEXT_PUBLIC_`.

## Migration Auth Foundation

`20260729160000_staff_auth_foundation.sql` provisionne les profils, rattrape les
comptes Auth existants, indexe les rôles et documente les objets
d’autorisation.

Après application, créer les comptes professionnels dans Supabase Auth puis
livrer leur rôle dans une migration de données dédiée. Après validation de tous
les comptes, définir `ADMIN_TOKEN_FALLBACK_ENABLED=false`.
