# PRODUCT_BOOK_07_WORKFLOWS.md

Version : 1.0  
Projet : Beaux Rivages  
Statut : Référence Fonctionnelle  
Auteur : Product Team

## Objectif

Ce document décrit tous les workflows métier de Beaux Rivages. Chaque workflow
constitue la référence officielle. Aucun développement ne doit s’en écarter sans
validation. Les workflows doivent être implémentés sous forme de machines à
états lorsque cela est pertinent.

## 1. Réservation directe

`START → dates → disponibilité → logement → expériences → prix → validation → voyageur → dossier → paiement → contrat → confirmation → Guest Journey → END`

Erreurs :

- dates indisponibles → proposer des alternatives ;
- paiement refusé → nouvelle tentative ou autre moyen ;
- tunnel abandonné → réservation abandonnée et relance automatique.

## 2. Paiement

`en attente → CB | virement | ANCV | espèces → validation → facture → contrat → confirmation`

Échec : nouvelle tentative, notification, puis blocage après l’échéance.

## 3. Contrat

`paiement validé → génération PDF → signature électronique → archivage → envoi → confirmation`

## 4. Guest Journey

- J-30 : bienvenue, guides, expériences, Packs Signature et Romance, vélos ;
- J-15 : préparation, météo, marées, restaurants ;
- J-7 : rappel, checklist et informations d’arrivée ;
- J-1 : codes, itinéraire, Wi-Fi et conseils personnalisés ;
- jour J : bienvenue, conseil de Stéphanie & Bruno et support ;
- séjour : météo, marchés, restaurants, animations et Carnet ;
- veille du départ : instructions, météo retour et solde ;
- après départ : remerciement, avis, album, fidélité et prochain séjour.

## 5. Housekeeping

`départ confirmé → mission → assignation → checklist → photos avant → nettoyage → contrôle → photos après → validation → disponible`

Anomalie : ticket maintenance et blocage de la disponibilité.

## 6. Maintenance

`détection → ticket → priorité → assignation → intervention → photos → validation → clôture`

Priorités : critique, haute, normale et faible.

## 7. CRM

`nouvelle réservation → fiche voyageur → historique → préférences → composition du groupe → anniversaires → dépenses → fidélité`

## 8. Revenue Management

`analyse quotidienne concurrence + remplissage + saison → proposition tarifaire → validation automatique | manuelle → publication`

## 9. Concierge

`réservation → expériences → linge | animaux | Packs | horaires | vélos | courses → validation → facturation`

## 10. Départ

`message automatique → checklist → départ → notification ménage → inspection → archivage → disponibilité`

## 11. Fidélisation

`départ → avis → réponse → CRM → segmentation → newsletter → anniversaire → offre fidélité → réservation suivante`

## 12. Annulation

`demande → conditions → remboursement → notification → calendrier libéré → liste d’attente`

## 13. Incident

`signalement → ticket → priorité → notification → suivi → résolution → clôture`

## 14. Intelligence artificielle

Chaque nuit : analyse occupation, prix, avis, messages, maintenance et CRM, puis
rapport, suggestions et actions recommandées.

## Règles générales

Tous les workflows doivent être journalisés, rejouables, traçables, idempotents
lorsque nécessaire, résistants aux erreurs et producteurs d’événements métier.

Événements standard :

- `ReservationCreated`
- `ReservationConfirmed`
- `PaymentSucceeded`
- `PaymentFailed`
- `ContractSigned`
- `GuestCheckedIn`
- `GuestCheckedOut`
- `CleaningStarted`
- `CleaningCompleted`
- `MaintenanceCreated`
- `MaintenanceClosed`
- `ReviewReceived`
- `LoyaltyUpdated`

## Critères d’acceptation

Un workflow est terminé uniquement lorsque ses états, transitions, erreurs,
événements, logs, notifications et documentation sont implémentés et testés.
