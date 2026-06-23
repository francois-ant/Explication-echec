/* ═══════════════════════════════════════════════════
   ÉCHECS — Logique de la page des règles (page-regles.js)
   Responsabilités :
     - Générer les onglets de catégories
     - Générer les cartes de règles en accordéon
     - Initialiser les démos interactives au bon endroit
   ═══════════════════════════════════════════════════ */


/* ───────────────────────────────────────────────────
   État de la page
   ─────────────────────────────────────────────────── */

let categorieActive = 'bases';


/* ───────────────────────────────────────────────────
   Génération des onglets
   ─────────────────────────────────────────────────── */

/**
 * Construit et injecte les boutons d'onglets de catégories.
 */
function genererOnglets() {
  const conteneur = document.getElementById('ongletsCategories');
  if (!conteneur) return;

  let html = '';
  ORDRE_CATEGORIES.forEach(idCategorie => {
    const categorie = CATEGORIES_REGLES[idCategorie];
    const estActif  = idCategorie === categorieActive;
    html += `
      <button class="onglet-categorie ${estActif ? 'onglet-categorie--actif' : ''}"
              data-categorie="${idCategorie}"
              onclick="changerCategorie('${idCategorie}')">
        <span class="onglet-categorie__icone">${categorie.icone}</span>
        <span class="onglet-categorie__titre">${categorie.titre}</span>
      </button>
    `;
  });

  conteneur.innerHTML = html;
}

/**
 * Change la catégorie active et régénère le contenu affiché.
 * @param {string} idCategorie - Identifiant de la catégorie
 */
function changerCategorie(idCategorie) {
  if (!CATEGORIES_REGLES[idCategorie]) return;

  categorieActive = idCategorie;

  /* Mettre à jour l'état visuel des onglets */
  document.querySelectorAll('.onglet-categorie').forEach(onglet => {
    onglet.classList.toggle('onglet-categorie--actif', onglet.dataset.categorie === idCategorie);
  });

  genererContenuCategorie();
}


/* ───────────────────────────────────────────────────
   Génération du contenu (accordéon de règles)
   ─────────────────────────────────────────────────── */

/**
 * Génère et injecte les cartes de règles de la catégorie active.
 */
function genererContenuCategorie() {
  const conteneur = document.getElementById('contenuRegles');
  if (!conteneur) return;

  const categorie = CATEGORIES_REGLES[categorieActive];
  let html = '';

  /* Bandeau d'avertissement, uniquement si la catégorie en définit un
     (ex: les principes d'ouverture ne sont pas des règles absolues) */
  if (categorie.avertissement) {
    html += `
      <div class="avertissement-categorie">
        <span class="avertissement-categorie__icone">⚠️</span>
        <p class="avertissement-categorie__texte">${categorie.avertissement}</p>
      </div>
    `;
  }

  html += '<div class="accordeon-regles">';

  categorie.regles.forEach((regle, index) => {
    const aUneDemo = Boolean(regle.demo);

    html += `
      <div class="carte-regle" id="carte-${regle.id}">
        <button class="carte-regle__entete" onclick="basculerCarteRegle('${regle.id}')" aria-expanded="false">
          <span class="carte-regle__icone">${regle.icone}</span>
          <div class="carte-regle__entete-texte">
            <h3 class="carte-regle__titre">${regle.titre}</h3>
            <p class="carte-regle__resume">${regle.resume}</p>
          </div>
          <span class="carte-regle__chevron">▾</span>
        </button>
        <div class="carte-regle__contenu" id="contenu-${regle.id}">
          <div class="carte-regle__contenu-interieur">
            <p class="carte-regle__texte">${regle.texte}</p>
            ${aUneDemo ? `<div id="demo-conteneur-${regle.id}" class="carte-regle__demo"></div>` : ''}
          </div>
        </div>
      </div>
    `;
  });

  html += '</div>';
  conteneur.innerHTML = html;

  /* Ouvrir automatiquement la première règle de la catégorie */
  if (categorie.regles.length > 0) {
    basculerCarteRegle(categorie.regles[0].id);
  }
}

/**
 * Ouvre ou ferme une carte de règle (accordéon).
 * Initialise la démo interactive associée la première fois qu'elle s'ouvre.
 * @param {string} idRegle - Identifiant de la règle
 */
function basculerCarteRegle(idRegle) {
  const carte         = document.getElementById(`carte-${idRegle}`);
  const contenu       = document.getElementById(`contenu-${idRegle}`);
  const bouton        = carte?.querySelector('.carte-regle__entete');
  if (!carte || !contenu || !bouton) return;

  const estOuverte = carte.classList.contains('carte-regle--ouverte');

  if (estOuverte) {
    carte.classList.remove('carte-regle--ouverte');
    contenu.style.maxHeight = null;
    bouton.setAttribute('aria-expanded', 'false');
    return;
  }

  /* Fermer les autres cartes ouvertes (accordéon strict) */
  document.querySelectorAll('.carte-regle--ouverte').forEach(autreCarte => {
    if (autreCarte.id !== `carte-${idRegle}`) {
      autreCarte.classList.remove('carte-regle--ouverte');
      const autreContenu = autreCarte.querySelector('.carte-regle__contenu');
      if (autreContenu) autreContenu.style.maxHeight = null;
    }
  });

  /* Ouvrir la carte demandée */
  carte.classList.add('carte-regle--ouverte');
  bouton.setAttribute('aria-expanded', 'true');

  /* Initialiser la démo interactive si elle existe et n'a pas encore été montée */
  const idConteneurDemo = `demo-conteneur-${idRegle}`;
  const conteneurDemo   = document.getElementById(idConteneurDemo);
  if (conteneurDemo && conteneurDemo.dataset.initialise !== 'true' && DEMOS[idRegle]) {
    initialiserDemo(idRegle, idConteneurDemo);
    conteneurDemo.dataset.initialise = 'true';
  }

  /* Ajuster la hauteur après un court délai pour laisser le DOM se mettre à jour */
  requestAnimationFrame(() => {
    contenu.style.maxHeight = contenu.scrollHeight + 'px';
  });
}


/* ───────────────────────────────────────────────────
   Initialisation au chargement de la page
   ─────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  genererOnglets();
  genererContenuCategorie();
});