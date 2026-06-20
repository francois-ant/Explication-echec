/* ═══════════════════════════════════════════════════
   ÉCHECS — Moteur de règles (moteur-echecs.js)
   Responsabilités :
     - Représenter l'état d'une partie (plateau, tour, droits)
     - Générer les coups légaux pour chaque pièce
     - Détecter échec, échec et mat, pat
     - Gérer les règles spéciales : roque, prise en passant, promotion
   Aucune dépendance au DOM : ce fichier est pur JavaScript,
   utilisable indépendamment de l'affichage.
   ═══════════════════════════════════════════════════ */


/* ───────────────────────────────────────────────────
   Constantes
   ─────────────────────────────────────────────────── */

const COULEUR_BLANC = 'blanc';
const COULEUR_NOIR  = 'noir';

const TYPE_ROI      = 'roi';
const TYPE_REINE    = 'reine';
const TYPE_TOUR     = 'tour';
const TYPE_FOU      = 'fou';
const TYPE_CAVALIER = 'cavalier';
const TYPE_PION     = 'pion';

const COLONNES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];


/* ───────────────────────────────────────────────────
   Création de l'état initial d'une partie
   ─────────────────────────────────────────────────── */

/**
 * Crée un nouvel état de partie avec la position de départ standard.
 * @returns {Object} État de la partie
 */
function creerNouvellePartie() {
  const plateau = creerPlateauVide();

  /* Pions */
  for (let colonne = 0; colonne < 8; colonne++) {
    plateau[1][colonne] = { type: TYPE_PION, couleur: COULEUR_BLANC, aBouge: false };
    plateau[6][colonne] = { type: TYPE_PION, couleur: COULEUR_NOIR,  aBouge: false };
  }

  /* Pièces majeures et mineures */
  const ordreRangee = [TYPE_TOUR, TYPE_CAVALIER, TYPE_FOU, TYPE_REINE, TYPE_ROI, TYPE_FOU, TYPE_CAVALIER, TYPE_TOUR];
  for (let colonne = 0; colonne < 8; colonne++) {
    plateau[0][colonne] = { type: ordreRangee[colonne], couleur: COULEUR_BLANC, aBouge: false };
    plateau[7][colonne] = { type: ordreRangee[colonne], couleur: COULEUR_NOIR,  aBouge: false };
  }

  const partie = {
    plateau,
    tourActuel: COULEUR_BLANC,
    cibleEnPassant: null,      /* {ligne, colonne} de la case capturable en passant, ou null */
    historique: [],            /* liste des coups joués */
    roiEnEchec: { blanc: false, noir: false },
    statut: 'en-cours',        /* 'en-cours' | 'mat' | 'pat' | 'nulle' */
    vainqueur: null,           /* COULEUR_BLANC | COULEUR_NOIR | null */
    compteurCinquanteCoups: 0, /* demi-coups depuis la dernière capture ou le dernier mouvement de pion */
    positionsVues: {},         /* clé de position -> nombre de fois rencontrée (triple répétition) */
  };

  /* Enregistrer la position de départ comme première occurrence */
  enregistrerPositionActuelle(partie);

  return partie;
}

/**
 * Construit une clé textuelle représentant une position complète : placement
 * des pièces, joueur au trait, droits de roque restants et cible en passant.
 * Deux positions strictement identiques produisent la même clé.
 * @param {Object} partie
 * @returns {string}
 */
