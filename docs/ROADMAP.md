# Roadmap

La roadmap produit officielle est définie dans
`PRODUCT_BOOK_09_ROADMAP.md`. Son avancement réel est suivi dans
`ROADMAP_TRACEABILITY.md`. Le présent document décrit les tranches techniques
immédiates.

## Sprint en cours — Auth Foundation

- [x] choisir Supabase Auth comme identité du personnel ;
- [x] centraliser la vérification serveur des sessions et rôles ;
- [x] conserver une transition réversible depuis le jeton historique ;
- [x] provisionner les profils sans permission implicite ;
- [x] documenter la base, les API et les décisions ;
- [ ] appliquer la migration au projet Supabase de production ;
- [ ] créer les comptes individuels et attribuer leurs rôles ;
- [ ] désactiver définitivement le jeton historique.

## Prochaines tranches

1. Ajouter Playwright, les tests UI, responsive et la couverture.
2. Introduire le registre d’événements et les machines à états du Product Book 07.
3. Découper le Back Office par fonctionnalités et introduire React Query.
4. Connecter les e-mails transactionnels et automatiser le Guest Journey.
5. Raccorder Stripe TEST et effectuer la recette avant tout paiement réel.
6. Brancher les APIs partenaires officielles du Channel Manager.
7. Migrer les textes vers les catalogues i18n.
8. Mesurer Lighthouse et les Core Web Vitals en production.

La convergence vers le monorepo, les API v1 et la stack frontend cible suit la
matrice `TECHNICAL_ARCHITECTURE_TRACEABILITY.md`. Elle reste progressive afin de
préserver le produit en production.

## Critères de sortie V1 commerciale

- juridique et tarifs validés ;
- source de disponibilités testée ;
- aucune double réservation possible dans le processus humain ;
- sauvegarde et restauration documentées ;
- recette mobile/tablette/desktop signée ;
- monitoring, alertes et procédure d’incident actifs.
