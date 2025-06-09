// Supabase
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
const supabase = createClient(
  "https://jwydeurmndwzevsvpaql.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3eWRldXJtbmR3emV2c3ZwYXFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNjI4NDgsImV4cCI6MjA2NDgzODg0OH0.CWvgdZ-wYOLYtGzZQA4U8R7leNwTEa9bfyU8wnx9TC0"
);

async function afficherRecettes() {
  const table = document.querySelector("#table-recettes tbody");
  table.innerHTML = "";

  const { data, error } = await supabase.from("recettes").select("*").order("id", { ascending: true });

  if (error) {
    console.error("Erreur chargement recettes :", error);
    return;
  }

  data.forEach((recette) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${recette.id}</td>
      <td>${recette.produit}</td>
      <td>${recette.nb_produits ?? "-"}</td>
      <td>${recette.ingredients.join(", ")}</td>
      <td>${recette.quantites.join(", ")}</td>
      <td><button class="btn-supprimer-recette" data-id="${recette.id}">❌</button></td>
    `;

    table.appendChild(tr);
  });

  // Ajout des événements sur les boutons supprimer
  document.querySelectorAll(".btn-supprimer-recette").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      const confirmDel = confirm("Supprimer cette recette ?");
      if (!confirmDel) return;
      const { error } = await supabase.from("recettes").delete().eq("id", id);
      if (error) {
        alert("Erreur lors de la suppression.");
        console.error(error);
      } else {
        afficherRecettes();
      }
    });
  });
}

// Appel initial
afficherRecettes();
