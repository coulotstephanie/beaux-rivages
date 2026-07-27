# Audit final de production — 27 juillet 2026

## Décision

**Version candidate démontrable, mais ouverture des réservations payantes non autorisée.**

Le site public, le moteur de disponibilité, le calcul tarifaire et la génération
des contrats sont suffisamment avancés pour une recette utilisateur. En revanche,
le parcours se termine encore par la préparation d'un e-mail : aucune réservation
transactionnelle n'est persistée et aucun paiement réel ne doit être accepté avant
la mise en place des éléments bloquants listés ci-dessous.

L'audit porte sur l'état local de la version candidate. Les modifications de cette
candidate ne sont pas encore publiées sur `main` ni déployées en production.

## Résultats vérifiés

| Contrôle | Résultat |
| --- | --- |
| ESLint | Réussi |
| TypeScript strict | Réussi |
| Tests automatisés | 38/38 réussis |
| Build Next.js production | Réussi, 67 pages générées |
| Crawl interne | 71 URL et 90 ancres, aucune erreur |
| Responsive | Mobile, tablette et desktop contrôlés |
| Domaine | `beaux-rivages.com` redirige vers `www.beaux-rivages.com` |
| HTTPS | Certificat valide, réponse 200 |
| Accueil mobile | Lighthouse 97 / 100 / 100 / 100 |
| Réserver mobile | Lighthouse 96 / 100 / 100 / 92 |
| Réserver desktop | Lighthouse 100 / 100 / 100 / 92 |

Les scores sont présentés dans l'ordre Performance / Accessibilité / Bonnes
pratiques / SEO.

## Parcours de réservation

### Conforme

- consultation des logements et passage vers le parcours de réservation ;
- sélection du logement, des dates, des voyageurs et des options ;
- import des indisponibilités Airbnb et Booking par iCal ;
- vérification serveur de la disponibilité ;
- calcul détaillé du tarif, des frais, de la taxe et des promotions ;
- génération testée du contrat HTML et PDF ;
- préparation de Stripe Checkout, des e-mails et de la signature électronique
  derrière des interfaces configurables ;
- espace voyageur protégé par jeton signé.

### Bloquant avant vente réelle

- le bouton final prépare encore un e-mail et ne crée pas une réservation ;
- aucun stockage transactionnel des réservations, paiements, contrats et
  consentements n'est configuré ;
- Stripe n'a ni clé de test, ni webhook, ni scénarios 3-D Secure validés ;
- l'idempotence des webhooks Stripe dépend encore d'un `PaymentRepository` ;
- les tarifs modifiés dans l'administration ne sont pas persistés ;
- aucune solution de signature ou d'e-mail transactionnel n'est activée ;
- le contrat et ses annexes doivent être validés juridiquement ;
- l'adresse définitive de la Villa Raie Manta doit être renseignée.

## SEO et indexation

- titres, descriptions, URL canoniques, OpenGraph et Twitter Cards sont générés ;
- les données structurées et les textes alternatifs font partie des tests
  d'intégrité ;
- `sitemap.xml` et `robots.txt` répondent correctement ;
- l'administration, les API et l'espace voyageur sont exclus de l'indexation ;
- le domaine est prêt pour la validation manuelle Search Console.

Lighthouse signale une description manquante sur `/reserver` alors que la balise
`<meta name="description">` est présente dans le HTML initial, avec OpenGraph et
Twitter. Cette divergence de mesure doit être recontrôlée après déploiement de la
candidate. Elle explique le score SEO de 92 sur cette page.

## Sécurité

### Conforme

- aucune clé Stripe, URL iCal privée ou valeur de jeton n'est suivie par Git ;
- secrets attendus uniquement via variables d'environnement ;
- validation des entrées sur les routes sensibles ;
- contrôle d'origine sur les écritures navigateur ;
- signature officielle des webhooks Stripe prévue ;
- limitation de débit et réponses `no-store` sur les API sensibles ;
- HSTS, anti-sniffing, anti-framing, politique de référent et Permissions Policy ;
- refus explicite des clés Stripe live sans autorisation dédiée.

### À renforcer

- remplacer la limitation de débit en mémoire par Redis/KV partagé entre les
  instances serverless ;
- ajouter une Content Security Policy compatible avec les fournisseurs retenus ;
- mettre en place une base transactionnelle, des journaux d'audit et une
  stratégie de sauvegarde ;
- effectuer une revue CSRF complète après création des sessions d'administration ;
- l'audit npm remonte trois alertes hautes transitives dans `postcss` et `sharp`
  via Next.js ; ne pas appliquer la rétrogradation automatique proposée par npm,
  mais planifier une montée vers une version Next.js officiellement corrigée et
  la valider par régression ;
- réaliser un test d'intrusion ciblé avant passage en paiement réel.

## Accessibilité et responsive

- Lighthouse Accessibilité : 100 sur les pages mesurées ;
- navigation clavier, focus visible, galerie clavier/tactile et libellés de
  formulaire couverts par les composants ;
- rendu contrôlé aux formats téléphone, tablette et desktop ;
- aucun décalage de mise en page mesuré (`CLS = 0`) ;
- une recette humaine finale reste nécessaire avec VoiceOver, zoom 200 %,
  contraste en plein soleil et appareils iOS/Android réels.

## Actions manuelles obligatoires

1. Choisir et configurer la base de données de production.
2. Implémenter les dépôts persistants des réservations, paiements, tarifs,
   contrats et consentements.
3. Valider les prix, taxes de séjour, acomptes, annulations et CGV.
4. Faire valider le contrat par un professionnel du droit.
5. Configurer Stripe en test, son webhook et tous les scénarios d'échec,
   remboursement et 3-D Secure.
6. Choisir Yousign ou DocuSign, puis Resend, SendGrid ou Brevo.
7. Configurer le fournisseur de newsletter, le double opt-in et la
   désinscription.
8. Installer une gestion du consentement avant GA4, Google Ads ou Meta Pixel.
9. Renseigner GA4 et valider le domaine dans Google Search Console.
10. Confirmer l'adresse de la Villa Raie Manta.
11. Corriger ou accepter formellement les alertes de dépendances après revue.
12. Rejouer l'audit sur l'URL de production après publication de la candidate.

## Recommandation d'ouverture

La version peut être montrée à des utilisateurs pilotes sans paiement. Le bouton
de réservation doit rester présenté comme une **demande**, ce qu'il fait
actuellement. L'ouverture commerciale avec encaissement doit attendre la levée de
tous les points bloquants du parcours transactionnel.
