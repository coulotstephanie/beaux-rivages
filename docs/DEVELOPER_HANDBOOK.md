# Developer Handbook

Version : 1.0  
Projet : Beaux Rivages  
Statut : Référence officielle de développement

## 1. Philosophie

Beaux Rivages est développé comme un logiciel d’entreprise. Chaque ligne de
code doit pouvoir être relue dans cinq ans.

Les priorités sont la lisibilité, la maintenabilité, l’évolutivité, la sécurité
et la performance.

## 2. Standards de développement

Sont interdits :

- `any` ;
- le code dupliqué ;
- les composants géants ;
- la logique métier dans React ;
- le SQL dans les composants.

Sont obligatoires :

- le typage strict ;
- les tests ;
- la documentation ;
- l’accessibilité ;
- le responsive.

## 3. Structure du projet

Chaque domaine converge vers une organisation Feature First :

```text
features/<domain>/
  components/
  hooks/
  services/
  repositories/
  schemas/
  tests/
  types/
  README.md
```

La migration de l’arborescence existante reste incrémentale. Aucun déplacement
global ne doit rompre les routes, les imports ou les contrats publics.

## 4. Architecture Frontend

- Les Server Components sont utilisés par défaut.
- Un Client Component n’est introduit que pour une interaction navigateur.
- Les composants sont petits, spécialisés et composables.
- La logique métier appartient au domaine ou aux services, jamais à la vue.
- Les données distantes passent par des hooks dédiés tels que
  `useReservations()`, `useGuest()`, `usePayments()` ou `useProperty()`.
- Les hooks génériques sans responsabilité claire, tels que `useEverything()`,
  sont interdits.

Un composant ne devrait pas dépasser 250 lignes. Une vue complexe est découpée,
par exemple, en `ReservationCard`, `ReservationHeader`,
`ReservationTimeline`, `ReservationPrice` et `ReservationActions`.

## 5. Architecture Backend

Chaque module dispose de services métier spécialisés, par exemple
`ReservationService`, `PaymentService`, `ContractService` et
`GuestJourneyService`.

Les services orchestrent les cas d’usage. Le Repository Pattern impose que les
repositories constituent la seule couche autorisée à dialoguer avec Supabase.
Les routes et actions serveur
valident, autorisent puis délèguent ; elles ne portent pas la logique métier.

## 6. Base de données

- Toute évolution passe par une migration versionnée.
- Les relations, contraintes, index, triggers et politiques RLS sont explicites.
- Le SQL n’est jamais exécuté depuis un composant React.
- Les migrations disposent d’une stratégie de retour arrière ou d’atténuation.
- Les tables et règles de persistance sont documentées dans `DATABASE.md`.

## 7. UI Design System

Les interfaces utilisent les primitives du Design System :

`Button`, `Card`, `Dialog`, `Table`, `Badge`, champs, messages d’erreur,
chargements et notifications.

Une vue métier ne recrée pas localement une primitive déjà disponible. Toute
nouvelle primitive expose des variantes documentées et accessibles.

Les interfaces prennent en charge Mobile, Tablette, Laptop, Desktop et Ultra
Wide. Elles respectent WCAG AA : navigation clavier, attributs ARIA pertinents,
contrastes suffisants, focus visible, labels explicites et messages d’erreur
accessibles.

## 8. Conventions React

- Composition plutôt qu’héritage.
- État local minimal.
- Effets réservés aux synchronisations avec un système externe.
- Clés stables dans les listes.
- États vide, chargement, erreur et succès systématiques.
- Aucun appel Supabase direct dans React.

## 9. Conventions TypeScript

- `strict` reste activé.
- `any` est interdit ; `unknown` est validé avant usage.
- Les types métiers sont explicites : `Reservation`, `Guest`, `Property`,
  `Invoice`, `Contract`, `CleaningMission`, `MaintenanceTicket`.
- Les entrées externes sont validées par schéma.
- Les états impossibles doivent être rendus non représentables lorsque cela est
  raisonnable.

