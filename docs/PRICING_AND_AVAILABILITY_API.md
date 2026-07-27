# Tarification et disponibilités

## Principes

Beaux Rivages est la source de vérité pour ses tarifs. Les flux iCal sont
exclusivement utilisés pour les périodes occupées : ils ne contiennent ni prix,
ni stock transactionnel, ni garantie de synchronisation instantanée. Aucun
scraping de plateforme n’est réalisé.

Les plans tarifaires sont lus via `RatePlanRepository`. La première
implémentation utilise `content/rates.json`; une base chiffrée pourra remplacer
ce dépôt sans modifier le moteur, les API ou les écrans. L’interface
d’administration refuse volontairement de prétendre enregistrer une
modification en production tant que ce dépôt persistant n’est pas configuré.

## API publiques

### `GET /api/calendar?property={slug}`

Retourne les périodes normalisées et l’état des imports du logement. Les URL
sources ne sont jamais retournées.

### `GET /api/availability`

Paramètres : `arrival`, `departure`, `guests` et `property` optionnel. Retourne
les maisons disponibles, la compatibilité de capacité et la santé des sources.

### `POST /api/pricing`

Calcule le détail tarifaire à partir du logement, des dates, voyageurs,
options, expériences et d’un code promotionnel optionnel.

### `GET /api/rates?property={slug}&year={année}`

Retourne le tarif et la règle de séjour de chaque jour d’une année.

### `GET /api/promotions?property={slug}`

Retourne uniquement les promotions publiques actives. Les codes ne sont jamais
énumérés.

### `POST /api/quote`

Vérifie simultanément la disponibilité et calcule le devis. Une indisponibilité
retourne HTTP `409`.

### `POST /api/reservation`

Refait une synchronisation avant validation. La route reste en mode
`validated-not-persisted` tant que `ReservationRepository` n’est pas branché.
Les paiements sont désactivés.

### `GET /api/ical?property={slug}`

Exporte les périodes indisponibles au format iCal. Ce flux peut être importé
par une plateforme compatible. Ce mécanisme ne remplace pas une API
bidirectionnelle : le délai final dépend de la fréquence d’import du
fournisseur.

## Administration

- `/administration/calendriers` : état des sources et synchronisation forcée.
- `/administration/tarifs` : calendrier annuel, sélection de plage et
  préparation des modifications groupées.

Les API d’administration exigent `Authorization: Bearer <ADMIN_API_TOKEN>`,
sont limitées en fréquence et ne renvoient jamais les secrets.

## Channel managers et API futures

`RateDistributionConnector` permet d’ajouter Smoobu, Beds24, Lodgify, Airbnb ou
Booking Connectivity. `CalendarConnector` isole les imports de disponibilité.
`PaymentMethodAdapter` prépare Stripe, virement, espèces et
Chèques-Vacances ; tous restent désactivés dans cette version.

## Limites opérationnelles

- iCal est généralement unidirectionnel par abonnement. L’export Beaux Rivages
  fournit la direction retour lorsque la plateforme accepte un calendrier
  externe.
- Les caches serveur durent cinq minutes ; la création d’une demande force une
  nouvelle synchronisation.
- La taxe de séjour est désactivée tant que le taux officiel de chaque
  hébergement n’est pas confirmé.
- Une base persistante est requise avant d’activer les réservations, les
  modifications tarifaires en production ou un paiement.
