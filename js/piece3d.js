/* ═══════════════════════════════════════════════════
   ÉCHECS — Visualisation 3D des pièces (piece3d.js)
   Utilise de vrais modèles OBJ via THREE.OBJLoader
   ═══════════════════════════════════════════════════ */


/* ───────────────────────────────────────────────────
   Variables globales de la scène 3D
   ─────────────────────────────────────────────────── */

let scene, camera, rendu, pieceMaillage, lumiereAmbiante, lumierePrincipale;
let rotationAutomatique  = true;
let estEnTrainDeDragguer = false;
let angleDebutDrag       = { x: 0, y: 0 };
let rotationDebutDrag    = { x: 0, y: 0 };
let nomPieceSelectionnee = 'roi';
let indexPieceActuelle   = 0;
let chargeurOBJ          = null;

/* Cache des modèles déjà chargés pour éviter les rechargements réseau */
const cacheModeles = {};


/* ───────────────────────────────────────────────────
   Couleurs 3D par thème
   ─────────────────────────────────────────────────── */

const COULEURS_PAR_THEME = {
  chesscom: { piece: 0xf0d9b5, emissive: 0x2a1f0a, brillance: 90  },
  moderne:  { piece: 0xdde8f4, emissive: 0x0a1525, brillance: 110 },
  medieval: { piece: 0xe8d5a0, emissive: 0x1a0e00, brillance: 60  },
};

/**
 * Retourne les couleurs 3D correspondant au thème actif.
 */
function obtenirCouleurs3D() {
  const themeActuel = document.documentElement.getAttribute('data-theme') || 'chesscom';
  return COULEURS_PAR_THEME[themeActuel] || COULEURS_PAR_THEME['chesscom'];
}


/* ───────────────────────────────────────────────────
   Initialisation de la scène Three.js
   ─────────────────────────────────────────────────── */

function initialiserScene() {
  const conteneur = document.getElementById('conteneur3D');
  if (!conteneur) return;

  const largeur = conteneur.clientWidth  || 440;
  const hauteur = conteneur.clientHeight || 440;

  /* Scène */
  scene = new THREE.Scene();

  /* Caméra */
  camera = new THREE.PerspectiveCamera(42, largeur / hauteur, 0.1, 200);
  camera.position.set(0, 8, 22);
  camera.lookAt(0, 4, 0);

  /* Lumières */
  lumiereAmbiante = new THREE.AmbientLight(0xffffff, 0.55);
  scene.add(lumiereAmbiante);

  lumierePrincipale = new THREE.DirectionalLight(0xffffff, 1.1);
  lumierePrincipale.position.set(6, 14, 10);
  scene.add(lumierePrincipale);

  const lumiereSecondaire = new THREE.DirectionalLight(0xffffff, 0.35);
  lumiereSecondaire.position.set(-8, -4, -6);
  scene.add(lumiereSecondaire);

  const lumiereRimLight = new THREE.DirectionalLight(0xffffff, 0.2);
  lumiereRimLight.position.set(0, -6, -10);
  scene.add(lumiereRimLight);

  /* Rendu */
  rendu = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  rendu.setSize(largeur, hauteur);
  rendu.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  rendu.setClearColor(0x000000, 0);
  rendu.shadowMap.enabled = false;
  conteneur.appendChild(rendu.domElement);

  /* Chargeur OBJ */
  chargeurOBJ = new THREE.OBJLoader();

  /* Contrôles */
  ajouterControlesSouris(rendu.domElement);
  ajouterControlesTactiles(rendu.domElement);
  window.addEventListener('resize', gererRedimensionnement3D);

  /* Lancement de la boucle */
  animer();
}


/* ───────────────────────────────────────────────────
   Chargement et affichage d'un modèle OBJ
   ─────────────────────────────────────────────────── */

/**
 * Charge le fichier OBJ d'une pièce et l'affiche dans la scène.
 * Utilise un cache pour éviter de recharger les modèles déjà vus.
 * @param {string} nomPiece
 */
function chargerEtAfficherPiece(nomPiece) {
  /* Si déjà en cache, on l'utilise directement */
  if (cacheModeles[nomPiece]) {
    afficherModele(cacheModeles[nomPiece].clone(), nomPiece);
    return;
  }

  afficherChargement(true);

  const cheminFichier = `assets/modeles/${nomPiece}.obj`;

  chargeurOBJ.load(
    cheminFichier,

    /* Succès */
    (objet) => {
      cacheModeles[nomPiece] = objet;
      afficherModele(objet.clone(), nomPiece);
      afficherChargement(false);
    },

    /* Progression */
    (progression) => {
      if (progression.lengthComputable) {
        const pourcentage = Math.round((progression.loaded / progression.total) * 100);
        mettreAJourTexteChargement(pourcentage);
      }
    },

    /* Erreur */
    (erreur) => {
      console.error(`Erreur chargement ${nomPiece}.obj :`, erreur);
      afficherChargement(false);
      utiliserGeometrieFallback(nomPiece);
    }
  );
}