function construireClePosition(partie) {
  let cle = '';
  for (let l = 0; l < 8; l++) {
    for (let c = 0; c < 8; c++) {
      const piece = partie.plateau[l][c];
      cle += piece ? `${piece.type[0]}${piece.couleur[0]}` : '--';
    }
  }
  cle += `_${partie.tourActuel}`;

  /* Droits de roque restants (influence les coups légaux, donc fait partie de la position) */
  const roiBlanc  = partie.plateau[0][4];
  const roiNoir   = partie.plateau[7][4];
  const tourA1    = partie.plateau[0][0];
  const tourH1    = partie.plateau[0][7];
  const tourA8    = partie.plateau[7][0];
  const tourH8    = partie.plateau[7][7];
  cle += `_${roiBlanc && !roiBlanc.aBouge ? 1 : 0}`;
  cle += `${tourA1 && !tourA1.aBouge ? 1 : 0}${tourH1 && !tourH1.aBouge ? 1 : 0}`;
  cle += `${roiNoir && !roiNoir.aBouge ? 1 : 0}`;
  cle += `${tourA8 && !tourA8.aBouge ? 1 : 0}${tourH8 && !tourH8.aBouge ? 1 : 0}`;

  /* Cible en passant (une prise en passant possible change les coups légaux) */
  cle += partie.cibleEnPassant ? `_${partie.cibleEnPassant.ligne}-${partie.cibleEnPassant.colonne}` : '_none';

  return cle;
}

/**
 * Enregistre la position actuelle dans le compteur de positions vues,
 * et retourne le nombre total d'occurrences de cette position (y compris celle-ci).
 * @param {Object} partie
 * @returns {number}
 */
function enregistrerPositionActuelle(partie) {
  const cle = construireClePosition(partie);
  partie.positionsVues[cle] = (partie.positionsVues[cle] || 0) + 1;
  return partie.positionsVues[cle];
}

/**
 * Crée une grille 8×8 vide (toutes les cases à null).
 * @returns {Array<Array<Object|null>>}
 */
function creerPlateauVide() {
  const plateau = [];
  for (let ligne = 0; ligne < 8; ligne++) {
    plateau.push(new Array(8).fill(null));
  }
  return plateau;
}


/* ───────────────────────────────────────────────────
   Conversion notation ↔ indices
   ─────────────────────────────────────────────────── */

/**
 * Convertit une notation type "e4" en indices {ligne, colonne}.
 * @param {string} notation
 * @returns {{ligne: number, colonne: number}}
 */
function notationVersIndices(notation) {
  const colonne = COLONNES.indexOf(notation[0]);
  const ligne   = parseInt(notation[1], 10) - 1;
  return { ligne, colonne };
}

/**
 * Convertit des indices {ligne, colonne} en notation type "e4".
 * @param {number} ligne
 * @param {number} colonne
 * @returns {string}
 */
function indicesVersNotation(ligne, colonne) {
  return `${COLONNES[colonne]}${ligne + 1}`;
}

/**
 * Vérifie qu'une position (ligne, colonne) est dans les limites du plateau.
 * @param {number} ligne
 * @param {number} colonne
 * @returns {boolean}
 */
function positionValide(ligne, colonne) {
  return ligne >= 0 && ligne <= 7 && colonne >= 0 && colonne <= 7;
}

/**
 * Retourne la couleur adverse d'une couleur donnée.
 * @param {string} couleur
 * @returns {string}
 */
function couleurAdverse(couleur) {
  return couleur === COULEUR_BLANC ? COULEUR_NOIR : COULEUR_BLANC;
}


/* ───────────────────────────────────────────────────
   Génération des coups "bruts" par pièce
   (sans vérifier si le Roi reste en échec après le coup)
   ─────────────────────────────────────────────────── */

/**
 * Génère les coups bruts possibles pour une pièce à une position donnée.
 * @param {Object} partie - État de la partie
 * @param {number} ligne
 * @param {number} colonne
 * @returns {Array<{ligne: number, colonne: number, special: string|null}>}
 */
function genererCoupsBruts(partie, ligne, colonne) {
  const piece = partie.plateau[ligne][colonne];
  if (!piece) return [];

  switch (piece.type) {
    case TYPE_PION:     return coupsPion(partie, ligne, colonne, piece);
    case TYPE_CAVALIER: return coupsCavalier(partie, ligne, colonne, piece);
    case TYPE_FOU:       return coupsGlissants(partie, ligne, colonne, piece, [[1,1],[1,-1],[-1,1],[-1,-1]]);
    case TYPE_TOUR:      return coupsGlissants(partie, ligne, colonne, piece, [[1,0],[-1,0],[0,1],[0,-1]]);
    case TYPE_REINE:     return coupsGlissants(partie, ligne, colonne, piece, [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]);
    case TYPE_ROI:       return coupsRoi(partie, ligne, colonne, piece);
    default:              return [];
  }
}

