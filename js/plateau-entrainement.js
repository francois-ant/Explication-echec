/* ═══════════════════════════════════════════════════
   ÉCHECS — Plateau d'entraînement (plateau-entrainement.js)
   Responsabilités :
     - Afficher le plateau HTML à partir de l'état du moteur
     - Gérer les clics : sélection, coups possibles, déplacement
     - Afficher l'historique des coups
     - Gérer la fin de partie (mat / pat) et la boîte de promotion
   ═══════════════════════════════════════════════════ */


/* ───────────────────────────────────────────────────
   Symboles Unicode des pièces (réutilisés du fichier demos)
   ─────────────────────────────────────────────────── */

const SYMBOLES_PIECES_PLATEAU = {
  roi:      { blanc: '♔', noir: '♚' },
  reine:    { blanc: '♕', noir: '♛' },
  tour:     { blanc: '♖', noir: '♜' },
  fou:      { blanc: '♗', noir: '♝' },
  cavalier: { blanc: '♘', noir: '♞' },
  pion:     { blanc: '♙', noir: '♟' },
};

const NOMS_PIECES_FR = {
  roi: 'Roi', reine: 'Reine', tour: 'Tour',
  fou: 'Fou', cavalier: 'Cavalier', pion: 'Pion',
};


/* ───────────────────────────────────────────────────
   État de l'interface (séparé de l'état du moteur)
   ─────────────────────────────────────────────────── */

let partieActuelle      = null;
let caseSelectionnee    = null;   /* {ligne, colonne} ou null */
let coupsPossibles      = [];     /* coups légaux de la pièce sélectionnée */
let coupEnAttentePromotion = null; /* coup en attente du choix de promotion */
let plateauRetourne     = false;  /* true = vue depuis les Noirs */


/* ───────────────────────────────────────────────────
   Initialisation et nouvelle partie
   ─────────────────────────────────────────────────── */

/**
 * Démarre une nouvelle partie et réinitialise l'affichage.
 */
function nouvellePartie() {
  partieActuelle   = creerNouvellePartie();
  caseSelectionnee = null;
  coupsPossibles   = [];
  coupEnAttentePromotion = null;

  construireGrillePlateau();
  rafraichirAffichagePlateau();
  rafraichirHistorique();
  rafraichirIndicateurTour();
  masquerBandeauFinPartie();
}

/**
 * Inverse l'orientation du plateau (vue Blancs ↔ vue Noirs).
 */
function retournerPlateau() {
  plateauRetourne = !plateauRetourne;
  construireGrillePlateau();
  rafraichirAffichagePlateau();
}


/* ───────────────────────────────────────────────────
   Construction de la grille HTML (structure statique des 64 cases)
   ─────────────────────────────────────────────────── */

/**
 * Construit les 64 cases du plateau dans le DOM.
 * Appelé une fois au départ, et de nouveau si on retourne le plateau.
 */
function construireGrillePlateau() {
  const conteneur = document.getElementById('plateauJeu');
  if (!conteneur) return;

  const lignesAffichage = plateauRetourne
    ? [0, 1, 2, 3, 4, 5, 6, 7]
    : [7, 6, 5, 4, 3, 2, 1, 0];
  const colonnesAffichage = plateauRetourne
    ? [7, 6, 5, 4, 3, 2, 1, 0]
    : [0, 1, 2, 3, 4, 5, 6, 7];

  let html = '';
  lignesAffichage.forEach(ligne => {
    colonnesAffichage.forEach(colonne => {
      const estClaire = (ligne + colonne) % 2 === 0;
      html += `<button class="case-plateau ${estClaire ? 'case-plateau--claire' : 'case-plateau--sombre'}"
                       data-ligne="${ligne}" data-colonne="${colonne}"
                       onclick="gererClicCase(${ligne}, ${colonne})"
                       aria-label="${indicesVersNotation(ligne, colonne)}"></button>`;
    });
  });

  conteneur.innerHTML = html;

  /* Coordonnées affichées en bordure */
  genererCoordonnees();
}

/**
 * Génère les labels de colonnes (a-h) et de rangées (1-8) autour du plateau.
 */