/**
 * Place le modèle chargé dans la scène avec les bons matériaux et la bonne échelle.
 * @param {THREE.Object3D} objet
 * @param {string} nomPiece
 */
function afficherModele(objet, nomPiece) {
  /* Supprimer la pièce précédente */
  if (pieceMaillage) {
    scene.remove(pieceMaillage);
    pieceMaillage.traverse(enfant => {
      if (enfant.geometry) enfant.geometry.dispose();
      if (enfant.material) enfant.material.dispose();
    });
  }

  const couleurs = obtenirCouleurs3D();

  const materiau = new THREE.MeshPhongMaterial({
    color:     couleurs.piece,
    emissive:  new THREE.Color(couleurs.emissive),
    shininess: couleurs.brillance,
    specular:  new THREE.Color(0x888888),
  });

  /* Appliquer le matériau à tous les maillages de l'objet */
  objet.traverse(enfant => {
    if (enfant.isMesh) {
      enfant.material = materiau;
    }
  });

  /* Centrer et normaliser l'échelle automatiquement */
  const boiteEnglobante = new THREE.Box3().setFromObject(objet);
  const centre          = new THREE.Vector3();
  const taille          = new THREE.Vector3();
  boiteEnglobante.getCenter(centre);
  boiteEnglobante.getSize(taille);

  /* Normaliser : la pièce fait toujours ~10 unités de haut */
  const hauteurCible = 10;
  const echelle      = hauteurCible / Math.max(taille.x, taille.y, taille.z);
  objet.scale.setScalar(echelle);

  /* Centrer horizontalement, poser sur Y=0 */
  objet.position.set(
    -centre.x * echelle,
    -boiteEnglobante.min.y * echelle,
    -centre.z * echelle
  );

  /* Réajuster la caméra selon la hauteur réelle */
  const hauteurReelle = taille.y * echelle;
  camera.position.set(0, hauteurReelle * 0.55, hauteurReelle * 2.2);
  camera.lookAt(0, hauteurReelle * 0.4, 0);

  pieceMaillage = objet;
  scene.add(pieceMaillage);
}

/**
 * Géométrie de secours si le fichier OBJ ne se charge pas (ex: ouverture locale sans serveur).
 * @param {string} nomPiece
 */
function utiliserGeometrieFallback(nomPiece) {
  if (pieceMaillage) scene.remove(pieceMaillage);

  const couleurs = obtenirCouleurs3D();
  const materiau = new THREE.MeshPhongMaterial({
    color:     couleurs.piece,
    shininess: couleurs.brillance,
  });

  let geometrie;
  switch (nomPiece) {
    case 'roi':      geometrie = new THREE.CylinderGeometry(0.5, 0.8, 3.0, 32); break;
    case 'reine':    geometrie = new THREE.CylinderGeometry(0.4, 0.8, 3.2, 32); break;
    case 'tour':     geometrie = new THREE.CylinderGeometry(0.7, 0.8, 2.5, 32); break;
    case 'fou':      geometrie = new THREE.CylinderGeometry(0.3, 0.7, 3.0, 32); break;
    case 'cavalier': geometrie = new THREE.CylinderGeometry(0.5, 0.7, 2.7, 32); break;
    case 'pion':     geometrie = new THREE.CylinderGeometry(0.4, 0.6, 2.0, 32); break;
    default:         geometrie = new THREE.SphereGeometry(1.0, 16, 16);
  }

  const maillage = new THREE.Mesh(geometrie, materiau);
  maillage.position.y = 1.5;
  const groupe = new THREE.Group();
  groupe.add(maillage);
  pieceMaillage = groupe;
  scene.add(pieceMaillage);
}


/* ───────────────────────────────────────────────────
   Indicateur de chargement
   ─────────────────────────────────────────────────── */

/**
 * Affiche ou masque l'indicateur de chargement dans le conteneur 3D.
 * @param {boolean} visible
 */
function afficherChargement(visible) {
  let indicateur = document.getElementById('indicateurChargement');

  if (visible && !indicateur) {
    indicateur = document.createElement('div');
    indicateur.id        = 'indicateurChargement';
    indicateur.className = 'indicateur-chargement';
    indicateur.innerHTML = `
      <div class="indicateur-chargement__spinner"></div>
      <p class="indicateur-chargement__texte" id="texteChargement">Chargement…</p>
    `;
    document.getElementById('conteneur3D').appendChild(indicateur);
  } else if (!visible && indicateur) {
    indicateur.remove();
  }
}

