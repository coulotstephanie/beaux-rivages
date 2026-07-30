# Manuel d’exploitation — 30 premiers jours

**Projet :** Beaux Rivages  
**Version concernée :** 1.0.0  
**Statut du document :** officiel — applicable uniquement après décision GO  
**Public :** Stéphanie, Bruno et collaborateurs autorisés  
**Période couverte :** du Jour J au Jour 30 inclus

## Règle d’activation

Ce playbook ne constitue pas une autorisation de mise en production.

Il entre en vigueur uniquement lorsque :

- l’Issue #12 « Release 1.0 – Infrastructure & Go Live » est entièrement
  clôturée avec preuves ;
- `CERTIFICATION_1.0_SIGNED.md` porte la décision **GO** ;
- la personne responsable du Go Live a ouvert le journal d’exploitation ;
- les contacts d’urgence et leurs suppléants ont été confirmés.

Tant que ces conditions ne sont pas réunies, la Release Candidate
`1.0.0-rc.1` reste gelée et le statut demeure **NO-GO**.

## Mode d’emploi

Le responsable d’exploitation ouvre une copie datée des checklists et tableaux
de ce document. Chaque contrôle doit indiquer :

- la date et l’heure ;
- le nom de la personne qui l’a réalisé ;
- le résultat observé ;
- la preuve ou le lien vers le journal concerné ;
- l’action engagée en cas d’écart.

Une case n’est cochée que lorsque le contrôle est effectivement réalisé. Une
absence de preuve est traitée comme un contrôle non effectué.

---

## 1. Objectifs

Les trente premiers jours ont six objectifs prioritaires.

### 1.1 Garantir la stabilité

Maintenir disponibles le site public et les fonctions nécessaires aux
réservations, paiements, contrats et opérations quotidiennes.

### 1.2 Détecter rapidement les anomalies

Observer les parcours critiques, les journaux et les alertes afin qu’une
anomalie soit identifiée avant qu’elle n’affecte durablement un voyageur ou une
réservation.

### 1.3 Assurer la continuité de service

Appliquer des procédures connues en cas d’incident, protéger les réservations
en cours et éviter toute action improvisée sur la production.

### 1.4 Sécuriser les données

Vérifier les sauvegardes, conserver les preuves d’intégrité et maintenir une
capacité de restauration démontrée.

### 1.5 Recueillir les premiers retours

Centraliser les retours de Stéphanie, Bruno, des équipes et des voyageurs, sans
transformer immédiatement chaque remarque en modification.

### 1.6 Préparer la version 1.1

Établir un bilan objectif après trente jours et prioriser les améliorations
selon leur valeur opérationnelle, leur fréquence et leur impact.

---

## 2. Checklist Go Live

### 2.1 Autorisation

- [ ] La sauvegarde complète est validée et sa preuve est archivée.
- [ ] La restauration sur environnement miroir est validée.
- [ ] La certification 1.0 est signée avec une décision **GO**.
- [ ] Les responsables du déploiement, de la recette et du rollback sont
      nommés.
- [ ] La fenêtre de mise en production et la période de surveillance sont
      confirmées.
- [ ] Les contacts d’urgence et leurs suppléants sont accessibles.

### 2.2 Version

- [ ] La Pull Request de production est approuvée et fusionnée.
- [ ] Le commit exact à déployer est consigné.
- [ ] Les tests et le build de ce commit sont réussis.
- [ ] Le déploiement de production est terminé.
- [ ] Le tag Git `v1.0.0` est créé conformément à la décision de release.
- [ ] Les notes de version sont publiées.

### 2.3 Données et migrations

- [ ] Les migrations attendues sont exécutées dans l’ordre validé.
- [ ] L’historique local et distant des migrations est réconcilié.
- [ ] Les politiques RLS sont contrôlées sur la cible.
- [ ] Les contrôles d’intégrité après migration sont réussis.
- [ ] Le point de restauration antérieur au déploiement est conservé.
- [ ] Aucune donnée métier inattendue n’a été créée ou supprimée.

