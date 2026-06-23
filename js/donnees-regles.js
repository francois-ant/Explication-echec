/* ═══════════════════════════════════════════════════
   ÉCHECS — Données des règles (donnees-regles.js)
   Organisées en 3 catégories : bases, special, finPartie
   ═══════════════════════════════════════════════════ */


/* ───────────────────────────────────────────────────
   Catégorie 1 : Les bases
   ─────────────────────────────────────────────────── */

const REGLES_BASES = [
  {
    id: 'objectif',
    icone: '🎯',
    titre: 'L\'objectif du jeu',
    resume: 'Mettre le Roi adverse échec et mat.',
    texte: `Le but des échecs est de mettre le Roi adverse en position
      d'<strong>échec et mat</strong> : une situation où le Roi est attaqué
      et où aucun coup ne peut le sortir du danger. La partie peut aussi
      se terminer par un abandon, un pat, ou une nulle.`,
  },
  {
    id: 'plateau',
    icone: '🏁',
    titre: 'Le plateau',
    resume: '64 cases, 8 colonnes (a-h), 8 rangées (1-8).',
    texte: `L'échiquier comporte <strong>64 cases</strong> alternant clair
      et sombre, organisées en 8 colonnes (notées a à h) et 8 rangées
      (notées 1 à 8). Chaque joueur doit avoir une case <strong>blanche
      dans le coin droit</strong> face à lui — c'est la règle du
      "blanc à droite".`,
  },
  {
    id: 'mise-en-place',
    icone: '♟',
    titre: 'La mise en place',
    resume: 'Pions en rang 2, pièces majeures en rang 1.',
    texte: `Chaque joueur dispose ses 8 pions sur la rangée devant lui.
      Sur la rangée arrière, de l'extérieur vers le centre :
      Tour, Cavalier, Fou, puis le Roi et la Reine au centre.
      Astuce pour ne jamais se tromper : <strong>"la Dame aime sa
      couleur"</strong> — la Reine blanche commence sur une case claire,
      la Reine noire sur une case sombre.`,
  },
  {
    id: 'tour-de-jeu',
    icone: '🔄',
    titre: 'Le tour de jeu',
    resume: 'Les Blancs commencent, puis on alterne.',
    texte: `Les joueurs jouent alternativement, et ce sont toujours les
      <strong>Blancs qui commencent</strong>. À chaque tour, un joueur
      doit déplacer une seule pièce (le roque étant la seule exception,
      où deux pièces bougent en un coup).`,
  },
  {
    id: 'capture',
    icone: '⚔️',
    titre: 'La capture',
    resume: 'On prend la place de la pièce adverse.',
    texte: `Pour capturer une pièce adverse, on déplace sa propre pièce
      sur la case qu'elle occupe, selon les règles de déplacement propres
      à cette pièce, et on retire la pièce adverse du plateau.
      <strong>Aucune pièce ne peut sauter par-dessus une autre</strong>,
      sauf le Cavalier.`,
  },
  {
    id: 'echec',
    icone: '⚠️',
    titre: 'L\'échec',
    resume: 'Le Roi est attaqué, il faut réagir.',
    texte: `Un Roi est "en échec" lorsqu'il est attaqué par une pièce
      adverse. Le joueur dont le Roi est en échec doit immédiatement
      réagir : déplacer le Roi, bloquer l'attaque avec une autre pièce,
      ou capturer la pièce attaquante. <strong>Il est interdit de laisser
      son propre Roi en échec.</strong>`,
  },
];


/* ───────────────────────────────────────────────────
   Catégorie 2 : Mouvements spéciaux (avec démos interactives)
   ─────────────────────────────────────────────────── */

