# Intégrations réelles — préparation 1.1

## Périmètre

Cette livraison prépare les connecteurs serveur Stripe, email, SMS, iCal et Google Calendar. Aucun secret n’est fourni, aucune connexion n’est activée et aucun déploiement n’est réalisé.

L’écran `/administration/parametres/integrations` présente l’état de configuration sans retourner la valeur des secrets.

## Stripe

Le connecteur existant gère Checkout, remboursements et vérification cryptographique des webhooks. Le mode live reste interdit tant que `STRIPE_ALLOW_LIVE=false`.

Variables : `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_ALLOW_LIVE`.

Référence : [Stripe — signatures de webhook](https://docs.stripe.com/webhooks/signature).

## Email — Resend

`ResendEmailAdapter` utilise l’API HTTPS, une limite de huit secondes et l’en-tête d’idempotence. Il n’envoie rien sans `RESEND_API_KEY` et `EMAIL_FROM`.

Variables : `EMAIL_PROVIDER=resend`, `RESEND_API_KEY`, `EMAIL_FROM`.

Référence : [Resend — envoyer un email](https://resend.com/docs/api-reference/emails/send-email).

## SMS — Twilio

`TwilioSmsAdapter` utilise la ressource Messages, exige un numéro E.164 et un Messaging Service. Les identifiants restent côté serveur.

Variables : `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_MESSAGING_SERVICE_SID`.

Référence : [Twilio — Messages resource](https://www.twilio.com/docs/messaging/api/message-resource).

## Synchronisation iCal

`ICalendarConnector` importe en lecture seule des flux HTTPS depuis une liste d’hôtes autorisés. Taille maximale : 1,5 Mo ; délai : huit secondes ; format `VCALENDAR` obligatoire. Les URL restent des secrets serveur.

Variables : les `ICAL_*_URL` documentées dans `.env.example`.

## Google Calendar

`GoogleCalendarAdapter` lit les événements via l’API Calendar. L’autorisation OAuth 2.0, le stockage chiffré et le renouvellement des jetons devront être finalisés avant activation. Le périmètre OAuth minimal doit être retenu selon l’usage certifié.

Variables : `GOOGLE_CALENDAR_CLIENT_ID`, `GOOGLE_CALENDAR_CLIENT_SECRET`, `GOOGLE_CALENDAR_REDIRECT_URI`.

Références : [Google Calendar — autorisation](https://developers.google.com/workspace/calendar/api/auth), [Google — OAuth 2.0](https://developers.google.com/identity/protocols/oauth2).

## Mise en service restante

1. Créer les comptes fournisseurs et secrets dans le gestionnaire d’environnement.
2. Configurer les domaines, expéditeurs, webhooks et URL OAuth.
3. Ajouter consentement SMS, désinscription et règles de conservation.
4. Implémenter le callback OAuth Google et stocker les jetons chiffrés.
5. Effectuer les tests sandbox, les tests de panne et la recette métier.
6. Certifier chaque connecteur avant toute activation en production.

Les boutons de test de l’écran restent désactivés tant que la configuration n’est pas complète. Une configuration présente n’implique jamais qu’elle est certifiée.