## 10. API

- Les contrats sont typés, validés et documentés.
- Toute mutation vérifie l’identité, la permission et l’origine.
- Les erreurs publiques ne divulguent aucun secret.
- Les opérations sensibles sont idempotentes et journalisées.
- Les nouvelles API convergent vers une version explicite sans casser les routes
  existantes.

## 11. Tests

Avant toute Pull Request, la stratégie couvre selon le risque :

- tests unitaires ;
- tests d’intégration ;
- tests E2E ;
- tests d’accessibilité ;
- tests responsive ;
- tests de sécurité.

La cible de couverture minimale est de 80 %. Une fonctionnalité non mesurée ne
peut pas être déclarée conforme à cette cible.

## 12. Git

- Une fonctionnalité correspond à une branche et une Pull Request.
- Aucun commit direct n’est réalisé sur `main`.
- Les commits respectent Conventional Commits.
- Une Pull Request reste atomique, relisible et réversible.

## 13. CI/CD

Le flux de référence est :

```text
GitHub → Actions → Preview → Validation → Production
```

La CI exécute au minimum le lint, le typage, les tests et le build. Aucun échec
ne peut être ignoré sans décision documentée.

## 14. Sécurité

- Toutes les entrées sont validées et, si nécessaire, assainies.
- Toutes les permissions passent par l’autorisation centralisée et les rôles.
- Toutes les actions sensibles sont historisées.
- Les secrets restent côté serveur.
- Les accès aux données sont protégés par RLS et testés.
- Les points exposés appliquent une limitation de débit adaptée au risque.

## 15. Performance

Les revues vérifient Core Web Vitals, poids des images, chargement différé,
streaming, cache, SSR et RSC. Toute optimisation doit préserver l’accessibilité
et la justesse des données.

## 16. Revue de code

La Pull Request vérifie :

- l’architecture et la lisibilité ;
- la sécurité et les permissions ;
- la performance ;
- l’UX, le responsive et l’accessibilité ;
- les migrations ;
- les tests ;
- la documentation.

## 17. Déploiement

Une Preview est validée avant la production. Le déploiement de production
s’effectue uniquement depuis une version approuvée, avec migrations contrôlées,
surveillance et procédure de retour arrière.

## 18. Checklists

### Avant commit

- formatage et lint ;
- typage strict ;
- tests ciblés ;
- aucune donnée sensible ;
- diff relu.

### Avant Pull Request

- tests unitaires, intégration et UI pertinents ;
- responsive et clavier vérifiés ;
- erreurs et migrations vérifiées ;
- documentation mise à jour.

### Avant production

- build et contrôles verts ;
- Preview validée ;
- migrations et retour arrière préparés ;
- monitoring opérationnel ;
- recette métier approuvée.

## 19. Documentation

Chaque fonctionnalité met à jour, selon son impact :

- `API.md` ;
- `DATABASE.md` ;
- `CHANGELOG.md` ;
- `ROADMAP.md` ;
- `PRODUCT_BOOK_07_WORKFLOWS.md` ;
- les décisions d’architecture concernées.

Le guide pratique d’installation reste dans `DEVELOPER_GUIDE.md`. Le présent
Handbook constitue la norme de gouvernance.

## 20. Intelligence Artificielle

Toute fonctionnalité d’IA doit :

- conserver un humain dans la boucle pour les décisions sensibles ;
- expliciter ses sources et limites ;
- protéger les données personnelles ;
- produire des sorties validées et auditables ;
- permettre la désactivation et le retour à un parcours déterministe ;
- être évaluée avant toute automatisation en production.

## Définition de « Done »

Une tâche est terminée lorsque :

- le code est validé ;
- les tests sont verts ;
- la documentation est à jour ;
- le responsive et l’accessibilité sont vérifiés ;
- la performance et la sécurité sont contrôlées ;
- la Pull Request est approuvée.
