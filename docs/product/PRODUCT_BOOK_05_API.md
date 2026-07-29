# Beaux Rivages — Contrats d’API, événements et intégrations

Version : 1.0  
Auteur : Product Management & Software Architecture  
Statut : document de référence

## 1. Objet

Ce document définit les contrats d’échange de Beaux Rivages :

- routes HTTP internes et publiques ;
- Server Actions ;
- événements de domaine et techniques ;
- webhooks entrants et sortants ;
- connecteurs de plateformes ;
- paiements, messagerie, calendriers et documents ;
- sécurité, idempotence, erreurs, versionnement et observabilité.

Il complète le [modèle de données](PRODUCT_BOOK_04_DATABASE.md). Les routes et types présents dans le code restent les contrats exécutables ; un écart avec ce document doit être corrigé ou déclaré.

## 2. Statuts

- **DÉPLOYÉ** : route ou comportement présent dans le dépôt ;
- **PARTIEL** : contrat présent mais incomplet ou provisoire ;
- **CIBLE** : comportement requis pour la plateforme industrielle ;
- **À DÉCIDER** : validation produit, partenaire ou sécurité nécessaire.

## 3. Principes d’API

| Identifiant | Statut | Règle |
|---|---|---|
| API-001 | DÉPLOYÉ | Les API sont implémentées par des Route Handlers Next.js sous `/api`. |
| API-002 | DÉPLOYÉ | Les entrées sensibles sont validées côté serveur, majoritairement avec Zod. |
| API-003 | DÉPLOYÉ | Les mutations publiques contrôlent l’origine et sont limitées en fréquence. |
| API-004 | CIBLE | Un contrat est indépendant de la structure interne des tables. |
| API-005 | CIBLE | Toute mutation métier possède une commande, un résultat typé et des erreurs stables. |
| API-006 | CIBLE | Les appels rejouables utilisent une clé d’idempotence. |
| API-007 | CIBLE | Aucun prix, droit, statut ou propriétaire envoyé par le client n’est accepté sans recalcul. |
| API-008 | CIBLE | Les réponses ne révèlent ni secret, ni détail SQL, ni payload fournisseur sensible. |
| API-009 | CIBLE | Les intégrations externes sont isolées derrière des interfaces typées. |
| API-010 | CIBLE | Les effets réseau sont asynchrones lorsque leur latence ou disponibilité ne doit pas bloquer une transaction. |

## 4. Conventions HTTP

### 4.1 Format

- JSON UTF-8 pour les contrats applicatifs ;
- `text/calendar` pour les exports iCal ;
- `text/csv` pour les exports administratifs ;
- `application/pdf` pour les documents générés ;
- dates civiles au format `YYYY-MM-DD` ;
- instants au format ISO 8601 avec fuseau ;
- montants échangés en centimes dans les API persistantes ;
- devise ISO 4217, actuellement `EUR` ;
- identifiants internes UUID ;
- références humaines distinctes des UUID.

### 4.2 En-têtes cibles

| En-tête | Usage |
|---|---|
| `Authorization` | jeton d’accès ou session selon le contexte |
| `Content-Type` | type exact du corps |
| `Idempotency-Key` | création et commande rejouable |
| `X-Request-Id` | corrélation bout en bout |
| `Stripe-Signature` | signature webhook Stripe |
| `If-Match` | verrou optimiste futur |
| `Retry-After` | délai après limitation ou indisponibilité |

Les réponses privées portent `Cache-Control: private, no-store`. Les réponses publiques explicitement cacheables définissent une durée et une stratégie de revalidation.

### 4.3 Statuts HTTP

