# Beaux Rivages — Règles métier

Version : 1.0  
Auteur : Product Management & Engineering  
Statut : document de référence

## 1. Objet

Ce document définit les règles métier communes au site, au moteur de réservation, au Guest Journey, au CRM, au Back Office, au Channel Manager, au Yield Management, au Concierge et aux opérations.

Il complète la [Vision produit](PRODUCT_BOOK_01_VISION.md) et la [Spécification UX](PRODUCT_BOOK_02_UX.md). Il ne remplace ni les conditions générales de vente, ni le contrat de location, ni les obligations légales.

## 2. Statuts et autorité

Chaque règle porte un statut :

- **ACTIVE** : comportement actuellement imposé par le logiciel ;
- **CONFIG** : règle active dont la valeur provient de la configuration ou de Supabase ;
- **À VALIDER** : décision commerciale, comptable ou juridique requise avant mise en production ;
- **CIBLE** : comportement attendu, pas encore garanti par tous les modules.

Ordre de priorité en cas de contradiction :

1. droit applicable et contrat accepté ;
2. politique commerciale validée ;
3. configuration active en base de données ;
4. présent Product Book ;
5. texte d’interface.

Les montants et durées cités sont un instantané de configuration, pas des constantes de marque. Supabase devient la source d’exécution dès qu’une valeur y est publiée. Toute modification d’une règle sensible est versionnée, datée et auditée.

## 3. Principes transverses

| Identifiant | Statut | Règle |
|---|---|---|
| GEN-001 | ACTIVE | Le serveur recalcule prix, remises, montants dus et droits d’accès. Une valeur envoyée par le navigateur n’est jamais considérée comme fiable. |
| GEN-002 | CIBLE | Une donnée métier possède une source de vérité unique et un propriétaire clairement identifié. |
| GEN-003 | CIBLE | Toute action financière, contractuelle, de synchronisation ou de changement de statut est horodatée et attribuée. |
| GEN-004 | CIBLE | Les commandes susceptibles d’être rejouées sont idempotentes. Un réessai ne crée ni doublon de réservation, ni double paiement. |
| GEN-005 | ACTIVE | Les entrées sont validées par des schémas typés avant traitement. |
| GEN-006 | CIBLE | Un changement de configuration ne modifie pas rétroactivement un devis ou un contrat déjà accepté. |
| GEN-007 | CIBLE | Les dates et heures sont stockées sans ambiguïté et présentées dans le fuseau de la maison. |
| GEN-008 | CIBLE | Le français, l’anglais et l’allemand partagent les mêmes règles ; seule leur présentation est traduite. |

## 4. Maisons, capacité et occupation

| Identifiant | Statut | Règle |
|---|---|---|
| HOU-001 | CONFIG | Les maisons commercialisées sont Le Chai des Tortues, Villa Raie Manta et Le Nid d’Été. |
| HOU-002 | CONFIG | La capacité maximale, le nombre de chambres, les équipements et l’acceptation des animaux sont définis par maison. |
| HOU-003 | ACTIVE | Une réservation dépassant la capacité autorisée est refusée avant paiement. |
| HOU-004 | ACTIVE | Les adultes, enfants, bébés et animaux sont comptabilisés séparément. |
| HOU-005 | À VALIDER | Définir si les bébés comptent dans la capacité réglementaire et commerciale de chaque maison. |
| HOU-006 | CIBLE | Une indisponibilité d’équipement essentiel peut fermer une maison ou réduire sa capacité pour une période donnée. |
| HOU-007 | CIBLE | Les informations contractuelles figées à la réservation conservent la capacité et les équipements promis à cette date. |

## 5. Disponibilité et calendrier

