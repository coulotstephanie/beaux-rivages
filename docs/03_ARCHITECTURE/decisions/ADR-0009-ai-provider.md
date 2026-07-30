# ADR-0009 — Choix du fournisseur IA

- **Statut :** Proposed
- **Date :** 2026-07-29
- **Décideurs :** Direction Beaux Rivages, responsable technique, référent RGPD
- **Échéance de révision :** avant tout traitement de données réelles par IA

## Contexte

Beaux Rivages prévoit des assistants pour les voyageurs et les hôtes, la
personnalisation du Carnet et des recommandations tarifaires. Aucun fournisseur
ne doit être intégré tant que les finalités, les données autorisées et les
responsabilités humaines ne sont pas validées.

Les informations commerciales et techniques évoluent rapidement. Cette analyse
est datée ; les prix, modèles, régions et conditions contractuelles devront être
revérifiés lors de la décision.

## Critères éliminatoires

Le fournisseur retenu devra proposer :

1. un DPA compatible avec les obligations RGPD de Beaux Rivages ;
2. une option de traitement appropriée dans l’EEE, ou une analyse formelle des
   transferts et garanties applicables ;
3. l’absence d’entraînement sur les données Beaux Rivages par défaut ;
4. une durée de rétention documentée et configurable ;
5. chiffrement, journalisation, contrôle d’accès et procédure d’incident ;
6. une API stable permettant abstraction, quotas, délais et reprise sur erreur ;
7. une validation humaine pour les messages, prix et décisions sensibles.

## Options étudiées

| Critère                         | OpenAI API                                                  | Azure OpenAI                                                 | Anthropic API                                                                          | Mistral                                                  |
| ------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Hébergement géré                | Oui                                                         | Oui, dans Azure                                              | Oui                                                                                    | Oui                                                      |
| Traitement/résidence européenne | Projet API européen pour les clients et endpoints éligibles | Dépend du type de déploiement et de la région Azure          | Traitement mondial annoncé ; résidence européenne dédiée à confirmer contractuellement | API européenne documentée ; endpoint américain optionnel |
| Entraînement sur données API    | Non par défaut                                              | Non                                                          | Conditions commerciales à contractualiser et revérifier                                | À contractualiser selon le produit retenu                |
| Auto-hébergement                | Non                                                         | Non pour les modèles OpenAI                                  | Non                                                                                    | Oui pour les modèles open-weight compatibles             |
| Multilingue                     | À valider sur le corpus FR/EN/DE Beaux Rivages              | Identique au modèle OpenAI déployé                           | À valider sur le corpus                                                                | À valider sur le corpus                                  |
| API et outils                   | API multimodale et outils intégrés                          | Écosystème Azure, réseau privé et gouvernance                | API Messages et outils                                                                 | API, déploiements cloud et locaux                        |
| Modèle de coût                  | À l’usage, selon modèle et tokens                           | À l’usage ou capacité provisionnée, avec coûts Azure annexes | À l’usage, selon modèle et tokens                                                      | À l’usage ; infrastructure à ajouter en auto-hébergement |
| Risque principal                | Éligibilité et périmètre exacts de la résidence UE          | Complexité et coût opérationnels Azure                       | Souveraineté et localisation à clarifier                                               | Exploitation GPU et qualité variable selon le modèle     |

Les performances ne sont volontairement pas classées sur la base de benchmarks
génériques. Elles seront mesurées avec les tâches réelles : français naturel,
anglais et allemand, recommandations locales, réponses prudentes, appels
d’outils, latence et coût par parcours.

## Analyse

### OpenAI API

Option adaptée à un premier pilote fonctionnel grâce à une API riche et à une
résidence européenne disponible pour les projets et endpoints éligibles. La
configuration européenne doit être faite sur un nouveau projet et vérifiée
avant le premier échange réel.

### Azure OpenAI

Option pertinente si Beaux Rivages adopte Azure pour la gouvernance, le réseau
privé et la supervision. Le choix entre déploiement régional, Data Zone et
global modifie la localisation effective du traitement. Le coût total doit
inclure les services Azure annexes et le temps d’exploitation.

### Anthropic

Option crédible à évaluer pour la rédaction et les longs contextes. La
documentation indique une infrastructure de traitement distribuée dans
plusieurs régions ; une résidence strictement européenne et les durées de
rétention doivent donc être confirmées par écrit avant sélection.

### Mistral

Option privilégiée lorsque la souveraineté européenne ou l’auto-hébergement
devient prioritaire. Les modèles open-weight peuvent être exploités localement,
mais l’infrastructure, la sécurité, les mises à jour et la disponibilité
deviennent alors la responsabilité de Beaux Rivages ou d’un infogérant.

## Décision proposée

Aucun fournisseur n’est accepté à ce stade.

La sélection suivra un **appel d’essai réversible à deux candidats** :

- OpenAI API avec projet européen, pour établir la référence fonctionnelle ;
- Mistral API européenne, pour établir la référence de souveraineté et préparer
  une éventuelle stratégie auto-hébergée.

Azure OpenAI sera ajouté au pilote si une stratégie Azure d’entreprise est
retenue. Anthropic restera un candidat de comparaison si ses engagements
contractuels de localisation répondent aux exigences validées.

Le gagnant ne sera pas nécessairement unique. L’architecture devra accepter un
fournisseur principal et un fournisseur de repli derrière un port applicatif,
sans exposer les SDK des fournisseurs au domaine métier.

## Protocole de décision

Avant acceptation de cet ADR :

1. établir la liste des données autorisées, interdites et anonymisées ;
2. réaliser une AIPD si le DPO ou le conseil juridique la juge nécessaire ;
3. obtenir et comparer DPA, sous-traitants, transferts, rétention et suppression ;
4. exécuter le même jeu de 100 scénarios FR/EN/DE chez chaque candidat ;
5. mesurer exactitude, hallucinations, latence p95, disponibilité et coût ;
6. tester les protections contre l’injection de prompt et la fuite de données ;
7. faire valider les réponses par Stéphanie et Bruno ;
8. documenter la décision finale dans une nouvelle révision de cet ADR.

## Conséquences

- aucune donnée voyageur réelle ne part vers un modèle pendant l’évaluation ;
- les secrets resteront exclusivement côté serveur ;
- les prompts, sorties et appels d’outils seront auditables avec minimisation
  des données ;
- les réponses sensibles resteront des propositions soumises à validation ;
- le code dépendra d’une interface interne, jamais directement d’un fournisseur.

## Sources officielles consultées

- [OpenAI — résidence des données en Europe](https://openai.com/fr-FR/index/introducing-data-residency-in-europe/)
- [OpenAI — contrôles des données de la plateforme](https://platform.openai.com/docs/models/default-usage-policies-by-endpoint)
- [Microsoft — confidentialité des modèles Azure Direct](https://learn.microsoft.com/en-us/azure/foundry/responsible-ai/openai/data-privacy)
- [Microsoft — FAQ Azure OpenAI](https://learn.microsoft.com/en-us/azure/ai-services/openai/faq)
- [Anthropic — localisation des serveurs](https://privacy.anthropic.com/en/articles/7996890-where-are-your-servers-located-do-you-host-your-models-on-eu-servers)
- [Anthropic — tarifs API](https://www.anthropic.com/pricing)
- [Mistral — options de déploiement](https://docs.mistral.ai/models/deployment)
- [Mistral — tarifs API](https://mistral.ai/pricing/api/)
- [Mistral — localisation des données](https://help.mistral.ai/en/articles/347629-where-do-you-store-my-data-or-my-organization-s-data)
