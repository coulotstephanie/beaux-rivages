# Feature Catalog

Version : 1.0  
Projet : Beaux Rivages  
Statut : Registre officiel des fonctionnalités

## Règles du registre

- Un identifiant `FEATURE-NNNN` est stable et n’est jamais réutilisé.
- Une fonctionnalité supprimée reste dans le registre avec l’état `Retired`.
- L’état décrit la réalité observable, pas seulement la présence d’un écran.
- Les colonnes Tests et Documentation valent `Oui` uniquement lorsqu’une preuve
  versionnée existe.
- Toute nouvelle fonctionnalité met à jour ce catalogue dans la même Pull
  Request.

## États

| État | Définition |
| --- | --- |
| Production | Activé, exploité et surveillé en production |
| Preview | Déployé en prévisualisation, recette production non terminée |
| Foundation | Domaine ou infrastructure présent, chaîne métier incomplète |
| Planned | Validé dans la roadmap, développement non commencé |
| Retired | Conservé pour l’historique, plus utilisé |

## Catalogue

| Identifiant | Fonctionnalité | Priorité | État | Description | Modules liés | Tests | Documentation |
| --- | --- | --- | --- | --- | --- | --- | --- |
| FEATURE-0001 | Réservation | P0 | Foundation | Crée et suit une réservation avec contrôle des dates et des voyageurs. | Calendrier, Paiement, Contrat, CRM, Guest Journey | Oui | Oui |
| FEATURE-0002 | Paiement | P0 | Preview | Prépare et confirme les paiements via un fournisseur sécurisé. | Réservation, Facturation, Contrat | Oui | Oui |
| FEATURE-0003 | Contrat | P0 | Foundation | Génère, versionne et suit les contrats de séjour. | Réservation, Paiement, Documents | Oui | Oui |
| FEATURE-0004 | Guest Journey | P0 | Foundation | Orchestre les communications avant, pendant et après le séjour. | Réservation, CRM, Notifications | Oui | Oui |
| FEATURE-0005 | Housekeeping | P1 | Foundation | Planifie les missions ménage, checklists et contrôles. | Réservation, Propriétés, Maintenance | Oui | Oui |
| FEATURE-0006 | Maintenance | P1 | Foundation | Suit les incidents, interventions, priorités et blocages. | Propriétés, Housekeeping, Calendrier | Oui | Oui |
| FEATURE-0007 | Revenue Management | P2 | Foundation | Analyse revenus, panier moyen, promotions et campagnes. | CRM, Réservation, Analytics | Oui | Oui |
| FEATURE-0008 | Yield Management | P2 | Foundation | Calcule des recommandations de prix et règles de séjour. | Tarification, Calendrier, Revenue | Oui | Oui |
| FEATURE-0009 | CRM Voyageurs | P0 | Foundation | Centralise identité, séjours, préférences et segments voyageurs. | Réservation, Fidélité, Guest Journey | Oui | Oui |
| FEATURE-0010 | Dashboard | P1 | Foundation | Synthétise arrivées, départs, alertes et indicateurs. | Réservation, Paiement, Opérations | Oui | Oui |
| FEATURE-0011 | Calendrier unifié | P0 | Foundation | Présente disponibilités, réservations et blocages des maisons. | Réservation, Channel Manager, Maintenance | Oui | Oui |
| FEATURE-0012 | Authentification du personnel | P0 | Preview | Établit des sessions individuelles et contrôle les accès internes. | Back Office, Permissions, Audit | Oui | Oui |
| FEATURE-0013 | Réservation directe | P0 | Preview | Permet au voyageur de préparer une demande depuis le site. | Disponibilité, Tarification, Paiement | Oui | Oui |
| FEATURE-0014 | Disponibilité et tarification | P0 | Foundation | Vérifie les dates et calcule un prix côté serveur. | Réservation, Yield, Calendrier | Oui | Oui |
| FEATURE-0015 | Channel Manager | P2 | Foundation | Normalise les connexions, mappings, synchronisations et conflits. | Calendrier, Réservation, Plateformes | Oui | Oui |
| FEATURE-0016 | Concierge Premium | P1 | Foundation | Permet de personnaliser le séjour avec des expériences. | CRM, Paiement, Guest Journey | Oui | Oui |
| FEATURE-0017 | Carnet Beaux Rivages | P1 | Preview | Propose guides, itinéraires et recommandations locales. | Concierge, Météo, Contenus | Oui | Oui |
| FEATURE-0018 | Notifications | P1 | Foundation | Prépare les messages et leur planification multicanale. | Guest Journey, Housekeeping, Alertes | Oui | Oui |
| FEATURE-0019 | Facturation | P0 | Foundation | Produit et suit les factures liées aux réservations. | Paiement, Comptabilité, Contrat | Oui | Oui |
| FEATURE-0020 | Gestion des avis | P2 | Planned | Collecte, analyse et facilite la réponse aux avis voyageurs. | CRM, Guest Journey, IA | Non | Oui |
| FEATURE-0021 | Fidélité | P2 | Foundation | Calcule les niveaux et avantages selon l’historique. | CRM, Revenue, Réservation | Oui | Oui |
| FEATURE-0022 | Cartes cadeaux | P2 | Foundation | Émet et suit des cartes cadeaux avec solde. | Paiement, Revenue, CRM | Oui | Oui |
| FEATURE-0023 | Parrainage | P2 | Foundation | Suit invitations, qualification et récompenses. | CRM, Fidélité, Revenue | Oui | Oui |
| FEATURE-0024 | Codes promotionnels | P2 | Foundation | Valide les réductions selon canal, période et séjour. | Tarification, Revenue, Réservation | Oui | Oui |
| FEATURE-0025 | Campagnes marketing | P2 | Foundation | Segmente et planifie les campagnes commerciales. | CRM, Revenue, Notifications | Oui | Oui |
| FEATURE-0026 | Business Intelligence | P2 | Planned | Consolide les KPI et comparaisons décisionnelles. | Analytics, Revenue, Dashboard | Non | Oui |
| FEATURE-0027 | Comptabilité | P2 | Planned | Centralise acomptes, paiements, commissions et exports. | Paiement, Facturation, BI | Non | Oui |
| FEATURE-0028 | Photothèque | P1 | Preview | Organise, filtre et ouvre les médias des maisons. | Médias, Back Office, Site public | Oui | Oui |
| FEATURE-0029 | Site public premium | P0 | Production | Présente les maisons, l’univers et les expériences Beaux Rivages. | Contenus, SEO, Médias, Réservation | Oui | Oui |
| FEATURE-0030 | Multilingue | P1 | Foundation | Prépare les contenus français, anglais et allemands. | Site public, Guest Journey, Concierge | Oui | Oui |
| FEATURE-0031 | Météo, marées et plages | P1 | Foundation | Fournit le contexte du séjour et des recommandations adaptées. | Carnet, Concierge, Notifications | Oui | Oui |
| FEATURE-0032 | Documents voyageurs | P0 | Foundation | Rend contrats et documents accessibles de manière sécurisée. | Réservation, Contrat, Guest Journey | Oui | Oui |
| FEATURE-0033 | Audit des actions | P0 | Foundation | Journalise les mutations sensibles et leur auteur. | Authentification, Sécurité, Back Office | Oui | Oui |
| FEATURE-0034 | Permissions déclaratives | P0 | Planned | Autorise les actions par permission et tenant. | Authentification, RLS, Multi-tenant | Oui | Oui |
| FEATURE-0035 | Multi-tenant | P2 | Planned | Isole marques, équipes, propriétés et données. | Authentification, RLS, SaaS | Oui | Oui |
| FEATURE-0036 | Recherche globale | P1 | Planned | Recherche voyageurs, réservations, documents et opérations. | Back Office, CRM, Réservation | Non | Oui |
| FEATURE-0037 | Mode hors connexion opérations | P1 | Foundation | Permet la saisie terrain avec synchronisation contrôlée. | Housekeeping, Maintenance, Mobile | Oui | Oui |
| FEATURE-0038 | Analytics produit | P1 | Foundation | Collecte les événements nécessaires aux parcours et conversions. | Site public, Réservation, BI | Oui | Oui |
| FEATURE-0039 | Moteur événementiel | P0 | Planned | Publie et rejoue les événements métier via une outbox. | Tous les domaines | Oui | Oui |
| FEATURE-0040 | Sauvegarde et restauration | P0 | Foundation | Protège les données et formalise leur restauration. | Base de données, Opérations, Sécurité | Oui | Oui |
| FEATURE-0350 | Assistant IA Voyageur | P2 | Planned | Répond et recommande selon le séjour et les préférences. | Carnet, Concierge, CRM | Non | Oui |
| FEATURE-0351 | Assistant IA Hôte | P2 | Planned | Analyse l’activité et propose des actions à l’équipe. | Dashboard, BI, Revenue | Non | Oui |
| FEATURE-0352 | Marketplace | P3 | Planned | Réunit prestataires, expériences et réservations partenaires. | Concierge, Paiement, Partenaires | Non | Oui |
| FEATURE-0353 | Application Mobile | P3 | Planned | Donne accès aux parcours voyageurs et opérations sur mobile. | Carnet, Notifications, Housekeeping | Non | Oui |

## Plages d’identifiants

- `FEATURE-0001` à `FEATURE-0099` : cœur produit et opérations ;
- `FEATURE-0100` à `FEATURE-0199` : commerce, finance et distribution ;
- `FEATURE-0200` à `FEATURE-0299` : plateforme, sécurité et SaaS ;
- `FEATURE-0300` à `FEATURE-0349` : extensions et intégrations ;
- `FEATURE-0350` à `FEATURE-0359` : IA, marketplace et applications clientes.

Les identifiants absents sont réservés ; ils ne correspondent pas à des
fonctionnalités fantômes.