### 2.4 Services essentiels

- [ ] Supabase est disponible et la connexion à la base est saine.
- [ ] Stripe est configuré dans le mode explicitement autorisé.
- [ ] Les webhooks Stripe sont reçus et journalisés.
- [ ] Les e-mails transactionnels sont envoyés et reçus.
- [ ] Les contrats sont générés, accessibles et correctement archivés.
- [ ] Les sauvegardes programmées ou manuelles sont opérationnelles.
- [ ] Le stockage des médias est accessible.
- [ ] Les calendriers et disponibilités sont cohérents.

### 2.5 Surveillance

- [ ] La route de santé est contrôlée depuis l’extérieur.
- [ ] Les journaux applicatifs et fournisseurs sont accessibles.
- [ ] Les alertes sont activées.
- [ ] Un test d’alerte a été reçu par les destinataires prévus.
- [ ] La surveillance Stripe est active.
- [ ] La surveillance Supabase est active.
- [ ] La personne d’astreinte pour le Jour J est joignable.

### 2.6 Décision de lancement

| Décision   | Responsable  | Date et heure | Preuve       |
| ---------- | ------------ | ------------- | ------------ |
| GO / NO-GO | À renseigner | À renseigner  | À renseigner |

Un seul prérequis critique non validé impose une décision **NO-GO**.

---

## 3. Jour J

### 3.1 Principes

- Utiliser uniquement le commit certifié.
- Ne pas développer ni corriger directement en production.
- Ne pas modifier manuellement la base de données.
- Ne pas supprimer une réservation, un paiement ou un contrat pour « nettoyer »
  un test.
- Consigner chaque contrôle et chaque anomalie.
- Déclencher le rollback si les critères définis sont atteints.

### 3.2 Contrôles immédiats

À réaliser dès la fin du déploiement :

| Contrôle                 | Résultat attendu                                  | Preuve à conserver             |
| ------------------------ | ------------------------------------------------- | ------------------------------ |
| Domaine public           | Le domaine répond en HTTPS sans alerte            | Heure, URL et capture          |
| Page d’accueil           | Le contenu principal et les médias s’affichent    | Capture desktop et mobile      |
| Pages des maisons        | Les trois maisons sont accessibles                | URLs contrôlées                |
| Page Choisir             | Le comparateur s’affiche correctement             | Capture                        |
| Connexion administrateur | Un compte individuel autorisé se connecte         | Heure et résultat, sans secret |
| Permissions              | Un compte non autorisé ne voit pas le Back Office | Résultat du contrôle           |
| Santé applicative        | La route de santé répond normalement              | Journal horodaté               |
| Journaux                 | Aucun pic d’erreurs inattendu                     | Lien vers la période observée  |

### 3.3 Recette fonctionnelle de production

Utiliser des données de test identifiables et les procédures autorisées. Ne pas
utiliser les coordonnées d’un vrai voyageur sans nécessité.

- [ ] Rechercher une disponibilité.
- [ ] Vérifier le calcul des dates, du nombre de nuits et du prix.
- [ ] Créer une réservation test contrôlée.
- [ ] Vérifier l’absence de chevauchement de réservation.
- [ ] Effectuer le scénario de paiement autorisé pour la recette.
- [ ] Vérifier la réception et l’idempotence du webhook.
- [ ] Vérifier l’état du paiement dans le Dashboard.
- [ ] Générer un contrat.
- [ ] Vérifier son contenu, son téléchargement et son historique.
- [ ] Vérifier l’envoi des e-mails attendus.
- [ ] Ouvrir ou enrichir la fiche CRM du voyageur test.
- [ ] Vérifier le Dashboard et ses alertes.
- [ ] Vérifier le Carnet Beaux Rivages et ses médias.
- [ ] Vérifier Housekeeping et Maintenance sans créer de fausse mission réelle.
- [ ] Vérifier les calendriers et canaux effectivement connectés.

Les données de recette sont ensuite archivées ou annulées selon les règles
métier. Elles ne sont jamais supprimées directement dans la base.