| Code | Sens |
|---:|---|
| `200` | lecture ou commande réussie |
| `201` | ressource ou commande créée |
| `202` | commande acceptée pour traitement asynchrone |
| `204` | succès sans contenu |
| `400` | entrée invalide |
| `401` | authentification absente ou invalide |
| `403` | identité connue mais action interdite ou origine refusée |
| `404` | ressource inexistante ou non visible |
| `409` | conflit de disponibilité, version ou idempotence |
| `422` | entrée valide syntaxiquement mais incompatible avec les règles métier |
| `429` | limite de fréquence atteinte |
| `500` | erreur interne non exposée |
| `502` | fournisseur externe en échec |
| `503` | dépendance ou fonctionnalité indisponible |

### 4.4 Erreur cible

```json
{
  "error": {
    "code": "DATES_UNAVAILABLE",
    "message": "Ces dates ne sont plus disponibles.",
    "requestId": "req_...",
    "details": {
      "field": "arrival"
    }
  }
}
```

Règles :

- `code` est stable, non traduit et documenté ;
- `message` est adapté à l’utilisateur ;
- `details` ne contient aucune donnée interne sensible ;
- `requestId` permet de rapprocher logs, audit et support ;
- une même cause renvoie le même code sur toutes les routes.

**Écart API-ERR-01 :** les routes actuelles utilisent plusieurs formes d’erreur (`{ error: string }`, texte brut et `code` optionnel). Une enveloppe commune doit être introduite de manière compatible.

## 5. Authentification et autorisation

### Contextes

| Contexte | Mécanisme actuel | Cible |
|---|---|---|
| public | aucune identité, rate limit | mêmes protections, anti-abus distribué |
| réservation directe | origine identique | CSRF robuste, idempotence et validation |
| espace séjour | jeton signé de séjour | jeton court, révocable et lié au voyageur |
| administration | `Bearer ADMIN_API_TOKEN` | session Supabase Auth + rôle/capacité |
| plateforme | secret/signature fournisseur | signature, rejeu limité et rotation |
| traitement interne | `service_role` côté serveur | identité de service et audit |

Règles :

- l’autorisation est vérifiée dans la couche serveur et renforcée par RLS ;
- un jeton d’administration statique ne doit pas constituer la cible finale ;
- le jeton de séjour ne contient pas de secret permanent ;
- l’absence d’autorisation ne révèle pas l’existence d’un dossier tiers ;
- les mutations navigateur exigent une protection CSRF ;
- les secrets sont lus depuis l’environnement ou un coffre, jamais depuis le client.

**Écart SEC-API-01 :** `requireAdmin` compare actuellement un jeton d’environnement statique. La migration vers Supabase Auth et des permissions fines est prioritaire avant ouverture multi-utilisateur.

## 6. Catalogue des routes déployées

### 6.1 Disponibilité et tarification

| Méthode et route | Accès | Contrat principal | Réponse |
|---|---|---|---|
| `GET /api/calendar?property={slug}` | public limité | maison valide | blocs normalisés et santé des sources |
| `GET /api/availability` | public limité | `arrival`, `departure`, `guests`, maison optionnelle | maisons compatibles et disponibles |
| `POST /api/pricing` | public limité | maison, dates, occupants, options, expériences, promotion | décomposition tarifaire |
| `POST /api/quote` | public limité | mêmes données que le prix | disponibilité, santé et devis |
| `GET /api/rates?property={slug}&year={year}` | public limité | maison, année `2025..2032` | prix et règles par jour |
| `GET /api/promotions?property={slug}` | public limité | maison | promotions publiques actives hors codes |
| `GET /api/ical?property={slug}` | public/partenaire | maison | calendrier iCal des indisponibilités |

Règles :

- `/api/pricing` calcule sans garantir la disponibilité ;
- `/api/quote` vérifie prix et disponibilité ensemble ;
- une indisponibilité produit `409` ;
- une durée non conforme produit `422` ;
- les codes promotionnels valides ne sont jamais énumérés ;
- une source calendrier défaillante est indiquée sans exposer son URL ;
- le tarif public reste informatif jusqu’à la création transactionnelle.

### 6.2 Réservation

#### `POST /api/reservation`

