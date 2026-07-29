# System Architecture

Version : 1.0  
Projet : Beaux Rivages  
Statut : Architecture système de référence

## 1. Architecture globale

```text
                          Internet
                               │
                     Cloudflare (CDN + WAF)
                               │
                         Vercel Edge Network
                               │
                      Next.js 15 (Frontend)
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
    API Routes           Server Actions          Middleware
        │                      │                      │
        └──────────────────────┼──────────────────────┘
                               │
                    Couche Application
                               │
                     Use Cases / Services
                               │
                     Domain / Business Rules
                               │
                     Repository Interfaces
                               │
                  Supabase Infrastructure
          ┌──────────────┬──────────────┬──────────────┐
          │              │              │              │
      PostgreSQL        Auth         Storage      Edge Functions
          │
      Row Level Security
          │
      Sauvegardes
```

Ce schéma représente la cible. L’état effectivement déployé et les écarts sont
consignés dans `SYSTEM_ARCHITECTURE_TRACEABILITY.md`.

## 2. Architecture logique

```text
Présentation
     ↓
Application
     ↓
Domaine
     ↓
Infrastructure
```

Chaque couche possède une responsabilité explicite. Le domaine ne dépend
d’aucun framework. Les dépendances vont vers les abstractions du domaine ; les
adaptateurs d’infrastructure implémentent les interfaces de repository.

## 3. Flux d’une réservation

```text
Visiteur
  ↓
Page logement
  ↓
Recherche disponibilité
  ↓
Calcul du prix
  ↓
Validation des expériences et attentions
  ↓
Paiement
  ↓
Contrat
  ↓
Confirmation
  ↓
Création du Guest Journey
  ↓
Création CRM
  ↓
Notification ménage
  ↓
Synchronisation calendriers
```

Chaque transition critique est atomique ou compensable. La disponibilité et le
prix sont recalculés côté serveur avant le paiement.

## 4. Flux d’un paiement

```text
Paiement
  ↓
Validation Stripe / fournisseur
  ↓
PaymentSucceeded
  ↓
Création facture
  ↓
Contrat
  ↓
Guest Journey
  ↓
Analytics
  ↓
Dashboard
```

Le webhook signé est la source de vérité du résultat. Les consommateurs sont
idempotents et corrélés à l’événement métier.

## 5. Flux Housekeeping

```text
Départ confirmé
  ↓
Mission créée
  ↓
Planning
  ↓
Checklist
  ↓
Photos
  ↓
Validation
  ↓
Logement disponible
```

Le logement ne redevient disponible qu’après les validations métier requises.

## 6. Flux Maintenance

```text
Signalement
  ↓
Ticket
  ↓
Priorité
  ↓
Assignation
  ↓
Intervention
  ↓
Contrôle
  ↓
Historique
```

Chaque transition est autorisée, horodatée et auditée.

## 7. Flux IA

```text
Chaque nuit
  ↓
Analyse réservations
  ↓
Analyse prix
  ↓
Analyse avis
  ↓
Analyse CRM
  ↓
Rapport
  ↓
Suggestions
  ↓
Validation humaine
```

L’IA formule des recommandations. Elle ne déclenche aucune décision sensible
sans validation humaine et conserve les éléments nécessaires à l’audit.

## 8. Flux Notifications

```text
Événement métier
  ↓
Notification Engine
  ↓
Template
  ↓
Variables validées
  ├── Email
  ├── SMS
  ├── Push
  └── Journal
```

Les canaux sont des adaptateurs indépendants. Un échec de livraison est
rejouable sans reproduire l’action métier source.

## 9. Flux Synchronisation

```text
Réservation
  ↓
Channel Manager
  ├── Airbnb
  ├── Booking
  ├── Abritel
  └── ICS
  ↓
Retour d’état
```

Chaque connecteur possède son propre adaptateur. Les commandes sont
idempotentes, les conflits sont bloqués et les retours sont journalisés.

## 10. Vision d’évolution

L’architecture doit permettre :

- plusieurs marques ;
- plusieurs propriétaires ;
- plusieurs équipes ;
- plusieurs pays ;
- plusieurs applications clientes ;
- plusieurs fournisseurs de paiement ;
- plusieurs moteurs de réservation.

Aucune de ces évolutions ne doit nécessiter une refonte du cœur métier. Elles
sont introduites par interfaces, adaptateurs, isolation tenant et migrations
progressives testées.