### 3.4 Contrôles techniques observables

Même si le playbook est opérationnel, les éléments suivants doivent être lus
dans les outils prévus :

- erreurs applicatives et réponses serveur en échec ;
- latence du site et de la base ;
- erreurs de connexion ;
- événements Stripe et webhooks ;
- échecs d’e-mails ;
- alertes Supabase et Vercel ;
- saturation, quota ou limite fournisseur ;
- événements de sécurité inhabituels.

### 3.5 Fenêtres de contrôle

Les contrôles essentiels sont répétés :

- immédiatement après déploiement ;
- 30 minutes après ;
- 2 heures après ;
- en fin de journée ;
- le lendemain matin.

La personne responsable peut augmenter cette fréquence en cas d’anomalie.

### 3.6 Procès-verbal du Jour J

| Heure | Contrôle | Résultat | Anomalie | Action | Responsable |
| ----- | -------- | -------- | -------- | ------ | ----------- |
|       |          |          |          |        |             |
|       |          |          |          |        |             |
|       |          |          |          |        |             |

La journée est clôturée uniquement lorsque les incidents critiques sont résolus
ou qu’une décision de rollback a été exécutée.

---

## 4. Première semaine

### 4.1 Routine quotidienne

La routine est réalisée au début de la journée et renouvelée avant la fin de
service si l’activité ou les alertes le justifient.

#### Réservations

- vérifier les nouvelles réservations et annulations ;
- contrôler les dates, la maison et le nombre de voyageurs ;
- rechercher tout chevauchement ou incohérence de disponibilité ;
- vérifier les arrivées et départs des prochaines 48 heures.

#### Paiements

- rapprocher les paiements attendus et reçus ;
- vérifier les acomptes et soldes en attente ;
- examiner les paiements échoués et remboursements ;
- rapprocher les événements Stripe et les statuts internes ;
- ne jamais corriger manuellement un statut financier sans procédure.

#### Contrats et communications

- contrôler les contrats à générer ou à signer ;
- vérifier les e-mails en échec ou non distribués ;
- contrôler les messages d’arrivée et de départ à venir ;
- vérifier que les codes ou informations sensibles ne sont transmis qu’au bon
  moment.

#### Exploitation

- contrôler les arrivées, départs et séjours en cours ;
- vérifier les missions de ménage et incidents ouverts ;
- examiner les alertes du Dashboard ;
- confirmer que le Carnet et les informations utiles restent accessibles.

#### Infrastructure

- vérifier l’état Supabase, Vercel et Stripe ;
- contrôler la santé applicative ;
- examiner les erreurs critiques et les journaux ;
- confirmer l’exécution et l’intégrité de la sauvegarde ;
- vérifier les quotas ou alertes fournisseurs.

### 4.2 Tableau de suivi — Jours 1 à 7

| Jour | Réservations | Paiements | Contrats / e-mails | Sauvegarde | Logs / alertes | Supabase / Stripe | Incidents | Responsable |
| ---- | ------------ | --------- | ------------------ | ---------- | -------------- | ----------------- | --------- | ----------- |
| J1   | ☐            | ☐         | ☐                  | ☐          | ☐              | ☐                 |           |             |
| J2   | ☐            | ☐         | ☐                  | ☐          | ☐              | ☐                 |           |             |
| J3   | ☐            | ☐         | ☐                  | ☐          | ☐              | ☐                 |           |             |
| J4   | ☐            | ☐         | ☐                  | ☐          | ☐              | ☐                 |           |             |
| J5   | ☐            | ☐         | ☐                  | ☐          | ☐              | ☐                 |           |             |
| J6   | ☐            | ☐         | ☐                  | ☐          | ☐              | ☐                 |           |             |
| J7   | ☐            | ☐         | ☐                  | ☐          | ☐              | ☐                 |           |             |

### 4.3 Point quotidien

Pendant la première semaine, Stéphanie et Bruno réalisent un point court :

