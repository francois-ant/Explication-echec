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
   Regroupement par catégorie pour la navigation par onglets
   ─────────────────────────────────────────────────── */

const CATEGORIES_REGLES = {
  bases:      { titre: 'Les Bases',          icone: '📖', regles: REGLES_BASES },
  special:    { titre: 'Mouvements Spéciaux', icone: '✨', regles: REGLES_SPECIALES },
  finPartie:  { titre: 'Fin de Partie',       icone: '🏁', regles: REGLES_FIN_PARTIE },
};

const ORDRE_CATEGORIES = ['bases', 'special', 'finPartie'];
