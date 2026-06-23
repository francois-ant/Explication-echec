/* ═══════════════════════════════════════════════════
   ÉCHECS — Démos interactives (demos-interactives.js)
   ═══════════════════════════════════════════════════ */


/* ───────────────────────────────────────────────────
   Symboles Unicode des pièces
   ─────────────────────────────────────────────────── */

const SYMBOLES_PIECES = {
  roiBlanc: '♔', reineBlanche: '♕', tourBlanche: '♖',
  fouBlanc: '♗', cavalierBlanc: '♘', pionBlanc: '♙',
  roiNoir: '♚', reineNoire: '♛', tourNoire: '♜',
  fouNoir: '♝', cavalierNoir: '♞', pionNoir: '♟',
};


/* ───────────────────────────────────────────────────
   Configuration des démos
   Chaque étape peut contenir :
     pieces      : { 'e4': 'pionBlanc', ... }
     surbrillance: ['e4', 'd5']
     fleche      : { de: 'e2', vers: 'e4' }          ← une seule flèche
     fleches     : [{ de: 'a1', vers: 'b2' }, ...]   ← plusieurs flèches
   ─────────────────────────────────────────────────── */

const DEMOS = {

  /* ─── ROQUE ─── */
  roque: {
    legende: 'Cliquez pour voir le Roi roquer avec la Tour',
    etapes: [
      {
        texte: 'Position avant le roque : le Roi et la Tour n\'ont pas bougé.',
        pieces: { 'e1': 'roiBlanc', 'h1': 'tourBlanche', 'e8': 'roiNoir' },
        surbrillance: ['e1', 'h1'],
      },
      {
        texte: 'Petit roque : le Roi se déplace de 2 cases vers la Tour.',
        pieces: { 'g1': 'roiBlanc', 'h1': 'tourBlanche', 'e8': 'roiNoir' },
        surbrillance: ['g1'],
        fleche: { de: 'e1', vers: 'g1' },
      },
      {
        texte: 'La Tour saute par-dessus le Roi pour terminer à côté de lui.',
        pieces: { 'g1': 'roiBlanc', 'f1': 'tourBlanche', 'e8': 'roiNoir' },
        surbrillance: ['f1', 'g1'],
        fleche: { de: 'h1', vers: 'f1' },
      },
    ],
  },

  /* ─── PRISE EN PASSANT ─── */
  'prise-en-passant': {
    legende: 'Cliquez pour voir la capture en passant',
    etapes: [
      {
        texte: 'Le pion blanc est en e5. Le pion noir est encore en d7.',
        pieces: { 'e5': 'pionBlanc', 'd7': 'pionNoir', 'e1': 'roiBlanc', 'e8': 'roiNoir' },
        surbrillance: ['e5'],
      },
      {
        texte: 'Le pion noir avance de 2 cases d\'un coup : d7 → d5.',
        pieces: { 'e5': 'pionBlanc', 'd5': 'pionNoir', 'e1': 'roiBlanc', 'e8': 'roiNoir' },
        surbrillance: ['d5'],
        fleche: { de: 'd7', vers: 'd5' },
      },
      {
        texte: 'Le pion blanc capture "en passant" : il prend comme si le pion noir n\'avait avancé que d\'une case.',
        pieces: { 'd6': 'pionBlanc', 'e1': 'roiBlanc', 'e8': 'roiNoir' },
        surbrillance: ['d6'],
        fleche: { de: 'e5', vers: 'd6' },
      },
    ],
  },

  /* ─── PROMOTION ─── */
  promotion: {
    legende: 'Cliquez pour voir un pion se transformer en Reine',
    etapes: [
      {
        texte: 'Le pion blanc est presque arrivé au bout du plateau.',
        pieces: { 'e7': 'pionBlanc', 'e1': 'roiBlanc', 'a8': 'roiNoir' },
        surbrillance: ['e7'],
      },
      {
        texte: 'Il avance sur la 8e rangée, la dernière pour les Blancs.',
        pieces: { 'e8a': 'pionBlanc', 'e1': 'roiBlanc', 'a8': 'roiNoir' },
        surbrillance: ['e8a'],
        fleche: { de: 'e7', vers: 'e8' },
        casePromotion: 'e8a',
      },
      {
        texte: 'Le joueur choisit de le transformer en Reine — son coup le plus puissant !',
        pieces: { 'e8a': 'reineBlanche', 'e1': 'roiBlanc', 'a8': 'roiNoir' },
        surbrillance: ['e8a'],
        estPromu: true,
      },
    ],
  },

  /* ═══════════════════════════════════════════════
     PRINCIPES D'OUVERTURE
     ═══════════════════════════════════════════════ */

  'controle-centre': {
    legende: 'Cliquez pour voir comment le centre s\'installe',
    etapes: [
      {
        texte: 'Position de départ : aucune pièce ne contrôle encore le centre.',
        pieces: {
          'a1': 'tourBlanche', 'b1': 'cavalierBlanc', 'c1': 'fouBlanc',
          'd1': 'reineBlanche', 'e1': 'roiBlanc', 'f1': 'fouBlanc',
          'g1': 'cavalierBlanc', 'h1': 'tourBlanche',
          'a2': 'pionBlanc', 'b2': 'pionBlanc', 'c2': 'pionBlanc', 'd2': 'pionBlanc',
          'e2': 'pionBlanc', 'f2': 'pionBlanc', 'g2': 'pionBlanc', 'h2': 'pionBlanc',
          'a8': 'tourNoire', 'b8': 'cavalierNoir', 'c8': 'fouNoir',
          'd8': 'reineNoire', 'e8': 'roiNoir', 'f8': 'fouNoir',
          'g8': 'cavalierNoir', 'h8': 'tourNoire',
          'a7': 'pionNoir', 'b7': 'pionNoir', 'c7': 'pionNoir', 'd7': 'pionNoir',
          'e7': 'pionNoir', 'f7': 'pionNoir', 'g7': 'pionNoir', 'h7': 'pionNoir',
        },
        surbrillance: ['e4', 'd4', 'e5', 'd5'],
      },
      {
        texte: 'Les Blancs avancent e2-e4 et contrôlent déjà d5 et f5.',
        pieces: {
          'a1': 'tourBlanche', 'b1': 'cavalierBlanc', 'c1': 'fouBlanc',
          'd1': 'reineBlanche', 'e1': 'roiBlanc', 'f1': 'fouBlanc',
          'g1': 'cavalierBlanc', 'h1': 'tourBlanche',
          'a2': 'pionBlanc', 'b2': 'pionBlanc', 'c2': 'pionBlanc', 'd2': 'pionBlanc',
          'e4': 'pionBlanc', 'f2': 'pionBlanc', 'g2': 'pionBlanc', 'h2': 'pionBlanc',
          'a8': 'tourNoire', 'b8': 'cavalierNoir', 'c8': 'fouNoir',
          'd8': 'reineNoire', 'e8': 'roiNoir', 'f8': 'fouNoir',
          'g8': 'cavalierNoir', 'h8': 'tourNoire',
          'a7': 'pionNoir', 'b7': 'pionNoir', 'c7': 'pionNoir', 'd7': 'pionNoir',
          'e7': 'pionNoir', 'f7': 'pionNoir', 'g7': 'pionNoir', 'h7': 'pionNoir',
        },
        surbrillance: ['e4', 'd5'],
        fleche: { de: 'e2', vers: 'e4' },
      },
      {
        texte: 'Les Noirs répondent e7-e5 : les deux camps se disputent le centre.',
        pieces: {
          'a1': 'tourBlanche', 'b1': 'cavalierBlanc', 'c1': 'fouBlanc',
          'd1': 'reineBlanche', 'e1': 'roiBlanc', 'f1': 'fouBlanc',
          'g1': 'cavalierBlanc', 'h1': 'tourBlanche',
          'a2': 'pionBlanc', 'b2': 'pionBlanc', 'c2': 'pionBlanc', 'd2': 'pionBlanc',
          'e4': 'pionBlanc', 'f2': 'pionBlanc', 'g2': 'pionBlanc', 'h2': 'pionBlanc',
          'a8': 'tourNoire', 'b8': 'cavalierNoir', 'c8': 'fouNoir',
          'd8': 'reineNoire', 'e8': 'roiNoir', 'f8': 'fouNoir',
          'g8': 'cavalierNoir', 'h8': 'tourNoire',
          'a7': 'pionNoir', 'b7': 'pionNoir', 'c7': 'pionNoir', 'd7': 'pionNoir',
          'e5': 'pionNoir', 'f7': 'pionNoir', 'g7': 'pionNoir', 'h7': 'pionNoir',
        },
        surbrillance: ['e4', 'e5', 'd4', 'd5'],
        fleche: { de: 'e7', vers: 'e5' },
      },
    ],
  },

  developpement: {
    legende: 'Cliquez pour voir l\'ordre de développement idéal',
    etapes: [
      {
        texte: 'Toutes les pièces mineures sont encore à leur case de départ.',
        pieces: {
          'a1': 'tourBlanche', 'b1': 'cavalierBlanc', 'c1': 'fouBlanc',
          'd1': 'reineBlanche', 'e1': 'roiBlanc', 'f1': 'fouBlanc',
          'g1': 'cavalierBlanc', 'h1': 'tourBlanche',
          'a2': 'pionBlanc', 'b2': 'pionBlanc', 'c2': 'pionBlanc', 'd2': 'pionBlanc',
          'e4': 'pionBlanc', 'f2': 'pionBlanc', 'g2': 'pionBlanc', 'h2': 'pionBlanc',
          'a8': 'tourNoire', 'b8': 'cavalierNoir', 'c8': 'fouNoir',
          'd8': 'reineNoire', 'e8': 'roiNoir', 'f8': 'fouNoir',
          'g8': 'cavalierNoir', 'h8': 'tourNoire',
          'a7': 'pionNoir', 'b7': 'pionNoir', 'c7': 'pionNoir', 'd7': 'pionNoir',
          'e5': 'pionNoir', 'f7': 'pionNoir', 'g7': 'pionNoir', 'h7': 'pionNoir',
        },
        surbrillance: ['b1', 'g1', 'c1', 'f1', 'b8', 'g8', 'c8', 'f8'],
      },
      {
        texte: 'Les Cavaliers sortent en premier : ils sautent par-dessus les pions.',
        pieces: {
          'a1': 'tourBlanche', 'b1': 'cavalierBlanc', 'c1': 'fouBlanc',
          'd1': 'reineBlanche', 'e1': 'roiBlanc', 'f1': 'fouBlanc',
          'f3': 'cavalierBlanc', 'h1': 'tourBlanche',
          'a2': 'pionBlanc', 'b2': 'pionBlanc', 'c2': 'pionBlanc', 'd2': 'pionBlanc',
          'e4': 'pionBlanc', 'f2': 'pionBlanc', 'g2': 'pionBlanc', 'h2': 'pionBlanc',
          'a8': 'tourNoire', 'c6': 'cavalierNoir', 'c8': 'fouNoir',
          'd8': 'reineNoire', 'e8': 'roiNoir', 'f8': 'fouNoir',
          'g8': 'cavalierNoir', 'h8': 'tourNoire',
          'a7': 'pionNoir', 'b7': 'pionNoir', 'c7': 'pionNoir', 'd7': 'pionNoir',
          'e5': 'pionNoir', 'f7': 'pionNoir', 'g7': 'pionNoir', 'h7': 'pionNoir',
        },
        surbrillance: ['f3', 'c6'],
        fleches: [
          { de: 'g1', vers: 'f3' },
          { de: 'b8', vers: 'c6' },
        ],
      },
      {
        texte: 'Puis les Fous se développent sur une diagonale dégagée.',
        pieces: {
          'a1': 'tourBlanche', 'b1': 'cavalierBlanc', 'c1': 'fouBlanc',
          'd1': 'reineBlanche', 'e1': 'roiBlanc', 'c4': 'fouBlanc',
          'f3': 'cavalierBlanc', 'h1': 'tourBlanche',
          'a2': 'pionBlanc', 'b2': 'pionBlanc', 'c2': 'pionBlanc', 'd2': 'pionBlanc',
          'e4': 'pionBlanc', 'f2': 'pionBlanc', 'g2': 'pionBlanc', 'h2': 'pionBlanc',
          'a8': 'tourNoire', 'c6': 'cavalierNoir', 'c8': 'fouNoir',
          'd8': 'reineNoire', 'e8': 'roiNoir', 'e6': 'fouNoir',
          'g8': 'cavalierNoir', 'h8': 'tourNoire',
          'a7': 'pionNoir', 'b7': 'pionNoir', 'c7': 'pionNoir', 'd7': 'pionNoir',
          'e5': 'pionNoir', 'f7': 'pionNoir', 'g7': 'pionNoir', 'h7': 'pionNoir',
        },
        surbrillance: ['c4', 'e6'],
        fleches: [
          { de: 'f1', vers: 'c4' },
          { de: 'f8', vers: 'e6' },
        ],
      },
    ],
  },

  'securite-roi': {
    legende: 'Cliquez pour voir le Roi se mettre à l\'abri',
    etapes: [
      {
        texte: 'Le Roi est encore au centre, exposé aux attaques sur les colonnes ouvertes.',
        pieces: {
          'a1': 'tourBlanche', 'b1': 'cavalierBlanc', 'c1': 'fouBlanc',
          'd1': 'reineBlanche', 'e1': 'roiBlanc', 'c4': 'fouBlanc',
          'f3': 'cavalierBlanc', 'h1': 'tourBlanche',
          'a2': 'pionBlanc', 'b2': 'pionBlanc', 'c2': 'pionBlanc', 'd2': 'pionBlanc',
          'e4': 'pionBlanc', 'f2': 'pionBlanc', 'g2': 'pionBlanc', 'h2': 'pionBlanc',
          'a8': 'tourNoire', 'c6': 'cavalierNoir', 'c8': 'fouNoir',
          'd8': 'reineNoire', 'e8': 'roiNoir', 'e6': 'fouNoir',
          'g8': 'cavalierNoir', 'h8': 'tourNoire',
          'a7': 'pionNoir', 'b7': 'pionNoir', 'c7': 'pionNoir', 'd7': 'pionNoir',
          'e5': 'pionNoir', 'f7': 'pionNoir', 'g7': 'pionNoir', 'h7': 'pionNoir',
        },
        surbrillance: ['e1'],
      },
      {
        texte: 'La voie est libre entre le Roi blanc et la Tour h1 : le petit roque est possible.',
        pieces: {
          'a1': 'tourBlanche', 'b1': 'cavalierBlanc', 'c1': 'fouBlanc',
          'd1': 'reineBlanche', 'e1': 'roiBlanc', 'c4': 'fouBlanc',
          'f3': 'cavalierBlanc', 'h1': 'tourBlanche',
          'a2': 'pionBlanc', 'b2': 'pionBlanc', 'c2': 'pionBlanc', 'd2': 'pionBlanc',
          'e4': 'pionBlanc', 'f2': 'pionBlanc', 'g2': 'pionBlanc', 'h2': 'pionBlanc',
          'a8': 'tourNoire', 'c6': 'cavalierNoir', 'c8': 'fouNoir',
          'd8': 'reineNoire', 'e8': 'roiNoir', 'e6': 'fouNoir',
          'g8': 'cavalierNoir', 'h8': 'tourNoire',
          'a7': 'pionNoir', 'b7': 'pionNoir', 'c7': 'pionNoir', 'd7': 'pionNoir',
          'e5': 'pionNoir', 'f7': 'pionNoir', 'g7': 'pionNoir', 'h7': 'pionNoir',
        },
        surbrillance: ['e1', 'f1', 'g1', 'h1'],
      },
      {
        texte: 'Après le petit roque : le Roi est à l\'abri derrière les pions, la Tour est centralisée.',
        pieces: {
          'a1': 'tourBlanche', 'b1': 'cavalierBlanc', 'c1': 'fouBlanc',
          'd1': 'reineBlanche', 'g1': 'roiBlanc', 'c4': 'fouBlanc',
          'f3': 'cavalierBlanc', 'f1': 'tourBlanche',
          'a2': 'pionBlanc', 'b2': 'pionBlanc', 'c2': 'pionBlanc', 'd2': 'pionBlanc',
          'e4': 'pionBlanc', 'f2': 'pionBlanc', 'g2': 'pionBlanc', 'h2': 'pionBlanc',
          'a8': 'tourNoire', 'c6': 'cavalierNoir', 'c8': 'fouNoir',
          'd8': 'reineNoire', 'e8': 'roiNoir', 'e6': 'fouNoir',
          'g8': 'cavalierNoir', 'h8': 'tourNoire',
          'a7': 'pionNoir', 'b7': 'pionNoir', 'c7': 'pionNoir', 'd7': 'pionNoir',
          'e5': 'pionNoir', 'f7': 'pionNoir', 'g7': 'pionNoir', 'h7': 'pionNoir',
        },
        surbrillance: ['g1', 'f1'],
        fleches: [
          { de: 'e1', vers: 'g1' },
          { de: 'h1', vers: 'f1' },
        ],
      },
    ],
  },

  /* ═══════════════════════════════════════════════
     NOTIONS TACTIQUES AVANCÉES
     ═══════════════════════════════════════════════ */

  'clouage-absolu': {
    legende: 'Cliquez pour voir le Cavalier cloué contre son Roi',
    etapes: [
      {
        texte: 'Le Fou blanc, le Cavalier noir et le Roi noir sont alignés sur la même diagonale.',
        pieces: {
          'b1': 'fouBlanc', 'd3': 'cavalierNoir', 'f5': 'roiNoir',
          'a2': 'roiBlanc',
        },
        surbrillance: ['b1', 'd3', 'f5'],
      },
      {
        texte: 'Le Fou attaque le Cavalier. Si le Cavalier bouge, le Roi est en échec : c\'est interdit.',
        pieces: {
          'b1': 'fouBlanc', 'd3': 'cavalierNoir', 'f5': 'roiNoir',
          'a2': 'roiBlanc',
        },
        surbrillance: ['d3'],
        fleche: { de: 'b1', vers: 'f5' },
      },
      {
        texte: 'Le Cavalier est totalement immobilisé tant que le Fou menace cette diagonale.',
        pieces: {
          'b1': 'fouBlanc', 'd3': 'cavalierNoir', 'f5': 'roiNoir',
          'a2': 'roiBlanc',
        },
        surbrillance: ['d3', 'f5'],
      },
    ],
  },

  'clouage-relatif': {
    legende: 'Cliquez pour voir le Cavalier cloué contre la Dame',
    etapes: [
      {
        texte: 'Cette fois, c\'est la Dame noire (et non le Roi) qui se trouve derrière le Cavalier.',
        pieces: {
          'b1': 'fouBlanc', 'd3': 'cavalierNoir', 'f5': 'reineNoire',
          'a2': 'roiBlanc', 'e8': 'roiNoir',
        },
        surbrillance: ['b1', 'd3', 'f5'],
      },
      {
        texte: 'Le Fou menace de capturer la Dame si le Cavalier s\'écarte de la diagonale.',
        pieces: {
          'b1': 'fouBlanc', 'd3': 'cavalierNoir', 'f5': 'reineNoire',
          'a2': 'roiBlanc', 'e8': 'roiNoir',
        },
        surbrillance: ['d3'],
        fleche: { de: 'b1', vers: 'd3' },
      },
      {
        texte: 'Déplacer le Cavalier reste légal, mais coûterait la Dame : le clouage est dissuasif.',
        pieces: {
          'b1': 'fouBlanc', 'c5': 'cavalierNoir', 'f5': 'reineNoire',
          'a2': 'roiBlanc', 'e8': 'roiNoir',
        },
        surbrillance: ['f5'],
        fleches: [
          { de: 'd3', vers: 'c5' },
          { de: 'b1', vers: 'f5' },
        ],
      },
    ],
  },

  fourchette: {
    legende: 'Cliquez pour voir le Cavalier attaquer deux pièces à la fois',
    etapes: [
      {
        texte: 'Le Cavalier blanc est bien placé pour attaquer le Roi et la Tour noirs simultanément.',
        pieces: {
          'f5': 'cavalierBlanc', 'e8': 'roiNoir', 'c8': 'tourNoire',
          'e1': 'roiBlanc',
        },
        surbrillance: ['f5'],
      },
      {
        texte: 'Le Cavalier saute en d6 : il attaque simultanément le Roi ET la Tour !',
        pieces: {
          'd6': 'cavalierBlanc', 'e8': 'roiNoir', 'c8': 'tourNoire',
          'e1': 'roiBlanc',
        },
        surbrillance: ['d6', 'e8', 'c8'],
        fleche: { de: 'f5', vers: 'd6' },
      },
      {
        texte: 'Le Roi doit fuir l\'échec, puis le Cavalier capture la Tour au coup suivant.',
        pieces: {
          'c8': 'cavalierBlanc', 'd8': 'roiNoir',
          'e1': 'roiBlanc',
        },
        surbrillance: ['c8'],
        fleches: [
          { de: 'e8', vers: 'd8' },
          { de: 'd6', vers: 'c8' },
        ],
      },
    ],
  },

  enfilade: {
    legende: 'Cliquez pour voir la pièce de tête forcée de se dévoiler',
    etapes: [
      {
        texte: 'La Dame et la Tour noires sont alignées sur la colonne e, face à la Tour blanche.',
        pieces: {
          'e1': 'tourBlanche', 'e5': 'reineNoire', 'e8': 'tourNoire',
          'a1': 'roiBlanc', 'a8': 'roiNoir',
        },
        surbrillance: ['e1', 'e5', 'e8'],
      },
      {
        texte: 'La Tour blanche attaque la Dame — la pièce la plus précieuse de l\'alignement.',
        pieces: {
          'e1': 'tourBlanche', 'e5': 'reineNoire', 'e8': 'tourNoire',
          'a1': 'roiBlanc', 'a8': 'roiNoir',
        },
        surbrillance: ['e5'],
        fleche: { de: 'e1', vers: 'e5' },
      },
      {
        texte: 'La Dame doit fuir, dévoilant la Tour noire qui se fait alors capturer.',
        pieces: {
          'e8': 'tourBlanche', 'a5': 'reineNoire',
          'a1': 'roiBlanc', 'a8': 'roiNoir',
        },
        surbrillance: ['e8'],
        fleches: [
          { de: 'e5', vers: 'a5' },
          { de: 'e1', vers: 'e8' },
        ],
      },
    ],
  },

  'attaque-decouverte': {
    legende: 'Cliquez pour voir l\'attaque se révéler derrière le Cavalier',
    etapes: [
      {
        texte: 'Le Cavalier blanc masque la Tour blanche derrière lui, sur la même colonne que la Dame noire.',
        pieces: {
          'c1': 'tourBlanche', 'c4': 'cavalierBlanc', 'c7': 'reineNoire',
          'b1': 'roiBlanc', 'a8': 'roiNoir',
        },
        surbrillance: ['c1', 'c4', 'c7'],
      },
      {
        texte: 'Le Cavalier saute vers une case active, libérant la colonne c.',
        pieces: {
          'c1': 'tourBlanche', 'e3': 'cavalierBlanc', 'c7': 'reineNoire',
          'b1': 'roiBlanc', 'a8': 'roiNoir',
        },
        surbrillance: ['e3', 'c7'],
        fleche: { de: 'c4', vers: 'e3' },
      },
      {
        texte: 'La Tour blanche, cachée jusqu\'ici, attaque maintenant la Dame à découvert !',
        pieces: {
          'c1': 'tourBlanche', 'e3': 'cavalierBlanc', 'c7': 'reineNoire',
          'b1': 'roiBlanc', 'a8': 'roiNoir',
        },
        surbrillance: ['c1', 'c7'],
        fleche: { de: 'c1', vers: 'c7' },
      },
    ],
  },

  'attaque-double': {
    legende: 'Cliquez pour voir un seul coup créer deux menaces',
    etapes: [
      {
        texte: 'La Dame blanche peut avancer sur une case qui menace à la fois le Roi et la Tour noirs.',
        pieces: {
          'b5': 'reineBlanche', 'e8': 'roiNoir', 'h5': 'tourNoire',
          'e1': 'roiBlanc',
        },
        surbrillance: ['b5'],
      },
      {
        texte: 'La Dame se place en e5 : elle donne échec au Roi ET attaque la Tour sur la même rangée.',
        pieces: {
          'e5': 'reineBlanche', 'e8': 'roiNoir', 'h5': 'tourNoire',
          'e1': 'roiBlanc',
        },
        surbrillance: ['e5', 'e8', 'h5'],
        fleche: { de: 'b5', vers: 'e5' },
      },
      {
        texte: 'Le Roi doit parer l\'échec en premier : la Tour sur h5 ne peut plus être sauvée.',
        pieces: {
          'e5': 'reineBlanche', 'd8': 'roiNoir', 'h5': 'tourNoire',
          'e1': 'roiBlanc',
        },
        surbrillance: ['e5', 'h5'],
        fleches: [
          { de: 'e8', vers: 'd8' },
          { de: 'e5', vers: 'h5' },
        ],
      },
    ],
  },

};