/**
 * Génère les coups d'un pion (avance, double avance, captures diagonales, en passant).
 */
function coupsPion(partie, ligne, colonne, piece) {
  const coups = [];
  const direction   = piece.couleur === COULEUR_BLANC ? 1 : -1;
  const ligneDepart  = piece.couleur === COULEUR_BLANC ? 1 : 6;
  const ligneArrivee = piece.couleur === COULEUR_BLANC ? 7 : 0;

  /* Avance d'une case */
  const ligneSuivante = ligne + direction;
  if (positionValide(ligneSuivante, colonne) && !partie.plateau[ligneSuivante][colonne]) {
    coups.push({ ligne: ligneSuivante, colonne, special: ligneSuivante === ligneArrivee ? 'promotion' : null });

    /* Avance de deux cases depuis la position de départ */
    const ligneDouble = ligne + direction * 2;
    if (ligne === ligneDepart && positionValide(ligneDouble, colonne) && !partie.plateau[ligneDouble][colonne]) {
      coups.push({ ligne: ligneDouble, colonne, special: 'double-avance' });
    }
  }

  /* Captures en diagonale */
  for (const deltaColonne of [-1, 1]) {
    const colonneCible = colonne + deltaColonne;
    if (!positionValide(ligneSuivante, colonneCible)) continue;

    const pieceCible = partie.plateau[ligneSuivante][colonneCible];
    if (pieceCible && pieceCible.couleur !== piece.couleur) {
      coups.push({ ligne: ligneSuivante, colonne: colonneCible, special: ligneSuivante === ligneArrivee ? 'promotion' : null });
    } else if (
      partie.cibleEnPassant &&
      partie.cibleEnPassant.ligne === ligneSuivante &&
      partie.cibleEnPassant.colonne === colonneCible
    ) {
      coups.push({ ligne: ligneSuivante, colonne: colonneCible, special: 'en-passant' });
    }
  }

  return coups;
}

/**
 * Génère les coups d'un Cavalier (déplacement en "L").
 */
function coupsCavalier(partie, ligne, colonne, piece) {
  const deplacements = [
    [2,1], [2,-1], [-2,1], [-2,-1],
    [1,2], [1,-2], [-1,2], [-1,-2],
  ];
  const coups = [];

  for (const [deltaLigne, deltaColonne] of deplacements) {
    const l = ligne + deltaLigne;
    const c = colonne + deltaColonne;
    if (!positionValide(l, c)) continue;

    const pieceCible = partie.plateau[l][c];
    if (!pieceCible || pieceCible.couleur !== piece.couleur) {
      coups.push({ ligne: l, colonne: c, special: null });
    }
  }

  return coups;
}

/**
 * Génère les coups d'une pièce "glissante" (Tour, Fou, Reine) selon des directions données.
 */
function coupsGlissants(partie, ligne, colonne, piece, directions) {
  const coups = [];

  for (const [deltaLigne, deltaColonne] of directions) {
    let l = ligne + deltaLigne;
    let c = colonne + deltaColonne;

    while (positionValide(l, c)) {
      const pieceCible = partie.plateau[l][c];

      if (!pieceCible) {
        coups.push({ ligne: l, colonne: c, special: null });
      } else {
        if (pieceCible.couleur !== piece.couleur) {
          coups.push({ ligne: l, colonne: c, special: null });
        }
        break; /* Bloqué, qu'il y ait capture ou non */
      }

      l += deltaLigne;
      c += deltaColonne;
    }
  }

  return coups;
}

/**
 * Génère les coups du Roi (1 case dans toutes les directions + roque).
 */
