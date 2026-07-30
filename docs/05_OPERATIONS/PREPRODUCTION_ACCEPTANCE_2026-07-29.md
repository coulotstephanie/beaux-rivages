# Recette préproduction — 29 juillet 2026

## État

**Environnement miroir non disponible — recette non démarrée.**

Les validations locales suivantes sont acquises :

- 121 tests d’intégration réussis ;
- 20 tests unitaires réussis ;
- 10 scénarios E2E réussis sur Chromium desktop et mobile ;
- build Next.js de production réussi ;
- lint et vérification TypeScript réussis ;
- lint du schéma Supabase distant sans erreur.

Ces preuves ne remplacent pas la recette miroir.

## Matrice à signer

| Domaine                         | Automatisé local    | Recette miroir          |
| ------------------------------- | ------------------- | ----------------------- |
| authentification et permissions | partiel             | À faire                 |
| réservation et indisponibilités | oui                 | À faire                 |
| Stripe TEST                     | structure seulement | À faire                 |
| contrats                        | oui                 | À faire                 |
| Revenue et Yield Management     | oui                 | À faire                 |
| Dashboard                       | partiel             | À faire                 |
| Carnet Beaux Rivages            | oui                 | À faire                 |
| Housekeeping et Maintenance     | oui                 | À faire                 |
| CRM                             | partiel             | À faire                 |
| responsive                      | Chromium mobile     | appareils réels à faire |
| multilingue                     | non complet         | À faire                 |

## Conditions de création du miroir

- projet Supabase distinct ;
- données anonymisées ou synthétiques ;
- secrets Stripe TEST dédiés ;
- projet Vercel Preview distinct ;
- aucune connexion aux webhooks, e-mails ou calendriers de production ;
- destruction contrôlée uniquement après conservation des preuves.
