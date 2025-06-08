import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://jwydeurmndwzevsvpaql.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3eWRldXJtbmR3emV2c3ZwYXFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNjI4NDgsImV4cCI6MjA2NDgzODg0OH0.CWvgdZ-wYOLYtGzZQA4U8R7leNwTEa9bfyU8wnx9TC0"
);

document.getElementById("btn-login").addEventListener("click", async () => {
  const pseudo = document.getElementById("pseudo").value.trim();
  const mdp = document.getElementById("mdp").value.trim();

  if (!pseudo || !mdp) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  const { data, error } = await supabase
    .from("utilisateurs")
    .select("*")
    .ilike("pseudo", pseudo);

  if (error || !data || data.length === 0) {
    alert("Utilisateur introuvable.");
    return;
  }

  const utilisateur = data[0];

  if (utilisateur.mot_de_passe !== mdp) {
    alert("Mot de passe incorrect.");
    return;
  }

  if (!utilisateur.actif) {
    alert("Compte désactivé.");
    return;
  }

  // Stockage dans localStorage
  localStorage.setItem("utilisateur_id", utilisateur.id);
  localStorage.setItem("utilisateur_role", utilisateur.role);

  // Redirection selon le rôle
  if (utilisateur.role === "admin") {
    window.location.href = "admin.html";
  } else {
    window.location.href = "caisse.html";
  }
});
