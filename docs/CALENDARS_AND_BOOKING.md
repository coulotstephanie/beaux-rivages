# Calendriers et réservation

## Synchronisation iCal

`parseICalendar` normalise les événements Airbnb, Booking, Abritel ou manuels
dans un même `CalendarBlock`. `mergeCalendarBlocks` déduplique et ignore les
annulations.

Le futur job de synchronisation devra :

- télécharger uniquement des URLs autorisées côté serveur ;
- appliquer un timeout, une limite de taille et une protection SSRF ;
- conserver la date de dernière synchronisation et les erreurs ;
- ne jamais considérer iCal comme une garantie temps réel ;
- bloquer provisoirement les dates pendant une demande en cours.

## Réservation

Le tunnel public couvre déjà maison, dates, voyageurs, options, expériences et
récapitulatif. `ReservationRepository` permettra de remplacer la passerelle
e-mail par une demande persistée. `PaymentGateway` reste optionnel et séparé.

États prévus : `draft`, `requested`, `confirmed`, `cancelled`, `completed`.
Le paiement possède son propre cycle de vie pour éviter de confondre réservation
et encaissement.