const REGLES_SPECIALES = [
  {
    id: 'roque',
    icone: '🏰',
    titre: 'Le Roque',
    resume: 'Le Roi et la Tour bougent ensemble pour sécuriser le Roi.',
    texte: `Le roque est le seul coup où <strong>deux pièces bougent en
      même temps</strong>. Le Roi se déplace de deux cases vers une Tour,
      qui saute par-dessus lui pour se placer à côté.<br><br>
      <strong>Conditions :</strong> ni le Roi ni la Tour concernée n'ont
      bougé depuis le début de la partie, aucune pièce ne se trouve entre
      les deux, le Roi n'est pas en échec, et il ne traverse ni ne
      termine sa course sur une case attaquée.`,
    demo: 'roque',
  },
  {
    id: 'prise-en-passant',
    icone: '👻',
    titre: 'La Prise en Passant',
    resume: 'Capturer un pion qui vient d\'avancer de deux cases.',
    texte: `Si un pion adverse avance de <strong>deux cases</strong> depuis
      sa position initiale et atterrit juste à côté de l'un de vos pions,
      vous pouvez le capturer "en passant", comme s'il n'avait avancé que
      d'une seule case.<br><br>
      <strong>Important :</strong> cette capture doit être jouée
      <strong>immédiatement</strong> au coup suivant, sinon le droit est perdu.`,
    demo: 'prise-en-passant',
  },
  {
    id: 'promotion',
    icone: '👑',
    titre: 'La Promotion',
    resume: 'Un pion qui atteint le bout du plateau se transforme.',
    texte: `Lorsqu'un pion atteint la <strong>dernière rangée</strong>
      adverse (la 8e pour les Blancs, la 1ère pour les Noirs), il doit
      immédiatement se transformer en Reine, Tour, Fou ou Cavalier — au
      choix du joueur, peu importe les pièces déjà présentes.<br><br>
      <strong>Astuce :</strong> la majorité des promotions se font en
      Reine, car c'est la pièce la plus puissante. On parle alors de
      "dame" obtenue par promotion.`,
    demo: 'promotion',
  },
];


/* ───────────────────────────────────────────────────
   Catégorie 3 : Fin de partie
   ─────────────────────────────────────────────────── */

const REGLES_FIN_PARTIE = [
  {
    id: 'echec-et-mat',
    icone: '🏆',
    titre: 'Échec et Mat',
    resume: 'Le Roi est en échec et ne peut y échapper. Partie terminée.',
    texte: `L'échec et mat survient quand un Roi est en échec et qu'
      <strong>aucun coup légal</strong> ne permet d'y échapper : il ne peut
      ni se déplacer vers une case sûre, ni être protégé par une autre
      pièce, ni capturer l'attaquant. La partie se termine immédiatement,
      et le joueur dont c'est le Roi perd.`,
  },
  {
    id: 'pat',
    icone: '🤝',
    titre: 'Le Pat',
    resume: 'Aucun coup légal possible, mais le Roi n\'est pas en échec. Match nul.',
    texte: `Le pat se produit lorsqu'un joueur n'a <strong>aucun coup
      légal</strong> à jouer, mais que son Roi n'est <strong>pas en
      échec</strong>. C'est une situation très différente de l'échec et
      mat : la partie se termine par un <strong>match nul</strong>, même
      si l'un des joueurs a beaucoup plus de pièces que l'autre.`,
  },
  {
    id: 'nulle',
    icone: '➗',
    titre: 'Les autres parties nulles',
    resume: 'Répétition, 50 coups, matériel insuffisant, accord mutuel.',
    texte: `Plusieurs autres situations mènent à une partie nulle :
      la <strong>triple répétition</strong> de la même position, la
      <strong>règle des 50 coups</strong> (aucune capture ni mouvement de
      pion depuis 50 coups), un <strong>matériel insuffisant</strong>
      pour mater (ex : Roi seul contre Roi seul), ou un
      <strong>accord mutuel</strong> entre les deux joueurs.`,
  },
  {
    id: 'abandon',
    icone: '🏳️',
    titre: 'L\'abandon',
    resume: 'Un joueur peut abandonner à tout moment.',
    texte: `Un joueur peut <strong>abandonner</strong> la partie à tout
      moment s'il estime sa position perdue, généralement en renversant
      son Roi ou en arrêtant sa pendule. C'est un geste de respect courant
      lorsque la défaite est inévitable, plutôt que de jouer jusqu'au mat.`,
  },
];


/* ───────────────────────────────────────────────────
   Catégorie 4 : Principes d'ouverture
   ─────────────────────────────────────────────────── */