function genererCoordonnees() {
  const conteneurColonnes = document.getElementById('coordonneesColonnes');
  const conteneurLignes   = document.getElementById('coordonneesLignes');
  if (!conteneurColonnes || !conteneurLignes) return;

  const colonnesAffichage = plateauRetourne
    ? [7, 6, 5, 4, 3, 2, 1, 0]
    : [0, 1, 2, 3, 4, 5, 6, 7];
  const lignesAffichage = plateauRetourne
    ? [0, 1, 2, 3, 4, 5, 6, 7]
    : [7, 6, 5, 4, 3, 2, 1, 0];

  conteneurColonnes.innerHTML = colonnesAffichage.map(c => `<span>${COLONNES[c]}</span>`).join('');
  conteneurLignes.innerHTML   = lignesAffichage.map(l => `<span>${l + 1}</span>`).join('');
}


/* ───────────────────────────────────────────────────
   Rafraîchissement de l'affichage (pièces, surbrillances)
   ─────────────────────────────────────────────────── */

/**
 * Met à jour le contenu visuel de toutes les cases selon l'état actuel de la partie.
 */
function rafraichirAffichagePlateau() {
  if (!partieActuelle) return;

  document.querySelectorAll('.case-plateau').forEach(caseEl => {
    const ligne   = parseInt(caseEl.dataset.ligne, 10);
    const colonne = parseInt(caseEl.dataset.colonne, 10);
    const piece   = partieActuelle.plateau[ligne][colonne];

    caseEl.innerHTML = piece
      ? `<span class="piece-plateau">${SYMBOLES_PIECES_PLATEAU[piece.type][piece.couleur]}</span>`
      : '';

    /* Classes d'état */
    caseEl.classList.remove(
      'case-plateau--selectionnee',
      'case-plateau--coup-possible',
      'case-plateau--capture-possible',
      'case-plateau--roi-en-echec',
      'case-plateau--dernier-coup'
    );

    if (caseSelectionnee && caseSelectionnee.ligne === ligne && caseSelectionnee.colonne === colonne) {
      caseEl.classList.add('case-plateau--selectionnee');
    }

    const coupCorrespondant = coupsPossibles.find(c => c.ligne === ligne && c.colonne === colonne);
    if (coupCorrespondant) {
      caseEl.classList.add(piece ? 'case-plateau--capture-possible' : 'case-plateau--coup-possible');
    }

    /* Mise en évidence du Roi en échec */
    if (piece && piece.type === TYPE_ROI) {
      const estEnEchec = partieActuelle.roiEnEchec[piece.couleur === COULEUR_BLANC ? 'blanc' : 'noir'];
      if (estEnEchec) caseEl.classList.add('case-plateau--roi-en-echec');
    }

    /* Mise en évidence du dernier coup joué */
    const dernierCoup = partieActuelle.historique[partieActuelle.historique.length - 1];
    if (dernierCoup) {
      const { ligne: ligneDepart, colonne: colonneDepart } = notationVersIndices(dernierCoup.depart);
      const { ligne: ligneArrivee, colonne: colonneArrivee } = notationVersIndices(dernierCoup.arrivee);
      if ((ligne === ligneDepart && colonne === colonneDepart) || (ligne === ligneArrivee && colonne === colonneArrivee)) {
        caseEl.classList.add('case-plateau--dernier-coup');
      }
    }
  });
}


/* ───────────────────────────────────────────────────
   Gestion des clics et des coups
   ─────────────────────────────────────────────────── */

/**
 * Gère le clic sur une case du plateau : sélection, déplacement, ou désélection.
 * @param {number} ligne
 * @param {number} colonne
 */
