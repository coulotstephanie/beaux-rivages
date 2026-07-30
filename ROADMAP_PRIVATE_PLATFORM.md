# Roadmap de la plateforme privée Beaux Rivages

**Version du document :** 1.0  
**Date de décision :** 30 juillet 2026  
**Statut :** cible architecturale officielle  
**Périmètre :** logiciel métier privé Beaux Rivages

## 1. Décision structurante

Beaux Rivages reste un logiciel privé, destiné exclusivement à l'exploitation
des hébergements de la marque par Stéphanie, Bruno et leurs collaborateurs
autorisés.

La plateforme peut gérer plusieurs maisons Beaux Rivages, plusieurs canaux de
réservation, plusieurs équipes internes et plusieurs langues voyageurs. Elle
n'a pas vocation à accueillir des entreprises tierces ni à être commercialisée
comme un service logiciel.

Cette décision exclut durablement :

- le multi-tenant et l'isolation d'organisations clientes ;
- le multi-marques destiné à des exploitants indépendants ;
- l'onboarding autonome de propriétaires ou d'établissements tiers ;
- les abonnements et la facturation SaaS ;
- le portail client d'un logiciel SaaS ;
- la marketplace ouverte et la commercialisation de plugins ;
- le portail de propriétaires indépendants ;
- les fonctions conçues uniquement pour vendre ou administrer le logiciel.

Les permissions par rôle, la traçabilité et l'isolation entre environnements
restent obligatoires : elles protègent les données et les opérations internes,
sans constituer une architecture multi-tenant.

## 2. Principes de priorisation

Une évolution n'entre dans la roadmap que si elle apporte au moins un bénéfice
direct et mesurable :

1. améliorer l'expérience du voyageur ;
2. augmenter ou sécuriser les réservations directes ;
3. réduire une tâche manuelle ou un risque d'exploitation ;
4. fiabiliser les paiements, contrats, disponibilités ou communications ;
5. améliorer la connaissance voyageur et la qualité de l'accueil ;
6. faciliter le pilotage des maisons Beaux Rivages ;
7. renforcer la sécurité, la résilience ou la conformité.

Les versions sont ordonnées par dépendances métier. Aucune capacité avancée
n'est prioritaire sur la sûreté de production.

## 3. Audit de la roadmap précédente

| Élément précédent                 | Décision                  | Nouvelle destination                             |
| --------------------------------- | ------------------------- | ------------------------------------------------ |
| `1.0.0-rc.1`                      | Conservé et gelé          | Certification de production uniquement           |
| UX, accessibilité et performance  | Conservé                  | `1.0.x`, puis contrôle continu                   |
| CRM, fidélité et marketing        | Conservé et recentré      | `1.1` — relation voyageur                        |
| Synchronisations avancées         | Conservé                  | `1.2` — distribution et revenus                  |
| Portail propriétaires             | Supprimé                  | Les besoins utiles deviennent des vues internes  |
| Observabilité                     | Avancé dans les priorités | `1.0.x` — exploitation sûre                      |
| Concierge IA et assistant hôte    | Fusionnés                 | `2.0` — assistance responsable                   |
| Multi-propriétaires               | Supprimé                  | Hors cible définitive                            |
| Marketplace                       | Supprimée                 | Un catalogue fermé de partenaires reste possible |
| Plateforme SaaS complète          | Supprimée                 | Hors cible définitive                            |
| Multi-tenant                      | Supprimé                  | Rôles internes et RLS conservés                  |
| Abonnements et facturation SaaS   | Supprimés                 | Hors cible définitive                            |
| API publique et SDK de plugins    | Supprimés                 | Connecteurs privés limités aux besoins métier    |
| Application propriétaire autonome | Recentrée                 | Interface mobile interne ou PWA opérationnelle   |
| Multi-marques et multi-pays       | Supprimés                 | Multilingue voyageur conservé                    |

Les anciennes versions consacrées à l'automatisation, au revenu, aux canaux, à
la conciergerie et au mobile sont regroupées en versions plus cohérentes. La
vision `3.0 SaaS` est abandonnée ; aucune version de remplacement n'est créée
sans besoin opérationnel démontré.

## 4. Séquence des versions

```text
1.0.0-rc.1 gelée
        ↓
Certification et levée de l'Issue #12
        ↓
1.0.0 — première production contrôlée
        ↓
1.0.x — stabilisation et exploitation sûre
        ↓
1.1 — relation voyageur et réservation directe
        ↓
1.2 — disponibilités, distribution et revenus
        ↓
1.3 — opérations internes automatisées
        ↓
1.4 — Carnet et conciergerie premium
        ↓
2.0 — assistance intelligente sous contrôle humain
```

