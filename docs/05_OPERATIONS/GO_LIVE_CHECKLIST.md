# Checklist Go Live

## Décision

- [ ] Tous les P0 de l’audit production sont clos avec preuve.
- [ ] Le responsable du Go Live est nommé.
- [ ] La fenêtre de rollback et les contacts sont confirmés.

## Données et sécurité

- [ ] Migrations et tests RLS réussis en préproduction.
- [ ] Sauvegarde chiffrée récente et restauration démontrée.
- [ ] Comptes individuels actifs et jeton historique désactivé.
- [ ] Secrets production vérifiés et rotation documentée.
- [ ] CSP validée et alertes de dépendances traitées ou acceptées.

## Paiement et réservation

- [ ] Chevauchement impossible côté serveur et base.
- [ ] Stripe TEST : acompte, solde, intégral, échec et remboursement.
- [ ] Webhooks signés, idempotents et rejouables.
- [ ] Contrats et messages validés juridiquement et métier.

## Qualité et exploitation

- [ ] `npm run validate` et E2E réussis sur le commit déployé.
- [ ] Recette Chrome, Safari, Firefox, iOS et Android signée.
- [ ] Clavier, lecteur d’écran, zoom et contrastes vérifiés.
- [ ] Core Web Vitals et budgets médias validés.
- [ ] `/api/health`, APM, logs et alertes testés.
- [ ] Runbooks incident, paiement et base répétés.
