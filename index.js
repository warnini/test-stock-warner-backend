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