1. incidents des dernières 24 heures ;
2. réservations, paiements ou messages nécessitant une action ;
3. retours des voyageurs et des équipes ;
4. risques pour les prochaines arrivées ;
5. décision sur les actions du jour.

Les demandes d’amélioration non urgentes sont placées dans le registre de
retours. Elles ne sont pas développées pendant la période de stabilisation.

### 4.4 Rythme des semaines 2 à 4

Après J7, et uniquement si aucun incident critique n’est ouvert :

- routine opérationnelle chaque jour d’activité ;
- revue des journaux et indicateurs au minimum trois fois par semaine ;
- revue formelle des incidents et sauvegardes chaque semaine ;
- contrôle renforcé avant chaque période d’arrivée ;
- bilan intermédiaire à J15 ;
- bilan de stabilité à J30.

---

## 5. Incidents

### 5.1 Niveaux de gravité

| Gravité       | Définition opérationnelle                                | Exemples                                                              | Réponse attendue                                |
| ------------- | -------------------------------------------------------- | --------------------------------------------------------------------- | ----------------------------------------------- |
| P0 — Critique | Données, sécurité, paiements ou service entier en danger | perte de données suspectée, fuite, double paiement, site indisponible | action immédiate, gel des écritures et escalade |
| P1 — Majeur   | Parcours essentiel indisponible sans solution acceptable | réservation, connexion staff, contrat ou paiement bloqué              | traitement prioritaire le jour même             |
| P2 — Modéré   | Fonction dégradée avec solution de contournement sûre    | e-mail en retard, vue interne partiellement indisponible              | planification et suivi rapproché                |
| P3 — Mineur   | Gêne sans impact métier immédiat                         | défaut visuel ou texte secondaire                                     | consignation pour version ultérieure            |

### 5.2 Procédure officielle

#### 1. Détection

- relever l’heure, l’environnement, la version et le déclarant ;
- conserver les messages d’erreur et preuves utiles ;
- ne pas recopier de secret ou de donnée personnelle dans un canal public.

#### 2. Qualification

- attribuer une gravité ;
- déterminer les voyageurs, maisons et opérations concernés ;
- vérifier les impacts sur données, paiements, sécurité et disponibilité ;
- nommer un responsable de l’incident.

#### 3. Confinement

- suspendre la fonction ou les écritures concernées si nécessaire ;
- geler migrations et déploiements ;
- préserver les journaux ;
- ne jamais lancer une commande destructive improvisée.

#### 4. Diagnostic

- vérifier les changements récents ;
- consulter la santé et les journaux applicatifs ;
- consulter le statut Supabase, Stripe et Vercel ;
- distinguer une panne fournisseur d’une régression applicative ;
- établir les faits avant de choisir rollback ou attente.

#### 5. Action

- appliquer le Runbook correspondant ;
- utiliser le dernier commit sain ou la sauvegarde vérifiée uniquement selon la
  procédure approuvée ;
- noter chaque action, son auteur et son résultat ;
- effectuer une revue à deux personnes pour toute action sur les données.

#### 6. Communication

- informer Stéphanie et Bruno pour tout P0 ou P1 ;
- prévenir les voyageurs uniquement si leur séjour ou leurs données sont
  affectés ;
- utiliser un message factuel, sans hypothèse ni promesse non maîtrisée ;
- annoncer la prochaine heure de mise à jour.

#### 7. Résolution

- vérifier le parcours concerné de bout en bout ;
- confirmer l’intégrité des données ;
- surveiller la reprise ;
- documenter les éventuelles actions manuelles restant à effectuer.

#### 8. Clôture

- enregistrer la cause, l’impact, la durée et la résolution ;
- identifier les actions préventives ;
- affecter un responsable et une échéance ;
- réaliser un retour d’expérience pour chaque P0 et P1 ;
- ne clôturer qu’après validation de Stéphanie ou Bruno.

### 5.3 Fiche incident

