# Recette avant déploiement — éditeur visuel des Maisons

## Précondition

- Exécuter la migration `20260812100000_property_visual_editor.sql` sur l’environnement de recette uniquement.
- Ouvrir `Administration > Maisons` avec un compte `admin` ou `editor`.
- Ne lancer aucun déploiement en production pendant la recette.

## Parcours à réaliser ensemble

1. Sélectionner **Villa Raie Manta** et vérifier que la page réelle apparaît.
2. Cliquer sur le titre principal, saisir `Villa Raie Manta — recette`, puis constater le changement immédiat.
3. Cliquer sur le paragraphe d’introduction, ajouter ` Test de recette.`, puis constater le changement immédiat.
4. Cliquer sur la photo principale, choisir une autre photo de la photothèque et vérifier son affichage.
5. Cliquer sur **Annuler** et vérifier le retour de l’ancienne photo.
6. Remplacer une photo dans une mosaïque éditoriale, puis utiliser les flèches gauche/droite pour modifier son ordre.
7. Basculer entre **Ordinateur** et **Mobile** et contrôler l’absence de débordement ou de contenu manquant.
8. Cliquer sur **Enregistrer le brouillon** et vérifier que la page publique n’a pas changé.
9. Faire une nouvelle modification, cliquer sur **Abandonner les changements** et vérifier le retour au dernier contenu publié.
10. Refaire le titre, le paragraphe et la photo de recette, puis cliquer sur **Enregistrer et publier**.
11. Activer **Aperçu propre** et ouvrir la page publique dans une seconde fenêtre.
12. Comparer l’aperçu propre et la page publique, puis exécuter `npm run test:visual-editor`.
13. Restaurer les textes et la photo d’origine, publier de nouveau, puis relancer le test visuel.

## Critères de validation

- Le brouillon ne modifie jamais la page publique.
- Annuler restaure la modification précédente dans la session.
- Abandonner recharge la dernière version publiée.
- La photo peut être choisie parmi les photos existantes ou importée sans copier d’URL.
- Les commandes de réorganisation n’apparaissent pas sur le site public.
- Les vues ordinateur et mobile sont utilisables.
- `npm run test:visual-editor` confirme les six comparaisons pixel par pixel.
- Aucun déploiement n’est autorisé tant qu’un critère échoue.