/**
 * Met à jour le pourcentage affiché pendant le chargement.
 * @param {number} pourcentage
 */
function mettreAJourTexteChargement(pourcentage) {
  const texte = document.getElementById('texteChargement');
  if (texte) texte.textContent = `Chargement… ${pourcentage}%`;
}


/* ───────────────────────────────────────────────────
   Sélection d'une pièce
   ─────────────────────────────────────────────────── */

/**
 * Sélectionne une pièce : met à jour l'UI, charge le modèle et les infos.
 * @param {string} nomPiece
 */
function selectionnerPiece(nomPiece) {
  nomPieceSelectionnee = nomPiece;
  indexPieceActuelle   = ORDRE_PIECES.indexOf(nomPiece);

  /* Boutons de sélection */
  document.querySelectorAll('.bouton-piece').forEach(bouton => {
    bouton.classList.toggle('bouton-piece--actif', bouton.dataset.piece === nomPiece);
  });

  /* Modèle 3D */
  chargerEtAfficherPiece(nomPiece);

  /* Textes et diagramme */
  mettreAJourInfosPiece(nomPiece);
  mettreAJourNavigationPieces();
}

/**
 * Met à jour les textes dans la colonne d'informations.
 * @param {string} nomPiece
 */
function mettreAJourInfosPiece(nomPiece) {
  const donnees = DONNEES_PIECES[nomPiece];
  if (!donnees) return;

  document.getElementById('symboleAffiche').textContent      = donnees.symbole;
  document.getElementById('nomAffiche').textContent          = donnees.nom;
  document.getElementById('descriptionAffichee').textContent = donnees.description;
  document.getElementById('mouvementAffiche').innerHTML      = donnees.mouvement;
  document.getElementById('anecdoteAffichee').innerHTML      = donnees.anecdote;

  const badgeValeur        = document.querySelector('.badge-valeur');
  badgeValeur.textContent  = donnees.valeur;
  badgeValeur.style.color  = donnees.couleurValeur;

  genererDiagramme(nomPiece);
}

/**
 * Met à jour les boutons précédent/suivant.
 */
function mettreAJourNavigationPieces() {
  const boutonPrecedent = document.getElementById('boutonPiecePrecedente');
  const boutonSuivant   = document.getElementById('boutonPieceSuivante');
  const position        = document.getElementById('positionPiece');

  boutonPrecedent.disabled = (indexPieceActuelle === 0);
  boutonSuivant.disabled   = (indexPieceActuelle === ORDRE_PIECES.length - 1);
  position.textContent     = `${indexPieceActuelle + 1} / ${ORDRE_PIECES.length}`;
}

function allerPiecePrecedente() {
  if (indexPieceActuelle > 0) selectionnerPiece(ORDRE_PIECES[indexPieceActuelle - 1]);
}

function allerPieceSuivante() {
  if (indexPieceActuelle < ORDRE_PIECES.length - 1) selectionnerPiece(ORDRE_PIECES[indexPieceActuelle + 1]);
}


/* ───────────────────────────────────────────────────
   Diagramme de déplacement
   ─────────────────────────────────────────────────── */

function genererDiagramme(nomPiece) {
  const conteneurDiagramme = document.getElementById('diagrammeDeplacement');
  const donnees = DONNEES_PIECES[nomPiece];
  if (!conteneurDiagramme || !donnees) return;

  let html = '<div class="grille-diagramme">';
  donnees.diagramme.forEach(ligne => {
    ligne.forEach(valeur => {
      let cls = 'case-diagramme';
      if (valeur === 1) cls += ' case-diagramme--piece';
      if (valeur === 2) cls += ' case-diagramme--accessible';
      if (valeur === 3) cls += ' case-diagramme--capture';
      html += `<div class="${cls}"></div>`;
    });
  });
  html += '</div>';
  html += `<p class="legende-diagramme">
    <span class="legende-item legende-item--piece">Pièce</span>
    <span class="legende-item legende-item--accessible">Mouvement</span>
    <span class="legende-item legende-item--capture">Capture uniquement</span>
  </p>`;

  conteneurDiagramme.innerHTML = html;
}


/* ───────────────────────────────────────────────────
   Contrôles souris et tactiles
   ─────────────────────────────────────────────────── */