const REGLES_OUVERTURE = [
  {
    id: 'controle-centre',
    icone: '🎯',
    titre: 'Contrôler le centre',
    resume: 'Occuper ou surveiller les cases centrales dès les premiers coups.',
    texte: `Les quatre cases centrales (d4, d5, e4, e5) sont les plus
      importantes de l'échiquier : une pièce qui s'y trouve contrôle un
      maximum de cases et peut rapidement se déployer vers n'importe
      quelle zone du plateau. <strong>Avancer un pion central</strong>
      (e4, d4, e5 ou d5) dès le premier coup est la façon la plus directe
      de revendiquer cet espace.<br><br>
      Un joueur qui néglige le centre laisse l'adversaire y installer ses
      pièces, ce qui limite fortement sa propre mobilité pour le reste
      de la partie.`,
    demo: 'controle-centre',
  },
  {
    id: 'developpement',
    icone: '🚀',
    titre: 'Développer ses pièces',
    resume: 'Sortir Cavaliers et Fous rapidement, avant la Dame.',
    texte: `« Développer » signifie sortir ses pièces mineures (Cavaliers
      et Fous) de leur case de départ pour qu'elles deviennent actives.
      L'ordre conseillé est <strong>Cavaliers et Fous avant la Dame</strong> :
      sortir la Dame trop tôt l'expose à des attaques de pièces mineures
      adverses, qui gagnent du temps en la chassant.<br><br>
      Une bonne règle de base : éviter de bouger deux fois la même pièce
      pendant l'ouverture si un coup de développement différent est possible.`,
    demo: 'developpement',
  },
  {
    id: 'securite-roi',
    icone: '🛡️',
    titre: 'Sécuriser son Roi',
    resume: 'Roquer tôt pour mettre le Roi à l\'abri.',
    texte: `Le Roi commence la partie au centre de l'échiquier, exactement
      là où il est le plus exposé une fois les lignes ouvertes. Le
      <strong>roque</strong> (voir la catégorie "Mouvements Spéciaux")
      permet de le mettre rapidement en sécurité sur le côté, tout en
      activant une Tour au passage.<br><br>
      Un Roi resté au centre trop longtemps risque de subir une attaque
      directe avant même d'avoir pu se réfugier — c'est l'une des causes
      les plus fréquentes de défaite rapide chez les débutants.`,
    demo: 'securite-roi',
  },
];


/* ───────────────────────────────────────────────────
   Catégorie 5 : Notions avancées (tactique)
   ─────────────────────────────────────────────────── */