| Identifiant | Statut | Règle |
|---|---|---|
| AVL-001 | ACTIVE | Deux occupations bloquantes ne peuvent pas se chevaucher pour une même maison. |
| AVL-002 | ACTIVE | La disponibilité est vérifiée lors du devis puis à nouveau immédiatement avant la création de la réservation. |
| AVL-003 | CIBLE | Une réservation, un blocage propriétaire ou une maintenance bloquante ferme les nuits concernées sur tous les canaux. |
| AVL-004 | CIBLE | Le ménage est visible au calendrier, mais ne bloque une nuit que si son créneau rend l’arrivée impossible. |
| AVL-005 | CIBLE | Une option temporaire possède une date d’expiration. À expiration, les dates sont libérées automatiquement si aucun paiement ou accord ne la confirme. |
| AVL-006 | ACTIVE | Un conflit importé est signalé et ne doit jamais être résolu silencieusement. |
| AVL-007 | CIBLE | Toute modification de dates déclenche une nouvelle validation de disponibilité, de prix et de durée minimale. |

## 6. Réservation

### 6.1 Cycle de vie

Le cycle cible est :

`brouillon → option → en attente de paiement → confirmée → en séjour → terminée`

Des sorties contrôlées permettent `annulée`, `expirée` ou `refusée`.

| Identifiant | Statut | Règle |
|---|---|---|
| RES-001 | CIBLE | Seule une réservation confirmée garantit définitivement le séjour, sauf disposition contractuelle différente. |
| RES-002 | ACTIVE | Une référence unique identifie chaque réservation. |
| RES-003 | ACTIVE | La date de départ doit être postérieure à la date d’arrivée. |
| RES-004 | CONFIG | Les durées minimale et maximale dépendent de la maison, des dates et du canal. |
| RES-005 | CONFIG | La durée maximale standard actuellement configurée est de 28 nuits. |
| RES-006 | ACTIVE | La réservation conserve le canal d’origine : direct, Airbnb, Booking.com, Abritel/Vrbo ou autre connecteur. |
| RES-007 | CIBLE | Le nombre de voyageurs, les coordonnées, les horaires, les demandes et les commentaires utiles sont rattachés à la réservation. |
| RES-008 | CIBLE | Une modification substantielle après confirmation produit une nouvelle version du récapitulatif et, si nécessaire, du contrat. |
| RES-009 | CIBLE | Une annulation ne supprime jamais la réservation ni son historique. |
| RES-010 | À VALIDER | Définir le délai d’expiration des options et réservations non payées. |

### 6.2 Création automatique

| Identifiant | Statut | Règle |
|---|---|---|
| RES-011 | CIBLE | Une réservation confirmée crée ou rapproche le voyageur CRM, le dossier de paiement, le parcours de messages et la checklist opérationnelle. |
| RES-012 | CIBLE | Les créations automatiques utilisent la référence de réservation comme clé d’idempotence. |
| RES-013 | CIBLE | Un échec partiel est visible et rejouable sans recréer les éléments déjà produits. |

## 7. Prix et devis

### 7.1 Composition

Le total affiché peut comprendre :

`nuits + ménage + expériences et services + taxes − remises`

La caution est présentée séparément lorsqu’elle n’est pas encaissée comme revenu.

| Identifiant | Statut | Règle |
|---|---|---|
| PRI-001 | ACTIVE | Le prix des nuits dépend de la maison, des dates et des règles tarifaires applicables. |
| PRI-002 | CONFIG | Le week-end peut avoir un tarif distinct des nuits de semaine. |
| PRI-003 | CONFIG | Les frais de ménage sont définis par maison et ajoutés une fois par séjour. |
| PRI-004 | CONFIG | Les règles saisonnières peuvent modifier prix et durée minimale. La règle la plus spécifique et prioritaire s’applique. |
| PRI-005 | ACTIVE | Le devis détaille les composantes du total et la devise. |
| PRI-006 | CIBLE | Le prix accepté est figé dans la réservation ; les changements tarifaires ultérieurs ne le recalculent pas automatiquement. |
| PRI-007 | CIBLE | Une modification demandée après confirmation génère un delta explicite avant acceptation. |
| PRI-008 | À VALIDER | Activer et paramétrer la taxe de séjour selon la commune, la catégorie, l’âge, le canal et les exonérations applicables. |
| PRI-009 | À VALIDER | Valider le régime de TVA et les mentions obligatoires avec le conseil comptable. |

