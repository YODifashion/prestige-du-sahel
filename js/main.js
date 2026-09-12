/* Prestige du Sahel — logique commune (panier, formatage, rendu catalogue) */

const CLE_PANIER = "prestige-du-sahel-panier";
const NUMERO_WHATSAPP = "221771839230";

let PRODUITS = [];

async function chargerProduits() {
  try {
    const chemin = window.location.pathname.includes("/admin")
      ? "/content/produits.json"
      : "content/produits.json";
    const reponse = await fetch(chemin);
    const donnees = await reponse.json();
    return donnees.produits.map((p) => ({
      ...p,
      notes: {
        tete: p.notes_tete || [],
        coeur: p.notes_coeur || [],
        fond: p.notes_fond || [],
      },
    }));
  } catch (erreur) {
    console.error("Impossible de charger le catalogue :", erreur);
    return [];
  }
}

function formaterPrix(montant) {
  return montant.toLocaleString("fr-FR").replace(/,/g, " ") + " FCFA";
}

function lirePanier() {
  try {
    return JSON.parse(localStorage.getItem(CLE_PANIER)) || [];
  } catch (e) {
    return [];
  }
}

function ecrirePanier(panier) {
  localStorage.setItem(CLE_PANIER, JSON.stringify(panier));
  majCompteurPanier();
}

function ajouterAuPanier(id, quantite = 1) {
  const panier = lirePanier();
  const ligne = panier.find((l) => l.id === id);
  if (ligne) {
    ligne.quantite += quantite;
  } else {
    panier.push({ id, quantite });
  }
  ecrirePanier(panier);
}

function modifierQuantite(id, quantite) {
  let panier = lirePanier();
  if (quantite <= 0) {
    panier = panier.filter((l) => l.id !== id);
  } else {
    const ligne = panier.find((l) => l.id === id);
    if (ligne) ligne.quantite = quantite;
  }
  ecrirePanier(panier);
  if (document.getElementById("contenu-panier")) afficherPanier();
}

function retirerDuPanier(id) {
  modifierQuantite(id, 0);
}

function totalPanier() {
  const panier = lirePanier();
  return panier.reduce((somme, ligne) => {
    const produit = PRODUITS.find((p) => p.id === ligne.id);
    return produit ? somme + produit.prix * ligne.quantite : somme;
  }, 0);
}

function majCompteurPanier() {
  const compteur = lirePanier().reduce((n, l) => n + l.quantite, 0);
  document.querySelectorAll("[data-compteur-panier]").forEach((el) => {
    el.textContent = compteur;
    el.style.display = compteur > 0 ? "inline-flex" : "none";
  });
}

/* ---------- Rendu du catalogue (boutique.html + accueil) ---------- */

function carteProduit(p) {
  const styleImage = p.image
    ? ` style="background-image:url('${p.image}');background-size:cover;background-position:center;"`
    : "";
  return `
    <article class="carte-produit">
      <a href="produit.html?id=${p.id}" class="carte-produit__visuel carte-produit__visuel--${p.id % 6}"${styleImage}>
        <span class="carte-produit__famille">${p.famille}</span>
      </a>
      <div class="carte-produit__corps">
        <h3><a href="produit.html?id=${p.id}">${p.nom}</a></h3>
        <p class="carte-produit__accroche">${p.accroche}</p>
        <div class="carte-produit__pied">
          <span class="carte-produit__prix">${formaterPrix(p.prix)}</span>
          <button class="bouton bouton--discret" data-ajout="${p.id}">Ajouter</button>
        </div>
      </div>
    </article>`;
}

function afficherCatalogue(conteneurId, liste = PRODUITS) {
  const conteneur = document.getElementById(conteneurId);
  if (!conteneur) return;
  conteneur.innerHTML = liste.map(carteProduit).join("");
  conteneur.querySelectorAll("[data-ajout]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      ajouterAuPanier(Number(btn.dataset.ajout));
      btn.textContent = "Ajouté ✓";
      setTimeout(() => (btn.textContent = "Ajouter"), 1200);
    });
  });
}

/* ---------- Page produit ---------- */

