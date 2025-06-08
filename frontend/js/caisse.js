// Récupération de l'ID utilisateur depuis le localStorage
let utilisateur = JSON.parse(localStorage.getItem("utilisateur"));

if (!utilisateur) {
  window.location.href = "/login.html";
}

async function chargerProduits() {
  const res = await fetch("/produits");
  const produits = await res.json();

  const select = document.getElementById("produit");
  produits.forEach(p => {
    const option = document.createElement("option");
    option.value = p.id;
    option.textContent = `${p.nom} - ${p.prix_vente} $`;
    select.appendChild(option);
  });
}

let lignes = [];

function ajouterLigne() {
  const produitId = parseInt(document.getElementById("produit").value);
  const quantite = parseInt(document.getElementById("quantite").value);

  if (isNaN(produitId) || isNaN(quantite) || quantite <= 0) {
    alert("Produit ou quantité invalide.");
    return;
  }

  const produitNom = document.querySelector(`#produit option[value="${produitId}"]`).textContent;
  const prixUnitaire = parseFloat(produitNom.split(" - ")[1]);

  lignes.push({ id: produitId, nom: produitNom.split(" - ")[0], quantite, prixUnitaire });

  afficherLignes();
}

function afficherLignes() {
  const tbody = document.querySelector("#table-lignes tbody");
  tbody.innerHTML = "";
  let total = 0;

  lignes.forEach((l, i) => {
    const ligne = document.createElement("tr");
    ligne.innerHTML = `
      <td>${l.nom}</td>
      <td>${l.quantite}</td>
      <td>${(l.quantite * l.prixUnitaire).toFixed(2)} $</td>
      <td><button onclick="supprimerLigne(${i})">❌</button></td>
    `;
    tbody.appendChild(ligne);
    total += l.quantite * l.prixUnitaire;
  });

  document.getElementById("total").textContent = `${total.toFixed(2)} $`;
}

function supprimerLigne(index) {
  lignes.splice(index, 1);
  afficherLignes();
}

async function validerVente() {
  if (lignes.length === 0) {
    alert("Aucun produit.");
    return;
  }

  const total = lignes.reduce((sum, l) => sum + l.quantite * l.prixUnitaire, 0);

  const res = await fetch("/vente", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      utilisateur_id: utilisateur.id,
      produits: lignes.map(l => ({ id: l.id, quantite: l.quantite })),
      total,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    return alert("Erreur : " + err.error);
  }

  alert("Vente enregistrée !");
  lignes = [];
  afficherLignes();
}

// Gérer le bouton retour (sans déconnexion)
document.getElementById("retour-admin")?.addEventListener("click", () => {
  window.location.href = "/admin.html";
});

window.addEventListener("DOMContentLoaded", () => {
  chargerProduits();
  document.getElementById("ajouter-ligne")?.addEventListener("click", ajouterLigne);
  document.getElementById("valider-vente")?.addEventListener("click", validerVente);
});
