console.log("JS chargé !");

const produitsContainer = document.getElementById("liste-produits");
const totalElement = document.getElementById("total");
const validerBtn = document.getElementById("valider-vente");
const ajouterBtn = document.getElementById("ajouter-produit");

// Stockage temporaire des produits du backend
let listeProduits = [];

// Récupère les produits depuis le backend
fetch("https://test-stock-warner-backend.onrender.com/produits") // Remplace bien l'URL par ton backend
  .then((res) => res.json())
  .then((produits) => {
    listeProduits = produits;
    ajouterProduit(); // ajoute une ligne par défaut au chargement
  })
  .catch((err) => {
    console.error("Erreur chargement produits :", err);
  });

// Fonction qui ajoute dynamiquement une ligne produit
function ajouterProduit() {
  const ligne = document.createElement("div");
  ligne.className = "ligne-produit";

  const select = document.createElement("select");
  select.innerHTML = listeProduits.map(
    (p) => `<option value="${p.id}" data-prix="${p.prix}">${p.nom} (${p.prix} $)</option>`
  ).join("");

  const inputQuantite = document.createElement("input");
  inputQuantite.type = "number";
  inputQuantite.min = "1";
  inputQuantite.value = "1";

  // Met à jour le total si quantité ou produit change
  select.addEventListener("change", mettreAJourTotal);
  inputQuantite.addEventListener("input", mettreAJourTotal);

  ligne.appendChild(select);
  ligne.appendChild(inputQuantite);
  produitsContainer.appendChild(ligne);

  mettreAJourTotal();
}

// Fonction de calcul du total
function mettreAJourTotal() {
  const lignes = produitsContainer.querySelectorAll(".ligne-produit");
  let total = 0;

  lignes.forEach((ligne) => {
    const select = ligne.querySelector("select");
    const input = ligne.querySelector("input");
    const prix = parseFloat(select.selectedOptions[0].dataset.prix || 0);
    const quantite = parseInt(input.value || 0);
    total += prix * quantite;
  });

  totalElement.textContent = total.toFixed(2);
}

// Événement bouton "+ Ajouter un produit"
ajouterBtn.addEventListener("click", ajouterProduit);

// Événement bouton "Valider la vente"
validerBtn.addEventListener("click", () => {
  const utilisateur_id = prompt("Entrez l'ID de l'employé :").trim();
  if (!utilisateur_id) return alert("ID employé requis.");

  const produits = [];
  const lignes = produitsContainer.querySelectorAll(".ligne-produit");

  lignes.forEach((ligne) => {
    const select = ligne.querySelector("select");
    const input = ligne.querySelector("input");
    const quantite = parseInt(input.value || 0);
    const id = parseInt(select.value);

    if (quantite > 0) {
      produits.push({ id, quantite });
    }
  });

  if (produits.length === 0) return alert("Aucun produit sélectionné.");

  const total = parseFloat(totalElement.textContent);

  fetch("https://test-stock-warner-backend.onrender.com/vente", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ utilisateur_id, produits, total }),
  })
    .then((res) => res.json())
    .then((data) => {
      alert("Vente enregistrée !");
      produitsContainer.innerHTML = "";
      totalElement.textContent = "0";
      ajouterProduit(); // recommence avec une ligne vide
    })
    .catch((err) => {
      alert("Erreur lors de la vente !");
      console.error(err);
    });
});