Accès : public, origine identique, limite stricte.

Entrée déployée :

```ts
type CreateReservationRequest = {
  propertySlug: string;
  arrival: string;
  departure: string;
  adults: number;
  children: number;
  babies: number;
  pets: number;
  options: string[];
  experiences: string[];
  promotionCode?: string;
  guest: GuestInput;
  idempotencyKey: string;
};
```

Traitement :

1. validation stricte ;
2. contrôle de maison et capacité ;
3. synchronisation et contrôle de disponibilité ;
4. recalcul du devis ;
5. contrôle de durée ;
6. calcul de l’acompte ;
7. création transactionnelle Supabase ;
8. blocage des dates et audit.

Réponse `201` :

```json
{
  "id": "uuid",
  "reference": "BR-2026-000001",
  "status": "requested",
  "paymentEnabled": false,
  "message": "Demande enregistrée."
}
```

Erreurs spécifiques :

- `DATES_UNAVAILABLE` → `409` ;
- règles de séjour → `422` ;
- persistance indisponible → `503`.

La disponibilité est toujours revérifiée dans la transaction ; le contrôle précédent n’est qu’une optimisation d’expérience.

### 6.3 Espace séjour

| Méthode et route | Accès | Usage |
|---|---|---|
| `GET /api/stay` | jeton de séjour | retourne le carnet et masque les détails d’arrivée avant leur date |
| `POST /api/payments/checkout` | jeton de séjour | prépare un paiement d’acompte, solde ou intégral |
| `GET /api/documents/contract` | accès séjour | fournit le contrat autorisé |
| `POST /api/concierge` | réservation vérifiée | crée une commande ou demande |
| `POST /api/concierge/pdf` | données validées | génère « Votre séjour Beaux Rivages » |

Le jeton peut être fourni en `Authorization: Bearer`. Le passage par query string reste toléré pour certains liens, mais la cible évite sa persistance dans historiques et logs.

### 6.4 Concierge

| Méthode et route | Accès | Contrat |
|---|---|---|
| `GET /api/concierge?locale=fr|en|de` | public limité | catalogue actif localisé |
| `POST /api/concierge` | origine identique, limité | réservation, identité de contrôle et sélection validée |
| `POST /api/concierge/pdf` | limité | préférences de séjour validées |

Règles :

- le serveur recharge les prix du catalogue ;
- une expérience inactive ou inconnue est refusée ;
- les lignes soumises à confirmation ne deviennent pas automatiquement payables ;
- une commande créée renvoie `201` ;
- la génération PDF ne donne pas accès à une réservation tierce.

### 6.5 Newsletter

#### `POST /api/newsletter`

Entrée : e-mail et informations de consentement prévues par le contrat.

Règles :

- normalisation de l’e-mail ;
- rate limit ;
- fournisseur isolé derrière un adaptateur ;
- double opt-in cible ;
- réponse neutre pour limiter l’énumération d’adresses ;
- preuve de consentement persistée lorsque la base est autoritative.

### 6.6 Paiement

| Méthode et route | Accès | Usage |
|---|---|---|
| `POST /api/payments/checkout` | jeton séjour | crée une session Stripe TEST |
| `POST /api/payments/webhook` | signature Stripe | applique les événements de paiement |
| `POST /api/admin/payments/refund` | administration + origine | demande un remboursement Stripe TEST |

`POST /api/payments/checkout` :

- accepte `deposit`, `full-payment` ou `balance` ;
- recalcule le montant restant depuis Supabase ;
- crée d’abord un paiement local idempotent ;
- rattache ensuite la session Stripe ;
- marque l’échec de préparation si le fournisseur échoue ;
- n’accepte actuellement que les clés Stripe TEST.

`POST /api/admin/payments/refund` :

- exige un motif ;
- limite le montant au solde remboursable ;
- journalise la demande ;
- renvoie `502` si Stripe refuse.

### 6.7 Administration

