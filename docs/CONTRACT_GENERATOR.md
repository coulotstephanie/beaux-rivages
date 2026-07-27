# Générateur de contrat Beaux Rivages

## Formats

- PDF A4 multipage : `platform/contracts/pdf.ts`, généré avec `pdf-lib`.
- HTML responsive et imprimable : `platform/contracts/html.ts`.
- Clauses éditables : `platform/contracts/clauses.ts`.
- Téléchargement authentifié :
  `GET /api/documents/contract?token=…&document=…`.
- Version HTML : ajouter `&format=html`.

Le fichier PDF suit la convention
`Reservation-BEAUX-RIVAGES-AAAA-NOM.pdf`.

## Contenu

1. Couverture avec photo, maison, adresse, voyageurs, dates et référence.
2. Coordonnées du voyageur, composition du groupe et décompte financier.
3. Conditions de location configurables.
4. Engagements, coordonnées des hôtes et numéros d’urgence nationaux.
5. Annexes et zones de signatures.
6. QR codes vers le guide, le Carnet, la carte, le livret et, uniquement
   lorsqu’il est fourni dans l’accès sécurisé, le Wi-Fi.

Les codes d’accès et le Wi-Fi ne sont jamais placés dans une URL publique. Le
contrat est téléchargé au moyen du jeton signé et expirant de « Mon Séjour ».

## Cadre juridique

Le Code du tourisme impose notamment un contrat écrit indiquant le prix et un
état descriptif des lieux. Les textes de ce dépôt constituent un modèle
technique et éditorial, pas une consultation juridique.

Avant toute signature réelle, compléter et faire valider :

- l’identité, l’adresse et le statut juridique complet du loueur ;
- les numéros de déclaration ou d’enregistrement applicables ;
- l’adresse exacte de Villa Raie Manta ;
- la description réglementaire, l’inventaire et les annexes de chaque maison ;
- les conditions particulières d’annulation et de dépôt de garantie ;
- les taux officiels de taxe de séjour ;
- la politique de conservation des données ;
- les modalités du prestataire de signature électronique.

Références vérifiées le 27 juillet 2026 :

- Code du tourisme, notamment l’exigence d’écrit, de prix et d’état descriptif ;
- Service-Public.fr, règles applicables aux meublés de tourisme ;
- référentiel CNIL relatif à la gestion locative.

## Signature électronique

L’interface `ElectronicSignatureProvider` devra recevoir le PDF final, les
signataires et les emplacements de signature. Elle pourra être implémentée pour
Yousign, DocuSign ou un prestataire équivalent sans modifier le générateur.

## Contrat et carnet de bienvenue

Le contrat reste juridique et stable. Un futur `WelcomeBookGenerator` produira
un document distinct de 8 à 12 pages avec météo, marées, marchés,
recommandations et informations pratiques actualisées. Cette séparation évite
de modifier un contrat signé lorsque le contenu du séjour évolue.