## 5. Version 1.0.0 — Mise en exploitation contrôlée

### Objectif

Autoriser l'utilisation réelle du périmètre déjà livré, sans ajouter de
fonctionnalité à la Release Candidate.

### Fonctionnalités prévues

- aucune nouvelle fonctionnalité ;
- certification du schéma et des migrations ;
- sauvegarde complète vérifiée ;
- restauration réussie sur un environnement miroir ;
- audit des politiques RLS de la cible ;
- recette Stripe en mode TEST ;
- validation du monitoring, des alertes et du rollback ;
- recette métier, responsive et multilingue ;
- décision Go/No-Go documentée.

### Dépendances

- Issue #12 « Release 1.0 – Infrastructure & Go Live » entièrement levée ;
- `CERTIFICATION_1.0.md` sans point critique en échec ;
- preuves d'exploitation conservées dans le Runbook ;
- approbation humaine explicite avant fusion et déploiement.

### Critères de validation

- sauvegarde intègre et restauration miroir démontrées ;
- migrations exécutables et cohérentes avec la cible ;
- tests unitaires, intégration et E2E réussis sur le commit certifié ;
- Stripe TEST, RLS, sécurité et rollback validés par preuve ;
- checklist Go Live complète ;
- document `CERTIFICATION_1.0_SIGNED.md` établi ;
- recette post-déploiement réussie avant création du tag `v1.0.0`.

### Bénéfices opérationnels attendus

- démarrage maîtrisé de l'activité réelle ;
- réduction du risque de perte de données et d'interruption ;
- procédure reproductible pour les prochaines mises en production.

## 6. Versions 1.0.x — Stabilisation et exploitation sûre

### Objectif

Stabiliser la production avant toute extension fonctionnelle.

### Fonctionnalités prévues

- corrections issues des usages réels ;
- observabilité des parcours critiques ;
- alertes sur réservations, paiements, contrats et automatisations ;
- amélioration des sauvegardes et exercices réguliers de restauration ;
- optimisation des requêtes, images et temps de chargement ;
- corrections d'accessibilité et de responsive ;
- durcissement de la sécurité et traitement de la dette prioritaire ;
- amélioration des Runbooks et procédures d'incident.

### Dépendances

- version `1.0.0` en production ;
- métriques, journaux et retours réels disponibles ;
- processus de hotfix et rollback validé.

### Critères de validation

- aucun incident P0 ou P1 ouvert ;
- objectifs de disponibilité et d'alerting définis puis mesurés ;
- sauvegarde et restauration testées selon la fréquence du Runbook ;
- parcours critiques conformes WCAG AA ;
- budgets Core Web Vitals et temps de réponse respectés ;
- chaque correctif couvert par un test de non-régression.

### Bénéfices opérationnels attendus

- détection plus rapide des incidents ;
- diminution des interventions urgentes ;
- expérience plus fiable sur mobile et connexions lentes.

## 7. Version 1.1 — Relation voyageur et réservation directe

### Objectif

Augmenter les réservations directes et personnaliser chaque séjour à partir
d'une connaissance voyageur fiable.

### Fonctionnalités prévues

- amélioration du parcours de disponibilité et de réservation directe ;
- CRM unifié : profils, préférences, familles, animaux et historique ;
- détection et fusion contrôlée des doublons ;
- Guest Journey complet avant, pendant et après séjour ;
- segmentation utile, fidélité, anniversaires et relances de séjour ;
- demandes d'avis et suivi de satisfaction ;
- communications FR, EN et DE ;
- mesure du tunnel de conversion et des abandons ;
- personnalisation des attentions et recommandations.

### Dépendances

- réservation, paiement et contrat stables ;
- consentements, règles de conservation et droits d'accès définis ;
- moteur d'événements, modèles de messages et journal d'envoi fiables ;
- qualité des identifiants voyageur suffisante.

### Critères de validation

- un séjour crée ou enrichit une fiche voyageur sans doublon non maîtrisé ;
- les messages sont planifiés, idempotents, rejouables et historisés ;
- les préférences sensibles sont protégées et leur usage justifié ;
- le tunnel direct est testé de la disponibilité à la confirmation ;
- les indicateurs de conversion, retour et satisfaction sont mesurables ;
- aucune communication n'est envoyée sans base légale ni possibilité de suivi.

### Bénéfices opérationnels attendus

- moins de ressaisie ;
- accueils plus personnels ;
- augmentation du taux de réservation directe et du taux de retour ;
- suivi centralisé des échanges et préférences.

## 8. Version 1.2 — Disponibilités, distribution et revenus

### Objectif

Fiabiliser le calendrier unique et aider Stéphanie et Bruno à prendre de
meilleures décisions tarifaires.

