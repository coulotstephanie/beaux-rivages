# Checklist Go Live

État au 29 juillet 2026 : **NO-GO**. Une case n’est cochée qu’avec une preuve
reproductible. Voir [le rapport synthétique](./GO_NO_GO_2026-07-29.md).

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

- [x] Tests d’intégration (121), unitaires (20), E2E desktop/mobile (10) et
      build production réussis localement sur la release candidate.
- [ ] Rejouer `npm run validate` et les E2E sur le commit exact déployable.
- [ ] Recette Chrome, Safari, Firefox, iOS et Android signée.
- [ ] Clavier, lecteur d’écran, zoom et contrastes vérifiés.
- [ ] Core Web Vitals et budgets médias validés.
- [ ] `/api/health`, APM, logs et alertes testés.
- [ ] Runbooks incident, paiement et base répétés.
