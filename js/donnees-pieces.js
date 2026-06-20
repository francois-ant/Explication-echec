/* ═══════════════════════════════════════════════════
   ÉCHECS — Données des pièces (donnees-pieces.js)
   Contient toutes les informations textuelles et
   les configurations de déplacement de chaque pièce.
   ═══════════════════════════════════════════════════ */


/* ───────────────────────────────────────────────────
   Structure d'un diagramme de déplacement
   Le plateau est représenté par une grille 7×7.
   La pièce est toujours au centre (position [3][3]).
   Valeurs des cases :
     0 = case vide
     1 = pièce (centre)
     2 = case accessible
     3 = case accessible en capture seulement
   ─────────────────────────────────────────────────── */

const DONNEES_PIECES = {

  roi: {
    nom:      'Le Roi',
    symbole:  '♔',
    valeur:   'Inestimable',
    couleurValeur: '#e74c3c',
    description: `Le Roi est la pièce la plus importante du jeu. Sa capture
      signifie la fin de la partie. Malgré son rôle capital,
      c'est une pièce relativement faible en termes de mobilité.`,
    mouvement: `Le Roi peut se déplacer d'<strong>une seule case</strong> dans
      n'importe quelle direction : horizontalement, verticalement ou en diagonale.
      Il ne peut jamais se déplacer sur une case contrôlée par une pièce adverse.`,
    anecdote: `Le Roi peut réaliser un mouvement spécial appelé le
      <strong>roque</strong> : en partenariat avec une Tour, il peut faire
      un grand bond pour se mettre en sécurité, à condition de n'avoir
      jamais bougé auparavant.`,
    diagramme: [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 2, 2, 2, 0, 0],
      [0, 0, 2, 1, 2, 0, 0],
      [0, 0, 2, 2, 2, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ],
    /* Forme 3D : sphère surmontée d'une croix */
    forme3D: 'roi',
    couleur3D: 0xf0d9b5,
  },

  reine: {
    nom:      'La Reine',
    symbole:  '♕',
    valeur:   '9 points',
    couleurValeur: '#9b59b6',
    description: `La Reine est la pièce la plus puissante du jeu. Elle combine
      les mouvements de la Tour et du Fou, ce qui lui confère une mobilité
      exceptionnelle sur tout l'échiquier.`,
    mouvement: `La Reine peut se déplacer d'<strong>autant de cases qu'elle le souhaite</strong>
      dans n'importe quelle direction : en ligne droite (comme la Tour)
      ou en diagonale (comme le Fou). Elle ne peut pas sauter par-dessus
      les autres pièces.`,
    anecdote: `La Reine n'a pas toujours été la pièce la plus puissante.
      Au Moyen Âge, cette pièce s'appelait le <strong>vizir</strong> et
      ne pouvait se déplacer que d'une case en diagonale.
      C'est au 15e siècle qu'elle a acquis ses pouvoirs actuels.`,
    diagramme: [
      [2, 0, 0, 2, 0, 0, 2],
      [0, 2, 0, 2, 0, 2, 0],
      [0, 0, 2, 2, 2, 0, 0],
      [2, 2, 2, 1, 2, 2, 2],
      [0, 0, 2, 2, 2, 0, 0],
      [0, 2, 0, 2, 0, 2, 0],
      [2, 0, 0, 2, 0, 0, 2],
    ],
    forme3D: 'reine',
    couleur3D: 0xf0d9b5,
  },

  tour: {
    nom:      'La Tour',
    symbole:  '♖',
    valeur:   '5 points',
    couleurValeur: '#e67e22',
    description: `La Tour est une pièce majeure, redoutable en fin de partie.
      Solide et puissante, elle contrôle des lignes entières et excelle
      dans les phases finales où l'échiquier est dégagé.`,
    mouvement: `La Tour peut se déplacer d'<strong>autant de cases qu'elle veut</strong>
      horizontalement ou verticalement. Elle ne peut pas se déplacer
      en diagonale, et ne peut pas sauter par-dessus les autres pièces.`,
    anecdote: `La Tour peut participer au <strong>roque</strong>, le seul mouvement
      où deux pièces bougent simultanément. Deux Tours alignées sur la même
      colonne se "protègent" mutuellement — c'est une configuration
      très puissante appelée "batteries de Tours".`,
    diagramme: [
      [0, 0, 0, 2, 0, 0, 0],
      [0, 0, 0, 2, 0, 0, 0],
      [0, 0, 0, 2, 0, 0, 0],
      [2, 2, 2, 1, 2, 2, 2],
      [0, 0, 0, 2, 0, 0, 0],
      [0, 0, 0, 2, 0, 0, 0],
      [0, 0, 0, 2, 0, 0, 0],
    ],
    forme3D: 'tour',
    couleur3D: 0xf0d9b5,
  },

  fou: {
    nom:      'Le Fou',
    symbole:  '♗',
    valeur:   '3 points',
    couleurValeur: '#27ae60',
    description: `Le Fou est une pièce de valeur moyenne, mais très efficace
      sur un échiquier ouvert. Chaque joueur possède deux Fous :
      l'un reste toujours sur les cases claires, l'autre sur les cases sombres.`,
    mouvement: `Le Fou peut se déplacer d'<strong>autant de cases qu'il veut
      en diagonale</strong>, mais il reste toujours sur la même couleur
      de case. Il ne peut pas sauter par-dessus les autres pièces.`,
    anecdote: `On dit d'un joueur qui a perdu ses deux Fous qu'il a une
      <strong>"paire de Fous déficiente"</strong>. À l'inverse, posséder
      la paire de Fous est souvent un avantage, car ils se complètent
      en couvrant les deux couleurs de cases.`,
    diagramme: [
      [2, 0, 0, 0, 0, 0, 2],
      [0, 2, 0, 0, 0, 2, 0],
      [0, 0, 2, 0, 2, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 2, 0, 2, 0, 0],
      [0, 2, 0, 0, 0, 2, 0],
      [2, 0, 0, 0, 0, 0, 2],
    ],
    forme3D: 'fou',
    couleur3D: 0xf0d9b5,
  },

  cavalier: {
    nom:      'Le Cavalier',
    symbole:  '♘',
    valeur:   '3 points',
    couleurValeur: '#27ae60',
    description: `Le Cavalier est la pièce la plus originale du jeu.
      Il est le seul à pouvoir <strong>sauter par-dessus</strong> les 
      autres pièces. Sa mobilité unique en fait un redoutable
      attaquant dans les positions fermées.`,
    mouvement: `Le Cavalier se déplace en <strong>"L"</strong> : deux cases
      dans une direction, puis une case perpendiculairement (ou inversement).
      Il est la seule pièce à pouvoir ignorer les autres pièces sur son chemin.`,
    anecdote: `Le Cavalier change toujours de couleur de case à chaque mouvement.
      C'est une caractéristique utile : si un Cavalier est sur une case
      claire, après son déplacement, il sera forcément sur une case sombre.
      Un Cavalier en bord de plateau contrôle bien moins de cases qu'au centre.`,
    diagramme: [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 2, 0, 2, 0, 0],
      [0, 2, 0, 0, 0, 2, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [0, 2, 0, 0, 0, 2, 0],
      [0, 0, 2, 0, 2, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ],
    forme3D: 'cavalier',
    couleur3D: 0xf0d9b5,
  },

  pion: {
    nom:      'Le Pion',
    symbole:  '♙',
    valeur:   '1 point',
    couleurValeur: '#7f8c8d',
    description: `Le Pion est la pièce la plus humble, mais aussi la
      plus nombreuse : chaque joueur en possède huit. Ne le sous-estimez pas —
      un Pion qui atteint la dernière rangée adverse peut se transformer
      en n'importe quelle pièce !`,
    mouvement: `Le Pion avance d'<strong>une case vers l'avant</strong>.
      Depuis sa position de départ, il peut avancer de deux cases.
      Il capture en diagonale (une case en avant à gauche ou à droite),
      mais ne peut jamais reculer.`,
    anecdote: `La <strong>prise en passant</strong> est l'un des mouvements les
      plus mystérieux des échecs : si un Pion avance de deux cases depuis
      sa position initiale et passe à côté d'un Pion adverse, ce dernier
      peut le capturer "au passage", comme s'il n'avait avancé que d'une case.`,
    diagramme: [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 3, 2, 3, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ],
    forme3D: 'pion',
    couleur3D: 0xf0d9b5,
  },

};

/* Ordre d'affichage des pièces dans la navigation */
const ORDRE_PIECES = ['roi', 'reine', 'tour', 'fou', 'cavalier', 'pion'];