function coupsRoi(partie, ligne, colonne, piece) {
  const coups = [];
  const directions = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];

  for (const [deltaLigne, deltaColonne] of directions) {
    const l = ligne + deltaLigne;
    const c = colonne + deltaColonne;
    if (!positionValide(l, c)) continue;

    const pieceCible = partie.plateau[l][c];
    if (!pieceCible || pieceCible.couleur !== piece.couleur) {
      coups.push({ ligne: l, colonne: c, special: null });
    }
  }

  /* Roque */
  if (!piece.aBouge && !caseEstAttaquee(partie, ligne, colonne, couleurAdverse(piece.couleur))) {
    /* Petit roque (côté Roi, vers la colonne 7) */
    coups.push(...coupsRoquePourCote(partie, ligne, colonne, piece, 7, [5, 6], 6));
    /* Grand roque (côté Dame, vers la colonne 0) */
    coups.push(...coupsRoquePourCote(partie, ligne, colonne, piece, 0, [1, 2, 3], 2));
  }

  return coups;
}

/**
 * Vérifie les conditions de roque pour un côté donné et retourne le coup si valide.
 */
function coupsRoquePourCote(partie, ligne, colonne, piece, colonneTour, colonnesVides, colonneArriveeRoi) {
  const tour = partie.plateau[ligne][colonneTour];
  if (!tour || tour.type !== TYPE_TOUR || tour.aBouge || tour.couleur !== piece.couleur) return [];

  /* Toutes les cases entre le Roi et la Tour doivent être vides */
  for (const c of colonnesVides) {
    if (partie.plateau[ligne][c]) return [];
  }

  /* Le Roi ne doit traverser ni terminer sa course sur une case attaquée */
  const colonneIntermediaire = colonneArriveeRoi === 6 ? 5 : 3;
  if (
    caseEstAttaquee(partie, ligne, colonneIntermediaire, couleurAdverse(piece.couleur)) ||
    caseEstAttaquee(partie, ligne, colonneArriveeRoi, couleurAdverse(piece.couleur))
  ) {
    return [];
  }

  return [{ ligne, colonne: colonneArriveeRoi, special: colonneArriveeRoi === 6 ? 'petit-roque' : 'grand-roque' }];
}


/* ───────────────────────────────────────────────────
   Détection des cases attaquées / échec
   ─────────────────────────────────────────────────── */

/**
 * Vérifie si une case donnée est attaquée par une couleur donnée.
 * Utilise une génération de coups simplifiée (sans roque) pour éviter la récursion infinie.
 * @param {Object} partie
 * @param {number} ligne
 * @param {number} colonne
 * @param {string} couleurAttaquante
 * @returns {boolean}
 */
