# Sprint 1 — Audit et fondations d’ingénierie

Date : 29 juillet 2026  
Périmètre : fondations uniquement, aucune règle métier modifiée.

## Synthèse

Le dépôt n’est pas une maquette à reconstruire. Il contient un site Next.js
fonctionnel, 78 routes construites, un domaine `platform/` déjà découpé, une
documentation produit riche et 104 tests historiques passants au début du
sprint. La stratégie retenue est donc une convergence progressive : les
nouveaux développements adoptent Feature First immédiatement, tandis que les
domaines existants seront migrés verticalement, un par un, dans de futures PR.

## Architecture observée

- Next.js 15 App Router et React 19 ;
- TypeScript strict ;
- Tailwind annoncé, avec une feuille CSS historique importante ;
- Supabase/PostgreSQL, migrations et repositories dans `platform/` ;
- Framer Motion et intégrations Stripe, iCal et médias ;
- contenu éditorial encore réparti entre fichiers racine, `content/` et
  registres spécialisés ;
- Design System initial dans `components/ui` ;
- documentation structurée en huit espaces canoniques.

## Points forts

- build de production réussi avant modification ;
- 104 tests historiques verts ;
- aucune occurrence de `any` détectée dans le code TypeScript audité ;
- absence d’accès Supabase direct depuis les composants React ;
- contrats de repositories déjà présents dans plusieurs domaines ;
- SEO, médias et contenu centralisés pour les pages publiques ;
- règles métier, ADR, roadmap et Product Book déjà documentés.

## Dette et incohérences

- composants historiques parfois trop volumineux : `AdminDashboard.tsx`
  dépasse 300 lignes ;
- 46 composants clients, à réévaluer route par route en faveur des Server
  Components ;
- styles et composants HTML encore dupliqués hors Design System ;
- données éditoriales réparties dans plusieurs fichiers racine ;
- absence initiale de providers partagés, layouts applicatifs et états
  transverses ;
- absence initiale de Prettier, hooks Git, commitlint, Vitest, Playwright et CI
  versionnée ;
- la structure `platform/` est orientée domaine mais ne respecte pas encore
  partout le gabarit Feature First ;
- la couverture de tests n’est pas encore mesurée globalement à 80 % ;
- 16 alertes `npm audit` de sévérité haute concernent actuellement la chaîne
  d’outillage et Next.js. Elles nécessitent une PR de sécurité dédiée : aucun
  correctif majeur automatique n’a été forcé dans ce sprint.

## Risques et bugs identifiés

- une migration globale immédiate de `platform/` casserait les nombreux imports
  existants et mélangerait plusieurs domaines dans une seule PR ;
- les pages historiques utilisent encore des boutons, champs et tableaux bruts,
  avec une homogénéité d’accessibilité variable ;
- l’authentification administrative conserve un filet de migration documenté,
  à désactiver après activation complète des comptes ;
- les intégrations externes doivent rester simulées ou injectées dans les tests
  tant que leurs environnements de recette ne sont pas disponibles.

## Fondations apportées

- gabarit Feature First et alias TypeScript explicites ;
- Design System étendu, états de chargement/erreur/vide et pages système ;
- layouts Public, Dashboard, Admin, Owner et Guest ;
- providers Theme, Query, Supabase, Session, Toast et Modal ;
- ESLint, Prettier à périmètre progressif, EditorConfig, Husky, lint-staged et
  commitlint ;
- Vitest, Testing Library et Playwright ;
- pipeline GitHub Actions pour validation complète et smoke tests ;
- points d’entrée documentaires stables sans dupliquer les sources canoniques.

## Captures de recette

- [Page maintenance — desktop](../04_ENGINEERING/screenshots/sprint-1-maintenance-desktop.png)
- [Page 403 — mobile](../04_ENGINEERING/screenshots/sprint-1-forbidden-mobile.png)

## Plan priorisé après ce sprint

1. Sécurité des dépendances et mise à niveau contrôlée de Next.js/outillage.
2. Authentification et autorisations P0 jusqu’à suppression du jeton historique.
3. Migration verticale de la réservation vers `features/reservations`.
4. Consolidation des composants HTML historiques vers le Design System.
5. Mesure de couverture et seuil progressif vers 80 %.

Chaque étape doit faire l’objet d’une PR atomique et conserver les contrats
publics existants pendant sa migration.