### 7.2 Configuration tarifaire initiale

Instantané indicatif de la configuration actuelle :

| Maison | Nuit semaine | Nuit week-end | Ménage | Caution |
|---|---:|---:|---:|---:|
| Le Chai des Tortues | 245 € | 270 € | 95 € | 800 € |
| Villa Raie Manta | 365 € | 395 € | 130 € | 1 200 € |
| Le Nid d’Été | 225 € | 250 € | 90 € | 800 € |

Saisons actuellement préparées :

- mi-saison, d’avril à juin : minimum 3 nuits ;
- haute saison, juillet et août : minimum 7 nuits ;
- basse saison, de septembre à mars : minimum 2 nuits ;
- règle standard et week-end : minimum 2 nuits.

Ces valeurs doivent être lues depuis la configuration active et peuvent évoluer sans révision du présent document.

## 8. Promotions, fidélité et cartes cadeaux

| Identifiant | Statut | Règle |
|---|---|---|
| PRO-001 | ACTIVE | Un code promotionnel est contrôlé côté serveur : état, dates, périmètre, conditions et plafond d’utilisation. |
| PRO-002 | CONFIG | Une remise long séjour de 8 % à partir de 7 nuits est actuellement activée. |
| PRO-003 | CONFIG | Une remise réservation anticipée de 5 % à 120 jours existe mais est actuellement désactivée. |
| PRO-004 | À VALIDER | Définir les règles de cumul entre promotion, fidélité, parrainage, carte cadeau et ajustement manuel. |
| PRO-005 | CIBLE | Une remise appliquée est enregistrée avec sa règle, sa valeur et son motif. |
| PRO-006 | CIBLE | Une carte cadeau possède un identifiant unique, une valeur initiale, un solde, une devise, une échéance légale et un historique. |
| PRO-007 | CIBLE | Un avoir ou une carte cadeau ne peut produire un total payé négatif. |
| PRO-008 | À VALIDER | Valider durée de validité, remboursement, cessibilité et traitement comptable des cartes cadeaux. |

### Programme de fidélité configuré

| Niveau | Critères cumulatifs configurés | Avantages préparés |
|---|---|---|
| Découverte | niveau initial | accueil standard |
| Insulaire | au moins 2 séjours et 1 500 € | priorité et départ tardif selon disponibilité |
| Grand Large | au moins 4 séjours et 4 000 € | 5 % et arrivée anticipée selon disponibilité |
| Ambassadeur | au moins 7 séjours et 8 000 € | 10 %, Pack Signature selon conditions et priorité |

| Identifiant | Statut | Règle |
|---|---|---|
| LOY-001 | CONFIG | Le niveau découle des séjours éligibles et du chiffre d’affaires éligible, pas d’une saisie libre. |
| LOY-002 | CIBLE | Une annulation ou un remboursement ajuste les métriques de fidélité. |
| LOY-003 | À VALIDER | Définir les séjours et montants éligibles, la durée des statuts et les exclusions de cumul. |
| LOY-004 | CONFIG | Les avantages soumis à disponibilité ne constituent jamais une garantie avant validation. |

## 9. Paiements, acompte, solde et remboursements

