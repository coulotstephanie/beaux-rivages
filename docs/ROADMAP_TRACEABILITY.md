# Traçabilité de la roadmap produit

Référence : [PRODUCT_BOOK_09_ROADMAP.md](./PRODUCT_BOOK_09_ROADMAP.md).

## Situation réelle

| Version | État | Commentaire |
| --- | --- | --- |
| V1 — Opérationnelle | Candidate | vitrine solide et fondations métier ; activation commerciale incomplète |
| V2 — Automatisation | Partielle | modules présents, fournisseurs et orchestrations encore incomplets |
| V3 — Revenus | Partielle | moteurs et interfaces présents, Yield et BI réels à consolider |
| V4 — Multi-plateformes | Partielle | iCal actif, connecteurs partenaires officiels non configurés |
| V5 — Conciergerie | Partielle avancée | catalogue et commandes présents, partenaires/paiement à brancher |
| V6 — Mobile | Non commencée | file hors ligne limitée, aucune application native |
| V7 — IA | Préparée | recommandations locales, aucune orchestration IA de production |
| V8 — Scalabilité | Préparée | stratégie multi-tenant documentée, modèle non migré |
| V9 — Marketplace | Non commencée | aucun cycle partenaire complet |
| V10 — SaaS | Non commencée | abonnements et onboarding tenant absents |

## Blocages de sortie V1

La Version 1 ne doit pas être déclarée commercialement terminée avant :

1. fusion et activation de Supabase Auth pour les comptes professionnels ;
2. application et validation des migrations sur l’environnement cible ;
3. recette Stripe TEST complète puis autorisation explicite du mode réel ;
4. fournisseur de signature électronique configuré ;
5. fournisseur d’e-mails transactionnels configuré ;
6. automatisation et preuve d’envoi du Guest Journey ;
7. vérification de la synchronisation des calendriers et procédure d’incident ;
8. tests navigateur, responsive, accessibilité et Lighthouse sur la release ;
9. validation juridique des contrats, paiements et conditions ;
10. sauvegarde et exercice de restauration documentés.

## Ordre recommandé

1. terminer le P0 Auth Foundation en cours ;
2. construire la couche workflows, événements et outbox ;
3. activer le parcours réservation → paiement → contrat → Guest Journey ;
4. ajouter E2E, accessibilité, couverture et observabilité ;
5. terminer les automatisations P1 ;
6. seulement ensuite ouvrir les chantiers V3 à V10.

Cette séquence maximise la valeur immédiate sans multiplier des modules
inachevés.