| Méthode et route | Fonction |
|---|---|
| `GET /api/admin/dashboard` | occupation, revenu estimé, revenus directs et santé des calendriers |
| `GET /api/admin/operations` | snapshot opérationnel |
| `POST /api/admin/operations` | commandes Back Office validées |
| `GET /api/admin/housekeeping` | planning, tâches et alertes ménage |
| `POST /api/admin/housekeeping` | checklist, inspection, stock, photo ou intervention selon schéma |
| `GET /api/admin/channel-manager` | snapshot connexions, mappings, jobs, conflits et logs |
| `POST /api/admin/channel-manager` | commande de synchronisation ou résolution |
| `GET /api/admin/revenue` | tableau de bord commercial |
| `POST /api/admin/revenue` | carte cadeau, promotion ou campagne |
| `POST /api/admin/guest-messages/preview` | prévisualisation sans secrets réels |
| `GET /api/admin/export?entity=...` | export CSV autorisé |
| `POST /api/admin/payments/refund` | remboursement contrôlé |

Toutes les routes administratives :

- sont privées et `no-store` ;
- exigent authentification ;
- limitent la fréquence ;
- valident les mutations ;
- contrôlent l’origine des mutations ;
- n’exposent pas les secrets de connecteurs.

L’export actuel autorise uniquement `reservations`, `payments` et `audit_logs`, protège contre les formules CSV et ajoute `nosniff`.

### 6.8 Administration calendrier et tarifs

| Méthode et route | Fonction |
|---|---|
| `GET /api/calendar/admin` | état des sources |
| `POST /api/calendar/admin` | ajout ou synchronisation selon commande |
| `PUT /api/calendar/admin` | modification contrôlée d’une source |
| `PUT /api/rates` | non implémenté, retourne `501` |
| `PUT /api/promotions` | non implémenté, retourne `501` |
| `GET /api/options` | catalogue ou options exposées selon route |

Le refus `PERSISTENT_RATE_STORE_REQUIRED` empêche de simuler une écriture tarifaire tant que le dépôt persistant n’est pas branché.

## 7. Server Actions

Les Route Handlers constituent actuellement la frontière dominante. Les Server Actions peuvent être utilisées pour les formulaires rendus côté serveur lorsque :

- elles restent privées à l’application ;
- leurs entrées sont validées ;
- elles appliquent les mêmes contrôles d’identité, de droit, d’idempotence et d’audit ;
- elles appellent le même service métier que l’API ;
- elles ne dupliquent pas les règles dans le composant.

Une Server Action n’est pas un contournement de l’API, de la RLS ou de la protection CSRF.

Contrat cible :

```ts
type ActionResult<T> =
  | { ok: true; data: T; requestId: string }
  | { ok: false; error: ApiError };
```

**Écart API-ACT-01 :** aucun registre central des Server Actions et de leurs permissions n’est encore établi.

## 8. Versionnement

### Politique cible

- les routes internes à l’application évoluent de façon additive ;
- les contrats consommés par un tiers utilisent `/api/v1` ou une version négociée ;
- supprimer ou renommer un champ exige une nouvelle version ;
- ajouter un champ optionnel est compatible ;
- les enums ne sont pas supposés exhaustifs par les consommateurs externes ;
- une version obsolète possède date de dépréciation et date d’arrêt ;
- les webhooks sortants incluent `schemaVersion`.

**Écart API-VER-01 :** les routes actuelles ne portent pas de version explicite. Elles doivent rester internes jusqu’à la définition de la première API partenaire stable.

## 9. Pagination, filtres et tri

Les futures collections suivent :

```json
{
  "data": [],
  "page": {
    "nextCursor": "opaque-or-null",
    "hasMore": false
  }
}
```

Règles :

- pagination par curseur pour événements, logs, messages et réservations ;
- curseur opaque, jamais construit par le client ;
- limite maximale imposée ;
- tri stable avec identifiant comme second critère ;
- filtres autorisés en liste blanche ;
- aucune colonne SQL arbitraire reçue du client ;
- décompte total uniquement lorsqu’il est utile et abordable.

