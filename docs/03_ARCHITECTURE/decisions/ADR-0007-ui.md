# ADR-0007 — UI

- **Statut :** Accepted
- **Date :** 2026-07-29

## Décision

Toutes les interfaces utilisent le Design System.

Aucune primitive UI n’est créée directement dans une page. Les composants sont
réutilisables, accessibles, responsives et documentés.

## Conséquences

Les pages composent des primitives partagées et des composants métier. Toute
nouvelle variante est ajoutée au Design System plutôt que recopiée localement.
L’existant converge progressivement après inventaire, sans réécriture globale.

