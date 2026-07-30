# Catalogue des permissions

## Principe

Les permissions sont des données déclaratives. Les routes et use cases demandent
une permission ; ils ne connaissent pas la composition des rôles.

## Catalogue initial

### Réservations et voyageurs

- `reservation.read`
- `reservation.create`
- `reservation.update`
- `reservation.cancel`
- `reservation.archive`
- `guest.read`
- `guest.update`
- `crm.export`

### Finance et documents

- `payment.read`
- `payment.refund`
- `invoice.read`
- `contract.read`
- `contract.generate`
- `contract.archive`

### Opérations

- `housekeeping.read`
- `housekeeping.update`
- `maintenance.read`
- `maintenance.create`
- `maintenance.assign`
- `concierge.read`
- `concierge.update`

### Pilotage

- `pricing.read`
- `pricing.update`
- `channel.read`
- `channel.manage`
- `marketing.read`
- `marketing.manage`
- `analytics.view`
- `audit.read`
- `staff.manage`

## Compatibilité actuelle

La PR Auth utilise encore les rôles `admin`, `concierge` et `read_only`
directement dans les frontières API. Ce catalogue définit la cible du prochain
sprint permissions. La migration devra :

1. ajouter `permissions`, `roles` et `role_permissions` ;
2. rattacher les memberships tenant aux rôles ;
3. fournir `authorizePermission(request, permission)` ;
4. traduire les trois rôles actuels sans modifier leurs droits ;
5. remplacer route par route les listes codées ;
6. tester chaque permission et chaque refus.
