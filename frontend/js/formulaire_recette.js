// Supabase init
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://jwydeurmndwzevsvpaql.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3eWRldXJtbmR3emV2c3ZwYXFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNjI4NDgsImV4cCI6MjA2NDgzODg0OH0.CWvgdZ-wYOLYtGzZQA4U8R7leNwTEa9bfyU8wnx9TC0"
);

// Ajoute une ligne dans le tableau
function ajouterLigne() {
  const tbody = document.getElementById("recette-lignes");
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td><input type="text" class="ingredient" placeholder="Ingrédient" /></td>
    <td><input type="number" class="quantite" placeholder="Quantité" /></td>
    <td><button type="button" class="supprimer-ligne">❌</button></td>
  `;

  tr.querySelector(".supprimer-ligne").addEventListener("click", () => {
    tr.remove();
  });

  tbody.appendChild(tr);
}

// Envoie la recette vers Supabase
async function validerRecette() {
  const produit = document.getElementById("recette-produit").value.trim();
  const lignes = document.querySelectorAll("#recette-lignes tr");

  const ingredients = [];
  const quantites = [];

  lignes.forEach((tr) => {
    const ing = tr.querySelector(".ingredient").value.trim();
    const qty = parseInt(tr.querySelector(".quantite").value.trim(), 10);
    if (ing && !isNaN(qty)) {
      ingredients.push(ing);
      quantites.push(qty);
    }
  });

  if (!produit || ingredients.length === 0 || ingredients.length !== quantites.length) {
    alert("Veuillez remplir tous les champs de manière cohérente.");
    return;
  }

  const { error } = await supabase.from("recettes").insert([{ produit, ingredients, quantites }]);

  if (error) {
    console.error("Erreur Supabase :", error);
    alert("Échec lors de l'ajout de la recette.");
  } else {
    alert("Recette ajoutée !");
    document.getElementById("recette-produit").value = "";
    document.getElementById("recette-lignes").innerHTML = "";
    ajouterLigne();
  }
}

// Événements
document.getElementById("ajouter-ligne-recette").addEventListener("click", ajouterLigne);
document.getElementById("valider-recette").addEventListener("click", validerRecette);

// Une ligne par défaut au démarrage
ajouterLigne();