| Identifiant | Statut | Règle |
|---|---|---|
| PAY-001 | ACTIVE | Les paiements distinguent acompte, solde, paiement intégral et remboursement. |
| PAY-002 | ACTIVE | Le montant demandé est recalculé côté serveur à partir de la réservation. |
| PAY-003 | ACTIVE | Pour une réservation ventilée, acompte et solde doivent égaler le total dû. |
| PAY-004 | CIBLE | Un paiement réussi possède une référence fournisseur unique et ne peut être crédité deux fois. |
| PAY-005 | CIBLE | La réservation n’est confirmée qu’après le signal fiable du fournisseur de paiement ou une validation manuelle autorisée. |
| PAY-006 | CIBLE | Un paiement échoué conserve la réservation dans un état récupérable pendant la période d’option. |
| PAY-007 | CIBLE | Tout remboursement est rattaché au paiement d’origine, motivé et journalisé. |
| PAY-008 | CIBLE | Le solde restant est toujours calculé à partir du total contractuel moins les paiements validés et remboursements. |
| PAY-009 | À VALIDER | Harmoniser la politique d’acompte. Le Back Office prépare actuellement 30 %, mais cette valeur n’est pas encore une règle commerciale universelle. |
| PAY-010 | À VALIDER | Définir l’échéance du solde et le traitement des réservations proches de l’arrivée. |
| PAY-011 | À VALIDER | Définir les moyens de paiement, frais éventuels, échéanciers et règles de relance. |
| PAY-012 | CIBLE | Une facture ou un reçu est généré selon le fait générateur comptable validé. |

## 10. Caution

| Identifiant | Statut | Règle |
|---|---|---|
| DEP-001 | CONFIG | La caution est définie par maison et affichée séparément du prix du séjour. |
| DEP-002 | ACTIVE | Son cycle distingue au minimum : en attente, autorisée, capturée, libérée, expirée ou échouée. |
| DEP-003 | CIBLE | Une retenue totale ou partielle exige montant, motif, preuves, auteur et date. |
| DEP-004 | CIBLE | La libération ou capture ne peut être effectuée que par un rôle autorisé. |
| DEP-005 | À VALIDER | Définir le moment de l’autorisation, la durée, le délai de libération et la procédure contradictoire en cas de dommage. |

## 11. Annulation et modification

| Identifiant | Statut | Règle |
|---|---|---|
| CAN-001 | ACTIVE | Le motif d’annulation et son origine sont conservés. |
| CAN-002 | CIBLE | Le montant remboursable est calculé selon le contrat, le canal, la date de demande et les sommes encaissées. |
| CAN-003 | CIBLE | Une annulation libère les dates seulement après validation de son état final. |
| CAN-004 | CIBLE | Les messages, tâches et prestations futures devenus inutiles sont annulés ou replanifiés. |
| CAN-005 | À VALIDER | Établir les barèmes d’annulation directe, cas de force majeure, non-présentation et interruption de séjour. |
| CAN-006 | À VALIDER | Définir les frais et conditions des changements de dates, de maison ou de titulaire. |
| CAN-007 | CIBLE | Pour une réservation de plateforme, la politique du canal prévaut lorsque le contrat l’impose. |

## 12. Expériences et attentions

Le catalogue courant comprend notamment Pack Signature, Pack Romance, paniers gourmands, linge, serviettes de plage, peignoirs, chaussons, arrivée personnalisée, arrivée anticipée, départ tardif, accueil animal, famille, vélos et expériences partenaires.

| Identifiant | Statut | Règle |
|---|---|---|
| OPT-001 | CONFIG | Chaque offre définit un prix, une unité de facturation, une disponibilité, une maison éligible et, si utile, une quantité maximale. |
| OPT-002 | ACTIVE | Une prestation peut être facturée par séjour, par personne ou par unité. |
| OPT-003 | CIBLE | Les prestations « sur demande » n’entraînent un débit définitif qu’après validation. |
| OPT-004 | ACTIVE | Le panier affiché côté client est recalculé côté serveur avant confirmation. |
| OPT-005 | CIBLE | Ajouter une prestation après la réservation met à jour total, paiement, facture et tâches opérationnelles de façon cohérente. |
| OPT-006 | CIBLE | Une prestation refusée ou indisponible est retirée du montant dû ou remboursée si elle était encaissée. |
| OPT-007 | CIBLE | Une prestation partenaire conserve fournisseur, conditions, commission, capacité et statut de confirmation. |
| OPT-008 | À VALIDER | Définir délais de commande, d’annulation et de remboursement pour chaque famille d’expérience. |
| OPT-009 | À VALIDER | Valider les conditions de vente et de remise d’alcool, notamment pour champagne et paniers. |

