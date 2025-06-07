import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// 🔁 À modifier avec tes vraies informations Supabase :
const supabaseUrl = "https://jwydeurmndwzevsvpaql.supabase.co"; // ← Ton URL Supabase
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3eWRldXJtbmR3emV2c3ZwYXFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNjI4NDgsImV4cCI6MjA2NDgzODg0OH0.CWvgdZ-wYOLYtGzZQA4U8R7leNwTEa9bfyU8wnx9TC0";           // ← Ta clé API publique
const supabase = createClient(supabaseUrl, supabaseKey);

// Éléments DOM
const produitsContainer = document.getElementById("liste-produits");
const totalElement = document.getElementById("total");
const validerBtn = document.getElementById("valider-vente");
const ajouterBtn = document.getElementById("ajouter-produit");

// === Connexion utilisateur ===
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

// === Chargement des produits ===
function chargerProduits() {
  fetch("https://test-stock-warner-backend.onrender.com/produits")
    .then((res) => res.json())
    .then((produits) => {
      produitsContainer.innerHTML = "";
      ajouterLigneProduit(produits);
      ajouterBtn.onclick = () => ajouterLigneProduit(produits);
    })
    .catch((err) => alert("Erreur de chargement des produits"));
}

// === Ajout dynamique de produit ===
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

// === Calcul du total ===
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

// === Validation et envoi de la vente ===
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
    })
    .catch(() => alert("Erreur lors de l'enregistrement de la vente."));
});