const REGLES_AVANCEES = [
  {
    id: 'clouage-absolu',
    icone: '📌',
    titre: 'Le Clouage Absolu',
    resume: 'Une pièce ne peut pas bouger sans exposer son propre Roi.',
    texte: `Une pièce est "clouée" lorsqu'elle se trouve entre une pièce
      adverse à longue portée (Tour, Fou ou Dame) et son propre Roi, sur
      la même ligne, colonne ou diagonale. Le clouage est dit
      <strong>absolu</strong> quand la pièce clouée protège directement
      le Roi : la déplacer serait un coup <strong>illégal</strong>, car
      cela exposerait le Roi à l'échec.<br><br>
      Une pièce absolument clouée est donc totalement immobilisée tant
      que la situation perdure.`,
    demo: 'clouage-absolu',
  },
  {
    id: 'clouage-relatif',
    icone: '📍',
    titre: 'Le Clouage Relatif',
    resume: 'Bouger la pièce clouée est légal, mais coûteux.',
    texte: `Le clouage est dit <strong>relatif</strong> quand la pièce
      clouée protège une pièce de valeur (souvent la Dame) plutôt que le
      Roi directement. Dans ce cas, déplacer la pièce clouée est
      <strong>parfaitement légal</strong>, mais expose la pièce plus
      précieuse derrière elle à la capture.<br><br>
      C'est une menace psychologique autant que matérielle : l'adversaire
      doit choisir entre garder sa pièce clouée immobile ou risquer de
      perdre une pièce de plus grande valeur.`,
    demo: 'clouage-relatif',
  },
  {
    id: 'fourchette',
    icone: '🍴',
    titre: 'La Fourchette',
    resume: 'Une seule pièce attaque deux cibles à la fois.',
    texte: `Une fourchette se produit quand une pièce attaque
      <strong>simultanément deux pièces adverses</strong> (ou plus). La
      victime ne peut sauver qu'une seule de ses pièces à la fois, ce qui
      garantit un gain de matériel pour l'attaquant.<br><br>
      Le <strong>Cavalier</strong> est particulièrement redoutable pour
      les fourchettes, car ses déplacements en "L" lui permettent
      d'attaquer des pièces qui semblent éloignées et non connectées
      entre elles.`,
    demo: 'fourchette',
  },
  {
    id: 'enfilade',
    icone: '🎳',
    titre: 'L\'Enfilade',
    resume: 'Deux pièces alignées, la plus précieuse devant.',
    texte: `L'enfilade ressemble au clouage, mais à l'envers :
      <strong>la pièce la plus précieuse est attaquée en premier</strong>,
      avec une pièce de moindre valeur alignée juste derrière elle.
      Quand la pièce de valeur doit se déplacer pour échapper à l'attaque,
      elle dévoile la pièce derrière elle, qui se retrouve alors capturée
      à son tour.<br><br>
      C'est une tactique fréquente avec les Tours et les Dames sur des
      lignes ou colonnes ouvertes.`,
    demo: 'enfilade',
  },
  {
    id: 'attaque-decouverte',
    icone: '💥',
    titre: 'L\'Attaque à la Découverte',
    resume: 'Déplacer une pièce révèle l\'attaque d\'une autre.',
    texte: `Une attaque à la découverte se produit lorsqu'une pièce se
      déplace et <strong>révèle une ligne d'attaque</strong> d'une
      seconde pièce restée derrière elle (Tour, Fou ou Dame). La pièce
      qui bouge peut elle-même créer une menace supplémentaire au passage,
      ce qui rend cette tactique particulièrement puissante.<br><br>
      Quand la pièce qui se déplace donne elle-même échec en plus de
      révéler l'attaque de l'autre pièce, on parle d'<strong>échec
      double</strong> — l'une des situations les plus difficiles à parer.`,
    demo: 'attaque-decouverte',
  },
  {
    id: 'attaque-double',
    icone: '⚡',
    titre: 'L\'Attaque Double',
    resume: 'Un seul coup crée deux menaces différentes à parer.',
    texte: `L'attaque double regroupe toute situation où un seul coup crée
      <strong>deux menaces distinctes</strong> que l'adversaire ne peut
      pas parer toutes les deux en un seul coup — qu'il s'agisse d'une
      fourchette, d'un échec accompagné d'une autre menace, ou de deux
      pièces attaquées par des pièces différentes en même temps.<br><br>
      Le point commun de toutes les tactiques de cette catégorie est le
      même : forcer l'adversaire à un choix impossible.`,
    demo: 'attaque-double',
  },
];


/* ───────────────────────────────────────────────────
   Regroupement par catégorie pour la navigation par onglets
   ─────────────────────────────────────────────────── */

const CATEGORIES_REGLES = {
  bases:      { titre: 'Les Bases',           icone: '📖', regles: REGLES_BASES },
  special:    { titre: 'Mouvements Spéciaux',  icone: '✨', regles: REGLES_SPECIALES },
  finPartie:  { titre: 'Fin de Partie',        icone: '🏁', regles: REGLES_FIN_PARTIE },
  ouverture:  {
    titre: 'Principes d\'Ouverture',
    icone: '🌅',
    regles: REGLES_OUVERTURE,
    avertissement: `Ces trois principes sont des <strong>repères généraux</strong>
      pour bien débuter une partie, pas des règles absolues. Aux échecs,
      presque chaque principe a ses exceptions légitimes selon la
      position. Ne les suivez pas aveuglément : ils sont là pour vous
      guider quand vous ne savez pas quoi jouer, pas pour remplacer
      votre réflexion sur l'échiquier.`,
  },
  avance:     { titre: 'Notions Avancées',     icone: '🧠', regles: REGLES_AVANCEES },
};

const ORDRE_CATEGORIES = ['bases', 'special', 'finPartie', 'ouverture', 'avance'];