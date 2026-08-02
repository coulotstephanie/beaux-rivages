export type HeritageEditorial = {
  emotionalLead: string;
  story: string[];
  unique: string;
  mustSee: string[];
  idealDay: { time: string; title: string; detail: string }[];
  practical: {
    parking: string;
    bike: string;
    accessibility: string;
    families: string;
    dogs: string;
  };
  premiumPage?: {
    labels?: {
      timeline?: string;
      facts?: string;
      feature?: string;
      photos?: string;
      nearby?: string;
    };
    introduction: { title: string; paragraphs: string[] };
    chapters: { title: string; paragraphs: string[] }[];
    timeline: { year: string; title: string; detail: string }[];
    facts: { value: string; label: string; detail: string }[];
    summit: { title: string; paragraphs: string[] };
    photoSlots: { label: string; note: string }[];
    addressSlots?: { category: string; note: string }[];
    processModule?: {
      title: string;
      introduction: string;
      steps: { title: string; detail: string }[];
    };
    seasonsModule?: { title: string; seasons: { name: string; title: string; detail: string }[] };
    futureModule?: { title: string; status: string; description: string; items: string[] };
    nearby: { title: string; detail: string; href: string }[];
    sources: { label: string; href: string }[];
  };
};

const day = (...items: HeritageEditorial["idealDay"]) => items;