## 10. Idempotence et reprise

| Commande | Clé |
|---|---|
| création de réservation | UUID fourni et unique |
| création de paiement | identifiant local du paiement |
| webhook Stripe | identifiant d’événement Stripe |
| e-mail transactionnel | réservation + type + étape/version |
| import calendrier | source + UID externe + hash/version |
| job Channel Manager | connexion + ressource + direction + commande |
| carte cadeau/utilisation | commande ou mouvement unique |
| webhook sortant | identifiant d’événement interne |

Comportements :

- même clé et même payload → même résultat logique ;
- même clé et payload différent → `409 IDEMPOTENCY_CONFLICT` ;
- une réponse perdue peut être retrouvée ;
- les tentatives et erreurs sont persistées ;
- les reprises utilisent un backoff borné ;
- une erreur permanente passe en file d’examen.

## 11. Événements de domaine

### Enveloppe cible

```json
{
  "id": "evt_uuid",
  "type": "reservation.confirmed",
  "schemaVersion": 1,
  "occurredAt": "2026-07-29T14:00:00Z",
  "aggregateType": "reservation",
  "aggregateId": "uuid",
  "correlationId": "req_uuid",
  "causationId": "cmd_uuid",
  "actor": {
    "type": "user",
    "id": "uuid"
  },
  "data": {}
}
```

### Catalogue cible

#### Réservation

- `reservation.requested`
- `reservation.confirmed`
- `reservation.modified`
- `reservation.cancelled`
- `reservation.completed`
- `reservation.dates_blocked`

#### Paiement

- `payment.created`
- `payment.requires_action`
- `payment.paid`
- `payment.failed`
- `payment.refunded`
- `security_deposit.authorized`
- `security_deposit.released`
- `security_deposit.captured`

#### Documents

- `contract.generated`
- `contract.sent`
- `contract.signed`
- `invoice.issued`
- `credit_note.issued`

#### Guest Journey

- `message.scheduled`
- `message.sent`
- `message.delivered`
- `message.failed`
- `arrival_access.released`

#### Concierge et opérations

- `concierge.order_requested`
- `concierge.item_confirmed`
- `concierge.order_paid`
- `housekeeping.task_created`
- `housekeeping.task_completed`
- `maintenance.incident_opened`
- `maintenance.incident_resolved`

#### Canaux et Revenue

- `channel.reservation_imported`
- `channel.availability_pushed`
- `channel.conflict_detected`
- `channel.sync_failed`
- `loyalty.tier_changed`
- `gift_card.redeemed`
- `review.requested`

### Règles

- type au passé pour un fait accompli ;
- événement immuable ;
- données minimales, pas d’objet complet sans nécessité ;
- consommateur idempotent ;
- ordre garanti uniquement par agrégat si l’infrastructure le permet ;
- événement de domaine distinct du log technique.

**Écart EVT-01 :** plusieurs événements actuels sont des logs console ou notifications PostgreSQL. Il n’existe pas encore d’Outbox transactionnelle généralisée.

## 12. Transactional Outbox cible

Pour les effets critiques :

1. la transaction métier écrit l’état et `outbox_events` ;
2. un worker réclame les événements ;
3. il exécute les consommateurs ;
4. chaque consommateur déduplique ;
5. succès ou erreur sont persistés ;
6. les échecs temporaires sont rejoués ;
7. les échecs permanents sont placés en quarantaine.

L’Outbox est requise avant automatisation complète des messages, canaux, CRM et opérations.

## 13. Webhook Stripe entrant

### Route

`POST /api/payments/webhook`

### Vérification

- corps brut ;
- présence de `Stripe-Signature` ;
- validation avec `STRIPE_WEBHOOK_SECRET` ;
- refus `400` si signature invalide ;
- aucune authentification navigateur.

