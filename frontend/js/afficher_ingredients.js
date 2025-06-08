// 🔗 Connexion Supabase
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://jwydeurmndwzevsvpaql.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3eWRldXJtbmR3emV2c3ZwYXFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNjI4NDgsImV4cCI6MjA2NDgzODg0OH0.CWvgdZ-wYOLYtGzZQA4U8R7leNwTEa9bfyU8wnx9TC0"
);

// 📊 Chargement des ingrédients
async function chargerIngredients() {
  const { data, error } = await supabase.from("ingredients").select("*").order("id", { ascending: true });

  if (error) {
    console.error("Erreur chargement ingrédients :", error);
    return;
  }

  const tbody = document.querySelector("#table-ingredients tbody");
  tbody.innerHTML = "";

  data.forEach(ing => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${ing.id}</td>
      <td>${ing.nom}</td>
      <td>${ing.prix}</td>
      <td><button disabled>❌</button></td>
    `;
    tbody.appendChild(tr);
  });
}

chargerIngredients();