export const heritageEditorial: Record<string, HeritageEditorial> = {
  "fort-boyard": {
    emotionalLead:
      "Il surgit au milieu du pertuis comme un navire de pierre qui aurait décidé de ne plus repartir. Avant d’être une image familière, Fort Boyard fut un rêve stratégique, un chantier démesuré et une lutte de plus de deux siècles contre l’océan.",
    story: [
      "L’idée naît d’une faiblesse militaire : entre Aix et Oléron, les canons installés à terre ne couvrent pas entièrement la passe menant à l’arsenal de Rochefort. Sur les cartes marines, un banc de sable porte un nom hollandais progressivement déformé en « Boyard ». Vauban juge l’entreprise presque impossible. Sous le Consulat, Bonaparte choisit pourtant de la tenter : en 1803, des milliers de tonnes de pierres commencent à disparaître dans une mer qui déplace les blocs et ralentit les hommes.",
      "Le premier chantier est interrompu en 1809. Pendant près de trente ans, l’enrochement demeure seul face aux marées. Sous Louis-Philippe, le projet reprend avec de nouvelles méthodes : plateforme alvéolaire, béton et blocs de défense rendent enfin possible l’élévation du fort. Maçons, tailleurs de pierre, marins et ingénieurs travaillent depuis Boyardville dans des conditions que le vent, les courants et l’éloignement rendent exceptionnelles.",
      "L’ouvrage est achevé officiellement en 1866, après soixante-trois ans. Il mesure environ 68 mètres de long, 31 mètres de large et 29 mètres de haut. Mais l’artillerie a progressé : le fort est déjà largement dépassé. Il sert ponctuellement de prison à partir de 1870, puis se vide et est abandonné en 1913. Classé Monument historique en 1950, il continue pourtant de perdre ses protections sous l’assaut de la houle.",
      "Le Département de la Charente-Maritime en devient propriétaire en 1989. Le jeu télévisé tourné à partir de 1990 lui offre une renommée mondiale et accompagne une première renaissance. Une nouvelle campagne majeure protège aujourd’hui ses fondations et reconstruit l’éperon et le havre d’accostage inspirés des ouvrages historiques. Le projet départemental prévoit une ouverture au public à partir de 2028 : une nouvelle page pour ce monument longtemps regardé seulement depuis la mer.",
    ],
    unique:
      "Peu de monuments racontent aussi clairement l’écart entre une idée et sa réalisation. Fort Boyard est à la fois une prouesse d’ingénierie maritime, un ouvrage militaire devenu obsolète avant d’avoir vraiment servi, un lieu de détention, une ruine sauvée par l’imaginaire populaire et un chantier patrimonial contemporain.",
    mustSee: [
      "La silhouette complète depuis la plage des Saumonards au lever du jour.",
      "La forme oblongue et les rangées de casemates lors d’une approche en bateau.",
      "Les variations de distance créées par la marée et la brume.",
      "Depuis Boyardville, le dialogue entre le port né du chantier et le fort posé au large.",
    ],
    idealDay: day(
      {
        time: "9 h",
        title: "Plage des Saumonards",
        detail:
          "Marchez vers le rivage avant l’animation de la journée et observez la lumière découper le fort.",
      },
      {
        time: "11 h",
        title: "Chenal de Boyardville",
        detail: "Découvrez le port et les traces du village façonné par le chantier.",
      },
      {
        time: "12 h 30",
        title: "Déjeuner au port",
        detail: "Choisissez une table tournée vers les bateaux et le pertuis.",
      },
      {
        time: "14 h 30",
        title: "Approche en mer",
        detail:
          "Selon la saison et la météo, embarquez pour comprendre l’échelle réelle du monument.",
      },
      {
        time: "18 h",
        title: "Retour par la forêt",
        detail: "Rejoignez les Saumonards à pied ou à vélo lorsque le littoral retrouve son calme.",
      },
    ),
    practical: {
      parking:
        "Parkings à Boyardville et près des accès autorisés à la plage ; forte fréquentation en été.",
      bike: "Boyardville et la forêt des Saumonards sont très agréables à rejoindre à vélo.",
      accessibility:
        "Les points de vue côtiers sont variables ; renseignez-vous auprès de l’opérateur pour les sorties en mer.",
      families:
        "Observation depuis la plage facile ; prévoir protection solaire et coupe-vent en bateau.",
      dogs: "Respecter la réglementation saisonnière des plages et les consignes des compagnies maritimes.",
    },
  },
  "maison-heureuse-boyardville": {
    emotionalLead:
      "On la reconnaît à sa façade solaire, à ses grandes fenêtres et à cette manière très particulière de regarder vers l’océan. La Maison Heureuse ne se contente pas d’occuper le paysage : elle raconte une conception généreuse de l’architecture.",
    story: [
      "Le site appartient à l’histoire de Boyardville, base terrestre du chantier de Fort Boyard. Au fil de ses usages, le domaine passe du monde maritime à celui de l’accueil collectif. Au XXe siècle, l’architecte Clément Camus et le décorateur André Hellé participent à sa transformation en colonie de vacances.",
      "La Maison Heureuse s’inscrit dans le mouvement des écoles de plein air. À une époque où les préoccupations d’hygiène, de santé et d’éducation renouvellent l’architecture, on cherche à offrir aux enfants de l’espace, de l’air, de la lumière et un contact direct avec la nature. Les façades vitrées, les galeries et les perspectives vers le parc ne sont donc pas de simples ornements : elles traduisent un projet de vie.",
      "La colonie laisse de nombreux souvenirs de vacances, de jeux et de premières rencontres avec l’océan. Cette mémoire humaine complète l’intérêt architectural du bâtiment. La protection au titre des Monuments historiques, décidée en 2004, reconnaît précisément cette double valeur : un édifice remarquable et un lieu de mémoire.",
      "Après sa restauration, l’ensemble a trouvé une nouvelle vie résidentielle. Le Nid d’Été y occupe une place singulière. Les voyageurs empruntent les allées, traversent la pinède et rejoignent par le portail privé la plage des Saumonards. Séjourner ici, c’est habiter temporairement une architecture dont la raison d’être fut toujours d’accueillir et d’ouvrir les regards vers l’extérieur.",
    ],
    unique:
      "La Maison Heureuse unit trois récits rarement réunis : l’aventure de Fort Boyard, l’histoire sociale des colonies de vacances et une architecture de plein air protégée. Elle n’est pas un décor historique figé, mais un lieu habité dont l’esprit d’accueil demeure perceptible.",
    mustSee: [
      "La façade jaune et blanche et son jeu de symétries.",
      "Les larges baies qui témoignent de la recherche d’air et de lumière.",
      "La transition entre les bâtiments, le parc et la pinède.",
      "Le portail conduisant vers la plage, réservé aux résidents et voyageurs.",
    ],
    idealDay: day(
      {
        time: "8 h 30",
        title: "Réveil dans la résidence",
        detail: "Observez la lumière du matin sur les façades avant de rejoindre la pinède.",
      },
      {
        time: "9 h",
        title: "Chemin de la plage",
        detail: "Empruntez calmement le portail privé vers les Saumonards.",
      },
      {
        time: "11 h",
        title: "Boyardville",
        detail: "Reliez l’histoire de la résidence à celle du village et de Fort Boyard.",
      },
      {
        time: "16 h",
        title: "Retour sous les pins",
        detail: "Profitez de l’ombre et du silence de la forêt.",
      },
      {
        time: "19 h",
        title: "Soirée au Nid d’Été",
        detail: "Retrouvez l’atmosphère paisible du domaine lorsque la lumière baisse.",
      },
    ),
    practical: {
      parking: "Stationnement réservé selon les modalités communiquées aux voyageurs du Nid d’Été.",
      bike: "Accès facile aux itinéraires de Boyardville et de la forêt.",
      accessibility:
        "Le logement et les cheminements doivent être vérifiés selon les besoins de chaque voyageur.",
      families: "Cadre résidentiel calme ; les enfants restent sous la responsabilité des adultes.",
      dogs: "Animaux accueillis selon les règles du séjour et de la résidence.",
    },
  },
  "phare-des-baleines": {
    emotionalLead:
      "Au bout de l’Île de Ré, l’escalier tourne vers la lumière jusqu’à ce que la terre devienne une carte. Là-haut, les marais, les plages et le pertuis d’Antioche se rejoignent sous un même horizon.",
    story: [
      "La pointe des Baleines est un passage redouté depuis des siècles. Sous Louis XIV, une première tour est édifiée selon le programme de signalisation maritime associé à Vauban. Mise en service en 1682, la Vieille Tour rappelle le temps où le feu, gardé et entretenu par des hommes, devait être compris depuis le large.",
      "Au XIXe siècle, l’intensification de la navigation exige un signal plus puissant et plus élevé. Le Grand Phare est construit entre 1849 et 1853 puis inauguré en 1854. Sa tour de pierre atteint 57 mètres. Les gardiens veillent au feu, entretiennent les mécanismes et affrontent l’isolement des tempêtes.",
      "L’évolution de l’éclairage transforme leur métier. Les systèmes optiques perfectionnés, dans la continuité des travaux d’Augustin Fresnel, concentrent et projettent la lumière beaucoup plus loin. L’automatisation met progressivement fin à la présence permanente des gardiens, sans effacer leur mémoire.",
      "Aujourd’hui, les 257 marches conduisent à une plateforme exceptionnelle. Le parc, la Vieille Tour et le musée permettent de lire plusieurs siècles de navigation. Le site est aussi un paysage : vents, oiseaux, écluses à poissons et côte rocheuse rappellent que le phare ne se comprend jamais séparément de l’océan qu’il signale.",
    ],
    unique:
      "Deux générations de phares se répondent sur un même site. Cette continuité permet de comprendre, presque d’un seul regard, le passage du feu ancien à la grande optique moderne et l’évolution de la sécurité maritime.",
    mustSee: [
      "La Vieille Tour et son architecture du XVIIe siècle.",
      "La spirale de l’escalier du Grand Phare.",
      "Le panorama vers le pertuis d’Antioche et la côte sauvage.",
      "Les écluses à poissons visibles selon la marée.",
    ],
    idealDay: day(
      {
        time: "10 h",
        title: "Ascension",
        detail:
          "Montez avant la principale affluence et prenez le temps de faire le tour de la plateforme.",
      },
      {
        time: "11 h 30",
        title: "Musée et Vieille Tour",
        detail: "Replacez le panorama dans l’histoire des gardiens et de la navigation.",
      },
      {
        time: "13 h",
        title: "Déjeuner à la pointe",
        detail: "Profitez des adresses proches ou préparez un pique-nique responsable.",
      },
      {
        time: "15 h",
        title: "Côte sauvage",
        detail: "Marchez au rythme de la marée et observez les ouvrages littoraux.",
      },
      {
        time: "18 h",
        title: "Lumière du soir",
        detail: "Revenez vers le phare lorsque les ombres allongent sa silhouette.",
      },
    ),
    practical: {
      parking:
        "Parking sur site, rapidement chargé en haute saison. Pour une visite plus paisible, privilégiez l’ouverture, avant midi, ou la fin d’après-midi.",
      bike: "Très belle arrivée par les pistes cyclables du nord de l’île.",
      accessibility:
        "Le parc, le musée et les espaces au sol sont plus accessibles que la plateforme, atteinte uniquement par 257 marches. Vérifier les conditions détaillées auprès du site avant la visite.",
      families:
        "Le musée et la Vieille Tour complètent agréablement l’ascension. Prévoir le rythme des enfants et une surveillance étroite au sommet.",
      dogs: "Se renseigner sur les espaces autorisés ; laisse recommandée autour du site.",
    },
    premiumPage: {
      introduction: {
        title: "Un phare né pour sauver les marins",
        paragraphs: [
          "À la pointe occidentale de l’Île de Ré, la silhouette claire du Phare des Baleines domine l’océan et les terres basses. On l’aperçoit longtemps avant de l’atteindre : une verticale rassurante dans un paysage de vents, de récifs et de courants.",
          "Bien plus qu’un monument, il est devenu l’un des symboles de l’île. Sa présence raconte une mission très concrète : guider les navigateurs et les tenir éloignés des dangereux rochers des Baleines, tout en signalant l’approche du port militaire de Rochefort.",
        ],
      },
      chapters: [
        {
          title: "Une histoire qui commence bien avant le phare actuel",
          paragraphs: [
            "La pointe des Baleines borde une route maritime exigeante. Les récifs, les hauts-fonds, les courants et les changements rapides de visibilité ont longtemps rendu cette côte redoutable. La nécessité d’un repère permanent s’impose au XVIIe siècle, alors que Rochefort devient un port militaire majeur.",
            "Une première tour est construite de 1669 à 1682 sur les plans de l’ingénieur Augier, sous l’autorité royale de Colbert. Son feu, d’abord alimenté à l’huile de poisson, reste imparfait : dès 1685, les marins se plaignent d’une lumière masquée par la maçonnerie et de vitres vite encrassées.",
            "Au XIXe siècle, la Vieille Tour ne répond plus aux besoins d’une navigation devenue plus intense. Plutôt que de la surélever, l’administration choisit un nouveau phare, plus haut et doté d’un appareil optique moderne.",
          ],
        },
        {
          title: "La construction du géant de pierre",
          paragraphs: [
            "Le chantier du Grand Phare commence en 1849. Les ingénieurs Léonce Reynaud, Job de Soulangy et Legros sont associés à sa conception, tandis que l’entrepreneur Jean-Baptiste Mady dirige l’exécution. La tour octogonale est élevée en pierre de taille avec une précision indispensable à sa stabilité face aux vents atlantiques.",
            "Pendant quatre années, tailleurs de pierre, maçons, charpentiers et manœuvres font grandir la tour autour d’échafaudages exposés aux intempéries. Chaque niveau doit accueillir l’escalier hélicoïdal, les paliers et les équipements techniques sans affaiblir l’ouvrage.",
            "Achevé en 1853 et allumé en janvier 1854, le phare atteint 57 mètres. Ses 257 marches conduisent à une plateforme d’où la côte rétaise, les marais et l’océan se lisent comme une carte.",
          ],
        },
        {
          title: "Une prouesse technique",
          paragraphs: [
            "Au sommet, l’appareil lenticulaire concentre la lumière au lieu de la laisser se disperser. Héritée des travaux d’Augustin Fresnel, cette technologie utilise des anneaux de verre pour obtenir une optique puissante sans le poids d’une lentille pleine.",
            "Le faisceau devient ainsi identifiable depuis le large et porte aujourd’hui à plus de 50 kilomètres selon les informations officielles de l’Office de tourisme. Les combustibles, les mécanismes de rotation puis l’électrification et l’automatisation ont successivement transformé son fonctionnement.",
            "La Vieille Tour, le Grand Phare et le phare en mer des Baleineaux forment un ensemble exceptionnel qui permet de comprendre plusieurs siècles d’évolution de la signalisation maritime.",
          ],
        },
        {
          title: "Les gardiens du phare",
          paragraphs: [
            "Avant l’automatisation, la lumière dépendait d’une présence humaine constante. Les gardiens surveillaient le feu, nettoyaient les vitres et l’optique, entretenaient les mécanismes et consignaient les événements qui rythmaient le service.",
            "Leur quotidien associait précision technique et longues heures de veille. Les nuits de tempête renforçaient la responsabilité du poste : lorsque la côte disparaissait derrière les embruns, le signal devait rester fiable pour ceux qui naviguaient au large.",
            "Les logements et bâtiments conservés au pied des tours rappellent que le phare était aussi un lieu de vie. Le musée prolonge aujourd’hui cette mémoire à travers les objets, les dispositifs de signalisation et l’histoire de celles et ceux qui les faisaient fonctionner.",
          ],
        },
      ],
      timeline: [
        {
          year: "1669",
          title: "Début de la Vieille Tour",
          detail: "Le chantier de la première tour commence sur les plans de l’ingénieur Augier.",
        },
        {
          year: "1682",
          title: "Premier allumage",
          detail:
            "La tour entre en service pour signaler les rochers et l’accès maritime vers Rochefort.",
        },
        {
          year: "1849",
          title: "Naissance du Grand Phare",
          detail: "Les travaux du phare actuel commencent à quelques mètres de la première tour.",
        },
        {
          year: "1854",
          title: "Le nouveau feu",
          detail: "Le Grand Phare et son appareil lenticulaire sont mis en service en janvier.",
        },
        {
          year: "1904",
          title: "Protection de la Vieille Tour",
          detail: "La première tour est classée au titre des Monuments historiques.",
        },
        {
          year: "2012",
          title: "Un ensemble reconnu",
          detail: "Le Grand Phare et le phare des Baleineaux sont classés Monuments historiques.",
        },
      ],
      facts: [
        {
          value: "57 m",
          label: "de hauteur",
          detail: "Le Grand Phare domine la pointe des Baleines et le littoral rétais.",
        },
        { value: "257", label: "marches", detail: "Elles conduisent à la plateforme panoramique." },
        {
          value: "50+ km",
          label: "de portée",
          detail: "La lumière est visible à plus de 50 kilomètres selon l’Office de tourisme.",
        },
        {
          value: "1682",
          label: "la première tour",
          detail: "La Vieille Tour précède le phare actuel de près de deux siècles.",
        },
        {
          value: "1854",
          label: "mise en service",
          detail: "Le Grand Phare est allumé en janvier 1854.",
        },
        {
          value: "2 phares",
          label: "sur le même site",
          detail: "La Vieille Tour et le Grand Phare racontent l’évolution de la signalisation.",
        },
        {
          value: "1 musée",
          label: "au pied des tours",
          detail: "Il présente l’histoire des phares, des balises et de leurs gardiens.",
        },
        {
          value: "Toute l’année",
          label: "un site vivant",
          detail: "Les périodes et horaires précis doivent toujours être vérifiés avant la visite.",
        },
      ],
      summit: {
        title: "Pourquoi il faut absolument monter au sommet",
        paragraphs: [
          "Au fil des marches, les ouvertures cadrent déjà des fragments d’océan. Puis la plateforme révèle brusquement toute la géographie du nord de l’île : la côte sauvage, les plages, les villages, les marais et le Fier d’Ars.",
          "Par temps clair, le regard porte très loin sur l’Atlantique. En fin de journée, la lumière allonge la silhouette du phare et transforme les bassins des marais en miroirs. C’est moins un simple panorama qu’une manière de comprendre l’île d’un seul regard.",
        ],
      },
      photoSlots: [
        { label: "Lever du soleil", note: "Photo fournie par Stéphanie." },
        { label: "Vue depuis le sommet", note: "Photo fournie par Stéphanie." },
        { label: "Le Grand Phare", note: "Photo fournie par Stéphanie." },
        { label: "La Vieille Tour", note: "Photo fournie par Stéphanie." },
        { label: "Panorama sur l’océan", note: "Photo fournie par Stéphanie." },
        { label: "Détails d’architecture", note: "Photo fournie par Stéphanie." },
      ],
      nearby: [
        {
          title: "La Vieille Tour",
          detail: "Le premier phare de 1682, à découvrir sur le même site.",
          href: "#vieille-tour",
        },
        {
          title: "Les Portes-en-Ré",
          detail: "Un village du nord de l’île, entre venelles, plages et marais.",
          href: "/destinations/ile-de-re",
        },
        {
          title: "Le Fier d’Ars",
          detail: "Une vaste baie intérieure révélée depuis le sommet.",
          href: "/destinations/ile-de-re",
        },
        {
          title: "Lilleau des Niges",
          detail: "Un espace naturel majeur au cœur des marais du nord.",
          href: "/destinations/ile-de-re",
        },
        {
          title: "Les marais salants",
          detail: "Un paysage vivant façonné par l’eau et les sauniers.",
          href: "/patrimoine/marais-salants-ile-de-re",
        },
      ],
      sources: [
        {
          label: "Ministère de la Culture — notice du Vieux Phare et des Baleineaux",
          href: "https://pop.culture.gouv.fr/notice/merimee/PA00105165",
        },
        {
          label: "Ministère de la Culture — inventaire du Grand Phare",
          href: "https://pop.culture.gouv.fr/notice/merimee/IA00043071",
        },
        {
          label: "Destination Île de Ré — informations officielles de visite",
          href: "https://www.iledere.com/organiser-activites-et-loisirs/sites-de-visites-patrimoine-culture/musees-et-monuments/phare-des-baleines-le-grand-phare-saint-clement-des-baleines-fr-107514/",
        },
      ],
    },
  },
  "fort-la-pree": {
    emotionalLead:
      "À quelques mètres de l’océan, les murs bas de Fort La Prée semblent prolonger le rivage. Rien d’ostentatoire : une forteresse compacte, ancienne, qui raconte l’île depuis le temps de Louis XIII.",
    story: [
      "Au début du XVIIe siècle, Ré est une position stratégique entre La Rochelle, le continent et les routes maritimes. Le pouvoir royal veut contrôler ce territoire exposé et surveiller un passage essentiel pour les navires et les renforts.",
      "Une première fortification est conçue en 1625 par l’ingénieur d’Argencourt. Le fort prend rapidement part aux événements de 1627, lorsque les Anglais débarquent sur l’île pour soutenir les protestants rochelais.",
      "Vauban intervient plus tard dans la réorganisation générale des défenses rétaises. Fort La Prée devient une position secondaire face à l’immense réduit de Saint-Martin, sans jamais perdre son utilité d’observation et de contrôle du littoral.",
      "Au fil des siècles, adaptations, usages militaires, Occupation puis colonie de vacances transforment les lieux. Sauvé et restauré, le fort est aujourd’hui un monument vivant, ouvert à la visite et animé par des expositions, des jeux et des reconstitutions.",
    ],
    unique:
      "Plus ancien édifice militaire conservé de l’Île de Ré, Fort La Prée permet de lire, dans un espace à taille humaine, les transformations successives d’une fortification côtière du XVIIe au XXe siècle.",
    mustSee: [
      "La place d’armes et le noyau ancien du fort.",
      "Les fossés et les courtines observés depuis le parcours extérieur.",
      "Les traces laissées par les différentes périodes d’occupation.",
      "Le panorama sur le pertuis depuis les parties hautes.",
    ],
    idealDay: day(
      {
        time: "9 h 30",
        title: "Visite du fort",
        detail: "Commencez par le noyau ancien, les salles et les hauteurs avant l’affluence.",
      },
      {
        time: "11 h 30",
        title: "Littoral",
        detail:
          "Prolongez à pied ou à vélo le long de la côte en restant sur les itinéraires autorisés.",
      },
      {
        time: "12 h 30",
        title: "Déjeuner à La Flotte",
        detail: "Rejoignez le village et son port pour une pause face aux bateaux.",
      },
      {
        time: "14 h 30",
        title: "Patrimoine de La Flotte",
        detail: "Découvrez le marché, les ruelles ou l’Abbaye des Châteliers.",
      },
      {
        time: "16 h 30",
        title: "Pause gourmande",
        detail:
          "Choisissez une adresse personnelle de Stéphanie & Bruno lorsqu’elle sera renseignée.",
      },
      {
        time: "18 h",
        title: "Lumière du soir",
        detail: "Revenez vers la côte pour observer le pertuis dans une lumière plus douce.",
      },
    ),
    practical: {
      parking:
        "Stationnement à proximité du site selon la signalisation ; vérifier les dispositions saisonnières.",
      bike: "Le fort se rejoint facilement à vélo entre Rivedoux-Plage et La Flotte.",
      accessibility:
        "Le registre d’accessibilité et les conditions détaillées sont disponibles auprès du site ; certaines parties historiques présentent des marches et sols irréguliers.",
      families:
        "Parcours, jeux, costumes et animations sont proposés selon la saison. Vérifiez l’âge conseillé et la programmation avant la visite.",
      dogs: "Contactez le fort avant votre venue pour connaître les conditions d’accès avec un animal.",
    },
    premiumPage: {
      labels: {
        timeline: "Quatre siècles de transformations",
        facts: "Dix repères sur le plus ancien fort de l’île",
        feature: "Pourquoi visiter Fort La Prée aujourd’hui",
        photos: "La photothèque de Fort La Prée",
        nearby: "Continuer sur l’Île de Ré",
      },
      introduction: {
        title: "Une forteresse née pour protéger l’île",
        paragraphs: [
          "Dans les années 1620, l’Île de Ré est bien davantage qu’un territoire insulaire : elle commande les approches de La Rochelle et constitue un point d’appui décisif entre la côte, les pertuis et les routes de l’Atlantique.",
          "Fort La Prée est construit pour affirmer la souveraineté de Louis XIII, tenir un point d’entrée essentiel et surveiller la côte orientale. Sa position basse, proche de l’eau, répond à une logique précise : voir venir, contrôler les mouvements maritimes et permettre l’arrivée de renforts depuis le continent.",
        ],
      },
      chapters: [
        {
          title: "Une histoire mouvementée",
          paragraphs: [
            "Le premier projet est dessiné en 1625 par l’ingénieur d’Argencourt et exécuté avec Camus. Lorsque les Anglais débarquent en 1627 pour soutenir La Rochelle, le fort participe au dispositif français qui résiste sous le commandement du maréchal de Toiras.",
            "Réparé dès 1628, puis adapté à plusieurs reprises, le site s’inscrit ensuite dans la grande réorganisation défensive voulue sous Louis XIV. Vauban en examine la place dans le système de l’île, dominé à partir de 1681 par les nouvelles fortifications de Saint-Martin-de-Ré.",
            "Le fort conserve des fonctions militaires jusqu’aux transformations du XIXe siècle, connaît l’Occupation allemande pendant la Seconde Guerre mondiale, puis une vie inattendue comme colonie de vacances dans les années 1950. Il est aujourd’hui restauré, protégé et ouvert au public.",
          ],
        },
        {
          title: "Une architecture militaire remarquable",
          paragraphs: [
            "Le noyau ancien adopte un plan carré défendu par quatre bastions. Les courtines relient ces ouvrages et permettent aux défenseurs de croiser leurs tirs. Les demi-lunes et les fossés ralentissent l’approche, tandis que les espaces dégagés empêchent un assaillant de progresser à couvert.",
            "À l’intérieur, la place d’armes distribue les bâtiments nécessaires à la garnison : casernes, magasins, chapelle, citerne et poudrière. La pierre, la maçonnerie épaisse et les terrassements répondent moins à un souci décoratif qu’à la nécessité de résister aux tirs, au vent et à l’air marin.",
            "Les modifications successives n’ont pas effacé le plan d’origine. Elles permettent au contraire de comprendre comment une forteresse s’adapte aux changements de l’artillerie et des usages militaires.",
          ],
        },
        {
          title: "Les hommes qui ont vécu ici",
          paragraphs: [
            "Derrière la géométrie militaire, le fort fut un lieu de travail et de vie. Les soldats montaient la garde, entretenaient les armes, surveillaient la côte et s’exerçaient sur la place d’armes. Les officiers organisaient le service tandis que les personnels assuraient l’approvisionnement et l’entretien des bâtiments.",
            "Le quotidien dépendait des saisons, des alertes et des ressources disponibles. L’humidité, le vent et l’isolement relatif rendaient la vie exigeante. La citerne, les magasins et les logements rappellent que la capacité à tenir dans la durée comptait autant que la puissance des remparts.",
          ],
        },
        {
          title: "Un monument vivant aujourd’hui",
          paragraphs: [
            "Fort La Prée se découvre à une échelle très humaine. Les visiteurs circulent dans les salles, gagnent les hauteurs, longent les douves et découvrent des expositions retraçant les différentes périodes du site.",
            "La programmation associe visites, jeux, chasses au trésor, concerts et reconstitutions historiques. Ces propositions évoluent chaque année : elles doivent toujours être vérifiées sur le site officiel avant le départ.",
            "Son atmosphère plus intime que celle des grands remparts de Saint-Martin est précisément l’un de ses charmes. Le regard passe sans cesse de l’architecture au paysage maritime.",
          ],
        },
      ],
      timeline: [
        {
          year: "1625",
          title: "Le projet d’Argencourt",
          detail: "Une première fortification bastionnée est dessinée sous Louis XIII.",
        },
        {
          year: "1626",
          title: "Le fort prend forme",
          detail:
            "Le site officiel retient cette date comme naissance du plus ancien édifice militaire de l’île.",
        },
        {
          year: "1627",
          title: "Le débarquement anglais",
          detail: "Fort La Prée participe au dispositif français pendant le siège de l’île.",
        },
        {
          year: "1628",
          title: "Premières réparations",
          detail: "Le fort est rapidement remis en état après les combats.",
        },
        {
          year: "XVIIe s.",
          title: "Interventions de Vauban",
          detail: "Le fort est réévalué et remanié dans la nouvelle défense de l’île.",
        },
        {
          year: "1880",
          title: "Nouvelle campagne",
          detail:
            "Le ministère de la Culture recense une importante phase de travaux au XIXe siècle.",
        },
        {
          year: "1940–1945",
          title: "L’Occupation",
          detail: "L’armée allemande occupe et adapte le site pendant la Seconde Guerre mondiale.",
        },
        {
          year: "Années 1950",
          title: "Colonie de vacances",
          detail: "La forteresse connaît un usage social très éloigné de sa vocation initiale.",
        },
        {
          year: "2008",
          title: "Monument historique",
          detail: "Le fort est classé au titre des Monuments historiques.",
        },
        {
          year: "2026",
          title: "Quatre cents ans",
          detail: "Le site célèbre quatre siècles d’histoire avec une programmation dédiée.",
        },
      ],
      facts: [
        {
          value: "1626",
          label: "sa naissance",
          detail: "Le site officiel le présente comme le plus ancien bâtiment militaire de Ré.",
        },
        {
          value: "La Prée",
          label: "un nom de prairie",
          detail: "Le terme est une variante ancienne du mot « prairie ».",
        },
        {
          value: "4 bastions",
          label: "autour du noyau",
          detail: "Ils permettent de défendre les différentes faces du fort.",
        },
        {
          value: "1627",
          label: "face aux Anglais",
          detail: "Le fort traverse l’un des événements militaires majeurs de l’histoire rétaise.",
        },
        {
          value: "Vauban",
          label: "un fort remanié",
          detail: "L’ingénieur l’intègre à sa réflexion sur la défense générale de l’île.",
        },
        {
          value: "Une citerne",
          label: "pour tenir",
          detail: "L’autonomie en eau est indispensable à une garnison isolée.",
        },
        {
          value: "1880",
          label: "une nouvelle campagne",
          detail: "Les défenses continuent à évoluer au XIXe siècle.",
        },
        {
          value: "1940–1945",
          label: "traces de guerre",
          detail: "Une extension du parcours évoque l’occupation allemande.",
        },
        {
          value: "Années 1950",
          label: "des vacances au fort",
          detail: "Le monument a aussi été transformé en colonie de vacances.",
        },
        {
          value: "45 min",
          label: "la visite libre",
          detail: "Durée indicative annoncée officiellement, à prolonger selon les expositions.",
        },
      ],
      summit: {
        title: "Pourquoi visiter Fort La Prée aujourd’hui",
        paragraphs: [
          "Nous aimons son échelle intime et la proximité constante de l’océan. On peut observer les détails des maçonneries, comprendre les fonctions des différentes salles puis prendre de la hauteur sans jamais perdre le paysage de vue.",
          "La première visite du matin offre souvent la plus belle lumière et davantage de calme. Pour les photos, nous préférons les parties hautes tournées vers le pertuis, lorsque la pierre claire contraste avec le bleu de l’eau. Les jours d’animation donnent une autre dimension au lieu, mais il faut consulter la programmation et réserver lorsque cela est demandé.",
        ],
      },
      photoSlots: [
        {
          label: "Vue aérienne du fort",
          note: "Emplacement réservé à une photo fournie par Stéphanie.",
        },
        {
          label: "La grande porte",
          note: "Emplacement réservé à une photo fournie par Stéphanie.",
        },
        {
          label: "La place d’armes",
          note: "Emplacement réservé à une photo fournie par Stéphanie.",
        },
        {
          label: "Les douves et remparts",
          note: "Emplacement réservé à une photo fournie par Stéphanie.",
        },
        {
          label: "Le panorama maritime",
          note: "Emplacement réservé à une photo fournie par Stéphanie.",
        },
        {
          label: "Une reconstitution historique",
          note: "Emplacement réservé à une photo fournie par Stéphanie.",
        },
      ],
      nearby: [
        {
          title: "Saint-Martin-de-Ré et Vauban",
          detail: "Comparer le fort ancien au grand réduit insulaire construit à partir de 1681.",
          href: "/patrimoine/fortifications-vauban-saint-martin-de-re",
        },
        {
          title: "Le port de La Flotte",
          detail: "Poursuivre par les quais, le marché et les ruelles du village.",
          href: "/patrimoine/port-de-la-flotte",
        },
        {
          title: "L’Abbaye des Châteliers",
          detail: "Découvrir une autre grande histoire rétaise à quelques minutes.",
          href: "/patrimoine/abbaye-des-chateliers",
        },
        {
          title: "Les marais salants",
          detail: "Changer de paysage et comprendre un patrimoine vivant de l’île.",
          href: "/patrimoine/marais-salants-ile-de-re",
        },
      ],
      sources: [
        { label: "Fort La Prée — site officiel", href: "https://www.fort-la-pree.com/" },
        {
          label: "Ministère de la Culture — Fort de la Prée",
          href: "https://pop.culture.gouv.fr/notice/merimee/PA00104689",
        },
        {
          label: "Destination Île de Ré — Fort La Prée",
          href: "https://www.iledere.com/decouvrir/les-incontournables/le-fort-la-pree/",
        },
      ],
    },
  },
  "fortifications-vauban-saint-martin-de-re": {
    emotionalLead:
      "À Saint-Martin-de-Ré, la ville ne s’arrête pas aux façades du port. Elle se prolonge dans une géométrie de pierre, de fossés et de glacis conçue pour protéger une île entière.",
    story: [
      "Après les conflits du XVIIe siècle, Louis XIV confie à Vauban le renforcement de cette position stratégique face à l’arsenal de Rochefort. L’ingénieur ne dessine pas seulement une enceinte : il imagine une ville-refuge capable d’abriter la population de l’île en cas d’attaque.",
      "Bastions, demi-lunes, portes, fossés et glacis sont organisés pour multiplier les angles de défense. Le visiteur contemporain découvre une promenade élégante ; le plan d’origine répond pourtant à une logique militaire rigoureuse, où chaque perspective devait exposer l’assaillant et protéger les défenseurs.",
      "Le port et les remparts évoluent ensemble. Marchands, marins, soldats et habitants ont vécu dans l’ombre de cette enceinte. La citadelle, toujours affectée à l’administration pénitentiaire, rappelle que le site n’est pas uniquement un monument touristique.",
      "Depuis 2008, les fortifications font partie du Réseau des sites majeurs de Vauban inscrit au patrimoine mondial de l’UNESCO. Cette reconnaissance internationale distingue leur authenticité, leur conservation et leur place dans une œuvre qui a transformé l’art de défendre les territoires.",
    ],
    unique:
      "L’enceinte avait vocation à accueillir toute la population rétaise : sa dimension dépasse la défense d’un simple port. Elle offre aujourd’hui l’une des lectures les plus complètes du système Vauban.",
    mustSee: [
      "La porte des Campani et ses perspectives.",
      "Les glacis vus depuis les chemins extérieurs.",
      "La promenade entre la plage de la Cible et le port.",
      "La lumière du soir sur les bastions et les toits de Saint-Martin.",
    ],
    idealDay: day(
      {
        time: "9 h 30",
        title: "Porte et remparts",
        detail: "Commencez avant l’affluence pour lire le dessin de l’enceinte.",
      },
      {
        time: "11 h",
        title: "Port",
        detail: "Descendez vers les quais et les ruelles commerçantes.",
      },
      {
        time: "12 h 30",
        title: "Déjeuner",
        detail: "Choisissez une terrasse en retrait ou face aux bateaux.",
      },
      {
        time: "15 h",
        title: "Musée et ville",
        detail: "Approfondissez l’histoire rétaise selon les ouvertures.",
      },
      {
        time: "18 h",
        title: "Plage de la Cible",
        detail: "Revenez par les remparts dans la lumière du soir.",
      },
    ),
    practical: {
      parking:
        "Privilégiez les parkings périphériques puis rejoignez le port et les remparts à pied. Le cœur historique est très fréquenté en haute saison.",
      bike: "L’arrivée à vélo depuis Rivedoux-Plage ou La Flotte est particulièrement agréable ; utilisez les stationnements prévus avant d’entrer dans les ruelles.",
      accessibility:
        "Les quais sont globalement praticables, mais les pavés, pentes et chemins de rempart peuvent gêner certains déplacements. Vérifiez le parcours adapté auprès de l’Office de tourisme.",
      families:
        "Le parcours extérieur se découvre librement. Sur les parties hautes des remparts, une surveillance attentive des enfants est indispensable.",
      dogs: "La laisse est recommandée dans le centre, sur les quais et le long des remparts ; respectez les secteurs signalés et la tranquillité de la faune.",
    },
    premiumPage: {
      labels: {
        timeline: "De la première citadelle à l’UNESCO",
        facts: "Douze repères pour regarder Saint-Martin autrement",
        feature: "Pourquoi nous aimons revenir",
        photos: "La photothèque de Saint-Martin-de-Ré",
        nearby: "Prolonger la découverte sur l’Île de Ré",
      },
      introduction: {
        title: "Une ville-port enveloppée par l’histoire",
        paragraphs: [
          "Entre remparts classés à l’UNESCO, ruelles pavées et port historique, Saint-Martin-de-Ré raconte plus de quatre siècles d’histoire maritime. La ville se découvre d’abord par son atmosphère : la lumière sur les façades blanches, les bateaux dans le bassin et, tout autour, l’immense dessin de pierre qui protège encore le bourg.",
          "Les fortifications ne sont pas un décor ajouté au village. Elles ont organisé ses portes, ses circulations, son rapport au port et son développement. Les parcourir permet de lire ensemble l’histoire militaire de l’île, la vie des habitants et le Saint-Martin animé d’aujourd’hui.",
        ],
      },
      chapters: [
        {
          title: "Saint-Martin avant Vauban",
          paragraphs: [
            "Point d’ancrage et de ravitaillement, l’Île de Ré occupe une position stratégique face à La Rochelle et sur la route de l’arsenal de Rochefort. Elle est disputée pendant des siècles, notamment entre les puissances française et anglaise.",
            "En 1625, l’ingénieur d’Argencourt conçoit une première citadelle carrée à quatre bastions. Deux ans plus tard, les troupes anglaises débarquent pour soutenir les Rochelais. La résistance conduite par le maréchal de Toiras et l’arrivée des renforts français marquent durablement la mémoire militaire de l’île.",
          ],
        },
        {
          title: "Lorsque Vauban transforme l’île",
          paragraphs: [
            "Après une première inspection en 1674, Vauban approuve en 1681 le projet porté par l’ingénieur François Ferry. L’objectif dépasse la défense d’une seule ville : Saint-Martin doit devenir un réduit insulaire capable d’abriter la population de Ré en cas de nouveau débarquement ennemi.",
            "De 1681 à 1685, une enceinte urbaine exceptionnelle est élevée avec ses bastions, demi-lunes, fossés et glacis. La porte des Campani et la porte Toiras commandent les accès. Les ouvrages sont calculés pour limiter les angles morts, exposer l’assaillant et protéger la place depuis plusieurs lignes successives.",
          ],
        },
        {
          title: "Les fortifications inscrites à l’UNESCO",
          paragraphs: [
            "L’enceinte et la citadelle de Saint-Martin-de-Ré appartiennent aux douze ensembles des Fortifications de Vauban inscrits sur la Liste du patrimoine mondial en 2008. L’UNESCO reconnaît dans cette œuvre l’aboutissement de la fortification bastionnée classique et une influence majeure sur l’architecture militaire internationale.",
            "Saint-Martin se distingue par la conservation de son enceinte, de son glacis resté largement non urbanisé et par l’ampleur du dispositif conçu comme refuge. La promenade actuelle donne accès à cette géométrie, mais aussi au paysage ouvert qui faisait partie intégrante de la défense.",
          ],
        },
        {
          title: "Une citadelle devenue prison et porte du bagne",
          paragraphs: [
            "La citadelle a connu d’autres usages après sa fonction militaire. Elle devient un établissement pénitentiaire et sert notamment de lieu de rassemblement pour des condamnés avant leur départ vers les bagnes coloniaux. Cette histoire humaine, difficile, appartient pleinement à la mémoire de Saint-Martin.",
            "La citadelle demeure aujourd’hui un centre pénitentiaire en activité. Elle ne se visite donc pas : seules ses fortifications et son entrée peuvent être observées depuis les espaces publics. Cette continuité d’usage explique aussi la préservation d’une partie importante de l’ensemble.",
          ],
        },
        {
          title: "Le port aujourd’hui",
          paragraphs: [
            "Le bassin, les quais et les ruelles donnent aujourd’hui à Saint-Martin son rythme familier. Plaisanciers, habitants, cyclistes et visiteurs se croisent là où arrivaient autrefois marchandises, marins et soldats.",
            "Le charme du port vient de ce dialogue constant entre une ville vivante et son héritage. Quelques pas suffisent pour passer d’une terrasse animée au silence d’un glacis, puis à une vue dégagée sur le pertuis et la côte vendéenne.",
          ],
        },
      ],
      timeline: [
        {
          year: "1212",
          title: "Un bourg déjà identifié",
          detail: "Saint-Martin apparaît comme le principal point d’ancrage de l’île.",
        },
        {
          year: "1625",
          title: "La première citadelle",
          detail: "D’Argencourt dessine une citadelle bastionnée sous Louis XIII.",
        },
        {
          year: "1627",
          title: "Le siège anglais",
          detail: "L’île est attaquée ; les Français résistent sous le commandement de Toiras.",
        },
        {
          year: "1674",
          title: "Vauban inspecte l’île",
          detail: "Il étudie la défense de cette position stratégique face à Rochefort.",
        },
        {
          year: "1681",
          title: "Le grand projet",
          detail:
            "Le plan de François Ferry, approuvé par Vauban, lance la transformation de Saint-Martin.",
        },
        {
          year: "1685",
          title: "L’enceinte prend sa forme",
          detail: "Vauban réalise sa dernière inspection avant l’achèvement du grand chantier.",
        },
        {
          year: "2008",
          title: "Reconnaissance mondiale",
          detail:
            "L’enceinte et la citadelle rejoignent les Fortifications de Vauban inscrites à l’UNESCO.",
        },
      ],
      facts: [
        {
          value: "1681–1685",
          label: "un chantier décisif",
          detail: "L’essentiel du grand dispositif est réalisé en quelques années.",
        },
        {
          value: "14 km",
          label: "de remparts",
          detail: "Le Réseau Vauban souligne les dimensions exceptionnelles de l’enceinte.",
        },
        {
          value: "1,5 km",
          label: "de rayon",
          detail: "Le demi-cercle fortifié enveloppe largement la ville historique.",
        },
        {
          value: "2 portes",
          label: "monumentales",
          detail: "Les portes Toiras et des Campani organisaient les accès à la place.",
        },
        {
          value: "Toute l’île",
          label: "mise à l’abri",
          detail: "La ville-refuge devait accueillir la population rétaise en cas d’attaque.",
        },
        {
          value: "4 bastions",
          label: "pour la citadelle",
          detail: "Son plan carré reprend la première organisation défensive du XVIIe siècle.",
        },
        {
          value: "1 200",
          label: "hommes prévus",
          detail:
            "Les bâtiments de la citadelle étaient dimensionnés pour une importante garnison.",
        },
        {
          value: "2008",
          label: "inscription UNESCO",
          detail: "Saint-Martin fait partie du bien en série des Fortifications de Vauban.",
        },
        {
          value: "12 sites",
          label: "dans le réseau inscrit",
          detail: "Ils illustrent ensemble la diversité et l’influence de l’œuvre de Vauban.",
        },
        {
          value: "Un glacis",
          label: "préservé",
          detail: "L’espace dégagé devant les murs participait directement à la défense.",
        },
        {
          value: "Une prison",
          label: "toujours active",
          detail: "La citadelle ne se visite pas et doit être observée depuis l’extérieur.",
        },
        {
          value: "Accès libre",
          label: "sur les promenades",
          detail:
            "Les remparts extérieurs se découvrent toute l’année, sous réserve des secteurs signalés.",
        },
      ],
      summit: {
        title: "Pourquoi nous aimons revenir",
        paragraphs: [
          "Nous aimons arriver tôt, lorsque le port s’éveille et que les ruelles sont encore calmes. Saint-Martin change ensuite d’atmosphère au fil des heures : animé autour des quais, presque silencieux dès que l’on rejoint les remparts.",
          "Notre moment préféré reste la fin de journée. La lumière devient plus douce sur la pierre, les toits et les bateaux. En revenant vers la plage de la Cible, on comprend naturellement pourquoi l’histoire, la mer et la vie quotidienne sont ici inséparables.",
        ],
      },
      photoSlots: [
        {
          label: "Le port au lever du jour",
          note: "Emplacement réservé à une photo fournie par Stéphanie.",
        },
        {
          label: "Les remparts et le glacis",
          note: "Emplacement réservé à une photo fournie par Stéphanie.",
        },
        {
          label: "La porte des Campani",
          note: "Emplacement réservé à une photo fournie par Stéphanie.",
        },
        {
          label: "Les ruelles pavées",
          note: "Emplacement réservé à une photo fournie par Stéphanie.",
        },
        {
          label: "Les roses trémières",
          note: "Emplacement réservé à une photo fournie par Stéphanie.",
        },
        {
          label: "Les bateaux dans le bassin",
          note: "Emplacement réservé à une photo fournie par Stéphanie.",
        },
      ],
      addressSlots: [
        {
          category: "Déjeuner près du port",
          note: "Adresse personnelle à ajouter par Stéphanie & Bruno.",
        },
        {
          category: "Pause gourmande",
          note: "Adresse personnelle à ajouter par Stéphanie & Bruno.",
        },
        {
          category: "Apéritif en fin de journée",
          note: "Adresse personnelle à ajouter par Stéphanie & Bruno.",
        },
        {
          category: "Boutique ou artisan",
          note: "Adresse personnelle à ajouter par Stéphanie & Bruno.",
        },
      ],
      nearby: [
        {
          title: "L’Abbaye des Châteliers",
          detail:
            "Une grande silhouette cistercienne à ciel ouvert entre Saint-Martin et La Flotte.",
          href: "/patrimoine/abbaye-des-chateliers",
        },
        {
          title: "Le port de La Flotte",
          detail: "Quais, marché et patrimoine maritime à quelques kilomètres.",
          href: "/patrimoine/port-de-la-flotte",
        },
        {
          title: "Les marais salants",
          detail: "Comprendre un paysage vivant façonné par l’eau, le vent et les sauniers.",
          href: "/patrimoine/marais-salants-ile-de-re",
        },
        {
          title: "Le Phare des Baleines",
          detail: "Poursuivre vers le nord de l’île et découvrir son grand panorama maritime.",
          href: "/patrimoine/phare-des-baleines",
        },
      ],
      sources: [
        {
          label: "UNESCO — Fortifications de Vauban",
          href: "https://whc.unesco.org/fr/list/1283/",
        },
        {
          label: "Réseau des sites majeurs Vauban — Saint-Martin-de-Ré",
          href: "https://sites-vauban.org/sites-majeurs/saint-martin-de-re",
        },
        {
          label: "Destination Île de Ré — Fortifications de Saint-Martin",
          href: "https://www.iledere.com/decouvrir/les-incontournables/les-fortifications-de-vauban-a-saint-martin-de-re/",
        },
      ],
    },
  },
  "abbaye-des-chateliers": {
    emotionalLead:
      "Ses murs n’enferment plus rien : ils cadrent le ciel. À La Flotte, l’Abbaye des Châteliers transforme l’absence de toiture en une expérience de lumière et de silence.",
    story: [
      "Fondée au XIIe siècle par des moines cisterciens, l’abbaye Notre-Dame-de-Ré s’inscrit dans un réseau religieux et économique européen. Les religieux aménagent, cultivent et participent à l’essor de la vigne et du sel.",
      "La sobriété cistercienne privilégie les proportions, la lumière et la lisibilité des fonctions. L’église, le cloître, le réfectoire et les bâtiments communautaires organisaient une vie rythmée par la prière et le travail.",
      "Sa position exposée lui vaut destructions et reconstructions au cours des guerres qui touchent l’île. Délaissées, les pierres servent aussi de carrière. Ce qui subsiste forme moins une ruine romantique qu’un document ouvert sur plusieurs siècles de bouleversements.",
      "Classé Monument historique, le site est accessible librement. Les légendes et récits locaux accompagnent les ruines, mais leur force tient surtout à ce que chacun peut encore lire : ouvertures gothiques, arrachements de murs, emplacement du cloître et dialogue constant avec les champs.",
    ],
    unique:
      "L’abbaye offre une architecture cistercienne à ciel ouvert dans un paysage insulaire. La mer, pourtant peu visible depuis certains angles, demeure présente dans la lumière et le vent.",
    mustSee: [
      "La grande baie du chevet cadrant le ciel.",
      "Les traces du cloître et des bâtiments conventuels.",
      "Les détails de taille dans la pierre claire.",
      "La silhouette entière depuis le chemin extérieur.",
    ],
    idealDay: day(
      {
        time: "9 h",
        title: "Abbaye",
        detail: "Profitez du calme et d’une lumière encore rasante.",
      },
      {
        time: "10 h 30",
        title: "Chemins de La Flotte",
        detail: "Rejoignez doucement le village à vélo ou à pied.",
      },
      {
        time: "12 h",
        title: "Marché médiéval",
        detail: "Découvrez les produits locaux sous les halles.",
      },
      { time: "14 h", title: "Port de La Flotte", detail: "Déjeunez puis longez les quais." },
      {
        time: "17 h",
        title: "Retour par le littoral",
        detail: "Prolongez la journée dans la lumière de fin d’après-midi.",
      },
    ),
    practical: {
      parking:
        "Un parking gratuit est signalé à proximité ; respectez les accès et les espaces agricoles.",
      bike: "L’abbaye se rejoint très agréablement à vélo depuis Rivedoux-Plage ou La Flotte.",
      accessibility:
        "Le site officiel indique un accès en fauteuil roulant avec aide. Les sols historiques restent irréguliers.",
      families:
        "La visite libre est facile à intégrer à une journée familiale. Ne laissez pas les enfants grimper sur les maçonneries.",
      dogs: "Les animaux sont admis selon la fiche officielle ; gardez-les en laisse et préservez le calme du site.",
    },
    premiumPage: {
      labels: {
        timeline: "Près de neuf siècles d’histoire",
        facts: "Dix fragments d’histoire à retenir",
        feature: "Pourquoi nous aimons cet endroit",
        photos: "Les lumières de l’Abbaye des Châteliers",
        nearby: "Continuer la découverte sur l’Île de Ré",
      },
      introduction: {
        title: "Une silhouette qui traverse les siècles",
        paragraphs: [
          "On aperçoit d’abord une silhouette de pierre blonde posée au milieu des champs. À mesure que l’on approche, les murs s’ouvrent sur le ciel, les arcs cadrent la lumière et le vent fait entendre les oiseaux là où résonnaient autrefois les voix des moines.",
          "L’Abbaye des Châteliers impressionne autant sous un ciel bleu que dans la brume ou avant l’orage. Son silence porte près de neuf siècles d’histoire, les gestes d’une communauté cistercienne et les transformations profondes de l’Île de Ré.",
        ],
      },
      chapters: [
        {
          title: "Aux origines de l’abbaye",
          paragraphs: [
            "Au XIIe siècle, des moines cisterciens fondent Notre-Dame-de-Ré, dite plus tard Abbaye des Châteliers. L’ensemble est achevé en 1156 et devient l’une des grandes abbayes du Centre-Ouest de la France.",
            "L’ordre cistercien recherche des lieux propices au retrait, au travail et à l’organisation d’un territoire. À proximité de la côte mais au milieu des terres, le site permet à la communauté de vivre selon une règle rythmée par la prière, le travail manuel et la gestion des ressources.",
            "Le monastère participe à l’aménagement de l’île, structure des domaines et contribue à l’essor économique de Ré.",
          ],
        },
        {
          title: "Une abbaye tournée vers la mer",
          paragraphs: [
            "Les moines défrichent, organisent les terres et relancent la viticulture à grande échelle. La vigne devient progressivement l’une des grandes activités de l’île, tandis que les marais salants se développent dans un paysage patiemment façonné par l’eau.",
            "Le vin, le sel et les productions agricoles inscrivent l’abbaye dans des réseaux d’échanges maritimes. Les bâtiments religieux, le cloître, les espaces de travail et les terres environnantes composent un véritable centre de vie, spirituel mais aussi économique.",
          ],
        },
        {
          title: "Les guerres et les destructions",
          paragraphs: [
            "La position maritime de l’île expose l’abbaye aux conflits. Les attaques anglaises, la guerre de Cent Ans puis les guerres de Religion entraînent pillages, dommages et reconstructions successives.",
            "Après l’abandon de la vie monastique, une grande partie des pierres est récupérée pour d’autres chantiers. L’Office de tourisme rappelle notamment leur réemploi au Fort La Prée, situé à proximité.",
            "Les ruines actuelles témoignent ainsi d’une lente succession de destructions, d’abandons et de réutilisations.",
          ],
        },
        {
          title: "Une architecture remarquable",
          paragraphs: [
            "L’architecture cistercienne privilégie la clarté du plan, l’équilibre des proportions et une ornementation contenue. La nef guidait le regard vers le chœur, tandis que le cloître organisait la circulation entre prière, repos, étude et travail.",
            "Les arcs, les grandes baies et les murs calcaires encore visibles révèlent la hauteur de l’église et la maîtrise des bâtisseurs. L’absence de toiture transforme aujourd’hui ces éléments en cadres ouverts sur le ciel.",
            "Autour de l’abbatiale subsistent également les traces des galeries, du jardin du cloître et de l’ancien réfectoire.",
          ],
        },
        {
          title: "Redécouverte et sauvegarde",
          paragraphs: [
            "Les ruines ont longtemps servi de repère dans le paysage. Du XIXe siècle aux années 1960, leur silhouette fut même utilisée comme amer, un point fixe aidant les navigateurs à se situer depuis la mer.",
            "Protégée au titre des Monuments historiques, l’ancienne abbaye fait aujourd’hui l’objet d’une attention patrimoniale qui vise à stabiliser les vestiges et à transmettre leur histoire sans effacer les marques du temps.",
            "Le site reste accessible librement toute l’année. Des visites guidées proposées selon la programmation du Musée du Platin permettent d’approfondir son histoire.",
          ],
        },
      ],
      timeline: [
        {
          year: "XIIe s.",
          title: "L’arrivée des Cisterciens",
          detail: "Une communauté fonde l’abbaye Notre-Dame-de-Ré sur les terres de La Flotte.",
        },
        {
          year: "1156",
          title: "L’abbaye achevée",
          detail: "La date est retenue officiellement pour l’achèvement du grand ensemble.",
        },
        {
          year: "Moyen Âge",
          title: "Vigne et marais",
          detail:
            "Les moines participent au développement agricole, viticole et salicole de l’île.",
        },
        {
          year: "XIVe–XVe s.",
          title: "Temps de conflits",
          detail: "La guerre de Cent Ans et les attaques anglaises fragilisent l’abbaye.",
        },
        {
          year: "XVIe s.",
          title: "Guerres de Religion",
          detail: "Les affrontements accélèrent destructions et abandon de la vie monastique.",
        },
        {
          year: "XVIIe s.",
          title: "Des pierres réemployées",
          detail: "Une partie des matériaux sert notamment aux travaux du Fort La Prée.",
        },
        {
          year: "XIXe–XXe s.",
          title: "Un amer pour les marins",
          detail:
            "La haute silhouette des ruines aide à se repérer depuis la mer jusqu’aux années 1960.",
        },
        {
          year: "Aujourd’hui",
          title: "Un monument ouvert",
          detail:
            "Le site protégé se visite librement, avec des visites guidées selon programmation.",
        },
      ],
      facts: [
        {
          value: "1156",
          label: "l’achèvement",
          detail: "L’abbaye cistercienne structure durablement le territoire rétais.",
        },
        {
          value: "9 siècles",
          label: "face au temps",
          detail: "La silhouette conserve la mémoire du Moyen Âge à nos jours.",
        },
        {
          value: "Cisterciens",
          label: "une règle de vie",
          detail: "Prière, travail et sobriété organisent la communauté et son architecture.",
        },
        {
          value: "Vignobles",
          label: "un héritage majeur",
          detail: "Les moines relancent et étendent la culture de la vigne sur l’île.",
        },
        {
          value: "Marais",
          label: "un paysage transformé",
          detail: "L’abbaye participe au développement des terres et des ressources salicoles.",
        },
        {
          value: "Fort La Prée",
          label: "des pierres réutilisées",
          detail: "Des matériaux de l’abbaye contribuent au chantier militaire voisin.",
        },
        {
          value: "Un amer",
          label: "visible depuis la mer",
          detail: "Les ruines servent longtemps de point de repère aux navigateurs.",
        },
        {
          value: "Roman & gothique",
          label: "deux lectures",
          detail:
            "Les vestiges montrent les évolutions architecturales du grand ensemble religieux.",
        },
        {
          value: "Accès libre",
          label: "toute l’année",
          detail: "Les ruines se découvrent gratuitement, dans le respect du monument.",
        },
        {
          value: "1 heure",
          label: "en visite guidée",
          detail: "Durée indicative annoncée pour les visites programmées par le Musée du Platin.",
        },
      ],
      summit: {
        title: "Pourquoi nous aimons cet endroit",
        paragraphs: [
          "Nous revenons pour ce calme très particulier, lorsque les pierres prennent une couleur dorée et que les ouvertures de l’ancienne église découpent le ciel. Même après plusieurs visites, la lumière compose une image différente.",
          "Notre conseil est de venir tôt ou en fin d’après-midi, puis de rester quelques minutes sans chercher immédiatement la prochaine photo. Le silence, le vent et la sensation d’être hors du temps font pleinement partie de la découverte.",
        ],
      },
      photoSlots: [
        { label: "Vue d’ensemble", note: "Emplacement réservé à une photo fournie par Stéphanie." },
        {
          label: "Détails des arches",
          note: "Emplacement réservé à une photo fournie par Stéphanie.",
        },
        {
          label: "Jeux de lumière",
          note: "Emplacement réservé à une photo fournie par Stéphanie.",
        },
        { label: "Ciel d’orage", note: "Emplacement réservé à une photo fournie par Stéphanie." },
        {
          label: "Coucher de soleil",
          note: "Emplacement réservé à une photo fournie par Stéphanie.",
        },
        {
          label: "Printemps et fleurs",
          note: "Emplacement réservé à une photo fournie par Stéphanie.",
        },
        {
          label: "Lumière rasante d’hiver",
          note: "Emplacement réservé à une photo fournie par Stéphanie.",
        },
      ],
      nearby: [
        {
          title: "Le port de La Flotte",
          detail: "Rejoindre les quais, le marché et les ruelles du village.",
          href: "/patrimoine/port-de-la-flotte",
        },
        {
          title: "Fort La Prée",
          detail: "Comprendre où certaines pierres de l’abbaye ont trouvé une nouvelle vie.",
          href: "/patrimoine/fort-la-pree",
        },
        {
          title: "Saint-Martin-de-Ré et Vauban",
          detail: "Poursuivre l’histoire insulaire à travers les grands remparts UNESCO.",
          href: "/patrimoine/fortifications-vauban-saint-martin-de-re",
        },
        {
          title: "Les marais salants",
          detail: "Découvrir un autre héritage économique et paysager de l’île.",
          href: "/patrimoine/marais-salants-ile-de-re",
        },
      ],
      sources: [
        {
          label: "Ministère de la Culture — Abbaye Notre-Dame de Ré",
          href: "https://pop.culture.gouv.fr/notice/merimee/PA00104687",
        },
        {
          label: "Destination Île de Ré — Abbaye des Châteliers",
          href: "https://www.iledere.com/decouvrir/les-incontournables/labbaye-des-chateliers/",
        },
        {
          label: "Destination Île de Ré — informations de visite",
          href: "https://www.iledere.com/organiser-activites-et-loisirs/sites-de-visites-patrimoine-culture/musees-et-monuments/abbaye-des-chateliers-la-flotte-fr-107505/",
        },
      ],
    },
  },
  "lilleau-des-niges": {
    emotionalLead:
      "Au bout des pistes du nord de Ré, le paysage s’élargit et le silence devient vivant. Une aile blanche traverse le ciel, une bernache appelle au loin : Lilleau des Niges se découvre en ralentissant.",
    story: [
      "Créée en 1980 et gérée par la LPO pour le compte de l’État, la réserve protège 121 hectares au cœur du Fier d’Ars.",
      "Anciennes salines, bosses herbeuses, prés salés et vasières offrent repos, nourriture et lieux de reproduction à une grande diversité d’oiseaux.",
      "Au printemps et en été viennent les nicheurs ; en automne et en hiver, les vasières accueillent des migrateurs venus du nord de l’Europe et au-delà.",
      "La Maison du Fier et les sorties LPO permettent d’apprendre à regarder ce milieu sans pénétrer dans ses secteurs sensibles.",
    ],
    unique:
      "Lilleau des Niges associe l’histoire salicole de l’île à un refuge majeur des marais côtiers atlantiques.",
    mustSee: [
      "Les vasières à marée basse.",
      "Les regroupements d’oiseaux lorsque la mer remonte.",
      "Les anciens bassins salicoles.",
      "La lumière rasante sur les bosses herbeuses.",
    ],
    idealDay: day(
      {
        time: "8 h 30",
        title: "Maison du Fier",
        detail: "Commencez par comprendre les habitats et choisir un itinéraire autorisé.",
      },
      {
        time: "10 h",
        title: "Observation",
        detail: "Marchez lentement avec des jumelles, sans quitter les chemins.",
      },
      { time: "12 h", title: "Les Portes-en-Ré", detail: "Rejoignez le village pour déjeuner." },
      { time: "15 h", title: "Fier d’Ars", detail: "Poursuivez à vélo dans les marais." },
      {
        time: "18 h",
        title: "Lumière du soir",
        detail: "Terminez depuis un point d’observation autorisé.",
      },
    ),
    practical: {
      parking: "Stationner près de la Maison du Fier dans les emplacements indiqués.",
      bike: "Le vélo est l’accès le plus doux ; rester sur les pistes autorisées.",
      accessibility:
        "La Maison du Fier renseigne sur les parcours adaptés et les conditions du jour.",
      families: "Le musée et le sentier pédagogique rendent l’observation accessible aux enfants.",
      dogs: "Les animaux ne sont pas admis dans la réserve ; respecter la signalisation locale.",
    },
    premiumPage: {
      labels: {
        timeline: "Quatre saisons dans la réserve",
        facts: "Dix repères pour mieux observer",
        photos: "Les lumières de Lilleau des Niges",
        nearby: "Continuer dans le nord de l’Île de Ré",
      },
      introduction: {
        title: "Un refuge au rythme des marées",
        paragraphs: [
          "Au cœur du Fier d’Ars, le ciel et l’eau semblent occuper tout l’espace. Le paysage change avec la marée et chaque silence révèle une présence.",
          "Lilleau des Niges n’est pas un parc animalier : c’est un milieu protégé où l’on apprend à observer à distance, patiemment.",
        ],
      },
      chapters: [
        {
          title: "Un refuge migratoire",
          paragraphs: [
            "La situation de la baie, abritée de la houle du large et proche d’autres espaces protégés, favorise les échanges entre populations d’oiseaux.",
            "Les espèces viennent s’y nourrir, se reposer ou nicher selon la saison.",
          ],
        },
        {
          title: "Un paysage hérité du sel",
          paragraphs: [
            "La réserve reprend la structure d’anciens marais salants. Bassins, digues et bosses herbeuses rappellent la vocation salicole séculaire du nord de Ré.",
            "À cette trame terrestre répondent les prés salés et vasières du domaine maritime.",
          ],
        },
        {
          title: "Les oiseaux emblématiques",
          paragraphs: [
            "Avocette élégante, échasse blanche, sterne pierregarin et tadorne de Belon se rencontrent notamment pendant la reproduction.",
            "Bernaches cravants, courlis, barges, bécasseaux, spatules et aigrettes animent les migrations et l’hiver.",
          ],
        },
        {
          title: "Observer sans déranger",
          paragraphs: [
            "Les distances, chemins et zones interdites protègent repos et nidification. Jumelles, discrétion et temps sont les meilleurs outils.",
            "La Maison du Fier et les guides LPO donnent les informations adaptées aux marées et à la saison.",
          ],
        },
      ],
      timeline: [
        {
          year: "Printemps",
          title: "Nidification",
          detail: "Avocettes, échasses, sternes et tadornes s’installent dans les marais.",
        },
        {
          year: "Été",
          title: "Élevage des jeunes",
          detail: "Les familles d’oiseaux fréquentent bassins et prés salés.",
        },
        {
          year: "Automne",
          title: "Grand passage",
          detail: "Les migrateurs font halte sur la route de leurs quartiers d’hiver.",
        },
        {
          year: "Hiver",
          title: "Vasières très vivantes",
          detail: "Bernaches et limicoles se nourrissent à marée basse puis gagnent les reposoirs.",
        },
      ],
      facts: [
        {
          value: "1980",
          label: "création",
          detail: "La réserve naturelle nationale est créée le 31 janvier.",
        },
        {
          value: "121 ha",
          label: "protégés",
          detail: "Une surface officielle au cœur des Portes-en-Ré.",
        },
        {
          value: "LPO",
          label: "gestionnaire",
          detail: "La Ligue pour la Protection des Oiseaux agit pour le compte de l’État.",
        },
        { value: "RNN45", label: "identifiant", detail: "Le code national de la réserve." },
        {
          value: "2 milieux",
          label: "complémentaires",
          detail: "Anciens marais salants terrestres et vasières maritimes.",
        },
        {
          value: "Fier d’Ars",
          label: "baie refuge",
          detail: "Une baie presque fermée et relativement abritée.",
        },
        {
          value: "Marée basse",
          label: "temps du repas",
          detail: "De nombreux oiseaux exploitent alors les vasières.",
        },
        {
          value: "Marée haute",
          label: "temps du repos",
          detail: "Les oiseaux gagnent des secteurs protégés derrière les digues.",
        },
        {
          value: "Toute l’année",
          label: "à observer",
          detail: "Chaque saison propose un cortège différent.",
        },
        {
          value: "À distance",
          label: "la bonne règle",
          detail: "Ne jamais quitter les itinéraires autorisés.",
        },
      ],
      summit: {
        title: "Pourquoi nous aimons venir ici",
        paragraphs: [
          "Nous aimons les premières heures du jour, lorsque la lumière glisse sur l’eau et que les sons portent très loin.",
          "Nous prenons toujours le temps. À Lilleau des Niges, regarder longtemps le même bassin réserve souvent la plus belle surprise.",
        ],
      },
      photoSlots: [
        "Spatules blanches",
        "Avocettes",
        "Bernaches",
        "Vasières",
        "Lever du soleil",
        "Coucher du soleil",
        "Marais en hiver",
      ].map((label) => ({ label, note: "Emplacement réservé à une photo fournie par Stéphanie." })),
      nearby: [
        {
          title: "Le Fier d’Ars",
          detail: "Comprendre la baie qui accueille la réserve.",
          href: "/patrimoine/fier-d-ars",
        },
        {
          title: "Les marais salants",
          detail: "Découvrir le paysage historique des salines.",
          href: "/patrimoine/marais-salants-ile-de-re",
        },
        {
          title: "Le Phare des Baleines",
          detail: "Rejoindre l’extrémité occidentale de l’île.",
          href: "/patrimoine/phare-des-baleines",
        },
      ],
      sources: [
        {
          label: "Réserves Naturelles de France — Lilleau des Niges",
          href: "https://reserves-naturelles.org/reserves/lilleau-des-niges/",
        },
        {
          label: "LPO — RNN de Lilleau des Niges",
          href: "https://www.lpo.fr/la-lpo-en-actions/preservation-des-espaces-naturels/nos-reserves-naturelles/rnn-de-lilleau-des-niges",
        },
        {
          label: "Destination Île de Ré — Lilleau des Niges",
          href: "https://www.iledere.com/decouvrir/les-incontournables/la-reserve-naturelle-nationale-de-lilleau-des-niges/",
        },
      ],
    },
  },
  "fier-d-ars": {
    emotionalLead:
      "Au Fier d’Ars, rien ne reste tout à fait identique : l’eau avance, les vasières apparaissent, le ciel change de couleur et les oiseaux redessinent l’horizon.",
    story: [
      "Cette baie presque fermée communique avec le pertuis Breton et abrite un vaste ensemble de marais.",
      "Les premières salines apparaissent au XIVe siècle, puis la sédimentation permet leur extension autour d’Ars et de Loix au XVe siècle.",
      "Le rythme des marées alimente chenaux, vasières et prés salés, créant des ressources essentielles pour les oiseaux.",
      "Le Fier est aujourd’hui un paysage vivant où activité salicole et préservation de la biodiversité demeurent étroitement liées.",
    ],
    unique:
      "Le Fier réunit baie marine, vasières, marais salants et réserve naturelle dans un même paysage façonné par l’océan et les hommes.",
    mustSee: [
      "La pointe du port d’Ars.",
      "Les vasières révélées par la marée basse.",
      "Les oiseaux gagnant leurs reposoirs.",
      "Les reflets du soir dans les chenaux.",
    ],
    idealDay: day(
      {
        time: "8 h 30",
        title: "Balade à vélo",
        detail: "Rejoignez les marais dans la lumière douce.",
      },
      { time: "10 h", title: "Observation", detail: "Arrêtez-vous aux points autorisés." },
      { time: "11 h 30", title: "Ars-en-Ré", detail: "Découvrez le port et le village." },
      { time: "12 h 30", title: "Déjeuner", detail: "Faites une pause dans le village." },
      {
        time: "14 h 30",
        title: "Marais salants",
        detail: "Comprenez le cycle de l’eau et le travail des sauniers.",
      },
      { time: "16 h 30", title: "Lilleau des Niges", detail: "Passez par la Maison du Fier." },
      { time: "19 h", title: "Coucher du soleil", detail: "Revenez vers un panorama autorisé." },
    ),
    practical: {
      parking: "Privilégier les parkings d’Ars-en-Ré ou de la Maison du Fier.",
      bike: "Le vélo est idéal sur les pistes balisées des marais.",
      accessibility:
        "Choisir les points d’observation et promenades adaptés auprès de l’Office de tourisme.",
      families:
        "Parcours modulable ; jumelles et explications sur les marées captivent les enfants.",
      dogs: "Tenir en laisse et respecter les interdictions des espaces protégés.",
    },
    premiumPage: {
      labels: {
        timeline: "Les quatre saisons du Fier",
        facts: "Dix clés pour lire le paysage",
        photos: "Les horizons du Fier d’Ars",
        nearby: "Explorer le nord de l’Île de Ré",
      },
      introduction: {
        title: "Un paysage qui change à chaque marée",
        paragraphs: [
          "Le matin, une lumière pâle glisse sur les herbes salées. Quelques heures plus tard, les vasières se découvrent et deviennent le territoire des oiseaux.",
          "Le Fier d’Ars se contemple comme un paysage en mouvement : les couleurs, les sons et les distances y changent au fil de l’eau.",
        ],
      },
      chapters: [
        {
          title: "Une baie façonnée par l’océan",
          paragraphs: [
            "Presque fermé, le Fier reste relié au pertuis Breton par un passage où circulent les marées.",
            "Courants et sédiments ont progressivement modelé le littoral et permis l’aménagement des marais.",
          ],
        },
        {
          title: "Les marais salants et le Fier",
          paragraphs: [
            "À partir du XIVe siècle, les hommes aménagent chenaux et bassins pour guider l’eau salée.",
            "Le saunier règle cette circulation puis laisse le soleil et le vent concentrer l’eau jusqu’à la cristallisation.",
          ],
        },
        {
          title: "Un paradis pour les oiseaux",
          paragraphs: [
            "Vasières et prés salés offrent une nourriture abondante tandis que digues et réserves procurent des zones de repos.",
            "Spatules, aigrettes, hérons, avocettes, tadornes, bernaches et nombreux limicoles se succèdent selon les saisons.",
          ],
        },
        {
          title: "Un équilibre vivant",
          paragraphs: [
            "L’entretien des marais participe au maintien d’un paysage culturel et naturel remarquable.",
            "Visiteurs, sauniers et protecteurs de la nature partagent un même impératif : respecter chemins, activités et tranquillité de la faune.",
          ],
        },
      ],
      timeline: [
        {
          year: "Printemps",
          title: "Lumière neuve",
          detail: "Nidification, végétation tendre et journées qui s’allongent.",
        },
        {
          year: "Été",
          title: "Le temps du sel",
          detail: "Soleil, vent et activité des salines structurent le paysage.",
        },
        {
          year: "Automne",
          title: "Grandes migrations",
          detail: "Les passages d’oiseaux renouvellent chaque point d’observation.",
        },
        {
          year: "Hiver",
          title: "Le Fier sauvage",
          detail:
            "Bernaches, ciels immenses et lumières basses composent une atmosphère plus secrète.",
        },
      ],
      facts: [
        {
          value: "Une baie",
          label: "presque fermée",
          detail: "Elle est relativement abritée de la houle du large.",
        },
        {
          value: "XIVe siècle",
          label: "premières salines",
          detail: "Les religieux participent aux premiers aménagements connus.",
        },
        {
          value: "XVe siècle",
          label: "extension",
          detail: "La sédimentation permet de gagner de nouveaux marais.",
        },
        {
          value: "2 marées",
          label: "chaque jour",
          detail: "Elles transforment en permanence les zones visibles.",
        },
        {
          value: "Vasières",
          label: "garde-manger",
          detail: "Elles sont essentielles à de nombreux oiseaux.",
        },
        {
          value: "Salines",
          label: "patrimoine vivant",
          detail: "Près de 70 sauniers sont réunis dans la coopérative selon l’Office de tourisme.",
        },
        {
          value: "Lilleau",
          label: "refuge protégé",
          detail: "La réserve occupe le cœur du Fier et des marais.",
        },
        {
          value: "Bernaches",
          label: "visiteuses d’hiver",
          detail: "Elles fréquentent la partie maritime du site.",
        },
        {
          value: "À vélo",
          label: "le bon rythme",
          detail: "Les pistes permettent une découverte douce.",
        },
        {
          value: "Toute l’année",
          label: "paysage accessible",
          detail: "Les ambiances changent avec les saisons et les marées.",
        },
      ],
      summit: {
        title: "Pourquoi nous aimons venir ici",
        paragraphs: [
          "Nous aimons le Fier tôt le matin, lorsque seuls les oiseaux troublent le silence et que chaque bassin reflète une nuance différente.",
          "C’est un endroit qui se découvre lentement. Nous nous arrêtons souvent, simplement pour regarder la lumière et attendre que le paysage change.",
        ],
      },
      photoSlots: [
        "Lever du soleil",
        "Coucher du soleil",
        "Grandes marées",
        "Oiseaux",
        "Panorama",
        "Pistes cyclables",
        "Marais",
      ].map((label) => ({ label, note: "Emplacement réservé à une photo fournie par Stéphanie." })),
      nearby: [
        {
          title: "Lilleau des Niges",
          detail: "Observer les oiseaux au cœur de la réserve.",
          href: "/patrimoine/lilleau-des-niges",
        },
        {
          title: "Les marais salants",
          detail: "Comprendre le savoir-faire des sauniers.",
          href: "/patrimoine/marais-salants-ile-de-re",
        },
        {
          title: "Le Phare des Baleines",
          detail: "Poursuivre jusqu’au grand large.",
          href: "/patrimoine/phare-des-baleines",
        },
        {
          title: "Les Écluses à Poissons",
          detail: "Découvrir un autre dialogue entre l’homme et l’océan.",
          href: "/patrimoine/ecluses-a-poissons-ile-de-re",
        },
      ],
      sources: [
        {
          label: "Destination Île de Ré — Marais et Fier d’Ars",
          href: "https://www.iledere.com/organiser-activites-et-loisirs/sites-de-visites-patrimoine-culture/marais-et-fier-dars-ars-en-re-fr-5459591/",
        },
        {
          label: "LPO — Lilleau des Niges",
          href: "https://www.lpo.fr/la-lpo-en-actions/preservation-des-espaces-naturels/nos-reserves-naturelles/rnn-de-lilleau-des-niges",
        },
        {
          label: "Réserves Naturelles de France",
          href: "https://reserves-naturelles.org/reserves/lilleau-des-niges/",
        },
      ],
    },
  },
  "ecluses-a-poissons-ile-de-re": {
    emotionalLead:
      "À marée basse, la mer retire son voile et révèle de longs murs de pierre. Le bruit de l’eau change, les oiseaux descendent sur l’estran et un savoir-faire médiéval réapparaît.",
    story: [
      "Les écluses apparaissent sur les côtes rétaises à la fin du Moyen Âge.",
      "Leurs murs en fer à cheval retiennent les poissons lorsque la marée descend, permettant aux habitants de cultiver champs et vignes avant de venir relever la pêche.",
      "Très nombreuses autrefois, elles ne sont plus qu’une quinzaine environ et exigent des réparations constantes après les tempêtes.",
      "L’ADEPIR, L’A.N.C.R.E. Maritaise et d’autres acteurs transmettent aujourd’hui les techniques et la connaissance de l’estran.",
    ],
    unique:
      "Ces pêcheries en pierres sèches utilisent la seule énergie de la marée et restent un patrimoine maritime vivant, fragile et presque unique.",
    mustSee: [
      "La forme en fer à cheval révélée à marée basse.",
      "Le détail des pierres assemblées sans mortier.",
      "La biodiversité de l’estran observée à distance.",
      "La grande écluse près de la pointe des Baleines.",
    ],
    idealDay: day(
      {
        time: "8 h 30",
        title: "Consulter les marées",
        detail: "Vérifiez horaire, météo et réglementation avant de partir.",
      },
      {
        time: "9 h 30",
        title: "Découverte",
        detail: "Observez depuis une zone autorisée ou avec un guide.",
      },
      { time: "11 h", title: "Plage", detail: "Poursuivez sans déplacer pierres ni animaux." },
      { time: "12 h 30", title: "Déjeuner", detail: "Faites une pause dans un village rétais." },
      { time: "15 h", title: "Patrimoine", detail: "Visitez Sainte-Marie ou un village proche." },
      { time: "17 h 30", title: "Pause gourmande", detail: "Choisissez une adresse locale." },
      {
        time: "20 h",
        title: "Coucher du soleil",
        detail: "Retrouvez l’océan depuis un accès autorisé.",
      },
    ),
    practical: {
      parking:
        "Utiliser les parkings indiqués près des plages et ne jamais bloquer les accès de secours.",
      bike: "Accès agréable à vélo, puis stationnement hors de l’estran.",
      accessibility:
        "Terrain rocheux, humide et glissant ; préférer les points de vue depuis la plage si nécessaire.",
      families: "Chaussures fermées et surveillance constante près de l’eau.",
      dogs: "Respecter les règles saisonnières des plages et tenir en laisse.",
    },
    premiumPage: {
      labels: {
        timeline: "Le cycle d’une marée",
        facts: "Dix secrets de pierre et d’océan",
        photos: "Les écluses révélées par la mer",
        nearby: "Poursuivre sur l’Île de Ré",
      },
      introduction: {
        title: "Quand la mer révèle ses secrets",
        paragraphs: [
          "La marée descend et les premiers alignements de pierres affleurent. Peu à peu, le mur entier apparaît, les oiseaux gagnent les flaques et le paysage devient presque lunaire.",
          "Ce que l’on pourrait prendre pour une simple digue est en réalité un piège à poissons conçu avec une connaissance très fine de la côte.",
        ],
      },
      chapters: [
        {
          title: "Une invention vieille de plusieurs siècles",
          paragraphs: [
            "Apparues à la fin du Moyen Âge, les écluses sécurisent une ressource alimentaire sans imposer une sortie en mer.",
            "Elles permettent aux Rétais de poursuivre le travail agricole puis de rejoindre l’estran au moment favorable.",
          ],
        },
        {
          title: "Comment fonctionne une écluse ?",
          paragraphs: [
            "À marée montante, l’eau et les poissons franchissent le mur recouvert. Lorsque la mer se retire, le mur guide les poissons vers la partie basse où l’eau continue de s’évacuer.",
            "Le dispositif repose sur la forme de l’ouvrage, la hauteur des pierres et le rythme naturel de la marée.",
          ],
        },
        {
          title: "Un patrimoine vivant",
          paragraphs: [
            "Tempêtes et houle déplacent les pierres. Les codétenteurs et bénévoles surveillent, réparent et transmettent les gestes nécessaires.",
            "L’ADEPIR œuvre à la sauvegarde de ces dernières pêcheries en activité.",
          ],
        },
        {
          title: "Tout un monde sur l’estran",
          paragraphs: [
            "Poissons, crevettes, crabes, anémones, étoiles de mer et coquillages occupent les flaques et rochers.",
            "Cette biodiversité s’observe sans prélèvement ni manipulation, en respectant strictement les distances de protection.",
          ],
        },
      ],
      timeline: [
        {
          year: "Marée montante",
          title: "L’océan entre",
          detail: "L’eau recouvre progressivement le mur et les poissons circulent.",
        },
        {
          year: "Pleine mer",
          title: "L’écluse disparaît",
          detail: "L’ouvrage est presque entièrement recouvert.",
        },
        {
          year: "Jusant",
          title: "L’eau se retire",
          detail: "Le mur guide les poissons vers la partie basse.",
        },
        {
          year: "Marée basse",
          title: "Le patrimoine se révèle",
          detail: "L’écluse devient visible, sans autoriser l’intrusion dans sa zone protégée.",
        },
      ],
      facts: [
        {
          value: "Moyen Âge",
          label: "origine",
          detail: "Les premières écluses rétaises apparaissent à la fin de cette période.",
        },
        {
          value: "Fer à cheval",
          label: "forme",
          detail: "Deux bras de pierre s’étendent sur l’estran.",
        },
        {
          value: "Pierres sèches",
          label: "technique",
          detail: "Les éléments sont assemblés et bloqués sans mortier.",
        },
        {
          value: "115",
          label: "en 1727",
          detail: "Nombre approximatif mentionné par l’Office de tourisme.",
        },
        {
          value: "140",
          label: "en 1900",
          detail: "Elles étaient encore en activité autour de l’île.",
        },
        {
          value: "14",
          label: "aujourd’hui",
          detail: "L’Office de tourisme recense environ quatorze ouvrages restants.",
        },
        {
          value: "25 mètres",
          label: "distance protégée",
          detail: "Il est interdit d’y pénétrer ou d’y pêcher selon les règles officielles.",
        },
        {
          value: "2 marées",
          label: "rythme quotidien",
          detail: "Surveillance et entretien suivent l’océan.",
        },
        {
          value: "ADEPIR",
          label: "sauvegarde",
          detail: "L’association entretient et valorise ce patrimoine.",
        },
        {
          value: "Montamer",
          label: "lieu de découverte",
          detail: "L’A.N.C.R.E. Maritaise explique gratuitement le littoral.",
        },
      ],
      summit: {
        title: "Pourquoi nous aimons cet endroit",
        paragraphs: [
          "Nous aimons arriver avant la marée basse et regarder le dessin de pierre apparaître lentement. Le paysage semble alors raconter lui-même son histoire.",
          "Notre conseil est simple : ne vous pressez pas et ne touchez à rien. Chaque pierre déplacée fragilise un ouvrage entretenu depuis des générations.",
        ],
      },
      photoSlots: [
        "Vue aérienne",
        "Marée basse",
        "Coucher de soleil",
        "Détail des pierres",
        "Pêche traditionnelle",
        "Grandes marées",
        "Panorama",
      ].map((label) => ({ label, note: "Emplacement réservé à une photo fournie par Stéphanie." })),
      futureModule: {
        title: "🗓️ Les marées du jour",
        status: "Données en attente de connexion",
        description:
          "La structure est prête mais reste volontairement inactive tant qu’une source fiable de marées n’est pas connectée.",
        items: [
          "Horaires de marée haute et basse",
          "Coefficient",
          "Indication idéale, partielle ou recouverte",
        ],
      },
      nearby: [
        {
          title: "Le Fier d’Ars",
          detail: "Observer un autre paysage façonné par les marées.",
          href: "/patrimoine/fier-d-ars",
        },
        {
          title: "Lilleau des Niges",
          detail: "Découvrir les oiseaux des marais.",
          href: "/patrimoine/lilleau-des-niges",
        },
        {
          title: "Le Phare des Baleines",
          detail: "Voir la plus grande écluse près de la pointe.",
          href: "/patrimoine/phare-des-baleines",
        },
        {
          title: "Les marais salants",
          detail: "Comprendre une autre maîtrise rétaise de l’eau.",
          href: "/patrimoine/marais-salants-ile-de-re",
        },
      ],
      sources: [
        {
          label: "Destination Île de Ré — Écluses à poissons",
          href: "https://www.iledere.com/decouvrir/les-incontournables/les-ecluses-a-poissons/",
        },
        {
          label: "Destination Île de Ré — Sensibilisation à l’estran",
          href: "https://www.iledere.com/decouvrir/destination-durable-ecotourisme/sensibilisation-autour-de-lestran/",
        },
        {
          label: "Destination Île de Ré — ADEPIR",
          href: "https://www.iledere.com/organiser-activites-et-loisirs/sport-et-sensation/ecoles-clubs-associations/participez-a-la-protection-des-ecluses-a-poissons-avec-ladepir-sainte-marie-de-re-fr-4003627/",
        },
      ],
    },
  },
  "pont-de-l-ile-de-re": {
    emotionalLead:
      "La route s’élève, l’océan apparaît et le continent commence à s’éloigner. Même après de nombreux passages, la traversée garde ce petit frisson qui annonce les vacances.",
    story: [
      "Avant 1988, l’accès dépend des bateaux et des bacs, avec les contraintes de capacité, de météo et d’horaires.",
      "Construit en moins de deux ans, le pont est mis en service en 1988 entre La Rochelle et Rivedoux-Plage.",
      "Ses 796 voussoirs préfabriqués et ses 28 piles composent une courbe de près de trois kilomètres au-dessus du pertuis.",
      "Aujourd’hui, voitures, bus, navettes, cyclistes et piétons partagent cet accès devenu une signature du paysage.",
    ],
    unique:
      "À la fois ouvrage d’ingénierie et seuil émotionnel, le pont transforme une traversée fonctionnelle en première expérience de l’île.",
    mustSee: [
      "La courbe complète depuis Rivedoux-Plage.",
      "L’océan qui apparaît au sommet.",
      "Les quatre passes navigables.",
      "La lumière du soir sous le tablier.",
    ],
    idealDay: day(
      { time: "9 h", title: "Traversée", detail: "Découvrez progressivement Rivedoux-Plage." },
      { time: "9 h 30", title: "Rivedoux", detail: "Faites une première pause au bord de l’eau." },
      {
        time: "10 h 30",
        title: "Marché",
        detail: "Découvrez les produits du village selon les jours d’ouverture.",
      },
      { time: "12 h 30", title: "Déjeuner", detail: "Prenez le temps d’une table rétaise." },
      { time: "15 h", title: "Vélo", detail: "Suivez la côte vers La Flotte." },
      {
        time: "18 h 30",
        title: "Coucher de soleil",
        detail: "Regardez le pont changer de couleur depuis la plage.",
      },
    ),
    practical: {
      parking:
        "Parkings du Belvédère côté continent et de Sablanceaux côté île selon les usages autorisés.",
      bike: "Piste dédiée côté nord ; passage gratuit, prévoir vent et éclairage.",
      accessibility:
        "Bus, navettes et cheminement piéton existent ; vérifier les services adaptés avant le départ.",
      families:
        "À vélo, adapter l’effort des enfants à la pente et au vent ; casque vivement recommandé.",
      dogs: "À pied, tenir en laisse courte et protéger l’animal du bruit, du vent et de la chaleur.",
    },
    premiumPage: {
      labels: {
        timeline: "De la liaison maritime au pont",
        facts: "Dix chiffres pour mesurer l’ouvrage",
        photos: "Le pont entre ciel et océan",
        nearby: "Premières découvertes sur l’Île de Ré",
      },
      introduction: {
        title: "Tout commence ici",
        paragraphs: [
          "Depuis La Rochelle, la chaussée monte doucement. Les bâtiments disparaissent, l’océan s’ouvre de chaque côté et les premiers voiliers donnent soudain une autre échelle au paysage.",
          "À l’horizon, Rivedoux-Plage se rapproche. Ce passage de quelques minutes suffit souvent à laisser le quotidien derrière soi.",
        ],
      },
      chapters: [
        {
          title: "Une île longtemps accessible par bateau",
          paragraphs: [
            "Pendant des siècles, traversées et bacs assurent la liaison avec le continent. Les horaires, la capacité et la météo rythment la vie des habitants comme celle des visiteurs.",
            "L’augmentation des déplacements conduit à envisager une liaison permanente.",
          ],
        },
        {
          title: "Un chantier hors norme",
          paragraphs: [
            "Le chantier mobilise préfabrication, béton précontraint et travail maritime. Les voussoirs sont assemblés progressivement entre les piles.",
            "En moins de deux ans, l’ouvrage relie La Rochelle à Rivedoux-Plage et ouvre en mai 1988.",
          ],
        },
        {
          title: "Une prouesse d’ingénierie",
          paragraphs: [
            "La courbe du tablier franchit près de trois kilomètres et ménage quatre passes offrant au moins trente mètres de tirant d’air.",
            "Les piles, le béton et l’acier résistent aux vents, courants et embruns tandis qu’un entretien permanent préserve l’ouvrage.",
          ],
        },
        {
          title: "Le pont aujourd’hui",
          paragraphs: [
            "La route reste ouverte jour et nuit. L’écotaxe perçue sur les véhicules motorisés en direction de l’île contribue notamment aux espaces naturels sensibles.",
            "Piétons et cyclistes disposent de voies dédiées et traversent gratuitement.",
          ],
        },
        {
          title: "🚲 Traverser le pont à vélo",
          paragraphs: [
            "À vélo, la montée demande un effort régulier et le vent peut être sensible. La piste dédiée permet toutefois de prendre le temps de voir l’île se dévoiler.",
            "Au sommet, l’horizon, les voiliers et les côtes donnent à la traversée une dimension que l’on perçoit moins en voiture. La descente conduit progressivement vers Sablanceaux et Rivedoux-Plage.",
          ],
        },
      ],
      timeline: [
        {
          year: "Avant 1988",
          title: "Bacs et bateaux",
          detail: "La liaison maritime organise les déplacements vers l’île.",
        },
        {
          year: "1986",
          title: "Chantier",
          detail:
            "La construction commence avec des méthodes de préfabrication et de précontrainte.",
        },
        {
          year: "19 mai 1988",
          title: "Inauguration",
          detail: "Le pont ouvre une liaison permanente avec Rivedoux-Plage.",
        },
        {
          year: "2012",
          title: "Écotaxe",
          detail: "Elle remplace l’ancien péage et contribue à la protection des espaces naturels.",
        },
      ],
      facts: [
        {
          value: "2 926,5 m",
          label: "de longueur",
          detail: "Près de trois kilomètres au-dessus du pertuis.",
        },
        {
          value: "15,50 m",
          label: "de largeur",
          detail: "Route, piste cyclable et voie piétonne partagent le tablier.",
        },
        {
          value: "28 piles",
          label: "de soutien",
          detail: "Trois sur la plage rétaise, vingt-trois en mer et deux côté La Rochelle.",
        },
        {
          value: "796",
          label: "voussoirs",
          detail: "Des éléments préfabriqués assemblés par précontrainte.",
        },
        {
          value: "4",
          label: "passes navigables",
          detail: "Elles offrent au minimum trente mètres de tirant d’air.",
        },
        {
          value: "54 000 m³",
          label: "de béton",
          detail: "Volume approximatif annoncé par le Département.",
        },
        {
          value: "7 300 t",
          label: "d’acier",
          detail: "Une autre mesure de l’ampleur du chantier.",
        },
        {
          value: "42 m",
          label: "au-dessus de la mer",
          detail: "Hauteur maximale indiquée par l’Office de tourisme.",
        },
        {
          value: "Moins de 2 ans",
          label: "de construction",
          detail: "Un calendrier exceptionnel pour un tel ouvrage.",
        },
        {
          value: "Gratuit",
          label: "à pied et à vélo",
          detail: "Les véhicules motorisés paient en direction de l’île.",
        },
      ],
      summit: {
        title: "Pourquoi nous aimons ce moment",
        paragraphs: [
          "À chaque passage, nous retrouvons la même sensation : le quotidien reste derrière nous et l’île commence à se dévoiler.",
          "Si vous arrivez en fin de journée, arrêtez-vous ensuite à Rivedoux-Plage. La courbe du pont prend alors des couleurs magnifiques.",
        ],
      },
      photoSlots: [
        "Lever du soleil",
        "Coucher du soleil",
        "Vue aérienne",
        "Traversée",
        "Piste cyclable",
        "Panorama",
        "Vue depuis la mer",
      ].map((label) => ({ label, note: "Emplacement réservé à une photo fournie par Stéphanie." })),
      nearby: [
        {
          title: "Fort La Prée",
          detail: "Commencer l’histoire militaire de l’île près de Rivedoux.",
          href: "/patrimoine/fort-la-pree",
        },
        {
          title: "L’Abbaye des Châteliers",
          detail: "Poursuivre vers La Flotte et ses ruines cisterciennes.",
          href: "/patrimoine/abbaye-des-chateliers",
        },
        {
          title: "Le port de La Flotte",
          detail: "Découvrir quais, marché et patrimoine maritime.",
          href: "/patrimoine/port-de-la-flotte",
        },
        {
          title: "Saint-Martin et Vauban",
          detail: "Rejoindre les remparts inscrits à l’UNESCO.",
          href: "/patrimoine/fortifications-vauban-saint-martin-de-re",
        },
      ],
      sources: [
        {
          label: "Département de la Charente-Maritime — Pont de Ré",
          href: "https://la.charente-maritime.fr/routes-transports/ponts/pont-lile-re",
        },
        {
          label: "Destination Île de Ré — Venir sur l’île",
          href: "https://www.iledere.com/sinformer/acces-et-transports/venir-a-ile-de-re/",
        },
        {
          label: "Département — tarifs officiels",
          href: "https://la.charente-maritime.fr/transport-routes/tarifs-pont-re/tarifs-dun-aller-retour",
        },
      ],
    },
  },
  "marais-salants-ile-de-re": {
    emotionalLead:
      "Depuis des siècles, les marais salants façonnent les paysages de l’Île de Ré. Entre ciel, eau et lumière, ils racontent une histoire où la nature et le savoir-faire humain avancent ensemble.",
    story: [
      "Les marais salants rétais sont le résultat d’un patient travail d’aménagement. Digues, chenaux et bassins conduisent l’eau de mer à travers une succession de niveaux où elle se concentre sous l’action du soleil et du vent.",
      "Le saunier ne fabrique pas le sel : il crée les conditions de sa cristallisation. Il entretient les levées, règle les passages d’eau et récolte le gros sel puis, lorsque les conditions s’y prêtent, la fleur de sel à la surface des œillets.",
      "Cette activité a façonné l’économie, les villages et les paysages de l’île. Après une période de recul, le métier connaît un renouveau qui associe transmission des gestes, qualité du produit et entretien d’un milieu remarquable.",
      "Les bassins accueillent une biodiversité adaptée aux variations de salinité. Oiseaux migrateurs, plantes des milieux salés, poissons et insectes composent un écosystème complexe. La découverte demande discrétion et respect des chemins : le marais est à la fois un lieu de travail et un milieu fragile.",
    ],
    unique:
      "Ici, patrimoine culturel et patrimoine naturel sont indissociables. Sans le geste humain, le dessin des bassins disparaît ; sans l’équilibre du milieu, l’activité perd son paysage.",
    mustSee: [
      "Le réseau des bassins vu depuis un chemin autorisé.",
      "Les pyramides de sel au moment de la récolte.",
      "Les oiseaux se nourrissant dans les vasières.",
      "La lumière dorée qui transforme l’eau en miroir en fin de journée.",
    ],
    idealDay: day(
      {
        time: "9 h",
        title: "Visite d’un marais",
        detail: "Découvrez le chemin de l’eau et les bassins dans le calme du matin.",
      },
      {
        time: "10 h 30",
        title: "Rencontre avec un saunier",
        detail:
          "Écoutez les gestes, les saisons et les exigences du métier selon les visites proposées.",
      },
      {
        time: "12 h",
        title: "Déjeuner local",
        detail: "Goûtez les produits de l’île et la fleur de sel récoltée localement.",
      },
      {
        time: "14 h",
        title: "Balade à vélo",
        detail: "Suivez les pistes autorisées entre Ars-en-Ré, Loix et les marais.",
      },
      {
        time: "16 h",
        title: "Lilleau des Niges",
        detail: "Observez la biodiversité sans quitter les chemins balisés.",
      },
      {
        time: "18 h 30",
        title: "Coucher de soleil",
        detail: "Regardez les bassins devenir des miroirs lorsque la lumière décline.",
      },
    ),
    practical: {
      parking: "Utiliser les parkings des villages et sites de visite.",
      bike: "Le vélo est idéal, à condition de rester sur les pistes et chemins autorisés.",
      accessibility: "Certaines visites disposent d’aménagements ; vérifier auprès de chaque site.",
      families: "Une visite guidée rend les gestes et le cycle de l’eau très accessibles.",
      dogs: "Laisse indispensable ; certains espaces naturels peuvent être interdits.",
    },
    premiumPage: {
      labels: {
        timeline: "Près de mille ans d’histoire",
        facts: "Douze secrets des marais",
        photos: "Les marais entre ciel et eau",
        nearby: "Poursuivre sur l’Île de Ré",
      },
      introduction: {
        title: "Là où le ciel se reflète dans la terre",
        paragraphs: [
          "Au premier regard, ce sont les reflets qui arrêtent le pas. Le ciel descend dans les bassins, le vent ride l’eau et chaque œillet prend une couleur différente.",
          "Au loin, un saunier avance entre les levées. Les oiseaux traversent les vasières, les pyramides de sel ponctuent le paysage et le soir transforme les bassins en miroirs. Rien n’est immobile : l’eau circule, le sel se concentre et la lumière recommence son spectacle.",
        ],
      },
      chapters: [
        {
          title: "Une histoire vieille de près de mille ans",
          paragraphs: [
            "Les premiers aménagements sont entrepris au Moyen Âge. Des digues gagnent progressivement des terres sur la mer et dessinent un réseau de salines qui finit par donner à l’île une partie de sa forme actuelle.",
            "Du Moyen Âge au XIXᵉ siècle, l’or blanc soutient la prospérité rétaise. Les cargaisons partent vers le royaume de France et le nord de l’Europe, où le sel joue un rôle essentiel dans la conservation des aliments.",
            "À l’apogée du XIXᵉ siècle, les salines occupent près d’un cinquième de l’île et produisent jusqu’à environ 30 000 tonnes par an. Après le déclin industriel, le métier renaît au début des années 1990 autour d’une nouvelle génération de sauniers.",
          ],
        },
        {
          title: "Le métier de saunier",
          paragraphs: [
            "Le saunier lit la météo, le vent, la salinité et le niveau de chaque bassin. Au printemps, il remet le marais en état ; en été, il guide l’eau et récolte ; en automne et en hiver, il entretient les levées et prépare la saison suivante.",
            "Ses outils prolongent des gestes anciens : le simoussi déplace les vases, le las rassemble le gros sel et la lousse cueille délicatement la fleur de sel. Une journée de récolte dépend entièrement des éléments et peut commencer tôt puis se prolonger tant que les conditions restent favorables.",
            "Ce savoir-faire se transmet par l’observation et la pratique. Il demande patience, précision et humilité : le saunier accompagne la nature, sans jamais pouvoir lui imposer une récolte.",
          ],
        },
        {
          title: "La fleur de sel",
          paragraphs: [
            "Le gros sel cristallise au fond des bassins argileux. La fleur de sel, elle, apparaît à la surface sous la forme d’une pellicule fine et fragile lorsque le vent et la chaleur réunissent les bonnes conditions.",
            "Elle est cueillie à la main avec la lousse, sans toucher le fond du bassin. Sa rareté, sa texture et la précision de sa récolte expliquent qu’elle soit particulièrement recherchée en cuisine.",
            "Depuis 2023, le sel et la fleur de sel de l’Île de Ré bénéficient d’une Indication Géographique Protégée qui reconnaît leur origine et le savoir-faire insulaire.",
          ],
        },
        {
          title: "Une biodiversité exceptionnelle",
          paragraphs: [
            "Chenaux, lagunes, prés salés et bassins forment une mosaïque d’habitats. Leur salinité variable accueille des plantes adaptées au sel, des poissons des marais, des insectes et des amphibiens.",
            "Situés sur une grande voie de migration, les marais du Fier d’Ars offrent nourriture et repos à de nombreux oiseaux migrateurs et hivernants. Cette richesse se contemple à distance, en restant sur les chemins et en préservant le calme.",
            "Le travail des sauniers entretient aussi ces paysages ouverts. Ici, patrimoine naturel et patrimoine humain restent intimement liés.",
          ],
        },
      ],
      timeline: [
        {
          year: "XIᵉ–XIIᵉ siècles",
          title: "Premiers aménagements",
          detail:
            "Les moines et bâtisseurs de marais commencent à endiguer et dessiner les salines.",
        },
        {
          year: "Moyen Âge",
          title: "L’or blanc",
          detail:
            "Le commerce du sel contribue à la prospérité de l’île et nourrit les échanges maritimes.",
        },
        {
          year: "XIXᵉ siècle",
          title: "L’apogée",
          detail:
            "Les salines occupent près de 20 % du territoire et la production atteint environ 30 000 tonnes par an.",
        },
        {
          year: "XXᵉ siècle",
          title: "Le déclin",
          detail:
            "Industrialisation, concurrence et chute des prix entraînent l’abandon de nombreux marais.",
        },
        {
          year: "Années 1990",
          title: "Le renouveau",
          detail: "La profession se réorganise et une nouvelle génération reprend les marais.",
        },
        {
          year: "2023",
          title: "Reconnaissance IGP",
          detail:
            "Le sel et la fleur de sel de l’Île de Ré obtiennent l’Indication Géographique Protégée.",
        },
      ],
      facts: [
        {
          value: "Blanc",
          label: "le sel rétais",
          detail:
            "Sa teinte vient notamment de sa cristallisation et de sa récolte artisanale dans les bassins.",
        },
        {
          value: "Rose",
          label: "certains bassins",
          detail:
            "Des micro-organismes adaptés aux fortes salinités peuvent colorer l’eau lorsque la concentration augmente.",
        },
        {
          value: "Surface",
          label: "la fleur de sel",
          detail: "Elle forme une fine pellicule cueillie délicatement à la main.",
        },
        {
          value: "Fond",
          label: "le gros sel",
          detail: "Ses cristaux plus épais se déposent au fond des œillets.",
        },
        {
          value: "Vent + soleil",
          label: "les deux alliés",
          detail: "Ils accélèrent l’évaporation et la concentration de l’eau de mer.",
        },
        {
          value: "≈ 1 500 ha",
          label: "gagnés sur la mer",
          detail: "Les bâtisseurs ont progressivement façonné une grande partie du nord de l’île.",
        },
        {
          value: "≈ 30 000 t",
          label: "à l’apogée",
          detail: "Production annuelle indiquée pour le XIXᵉ siècle par la Coopérative.",
        },
        {
          value: "Nord de l’Europe",
          label: "destination historique",
          detail:
            "Le sel rétais voyageait notamment vers les Pays-Bas, l’Allemagne et le Danemark.",
        },
        {
          value: "Été",
          label: "temps des récoltes",
          detail: "La production dépend d’une météo chaude, sèche et ventée.",
        },
        {
          value: "Hiver",
          label: "temps de l’entretien",
          detail: "Le marais se repose tandis que levées et outils sont préparés.",
        },
        {
          value: "Oiseaux",
          label: "halte migratoire",
          detail: "Les vasières et lagunes offrent nourriture et repos sur la voie est-atlantique.",
        },
        {
          value: "IGP 2023",
          label: "origine protégée",
          detail: "Elle reconnaît le produit, son territoire et le savoir-faire des sauniers.",
        },
      ],
      summit: {
        title: "Pourquoi nous aimons cet endroit",
        paragraphs: [
          "Nous aimons venir ici en fin de journée, lorsque le vent tombe et que le ciel se reflète dans les bassins. Chaque coucher de soleil est différent et les couleurs changent sans cesse.",
          "Notre conseil : découvrez les marais une première fois le matin, dans le silence, puis revenez lorsque la lumière devient dorée. Et ne repartez pas sans goûter une fleur de sel récoltée localement.",
        ],
      },
      processModule: {
        title: "Comment l’eau de mer devient-elle sel ?",
        introduction:
          "Le marais est une machine douce, entièrement guidée par la gravité, le soleil, le vent et le geste du saunier.",
        steps: [
          {
            title: "1. L’eau entre",
            detail: "À marée favorable, l’eau de mer rejoint le vasais par les chenaux.",
          },
          {
            title: "2. Elle décante",
            detail:
              "Elle traverse successivement cobier, fares et bassins où elle se réchauffe et se concentre.",
          },
          {
            title: "3. Elle atteint les œillets",
            detail: "Une lame d’eau très peu profonde arrive dans les aires de cristallisation.",
          },
          {
            title: "4. Le sel cristallise",
            detail:
              "Le gros sel se dépose au fond tandis que la fleur peut se former à la surface.",
          },
          {
            title: "5. Le saunier récolte",
            detail: "Le las rassemble le gros sel ; la lousse cueille la fleur de sel à la main.",
          },
        ],
      },
      seasonsModule: {
        title: "Les marais au fil des saisons",
        seasons: [
          {
            name: "Printemps",
            title: "Le paysage renaît",
            detail:
              "Les oiseaux reviennent, les œillets sont préparés et les premiers reflets réapparaissent.",
          },
          {
            name: "Été",
            title: "Le temps du sel",
            detail:
              "Le travail des sauniers bat son plein et les récoltes dépendent du soleil et du vent.",
          },
          {
            name: "Automne",
            title: "Les lumières douces",
            detail: "Les migrateurs font halte et les bassins prennent des nuances plus profondes.",
          },
          {
            name: "Hiver",
            title: "Le grand calme",
            detail:
              "Les récoltes cessent, l’entretien commence et les grands ciels transforment le paysage.",
          },
        ],
      },
      photoSlots: ["Lever du soleil", "Fleur de sel", "Oiseaux", "Bassins vus du ciel"].map(
        (label) => ({
          label,
          note: "Photo encore absente de la photothèque ; emplacement prêt pour un futur média authentique Beaux Rivages.",
        }),
      ),
      addressSlots: [
        {
          category: "Producteur de sel",
          note: "Photo, adresse, site et recommandation à renseigner depuis la photothèque et le CMS.",
        },
        {
          category: "Fleur de sel",
          note: "Producteur recommandé à sélectionner par Stéphanie & Bruno.",
        },
        {
          category: "Visite guidée",
          note: "Ajouter ici une visite vérifiée et directement réservable auprès du prestataire.",
        },
      ],
      nearby: [
        {
          title: "Le Fier d’Ars",
          detail: "Comprendre la baie qui nourrit les marais.",
          href: "/patrimoine/fier-d-ars",
        },
        {
          title: "Lilleau des Niges",
          detail: "Observer les oiseaux au cœur de la réserve.",
          href: "/patrimoine/lilleau-des-niges",
        },
        {
          title: "Le Phare des Baleines",
          detail: "Rejoindre la pointe occidentale de l’île.",
          href: "/patrimoine/phare-des-baleines",
        },
        {
          title: "Les Écluses à poissons",
          detail: "Explorer un autre savoir-faire lié à l’océan.",
          href: "/patrimoine/ecluses-a-poissons-ile-de-re",
        },
      ],
      sources: [
        {
          label: "Destination Île de Ré — Les marais salants",
          href: "https://www.iledere.com/decouvrir/bienvenue-ile-de-re/un-ecrin-naturel/les-marais-salants/",
        },
        {
          label: "Coopérative des Sauniers — Histoire des marais",
          href: "https://sauniers-iledere.com/decouvrir/histoire-des-marais-salants/",
        },
        {
          label: "Communauté de communes — Espèces et habitats remarquables",
          href: "https://cdciledere.fr/les-especes-et-habitats-remarquables-de-notre-territoire/",
        },
      ],
    },
  },
  "port-de-la-flotte": {
    emotionalLead:
      "À La Flotte, les bateaux semblent entrer jusque dans le village. Les quais, les façades et le marché composent une scène quotidienne où le patrimoine reste naturellement vivant.",
    story: [
      "Le port se développe grâce aux échanges maritimes de l’île : vin, sel et marchandises circulent entre Ré et le continent. Sa position et son bassin abrité structurent durablement le village.",
      "Les quais ont vu se succéder embarcations de travail, cabotage et plaisance. Les maisons et commerces proches du bassin témoignent d’une économie tournée vers la mer.",
      "À quelques rues, le marché d’inspiration médiévale complète ce récit. Ses pavés, ses halles et ses étals font de la visite une expérience de village plutôt qu’un simple passage portuaire.",
      "Aujourd’hui, le port conserve une échelle intime. Sa beauté vient moins d’un monument isolé que de l’accord entre l’eau, les bateaux, les terrasses et les ruelles.",
    ],
    unique:
      "Le port et le marché forment un ensemble particulièrement cohérent : patrimoine maritime et vie gourmande s’y découvrent à quelques minutes l’un de l’autre.",
    mustSee: [
      "Le bassin à marée haute et le reflet des façades.",
      "Les bateaux traditionnels parmi les unités de plaisance.",
      "Le marché et ses étals matinaux.",
      "La perspective sur les quais depuis l’extrémité du port.",
    ],
    idealDay: day(
      {
        time: "8 h 30",
        title: "Marché",
        detail: "Arrivez tôt pour rencontrer producteurs et commerçants.",
      },
      { time: "10 h", title: "Ruelles", detail: "Rejoignez le port par les venelles du village." },
      { time: "11 h", title: "Quais", detail: "Observez le bassin et les détails des bateaux." },
      { time: "12 h 30", title: "Déjeuner", detail: "Choisissez une adresse du village." },
      {
        time: "16 h",
        title: "Littoral",
        detail: "Rentrez à vélo par la côte vers Rivedoux-Plage.",
      },
    ),
    practical: {
      parking: "Parkings périphériques recommandés.",
      bike: "Accès direct et agréable depuis les maisons de Rivedoux-Plage.",
      accessibility: "Quais et centre en partie pavés ; circulation dense en saison.",
      families: "Parcours compact, facile à adapter aux enfants.",
      dogs: "Laisse recommandée dans le marché et sur les quais.",
    },
  },
  "foret-des-saumonards": {
    emotionalLead:
      "Entre Boyardville et l’océan, la forêt ralentit le monde. Les pins filtrent la lumière, le sable assourdit les pas et Fort Boyard apparaît soudain au bout d’une trouée.",
    story: [
      "La forêt des Saumonards appartient au grand ensemble littoral qui protège les sols sableux et accompagne les dunes du nord-est d’Oléron. Pins maritimes et chênes verts dominent un milieu façonné par le vent et les embruns.",
      "Le couvert forestier joue un rôle paysager et écologique. Il abrite oiseaux, insectes et petits mammifères, tandis que la végétation dunaire fixe les sables les plus mobiles.",
      "Les chemins relient Boyardville aux plages et offrent une manière douce de découvrir le littoral. Cette proximité ne doit pas faire oublier la fragilité du milieu : sorties de sentier, feu et piétinement des dunes peuvent avoir des conséquences durables.",
      "Face à la plage, Fort Boyard réapparaît. L’alliance de la forêt, de la dune et de cette silhouette maritime crée un paysage unique, particulièrement familier aux voyageurs du Nid d’Été.",
    ],
    unique:
      "En quelques minutes, on passe d’un port animé à une forêt silencieuse puis à une plage ouverte sur Fort Boyard. Cette succession de paysages est l’une des signatures de Boyardville.",
    mustSee: [
      "Les jeux de lumière sous les pins.",
      "La végétation de dune observée depuis les passages aménagés.",
      "Fort Boyard au bout de la plage.",
      "Les traces discrètes de la faune au petit matin.",
    ],
    idealDay: day(
      {
        time: "8 h",
        title: "Forêt",
        detail: "Marchez dans la fraîcheur en restant sur les chemins.",
      },
      { time: "9 h", title: "Plage", detail: "Découvrez Fort Boyard dans la lumière matinale." },
      { time: "11 h", title: "Boyardville", detail: "Rejoignez le marché ou le port." },
      {
        time: "15 h",
        title: "Retour sous les pins",
        detail: "Profitez de l’ombre aux heures chaudes.",
      },
      {
        time: "18 h",
        title: "Rivage",
        detail: "Terminez par une promenade respectueuse de la réglementation.",
      },
    ),
    practical: {
      parking: "Utiliser uniquement les parkings autorisés.",
      bike: "Très adaptée au vélo sur les itinéraires balisés.",
      accessibility: "Sable et chemins naturels peuvent limiter l’accès.",
      families: "Prévoir eau, protection solaire et repères simples pour les enfants.",
      dogs: "Règles variables selon forêt, plages, saison et risques incendie ; vérifier la signalisation.",
    },
  },
  "citadelle-du-chateau-d-oleron": {
    emotionalLead:
      "Au Château-d’Oléron, la pierre militaire regarde aujourd’hui un port de cabanes colorées. La citadelle raconte comment un lieu de défense peut devenir un paysage de promenade et de création.",
    story: [
      "La position du Château-d’Oléron commande le sud de l’île et les accès maritimes vers Rochefort. Une fortification antérieure précède les grands travaux engagés sous Louis XIV.",
      "Vauban intervient dans un système défensif plus vaste protégeant l’arsenal. Bastions, courtines et ouvrages avancés s’adaptent au terrain et au rivage. La pierre claire et les perspectives répondent à une logique militaire précise.",
      "La citadelle connaît les transformations, les conflits et les usages successifs. Ses volumes ne sont pas restés figés : destructions et restaurations ont modifié la lecture du site.",
      "Aujourd’hui, remparts, espaces culturels, port ostréicole et cabanes d’artistes forment un ensemble singulier. La promenade relie la discipline géométrique des fortifications à la liberté des couleurs et des ateliers.",
    ],
    unique:
      "Nulle part ailleurs sur l’île la monumentalité de Vauban ne dialogue aussi directement avec l’ostréiculture et la création contemporaine.",
    mustSee: [
      "Les perspectives depuis les remparts.",
      "Les portes et passages dans l’épaisseur des ouvrages.",
      "La vue vers le port et les chenaux.",
      "Le contraste entre pierre blonde et cabanes colorées.",
    ],
    idealDay: day(
      { time: "9 h 30", title: "Citadelle", detail: "Parcourez les remparts avant la chaleur." },
      {
        time: "11 h",
        title: "Port ostréicole",
        detail: "Descendez vers les chenaux et les cabanes.",
      },
      {
        time: "12 h 30",
        title: "Dégustation",
        detail: "Choisissez un producteur ouvert et respectez les espaces de travail.",
      },
      {
        time: "15 h",
        title: "Ateliers",
        detail: "Rencontrez artistes et artisans selon leurs horaires.",
      },
      {
        time: "18 h",
        title: "Retour aux remparts",
        detail: "Observez la lumière relier le port et la citadelle.",
      },
    ),
    practical: {
      parking: "Parkings près du centre et du port.",
      bike: "Accès possible par les itinéraires cyclables d’Oléron.",
      accessibility: "Certaines zones sont accessibles, d’autres présentent pavés et pentes.",
      families: "Visite libre adaptée, avec vigilance sur les hauteurs et près de l’eau.",
      dogs: "Laisse recommandée, notamment dans les zones portuaires actives.",
    },
  },
  "cabanes-ostreicoles-chateau-d-oleron": {
    emotionalLead:
      "Rouges, bleues, jaunes ou vertes, les cabanes ne sont pas une mise en scène. Elles appartiennent à un paysage de travail que la création contemporaine a choisi d’habiter sans l’effacer.",
    story: [
      "Le bassin de Marennes-Oléron est intimement lié à l’élevage et à l’affinage des huîtres. Autour des chenaux, les cabanes servent au matériel, au tri, au conditionnement et aux gestes quotidiens des professionnels.",
      "Le bois, facile à construire et à réparer, donne au port cette échelle légère. Les couleurs permettent d’identifier les bâtiments et résistent visuellement au ciel, à la vase et aux eaux changeantes.",
      "Lorsque certaines cabanes perdent leur usage initial, une politique de reconversion accueille artistes et artisans. Le projet évite la disparition d’un patrimoine modeste tout en maintenant une activité.",
      "La promenade traverse donc deux mondes complémentaires. Il faut distinguer les cabanes de production, où le travail exige prudence et respect, des ateliers ouverts au public. Les échanges avec celles et ceux qui y travaillent donnent au lieu sa véritable profondeur.",
    ],
    unique:
      "Ce patrimoine n’est ni entièrement ancien ni entièrement reconstruit : il évolue encore. La couleur, le geste ostréicole et la création forment une identité vivante.",
    mustSee: [
      "Les alignements de cabanes le long des chenaux.",
      "Les outils et tables de travail visibles depuis les espaces autorisés.",
      "Les ateliers de créateurs et leurs enseignes.",
      "Les reflets colorés à marée haute.",
    ],
    idealDay: day(
      {
        time: "10 h",
        title: "Cabanes",
        detail: "Parcourez les allées lorsque les ateliers ouvrent.",
      },
      {
        time: "11 h 30",
        title: "Rencontre",
        detail: "Échangez avec un producteur ou un créateur sans gêner le travail.",
      },
      {
        time: "13 h",
        title: "Dégustation",
        detail: "Découvrez les huîtres du bassin auprès d’une adresse déclarée.",
      },
      { time: "15 h", title: "Citadelle", detail: "Reliez le port à l’histoire militaire." },
      {
        time: "17 h",
        title: "Lumière sur les chenaux",
        detail: "Revenez lorsque les couleurs se reflètent dans l’eau.",
      },
    ),
    practical: {
      parking: "Stationnements du port et du Château-d’Oléron.",
      bike: "Accès facile, en respectant les zones piétonnes et de travail.",
      accessibility: "Allées assez planes mais proximité immédiate de l’eau.",
      families:
        "Très visuel ; expliquer aux enfants que certaines cabanes sont des lieux professionnels.",
      dogs: "Tenir en laisse près des produits, ateliers et chenaux.",
    },
  },
  boyardville: {
    emotionalLead:
      "Boyardville porte dans son nom le monument qu’il a aidé à bâtir. Son chenal, son port et ses rues racontent l’envers terrestre du grand chantier posé au milieu de la mer.",
    story: [
      "Lorsque la construction de Fort Boyard mobilise hommes et matériaux, la côte oléronaise devient une base logistique. Ateliers, magasins, transports et logements donnent naissance à un nouveau pôle d’activité.",
      "Le chenal de la Perrotine permet les mouvements vers le pertuis. Le village grandit avec le chantier, puis doit se réinventer lorsque le fort est enfin achevé.",
      "Pêche, échanges, plaisance et promenades maritimes prennent progressivement le relais. Le port devient l’un des principaux points de départ pour approcher Fort Boyard.",
      "Boyardville conserve aujourd’hui une identité multiple : village habité, port animé, porte de la forêt des Saumonards et mémoire d’une aventure technique nationale.",
    ],
    unique:
      "Le village permet de comprendre Fort Boyard depuis la terre : sans sa base logistique et les travailleurs qui y vécurent, le monument au large serait resté un projet sur le papier.",
    mustSee: [
      "Le chenal de la Perrotine.",
      "Les départs des bateaux vers Fort Boyard.",
      "La transition immédiate vers la forêt des Saumonards.",
      "Le marché et la vie du village en saison.",
    ],
    idealDay: day(
      { time: "9 h", title: "Port", detail: "Observez les préparatifs et l’activité du chenal." },
      {
        time: "10 h 30",
        title: "Circuit historique",
        detail: "Suivez le village à pied en reliant ses traces maritimes.",
      },
      {
        time: "12 h",
        title: "Marché",
        detail: "Composez un déjeuner avec les produits disponibles.",
      },
      {
        time: "14 h",
        title: "Sortie en mer",
        detail: "Approchez Fort Boyard selon la météo et la saison.",
      },
      { time: "18 h", title: "Saumonards", detail: "Terminez entre forêt et plage." },
    ),
    practical: {
      parking: "Plusieurs zones de stationnement, très sollicitées en été.",
      bike: "Excellente destination à vélo depuis Le Nid d’Été.",
      accessibility: "Port globalement praticable, avec variations selon quais et embarcadères.",
      families: "Sorties maritimes à choisir selon âge et conditions.",
      dogs: "Vérifier les règles du bateau, du marché et des plages.",
    },
  },
  "phare-de-chassiron": {
    emotionalLead:
      "À Chassiron, le vent arrive avant le paysage. Puis la tour rayée apparaît, nette et verticale, comme la dernière ponctuation de l’île avant le grand large.",
    story: [
      "La pointe nord d’Oléron borde une zone maritime exigeante, entre récifs, courants et pertuis d’Antioche. Un premier phare guide les navigateurs avant que l’évolution du trafic ne rende nécessaire un signal plus puissant.",
      "Le phare actuel est élevé au XIXe siècle. Sa tour offre la hauteur nécessaire à une portée accrue, tandis que ses bandes noires et blanches facilitent l’identification de jour et évitent la confusion avec les autres phares du littoral.",
      "Les gardiens entretiennent autrefois le feu, les optiques et la tour dans un environnement exposé aux tempêtes. L’automatisation change le métier, mais les espaces racontent encore cette vigilance quotidienne.",
      "Les jardins contemporains prolongent le récit avec une composition inspirée de la rose des vents et des paysages locaux. Depuis le sommet, le visiteur mesure l’étendue d’Oléron, le pertuis, la côte rocheuse et la puissance des conditions qui ont rendu le phare indispensable.",
    ],
    unique:
      "Ses bandes graphiques, son jardin paysager et sa situation à l’extrémité de l’île en font à la fois un repère maritime, une architecture et une expérience complète du paysage.",
    mustSee: [
      "La tour rayée depuis la côte.",
      "La rose des vents dessinée par les jardins.",
      "Le panorama circulaire depuis la plateforme.",
      "Les vagues et écluses à poissons selon la marée.",
    ],
    idealDay: day(
      {
        time: "9 h 30",
        title: "Phare",
        detail: "Montez tôt si les conditions d’ouverture le permettent.",
      },
      { time: "11 h", title: "Jardins", detail: "Lisez les paysages et les usages littoraux." },
      {
        time: "12 h 30",
        title: "Déjeuner au nord",
        detail: "Découvrez une adresse de Saint-Denis ou des environs.",
      },
      { time: "15 h", title: "Côte", detail: "Marchez sur les itinéraires autorisés." },
      {
        time: "18 h",
        title: "Silhouette du phare",
        detail: "Photographiez-le avec une lumière plus basse.",
      },
    ),
    practical: {
      parking: "Parking sur site, affluence importante en saison.",
      bike: "Arrivée spectaculaire par les itinéraires du nord d’Oléron.",
      accessibility: "Jardins plus accessibles ; sommet uniquement par escalier.",
      families: "Prévoir coupe-vent, eau et rythme adapté pour l’ascension.",
      dogs: "Laisse recommandée ; vérifier les espaces autorisés.",
    },
  },
};

export function getHeritageEditorial(slug: string) {
  return heritageEditorial[slug];
}