/* ───────────────────────────────────────────────────
   État courant de chaque démo affichée
   ─────────────────────────────────────────────────── */

const etatsDemos = {};


/* ───────────────────────────────────────────────────
   Construction du mini-échiquier (8×8 HTML)
   ─────────────────────────────────────────────────── */

function construireGrilleEchiquier(idDemo) {
  /* Wrapper : permet au SVG de se superposer exactement par-dessus la grille */
  let html = `<div class="mini-echiquier-wrapper">`;

  /* La grille 8×8 */
  html += `<div class="mini-echiquier" id="echiquier-${idDemo}">`;
  for (let rangee = 8; rangee >= 1; rangee--) {
    for (let lettreIndex = 0; lettreIndex < 8; lettreIndex++) {
      const lettre    = 'abcdefgh'[lettreIndex];
      const idCase    = `${lettre}${rangee}`;
      const estClaire = (lettreIndex + rangee) % 2 === 0;
      html += `<div class="mini-case ${estClaire ? 'mini-case--claire' : 'mini-case--sombre'}" data-case="${idCase}"></div>`;
    }
  }
  html += `</div>`; /* ferme .mini-echiquier */

  /* SVG superposé — transparent, ne bloque pas les clics sur les cases */
  html += `<svg class="mini-echiquier-svg" id="fleche-${idDemo}" aria-hidden="true"
               viewBox="0 0 304 304" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker id="tete-fleche-${idDemo}" markerWidth="6" markerHeight="6"
              refX="5" refY="3" orient="auto">
        <path d="M0,0 L0,6 L6,3 z" class="mini-fleche-tete"/>
      </marker>
    </defs>
  </svg>`;

  html += `</div>`; /* ferme .mini-echiquier-wrapper */
  return html;
}