### Événements gérés

| Événement Stripe | Traitement |
|---|---|
| `checkout.session.completed` | retrouve le paiement et le marque payé si la session est payée |
| `checkout.session.expired` | expire/échoue la tentative concernée |
| `payment_intent.succeeded` | marque le paiement payé |
| `payment_intent.payment_failed` | conserve code et message d’échec |
| `charge.refunded` | applique le montant remboursé |
| autre | enregistré puis marqué ignoré |

### Idempotence

- l’identifiant `event.id` est unique ;
- `claim_payment_event` réclame atomiquement l’événement ;
- un doublon renvoie `200` avec `duplicate: true` ;
- un événement ignoré renvoie `200` ;
- un traitement échoué est conservé et peut être repris ;
- le fournisseur reçoit `500` seulement lorsqu’un nouvel essai est souhaitable.

Les métadonnées Stripe contiennent uniquement les identifiants minimaux nécessaires au rapprochement.

## 14. Webhooks sortants

Les webhooks partenaires ne sont pas encore un contrat public déployé.

Contrat cible :

- abonnement explicite par événement ;
- endpoint HTTPS ;
- secret distinct par abonnement ;
- signature HMAC incluant timestamp et corps brut ;
- identifiant d’événement ;
- fenêtre anti-rejeu ;
- tentatives avec backoff ;
- désactivation après échecs persistants ;
- historique et bouton de rejeu ;
- filtrage des données par finalité.

En-têtes proposés :

```text
X-Beaux-Rivages-Event: reservation.confirmed
X-Beaux-Rivages-Delivery: del_uuid
X-Beaux-Rivages-Timestamp: 1785333600
X-Beaux-Rivages-Signature: v1=...
```

Une réponse `2xx` acquitte la livraison. Les redirections ne sont pas suivies automatiquement sans contrôle SSRF.

## 15. Calendriers iCal

### Import

Interface déployée :

```ts
interface CalendarConnector {
  fetch(source: CalendarSource): Promise<CalendarBlock[]>;
}
```

Normalisation :

- UID externe obligatoire ;
- dates converties en intervalle semi-ouvert ;
- statut `confirmed`, `tentative` ou `cancelled` ;
- hash de payload pour détecter les modifications ;
- déduplication par source et UID ;
- URL source jamais renvoyée au client.

### Export

`GET /api/ical?property={slug}` publie les périodes indisponibles compatibles iCal.

Limites :

- iCal ne transporte pas correctement prix, paiement ou identité voyageur ;
- la fréquence de rafraîchissement dépend du fournisseur ;
- l’export ne garantit pas un blocage instantané ;
- une API partenaire certifiée est nécessaire pour une synchronisation temps réel complète.

## 16. Channel Manager

### Interface connecteur

```ts
interface ChannelConnector {
  provider: ChannelProvider;
  capabilities: readonly string[];
  importReservations(mappingId: string): Promise<ChannelReservation[]>;
  pushAvailability(
    mappingId: string,
    arrival: string,
    departure: string
  ): Promise<{ externalId: string }>;
}
```

Fournisseurs prévus :

- Airbnb ;
- Booking.com ;
- Abritel/Vrbo ;
- Google Vacation Rentals ;
- Holidu ;
- Expedia ;
- HomeToGo.

Capacités négociables :

- `availability.read` / `availability.write` ;
- `reservation.read` / `reservation.write` ;
- `rates.read` / `rates.write` ;
- `fees.read` / `fees.write` ;
- `guest.read` ;
- `messages.read` / `messages.write`.

Règles :

- le registre choisit le connecteur par fournisseur ;
- une capacité absente produit une erreur explicite ;
- aucune simulation de connectivité n’est présentée comme une synchronisation réelle ;
- credentials chiffrés et rotatifs ;
- pagination, quotas et backoff propres au fournisseur ;
- mapping validé avant tout import ou export ;
- conflit créé avant toute décision destructive ;
- chaque commande est auditée et rejouable.