| Champ                         | Valeur |
| ----------------------------- | ------ |
| Identifiant                   |        |
| Date et heure de début        |        |
| Déclarant                     |        |
| Gravité                       |        |
| Version                       |        |
| Voyageurs / maisons concernés |        |
| Symptômes                     |        |
| Impact                        |        |
| Responsable                   |        |
| Actions réalisées             |        |
| Communication envoyée         |        |
| Heure de rétablissement       |        |
| Cause confirmée               |        |
| Actions préventives           |        |
| Validation de clôture         |        |

Les procédures détaillées de rollback et d’indisponibilité fournisseur restent
dans [Runbooks.md](./Runbooks.md) et
[IncidentResponse.md](./IncidentResponse.md).

---

## 6. Sauvegardes

### 6.1 Principe d’exploitation

Une sauvegarde n’est considérée comme valable que si elle est :

- terminée sans erreur ;
- datée et identifiable ;
- accompagnée d’une empreinte ou d’un contrôle d’intégrité ;
- stockée dans un emplacement protégé ;
- conservée hors de l’environnement principal ;
- restaurable selon une procédure déjà éprouvée.

La présence d’un fichier seule ne prouve pas la capacité de restauration.

### 6.2 Fréquence des trente premiers jours

Sous réserve de validation dans la certification et le Runbook :

- sauvegarde de référence immédiatement avant la mise en production ;
- sauvegarde complète après validation du déploiement ;
- sauvegarde quotidienne pendant les trente premiers jours ;
- sauvegarde supplémentaire avant toute migration ou opération à risque ;
- contrôle quotidien du résultat pendant la première semaine ;
- contrôle au minimum trois fois par semaine de J8 à J30 ;
- restauration de contrôle sur un environnement isolé au cours de la période.

Si l’outil retenu ne permet pas cette fréquence, le responsable d’exploitation
doit documenter le risque et prononcer une nouvelle décision Go/No-Go.

### 6.3 Contenu à protéger

- base PostgreSQL, y compris les schémas nécessaires à Auth et Storage ;
- fichiers et médias Storage ;
- configuration Auth ;
- inventaire des variables et secrets, sans les placer dans Git ;
- configuration Vercel, Supabase, Stripe et DNS ;
- journaux de vérification et preuves de restauration.

### 6.4 Conservation

Les durées définitives doivent être approuvées selon les obligations juridiques
et la politique de protection des données. Pendant les trente premiers jours,
conserver au minimum :

- le point de restauration antérieur au Go Live ;
- la sauvegarde immédiatement postérieure au Go Live ;
- les sauvegardes nécessaires pour couvrir toute la période d’observation ;
- les preuves d’intégrité et journaux associés.

Aucune sauvegarde contenant des données personnelles ne doit être placée dans
Git, envoyée par e-mail ou conservée sur un support non chiffré.

### 6.5 Stockage hors site

Au moins une copie vérifiée est conservée dans un emplacement distinct de
Supabase et de l’ordinateur utilisé pour l’exploitation. Les accès sont limités
aux personnes autorisées et la récupération du support est testée.

### 6.6 Vérification quotidienne

- [ ] La sauvegarde attendue existe.
- [ ] Son horodatage correspond à la période attendue.
- [ ] Sa taille est cohérente avec les sauvegardes précédentes.
- [ ] Son contrôle d’intégrité est réussi.
- [ ] La copie hors site est confirmée.
- [ ] Aucun secret n’apparaît dans le journal partagé.
- [ ] Toute anomalie a créé un incident.

### 6.7 Restauration périodique

La restauration est réalisée uniquement sur un environnement isolé :

1. désigner le responsable et la fenêtre de test ;
2. sélectionner une sauvegarde vérifiée ;
3. restaurer selon
   [BackupRestoreSOP.md](./BackupRestoreSOP.md) ;
4. comparer les éléments agrégés attendus ;
5. contrôler Auth, réservations, paiements, contrats et médias ;
6. mesurer la durée réelle ;
7. consigner les écarts et la décision PASS/FAIL ;
8. détruire ou sécuriser le miroir selon la procédure approuvée.