/* ───────────────────────────────────────────────────
   Gestion des flèches SVG
   ─────────────────────────────────────────────────── */

/**
 * Convertit une notation de case (ex: "e4") en coordonnées pixels
 * au centre de cette case dans le viewBox 304×304 (8 cases × 38px).
 * @param {string} notation
 * @returns {{x: number, y: number}}
 */
function notationVersCentreCase(notation) {
  const TAILLE_CASE = 38;
  const colonne = 'abcdefgh'.indexOf(notation[0]);
  const rangee  = parseInt(notation[1], 10) - 1;
  /* SVG : y=0 est en haut, rangée 1 est en bas → on inverse */
  return {
    x: colonne * TAILLE_CASE + TAILLE_CASE / 2,
    y: (7 - rangee) * TAILLE_CASE + TAILLE_CASE / 2,
  };
}

/**
 * Dessine toutes les flèches d'une étape sur le SVG du mini-échiquier.
 * Accepte soit etape.fleche (objet unique) soit etape.fleches (tableau).
 * @param {string} idDemo
 * @param {Object} etape
 */
function afficherFlechesEtape(idDemo, etape) {
  const svg = document.getElementById(`fleche-${idDemo}`);
  if (!svg) return;

  /* Effacer toutes les flèches précédentes */
  svg.querySelectorAll('.mini-fleche-ligne').forEach(el => el.remove());

  /* Normaliser : fleche (singulier) → tableau d'une entrée */
  const listeF = etape.fleches
    ? etape.fleches
    : etape.fleche
      ? [etape.fleche]
      : [];

  listeF.forEach(({ de, vers }) => {
    const debut = notationVersCentreCase(de);
    const fin   = notationVersCentreCase(vers);

    const dx       = fin.x - debut.x;
    const dy       = fin.y - debut.y;
    const longueur = Math.sqrt(dx * dx + dy * dy);
    if (longueur === 0) return;

    /* Recul en bout de flèche pour ne pas cacher la pièce d'arrivée */
    const recul = 10;
    const finX  = fin.x - (dx / longueur) * recul;
    const finY  = fin.y - (dy / longueur) * recul;

    const ligne = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    ligne.setAttribute('x1', debut.x);
    ligne.setAttribute('y1', debut.y);
    ligne.setAttribute('x2', finX);
    ligne.setAttribute('y2', finY);
    ligne.setAttribute('marker-end', `url(#tete-fleche-${idDemo})`);
    ligne.classList.add('mini-fleche-ligne');
    svg.appendChild(ligne);
  });
}