**Statut actuel :** architecture et connecteurs indépendants préparés ; les accès officiels aux APIs partenaires et leurs capacités doivent encore être obtenus et validés.

## 17. Paiement et fournisseurs

Interfaces :

```ts
interface RefundGateway {
  refund(input: {
    paymentProviderId: string;
    amountCents?: number;
    reason?: string;
  }): Promise<{ refundId: string; status: string }>;
}
```

Le système prépare aussi une abstraction de moyens :

- Stripe ;
- virement ;
- espèces ;
- Chèques-Vacances.

Seul Stripe TEST possède actuellement un flux technique complet dans le dépôt. Aucun paiement réel ne doit être activé avant :

- validation commerciale et juridique ;
- secrets Live ;
- endpoint webhook Live ;
- tests de bout en bout ;
- politique de remboursement ;
- monitoring et procédure d’incident.

## 18. Messagerie

Contrat fournisseur cible :

```ts
type SendMessageCommand = {
  reservationId: string;
  templateKey: string;
  locale: "fr" | "en" | "de";
  recipient: string;
  scheduledAt?: string;
  idempotencyKey: string;
};
```

Règles :

- le template et les données sont versionnés ;
- les secrets d’arrivée sont chargés au dernier moment côté serveur ;
- prévisualisation et envoi réel utilisent des contextes distincts ;
- statut fournisseur rapproché par identifiant ;
- rebond, plainte et désabonnement sont persistés ;
- une annulation replanifie les messages ;
- aucune donnée personnelle dans les logs applicatifs.

## 19. Documents et Storage

Les API documentaires :

- vérifient la relation entre identité et réservation ;
- ne renvoient jamais un chemin Storage brut ;
- génèrent une URL signée courte ou diffusent le fichier ;
- définissent `Content-Type`, `Content-Disposition` et `nosniff` ;
- refusent l’indexation et le cache partagé ;
- journalisent l’accès aux documents sensibles selon la politique retenue.

Le PDF Concierge est généré depuis des données validées et ne doit pas intégrer un QR Code donnant accès à un secret permanent.

## 20. Intégrations futures

Toute nouvelle intégration commence par :

1. contrat métier indépendant du SDK ;
2. matrice des capacités ;
3. adaptateur fournisseur ;
4. validation de configuration ;
5. sandbox ou faux déterministe ;
6. stratégie d’idempotence ;
7. quotas et reprise ;
8. sécurité et rotation des secrets ;
9. observabilité ;
10. tests de contrat.

Le cœur métier ne dépend jamais directement des types propriétaires d’un SDK externe.

## 21. Rate limiting et anti-abus

Le rate limit actuel est en mémoire par instance et par IP/route.

**Écart API-RATE-01 :** ce mécanisme ne fournit pas une limite globale fiable sur une plateforme serverless multi-instance.

Cible :

- stockage distribué ;
- clé combinant IP hachée, identité et action ;
- limites distinctes public/admin/webhook ;
- protection plus stricte sur réservation, paiement, export et newsletter ;
- `Retry-After` ;
- métriques sans IP en clair ;
- mécanisme complémentaire de bot protection si nécessaire.

## 22. Cache

| Donnée | Politique |
|---|---|
| réservation, paiement, espace séjour | `private, no-store` |
| dashboard admin | privé, revalidation contrôlée |
| disponibilité | cache court, invalidé après mutation |
| catalogue public | cache public versionné |
| météo/marées | cache selon fraîcheur de la source |
| tarifs | cache court, invalidé après publication |
| documents | privé, URL signée courte |

Une création de réservation force une vérification fraîche ; elle ne s’appuie jamais uniquement sur un cache.

## 23. Observabilité

Chaque requête critique produit :

