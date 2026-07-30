# Stratégie multi-tenant

## Situation actuelle

Le schéma est mono-tenant :

- aucune entité `tenants`, `brands` ou `accommodations` ;
- les trois maisons sont directement dans `properties` ;
- `properties.slug`, plusieurs références et codes sont uniques globalement ;
- les rôles sont associés à un utilisateur sans organisation ;
- `current_app_role()` ne connaît pas de contexte tenant ;
- les politiques RLS distinguent personnel et voyageur, pas deux organisations.

Une mise en production multi-tenant dans cet état créerait un risque de fuite de
données. La fonctionnalité est donc **préparée mais non activée**.

## Modèle cible

```text
tenants
  └─ brands
       └─ properties
            └─ accommodations
                 └─ reservations
```

Tables d’appartenance :

- `tenant_memberships(user_id, tenant_id, role_id, status)` ;
- `brand_memberships` uniquement si une restriction par marque est nécessaire ;
- liens voyageurs-réservations pour permettre à un voyageur d’être accueilli
  par plusieurs tenants sans dupliquer son identité Auth.

Les catalogues globaux explicitement partagés peuvent rester sans tenant. Toute
exception est documentée.

## Phases de migration

### Phase 1 — Fondations

- créer `tenants`, `brands`, `accommodations` et `tenant_memberships` ;
- créer le tenant Beaux Rivages et sa marque initiale par seed idempotent ;
- ajouter les identifiants de scope sans changer les lectures existantes ;
- ajouter les contraintes et index composites ;
- définir `current_tenant_id()` sans l’activer dans la RLS.

### Phase 2 — Backfill et double lecture

- rattacher toutes les données existantes au tenant initial ;
- rendre les scopes obligatoires sur les tables possédées ;
- adapter repositories, commands, événements et audit ;
- vérifier les agrégats et fichiers par tenant.

### Phase 3 — Isolation

- activer les politiques RLS tenant-aware ;
- remplacer les unicités globales par des unicités composites lorsque requis ;
- ajouter des tests avec au moins deux tenants ;
- vérifier qu’aucune lecture, mutation, export ou URL signée ne traverse la
  frontière.

### Phase 4 — Activation SaaS

- permettre la création contrôlée d’organisations ;
- ajouter invitations, choix de tenant et changement de contexte ;
- mesurer performances, quotas, sauvegardes et restauration par tenant.

## Contraintes obligatoires

- `tenant_id` non nul sur toute donnée possédée après backfill ;
- clés étrangères composites lorsque la cohérence de scope l’exige ;
- aucune valeur `tenant_id` acceptée directement du navigateur sans
  vérification de membership ;
- toutes les clés d’idempotence et projections incluent le contexte tenant ;
- les chemins Storage sont préfixés par le tenant ;
- les événements portent `tenantId` et `brandId` ;
- les exports, logs et tâches planifiées sont filtrés par tenant.

## Tests anti-fuite

Pour chaque repository et API :

1. créer deux tenants et deux utilisateurs ;
2. écrire des données homologues dans chaque tenant ;
3. vérifier les lectures autorisées ;
4. vérifier que lecture, modification, suppression et export croisés échouent ;
5. rejouer les événements et tâches avec le contexte du tenant ;
6. tester les comptes multi-tenant et les révocations.

La migration multi-tenant fera l’objet d’un sprint dédié et d’une revue de
sécurité avant activation.
