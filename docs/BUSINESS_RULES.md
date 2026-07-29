# Business Rules

Version : 1.0  
Projet : Beaux Rivages  
Statut : Source unique de vérité des règles métier

Aucun développement ne doit implémenter une règle différente. Lorsqu’un écart
existe dans le logiciel, il est tracé puis corrigé par une migration compatible
et testée.

## 1. Réservation

Une réservation possède toujours un état.

```text
Draft
  ↓
Pending Payment
  ↓
Confirmed
  ↓
Checked-in
  ↓
Checked-out
  ↓
Completed
```

États terminaux alternatifs : `Cancelled` ou `Expired`.

Transitions interdites :

- `Completed → Confirmed` ;
- `Cancelled → Checked-in` ;
- `Expired → Confirmed`.

Toute autre transition doit être explicitement autorisée par la machine à états
du domaine.

## 2. Paiement

États reconnus :

```text
Pending → Authorized → Paid
                  ├──→ Refunded
                  ├──→ Failed
                  └──→ Expired
```

Un contrat ne peut être signé que si le paiement demandé est validé, sauf
conditions commerciales explicitement configurées et historisées.

## 3. Contrats

Un contrat est généré automatiquement. Il est figé après signature. Toute
modification crée une nouvelle version ; aucune modification directe d’une
version signée n’est autorisée.

## 4. Logements

Un logement n’est jamais supprimé. Il est archivé si nécessaire et son
historique est conservé.

## 5. Disponibilité

Deux réservations ne peuvent jamais se chevaucher pour un même logement.

La validation est réalisée :

- côté client pour guider le voyageur ;
- côté serveur comme contrôle d’autorité ;
- en base de données comme protection finale contre la concurrence.

## 6. Tarification

```text
prix des nuits
+ frais de ménage
+ taxe de séjour
+ options
+ packs
- réductions
= prix total
```

Le calcul, ses paramètres, ses lignes, sa devise et son horodatage sont
conservés.

Dans l’interface voyageur, les options sont présentées comme des expériences ou
des attentions conformément au Brand Book. Le terme `option` peut rester un
concept métier interne stable.

## 7. Options

Chaque option possède :

- un prix ;
- une TVA ;
- une période de validité ;
- des conditions ;
- des règles de compatibilité.

Exemples : Pack Signature, linge, accueil des animaux, arrivée anticipée,
départ tardif et Pack Romance.

## 8. Animaux

Le supplément est appliqué par animal. Les propriétés compatibles sont
configurables. Les règles d’accueil sont automatiquement ajoutées au Guest
Journey.

## 9. Linge

Le pack linge est une option métier. Selon la propriété et la réservation, le
système adapte automatiquement :

- les messages ;
- les checklists ménage ;
- les contrôles de départ.

## 10. CRM

Chaque voyageur possède un identifiant unique. Les doublons sont détectés
automatiquement, les préférences sont conservées et les séjours successifs
enrichissent la même fiche.

## 11. Housekeeping

Une mission ménage est créée automatiquement après le départ. Elle ne peut être
clôturée qu’après validation de la checklist et des éventuelles photos de
contrôle requises.

## 12. Maintenance

Chaque incident génère un ticket. Les priorités sont :

- Critique ;
- Haute ;
- Normale ;
- Faible.

Les logements peuvent être bloqués selon la gravité.

## 13. Fidélité

Le système conserve :

- le nombre de séjours ;
- les nuits réservées ;
- le montant cumulé ;
- la dernière visite ;
- les préférences.

Les avantages sont calculés automatiquement selon les règles versionnées en
vigueur.

## 14. Historique

Aucune donnée métier critique n’est supprimée. Les suppressions sont logiques
quand elles sont nécessaires et toutes les modifications importantes sont
historisées.

## 15. Audit

Sont notamment tracés :

- la création, la modification et l’annulation d’une réservation ;
- le paiement et le remboursement ;
- la signature d’un contrat ;
- le changement de prix ;
- la suppression logique ;
- le changement de rôle.

Chaque entrée d’audit contient :

- l’utilisateur ;
- la date ;
- l’adresse IP, si elle est applicable et licitement collectée ;
- l’ancienne valeur ;
- la nouvelle valeur.

Elle comporte également l’action et la ressource concernées afin de rester
exploitable.

## 16. Principe fondamental

La règle métier prime toujours sur la technique.

Si une implémentation technique entre en conflit avec une règle métier validée,
l’implémentation doit être adaptée, jamais l’inverse.

