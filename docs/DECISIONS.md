# Décisions d’architecture

> Ce registre historique est conservé pour compatibilité. La série formelle des
> ADR commence avec
> [ADR-0001 — Principes fondateurs](./03_ARCHITECTURE/decisions/ADR-0001-founding-principles.md).

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

## ADR-004 — Architecture cible adoptée par convergence

- **Statut :** accepté
- **Date :** 29 juillet 2026

Le Product Book 08 définit la cible technique. Le dépôt actuel ne sera pas
déplacé immédiatement en monorepo. Chaque domaine migrera verticalement avec
compatibilité, mesures de performance et tests de non-régression. Cette décision
évite une réécriture structurelle sans valeur métier immédiate.

## ADR-005 — Multi-tenant préparé, non activé

- **Statut :** accepté
- **Date :** 29 juillet 2026

Le modèle multi-tenant sera introduit par fondations, backfill, isolation RLS
puis activation. Aucun simple ajout de colonnes nullable ne sera considéré
suffisant. Les permissions deviendront déclaratives et seront rattachées aux
memberships tenant.

## ADR-006 — Roadmap gouvernée par des critères de sortie

- **Statut :** accepté
- **Date :** 29 juillet 2026

Le Product Book 09 définit l’ordre produit. Une version n’est pas considérée
terminée parce que ses écrans existent : ses fournisseurs, automatisations,
tests, procédures et critères de production doivent être effectivement validés.

## ADR-007 — Brand Book comme garde-fou produit

- **Statut :** accepté
- **Date :** 29 juillet 2026

Le Brand Book gouverne les chaînes visibles, la photographie, les interactions
et les contenus. Les termes techniques internes peuvent conserver leur stabilité
contractuelle, tandis que l’interface voyageur privilégie expériences,
attentions, maisons et séjours.

## ADR-008 — Developer Handbook comme norme de contribution

- **Statut :** accepté
- **Date :** 29 juillet 2026

Le Developer Handbook gouverne toute nouvelle contribution. Les écarts de
l’existant sont consignés dans une matrice de traçabilité et corrigés
progressivement, domaine par domaine, sans réécriture globale ni déclaration de
conformité non mesurée.

## ADR-009 — Architecture système cible et activation vérifiable

- **Statut :** accepté
- **Date :** 29 juillet 2026

`SYSTEM_ARCHITECTURE.md` définit la cible globale et ses flux. Un composant
d’infrastructure n’est toutefois considéré actif que lorsqu’il est configuré,
testé et exploitable. La matrice de traçabilité distingue ainsi Cloudflare,
Edge Functions, fournisseurs de notification et automatisations cibles des
briques réellement déployées.

## ADR-010 — Règles métier comme autorité sur l’implémentation

- **Statut :** accepté
- **Date :** 29 juillet 2026

`BUSINESS_RULES.md` devient l’autorité fonctionnelle. Les écarts de statuts,
transitions, immutabilité, suppression logique et audit sont enregistrés avant
toute correction. La mise en conformité s’effectue par migrations additives et
machines à états testées, sans supprimer brutalement les valeurs historiques.
