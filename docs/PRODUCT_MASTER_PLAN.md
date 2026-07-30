# Product Master Plan — Beaux Rivages

**Version :** 1.0  
**Date :** 30 juillet 2026  
**Statut :** référence stratégique officielle  
**Horizon :** version 1.0 à version 2.0  
**Périmètre :** plateforme métier privée Beaux Rivages

## Rôle du document

Ce document fixe la direction durable du produit Beaux Rivages. Il précède tout
nouveau développement et sert à arbitrer les priorités, les investissements et
les compromis.

Il ne constitue ni un engagement de calendrier ni une autorisation de
déploiement. Chaque version reste soumise à son cadrage, à ses critères
d’acceptation, à la certification de production et à une décision Go/No-Go.

La plateforme est exclusivement destinée à l’activité Beaux Rivages. Elle n’a
pas vocation à devenir un SaaS, une marketplace ouverte ou un logiciel vendu à
des propriétaires indépendants.

---

## 1. La vision

### 1.1 Pourquoi Beaux Rivages existe

Beaux Rivages existe pour faire vivre l’Île de Ré et l’Île d’Oléron autrement.
Les maisons sont le point de départ d’une expérience plus large : se sentir
attendu, comprendre le territoire, découvrir des adresses sincères et repartir
avec l’envie de revenir.

Le produit numérique prolonge cette promesse. Il aide Stéphanie et Bruno à
préparer chaque séjour avec attention tout en maîtrisant une activité devenue
complexe : calendriers, canaux, paiements, contrats, messages, ménages,
maintenance, recommandations et suivi des voyageurs.

### 1.2 Les problèmes résolus

Pour le voyageur :

- l’incertitude sur la maison réellement adaptée à son séjour ;
- la dispersion des informations avant et pendant les vacances ;
- les démarches impersonnelles ;
- la difficulté à trouver des recommandations locales fiables ;
- les frictions liées à l’arrivée, au paiement et aux documents ;
- le sentiment d’être livré à lui-même après la réservation.

Pour les hôtes et les équipes :

- la duplication des informations entre outils et plateformes ;
- le risque de calendrier incohérent ou de double réservation ;
- les vérifications manuelles répétitives ;
- les paiements, contrats ou messages oubliés ;
- la difficulté à coordonner ménage, accueil et maintenance ;
- la perte de connaissance entre deux séjours ;
- l’absence d’une vue fiable pour prendre les décisions.

### 1.3 L’expérience recherchée

Le voyageur doit ressentir une continuité :

```text
Inspiration
  → Choix de la maison
  → Réservation
  → Préparation
  → Arrivée
  → Séjour
  → Départ
  → Souvenir
  → Retour
```

À chaque étape, l’information arrive au bon moment, dans un ton chaleureux, avec
une possibilité simple de joindre une personne.

L’expérience numérique doit donner la même impression que les maisons :

- lumineuse ;
- élégante ;
- simple ;
- rassurante ;
- discrète ;
- authentique ;
- sans surcharge.

### 1.4 La philosophie de l’hospitalité

Beaux Rivages ne vend pas seulement des nuits. Il crée des souvenirs.

L’hospitalité repose sur cinq convictions :

1. chaque voyageur doit se sentir attendu ;
2. la simplicité perçue est le résultat d’une préparation rigoureuse ;
3. la personnalisation doit rester utile et respectueuse ;
4. la technologie assiste l’attention humaine, elle ne la remplace pas ;
5. un séjour se juge autant à la qualité de l’accueil qu’à celle de la maison.

### 1.5 Pourquoi Beaux Rivages n’est pas une simple plateforme de réservation

Une plateforme de réservation met en relation une offre et une demande. Beaux
Rivages accompagne une relation dans la durée.

Le produit réunit :

- des maisons exploitées directement par la marque ;
- une connaissance réelle des voyageurs ;
- une méthode d’accueil ;
- des opérations coordonnées ;
- des recommandations testées ;
- des attentions personnalisées ;
- un apprentissage après chaque séjour.

La réservation est une étape du parcours, pas sa finalité.

---

## 2. Les piliers du produit

### 2.1 Hospitalité premium

Chaque fonctionnalité doit contribuer à une expérience préparée, élégante et
cohérente. « Premium » signifie ici attention, fiabilité et justesse, jamais
complexité ou démonstration technologique.

### 2.2 Réservation directe

