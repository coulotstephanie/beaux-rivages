# Acceptance Criteria

Version : 1.0  
Projet : Beaux Rivages  
Statut : Référentiel des validations fonctionnelles

## Convention

- `[ ]` signifie que le critère reste à démontrer.
- `[x]` signifie qu’une preuve automatisée ou une recette versionnée est liée.
- Un écran visible ne suffit pas à valider une fonctionnalité.
- Chaque checklist doit couvrir succès, erreurs, concurrence, sécurité,
  accessibilité, observabilité et reprise.

## FEATURE-0002 — Paiement

> L’identifiant `FEATURE-0002` est utilisé conformément au Feature Catalog.
> `FEATURE-0005` désigne Housekeeping et ne peut pas être réattribué.

### Parcours métier

- [x] Paiement accepté en environnement Stripe TEST.
- [x] Paiement refusé et échec fournisseur persisté.
- [x] Remboursement total traité.
- [x] Remboursement partiel plafonné au montant encaissé.
- [x] Double clic limité par la préparation serveur et l’idempotence.
- [x] Double événement webhook ignoré grâce à l’identifiant fournisseur.
- [ ] Double paiement concurrent validé par un test d’intégration en base.
- [x] Paiement expiré traité.
- [x] Erreur réseau retournée sans exposer de secret.
- [ ] Reprise après coupure éprouvée en test E2E.

### Effets de bord

- [x] Journalisation des événements fournisseur.
- [ ] Notification transactionnelle réellement livrée.
- [x] Facture reliée à la réservation dans le modèle.
- [x] Statut de réservation recalculé après paiement.
- [ ] Contrat généré ou rendu signable selon les conditions commerciales.
- [x] Dashboard capable de lire les paiements persistés.
- [x] CRM relié à la réservation payée.
- [x] Événements Analytics typés.

### Qualité et production

- [x] Signature Stripe vérifiée.
- [x] Montant recalculé côté serveur.
- [x] Entrées validées.
- [x] Tests automatisés de cycle Stripe TEST.
- [ ] Tests E2E navigateur.
- [ ] Accessibilité du parcours auditée.
- [ ] Stripe Live configuré et recette réelle approuvée.
- [ ] Monitoring et alertes de paiement opérationnels.

## US-0010 — Pack Signature

- [x] Prestations détaillées.
- [x] Sélection intégrée à la composition du séjour.
- [x] Prix inclus dans l’estimation.
- [ ] Disponibilité vérifiée en temps réel.
- [ ] Notification automatique des équipes.
- [ ] Checklist ménage adaptée automatiquement.
- [ ] Version de contrat régénérée avant signature.

## US-0025 — Arrivée autonome

- [x] Code, horaire, stationnement et assistance modélisés.
- [x] Secrets bloqués avant la date autorisée.
- [x] Message refusé si les secrets requis sont absents.
- [ ] Livraison e-mail de production vérifiée.
- [ ] Wi-Fi et guide validés pour chaque maison.

## US-0032 — Arrivée personnalisée

- [x] Demande d’arrivée personnalisée disponible dans le domaine Concierge.
- [ ] Capacité et créneau contrôlés.
- [ ] Fiche d’accueil générée.
- [ ] Stéphanie ou Bruno notifiés.
- [ ] Planning opérationnel mis à jour.

## US-0050 — Carnet Beaux Rivages

- [x] Marchés, producteurs, itinéraires, restaurants et conseils disponibles.
- [x] Recommandations par profil disponibles.
- [ ] Météo et marées reliées à un fournisseur de production.
- [ ] Fraîcheur des données affichée.
- [ ] État de repli testé en cas d’indisponibilité fournisseur.

## US-0100 — Dashboard propriétaire

- [x] Chiffre d’affaires et taux d’occupation disponibles dans les fondations.
- [x] Réservations, départs, ménage, maintenance et paiements agrégés.
- [ ] RevPAR et ADR validés par une source comptable.
- [ ] Satisfaction consolidée.
- [ ] Isolation propriétaire et tenant éprouvée.
- [ ] Définitions et périodes des KPI affichées.

## US-0200 — Assistant IA

- [ ] Réponses voyageurs évaluées.
- [ ] Itinéraires évalués et sourcés.
- [ ] Détection d’anomalies mesurée.
- [ ] Résumé des avis évalué.
- [ ] Recommandations de prix expliquées.
- [ ] Validation humaine obligatoire testée.
- [ ] Données personnelles et rétention auditées.