### Fonctionnalités prévues

- calendrier consolidé des trois maisons ;
- synchronisation contrôlée Airbnb, Booking, Abritel et réservation directe ;
- prévention et traitement des doubles réservations ;
- journal des synchronisations, reprises et conflits ;
- tarification par saison, période, durée et contraintes de séjour ;
- recommandations de prix explicables, toujours soumises à validation humaine ;
- promotions et remises encadrées ;
- tableaux ADR, RevPAR, occupation et revenu par maison ;
- exports comptables et rapprochements nécessaires à l'exploitation.

Les connecteurs sont privés et limités aux plateformes effectivement utilisées.
Une API publique généraliste n'est pas prévue.

### Dépendances

- source de vérité des réservations clairement définie ;
- identifiants des annonces et contrats fournisseurs disponibles ;
- disponibilité et tarification couvertes par des règles métier uniques ;
- événements et webhooks idempotents ;
- procédures de résolution de conflit documentées.

### Critères de validation

- aucun chevauchement accepté côté client, serveur ou base ;
- synchronisations rejouables et journalisées ;
- incident fournisseur simulé et récupéré sans perte de réservation ;
- calcul de prix reproductible et horodaté ;
- recommandations tarifaires jamais appliquées sans validation ;
- indicateurs financiers réconciliés avec un échantillon réel.

### Bénéfices opérationnels attendus

- baisse du risque de double réservation ;
- réduction des mises à jour manuelles ;
- meilleure occupation et meilleure maîtrise du revenu ;
- vision financière commune aux trois maisons.

## 9. Version 1.3 — Opérations internes automatisées

### Objectif

Coordonner les arrivées, départs, ménages et interventions depuis une interface
interne unique.

### Fonctionnalités prévues

- planning quotidien des arrivées et départs ;
- checklists de préparation adaptées à la maison et au séjour ;
- gestion du linge, des consommables, inventaires et photos de contrôle ;
- validation et score qualité des missions de ménage ;
- tickets de maintenance, priorités, coûts et prestataires ;
- blocage d'un logement lorsqu'un incident l'exige ;
- notifications internes et escalades ;
- mode mobile ou PWA interne, avec fonctionnement dégradé si justifié ;
- tableaux de bord et historique d'exploitation.

### Dépendances

- réservations et calendrier fiables ;
- rôles internes et permissions opérationnels ;
- stockage sécurisé des photos ;
- référentiels des maisons, équipements et checklists validés ;
- moteur de notifications observable.

### Critères de validation

- une mission de ménage ne peut être clôturée avant checklist complète ;
- les actions critiques sont attribuées, horodatées et auditées ;
- un incident bloquant affecte immédiatement la disponibilité ;
- les équipes peuvent réaliser les parcours principaux sur mobile ;
- les notifications en échec sont visibles et rejouables ;
- les données opérationnelles ne sont accessibles qu'aux rôles autorisés.

### Bénéfices opérationnels attendus

- diminution des oublis ;
- meilleure coordination entre Stéphanie, Bruno et les intervenants ;
- remise à disposition plus sûre des maisons ;
- historique exploitable des coûts et incidents.

## 10. Version 1.4 — Carnet et conciergerie premium

### Objectif

Faire du séjour une expérience locale personnalisée et administrable sans
intervention technique.

### Fonctionnalités prévues

- CMS éditorial pour restaurants, producteurs, marchés, plages et balades ;
- pistes cyclables, villages, Fort Boyard et événements saisonniers ;
- conseils signés Stéphanie & Bruno ;
- recherche, filtres, favoris et carte interactive ;
- météo, marées et recommandations saisonnières issues de sources vérifiées ;
- itinéraires selon le profil, la durée et les conditions ;
- catalogue fermé d'expériences et de partenaires sélectionnés ;
- demandes spéciales et expériences ajoutées au séjour ;
- médiathèque, SEO des contenus et gouvernance éditoriale ;
- espace voyageur responsive et multilingue.

Le catalogue de partenaires sert uniquement les voyageurs Beaux Rivages. Il ne
constitue pas une marketplace ouverte.

### Dépendances

- CRM et contexte du séjour disponibles ;
- sources météo et marées autorisées, fiables et surveillées ;
- règles de disponibilité, tarification et responsabilité des expériences ;
- gestion des médias et droits d'utilisation ;
- responsables éditoriaux et fréquence de révision définis.

### Critères de validation

- les contenus peuvent être créés, relus, publiés et archivés sans code ;
- chaque recommandation affiche une provenance et une date de vérification ;
- les expériences indisponibles ne peuvent pas être commandées ;
- recherches paginées et performantes ;
- données structurées, accessibilité et responsive validés ;
- demandes voyageurs synchronisées avec le Back Office.

