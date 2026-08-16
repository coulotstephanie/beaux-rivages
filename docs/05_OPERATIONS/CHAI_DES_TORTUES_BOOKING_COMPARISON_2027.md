# Comparaison tarifaire 2027 — Le Chai des Tortues

## Périmètre et sources

- Référence Beaux Rivages : grille Airbnb annuelle validée dans les quatre captures du 16 août 2026.
- Source Booking : export annuel local de l'établissement `14072488`, analysé hors ligne et sans appel à Booking.com.
- L'analyse est strictement informative : aucune valeur Booking n'alimente le moteur public et aucune écriture externe n'a été effectuée.

## Méthode

Les prix journaliers visibles de la ligne Booking ont été rapprochés des dates Airbnb lorsque le PDF permettait d'associer sans ambiguïté une date, un prix et un état. Les réservations ou barres d'indisponibilité qui masquent une valeur ne sont pas extrapolées. Le PDF ne donne pas, pour chaque journée, un total voyageur normalisé comprenant de façon certaine ménage, taxe, remises Genius et conditions d'annulation : ces cas restent donc **non normalisables**.

## Résultat

La grille Booking n'est pas identique à la grille Airbnb : le document montre notamment de nombreuses valeurs arrondies (100 €, 125 €, 150 €, 175 €, 200 € et 250 €) alors que la référence Airbnb comporte des montants journaliers distincts. Ces écarts commerciaux ne sont pas corrigés dans cette mission.

| Période Airbnb 2027 | Tarif Airbnb/Beaux Rivages | Constat Booking | Décision |
| --- | ---: | --- | --- |
| 1er janvier | 247 € | comparaison du total non normalisable | conserver Airbnb sur Beaux Rivages |
| 5 au 8 mai | 342 € | grille Booking distincte | aucun changement Booking |
| 28 au 30 juin | 272 € | grille Booking distincte | aucun changement Booking |
| 1er au 13 août | 467 € | grille Booking distincte | aucun changement Booking |
| 17 au 31 décembre | 325 € | grille Booking distincte | aucun changement Booking |

## Limites

- Certaines dates du PDF sont couvertes par des réservations ou fermetures et leur prix n'est pas lisible.
- Le document ne permet pas d'isoler systématiquement le ménage, la taxe de séjour, les promotions et le caractère remboursable.
- Aucun écart de total voyageur n'est calculé lorsqu'une ventilation homogène n'est pas disponible.

## Recommandation non appliquée

Conserver la grille Airbnb comme source autoritaire du site. Traiter séparément, lors d'une mission commerciale dédiée, l'alignement éventuel du Standard Rate Booking, du non-remboursable et de Genius, après normalisation des frais et taxes. Ne modifier ni prix ni disponibilité Booking à partir de ce rapport.