function ajouterControlesSouris(element) {
  element.addEventListener('mousedown', (ev) => {
    estEnTrainDeDragguer = true;
    rotationAutomatique  = false;
    angleDebutDrag.x     = ev.clientX;
    angleDebutDrag.y     = ev.clientY;
    rotationDebutDrag.x  = pieceMaillage ? pieceMaillage.rotation.y : 0;
    rotationDebutDrag.y  = pieceMaillage ? pieceMaillage.rotation.x : 0;
    document.getElementById('boutonRotationAuto').classList.remove('bouton-controle--actif');
    document.getElementById('boutonRotationAuto').textContent = '⏸ Rotation auto';
  });

  element.addEventListener('mousemove', (ev) => {
    if (!estEnTrainDeDragguer || !pieceMaillage) return;
    pieceMaillage.rotation.y = rotationDebutDrag.x + (ev.clientX - angleDebutDrag.x) * 0.01;
    pieceMaillage.rotation.x = rotationDebutDrag.y + (ev.clientY - angleDebutDrag.y) * 0.01;
  });

  element.addEventListener('mouseup',    () => { estEnTrainDeDragguer = false; });
  element.addEventListener('mouseleave', () => { estEnTrainDeDragguer = false; });

  element.addEventListener('wheel', (ev) => {
    ev.preventDefault();
    camera.position.z = Math.max(5, Math.min(40, camera.position.z + ev.deltaY * 0.05));
  }, { passive: false });
}

function ajouterControlesTactiles(element) {
  element.addEventListener('touchstart', (ev) => {
    if (ev.touches.length !== 1) return;
    estEnTrainDeDragguer = true;
    rotationAutomatique  = false;
    angleDebutDrag.x     = ev.touches[0].clientX;
    angleDebutDrag.y     = ev.touches[0].clientY;
    rotationDebutDrag.x  = pieceMaillage ? pieceMaillage.rotation.y : 0;
    rotationDebutDrag.y  = pieceMaillage ? pieceMaillage.rotation.x : 0;
  }, { passive: true });

  element.addEventListener('touchmove', (ev) => {
    if (!estEnTrainDeDragguer || !pieceMaillage || ev.touches.length !== 1) return;
    pieceMaillage.rotation.y = rotationDebutDrag.x + (ev.touches[0].clientX - angleDebutDrag.x) * 0.012;
    pieceMaillage.rotation.x = rotationDebutDrag.y + (ev.touches[0].clientY - angleDebutDrag.y) * 0.012;
  }, { passive: true });

  element.addEventListener('touchend', () => { estEnTrainDeDragguer = false; });
}


/* ───────────────────────────────────────────────────
   Boutons de contrôle
   ─────────────────────────────────────────────────── */

function reinitialiserVue() {
  if (!pieceMaillage) return;
  pieceMaillage.rotation.set(0, 0, 0);
}

function basculerRotationAuto() {
  rotationAutomatique = !rotationAutomatique;
  const bouton = document.getElementById('boutonRotationAuto');
  bouton.classList.toggle('bouton-controle--actif', rotationAutomatique);
  bouton.textContent = rotationAutomatique ? '▶ Rotation auto' : '⏸ Rotation auto';
}


/* ───────────────────────────────────────────────────
   Boucle d'animation
   ─────────────────────────────────────────────────── */

function animer() {
  requestAnimationFrame(animer);
  if (pieceMaillage && rotationAutomatique && !estEnTrainDeDragguer) {
    pieceMaillage.rotation.y += 0.007;
  }
  rendu.render(scene, camera);
}


/* ───────────────────────────────────────────────────
   Redimensionnement
   ─────────────────────────────────────────────────── */

function gererRedimensionnement3D() {
  const conteneur = document.getElementById('conteneur3D');
  if (!conteneur || !rendu || !camera) return;
  const largeur = conteneur.clientWidth;
  const hauteur = conteneur.clientHeight;
  camera.aspect = largeur / hauteur;
  camera.updateProjectionMatrix();
  rendu.setSize(largeur, hauteur);
}


/* ───────────────────────────────────────────────────
   Changement de thème → recoloriser la pièce affichée
   ─────────────────────────────────────────────────── */

document.addEventListener('themeChange', () => {
  if (!pieceMaillage) return;
  const couleurs = obtenirCouleurs3D();
  const materiau = new THREE.MeshPhongMaterial({
    color:     couleurs.piece,
    emissive:  new THREE.Color(couleurs.emissive),
    shininess: couleurs.brillance,
    specular:  new THREE.Color(0x888888),
  });
  pieceMaillage.traverse(enfant => {
    if (enfant.isMesh) enfant.material = materiau;
  });
});


/* ───────────────────────────────────────────────────
   Initialisation
   ─────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  initialiserScene();
  selectionnerPiece('roi');
});
