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