/**
 * Efface toutes les flèches du SVG.
 * @param {string} idDemo
 */
function effacerFlechesDemo(idDemo) {
  const svg = document.getElementById(`fleche-${idDemo}`);
  if (!svg) return;
  svg.querySelectorAll('.mini-fleche-ligne').forEach(el => el.remove());
}


/* ───────────────────────────────────────────────────
   Affichage d'une étape de démo
   ─────────────────────────────────────────────────── */

function afficherEtapeDemo(idDemo, indexEtape) {
  const config = DEMOS[idDemo];
  if (!config) return;

  const etape     = config.etapes[indexEtape];
  const echiquier = document.getElementById(`echiquier-${idDemo}`);
  if (!echiquier || !etape) return;

  /* Réinitialiser toutes les cases */
  echiquier.querySelectorAll('.mini-case').forEach(caseEl => {
    caseEl.innerHTML = '';
    caseEl.classList.remove('mini-case--surbrillance', 'mini-case--promue');
  });

  /* Placer les pièces */
  Object.entries(etape.pieces).forEach(([idCase, nomPiece]) => {
    const idCaseReelle = idCase.replace(/a$/, '');
    const caseEl = echiquier.querySelector(`[data-case="${idCaseReelle}"]`);
    if (caseEl) {
      caseEl.innerHTML = `<span class="mini-piece">${SYMBOLES_PIECES[nomPiece]}</span>`;
      if (etape.estPromu && idCase === etape.casePromotion) {
        caseEl.classList.add('mini-case--promue');
      }
    }
  });

  /* Surbrillance */
  if (etape.surbrillance) {
    etape.surbrillance.forEach(idCase => {
      const idCaseReelle = idCase.replace(/a$/, '');
      const caseEl = echiquier.querySelector(`[data-case="${idCaseReelle}"]`);
      if (caseEl) caseEl.classList.add('mini-case--surbrillance');
    });
  }

  /* Flèches */
  const aDesFleches = etape.fleche || etape.fleches;
  if (aDesFleches) {
    afficherFlechesEtape(idDemo, etape);
  } else {
    effacerFlechesDemo(idDemo);
  }

  /* Texte explicatif */
  const texteEl = document.getElementById(`texte-${idDemo}`);
  if (texteEl) texteEl.textContent = etape.texte;

  /* Points de progression */
  mettreAJourPointsDemo(idDemo, indexEtape);

  etatsDemos[idDemo] = indexEtape;
}