Le voyageur doit pouvoir comprendre les maisons, vérifier une disponibilité,
obtenir un prix clair et réserver sans friction. La réservation directe
renforce la relation, la connaissance voyageur et la maîtrise de l’expérience.

### 2.3 Simplicité

Le produit doit réduire le nombre de décisions, de ressaisies et de contrôles
inutiles. Une interface plus riche n’est pas nécessairement une meilleure
interface.

### 2.4 Automatisation utile

L’automatisation prend en charge les tâches répétitives, prévisibles et
traçables. Elle laisse aux personnes les décisions sensibles, les situations
inhabituelles et les gestes d’hospitalité.

### 2.5 Relation humaine

Chaque parcours conserve une porte de sortie vers Stéphanie, Bruno ou une
personne autorisée. Aucun message automatique ne doit enfermer le voyageur dans
une boucle sans interlocuteur.

### 2.6 Qualité

La qualité concerne le contenu, les données, les maisons, les opérations et le
logiciel. Une fonction n’est terminée que si elle est compréhensible, testée,
documentée et utilisable dans les conditions réelles.

### 2.7 Sécurité

Les données, paiements, contrats, accès et opérations sensibles sont protégés
par défaut. La sécurité prime sur la vitesse de livraison.

### 2.8 Fiabilité

Les disponibilités, prix, statuts et alertes doivent être dignes de confiance.
Le produit ne doit jamais masquer une incertitude sous une apparence de
certitude.

### 2.9 Confidentialité

Beaux Rivages conserve uniquement les informations utiles à une finalité
légitime. La personnalisation n’autorise ni collecte excessive ni surveillance
du voyageur.

### 2.10 Connaissance du territoire

Les recommandations sont personnelles, argumentées, datées et actualisées. Le
Carnet exprime la singularité de Beaux Rivages ; il ne devient pas un annuaire
générique.

---

## 3. Les personas

Les personas décrivent des rôles et besoins opérationnels. Ils ne supposent ni
âge, ni catégorie sociale, ni comportement non démontré. Ils devront être
enrichis par les recherches, entretiens et données d’usage réels.

### 3.1 Voyageur

#### Rôle

Personne qui découvre, réserve ou séjourne dans une maison Beaux Rivages. Elle
peut voyager seule, en couple, en famille, avec des amis, un bébé ou un animal.

#### Besoins

- comprendre rapidement quelle maison lui convient ;
- connaître le prix, les conditions et les disponibilités ;
- réserver et payer en confiance ;
- préparer son arrivée sans chercher les informations ;
- obtenir de l’aide au bon moment ;
- découvrir des adresses adaptées à son séjour ;
- se sentir reconnu sans être observé.

#### Attentes

- photos fidèles et informations précises ;
- parcours mobile simple ;
- communication chaleureuse ;
- paiement et contrat rassurants ;
- maison prête ;
- recommandations réellement testées ;
- réponse humaine lorsqu’une situation l’exige.

#### Frustrations

- informations contradictoires ;
- messages automatiques impersonnels ;
- prix incompréhensible ;
- demande répétée de la même information ;
- accès ou Wi-Fi difficiles ;
- recommandation fermée ou dépassée ;
- silence en cas de problème.

#### Objectifs

- choisir sereinement ;
- voyager léger ;
- profiter du séjour ;
- découvrir le territoire ;
- conserver un bon souvenir ;
- avoir envie de revenir.

### 3.2 Hôte

#### Rôle

Stéphanie ou Bruno lorsqu’ils préparent, accueillent, accompagnent et
fidélisent les voyageurs.

#### Besoins

- connaître la situation exacte de chaque séjour ;
- anticiper les attentes ;
- retrouver l’historique utile ;
- communiquer sans ressaisie ;
- valider les actions sensibles ;
- conserver une relation personnelle malgré l’automatisation.

#### Attentes

- vue claire des arrivées et départs ;
- alertes pertinentes ;
- informations fiables ;
- modèles de message adaptables ;
- recommandations éditables ;
- historique complet ;
- reprise manuelle simple.

#### Frustrations

- multiplier les outils ;
- chercher une information dans plusieurs conversations ;
- recevoir des alertes non prioritaires ;
- découvrir tardivement un paiement ou contrat manquant ;
- automatisation impossible à corriger ;
- contenu qui ne correspond plus à la réalité.

#### Objectifs

- offrir un accueil constant et personnel ;
- consacrer plus de temps à l’hospitalité ;
- réduire les oublis ;
- répondre rapidement ;
- apprendre de chaque séjour.

