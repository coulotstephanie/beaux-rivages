export type ExperienceEditorial = {
  hook: string;
  moment: string;
  advice: string;
  detail: string;
};

const editorial: Record<string, ExperienceEditorial> = {
  "experience-signature": {
    hook: "Et si vos vacances commençaient dès l’instant où vous ouvrez la porte ?",
    moment:
      "Vous arrivez, la maison est prête et les premiers gestes du séjour deviennent immédiatement plus doux. Il ne reste qu’à poser les valises et profiter.",
    advice:
      "Nous la conseillons lorsque vous souhaitez voyager léger et savourer pleinement les premières heures dans la maison.",
    detail:
      "C’est souvent la sensation d’être attendu que nos voyageurs retiennent le plus longtemps.",
  },
  "panier-aperitif": {
    hook: "Imaginez poser vos valises et partager le premier apéritif de vos vacances aux couleurs de l’île…",
    moment:
      "La maison s’ouvre, les verres se remplissent et chacun se retrouve autour de saveurs locales. Le séjour commence par un instant simple, convivial et déjà précieux.",
    advice:
      "Gardez ce panier pour votre première soirée : c’est le moment idéal pour ralentir après le voyage et se retrouver.",
    detail: "Chaque produit raconte un peu des îles et de celles et ceux qui les font vivre.",
  },
  "panier-douceur": {
    hook: "Parce que certaines vacances méritent de commencer avec une touche de gourmandise.",
    moment:
      "Une douceur partagée, un jus servi et le plaisir de découvrir ensemble quelques spécialités artisanales : une parenthèse joyeuse dès l’arrivée.",
    advice:
      "Nous l’aimons particulièrement pour les séjours en famille et les retrouvailles autour d’un goûter improvisé.",
    detail: "Une petite gourmandise suffit parfois à signer le début des vacances.",
  },
  essentiel: {
    hook: "Commencer son séjour sans se soucier de rien, simplement profiter dès les premières minutes.",
    moment:
      "Vous ouvrez la porte d’une maison prête à vivre. Les repères sont clairs, les équipements sont là et vous pouvez immédiatement retrouver votre propre rythme.",
    advice:
      "Prenez quelques minutes en arrivant pour parcourir le Carnet Beaux Rivages : nous y avons réuni les adresses et conseils que nous partageons avec nos proches.",
    detail: "Le vrai luxe est parfois de ne plus avoir à penser à l’organisation.",
  },
  bebe: {
    hook: "Voyager plus léger pour garder toute votre énergie pour les premiers souvenirs en famille.",
    moment:
      "Le matériel essentiel vous attend. Vous installez votre tout-petit sans multiplier les bagages et chacun peut prendre ses marques sereinement.",
    advice:
      "Indiquez-nous l’âge de votre enfant avant le séjour afin que nous préparions uniquement les équipements réellement utiles.",
    detail: "Moins de bagages, c’est déjà un départ en vacances plus paisible.",
  },
  animaux: {
    hook: "Parce que les plus beaux départs sont aussi ceux où personne ne reste à la maison.",
    moment:
      "Votre compagnon découvre un nouvel environnement, puis vous partez ensemble respirer l’air marin entre plage, forêt et chemins tranquilles.",
    advice:
      "En été, privilégiez les promenades tôt le matin ou en soirée et vérifiez toujours l’affichage municipal à l’entrée des plages.",
    detail:
      "Partager une balade au bord de l’océan fait souvent partie des meilleurs souvenirs du séjour.",
  },
  romance: {
    hook: "Créer un souvenir à deux est parfois le plus beau cadeau que l’on puisse s’offrir.",
    moment:
      "La porte s’ouvre sur une atmosphère préparée pour vous. Le quotidien s’efface et laisse place à une soirée dont vous choisirez le rythme.",
    advice:
      "Choisissez cette attention pour une date importante ou simplement pour vous retrouver, sans attendre une occasion particulière.",
    detail: "Les souvenirs les plus précieux naissent souvent d’une attention inattendue.",
  },
  "demande-en-mariage": {
    hook: "Un horizon, quelques mots et un instant qui changera tout le reste.",
    moment:
      "La lumière, le lieu et le moment se rejoignent pour laisser toute la place à votre histoire, loin du bruit et des gestes trop préparés.",
    advice:
      "Nous privilégions toujours un moment fidèle à votre couple et adaptons les détails à la météo comme à la lumière.",
    detail: "Ce qui compte n’est pas la mise en scène, mais l’émotion qu’elle laisse apparaître.",
  },
  anniversaire: {
    hook: "Célébrer une personne, c’est lui rappeler combien sa présence compte.",
    moment:
      "Une attention l’attend dans la maison et transforme l’arrivée en véritable surprise, entourée des personnes qui lui sont chères.",
    advice:
      "Racontez-nous simplement la personne et l’ambiance souhaitée : les détails les plus personnels sont souvent les plus touchants.",
    detail: "Une arrivée peut devenir, à elle seule, un souvenir d’anniversaire.",
  },
  "bien-etre": {
    hook: "Le bruit des vagues, le temps qui ralentit et quelques instants rien que pour vous…",
    moment:
      "Face à l’océan, la respiration s’apaise et le rythme change. Pendant quelques instants, il n’y a plus rien à organiser, seulement le plaisir d’être là.",
    advice:
      "Choisissez un horaire calme, le matin ou en fin de journée, et réservez directement auprès de Reéduk Coach selon leurs disponibilités.",
    detail: "Le son de l’océan accompagne naturellement chaque mouvement.",
  },
  "atelier-macarons": {
    hook: "Mettre la main à la pâte et repartir avec des créations qui racontent déjà une histoire.",
    moment:
      "Petits et grands se concentrent sur le même geste, comparent leurs créations puis savourent la fierté d’avoir réalisé ensemble leurs propres pâtisseries.",
    advice:
      "Nous aimons cet atelier en famille. Les places se réservent directement auprès de Confetti à Rivedoux-Plage.",
    detail: "Le meilleur moment arrive souvent lorsque chacun découvre le résultat des autres.",
  },
  "lever-de-soleil": {
    hook: "Voir l’île s’éveiller avant les premiers bruits du village.",
    moment:
      "Vous rejoignez le rivage dans le silence. La lumière gagne doucement l’eau et, pendant quelques minutes, la plage semble n’appartenir qu’à vous.",
    advice: "Arrivez un peu avant l’heure annoncée et prévoyez une couche chaude, même en été.",
    detail: "Chaque lever de soleil est différent, même depuis le même rivage.",
  },
  "coucher-de-soleil": {
    hook: "Rester quelques minutes de plus, juste pour voir le ciel changer de couleur.",
    moment:
      "La lumière descend sur les marais, les reflets deviennent dorés puis le silence revient. Vous prenez enfin le temps de ne rien faire d’autre que regarder.",
    advice:
      "Nous vous conseillons d’arriver avant l’heure dorée et de rester après la disparition du soleil.",
    detail:
      "Les couleurs les plus profondes apparaissent parfois lorsque l’on pense le spectacle terminé.",
  },
  "peche-a-pied": {
    hook: "Quand l’océan se retire, un autre paysage apparaît sous vos pas.",
    moment:
      "En famille, vous apprenez à lire l’estran, observez les petites vies cachées et découvrez le rythme patient des grandes marées.",
    advice:
      "Privilégiez les grandes marées, respectez les tailles minimales et gardez toujours un œil sur l’heure de remontée de l’eau.",
    detail:
      "Le plaisir tient autant à la découverte qu’à ce que l’on choisit de laisser sur place.",
  },
  "balade-velo": {
    hook: "Partir sans regarder l’heure, entre villages blancs, marais et horizon marin.",
    moment:
      "La route se déroule au rythme des vélos. Une venelle, un marché ou un point de vue devient naturellement la prochaine étape de la journée.",
    advice:
      "Partez tôt lorsqu’il fait chaud et adaptez la boucle au vent : le retour n’en sera que plus agréable.",
    detail: "À vélo, les distances raccourcissent mais les découvertes se multiplient.",
  },
  famille: {
    hook: "Une journée où chacun trouve son rythme et où personne ne regarde vraiment l’heure.",
    moment:
      "Les enfants jouent, les adultes ralentissent et les générations se retrouvent autour de plaisirs simples entre maison, plage et océan.",
    advice:
      "Adaptez la journée à la météo et à l’âge des enfants, sans chercher à remplir chaque heure.",
    detail:
      "Les enfants se souviennent souvent davantage d’un jeu improvisé que d’un programme chargé.",
  },
};

export function getExperienceEditorial(slug: string): ExperienceEditorial {
  return (
    editorial[slug] ?? {
      hook: "Les plus beaux souvenirs sont souvent les moments les plus simples.",
      moment:
        "Prenez le temps de vivre l’expérience, d’observer les îles et de partager un moment qui trouvera naturellement sa place dans vos souvenirs.",
      advice:
        "Choisissez le moment qui correspond à votre rythme, à la saison et aux personnes avec lesquelles vous voyagez.",
      detail: "C’est souvent ce moment imprévu dont on reparle bien après le retour.",
    }
  );
}
