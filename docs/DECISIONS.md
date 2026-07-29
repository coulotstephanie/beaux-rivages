# Décisions d’architecture

## ADR-001 — Décision humaine pour le Yield Management

Les recommandations tarifaires ne sont jamais publiées automatiquement. Cette règle protège le positionnement premium, rend chaque évolution explicable et limite les risques liés aux données encore peu nombreuses.

## ADR-002 — Un seul moteur tarifaire

Les tarifs Yield acceptés sont des overrides datés chargés par le repository de pricing existant. Le devis, les réservations et le Back Office partagent ainsi la même source de vérité.

## ADR-003 — Connecteurs externes isolés

Les plateformes et futurs signaux IA sont derrière des contrats indépendants. Une intégration peut être remplacée sans modifier le domaine métier.