### 3.3 Conciergerie

#### Rôle

Personne autorisée qui coordonne ou réalise les expériences, demandes spéciales
et services associés au séjour.

#### Besoins

- connaître la demande exacte et son statut ;
- vérifier disponibilité, prix et contraintes ;
- attribuer une responsabilité ;
- communiquer avec les hôtes et le voyageur ;
- suivre la réalisation et les éventuels coûts.

#### Attentes

- planning lisible ;
- demandes structurées ;
- informations strictement nécessaires ;
- notification au bon moment ;
- confirmation avant toute promesse ;
- historique de réalisation.

#### Frustrations

- demande reçue trop tard ;
- détails dispersés ;
- prestation vendue mais indisponible ;
- changement non signalé ;
- absence de responsable ;
- paiement ou condition incertain.

#### Objectifs

- préparer une expérience juste ;
- éviter les oublis ;
- coordonner les partenaires sélectionnés ;
- confirmer la réalisation ;
- contribuer à un séjour mémorable.

### 3.4 Maintenance

#### Rôle

Bruno, collaborateur ou prestataire autorisé chargé de diagnostiquer et résoudre
un incident matériel.

#### Besoins

- connaître la maison, l’équipement et la gravité ;
- accéder aux faits et photos utiles ;
- organiser l’intervention ;
- suivre les coûts et pièces ;
- savoir si la maison doit être bloquée ;
- documenter la résolution.

#### Attentes

- ticket complet ;
- priorité explicite ;
- planning à jour ;
- contact opérationnel approprié ;
- historique de l’équipement ;
- validation après intervention.

#### Frustrations

- description vague ;
- demande dupliquée ;
- accès ou créneau non confirmé ;
- urgence mal qualifiée ;
- incident clôturé sans contrôle ;
- absence d’historique.

#### Objectifs

- sécuriser les personnes et la maison ;
- rétablir rapidement le service ;
- éviter une récidive ;
- maîtriser les coûts ;
- remettre la maison à disposition en confiance.

### 3.5 Ménage

#### Rôle

Personne ou équipe chargée de préparer la maison après un départ et avant une
arrivée.

#### Besoins

- connaître les horaires et priorités ;
- disposer d’une checklist adaptée ;
- connaître linge, bébé, animal, packs et attentions ;
- signaler une anomalie ;
- ajouter les preuves requises ;
- faire valider la maison.

#### Attentes

- planning mobile lisible ;
- consignes non contradictoires ;
- stock disponible ;
- progression visible ;
- possibilité de signaler un incident ;
- critères de clôture précis.

#### Frustrations

- arrivée avancée non communiquée ;
- checklist générique ;
- consommable manquant ;
- changement de dernière minute ;
- mission clôturée sans contrôle ;
- information sensible inutilement exposée.

#### Objectifs

- préparer une maison impeccable ;
- terminer dans le délai prévu ;
- ne rien oublier ;
- signaler rapidement un problème ;
- contribuer à la première impression du voyageur.

### 3.6 Gestionnaire

#### Rôle

Stéphanie ou Bruno lorsqu’ils pilotent l’ensemble de l’activité, des revenus et
des risques.

#### Besoins

- disposer d’une source de vérité ;
- anticiper l’occupation et la charge ;
- suivre revenus, paiements et coûts ;
- arbitrer les prix et promotions ;
- mesurer la satisfaction ;
- gérer les incidents et priorités ;
- contrôler les accès et la conformité.

#### Attentes

- Dashboard synthétique ;
- indicateurs définis ;
- possibilité de remonter au détail ;
- alertes actionnables ;
- données exportables ;
- décisions historisées ;
- continuité d’activité démontrée.

#### Frustrations

- indicateurs incohérents ;
- données non rapprochées ;
- reporting manuel ;
- absence de preuve ;
- dépendance à une seule personne ;
- fonctionnalité coûteuse sans bénéfice opérationnel.

#### Objectifs

- gérer les maisons sereinement ;
- augmenter les réservations directes ;
- améliorer le revenu sans dégrader l’accueil ;
- réduire les risques et tâches manuelles ;
- prendre des décisions fondées sur des données fiables.

---

## 4. Les objectifs produit

### 4.1 Augmenter les réservations directes

Rendre le choix, la disponibilité, le prix et la réservation plus clairs, tout
en conservant les canaux externes utiles.

### 4.2 Réduire les tâches manuelles