### Tarifs catalogue actuellement préparés

| Offre | Tarif | Unité/condition principale |
|---|---:|---|
| Pack Signature | 145 € | par séjour ; 165 € à la Villa |
| Linge complet | 20 € | par voyageur |
| Serviette de plage | 8 € | par voyageur |
| Deux peignoirs | 24 € | par séjour |
| Chaussons | 12 € | selon quantité configurée |
| Arrivée personnalisée | 35 € | par séjour |
| Départ tardif | 55 € | 65 € à la Villa, selon disponibilité |
| Accueil animal | 25 € | par séjour |
| Panier apéritif | 52 € | par panier |
| Panier gourmand | 48 € | par panier |
| Pack Romance | 75 € | Villa Raie Manta |
| Anniversaire | 85 € | selon disponibilité |
| Lune de miel | 110 € | Chai des Tortues |
| Fruits de mer | 95 € | selon disponibilité |
| Vélo | 60 € | selon unité et partenaire à valider |
| Famille | 45 € | par séjour |

Le contenu contractuel et le prix publié dans le catalogue actif prévalent sur cet instantané.

## 13. Linge

| Identifiant | Statut | Règle |
|---|---|---|
| LIN-001 | CONFIG | Le linge peut être inclus dans un pack ou commandé séparément selon la maison et l’offre. |
| LIN-002 | ACTIVE | Une ligne facturée par voyageur utilise le nombre de voyageurs éligibles déclaré pour le séjour. |
| LIN-003 | À VALIDER | Définir si enfants et bébés sont facturés, et quelles pièces composent exactement un lot. |
| LIN-004 | CIBLE | Toute commande alimente automatiquement les quantités de la checklist ménage et du stock. |
| LIN-005 | CIBLE | Les remplacements en cours de séjour sont distingués du lot initial et peuvent suivre un tarif différent. |
| LIN-006 | À VALIDER | Valider les règles de linge inclus, renouvellement, perte et détérioration pour chaque maison. |

## 14. Animaux

| Identifiant | Statut | Règle |
|---|---|---|
| PET-001 | ACTIVE | Un animal ne peut être ajouté que si la maison l’accepte. |
| PET-002 | ACTIVE | Le nombre d’animaux est enregistré séparément du nombre de voyageurs. |
| PET-003 | CONFIG | L’accueil animal actuellement préparé est facturé 25 € par séjour. |
| PET-004 | CIBLE | L’accueil peut comprendre des gamelles et des recommandations de balades et plages autorisées. |
| PET-005 | CONFIG | Au Nid d’Été, les chiens doivent être tenus en laisse dans les parties communes selon les informations voyageurs actuelles. |
| PET-006 | CIBLE | Le voyageur reçoit avant l’arrivée les règles propres à la maison et à la destination. |
| PET-007 | À VALIDER | Définir espèces admises, nombre maximal, poids éventuel, justificatifs, zones interdites et cas d’animaux d’assistance. |
| PET-008 | À VALIDER | Confirmer si l’animal apporte son couchage et définir la responsabilité en cas de dommage ou nettoyage renforcé. |

## 15. Enfants et bébés

| Identifiant | Statut | Règle |
|---|---|---|
| FAM-001 | ACTIVE | Enfants et bébés sont déclarés séparément. |
| FAM-002 | CIBLE | Un besoin bébé déclenche la proposition des équipements compatibles avec la maison. |
| FAM-003 | CONFIG | Les équipements, jeux, livres et jouets disponibles sont gérés comme inventaire par maison. |
| FAM-004 | À VALIDER | Définir les tranches d’âge utilisées pour bébé et enfant. |
| FAM-005 | À VALIDER | Définir les équipements inclus, payants, soumis à quantité et nécessitant une décharge ou une notice. |
| FAM-006 | CIBLE | Aucun équipement ne doit être promis avant confirmation de sa disponibilité. |

