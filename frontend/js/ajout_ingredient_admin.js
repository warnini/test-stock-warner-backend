// 🔗 Connexion Supabase
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://jwydeurmndwzevsvpaql.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3eWRldXJtbmR3emV2c3ZwYXFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNjI4NDgsImV4cCI6MjA2NDgzODg0OH0.CWvgdZ-wYOLYtGzZQA4U8R7leNwTEa9bfyU8wnx9TC0"
);

// 📥 Ajout d'un ingrédient
document.getElementById("ajouter-ingredient").addEventListener("click", async () => {
  const nom = document.getElementById("ingredient-nom").value.trim();
  const prix = parseFloat(document.getElementById("ingredient-prix").value.trim());

  if (!nom || isNaN(prix)) {
    alert("Veuillez saisir un nom et un prix valide.");
    return;
  }

  const { error } = await supabase.from("ingredients").insert([{ nom, prix }]);

  if (error) {
    console.error("Erreur ajout ingrédient :", error);
    alert("Erreur lors de l'ajout de l'ingrédient.");
  } else {
    alert("Ingrédient ajouté !");
    document.getElementById("ingredient-nom").value = "";
    document.getElementById("ingredient-prix").value = "";
  }
});
