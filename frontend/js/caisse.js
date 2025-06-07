import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// 🔐 Supabase
const supabase = createClient(
  "https://jwydeurmndwzevsvpaql.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // remplace par ta vraie clé publique
);

// 🎯 Sélecteurs
const produitsContainer = document.getElementById("liste-produits");
const totalElement = document.getElementById("total");
const validerBtn = document.getElementById("valider-vente");
const ajouterBtn = document.getElementById("ajouter-produit");
const btnLogin = document.getElementById("btn-login");
const btnDashboard = document.getElementById("ouvrir-dashboard");
const btnRetour = document.getElementById("retour-caisse");
const btnAdmin = document.getElementById("ouvrir-admin");

// 🧑 Connexion utilisateur
btnLogin.addEventListener("click", async () => {
  const pseudo = document.getElementById("login-pseudo").value.trim();
  const mot_de_passe = document.getElementById("login-mdp").value.trim();

  if (!pseudo || !mot_de_passe) return alert("Veuillez remplir les deux champs.");

  const { data, error } = await supabase
    .from("utilisateurs")
    .select("*")
    .ilike("pseudo", pseudo)
    .single();

  if (error || !data) return alert("Utilisateur introuvable.");
  if (data.mot_de_passe !== mot_de_passe) return alert("Mot de passe incorrect.");

  localStorage.setItem("employe_id", data.id);
  localStorage.setItem("employe_role", data.role);

  document.getElementById("login-container").style.display = "none";
  document.getElementById("caisse-container").style.display = "block";

  if (data.role === "admin") {
    btnAdmin.style.display = "inline-block";
  }

  chargerProduits();
});

// 🛒 Chargement des produits
function chargerProduits() {
  fetch("https://test-stock-warner-backend.onrender.com/produits")
    .then((res) => res.json())
    .then((produits) => {
      produitsContainer.innerHTML = "";
      ajouterLigneProduit(produits);
      ajouterBtn.onclick = () => ajouterLigneProduit(produits);
    });
}

// ➕ Ajouter une ligne produit
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

// 💰 Calcul du total
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

// ✅ Enregistrement de la vente
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

// 📊 Statistiques personnelles
btnDashboard.addEventListener("click", async () => {
  document.getElementById("caisse-container").style.display = "none";
  document.getElementById("dashboard-container").style.display = "block";

  const employe_id = localStorage.getItem("employe_id");
  if (!employe_id) return;

  const container = document.getElementById("contenu-dashboard");
  container.innerHTML = "Chargement...";

  try {
    const res = await fetch(`https://test-stock-warner-backend.onrender.com/stats/${employe_id}`);
    const stats = await res.json();

    container.innerHTML = `
      <p><strong>Total ventes :</strong> ${stats.total_ventes} $</p>
      <p><strong>Nombre de ventes :</strong> ${stats.nb_ventes}</p>
      <p><strong>Produits vendus :</strong> ${stats.nb_produits}</p>
      <p><strong>Nombre de craft :</strong> ${stats.nb_crafts}</p>
    `;
  } catch {
    container.innerHTML = "Erreur de chargement.";
  }
});

// 🔙 Retour à la caisse
btnRetour.addEventListener("click", () => {
  document.getElementById("dashboard-container").style.display = "none";
  document.getElementById("caisse-container").style.display = "block";
});

// 🔐 Accès admin (redirige vers admin.html)
btnAdmin.addEventListener("click", () => {
  window.location.href = "admin.html";
});