## 16. Arrivée, séjour et départ

| Identifiant | Statut | Règle |
|---|---|---|
| STY-001 | CONFIG | Les heures standard d’arrivée et de départ sont définies par maison ou réservation. |
| STY-002 | CONFIG | Arrivée anticipée et départ tardif restent soumis à disponibilité opérationnelle. |
| STY-003 | CIBLE | Les codes d’accès ne sont transmis qu’au voyageur vérifié, au moment défini et si les prérequis sont satisfaits. |
| STY-004 | CIBLE | Les demandes particulières sont visibles par les seules personnes qui en ont besoin. |
| STY-005 | CIBLE | Un incident pendant le séjour est rattaché à la réservation, priorisé, assigné et historisé. |
| STY-006 | CIBLE | Le départ déclenche contrôle, ménage, traitement de caution, remerciement et demande d’avis selon leur éligibilité. |
| STY-007 | À VALIDER | Fixer les heures standard, tolérances, suppléments et conditions par maison. |

## 17. Contrats, factures et documents

| Identifiant | Statut | Règle |
|---|---|---|
| DOC-001 | CIBLE | Le contrat reprend l’identité des parties, maison, dates, occupants, prix, paiements, caution, conditions et version des règles acceptées. |
| DOC-002 | CIBLE | Une acceptation est horodatée avec la version du document et la preuve disponible. |
| DOC-003 | CIBLE | Une modification contractuelle produit un avenant ou une nouvelle version sans écraser l’ancienne. |
| DOC-004 | CIBLE | Factures, avoirs et remboursements forment une séquence comptable traçable. |
| DOC-005 | À VALIDER | Faire valider CGV, contrat, politique de confidentialité, mentions fiscales et processus de signature. |
| DOC-006 | CIBLE | Le PDF « Votre séjour Beaux Rivages » peut inclure un QR Code, sans exposer directement un secret permanent. |

## 18. CRM, identité et consentements

| Identifiant | Statut | Règle |
|---|---|---|
| CRM-001 | CIBLE | Un voyageur est rapproché avec prudence à partir d’identifiants vérifiés ; l’homonymie seule ne suffit pas. |
| CRM-002 | CIBLE | L’historique utile peut inclure séjours, préférences, animaux, expériences et retours. |
| CRM-003 | CIBLE | Une préférence opérationnelle n’est pas automatiquement un consentement marketing. |
| CRM-004 | CIBLE | Les consentements enregistrent finalité, source, date, preuve et retrait. |
| CRM-005 | CIBLE | Le désabonnement marketing n’interrompt pas les communications nécessaires au contrat. |
| CRM-006 | À VALIDER | Définir durées de conservation, procédure d’accès, rectification, opposition, portabilité et suppression. |
| CRM-007 | CIBLE | Les données sensibles ou libres sont minimisées et leur accès limité par rôle. |

## 19. Guest Journey et notifications

| Identifiant | Statut | Règle |
|---|---|---|
| MSG-001 | CIBLE | Les messages couvrent réservation, préparation, arrivée, séjour, départ, remerciement, avis et fidélisation. |
| MSG-002 | CIBLE | Le contenu dépend de la langue, du canal, de la maison, des dates et des informations réellement confirmées. |
| MSG-003 | CIBLE | Chaque envoi possède un statut, une date prévue, une date effective, un destinataire et un historique. |
| MSG-004 | CIBLE | Une annulation ou modification replanifie les messages devenus inexacts. |
| MSG-005 | CIBLE | Un message transactionnel échoué génère une alerte et peut être rejoué sans envoi multiple non maîtrisé. |
| MSG-006 | CIBLE | Les recommandations météo ou saisonnières sont présentées comme conseils et datées. |
| MSG-007 | CIBLE | Codes d’accès, liens de paiement et documents privés utilisent des liens temporaires ou un espace authentifié. |
| MSG-008 | À VALIDER | Définir les horaires d’envoi, délais de chaque étape et règles de secours par canal. |