Un test de restauration échoué ouvre un incident P0 et remet en cause la
capacité de mise en production suivante.

---

## 7. Suivi qualité

### 7.1 Indicateurs prioritaires

| Indicateur                | Définition                                             | Source                  | Fréquence                | Seuil d’alerte                            |
| ------------------------- | ------------------------------------------------------ | ----------------------- | ------------------------ | ----------------------------------------- |
| Disponibilité             | Part des contrôles où le service répond normalement    | Monitoring externe      | Quotidienne              | À valider avant Go Live                   |
| Réservations réussies     | Réservations confirmées sans correction manuelle       | Application / base      | Quotidienne              | Toute anomalie analysée                   |
| Taux d’échec réservation  | Tentatives en erreur rapportées aux tentatives totales | Logs / analytics        | Quotidienne              | À établir après mesure initiale           |
| Paiements réussis         | Paiements confirmés et rapprochés                      | Stripe / Dashboard      | Quotidienne              | Tout écart de rapprochement               |
| Paiements échoués         | Paiements refusés ou techniquement interrompus         | Stripe / logs           | Quotidienne              | Hausse inhabituelle ou statut incohérent  |
| Contrats générés          | Contrats attendus effectivement produits               | Dashboard               | Quotidienne              | Un contrat attendu manquant               |
| E-mails en échec          | Messages attendus non envoyés ou non distribués        | Fournisseur e-mail      | Quotidienne              | Tout message critique                     |
| Erreurs critiques         | Événements P0 et P1                                    | Registre incidents      | Temps réel               | Une seule occurrence                      |
| Incidents ouverts         | Nombre d’incidents non clôturés par gravité            | Registre incidents      | Quotidienne              | Tout P0/P1 non maîtrisé                   |
| Temps moyen de résolution | Durée entre détection et rétablissement                | Registre incidents      | Hebdomadaire             | À établir sur les données réelles         |
| Sauvegardes réussies      | Sauvegardes intègres sur sauvegardes attendues         | Journal sauvegarde      | Quotidienne              | Inférieur à 100 %                         |
| Restauration              | Dernier test réussi et durée mesurée                   | Rapport de restauration | Hebdomadaire / événement | Test absent ou échoué                     |
| Performance               | Temps de chargement et latence des parcours critiques  | Monitoring              | Quotidienne              | Dégradation durable par rapport au Jour J |
| Satisfaction              | Retours voyageurs nécessitant une action               | CRM / avis              | Hebdomadaire             | Problème récurrent ou critique            |

Les seuils chiffrés non encore mesurés ne doivent pas être inventés. Le Jour J
établit la mesure de référence ; Stéphanie et Bruno approuvent ensuite les
seuils opérationnels.

### 7.2 Tableau de bord hebdomadaire

| Semaine | Disponibilité | Réservations | Paiements | Erreurs P0/P1 | Sauvegardes | Restauration | Retours clés | Décision |
| ------- | ------------- | ------------ | --------- | ------------- | ----------- | ------------ | ------------ | -------- |
| J1–J7   |               |              |           |               |             |              |              |          |
| J8–J14  |               |              |           |               |             |              |              |          |
| J15–J21 |               |              |           |               |             |              |              |          |
| J22–J30 |               |              |           |               |             |              |              |          |

### 7.3 Registre des retours

Chaque retour est classé sans engager immédiatement un développement :

| Date | Auteur | Parcours | Observation | Impact | Fréquence | Contournement | Candidat 1.1 |
| ---- | ------ | -------- | ----------- | ------ | --------- | ------------- | ------------ |
|      |        |          |             |        |           |               |              |

Priorité proposée :

- **P0 :** sécurité, perte de données, paiement ou indisponibilité critique ;
- **P1 :** blocage d’une opération essentielle ;
- **P2 :** amélioration apportant une valeur opérationnelle mesurable ;
- **P3 :** confort ou préférence sans impact immédiat.

---

## 8. Fin des trente jours

### 8.1 Revue de stabilité