function afficherProduit() {
  const conteneur = document.getElementById("fiche-produit");
  if (!conteneur) return;
  const id = Number(new URLSearchParams(window.location.search).get("id"));
  const p = PRODUITS.find((prod) => prod.id === id) || PRODUITS[0];

  document.title = `${p.nom} — Prestige du Sahel`;

  const styleImage = p.image
    ? ` style="background-image:url('${p.image}');background-size:cover;background-position:center;"`
    : "";

  conteneur.innerHTML = `
    <div class="fiche-produit__visuel fiche-produit__visuel--${p.id % 6}"${styleImage}>
      <span class="fiche-produit__famille">${p.famille}</span>
    </div>
    <div class="fiche-produit__contenu">
      <p class="fil-ariane"><a href="boutique.html">Boutique</a> / ${p.nom}</p>
      <h1>${p.nom}</h1>
      <p class="fiche-produit__accroche">${p.accroche}</p>
      <p class="fiche-produit__prix">${formaterPrix(p.prix)} <span>· ${p.volume}</span></p>
      <p class="fiche-produit__description">${p.description}</p>

      <div class="pyramide">
        <div><h4>Tête</h4><p>${p.notes.tete.join(", ")}</p></div>
        <div><h4>Cœur</h4><p>${p.notes.coeur.join(", ")}</p></div>
        <div><h4>Fond</h4><p>${p.notes.fond.join(", ")}</p></div>
      </div>

      <div class="fiche-produit__actions">
        <label for="quantite">Quantité</label>
        <input type="number" id="quantite" value="1" min="1" max="10">
        <button class="bouton" id="bouton-ajout">Ajouter au panier</button>
      </div>
    </div>`;

  document.getElementById("bouton-ajout").addEventListener("click", () => {
    const qte = Number(document.getElementById("quantite").value) || 1;
    ajouterAuPanier(p.id, qte);
    const btn = document.getElementById("bouton-ajout");
    btn.textContent = "Ajouté au panier ✓";
    setTimeout(() => (btn.textContent = "Ajouter au panier"), 1400);
  });

  const suggestions = PRODUITS.filter((prod) => prod.id !== p.id).slice(0, 3);
  const conteneurSuggestions = document.getElementById("suggestions");
  if (conteneurSuggestions) {
    conteneurSuggestions.innerHTML = suggestions.map(carteProduit).join("");
    conteneurSuggestions.querySelectorAll("[data-ajout]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        ajouterAuPanier(Number(btn.dataset.ajout));
        btn.textContent = "Ajouté ✓";
        setTimeout(() => (btn.textContent = "Ajouter"), 1200);
      });
    });
  }
}

/* ---------- Page panier ---------- */

function ligneCatalogue(ligne) {
  const p = PRODUITS.find((prod) => prod.id === ligne.id);
  if (!p) return "";
  const styleImage = p.image
    ? ` style="background-image:url('${p.image}');background-size:cover;background-position:center;"`
    : "";
  return `
    <tr>
      <td class="panier__produit">
        <div class="panier__vignette panier__vignette--${p.id % 6}"${styleImage}></div>
        <div>
          <a href="produit.html?id=${p.id}">${p.nom}</a>
          <p class="panier__famille">${p.famille}</p>
        </div>
      </td>
      <td>${formaterPrix(p.prix)}</td>
      <td>
        <input type="number" min="1" max="10" value="${ligne.quantite}"
          class="panier__quantite" data-id="${p.id}">
      </td>
      <td>${formaterPrix(p.prix * ligne.quantite)}</td>
      <td><button class="lien-discret" data-retirer="${p.id}">Retirer</button></td>
    </tr>`;
}

function afficherPanier() {
  const conteneur = document.getElementById("contenu-panier");
  if (!conteneur) return;
  const panier = lirePanier();

  if (panier.length === 0) {
    conteneur.innerHTML = `
      <div class="panier-vide">
        <p>Le panier est vide pour le moment.</p>
        <a href="boutique.html" class="bouton">Découvrir la boutique</a>
      </div>`;
    return;
  }

  conteneur.innerHTML = `
    <table class="panier">
      <thead>
        <tr><th>Parfum</th><th>Prix</th><th>Quantité</th><th>Sous-total</th><th></th></tr>
      </thead>
      <tbody>${panier.map(ligneCatalogue).join("")}</tbody>
    </table>
    <div class="panier__total">
      <span>Total</span>
      <strong>${formaterPrix(totalPanier())}</strong>
    </div>
    <div class="panier__actions">
      <a href="boutique.html" class="lien-discret">← Continuer les achats</a>
      <a id="commander-whatsapp" class="bouton" target="_blank" rel="noopener">Commander sur WhatsApp</a>
    </div>`;

  conteneur.querySelectorAll(".panier__quantite").forEach((input) => {
    input.addEventListener("change", () => {
      modifierQuantite(Number(input.dataset.id), Number(input.value) || 1);
    });
  });
  conteneur.querySelectorAll("[data-retirer]").forEach((btn) => {
    btn.addEventListener("click", () => retirerDuPanier(Number(btn.dataset.retirer)));
  });

  const lignesTexte = panier
    .map((l) => {
      const p = PRODUITS.find((prod) => prod.id === l.id);
      return p ? `• ${p.nom} x${l.quantite} — ${formaterPrix(p.prix * l.quantite)}` : "";
    })
    .join("%0A");
  const message = `Bonjour Prestige du Sahel, je souhaite commander :%0A${lignesTexte}%0A%0ATotal : ${formaterPrix(totalPanier())}`;
  document.getElementById("commander-whatsapp").href =
    `https://wa.me/${NUMERO_WHATSAPP}?text=${message}`;
}

document.addEventListener("DOMContentLoaded", async () => {
  PRODUITS = await chargerProduits();

  majCompteurPanier();
  afficherCatalogue("grille-catalogue");
  afficherCatalogue("grille-accueil", PRODUITS.slice(0, 3));
  afficherProduit();
  afficherPanier();

  const annee = document.getElementById("annee");
  if (annee) annee.textContent = new Date().getFullYear();

  const bascule = document.getElementById("bascule-menu");
  const menu = document.getElementById("menu-principal");
  if (bascule && menu) {
    bascule.addEventListener("click", () => menu.classList.toggle("est-ouvert"));
  }
});