function gererClicCase(ligne, colonne) {
  if (!partieActuelle || partieActuelle.statut !== 'en-cours' || coupEnAttentePromotion) return;

  const pieceCliquee = partieActuelle.plateau[ligne][colonne];

  /* Cas 1 : une pièce est déjà sélectionnée et on clique sur un coup possible */
  if (caseSelectionnee) {
    const coupChoisi = coupsPossibles.find(c => c.ligne === ligne && c.colonne === colonne);
    if (coupChoisi) {
      executerCoupChoisi(caseSelectionnee.ligne, caseSelectionnee.colonne, coupChoisi);
      return;
    }
  }

  /* Cas 2 : on clique sur une pièce de la couleur du joueur actif → sélection */
  if (pieceCliquee && pieceCliquee.couleur === partieActuelle.tourActuel) {
    caseSelectionnee = { ligne, colonne };
    coupsPossibles    = genererCoupsLegaux(partieActuelle, ligne, colonne);
    rafraichirAffichagePlateau();
    return;
  }

  /* Cas 3 : clic dans le vide → désélection */
  caseSelectionnee = null;
  coupsPossibles    = [];
  rafraichirAffichagePlateau();
}

/**
 * Exécute un coup choisi : déclenche la boîte de promotion si nécessaire,
 * sinon joue le coup directement.
 * @param {number} ligneDepart
 * @param {number} colonneDepart
 * @param {Object} coup
 */
function executerCoupChoisi(ligneDepart, colonneDepart, coup) {
  if (coup.special === 'promotion') {
    coupEnAttentePromotion = { ligneDepart, colonneDepart, coup };
    afficherBoitePromotion(partieActuelle.plateau[ligneDepart][colonneDepart].couleur);
    return;
  }

  finaliserCoup(ligneDepart, colonneDepart, coup);
}

/**
 * Joue réellement le coup dans le moteur et met à jour tout l'affichage.
 * @param {number} ligneDepart
 * @param {number} colonneDepart
 * @param {Object} coup
 * @param {string} typePromotion - Optionnel, pour les coups de promotion
 */
function finaliserCoup(ligneDepart, colonneDepart, coup, typePromotion) {
  jouerCoup(partieActuelle, ligneDepart, colonneDepart, coup, typePromotion);

  caseSelectionnee = null;
  coupsPossibles    = [];

  rafraichirAffichagePlateau();
  rafraichirHistorique();
  rafraichirIndicateurTour();

  if (partieActuelle.statut === 'mat' || partieActuelle.statut === 'pat' || partieActuelle.statut === 'nulle') {
    afficherBandeauFinPartie();
  }
}


/* ───────────────────────────────────────────────────
   Boîte de choix de promotion
   ─────────────────────────────────────────────────── */

/**
 * Affiche la boîte de sélection de la pièce de promotion.
 * @param {string} couleur - Couleur du pion promu (pour afficher les bons symboles)
 */
function afficherBoitePromotion(couleur) {
  const boite = document.getElementById('boitePromotion');
  if (!boite) return;

  const choix = [TYPE_REINE, TYPE_TOUR, TYPE_FOU, TYPE_CAVALIER];
  boite.innerHTML = choix.map(type => `
    <button class="choix-promotion" onclick="choisirPromotion('${type}')">
      <span class="choix-promotion__symbole">${SYMBOLES_PIECES_PLATEAU[type][couleur]}</span>
      <span class="choix-promotion__nom">${NOMS_PIECES_FR[type]}</span>
    </button>
  `).join('');

  boite.classList.add('boite-promotion--visible');
}

/**
 * Appelé quand le joueur choisit la pièce de promotion.
 * @param {string} typePiece
 */
function choisirPromotion(typePiece) {
  if (!coupEnAttentePromotion) return;

  const { ligneDepart, colonneDepart, coup } = coupEnAttentePromotion;
  document.getElementById('boitePromotion').classList.remove('boite-promotion--visible');
  coupEnAttentePromotion = null;

  finaliserCoup(ligneDepart, colonneDepart, coup, typePiece);
}


/* ───────────────────────────────────────────────────
   Indicateur de tour et bandeau de fin de partie
   ─────────────────────────────────────────────────── */

/**
 * Met à jour le texte indiquant à qui c'est le tour, ou l'état d'échec.
 */
