/* ═══════════════════════════════════════════════════
   ÉCHECS — Gestion des thèmes (themes.js)
   Responsabilités :
     - Appliquer le thème au chargement
     - Changer le thème à la demande
     - Sauvegarder le choix dans le navigateur
     - Ouvrir / fermer le panneau de thèmes
   ═══════════════════════════════════════════════════ */


/* ───────────────────────────────────────────────────
   Constantes
   ─────────────────────────────────────────────────── */

const THEMES_DISPONIBLES = ['chesscom', 'moderne', 'medieval'];
const CLE_STOCKAGE_THEME  = 'echecs-theme';
const THEME_PAR_DEFAUT    = 'chesscom';


/* ───────────────────────────────────────────────────
   Références aux éléments du DOM
   ─────────────────────────────────────────────────── */

const elementHtml = document.documentElement;
let boutonTheme, panneauThemes, fondPanneau;


/* ───────────────────────────────────────────────────
   Fonctions principales
   ─────────────────────────────────────────────────── */

/**
 * Applique un thème au site et sauvegarde le choix.
 * @param {string} nomTheme - Le nom du thème à appliquer
 */
function changerTheme(nomTheme) {
  if (!THEMES_DISPONIBLES.includes(nomTheme)) {
    console.warn(`Thème inconnu : "${nomTheme}". Thèmes disponibles : ${THEMES_DISPONIBLES.join(', ')}`);
    return;
  }

  elementHtml.setAttribute('data-theme', nomTheme);
  sauvegarderTheme(nomTheme);
  mettreAJourCarteThemeActive(nomTheme);
  fermerPanneauThemes();
  /* Notifier les autres scripts d'un changement de thème */
  document.dispatchEvent(new CustomEvent('themeChange', { detail: { theme: nomTheme } }));
}

/**
 * Sauvegarde le thème choisi dans le stockage local du navigateur.
 * @param {string} nomTheme - Le nom du thème à sauvegarder
 */
function sauvegarderTheme(nomTheme) {
  try {
    localStorage.setItem(CLE_STOCKAGE_THEME, nomTheme);
  } catch (erreur) {
    console.warn('Impossible de sauvegarder le thème (localStorage indisponible).', erreur);
  }
}

/**
 * Récupère le thème sauvegardé, ou retourne le thème par défaut.
 * @returns {string} Le nom du thème à appliquer
 */
function recupererThemeSauvegarde() {
  try {
    const themeSauvegarde = localStorage.getItem(CLE_STOCKAGE_THEME);
    if (themeSauvegarde && THEMES_DISPONIBLES.includes(themeSauvegarde)) {
      return themeSauvegarde;
    }
  } catch (erreur) {
    console.warn('Impossible de lire le thème sauvegardé.', erreur);
  }
  return THEME_PAR_DEFAUT;
}

/**
 * Met en évidence la carte du thème actuellement actif dans le panneau.
 * @param {string} nomTheme - Le nom du thème actif
 */
function mettreAJourCarteThemeActive(nomTheme) {
  const toutesLesCartes = document.querySelectorAll('.carte-theme');
  toutesLesCartes.forEach(carte => {
    if (carte.dataset.theme === nomTheme) {
      carte.classList.add('carte-theme--active');
    } else {
      carte.classList.remove('carte-theme--active');
    }
  });
}


/* ───────────────────────────────────────────────────
   Panneau de sélection des thèmes
   ─────────────────────────────────────────────────── */

/**
 * Ouvre le panneau de sélection des thèmes.
 */
function ouvrirPanneauThemes() {
  panneauThemes.classList.add('panneau-themes--visible');
  fondPanneau.classList.add('panneau-themes__fond--visible');
  panneauThemes.setAttribute('aria-hidden', 'false');
  boutonTheme.setAttribute('aria-expanded', 'true');
}

/**
 * Ferme le panneau de sélection des thèmes.
 */
function fermerPanneauThemes() {
  panneauThemes.classList.remove('panneau-themes--visible');
  fondPanneau.classList.remove('panneau-themes__fond--visible');
  panneauThemes.setAttribute('aria-hidden', 'true');
  boutonTheme.setAttribute('aria-expanded', 'false');
}

/**
 * Bascule l'ouverture/fermeture du panneau des thèmes.
 */
function basculerPanneauThemes() {
  const estVisible = panneauThemes.classList.contains('panneau-themes--visible');
  if (estVisible) {
    fermerPanneauThemes();
  } else {
    ouvrirPanneauThemes();
  }
}


/* ───────────────────────────────────────────────────
   Initialisation différée des contrôles du panneau
   (appelée par composants.js APRÈS l'injection du HTML)
   ─────────────────────────────────────────────────── */

/**
 * Branche les écouteurs du bouton thème et du panneau.
 * Doit être appelée une fois que la navigation est injectée dans le DOM.
 */
function initialiserGestionTheme() {
  boutonTheme   = document.getElementById('boutonTheme');
  panneauThemes = document.getElementById('panneauThemes');
  fondPanneau   = document.getElementById('fondPanneau');

  if (!boutonTheme || !panneauThemes || !fondPanneau) {
    console.warn('themes.js : éléments du panneau de thème introuvables dans le DOM.');
    return;
  }

  boutonTheme.addEventListener('click', basculerPanneauThemes);

  document.addEventListener('keydown', (evenement) => {
    if (evenement.key === 'Escape') {
      fermerPanneauThemes();
    }
  });

  mettreAJourCarteThemeActive(elementHtml.getAttribute('data-theme'));
}


/* ───────────────────────────────────────────────────
   Application immédiate du thème au chargement
   (ne dépend pas du DOM injecté, peut s'exécuter tout de suite)
   ─────────────────────────────────────────────────── */

(function initialiserTheme() {
  const themeInitial = recupererThemeSauvegarde();
  elementHtml.setAttribute('data-theme', themeInitial);
    })();