## 20. Concierge et recommandations

| Identifiant | Statut | Règle |
|---|---|---|
| CON-001 | CONFIG | Les recommandations peuvent utiliser groupe, intérêts, durée, maison, saison, météo, vent et marées. |
| CON-002 | CIBLE | Une recommandation explique son adéquation sans prétendre à une disponibilité non vérifiée. |
| CON-003 | CIBLE | Les données météo et marées affichent source et heure de mise à jour. |
| CON-004 | CIBLE | Une donnée externe indisponible produit un état explicite et des recommandations de repli sûres. |
| CON-005 | CIBLE | Les règles de sécurité et fermetures officielles priment sur la recommandation automatique. |
| CON-006 | CIBLE | Le voyageur peut modifier ses préférences et retirer ses favoris. |
| CON-007 | CIBLE | Une recommandation IA n’engage jamais une dépense ou réservation sans confirmation explicite. |

## 21. Housekeeping et maintenance

| Identifiant | Statut | Règle |
|---|---|---|
| OPS-001 | CIBLE | Une réservation confirmée génère les tâches nécessaires selon la maison, les voyageurs et les prestations. |
| OPS-002 | CIBLE | Une checklist est versionnée ; les preuves et commentaires restent liés à son exécution. |
| OPS-003 | CIBLE | Une tâche critique non terminée avant arrivée déclenche une alerte. |
| OPS-004 | CIBLE | Un incident possède priorité, responsable, échéance, photos éventuelles et historique. |
| OPS-005 | CIBLE | Une maintenance bloquante ferme immédiatement les dates concernées. |
| OPS-006 | CIBLE | Les photos d’intervention sont privées et soumises aux règles de conservation. |
| OPS-007 | CIBLE | La consommation de linge, produits et attentions peut mettre à jour l’inventaire. |

## 22. Channel Manager

| Identifiant | Statut | Règle |
|---|---|---|
| CHN-001 | CIBLE | Beaux Rivages est la source de vérité interne ; chaque plateforme reste autoritative pour les événements qu’elle émet. |
| CHN-002 | CIBLE | Chaque annonce externe est explicitement associée à une maison interne. |
| CHN-003 | CIBLE | Une réservation importée conserve identifiant externe, canal, payload utile et dates de synchronisation. |
| CHN-004 | CIBLE | Toute création directe bloque immédiatement les dates sur les canaux connectés. |
| CHN-005 | CIBLE | Les synchronisations sont journalisées, rejouables et idempotentes. |
| CHN-006 | ACTIVE | Un conflit de dates est bloqué ou placé en alerte ; il n’est jamais écrasé automatiquement. |
| CHN-007 | CIBLE | Annulation, modification, frais et statut sont rapprochés sans perdre l’état précédent. |
| CHN-008 | À VALIDER | Définir pour chaque canal quelles données et quels tarifs peuvent réellement être lus ou écrits selon l’API et le contrat partenaire. |

## 23. Yield Management

| Identifiant | Statut | Règle |
|---|---|---|
| YLD-001 | CIBLE | Le moteur peut analyser saison, occupation, événements, délai, durée et demande. |
| YLD-002 | CIBLE | Une recommandation indique prix actuel, prix proposé, motif, confiance et impact estimé. |
| YLD-003 | CIBLE | Tant que l’automatisation n’est pas explicitement autorisée, Stéphanie accepte ou refuse chaque proposition. |
| YLD-004 | CIBLE | Les planchers, plafonds et durées minimales configurés ne peuvent être franchis par une recommandation. |
| YLD-005 | CIBLE | Une publication tarifaire est auditée et son résultat est vérifié par canal. |
| YLD-006 | À VALIDER | Définir les planchers, plafonds, événements, règles de parité et niveau d’automatisation par maison. |

## 24. Avis et fidélisation