Supprimer les ressaisies, vérifications répétitives et relances prévisibles sans
automatiser les décisions sensibles.

### 4.3 Améliorer la satisfaction

Préparer les maisons, transmettre les bonnes informations, répondre rapidement
et utiliser les retours pour corriger les causes récurrentes.

### 4.4 Réduire les erreurs

Fiabiliser disponibilités, prix, paiements, contrats, messages et opérations
avec des contrôles aux niveaux appropriés.

### 4.5 Optimiser les revenus

Améliorer occupation, ADR, RevPAR et panier moyen grâce à des décisions
explicables, sans sacrifier l’expérience ni créer une pression commerciale.

### 4.6 Fidéliser les voyageurs

Reconnaître les voyageurs qui reviennent, retrouver leurs préférences utiles et
leur proposer de nouvelles raisons de séjourner chez Beaux Rivages.

### 4.7 Unifier l’exploitation

Donner à Stéphanie et Bruno une vision partagée des réservations, voyageurs,
paiements, contrats, ménages, maintenances et alertes.

### 4.8 Protéger l’activité

Maintenir sauvegardes, restauration, sécurité, permissions, surveillance et
procédures d’incident au niveau requis pour une activité réelle.

### 4.9 Faire vivre le territoire

Construire un Carnet utile, personnel et actuel qui aide le voyageur à vivre les
îles selon la saison, la météo et ses envies.

---

## 5. Les principes de conception

### 5.1 Une fonction ne doit jamais compliquer le travail

Une nouvelle fonction doit supprimer une friction ou rendre une décision plus
sûre. Si elle impose davantage de ressaisie, d’écrans ou de contrôles sans
bénéfice démontré, elle doit être revue.

### 5.2 Toute automatisation doit pouvoir être reprise

Une automatisation doit être :

- observable ;
- interrompable ;
- rejouable ;
- idempotente ;
- historisée ;
- reprenable manuellement par une personne autorisée.

### 5.3 La technologie ne remplace pas l’hospitalité

Le produit prépare, rappelle et suggère. Stéphanie et Bruno conservent les
décisions liées à l’accueil, aux situations délicates, aux compensations et aux
attentions personnelles.

### 5.4 Une seule source de vérité

Chaque donnée métier possède une source officielle. Les tableaux de bord et
automatisations la consomment ; ils ne créent pas une version parallèle.

### 5.5 Fiabilité avant richesse

Une fonction limitée mais fiable est préférable à une fonction spectaculaire
dont les données ou comportements sont incertains.

### 5.6 Divulgation progressive

Le voyageur et les équipes voient l’information nécessaire au moment où elle
devient utile. Les secrets et données sensibles ne sont jamais affichés trop
tôt ni trop largement.

### 5.7 Accessibilité et mobile par défaut

Les parcours doivent fonctionner au clavier, avec les technologies
d’assistance, sur mobile et dans des conditions de connexion imparfaites.

### 5.8 Serveur et sécurité par défaut

Les validations importantes sont effectuées côté serveur et en base lorsque
nécessaire. L’interface ne constitue jamais l’unique protection.

### 5.9 Contenu fidèle

Les photos, prix, disponibilités et recommandations correspondent à la réalité.
Une information non vérifiée est indiquée ou retirée.

### 5.10 Mode dégradé utile

Une panne d’un service secondaire ne doit pas bloquer un parcours essentiel.
Lorsque possible, le produit affiche une solution de repli compréhensible.

### 5.11 Mesurer avant d’optimiser

Les décisions reposent sur une mesure définie et une période suffisante. Un KPI
mal défini ne doit pas guider une évolution.

### 5.12 Privacy by design

La collecte est minimale, la finalité explicite, l’accès limité et la
conservation maîtrisée.

---

## 6. Les règles d’évolution

### 6.1 Porte d’entrée d’une idée

Toute idée doit préciser :

- le problème observé ;
- les personnes concernées ;
- la fréquence ;
- l’impact ;
- la solution actuelle ou le contournement ;
- le bénéfice attendu ;
- le moyen de mesurer ce bénéfice.

Une idée exprimée uniquement sous la forme d’une solution n’est pas encore un
besoin validé.

### 6.2 Questions obligatoires

Avant acceptation :

