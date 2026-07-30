# Beaux Rivages — Cadre de développement

## Mission

Faire évoluer le dépôt existant vers une plateforme d’hospitalité premium,
stable et maintenable, sans réécriture globale.

## Règles permanentes

- analyser l’existant avant toute modification ;
- préserver les fonctionnalités opérationnelles ;
- une branche et une Pull Request par domaine ;
- appliquer Feature First, Clean Architecture et TypeScript strict ;
- isoler Supabase derrière des repositories ;
- ne jamais inventer une règle métier manquante ;
- livrer code, tests, documentation et changelog ensemble ;
- utiliser exclusivement des migrations pour la base de données ;
- valider accessibilité, responsive, sécurité et performances.

## Définition de Done

Une fonctionnalité est terminée lorsque le code est relu, les validations sont
vertes, les migrations sont réversibles, la documentation est à jour et la
Pull Request est prête pour recette.