function mettreAJourPointsDemo(idDemo, indexEtape) {
  const conteneurPoints = document.getElementById(`points-${idDemo}`);
  if (!conteneurPoints) return;
  conteneurPoints.querySelectorAll('.point-etape').forEach((point, index) => {
    point.classList.toggle('point-etape--actif', index === indexEtape);
  });
}

function etapeSuivanteDemo(idDemo) {
  const config = DEMOS[idDemo];
  if (!config) return;
  const etapeActuelle  = etatsDemos[idDemo] || 0;
  const prochaineEtape = (etapeActuelle + 1) % config.etapes.length;
  afficherEtapeDemo(idDemo, prochaineEtape);
}

function reinitialiserDemo(idDemo) {
  afficherEtapeDemo(idDemo, 0);
}


/* ───────────────────────────────────────────────────
   Génération du bloc HTML complet d'une démo
   ─────────────────────────────────────────────────── */

function genererHtmlDemo(idDemo) {
  const config = DEMOS[idDemo];
  if (!config) return '';

  let pointsHtml = '';
  config.etapes.forEach((_, index) => {
    pointsHtml += `<span class="point-etape ${index === 0 ? 'point-etape--actif' : ''}"></span>`;
  });

  return `
    <div class="demo-interactive">
      <p class="demo-interactive__legende">${config.legende}</p>
      ${construireGrilleEchiquier(idDemo)}
      <div class="demo-interactive__points" id="points-${idDemo}">
        ${pointsHtml}
      </div>
      <p class="demo-interactive__texte" id="texte-${idDemo}"></p>
      <div class="demo-interactive__controles">
        <button class="bouton-demo" onclick="reinitialiserDemo('${idDemo}')">
          ↺ Recommencer
        </button>
        <button class="bouton-demo bouton-demo--principal" onclick="etapeSuivanteDemo('${idDemo}')">
          Étape suivante →
        </button>
      </div>
    </div>
  `;
}

function initialiserDemo(idDemo, idConteneur) {
  const conteneur = document.getElementById(idConteneur);
  if (!conteneur) return;
  conteneur.innerHTML = genererHtmlDemo(idDemo);
  afficherEtapeDemo(idDemo, 0);
}