1. apporte-t-elle une valeur claire au voyageur ou à l’exploitation ?
2. simplifie-t-elle réellement le quotidien ?
3. renforce-t-elle l’hospitalité Beaux Rivages ?
4. respecte-t-elle la confidentialité et la sécurité ?
5. existe-t-elle déjà sous une autre forme ?
6. peut-elle être améliorée ou réutilisée plutôt que recréée ?
7. reste-t-elle compréhensible et maintenable ?
8. fonctionne-t-elle en mode dégradé ?
9. peut-elle être testée et documentée ?
10. son coût total est-il proportionné au bénéfice ?

Un « non » non résolu entraîne un nouveau cadrage ou un refus.

### 6.3 Critères de refus

Une fonctionnalité est écartée si elle :

- sert principalement la commercialisation du logiciel ;
- nécessite une architecture multi-tenant ;
- crée une marketplace ouverte ;
- ajoute abonnements ou facturation SaaS ;
- vise des propriétaires indépendants ;
- duplique un domaine existant ;
- automatise une décision qui doit rester humaine ;
- collecte des données sans finalité suffisante ;
- augmente durablement la complexité sans gain mesurable ;
- ne peut pas être exploitée ou maintenue par l’équipe.

### 6.4 Priorisation

| Priorité | Définition                                                       |
| -------- | ---------------------------------------------------------------- |
| P0       | Sécurité, données, paiement, réservation ou continuité en danger |
| P1       | Parcours essentiel bloqué ou risque opérationnel important       |
| P2       | Valeur mesurable pour le voyageur, le revenu ou les opérations   |
| P3       | Confort ou amélioration sans impact immédiat                     |

La sûreté de production est toujours prioritaire sur une nouvelle capacité.

### 6.5 Cycle de décision

```text
Observer
  → Décrire le problème
  → Vérifier les données
  → Définir la valeur
  → Étudier l’existant
  → Concevoir
  → Valider les règles
  → Développer
  → Tester
  → Documenter
  → Certifier
  → Déployer
  → Mesurer
```

### 6.6 Definition of Ready

Une évolution est prête à être développée lorsque :

- le problème est documenté ;
- le périmètre est limité ;
- les règles métier sont validées ;
- les dépendances sont identifiées ;
- les risques et données personnelles sont analysés ;
- les critères d’acceptation sont testables ;
- les indicateurs de réussite sont définis ;
- l’exploitation future est attribuée.

### 6.7 Definition of Done

Une évolution est terminée lorsqu’elle est :

- fonctionnelle ;
- relue ;
- typée ;
- testée ;
- documentée ;
- accessible ;
- responsive ;
- sécurisée ;
- observable ;
- exploitable ;
- validée par recette ;
- déployée selon la procédure de release.

---

## 7. Indicateurs produit

Les KPI mesurent les résultats, pas seulement l’activité du logiciel. Les
objectifs chiffrés seront définis après une période de référence fiable ; ils ne
sont pas inventés dans ce document.

### 7.1 Acquisition et réservation directe

| KPI                          | Définition                                                    |
| ---------------------------- | ------------------------------------------------------------- |
| Taux de réservation directe  | Réservations directes confirmées / réservations confirmées    |
| Conversion directe           | Réservations directes confirmées / parcours éligibles mesurés |
| Abandon du parcours          | Parcours commencés sans confirmation / parcours commencés     |
| Délai de décision            | Temps entre première interaction mesurable et confirmation    |
| Coût par réservation directe | Coûts attribuables / réservations directes                    |

### 7.2 Disponibilités et distribution

| KPI                       | Définition                                           |
| ------------------------- | ---------------------------------------------------- |
| Taux d’occupation         | Nuits occupées / nuits disponibles                   |
| Conflits de calendrier    | Nombre de chevauchements ou alertes confirmés        |
| Délai de synchronisation  | Temps entre événement canal et prise en compte       |
| Échecs de synchronisation | Synchronisations en échec / synchronisations tentées |
| Annulations               | Réservations annulées / réservations confirmées      |

### 7.3 Revenus

| KPI                    | Définition                                              |
| ---------------------- | ------------------------------------------------------- |
| Chiffre d’affaires     | Revenus reconnus selon la définition comptable validée  |
| ADR                    | Revenu hébergement / nuits vendues                      |
| RevPAR                 | Revenu hébergement / nuits disponibles                  |
| Panier moyen           | Revenu total des réservations / réservations confirmées |
| Revenu par maison      | Revenu attribué à chaque maison                         |
| Revenu des expériences | Revenu attribuable aux expériences et attentions        |

### 7.4 Expérience voyageur