- `requestId` ;
- route et méthode ;
- durée ;
- statut ;
- identité de service ou rôle, sans données personnelles ;
- fournisseur et tentative si intégration ;
- identifiant d’agrégat si autorisé ;
- code d’erreur stable.

Métriques :

- latence p50/p95/p99 ;
- taux `4xx` et `5xx` ;
- rate limits ;
- réservations créées/conflits ;
- webhooks en attente/échec ;
- synchronisations par fournisseur ;
- âge des files ;
- paiements non rapprochés ;
- messages en retard.

Traces, logs et audit partagent un `correlationId`.

## 24. Tests de contrat

### Routes

- entrée nominale ;
- données absentes, limites et champs inconnus ;
- authentification et autorisation ;
- origine/CSRF ;
- rate limit ;
- idempotence ;
- conflit concurrent ;
- indisponibilité d’une dépendance ;
- absence de fuite de secret ;
- en-têtes de cache et contenu.

### Webhooks

- signature valide et invalide ;
- événement dupliqué ;
- ordre inversé ;
- type ignoré ;
- traitement partiel ;
- reprise après échec ;
- payload altéré ;
- horodatage ancien.

### Connecteurs

- conformité à l’interface ;
- pagination ;
- quota `429` ;
- erreur temporaire/permanente ;
- mapping absent ;
- capability non supportée ;
- annulation et modification ;
- dates et fuseaux ;
- contrat avec sandbox fournisseur lorsque disponible.

## 25. Documentation des contrats

La cible est une spécification OpenAPI générée ou vérifiée depuis les schémas partagés.

Pour chaque endpoint :

- objectif ;
- accès requis ;
- rate limit ;
- paramètres et corps ;
- exemples de réponse ;
- codes d’erreur ;
- idempotence ;
- effets métier ;
- événements émis ;
- données personnelles traitées ;
- cache ;
- propriétaire.

Les types TypeScript, schémas Zod et documentation ne doivent pas diverger. Une vérification CI compare les routes publiées au registre.

## 26. Registre des écarts

| Référence | Priorité | Écart | Cible |
|---|---|---|---|
| API-GAP-001 | haute | administration par jeton statique | Supabase Auth et capacités |
| API-GAP-002 | haute | erreurs non uniformes | enveloppe et codes partagés |
| API-GAP-003 | haute | rate limit en mémoire | limite distribuée |
| API-GAP-004 | haute | pas d’Outbox transverse | événements transactionnels fiables |
| API-GAP-005 | moyenne | pas de version explicite | `/api/v1` pour les tiers |
| API-GAP-006 | moyenne | contrats non publiés en OpenAPI | génération/validation CI |
| API-GAP-007 | haute | connecteurs plateformes sans accès officiel complet | certification et tests sandbox |
| API-GAP-008 | haute | Stripe limité au mode TEST | procédure contrôlée avant Live |
| API-GAP-009 | moyenne | registre Server Actions absent | inventaire, droits et tests |
| API-GAP-010 | haute | liens séjour partiellement acceptés en query string | jetons courts et transport plus sûr |
| API-GAP-011 | moyenne | écritures tarifs/promotions renvoient `501` | repository Supabase versionné |
| API-GAP-012 | haute | webhooks sortants absents | abonnements signés et rejouables |

## 27. Définition de terminé

Une API ou intégration est terminée lorsque :

- le contrat métier et son propriétaire sont définis ;
- le schéma d’entrée et de sortie est partagé ;
- authentification, autorisation et RLS sont vérifiées ;
- idempotence et concurrence sont traitées ;
- les erreurs sont stables ;
- logs, métriques, audit et corrélation sont actifs ;
- données personnelles et secrets sont minimisés ;
- tests unitaires, intégration et contrat passent ;
- limites, cache et timeouts sont définis ;
- reprise et compensation sont documentées ;
- la documentation API et le changelog sont à jour ;
- une sandbox ou un faux déterministe couvre le fournisseur ;
- le passage en production possède une procédure et un retour arrière.
