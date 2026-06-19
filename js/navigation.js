/* ═══════════════════════════════════════════════════
   ÉCHECS — Gestion de la navigation (navigation.js)
   Responsabilités :
     - Ouvrir / fermer le menu mobile (hamburger)
     - Fermer le menu au clic sur un lien
     - Fermer le menu au redimensionnement de la fenêtre
   ═══════════════════════════════════════════════════ */


/* ───────────────────────────────────────────────────
   Constantes
   ─────────────────────────────────────────────────── */

const LARGEUR_MOBILE = 600;


/* ───────────────────────────────────────────────────
   Références aux éléments du DOM
   ─────────────────────────────────────────────────── */

const boutonMenu  = document.getElementById('boutonMenu');
const menuMobile  = document.getElementById('menuMobile');
const liensMenu   = document.querySelectorAll('.menu-mobile__lien');


/* ───────────────────────────────────────────────────
   Fonctions
   ─────────────────────────────────────────────────── */

/**
 * Ouvre le menu mobile.
 */
function ouvrirMenuMobile() {
  menuMobile.classList.add('menu-mobile--visible');
  boutonMenu.classList.add('bouton-menu--ouvert');
  boutonMenu.setAttribute('aria-expanded', 'true');
  menuMobile.setAttribute('aria-hidden', 'false');
}

/**
 * Ferme le menu mobile.
 */
function fermerMenuMobile() {
  menuMobile.classList.remove('menu-mobile--visible');
  boutonMenu.classList.remove('bouton-menu--ouvert');
  boutonMenu.setAttribute('aria-expanded', 'false');
  menuMobile.setAttribute('aria-hidden', 'true');
}

/**
 * Bascule l'état du menu mobile (ouvert ↔ fermé).
 */
function basculerMenuMobile() {
  const estOuvert = menuMobile.classList.contains('menu-mobile--visible');
  if (estOuvert) {
    fermerMenuMobile();
  } else {
    ouvrirMenuMobile();
  }
}

/**
 * Ferme le menu si la fenêtre est redimensionnée au-delà du seuil mobile.
 */
function gererRedimensionnement() {
  if (window.innerWidth > LARGEUR_MOBILE) {
    fermerMenuMobile();
  }
}


/* ───────────────────────────────────────────────────
   Écouteurs d'événements
   ─────────────────────────────────────────────────── */

boutonMenu.addEventListener('click', basculerMenuMobile);

liensMenu.forEach(lien => {
  lien.addEventListener('click', fermerMenuMobile);
});

window.addEventListener('resize', gererRedimensionnement);

document.addEventListener('keydown', (evenement) => {
  if (evenement.key === 'Escape') {
    fermerMenuMobile();
  }
});