| KPI                       | Définition                                                      |
| ------------------------- | --------------------------------------------------------------- |
| Satisfaction              | Résultat des avis et enquêtes selon une méthode constante       |
| Taux de retour            | Voyageurs ayant réservé à nouveau / voyageurs éligibles         |
| NPS                       | Promoteurs moins détracteurs, si enquête et échantillon valides |
| Temps de première réponse | Délai entre demande et premier accusé de réception utile        |
| Réclamations              | Séjours avec réclamation confirmée / séjours terminés           |
| Recommandations utiles    | Interactions positives mesurées sur le Carnet                   |

### 7.5 Excellence opérationnelle

| KPI                         | Définition                                                |
| --------------------------- | --------------------------------------------------------- |
| Tâches manuelles par séjour | Actions répétitives non automatisées nécessaires          |
| Missions ménage à l’heure   | Missions validées avant l’heure requise / missions        |
| Score qualité ménage        | Résultat de la checklist et du contrôle qualité           |
| Incidents par séjour        | Incidents confirmés / séjours                             |
| Temps moyen de résolution   | Durée entre détection et rétablissement                   |
| Maintenance récurrente      | Incidents répétés sur le même équipement ou la même cause |

### 7.6 Fiabilité et sécurité

| KPI                                  | Définition                                                |
| ------------------------------------ | --------------------------------------------------------- |
| Disponibilité des parcours critiques | Part des contrôles synthétiques réussis                   |
| Taux d’erreur critique               | Erreurs P0/P1 rapportées aux opérations concernées        |
| Paiements rapprochés                 | Paiements cohérents Stripe/base / paiements               |
| Messages délivrés                    | Messages critiques délivrés / messages critiques attendus |
| Sauvegardes réussies                 | Sauvegardes intègres / sauvegardes prévues                |
| Restauration                         | Date, résultat et durée du dernier exercice               |
| Incidents de sécurité                | Événements confirmés par gravité                          |

### 7.7 Qualité de la donnée

| KPI                   | Définition                                                    |
| --------------------- | ------------------------------------------------------------- |
| Doublons CRM          | Profils voyageurs dupliqués confirmés                         |
| Données incomplètes   | Réservations ou opérations avec champs obligatoires manquants |
| Écarts financiers     | Différences non expliquées entre sources                      |
| Contenus à revoir     | Fiches du Carnet dépassant leur date de validation            |
| Corrections manuelles | Modifications exceptionnelles nécessaires et historisées      |

### 7.8 Gouvernance des KPI

Chaque indicateur possède :

- un propriétaire ;
- une définition ;
- une source ;
- une fréquence ;
- une date de dernière vérification ;
- un seuil d’alerte ;
- une action attendue.

Un indicateur sans définition stable ne doit pas apparaître comme vérité dans un
Dashboard.

---

## 8. Feuille de route long terme

### 8.1 Logique générale

La trajectoire suit les dépendances réelles :

```text
Produire en sécurité
  → Stabiliser
  → Renforcer la relation voyageur
  → Fiabiliser distribution et revenus
  → Automatiser les opérations internes
  → Enrichir le séjour
  → Ajouter une assistance intelligente responsable
```

### 8.2 Version 1.0 — Exploitation contrôlée

#### Intention

Mettre en service le périmètre existant avec un niveau de preuve compatible avec
des réservations et paiements réels.

#### Priorités

- sauvegarde et restauration ;
- cohérence des migrations ;
- sécurité et RLS ;
- recette Stripe ;
- monitoring et alertes ;
- rollback ;
- certification Go/No-Go ;
- accompagnement des trente premiers jours.

#### Résultat attendu

Une plateforme exploitable sans risque critique ouvert et des procédures
connues en cas d’incident.

### 8.3 Version 1.1 — Relation voyageur et réservation directe

#### Intention

Améliorer la conversion directe et rendre chaque séjour plus personnel.

#### Priorités

- parcours de réservation directe ;
- CRM unifié ;
- dédoublonnage ;
- Guest Journey complet ;
- communication FR, EN et DE ;
- satisfaction, avis et fidélité ;
- personnalisation utile ;
- mesure du tunnel.

#### Dépendance

La version 1.0 doit être déclarée stable après sa période d’observation.

#### Résultat attendu

Moins de ressaisie, davantage de réservations directes et une meilleure
reconnaissance des voyageurs qui reviennent.

### 8.4 Version 1.2 — Disponibilités, distribution et revenus

#### Intention

