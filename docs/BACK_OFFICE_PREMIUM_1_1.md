# Back Office Premium Beaux Rivages — version 1.1

## Objet

Le Back Office 1.1 est le futur centre de pilotage privé de Stéphanie et Bruno. Il privilégie les tâches d’exploitation hôtelière, un vocabulaire métier et des actions directes. Cette livraison constitue l’architecture d’interface : les données sont des démonstrations typées et aucune écriture distante, migration ou intégration fournisseur n’est activée.

## Accès et écrans

| Écran | Route | Usage |
|---|---|---|
| Tableau de bord | `/administration` | Synthèse du jour, activité, météo, marées, revenus et alertes |
| Calendrier central | `/administration/calendriers` | Planning des trois maisons, périodes et réservations |
| Tarifs & offres | `/administration/tarifs` | Saisons, prix, contraintes, promotions, packs et services |
| Voyageurs CRM | `/administration/voyageurs` | Recherche, profil, préférences, fidélité et timeline |
| Communications | `/administration/communications` | Modèles email/SMS, audiences, personnalisation et aperçu |
| CMS & Carnet | `/administration/contenus` | Contenus, catégories, médias, brouillons, aperçu et publication |
| Paramètres | `/administration/parametres` | Coordonnées, règles, modèles, équipe et intégrations |

Toutes les pages déclarent `robots: noindex, nofollow`.

## Composants

Les composants sont regroupés dans `features/back-office/components` et exportés par `features/back-office/index.ts`.

- `BackOfficeShell` : navigation responsive, recherche globale, raccourci `⌘/Ctrl + K`, notifications et thème sombre mémorisé localement.
- `PremiumDashboard` : cartes opérationnelles, agenda, statut des maisons et alertes.
- `ProfessionalCalendar` : vues jour, semaine, mois et année, légende, édition latérale et interactions préparées.
- `PricingStudio` : règles saisonnières, calendrier tarifaire, promotions, codes, Pack Signature et services.
- `GuestCrm` : recherche instantanée, filtres, tags, profil et timeline.
- `CommunicationCenter` : canaux, modèles, listes dynamiques, variables et aperçu ; aucun fournisseur SMS.
- `InternalCms` : catégories, éditeur riche, médias, statuts, aperçu et publication simulée.
- `SettingsCenter` : coordonnées, IBAN masqué, taxe, animaux, équipe, rôles et états d’intégration.

Les données de présentation résident dans `features/back-office/demo-data.ts`. Les types partagés sont dans `features/back-office/types.ts`.

## Principes d’interface

- Responsive ordinateur, tablette et mobile.
- Navigation métier concise, contrastes et libellés accessibles.
- Mode sombre, recherche globale et notifications disponibles depuis toutes les pages.
- Actions destructives absentes ou explicitement séparées.
- Secrets Stripe, Supabase et bancaires jamais affichés en clair.
- Les boutons d’enregistrement, d’envoi, de synchronisation et de publication sont des simulations d’interface tant que les services ne sont pas raccordés.

## Limites avant publication 1.1

- Authentification et autorisations réelles par rôle.
- Persistance Supabase et API serveur avec journal d’audit.
- Synchronisation des plateformes et gestion des conflits.
- Paiements Stripe, webhooks et rapprochement.
- Fournisseur email/SMS, consentement, désinscription et suivi des envois.
- Stockage médias, transformations, validation éditoriale et publication réelle.
- Glisser-déposer persistant, règles tarifaires calculées et moteur de disponibilité.
- Données météo et marées issues de fournisseurs réels.
- Tests E2E, accessibilité automatisée, performance et validation métier sur appareils réels.

## Validation

Exécuter sans pousser de migration :

```bash
npm run lint
npm run typecheck
npx tsx --test tests/back-office-1-1.test.ts
npm run build
```

La Release Candidate 1.0.0-rc.1 reste hors du périmètre de cette branche.
