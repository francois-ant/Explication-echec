/* ═══════════════════════════════════════════════════
   ÉCHECS — Démos interactives (demos-interactives.js)
   Mini-échiquiers cliquables pour illustrer :
     - le roque
     - la prise en passant
     - la promotion
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
   Configuration de chaque démo
   Chaque démo définit :
     - une position de départ (grille 8×8, null = case vide)
     - une étape "avant" et une étape "après"
     - les cases à mettre en évidence pour guider l'œil
   ─────────────────────────────────────────────────── */

const DEMOS = {

  /* ─── ROQUE (petit roque, côté Blancs) ─── */
  roque: {
    legende: 'Cliquez pour voir le Roi roquer avec la Tour',
    etapes: [
      {
        texte: 'Position avant le roque : le Roi et la Tour n\'ont pas bougé.',
        pieces: {
          'e1': 'roiBlanc', 'h1': 'tourBlanche',
          'e8': 'roiNoir',
        },
        surbrillance: ['e1', 'h1'],
      },
      {
        texte: 'Petit roque : le Roi se déplace de 2 cases vers la Tour.',
        pieces: {
          'g1': 'roiBlanc', 'h1': 'tourBlanche',
          'e8': 'roiNoir',
        },
        surbrillance: ['g1'],
        fleche: { de: 'e1', vers: 'g1' },
      },
      {
        texte: 'La Tour saute par-dessus le Roi pour terminer à côté de lui.',
        pieces: {
          'g1': 'roiBlanc', 'f1': 'tourBlanche',
          'e8': 'roiNoir',
        },
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
        pieces: {
          'e5': 'pionBlanc', 'd7': 'pionNoir',
          'e1': 'roiBlanc', 'e8': 'roiNoir',
        },
        surbrillance: ['e5'],
      },
      {
        texte: 'Le pion noir avance de 2 cases d\'un coup : d7 → d5.',
        pieces: {
          'e5': 'pionBlanc', 'd5': 'pionNoir',
          'e1': 'roiBlanc', 'e8': 'roiNoir',
        },
        surbrillance: ['d5'],
        fleche: { de: 'd7', vers: 'd5' },
      },
      {
        texte: 'Le pion blanc capture "en passant" : il prend comme si le pion noir n\'avait avancé que d\'une case.',
        pieces: {
          'd6': 'pionBlanc',
          'e1': 'roiBlanc', 'e8': 'roiNoir',
        },
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
        pieces: {
          'e7': 'pionBlanc',
          'e1': 'roiBlanc', 'a8': 'roiNoir',
        },
        surbrillance: ['e7'],
      },
      {
        texte: 'Il avance sur la 8e rangée, la dernière pour les Blancs.',
        pieces: {
          'e8a': 'pionBlanc',  /* identifiant temporaire avant transformation */
          'e1': 'roiBlanc', 'a8': 'roiNoir',
        },
        surbrillance: ['e8a'],
        fleche: { de: 'e7', vers: 'e8a' },
        casePromotion: 'e8a',
      },
      {
        texte: 'Le joueur choisit de le transformer en Reine — son coup le plus puissant !',
        pieces: {
          'e8a': 'reineBlanche',
          'e1': 'roiBlanc', 'a8': 'roiNoir',
        },
        surbrillance: ['e8a'],
        estPromu: true,
      },
    ],
  },

  /* ═══════════════════════════════════════════════
     PRINCIPES D'OUVERTURE
     ═══════════════════════════════════════════════ */

  /* ─── CONTRÔLE DU CENTRE ─── */
  'controle-centre': {
    legende: 'Cliquez pour voir comment le centre s\'installe',
    etapes: [
      {
        texte: 'Position de départ : aucune pièce ne contrôle encore le centre.',
        pieces: {
          'e1': 'roiBlanc', 'd1': 'reineBlanche',
          'e2': 'pionBlanc', 'd2': 'pionBlanc',
          'e8': 'roiNoir', 'd8': 'reineNoire',
          'e7': 'pionNoir', 'd7': 'pionNoir',
        },
        surbrillance: ['e4', 'd4', 'e5', 'd5'],
      },
      {
        texte: 'Les Blancs avancent un pion central : e2-e4, et contrôlent déjà d5 et f5.',
        pieces: {
          'e1': 'roiBlanc', 'd1': 'reineBlanche',
          'e4': 'pionBlanc', 'd2': 'pionBlanc',
          'e8': 'roiNoir', 'd8': 'reineNoire',
          'e7': 'pionNoir', 'd7': 'pionNoir',
        },
        surbrillance: ['e4'],
        fleche: { de: 'e2', vers: 'e4' },
      },
      {
        texte: 'Les Noirs répondent symétriquement avec e7-e5 : les deux camps se disputent le centre.',
        pieces: {
          'e1': 'roiBlanc', 'd1': 'reineBlanche',
          'e4': 'pionBlanc', 'd2': 'pionBlanc',
          'e8': 'roiNoir', 'd8': 'reineNoire',
          'e5': 'pionNoir', 'd7': 'pionNoir',
        },
        surbrillance: ['e4', 'e5'],
        fleche: { de: 'e7', vers: 'e5' },
      },
    ],
  },

  /* ─── DÉVELOPPEMENT DES PIÈCES ─── */
  developpement: {
    legende: 'Cliquez pour voir l\'ordre de développement idéal',
    etapes: [
      {
        texte: 'Toutes les pièces mineures sont encore à leur case de départ.',
        pieces: {
          'e1': 'roiBlanc', 'd1': 'reineBlanche',
          'b1': 'cavalierBlanc', 'g1': 'cavalierBlanc',
          'c1': 'fouBlanc', 'f1': 'fouBlanc',
          'e8': 'roiNoir',
        },
        surbrillance: ['b1', 'g1', 'c1', 'f1'],
      },
      {
        texte: 'Le Cavalier sort en premier : il ne peut être bloqué par aucun pion.',
        pieces: {
          'e1': 'roiBlanc', 'd1': 'reineBlanche',
          'f3': 'cavalierBlanc', 'g1': 'cavalierBlanc',
          'c1': 'fouBlanc', 'f1': 'fouBlanc',
          'e8': 'roiNoir',
        },
        surbrillance: ['f3'],
        fleche: { de: 'b1', vers: 'f3' },
      },
      {
        texte: 'Puis le Fou se développe à son tour, sur une diagonale dégagée.',
        pieces: {
          'e1': 'roiBlanc', 'd1': 'reineBlanche',
          'f3': 'cavalierBlanc', 'g1': 'cavalierBlanc',
          'c4': 'fouBlanc', 'f1': 'fouBlanc',
          'e8': 'roiNoir',
        },
        surbrillance: ['c4'],
        fleche: { de: 'c1', vers: 'c4' },
      },
    ],
  },

  /* ─── SÉCURITÉ DU ROI (roque illustré dans ce contexte) ─── */
  'securite-roi': {
    legende: 'Cliquez pour voir le Roi se mettre à l\'abri',
    etapes: [
      {
        texte: 'Le Roi est encore au centre, une fois le Cavalier et le Fou développés.',
        pieces: {
          'e1': 'roiBlanc', 'h1': 'tourBlanche',
          'f3': 'cavalierBlanc', 'c4': 'fouBlanc',
          'e8': 'roiNoir',
        },
        surbrillance: ['e1'],
      },
      {
        texte: 'La voie est libre entre le Roi et la Tour : le roque est possible.',
        pieces: {
          'e1': 'roiBlanc', 'h1': 'tourBlanche',
          'f3': 'cavalierBlanc', 'c4': 'fouBlanc',
          'e8': 'roiNoir',
        },
        surbrillance: ['e1', 'h1'],
      },
      {
        texte: 'Après le petit roque, le Roi est en sécurité et la Tour est active.',
        pieces: {
          'g1': 'roiBlanc', 'f1': 'tourBlanche',
          'f3': 'cavalierBlanc', 'c4': 'fouBlanc',
          'e8': 'roiNoir',
        },
        surbrillance: ['g1'],
      },
    ],
  },

  /* ═══════════════════════════════════════════════
     NOTIONS TACTIQUES AVANCÉES
     ═══════════════════════════════════════════════ */

  /* ─── CLOUAGE ABSOLU (Fou cloue un Cavalier contre le Roi) ─── */
  'clouage-absolu': {
    legende: 'Cliquez pour voir le Cavalier noir clos contre son Roi',
    etapes: [
      {
        texte: 'Le Cavalier noir, le Roi noir et le Fou blanc sont alignés sur la même diagonale.',
        pieces: {
          'b5': 'fouBlanc', 'd7': 'cavalierNoir', 'f5': 'roiNoir',
          'e1': 'roiBlanc',
        },
        surbrillance: ['b5', 'd7', 'f5'],
      },
      {
        texte: 'Le Fou attaque directement le Cavalier, qui protège la diagonale jusqu\'au Roi.',
        pieces: {
          'b5': 'fouBlanc', 'd7': 'cavalierNoir', 'f5': 'roiNoir',
          'e1': 'roiBlanc',
        },
        surbrillance: ['d7'],
        fleche: { de: 'b5', vers: 'd7' },
      },
      {
        texte: 'Le Cavalier ne peut pas bouger : ce serait un coup illégal, le Roi noir se retrouverait en échec.',
        pieces: {
          'b5': 'fouBlanc', 'd7': 'cavalierNoir', 'f5': 'roiNoir',
          'e1': 'roiBlanc',
        },
        surbrillance: ['d7', 'f5'],
      },
    ],
  },

  /* ─── CLOUAGE RELATIF (Fou cloue un Cavalier contre la Dame) ─── */
  'clouage-relatif': {
    legende: 'Cliquez pour voir le Cavalier noir clos contre sa Dame',
    etapes: [
      {
        texte: 'Cette fois, c\'est la Dame noire (et non le Roi) qui se trouve derrière le Cavalier.',
        pieces: {
          'b5': 'fouBlanc', 'd7': 'cavalierNoir', 'f5': 'reineNoire',
          'e1': 'roiBlanc', 'e8': 'roiNoir',
        },
        surbrillance: ['b5', 'd7', 'f5'],
      },
      {
        texte: 'Le Fou menace de capturer la Dame si le Cavalier s\'écarte de la diagonale.',
        pieces: {
          'b5': 'fouBlanc', 'd7': 'cavalierNoir', 'f5': 'reineNoire',
          'e1': 'roiBlanc', 'e8': 'roiNoir',
        },
        surbrillance: ['d7'],
        fleche: { de: 'b5', vers: 'd7' },
      },
      {
        texte: 'Déplacer le Cavalier reste légal, mais coûterait la Dame : le clouage est donc dissuasif, pas absolu.',
        pieces: {
          'b5': 'fouBlanc', 'c5': 'cavalierNoir', 'f5': 'reineNoire',
          'e1': 'roiBlanc', 'e8': 'roiNoir',
        },
        surbrillance: ['f5'],
        fleche: { de: 'd7', vers: 'c5' },
      },
    ],
  },

  /* ─── FOURCHETTE (Cavalier attaque Roi et Tour) ─── */
  fourchette: {
    legende: 'Cliquez pour voir le Cavalier fourchetter deux pièces',
    etapes: [
      {
        texte: 'Le Cavalier blanc s\'approche du Roi et de la Tour noirs, mal coordonnés.',
        pieces: {
          'd5': 'cavalierBlanc', 'e8': 'roiNoir', 'c8': 'tourNoire',
          'e1': 'roiBlanc',
        },
        surbrillance: ['d5'],
      },
      {
        texte: 'Le Cavalier saute en c6 : il attaque simultanément le Roi et la Tour !',
        pieces: {
          'c6': 'cavalierBlanc', 'e8': 'roiNoir', 'c8': 'tourNoire',
          'e1': 'roiBlanc',
        },
        surbrillance: ['c6', 'e8', 'c8'],
        fleche: { de: 'd5', vers: 'c6' },
      },
      {
        texte: 'Le Roi doit bouger pour sortir de l\'échec : le Cavalier capture ensuite la Tour.',
        pieces: {
          'c6': 'cavalierBlanc', 'd8': 'roiNoir',
          'e1': 'roiBlanc',
        },
        surbrillance: ['c6'],
        fleche: { de: 'e8', vers: 'd8' },
      },
    ],
  },

  /* ─── ENFILADE (Tour attaque Dame, puis Tour derrière) ─── */
  enfilade: {
    legende: 'Cliquez pour voir la Dame forcée de dévoiler la Tour',
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
        texte: 'La Tour blanche attaque la Dame, la pièce la plus précieuse de l\'alignement.',
        pieces: {
          'e1': 'tourBlanche', 'e5': 'reineNoire', 'e8': 'tourNoire',
          'a1': 'roiBlanc', 'a8': 'roiNoir',
        },
        surbrillance: ['e5'],
        fleche: { de: 'e1', vers: 'e5' },
      },
      {
        texte: 'La Dame doit fuir la colonne e, dévoilant la Tour noire qui se fait alors capturer.',
        pieces: {
          'e1': 'tourBlanche', 'c5': 'reineNoire', 'e8': 'tourNoire',
          'a1': 'roiBlanc', 'a8': 'roiNoir',
        },
        surbrillance: ['e8'],
        fleche: { de: 'e5', vers: 'c5' },
      },
    ],
  },

  /* ─── ATTAQUE À LA DÉCOUVERTE (Cavalier bouge, Tour révélée attaque la Dame) ─── */
  'attaque-decouverte': {
    legende: 'Cliquez pour voir l\'attaque se révéler derrière le Cavalier',
    etapes: [
      {
        texte: 'Le Cavalier blanc est posté entre sa propre Tour et la Dame adverse, sur la même colonne.',
        pieces: {
          'e1': 'tourBlanche', 'e4': 'cavalierBlanc', 'e7': 'reineNoire',
          'a1': 'roiBlanc', 'a8': 'roiNoir',
        },
        surbrillance: ['e1', 'e4', 'e7'],
      },
      {
        texte: 'Le Cavalier saute vers une case active, libérant la colonne e.',
        pieces: {
          'e1': 'tourBlanche', 'd6': 'cavalierBlanc', 'e7': 'reineNoire',
          'a1': 'roiBlanc', 'a8': 'roiNoir',
        },
        surbrillance: ['d6'],
        fleche: { de: 'e4', vers: 'd6' },
      },
      {
        texte: 'La Tour blanche, jusque-là cachée, attaque maintenant la Dame à découvert !',
        pieces: {
          'e1': 'tourBlanche', 'd6': 'cavalierBlanc', 'e7': 'reineNoire',
          'a1': 'roiBlanc', 'a8': 'roiNoir',
        },
        surbrillance: ['e1', 'e7'],
        fleche: { de: 'e1', vers: 'e7' },
      },
    ],
  },

  /* ─── ATTAQUE DOUBLE (un coup de Dame menace Roi en échec ET une Tour) ─── */
  'attaque-double': {
    legende: 'Cliquez pour voir un seul coup créer deux menaces',
    etapes: [
      {
        texte: 'La Dame blanche peut avancer sur une case qui touche à la fois le Roi et la Tour noirs.',
        pieces: {
          'b3': 'reineBlanche', 'e8': 'roiNoir', 'h8': 'tourNoire',
          'e1': 'roiBlanc',
        },
        surbrillance: ['b3'],
      },
      {
        texte: 'La Dame se place en e6 : échec au Roi, tout en attaquant la Tour sur la même diagonale.',
        pieces: {
          'e6': 'reineBlanche', 'e8': 'roiNoir', 'h8': 'tourNoire',
          'e1': 'roiBlanc',
        },
        surbrillance: ['e6', 'e8', 'h8'],
        fleche: { de: 'b3', vers: 'e6' },
      },
      {
        texte: 'Le Roi doit d\'abord parer l\'échec : la Tour ne peut plus être sauvée au coup suivant.',
        pieces: {
          'e6': 'reineBlanche', 'd8': 'roiNoir', 'h8': 'tourNoire',
          'e1': 'roiBlanc',
        },
        surbrillance: ['e6', 'h8'],
        fleche: { de: 'e8', vers: 'd8' },
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

/**
 * Construit le HTML d'un mini-échiquier vide (structure de cases).
 * @param {string} idDemo - Identifiant de la démo
 * @returns {string} HTML du plateau
 */
function construireGrilleEchiquier(idDemo) {
  let html = `<div class="mini-echiquier" id="echiquier-${idDemo}">`;

  for (let rangee = 8; rangee >= 1; rangee--) {
    for (let lettreIndex = 0; lettreIndex < 8; lettreIndex++) {
      const lettre  = 'abcdefgh'[lettreIndex];
      const idCase  = `${lettre}${rangee}`;
      const estClaire = (lettreIndex + rangee) % 2 === 0;
      html += `<div class="mini-case ${estClaire ? 'mini-case--claire' : 'mini-case--sombre'}" data-case="${idCase}"></div>`;
    }
  }

  html += `</div>`;
  return html;
}

/**
 * Affiche une étape donnée d'une démo sur son échiquier.
 * @param {string} idDemo - Identifiant de la démo
 * @param {number} indexEtape - Index de l'étape à afficher
 */
function afficherEtapeDemo(idDemo, indexEtape) {
  const config = DEMOS[idDemo];
  if (!config) return;

  const etape = config.etapes[indexEtape];
  const echiquier = document.getElementById(`echiquier-${idDemo}`);
  if (!echiquier || !etape) return;

  /* Réinitialiser toutes les cases */
  echiquier.querySelectorAll('.mini-case').forEach(caseEl => {
    caseEl.innerHTML = '';
    caseEl.classList.remove('mini-case--surbrillance', 'mini-case--promue');
  });

  /* Placer les pièces (en ignorant le suffixe 'a' utilisé pour la promotion) */
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

  /* Mettre en surbrillance les cases pertinentes */
  if (etape.surbrillance) {
    etape.surbrillance.forEach(idCase => {
      const idCaseReelle = idCase.replace(/a$/, '');
      const caseEl = echiquier.querySelector(`[data-case="${idCaseReelle}"]`);
      if (caseEl) caseEl.classList.add('mini-case--surbrillance');
    });
  }

  /* Mettre à jour le texte explicatif */
  const texteEl = document.getElementById(`texte-${idDemo}`);
  if (texteEl) texteEl.textContent = etape.texte;

  /* Mettre à jour les points de progression */
  mettreAJourPointsDemo(idDemo, indexEtape);

  etatsDemos[idDemo] = indexEtape;
}

/**
 * Met à jour les points indicateurs d'étape sous le mini-échiquier.
 * @param {string} idDemo
 * @param {number} indexEtape
 */
function mettreAJourPointsDemo(idDemo, indexEtape) {
  const conteneurPoints = document.getElementById(`points-${idDemo}`);
  if (!conteneurPoints) return;

  conteneurPoints.querySelectorAll('.point-etape').forEach((point, index) => {
    point.classList.toggle('point-etape--actif', index === indexEtape);
  });
}

/**
 * Passe à l'étape suivante de la démo (boucle au début si dernière étape).
 * @param {string} idDemo
 */
function etapeSuivanteDemo(idDemo) {
  const config = DEMOS[idDemo];
  if (!config) return;

  const etapeActuelle = etatsDemos[idDemo] || 0;
  const prochaineEtape = (etapeActuelle + 1) % config.etapes.length;
  afficherEtapeDemo(idDemo, prochaineEtape);
}

/**
 * Revient à la première étape de la démo.
 * @param {string} idDemo
 */
function reinitialiserDemo(idDemo) {
  afficherEtapeDemo(idDemo, 0);
}


/* ───────────────────────────────────────────────────
   Construction du bloc HTML complet d'une démo
   (échiquier + texte + contrôles)
   ─────────────────────────────────────────────────── */

/**
 * Génère le HTML complet d'une démo interactive prête à être injectée.
 * @param {string} idDemo - Identifiant de la démo (clé dans DEMOS)
 * @returns {string} HTML complet
 */
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

/**
 * Initialise une démo : injecte son HTML dans le conteneur cible
 * et affiche sa première étape.
 * @param {string} idDemo - Identifiant de la démo
 * @param {string} idConteneur - id de l'élément DOM cible
 */
function initialiserDemo(idDemo, idConteneur) {
  const conteneur = document.getElementById(idConteneur);
  if (!conteneur) return;

  conteneur.innerHTML = genererHtmlDemo(idDemo);
  afficherEtapeDemo(idDemo, 0);
}