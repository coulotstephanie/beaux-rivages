# Recette Stripe TEST — 29 juillet 2026

## Verdict

**Non exécutée de bout en bout — blocage Go Live P0.**

Les variables `STRIPE_SECRET_KEY` et `STRIPE_WEBHOOK_SECRET` ne sont pas
disponibles dans l’environnement de recette local. Aucun appel Stripe réel n’a
donc été simulé ou présenté comme validé.

## Preuves automatisées acquises

- les clés live sont refusées sans `STRIPE_ALLOW_LIVE=true` ;
- Checkout utilise une clé d’idempotence ;
- le webhook exige et vérifie `stripe-signature` ;
- chaque événement est réclamé de façon idempotente avant traitement ;
- succès, expiration, échec et remboursement sont journalisés ;
- les montants sont calculés et vérifiés côté serveur ;
- le remboursement administratif exige un rôle admin et une même origine.

## Scénarios à exécuter sur le miroir

| Scénario                                        | État    |
| ----------------------------------------------- | ------- |
| acompte accepté, réservation et solde cohérents | À faire |
| paiement intégral accepté                       | À faire |
| solde accepté après acompte                     | À faire |
| carte refusée et message voyageur               | À faire |
| double clic sans double débit                   | À faire |
| webhook livré deux fois sans double écriture    | À faire |
| webhook retardé puis rejoué                     | À faire |
| remboursement partiel                           | À faire |
| remboursement total                             | À faire |
| signature invalide rejetée                      | À faire |
| coupure réseau puis reprise                     | À faire |

La preuve devra inclure les identifiants TEST expurgés, les lignes d’audit, les
statuts en base et les captures du Dashboard Stripe TEST.
