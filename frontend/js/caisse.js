import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://xxx.supabase.co"; // Remplace par ton URL Supabase
const supabaseKey = "eyJhbGciOi..."; // Remplace par ta vraie clé publique
const supabase = createClient(supabaseUrl, supabaseKey);

const produitsContainer = document.getElementById("liste-produits");
const totalElement = document.getElementById("total");
const validerBtn = document.getElementById("valider-vente");
const ajouterBtn = document.getElementById("ajouter-produit");

// Fonction de connexion
window.login = async function () {
  const pseudo = document.getElementById("login-pseudo").value.trim();
  const mot_de_passe = document.getElementById("login-mdp").value.trim();

  const { data, error } = await supabase
    .from("utilisateurs")
    .select("*")
    .eq("pseudo", pseudo)
    .single();

  if (error || !data) return alert("Utilisateur introuvable.");
  if (data.mot_de_passe !== mot_de_passe) return alert("Mot de passe incorrect.");

  // Connexion réussie
  localStorage.setItem("employe_id", data.id);
  document.getElementById("login-container").style.display = "none";
  document.getElementById("caisse-container").style.display = "block";

  chargerProduits();
};

// Charger les produits depuis le backend
function chargerProduits() {
  fetch("https://test-stock-warner-backend.onrender.com/produits")
    .then((res) => res.json())
    .then((produits) => {
      produitsContainer.innerHTML = "";
      ajouterLigneProduit(produits);
      ajouterBtn.onclick = () => ajouterLigneProduit(produits);
    });
}

// Ajouter une ligne produit
function ajouterLigneProduit(produits) {
  const div = document.createElement("div");
  div.className = "ligne-produit";

  const select = document.createElement("select");
  const input = document.createElement("input");
  input.type = "number";
  input.min = "0";
  input.value = "0";

  produits.forEach((p) => {
    const option = document.createElement("option");
    option.value = p.id;
    option.textContent = `${p.nom} (${p.prix} $)`;
    option.dataset.prix = p.prix;
    select.appendChild(option);
  });

  select.addEventListener("change", calculerTotal);
  input.addEventListener("input", calculerTotal);

  div.appendChild(select);
  div.appendChild(input);
  produitsContainer.appendChild(div);
  calculerTotal();
}

// Calcul automatique du total
function calculerTotal() {
  let total = 0;
  produitsContainer.querySelectorAll(".ligne-produit").forEach((ligne) => {
    const select = ligne.querySelector("select");
    const input = ligne.querySelector("input");
    const prix = parseFloat(select.selectedOptions[0].dataset.prix || 0);
    total += prix * parseInt(input.value || 0);
  });
  totalElement.textContent = total.toFixed(2);
}

// Enregistrement de la vente
validerBtn.addEventListener("click", () => {
  const employe_id = localStorage.getItem("employe_id");
  if (!employe_id) return alert("Non connecté");

  const produits = [];
  produitsContainer.querySelectorAll(".ligne-produit").forEach((ligne) => {
    const id = parseInt(ligne.querySelector("select").value);
    const qte = parseInt(ligne.querySelector("input").value);
    if (qte > 0) produits.push({ id, quantite: qte });
  });

  if (produits.length === 0) return alert("Sélectionnez au moins un produit");

  const total = parseFloat(totalElement.textContent);

  fetch("https://test-stock-warner-backend.onrender.com/vente", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ utilisateur_id: parseInt(employe_id), produits, total }),
  })
    .then((res) => res.json())
    .then(() => {
      alert("Vente enregistrée !");
      produitsContainer.innerHTML = "";
      chargerProduits();
    });
});
