// 🔗 Connexion Supabase
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://jwydeurmndwzevsvpaql.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3eWRldXJtbmR3emV2c3ZwYXFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNjI4NDgsImV4cCI6MjA2NDgzODg0OH0.CWvgdZ-wYOLYtGzZQA4U8R7leNwTEa9bfyU8wnx9TC0"
);

// 📊 Chargement des recettes
async function chargerRecettes() {
  const { data, error } = await supabase.from("recettes").select("*").order("id", { ascending: true });

  if (error) {
    console.error("Erreur chargement recettes :", error);
    return;
  }

  const tbody = document.querySelector("#table-recettes tbody");
  tbody.innerHTML = "";

  data.forEach(recette => {
    const ligne = document.createElement("tr");

    const ingredients = recette.ingredients?.join(", ") || "";
    const quantites = recette.quantites?.join(", ") || "";

    ligne.innerHTML = `
      <td>${recette.id}</td>
      <td>${recette.produit}</td>
      <td>${ingredients}</td>
      <td>${quantites}</td>
      <td><button disabled>❌</button></td>
    `;
    tbody.appendChild(ligne);
  });
}

chargerRecettes();