function rafraichirIndicateurTour() {
  const indicateur = document.getElementById('indicateurTour');
  if (!indicateur || !partieActuelle) return;

  const nomCouleur = partieActuelle.tourActuel === COULEUR_BLANC ? 'Blancs' : 'Noirs';
  const enEchec = partieActuelle.roiEnEchec[partieActuelle.tourActuel === COULEUR_BLANC ? 'blanc' : 'noir'];

  indicateur.innerHTML = enEchec
    ? `<span class="indicateur-tour__pastille indicateur-tour__pastille--${partieActuelle.tourActuel}"></span> Aux ${nomCouleur} de jouer — <strong class="texte-echec">Échec !</strong>`
    : `<span class="indicateur-tour__pastille indicateur-tour__pastille--${partieActuelle.tourActuel}"></span> Aux ${nomCouleur} de jouer`;
}

/**
 * Affiche le bandeau de fin de partie (mat, pat, ou les différentes nulles).
 */
function afficherBandeauFinPartie() {
  const bandeau = document.getElementById('bandeauFinPartie');
  if (!bandeau) return;

  const dernierCoup = partieActuelle.historique[partieActuelle.historique.length - 1];

  let texte = '';
  if (partieActuelle.statut === 'mat') {
    const nomVainqueur = partieActuelle.vainqueur === COULEUR_BLANC ? 'Blancs' : 'Noirs';
    texte = `🏆 Échec et mat ! Les ${nomVainqueur} gagnent.`;
  } else if (partieActuelle.statut === 'pat') {
    texte = `🤝 Pat — Partie nulle.`;
  } else if (partieActuelle.statut === 'nulle') {
    if (dernierCoup?.nulleRepetition) {
      texte = `🔁 Triple répétition — Partie nulle.`;
    } else if (dernierCoup?.nulleMaterielInsuffisant) {
      texte = `♟️ Matériel insuffisant — Partie nulle.`;
    } else if (dernierCoup?.nulleCinquanteCoups) {
      texte = `➗ Règle des 50 coups — Partie nulle.`;
    } else {
      texte = `➗ Partie nulle.`;
    }
  }

  bandeau.textContent = texte;
  bandeau.classList.add('bandeau-fin-partie--visible');
}

/**
 * Cache le bandeau de fin de partie (au début d'une nouvelle partie).
 */
function masquerBandeauFinPartie() {
  const bandeau = document.getElementById('bandeauFinPartie');
  if (bandeau) bandeau.classList.remove('bandeau-fin-partie--visible');
}


/* ───────────────────────────────────────────────────
   Historique des coups
   ─────────────────────────────────────────────────── */

/**
 * Régénère la liste d'historique des coups joués, au format notation simplifiée.
 */
function rafraichirHistorique() {
  const liste = document.getElementById('listeHistorique');
  if (!liste || !partieActuelle) return;

  if (partieActuelle.historique.length === 0) {
    liste.innerHTML = `<p class="historique__vide">Aucun coup joué pour l'instant.</p>`;
    return;
  }

  let html = '';
  for (let i = 0; i < partieActuelle.historique.length; i += 2) {
    const coupBlanc = partieActuelle.historique[i];
    const coupNoir  = partieActuelle.historique[i + 1];
    const numero    = i / 2 + 1;

    html += `
      <div class="ligne-historique">
        <span class="ligne-historique__numero">${numero}.</span>
        <span class="ligne-historique__coup">${formaterCoup(coupBlanc)}</span>
        ${coupNoir ? `<span class="ligne-historique__coup">${formaterCoup(coupNoir)}</span>` : ''}
      </div>
    `;
  }

  liste.innerHTML = html;
  liste.scrollTop = liste.scrollHeight;
}

/**
 * Formate un coup de l'historique en texte lisible.
 * @param {Object} coup
 * @returns {string}
 */
function formaterCoup(coup) {
  if (coup.special === 'petit-roque') return 'O-O';
  if (coup.special === 'grand-roque') return 'O-O-O';

  const lettrePiece = coup.piece === TYPE_PION ? '' : NOMS_PIECES_FR[coup.piece][0];
  const capture = coup.capture ? 'x' : '';
  let suffixe = '';
  if (coup.echecEtMat) suffixe = '#';
  else if (coup.echec) suffixe = '+';

  return `${lettrePiece}${capture}${coup.arrivee}${suffixe}`;
}


/* ───────────────────────────────────────────────────
   Initialisation au chargement de la page
   ─────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  nouvellePartie();
});