Fiabiliser la source de vérité des calendriers et améliorer les décisions
tarifaires.

#### Priorités

- synchronisation des canaux réellement utilisés ;
- prévention des doubles réservations ;
- conflits, journaux et reprises ;
- règles tarifaires unifiées ;
- recommandations explicables ;
- ADR, RevPAR, occupation et revenu par maison ;
- rapprochements et exports utiles.

#### Dépendance

Les identités de réservation, règles de prix et événements doivent être fiables.

#### Résultat attendu

Moins de mises à jour manuelles, moins de risques de conflit et une meilleure
maîtrise du revenu.

### 8.5 Version 1.3 — Opérations internes automatisées

#### Intention

Coordonner les arrivées, départs, ménages et maintenances depuis une vue unique.

#### Priorités

- planning quotidien ;
- checklists adaptées ;
- linge, consommables et inventaires ;
- contrôle qualité ;
- maintenance, coûts et prestataires ;
- notifications et escalades ;
- interface mobile interne ;
- historique opérationnel.

#### Dépendance

Les réservations, calendriers, rôles et notifications doivent être stables.

#### Résultat attendu

Moins d’oublis, une meilleure coordination et une remise à disposition plus
sûre des maisons.

### 8.6 Version 1.4 — Carnet et conciergerie premium

#### Intention

Transformer l’information locale en une expérience personnalisée, éditable et
fiable.

#### Priorités

- CMS du Carnet ;
- recherche, favoris et carte ;
- météo, marées et saison ;
- recommandations signées ;
- itinéraires ;
- catalogue fermé d’expériences ;
- demandes spéciales ;
- gouvernance des médias et contenus ;
- expérience multilingue.

#### Dépendance

Le contexte voyageur, les sources externes et les responsabilités éditoriales
doivent être maîtrisés.

#### Résultat attendu

Une différenciation forte, des contenus faciles à maintenir et des séjours mieux
préparés.

### 8.7 Version 2.0 — Assistance intelligente responsable

#### Intention

Utiliser l’intelligence artificielle pour assister, jamais pour décider à la
place des hôtes.

#### Priorités

- assistant voyageur fondé sur le Carnet vérifié ;
- aide à la rédaction et traduction ;
- préparation personnalisée du séjour ;
- synthèse des avis et incidents ;
- détection d’anomalies ;
- recommandations explicables ;
- validation humaine ;
- sources, confiance, journalisation et arrêt d’urgence.

#### Dépendance

- choix fournisseur réévalué ;
- conformité RGPD validée ;
- données gouvernées ;
- risques de prompt injection et hallucination testés ;
- coûts, quotas et mode dégradé définis.

#### Résultat attendu

Des réponses plus rapides et une meilleure utilisation de la connaissance, sans
perte de contrôle ni dégradation de l’hospitalité.

### 8.8 Ce qui n’est pas dans la trajectoire

- multi-tenant ;
- multi-marques pour des tiers ;
- marketplace ouverte ;
- abonnements ;
- facturation SaaS ;
- portail de propriétaires indépendants ;
- onboarding d’établissements clients ;
- SDK commercial et plugins ;
- version 3.0 SaaS.

Après la version 2.0, toute nouvelle trajectoire partira des besoins observés de
l’activité Beaux Rivages.

---

## 9. Critères de réussite

Dans trois ans, Beaux Rivages est réussi si les résultats suivants sont
observables.

### 9.1 Pour les voyageurs

- la maison adaptée se comprend rapidement ;
- la réservation directe est simple et rassurante ;
- les informations arrivent au bon moment ;
- l’arrivée se déroule sans friction ;
- l’aide humaine reste accessible ;
- les recommandations sont fiables et personnelles ;
- les voyageurs parlent autant de l’accueil que de la maison ;
- une part croissante choisit de revenir.

### 9.2 Pour Stéphanie et Bruno

- une seule vue permet de comprendre la journée ;
- une réservation ne nécessite pas de ressaisies multiples ;
- paiements et contrats ne sont pas oubliés ;
- les arrivées, départs et incidents sont anticipés ;
- les alertes indiquent une action, pas seulement un événement ;
- la connaissance voyageur est retrouvée sans recherche dispersée ;
- les décisions tarifaires reposent sur des données comprises ;
- davantage de temps est consacré à l’accueil et moins à l’administration.

### 9.3 Pour les équipes

