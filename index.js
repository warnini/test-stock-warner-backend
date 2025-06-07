import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

// Connexion à Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const app = express();
app.use(cors());
app.use(express.json());

// Route test
app.get("/", (req, res) => {
  res.send("Backend test-stock-warner actif !");
});

// Route GET /produits : récupère tous les produits
app.get("/produits", async (req, res) => {
  const { data, error } = await supabase.from("produits").select("*");
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});

// Route POST /login : connexion employé
app.post("/login", async (req, res) => {
  const { pseudo, mot_de_passe } = req.body;

  if (!pseudo || !mot_de_passe) {
    return res.status(400).json({ error: "Pseudo et mot de passe requis" });
  }

  const { data, error } = await supabase
    .from("utilisateurs")
    .select("*")
    .eq("pseudo", pseudo)
    .single();

  if (error || !data) {
    return res.status(401).json({ error: "Utilisateur introuvable" });
  }

  if (data.mot_de_passe !== mot_de_passe) {
    return res.status(401).json({ error: "Mot de passe incorrect" });
  }

  if (!data.actif) {
    return res.status(403).json({ error: "Utilisateur désactivé" });
  }

  res.json({
    message: "Connexion réussie",
    id: data.id,
    pseudo: data.pseudo,
    role: data.role,
    actif: data.actif
  });
});
