// Vérifie si l'utilisateur est connecté
const utilisateur_id = localStorage.getItem("utilisateur_id");
if (!utilisateur_id) {
  window.location.href = "login.html";
}

const produitsContainer = document.getElementById("liste-produits");
const totalElement = document.getElementById("total");
const ajouterBtn = document.getElementById("ajouter-produit");
const validerBtn = document.getElementById("valider-vente");

let produits = [];
let lignes = [];

fetch("https://test-stock-warner-backend.onrender.com/produits")
  .then(res => res.json())
  .then(data => {
    produits = data;
    ajouterLigne();
    ajouterBtn.addEventListener("click", ajouterLigne);
  });

function ajouterLigne() {
  const ligne = document.createElement("div");
  ligne.className = "ligne-produit";

  const select = document.createElement("select");
  const input = document.createElement("input");
  input.type = "number";
  input.min = "0";
  input.value = "0";

  produits.forEach(p => {
    const option = document.createElement("option");
    option.value = p.id;
    option.textContent = `${p.nom} (${p.prix_vente} $)`;
    option.dataset.prix = p.prix_vente;
    select.appendChild(option);
  });

  select.addEventListener("change", calculerTotal);
  input.addEventListener("input", calculerTotal);

  ligne.appendChild(select);
  ligne.appendChild(input);
  produitsContainer.appendChild(ligne);

  calculerTotal();
}

function calculerTotal() {
  let total = 0;
  produitsContainer.querySelectorAll(".ligne-produit").forEach((ligne) => {
    const select = ligne.querySelector("select");
    const input = ligne.querySelector("input");
    const prix = parseFloat(select.selectedOptions[0].dataset.prix || 0);
    const qte = parseInt(input.value || 0);
    total += prix * qte;
  });
  totalElement.textContent = total.toFixed(2);
}

validerBtn.addEventListener("click", () => {
  const lignes = [];
  produitsContainer.querySelectorAll(".ligne-produit").forEach((ligne) => {
    const id = parseInt(ligne.querySelector("select").value);
    const qte = parseInt(ligne.querySelector("input").value);
    if (qte > 0) lignes.push({ id, quantite: qte });
  });

  if (lignes.length === 0) return alert("Veuillez sélectionner au moins un produit.");

  const total = parseFloat(totalElement.textContent);

  fetch("https://test-stock-warner-backend.onrender.com/vente", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ utilisateur_id: parseInt(utilisateur_id), produits: lignes, total }),
  })
    .then((res) => res.json())
    .then(() => {
      alert("✅ Vente enregistrée !");
      produitsContainer.innerHTML = "";
      ajouterLigne();
    });
});