### Bénéfices opérationnels attendus

- différenciation forte de Beaux Rivages ;
- informations plus faciles à maintenir ;
- séjour mieux préparé et demandes mieux anticipées ;
- hausse maîtrisée du panier moyen grâce à des expériences pertinentes.

## 11. Version 2.0 — Assistance intelligente responsable

### Objectif

Assister les voyageurs et les hôtes sans déléguer à une IA les décisions
sensibles ni dégrader la qualité de l'accueil.

### Fonctionnalités prévues

- assistant voyageur fondé sur les contenus vérifiés du Carnet ;
- suggestions d'itinéraires adaptées au séjour, à la météo et aux préférences ;
- aide à la rédaction et traduction des réponses ;
- synthèse des avis, demandes et incidents ;
- détection d'anomalies opérationnelles ;
- recommandations tarifaires ou commerciales explicables ;
- assistant interne pour préparer les arrivées et prioriser les tâches ;
- journalisation, sources, niveaux de confiance et validation humaine.

### Dépendances

- ADR « Choix du fournisseur IA » réévalué avec tarifs et conditions à jour ;
- analyse RGPD, base légale, minimisation et durée de conservation validées ;
- données métier suffisamment fiables et gouvernées ;
- budget, quotas, monitoring, mode dégradé et arrêt d'urgence définis ;
- aucun secret, code d'accès ou donnée sensible envoyé sans nécessité validée.

### Critères de validation

- toute action à impact financier, contractuel ou opérationnel reste validée par
  un humain ;
- les réponses citent les sources internes utilisées lorsque pertinent ;
- tests multilingues, sécurité, biais, hallucinations et prompt injection
  réussis ;
- coût, latence et taux d'erreur respectent les budgets définis ;
- consentement et information des voyageurs conformes ;
- l'indisponibilité du fournisseur IA ne bloque aucun parcours essentiel.

### Bénéfices opérationnels attendus

- réponses plus rapides sans perdre le ton Beaux Rivages ;
- préparation des séjours facilitée ;
- meilleure exploitation des connaissances déjà validées ;
- aide à la décision sans automatisation incontrôlée.

## 12. Dépendances transversales

La chaîne métier prioritaire reste :

```text
Disponibilité
  → Réservation
  → Paiement
  → Contrat
  → Guest Journey
  → Arrivée
  → Séjour
  → Départ
  → Avis
  → Fidélisation
```

Les capacités de support suivent cette chaîne :

```text
Réservation
  → Planning opérationnel
  → Housekeeping / Maintenance
  → Disponibilité remise à jour
```

Les tableaux de bord, automatisations et assistants consomment ces données ; ils
ne doivent pas devenir une seconde source de vérité.

## 13. Critères communs à toutes les versions

Une version n'est publiable que si :

- son périmètre métier et ses critères d'acceptation sont validés ;
- le code est typé, relu, testé et documenté ;
- les migrations sont versionnées, réversibles et testées sur miroir ;
- les politiques RLS et permissions sont testées par rôle interne ;
- une sauvegarde récente existe et sa restauration a été exercée ;
- les parcours concernés sont responsive et conformes WCAG AA ;
- les impacts RGPD et sécurité sont traités ;
- le monitoring, les alertes et le rollback sont opérationnels ;
- la Preview et la recette métier sont validées ;
- une décision Go/No-Go explicite est signée.

## 14. Gouvernance de la roadmap

- La RC `1.0.0-rc.1` reste gelée.
- Le statut officiel reste **NO-GO** jusqu'à la clôture complète de l'Issue #12.
- Cette roadmap n'autorise ni migration, ni fusion, ni déploiement.
- Les fonctionnalités supprimées ne doivent plus créer de dépendances
  architecturales nouvelles.
- Les éléments historiques relatifs au SaaS peuvent rester archivés pour la
  traçabilité, mais ne constituent plus une cible.
- Toute réintroduction du multi-tenant, d'une marketplace, d'abonnements ou
  d'une commercialisation du logiciel nécessiterait une nouvelle décision
  d'architecture explicite annulant la présente décision.
- Après `2.0`, les versions seront définies uniquement à partir de besoins
  opérationnels observés. Aucune `3.0` n'est planifiée à ce jour.

## 15. Résultat attendu à long terme

Beaux Rivages doit devenir une plateforme privée, stable et agréable à utiliser,
qui permet de gérer les maisons de la marque depuis une source de vérité unique,
d'accueillir chaque voyageur avec attention et de réduire les tâches manuelles,
sans complexité liée à la commercialisation d'un logiciel SaaS.
