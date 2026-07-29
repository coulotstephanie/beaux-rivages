# Décisions d’architecture

## ADR-001 — Supabase Auth pour le personnel

- **Statut :** accepté
- **Date :** 29 juillet 2026

### Contexte

Le Back Office utilisait un secret partagé dans le navigateur. Cette solution
ne permettait ni révocation individuelle, ni traçabilité par personne, ni
permission métier.

### Décision

Supabase Auth devient le fournisseur d’identité du personnel. Les rôles restent
dans `public.app_user_roles`, déjà utilisé par la RLS. Une route serveur établit
la session dans un cookie `HttpOnly`. Les API vérifient le JWT côté serveur avec
`auth.getUser()` puis contrôlent explicitement le rôle.

### Conséquences

- chaque membre dispose de son propre compte ;
- la révocation et les sessions deviennent individuelles ;
- aucun SDK d’authentification n’alourdit le bundle du Back Office ;
- le rôle est contrôlé à l’entrée des API ;
- le jeton historique reste temporairement disponible pour éviter une coupure ;
- aucun compte ne reçoit automatiquement de permission.

## ADR-002 — Migration incrémentale du Back Office

- **Statut :** accepté
- **Date :** 29 juillet 2026

Le tableau de bord et ses contrats ne sont pas réécrits. Un composant d’accès
réutilisable et une frontière d’autorisation serveur entourent l’existant. Les
futurs découpages Feature First se feront domaine par domaine avec tests de
non-régression.

## ADR-003 — Workflows explicites et événements métier

- **Statut :** accepté
- **Date :** 29 juillet 2026

Le Product Book 07 devient la référence fonctionnelle des transitions métier.
Les prochains domaines seront migrés vers des machines à états typées et une
outbox transactionnelle. Les statuts déjà persistés restent compatibles pendant
la migration.
