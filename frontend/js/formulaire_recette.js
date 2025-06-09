// Supabase init
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
const supabase = createClient(
  "https://jwydeurmndwzevsvpaql.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3eWRldXJtbmR3emV2c3ZwYXFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNjI4NDgsImV4cCI6MjA2NDgzODg0OH0.CWvgdZ-wYOLYtGzZQA4U8R7leNwTEa9bfyU8wnx9TC0"
);

let listeIngredients = [];

async function chargerIngredientsDisponibles() {
  const { data, error } = await supabase.from("ingredients").select("nom").order("nom", { ascending: true });
  if (error) {
    console.error("Erreur chargement ingrédients disponibles :", error);
    return;
  }
  listeIngredients = data.map(item => item.nom);
  ajouterLigne();
}

function ajouterLigne() {
  const tbody = document.getElementById("recette-lignes");
  const tr = document.createElement("tr");

  const selectHTML = listeIngredients.map(nom => `<option value="${nom}">${nom}</option>`).join("");

  tr.innerHTML = `
    <td>
      <select class="ingredient">${selectHTML}</select>
    </td>
    <td><input type="number" class="quantite" placeholder="Quantité" /></td>
    <td><button type="button" class="supprimer-ligne">❌</button></td>
  `;

  tr.querySelector(".supprimer-ligne").addEventListener("click", () => {
    tr.remove();
  });

  tbody.appendChild(tr);
}

async function validerRecette() {
  const produit = document.getElementById("recette-produit").value.trim();
  const nbProduits = parseInt(document.getElementById("recette-nb").value.trim(), 10);
  const lignes = document.querySelectorAll("#recette-lignes tr");

  const ingredients = [];
  const quantites = [];

  lignes.forEach((tr) => {
    const ing = tr.querySelector(".ingredient").value;
    const qty = parseInt(tr.querySelector(".quantite").value.trim(), 10);
    if (ing && !isNaN(qty)) {
      ingredients.push(ing);
      quantites.push(qty);
    }
  });

  if (!produit || isNaN(nbProduits) || nbProduits <= 0 || ingredients.length === 0 || ingredients.length !== quantites.length) {
    alert("Veuillez remplir tous les champs correctement.");
    return;
  }

  const { error } = await supabase.from("recettes").insert([
    { produit, nb_produits: nbProduits, ingredients, quantites }
  ]);

  if (error) {
    console.error("Erreur Supabase :", error);
    alert("Erreur lors de l'ajout de la recette.");
  } else {
    alert("Recette ajoutée !");
    document.getElementById("recette-produit").value = "";
    document.getElementById("recette-nb").value = "";
    document.getElementById("recette-lignes").innerHTML = "";
    ajouterLigne();
  }
}

document.getElementById("ajouter-ligne-recette").addEventListener("click", ajouterLigne);
document.getElementById("valider-recette").addEventListener("click", validerRecette);

chargerIngredientsDisponibles();