À J30, Stéphanie, Bruno et le responsable technique examinent :

- tous les incidents et leur cause ;
- les réservations, paiements, contrats et communications ;
- la disponibilité et les performances ;
- les sauvegardes et le dernier test de restauration ;
- les alertes et délais de réaction ;
- les retours voyageurs et équipes ;
- les contournements manuels encore utilisés ;
- la dette ou les risques acceptés.

### 8.2 Critères de stabilité de la version 1.0

La version 1.0 peut être déclarée stable si :

- aucun incident P0 n’est ouvert ;
- aucun incident P1 ne reste sans plan, responsable et échéance ;
- aucune perte ou incohérence de donnée n’est inexpliquée ;
- les réservations et paiements sont réconciliés ;
- les contrats et communications critiques fonctionnent ;
- les sauvegardes attendues sont intègres ;
- une restauration récente est réussie et chronométrée ;
- les alertes atteignent les bons destinataires ;
- les procédures d’incident ont été utilisables ;
- les parcours essentiels restent accessibles et performants ;
- les risques résiduels sont explicitement acceptés par Stéphanie et Bruno.

Si un critère n’est pas rempli, la stabilisation continue en `1.0.x`. La version
1.1 n’est pas ouverte pour compenser un problème de stabilité.

### 8.3 Décision de clôture

| Domaine                | PASS / FAIL | Preuve | Action restante |
| ---------------------- | ----------- | ------ | --------------- |
| Stabilité              |             |        |                 |
| Données et sauvegardes |             |        |                 |
| Réservations           |             |        |                 |
| Paiements              |             |        |                 |
| Contrats et e-mails    |             |        |                 |
| Sécurité               |             |        |                 |
| Monitoring et alertes  |             |        |                 |
| Exploitation interne   |             |        |                 |
| Expérience voyageur    |             |        |                 |

| Décision                                     | Responsable produit | Responsable exploitation | Date |
| -------------------------------------------- | ------------------- | ------------------------ | ---- |
| Version 1.0 stable / stabilisation prolongée |                     |                          |      |

### 8.4 Préparation de la version 1.1

L’ouverture de la version 1.1 nécessite :

1. la déclaration de stabilité de la version 1.0 ;
2. la consolidation du registre des retours ;
3. la sélection des problèmes ayant une valeur directe pour l’exploitation ;
4. des règles métier et critères d’acceptation validés ;
5. l’absence de P0/P1 non maîtrisé ;
6. un périmètre compatible avec
   [ROADMAP_PRIVATE_PLATFORM.md](../../ROADMAP_PRIVATE_PLATFORM.md) ;
7. une nouvelle décision de lancement de version.

La version 1.1 reste centrée sur la relation voyageur et la réservation directe.
Elle ne réintroduit ni SaaS, ni multi-tenant, ni marketplace, ni portail de
propriétaires indépendants.

---

## 9. Documents de référence

Ce playbook complète, sans les remplacer :

- [Runbooks.md](./Runbooks.md) — procédures d’exploitation et de rollback ;
- [IncidentResponse.md](./IncidentResponse.md) — cadre de réponse aux
  incidents ;
- [BackupRestoreSOP.md](./BackupRestoreSOP.md) — procédure officielle de
  sauvegarde et restauration ;
- [Monitoring.md](./Monitoring.md) — contrôles de santé et surveillance ;
- [GO_LIVE_CHECKLIST.md](./GO_LIVE_CHECKLIST.md) — prérequis de mise en
  production ;
- [VerificationLog.md](./VerificationLog.md) — registre des preuves et
  décisions ;
- [CERTIFICATION_1.0.md](../../CERTIFICATION_1.0.md) — état de certification de
  la version 1.0 ;
- [ROADMAP_PRIVATE_PLATFORM.md](../../ROADMAP_PRIVATE_PLATFORM.md) — trajectoire
  produit officielle après la décision de plateforme privée.

En cas de contradiction, la certification signée et les procédures techniques
permanentes approuvées priment sur ce manuel de suivi quotidien.