function caseEstAttaquee(partie, ligne, colonne, couleurAttaquante) {
  for (let l = 0; l < 8; l++) {
    for (let c = 0; c < 8; c++) {
      const piece = partie.plateau[l][c];
      if (!piece || piece.couleur !== couleurAttaquante) continue;

      const coups = piece.type === TYPE_ROI
        ? coupsRoiSimples(partie, l, c, piece)   /* éviter récursion via le roque */
        : genererCoupsBruts(partie, l, c);

      if (coups.some(coup => coup.ligne === ligne && coup.colonne === colonne)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Coups du Roi sans la logique de roque (utilisé uniquement pour la détection d'attaque).
 */
function coupsRoiSimples(partie, ligne, colonne, piece) {
  const coups = [];
  const directions = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];

  for (const [deltaLigne, deltaColonne] of directions) {
    const l = ligne + deltaLigne;
    const c = colonne + deltaColonne;
    if (positionValide(l, c)) coups.push({ ligne: l, colonne: c });
  }

  return coups;
}

/**
 * Trouve la position du Roi d'une couleur donnée.
 * @param {Object} partie
 * @param {string} couleur
 * @returns {{ligne: number, colonne: number}|null}
 */
function trouverRoi(partie, couleur) {
  for (let l = 0; l < 8; l++) {
    for (let c = 0; c < 8; c++) {
      const piece = partie.plateau[l][c];
      if (piece && piece.type === TYPE_ROI && piece.couleur === couleur) {
        return { ligne: l, colonne: c };
      }
    }
  }
  return null;
}

/**
 * Vérifie si le Roi d'une couleur donnée est actuellement en échec.
 * @param {Object} partie
 * @param {string} couleur
 * @returns {boolean}
 */
function roiEstEnEchec(partie, couleur) {
  const positionRoi = trouverRoi(partie, couleur);
  if (!positionRoi) return false;
  return caseEstAttaquee(partie, positionRoi.ligne, positionRoi.colonne, couleurAdverse(couleur));
}


/* ───────────────────────────────────────────────────
   Génération des coups légaux (en filtrant ceux qui laissent le Roi en échec)
   ─────────────────────────────────────────────────── */

/**
 * Génère tous les coups légaux pour la pièce à une position donnée.
 * Un coup est légal s'il ne laisse pas son propre Roi en échec.
 * @param {Object} partie
 * @param {number} ligne
 * @param {number} colonne
 * @returns {Array<{ligne: number, colonne: number, special: string|null}>}
 */
function genererCoupsLegaux(partie, ligne, colonne) {
  const piece = partie.plateau[ligne][colonne];
  if (!piece || piece.couleur !== partie.tourActuel) return [];

  const coupsBruts = genererCoupsBruts(partie, ligne, colonne);
  const coupsLegaux = [];

  for (const coup of coupsBruts) {
    const partieSimulee = simulerCoup(partie, ligne, colonne, coup);
    if (!roiEstEnEchec(partieSimulee, piece.couleur)) {
      coupsLegaux.push(coup);
    }
  }

  return coupsLegaux;
}

/**
 * Génère tous les coups légaux disponibles pour une couleur (toutes pièces confondues).
 * @param {Object} partie
 * @param {string} couleur
 * @returns {Array<{ligneDepart, colonneDepart, ligne, colonne, special}>}
 */
function genererTousCoupsLegaux(partie, couleur) {
  const tousLesCoups = [];

  for (let l = 0; l < 8; l++) {
    for (let c = 0; c < 8; c++) {
      const piece = partie.plateau[l][c];
      if (!piece || piece.couleur !== couleur) continue;

      const coups = genererCoupsLegaux(partie, l, c);
      coups.forEach(coup => {
        tousLesCoups.push({ ligneDepart: l, colonneDepart: c, ...coup });
      });
    }
  }

  return tousLesCoups;
}


/* ───────────────────────────────────────────────────
   Simulation et application d'un coup
   ─────────────────────────────────────────────────── */

/**
 * Crée une copie profonde de l'état de la partie.
 * @param {Object} partie
 * @returns {Object}
 */
/* ───────────────────────────────────────────────────
   Détection du matériel insuffisant pour mater
   ─────────────────────────────────────────────────── */

/**
 * Vérifie si le matériel restant sur le plateau est insuffisant pour
 * qu'un échec et mat soit théoriquement possible. Couvre les cas classiques :
 *   - Roi seul contre Roi seul
 *   - Roi + Fou contre Roi seul
 *   - Roi + Cavalier contre Roi seul
 *   - Roi + Fou contre Roi + Fou, avec les deux Fous sur la même couleur de case
 * @param {Object} partie
 * @returns {boolean}
 */
function materielEstInsuffisant(partie) {
  const piecesRestantes = [];

  for (let l = 0; l < 8; l++) {
    for (let c = 0; c < 8; c++) {
      const piece = partie.plateau[l][c];
      if (piece && piece.type !== TYPE_ROI) {
        piecesRestantes.push({ ...piece, ligne: l, colonne: c });
      }
    }
  }

  /* Présence d'un Pion, d'une Tour ou d'une Reine : du mat reste toujours possible */
  const aDuMaterielLourd = piecesRestantes.some(p =>
    p.type === TYPE_PION || p.type === TYPE_TOUR || p.type === TYPE_REINE
  );
  if (aDuMaterielLourd) return false;

  /* Roi seul contre Roi seul */
  if (piecesRestantes.length === 0) return true;

  /* Roi + une seule pièce mineure (Fou ou Cavalier) contre Roi seul */
  if (piecesRestantes.length === 1) {
    return piecesRestantes[0].type === TYPE_FOU || piecesRestantes[0].type === TYPE_CAVALIER;
  }

  /* Roi + Fou contre Roi + Fou, les deux Fous sur la même couleur de case */
  if (piecesRestantes.length === 2 && piecesRestantes.every(p => p.type === TYPE_FOU)) {
    const couleurCase = (p) => (p.ligne + p.colonne) % 2;
    return couleurCase(piecesRestantes[0]) === couleurCase(piecesRestantes[1]);
  }

  return false;
}



/**
 * Crée une copie profonde de l'état de la partie.
 * @param {Object} partie
 * @returns {Object}
 */
function clonerPartie(partie) {
  return {
    plateau: partie.plateau.map(rangee => rangee.map(piece => piece ? { ...piece } : null)),
    tourActuel: partie.tourActuel,
    cibleEnPassant: partie.cibleEnPassant ? { ...partie.cibleEnPassant } : null,
    historique: [...partie.historique],
    roiEnEchec: { ...partie.roiEnEchec },
    statut: partie.statut,
    vainqueur: partie.vainqueur,
    compteurCinquanteCoups: partie.compteurCinquanteCoups,
    positionsVues: { ...partie.positionsVues },
  };
}

/**
 * Simule un coup sur une copie de la partie, sans modifier l'original.
 * Utilisé uniquement pour tester si un coup laisse le Roi en échec.
 * @param {Object} partie
 * @param {number} ligneDepart
 * @param {number} colonneDepart
 * @param {Object} coup
 * @returns {Object} Nouvelle partie simulée
 */
function simulerCoup(partie, ligneDepart, colonneDepart, coup) {
  const partieSimulee = clonerPartie(partie);
  const piece = partieSimulee.plateau[ligneDepart][colonneDepart];

  /* Gestion de la prise en passant : retirer le pion capturé */
  if (coup.special === 'en-passant') {
    const ligneCapture = piece.couleur === COULEUR_BLANC ? coup.ligne - 1 : coup.ligne + 1;
    partieSimulee.plateau[ligneCapture][coup.colonne] = null;
  }

  /* Déplacement de la pièce */
  partieSimulee.plateau[coup.ligne][coup.colonne] = piece;
  partieSimulee.plateau[ligneDepart][colonneDepart] = null;

  /* Gestion du roque : déplacer aussi la Tour */
  if (coup.special === 'petit-roque') {
    const tour = partieSimulee.plateau[ligneDepart][7];
    partieSimulee.plateau[ligneDepart][5] = tour;
    partieSimulee.plateau[ligneDepart][7] = null;
  } else if (coup.special === 'grand-roque') {
    const tour = partieSimulee.plateau[ligneDepart][0];
    partieSimulee.plateau[ligneDepart][3] = tour;
    partieSimulee.plateau[ligneDepart][0] = null;
  }

  return partieSimulee;
}

/**
 * Applique réellement un coup à la partie (modifie l'état, change de tour,
 * met à jour les drapeaux, et détecte échec/mat/pat).
 * @param {Object} partie
 * @param {number} ligneDepart
 * @param {number} colonneDepart
 * @param {Object} coup - {ligne, colonne, special}
 * @param {string} typePromotion - Type de pièce choisi en cas de promotion (optionnel)
 * @returns {Object} Le coup joué, enrichi d'informations pour l'historique
 */
function jouerCoup(partie, ligneDepart, colonneDepart, coup, typePromotion) {
  const piece = partie.plateau[ligneDepart][colonneDepart];
  const pieceCapturee = partie.plateau[coup.ligne][coup.colonne];
  const etaitUnPion = piece.type === TYPE_PION; /* à mémoriser avant une éventuelle promotion */

  /* Prise en passant : retirer le pion capturé (qui n'est pas sur la case d'arrivée) */
  let pieceCapturePassant = null;
  if (coup.special === 'en-passant') {
    const ligneCapture = piece.couleur === COULEUR_BLANC ? coup.ligne - 1 : coup.ligne + 1;
    pieceCapturePassant = partie.plateau[ligneCapture][coup.colonne];
    partie.plateau[ligneCapture][coup.colonne] = null;
  }

  /* Déplacement principal */
  partie.plateau[coup.ligne][coup.colonne] = piece;
  partie.plateau[ligneDepart][colonneDepart] = null;
  piece.aBouge = true;

  /* Roque : déplacer la Tour en même temps */
  if (coup.special === 'petit-roque') {
    const tour = partie.plateau[ligneDepart][7];
    partie.plateau[ligneDepart][5] = tour;
    partie.plateau[ligneDepart][7] = null;
    tour.aBouge = true;
  } else if (coup.special === 'grand-roque') {
    const tour = partie.plateau[ligneDepart][0];
    partie.plateau[ligneDepart][3] = tour;
    partie.plateau[ligneDepart][0] = null;
    tour.aBouge = true;
  }

  /* Promotion : transformer le pion */
  if (coup.special === 'promotion') {
    piece.type = typePromotion || TYPE_REINE;
  }

  /* Mise à jour de la cible "en passant" pour le prochain coup */
  if (coup.special === 'double-avance') {
    const ligneIntermediaire = (ligneDepart + coup.ligne) / 2;
    partie.cibleEnPassant = { ligne: ligneIntermediaire, colonne: colonneDepart };
  } else {
    partie.cibleEnPassant = null;
  }

  /* Règle des 50 coups : le compteur de demi-coups se remet à zéro après
     une capture ou un mouvement de pion, sinon il s'incrémente. */
  const yAEuCapture = Boolean(pieceCapturee || pieceCapturePassant);
  if (etaitUnPion || yAEuCapture) {
    partie.compteurCinquanteCoups = 0;
  } else {
    partie.compteurCinquanteCoups += 1;
  }

  /* Triple répétition : un coup de pion ou une capture est irréversible,
     donc aucune position antérieure à ce coup ne pourra plus jamais se
     reproduire. On vide l'historique des positions à ce moment-là.
     C'est un compteur indépendant de compteurCinquanteCoups : il se trouve
     juste partager le même déclencheur, mais les deux ne sont pas liés. */
  if (etaitUnPion || yAEuCapture) {
    partie.positionsVues = {};
  }

  /* Construction de l'entrée d'historique */
  const coupJoue = {
    piece: piece.type,
    couleur: piece.couleur,
    depart: indicesVersNotation(ligneDepart, colonneDepart),
    arrivee: indicesVersNotation(coup.ligne, coup.colonne),
    special: coup.special,
    capture: yAEuCapture,
    pieceCapturee: pieceCapturee ? pieceCapturee.type : (pieceCapturePassant ? pieceCapturePassant.type : null),
  };

  /* Changement de tour */
  partie.tourActuel = couleurAdverse(piece.couleur);

  /* Détection échec / mat / pat pour le joueur qui doit maintenant jouer */
  partie.roiEnEchec.blanc = roiEstEnEchec(partie, COULEUR_BLANC);
  partie.roiEnEchec.noir  = roiEstEnEchec(partie, COULEUR_NOIR);

  const enEchecMaintenant = partie.roiEnEchec[partie.tourActuel === COULEUR_BLANC ? 'blanc' : 'noir'];
  const coupsRestants = genererTousCoupsLegaux(partie, partie.tourActuel);

  /* Enregistrer la nouvelle position pour la détection de triple répétition */
  const nbOccurrencesPosition = enregistrerPositionActuelle(partie);

  if (coupsRestants.length === 0) {
    if (enEchecMaintenant) {
      partie.statut = 'mat';
      partie.vainqueur = piece.couleur; /* celui qui vient de jouer gagne */
      coupJoue.echecEtMat = true;
    } else {
      partie.statut = 'pat';
      coupJoue.pat = true;
    }
  } else if (partie.compteurCinquanteCoups >= 100) {
    /* 100 demi-coups = 50 coups complets (un coup complet = un coup blanc + un coup noir) */
    partie.statut = 'nulle';
    coupJoue.nulleCinquanteCoups = true;
  } else if (nbOccurrencesPosition >= 3) {
    partie.statut = 'nulle';
    coupJoue.nulleRepetition = true;
  } else if (materielEstInsuffisant(partie)) {
    partie.statut = 'nulle';
    coupJoue.nulleMaterielInsuffisant = true;
  } else if (enEchecMaintenant) {
    coupJoue.echec = true;
  }
 
  partie.historique.push(coupJoue);

  return coupJoue;
}