/* ═══════════════════════════════════════════════════
   ÉCHECS — Composants partagés (composants.js)
   Responsabilités :
     - Injecter la navigation dans toutes les pages
     - Injecter le pied de page dans toutes les pages
     - Marquer le lien actif selon la page courante
   ═══════════════════════════════════════════════════ */


/* ───────────────────────────────────────────────────
   Constantes — structure HTML des composants
   ─────────────────────────────────────────────────── */

const HTML_NAVIGATION = `
<header class="entete">
  <nav class="navigation">
    <a href="index.html" class="navigation__logo">
      <span class="navigation__logo-icone">♟</span>
      <span class="navigation__logo-texte">Échecs</span>
    </a>
    <ul class="navigation__liens">
      <li><a href="index.html"          class="navigation__lien" data-page="accueil">Accueil</a></li>
      <li><a href="pieces.html"         class="navigation__lien" data-page="pieces">Les Pièces</a></li>
      <li><a href="regles.html"         class="navigation__lien" data-page="regles">Les Règles</a></li>
      <li><a href="entrainement.html"   class="navigation__lien" data-page="entrainement">S'entraîner</a></li>
    </ul>
    <div class="navigation__actions">
      <button class="bouton-theme" id="boutonTheme" aria-label="Changer de thème">
        <span class="bouton-theme__icone">🎨</span>
      </button>
      <button class="bouton-menu" id="boutonMenu" aria-label="Ouvrir le menu" aria-expanded="false">
        <span class="bouton-menu__barre"></span>
        <span class="bouton-menu__barre"></span>
        <span class="bouton-menu__barre"></span>
      </button>
    </div>
  </nav>

  <div class="menu-mobile" id="menuMobile" aria-hidden="true">
    <ul class="menu-mobile__liens">
      <li><a href="index.html"          class="menu-mobile__lien" data-page="accueil">Accueil</a></li>
      <li><a href="pieces.html"         class="menu-mobile__lien" data-page="pieces">Les Pièces</a></li>
      <li><a href="regles.html"         class="menu-mobile__lien" data-page="regles">Les Règles</a></li>
      <li><a href="entrainement.html"   class="menu-mobile__lien" data-page="entrainement">S'entraîner</a></li>
    </ul>
  </div>
</header>

<div class="panneau-themes" id="panneauThemes" aria-hidden="true">
  <p class="panneau-themes__titre">Choisissez votre ambiance</p>
  <div class="panneau-themes__choix">
    <button class="carte-theme" data-theme="chesscom" onclick="changerTheme('chesscom')">
      <span class="carte-theme__apercu carte-theme__apercu--chesscom">♚</span>
      <span class="carte-theme__nom">Chess.com</span>
      <span class="carte-theme__description">Vert & Crème</span>
    </button>
    <button class="carte-theme" data-theme="moderne" onclick="changerTheme('moderne')">
      <span class="carte-theme__apercu carte-theme__apercu--moderne">♛</span>
      <span class="carte-theme__nom">Moderne</span>
      <span class="carte-theme__description">Épuré & Clair</span>
    </button>
    <button class="carte-theme" data-theme="medieval" onclick="changerTheme('medieval')">
      <span class="carte-theme__apercu carte-theme__apercu--medieval">♜</span>
      <span class="carte-theme__nom">Médiéval</span>
      <span class="carte-theme__description">Pierre & Parchemin</span>
    </button>
  </div>
</div>
<div class="panneau-themes__fond" id="fondPanneau" onclick="fermerPanneauThemes()"></div>
`;

const HTML_PIED_DE_PAGE = `
<footer class="pied-de-page">
  <p class="pied-de-page__texte">Fait avec ♟ pour les passionnés d'échecs</p>
</footer>
`;


/* ───────────────────────────────────────────────────
   Fonctions d'injection
   ─────────────────────────────────────────────────── */

/**
 * Injecte la navigation dans l'élément #zone-navigation de la page.
 */
function injecterNavigation() {
  const zoneNavigation = document.getElementById('zone-navigation');
  if (!zoneNavigation) {
    console.warn('composants.js : élément #zone-navigation introuvable.');
    return;
  }
  zoneNavigation.innerHTML = HTML_NAVIGATION;
}

/**
 * Injecte le pied de page dans l'élément #zone-pied-de-page de la page.
 */
function injecterPiedDePage() {
  const zonePied = document.getElementById('zone-pied-de-page');
  if (!zonePied) {
    console.warn('composants.js : élément #zone-pied-de-page introuvable.');
    return;
  }
  zonePied.innerHTML = HTML_PIED_DE_PAGE;
}

/**
 * Marque le lien de navigation correspondant à la page active.
 * Lit l'attribut data-page-active sur le <body> pour identifier la page.
 */
function marquerLienActif() {
  const pageActive = document.body.dataset.pageActive;
  if (!pageActive) return;

  const tousLesLiens = document.querySelectorAll('[data-page]');
  tousLesLiens.forEach(lien => {
    if (lien.dataset.page === pageActive) {
      lien.classList.add('navigation__lien--actif', 'menu-mobile__lien--actif');
    }
  });
}


/* ───────────────────────────────────────────────────
   Initialisation — exécutée au chargement du DOM
   ─────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  injecterNavigation();
  injecterPiedDePage();
  marquerLienActif();
  initialiserGestionTheme();
  initialiserNavigation();
 });