- les responsabilités sont claires ;
- les checklists correspondent au séjour ;
- les informations utiles sont disponibles sur mobile ;
- les anomalies sont signalées et suivies ;
- une mission ne peut pas être clôturée incomplète ;
- les procédures d’urgence sont connues.

### 9.4 Pour l’activité

- les disponibilités restent cohérentes ;
- aucun double paiement ou double réservation non maîtrisé ;
- les revenus et indicateurs sont réconciliés ;
- la réservation directe progresse ;
- la satisfaction et le taux de retour progressent ;
- les incidents récurrents diminuent ;
- les sauvegardes et restaurations sont démontrées ;
- l’activité peut continuer même lorsqu’un service secondaire est indisponible.

### 9.5 Pour le produit

- l’architecture reste compréhensible ;
- aucune seconde implémentation d’un même domaine ;
- les données critiques sont protégées et auditées ;
- les versions sont petites, testables et réversibles ;
- la documentation correspond à la réalité ;
- les coûts restent proportionnés à l’activité ;
- le logiciel demeure privé et centré sur Beaux Rivages.

---

## 10. Charte du produit

Cette charte guide toutes les futures décisions.

### Article 1 — Nous créons des souvenirs

Une fonctionnalité n’a de valeur que si elle améliore le séjour ou la capacité
à bien l’accueillir.

### Article 2 — Nous restons humains

La technologie prépare et soutient. Elle ne remplace ni le jugement, ni
l’écoute, ni l’attention.

### Article 3 — Nous choisissons la simplicité

Nous préférons un parcours clair à une accumulation de fonctions.

### Article 4 — Nous protégeons la confiance

Les données, paiements, contrats et accès sont traités avec discrétion et
rigueur.

### Article 5 — Nous ne promettons que le réel

Une disponibilité, une image, un prix, une expérience ou une recommandation
doit correspondre à ce qui peut réellement être délivré.

### Article 6 — Nous automatisons avec contrôle

Chaque automatisation importante est observable, reprenable et soumise à une
validation humaine lorsque son impact l’exige.

### Article 7 — Nous conservons une source de vérité

Nous ne créons pas plusieurs versions d’une réservation, d’un paiement, d’un
contrat ou d’une règle.

### Article 8 — Nous mesurons ce qui compte

Nous suivons la satisfaction, la fiabilité, le temps gagné et la qualité des
opérations, pas seulement le nombre de fonctions livrées.

### Article 9 — Nous apprenons de chaque séjour

Un avis, une demande ou un incident devient une source d’amélioration lorsqu’il
est compris, vérifié et priorisé.

### Article 10 — Nous restons Beaux Rivages

Le logiciel sert exclusivement les maisons, les voyageurs et l’activité Beaux
Rivages. Il ne devient ni SaaS, ni marketplace, ni produit commercial.

## Décision préalable à tout développement

Avant d’ouvrir une version ou une fonctionnalité, les responsables doivent
pouvoir affirmer :

> Cette évolution rend l’expérience plus juste, l’exploitation plus simple ou
> l’activité plus sûre, sans affaiblir l’hospitalité Beaux Rivages.

Si cette affirmation ne peut pas être démontrée, l’évolution n’est pas engagée.

---

## Documents complémentaires

- [ROADMAP_PRIVATE_PLATFORM.md](../ROADMAP_PRIVATE_PLATFORM.md) — détail des
  versions et dépendances ;
- [BRAND_BOOK.md](./BRAND_BOOK.md) — identité et ton de la marque ;
- [05_OPERATIONS/HospitalityPlaybook.md](./05_OPERATIONS/HospitalityPlaybook.md)
  — méthode d’hospitalité ;
- [05_OPERATIONS/BEAUX_RIVAGES_OPERATION_MANUAL.md](./05_OPERATIONS/BEAUX_RIVAGES_OPERATION_MANUAL.md)
  — exploitation quotidienne ;
- [05_OPERATIONS/OPERATIONS_PLAYBOOK_FIRST_30_DAYS.md](./05_OPERATIONS/OPERATIONS_PLAYBOOK_FIRST_30_DAYS.md)
  — trente premiers jours de production ;
- [VERSIONING.md](./VERSIONING.md) — gouvernance des versions ;
- [PRODUCT_BOOK_09_ROADMAP.md](./PRODUCT_BOOK_09_ROADMAP.md) — historique de la
  roadmap produit.

En cas de contradiction sur la direction future, le présent Product Master
Plan et la décision d’architecture « plateforme privée » priment sur les
anciennes ambitions SaaS.
