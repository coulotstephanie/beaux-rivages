# User Stories

Version : 1.0

Projet : Beaux Rivages

Statut : Registre officiel

Chaque user story référence les fonctionnalités concernées et ses critères dans
[ACCEPTANCE_CRITERIA.md](../ACCEPTANCE_CRITERIA.md).

## US-0010 — Pack Signature Beaux Rivages

**Fonctionnalités :** `FEATURE-0016`, `FEATURE-0004`, `FEATURE-0005`

**Acteur :** Voyageur

En tant que voyageur, je souhaite sélectionner le Pack Signature afin de
profiter d’une expérience premium.

### Critères

- Le Pack est affiché uniquement lorsqu’il est disponible.
- Son prix est ajouté au panier et recalculé côté serveur.
- Les prestations sont détaillées avant la confirmation.
- Les équipes concernées sont automatiquement informées.
- Les checklists opérationnelles sont adaptées.
- Le contrat est mis à jour ou une nouvelle version est créée s’il était déjà
  généré ; un contrat signé n’est jamais modifié.

## US-0025 — Arrivée autonome

**Fonctionnalités :** `FEATURE-0004`, `FEATURE-0018`, `FEATURE-0032`

**Acteur :** Voyageur

Avant son arrivée, le voyageur reçoit au moment autorisé :

- le code d’accès ;
- l’heure d’arrivée ;
- le guide ;
- les indications de stationnement ;
- les informations Wi-Fi ;
- les conseils utiles ;
- le moyen de joindre l’assistance.

Les secrets ne sont jamais exposés avant la fenêtre prévue.

## US-0032 — Arrivée personnalisée

**Fonctionnalités :** `FEATURE-0016`, `FEATURE-0004`, `FEATURE-0010`

**Acteur :** Voyageur

Le voyageur choisit entre arrivée autonome et accueil personnalisé.

Le système :

- réserve un créneau compatible ;
- prépare la fiche d’accueil ;
- notifie Stéphanie ou Bruno ;
- met à jour le planning ;
- empêche deux accueils incompatibles sur le même créneau.

## US-0050 — Carnet Beaux Rivages

**Fonctionnalités :** `FEATURE-0017`, `FEATURE-0031`

**Acteur :** Voyageur

Le voyageur accède à :

- la météo et les marées ;
- les marchés et producteurs ;
- les itinéraires vélo ;
- les restaurants ;
- les conseils saisonniers ;
- les recommandations de Stéphanie & Bruno ;
- des activités adaptées à son profil.

Les données externes affichent leur fraîcheur et disposent d’un état de repli.

## US-0100 — Dashboard propriétaire

**Fonctionnalités :** `FEATURE-0010`, `FEATURE-0026`

**Acteur :** Propriétaire autorisé

Le propriétaire visualise :

- le chiffre d’affaires ;
- le taux d’occupation ;
- le RevPAR et l’ADR ;
- les réservations à venir et les départs du jour ;
- le ménage et la maintenance ;
- les paiements ;
- la satisfaction.

Chaque indicateur précise sa période, sa devise, son périmètre et sa dernière
mise à jour. Les données respectent le tenant et les permissions.

## US-0200 — Assistant IA

**Fonctionnalités :** `FEATURE-0350`, `FEATURE-0351`

**Acteurs :** Voyageur et hôte

L’assistant peut :

- répondre aux voyageurs ;
- proposer des itinéraires ;
- détecter les anomalies ;
- résumer les avis ;
- recommander des prix ;
- assister les hôtes.

Les réponses indiquent leurs limites. Une validation humaine est obligatoire
pour les messages sortants sensibles, les changements de prix et toute action
ayant un impact financier ou contractuel.