| Identifiant | Statut | Règle |
|---|---|---|
| REV-001 | CIBLE | Une demande d’avis n’est envoyée qu’après un séjour éligible et une seule fois par campagne. |
| REV-002 | CIBLE | Les avis importés conservent leur plateforme, note, date et lien avec la réservation lorsque possible. |
| REV-003 | CIBLE | Une réponse assistée par IA exige validation humaine avant publication. |
| REV-004 | CIBLE | Aucun avantage n’est conditionné à un avis positif. |
| REV-005 | À VALIDER | Définir délai de sollicitation, plateformes prioritaires et politique de modération/réponse. |

## 25. Sécurité, rôles et audit

| Identifiant | Statut | Règle |
|---|---|---|
| SEC-001 | CIBLE | L’accès suit le moindre privilège : voyageur, exploitation, maintenance, direction et administrateur n’ont pas les mêmes droits. |
| SEC-002 | ACTIVE | Les données Supabase sensibles sont protégées par authentification et politiques RLS adaptées. |
| SEC-003 | CIBLE | Les actions critiques exigent une confirmation et peuvent nécessiter une authentification renforcée. |
| SEC-004 | CIBLE | Secrets de plateforme et clés de paiement ne sont jamais exposés au client ni consignés en clair. |
| SEC-005 | CIBLE | Les journaux contiennent le contexte utile sans mots de passe, données bancaires ou secrets d’accès. |
| SEC-006 | CIBLE | Les tentatives abusives sont limitées et les comportements anormaux alertés. |
| SEC-007 | CIBLE | La restauration ou compensation d’une action destructive est documentée lorsqu’elle est possible. |

## 26. Règles de décision et exceptions

Une exception métier :

1. possède un motif ;
2. est accordée par un rôle autorisé ;
3. indique son impact financier et opérationnel ;
4. ne modifie pas la règle générale ;
5. reste visible dans l’audit.

| Identifiant | Statut | Règle |
|---|---|---|
| EXC-001 | CIBLE | Une remise manuelle requiert motif, auteur et montant avant/après. |
| EXC-002 | CIBLE | Un surclassement, geste commercial ou prestation offerte reste valorisé dans le dossier. |
| EXC-003 | CIBLE | Une correction de donnée externe ne supprime jamais le payload ou l’événement d’origine. |
| EXC-004 | CIBLE | Les rôles et seuils d’autorisation sont configurables. |

## 27. Registre des décisions ouvertes

Les décisions suivantes bloquent une qualification complète « production » :

1. politique d’acompte et échéance du solde ;
2. conditions d’annulation, modification et remboursement ;
3. fonctionnement, capture et libération de la caution ;
4. taxe de séjour, TVA et règles de facturation ;
5. heures standard d’arrivée et de départ ;
6. capacité exacte incluant ou non les bébés ;
7. politique animaux par maison ;
8. contenu, renouvellement et tarification du linge ;
9. cumul des promotions, avantages fidélité et cartes cadeaux ;
10. délais de commande et d’annulation des expériences ;
11. conformité de la vente ou remise d’alcool ;
12. conservation des données et procédures RGPD ;
13. responsabilités et capacités réelles de chaque connecteur de plateforme ;
14. planchers, plafonds et autonomie du Yield Management.

Chaque décision validée doit préciser propriétaire, date d’effet, version, canaux concernés et éventuelle migration des réservations existantes.

## 28. Critères d’acceptation d’une règle

Une règle devient **ACTIVE** lorsque :

- sa formulation et son propriétaire métier sont validés ;
- ses cas nominaux, limites et exceptions sont documentés ;
- sa configuration et ses droits sont définis ;
- son implémentation serveur est testée ;
- son interface est accessible et explicite ;
- ses événements d’audit sont vérifiés ;
- sa migration est réversible ou accompagnée d’un plan de compensation ;
- les documents contractuels et traductions concernés sont alignés.

Toute évolution met à jour ce document, les tests associés, `CHANGELOG.md` et, selon l’impact, `ARCHITECTURE.md`, `API.md` et `DATABASE.md`.
