// 🔗 Connexion Supabase
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://jwydeurmndwzevsvpaql.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3eWRldXJtbmR3emV2c3ZwYXFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNjI4NDgsImV4cCI6MjA2NDgzODg0OH0.CWvgdZ-wYOLYtGzZQA4U8R7leNwTEa9bfyU8wnx9TC0"
);

// 📥 Ajout d'une recette
document.getElementById("ajouter-recette").addEventListener("click", async () => {
  const produit = document.getElementById("recette-produit").value.trim();
  const ingredientsRaw = document.getElementById("recette-ingredients").value.trim();
  const quantitesRaw = document.getElementById("recette-quantites").value.trim();

  if (!produit || !ingredientsRaw || !quantitesRaw) {
    alert("Veuillez remplir tous les champs de recette.");
    return;
  }

  const ingredients = ingredientsRaw.split(",").map(x => x.trim());
  const quantites = quantitesRaw.split(",").map(x => parseInt(x.trim(), 10));

  if (ingredients.length !== quantites.length || quantites.some(isNaN)) {
    alert("Les quantités doivent correspondre au nombre d'ingrédients et être des nombres valides.");
    return;
  }

  const { error } = await supabase.from("recettes").insert([
    {
      produit,
      ingredients,
      quantites,
    }
  ]);

  if (error) {
    console.error("Erreur ajout recette :", error);
    alert("Erreur lors de l'ajout de la recette.");
  } else {
    alert("Recette ajoutée !");
    document.getElementById("recette-produit").value = "";
    document.getElementById("recette-ingredients").value = "";
    document.getElementById("recette-quantites").value = "";
  }
});
