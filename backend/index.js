import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

// Chemins nécessaires pour __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connexion Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const app = express();
app.use(cors());
app.use(express.json());

// Sert les fichiers statiques du frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// Route GET /
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/caisse.html"));
});

// GET /produits
app.get("/produits", async (req, res) => {
  const { data, error } = await supabase.from("produits").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST /login
app.post("/login", async (req, res) => {
  const { pseudo, mot_de_passe } = req.body;
  if (!pseudo || !mot_de_passe)
    return res.status(400).json({ error: "Pseudo et mot de passe requis" });

  const { data, error } = await supabase
    .from("utilisateurs")
    .select("*")
    .eq("pseudo", pseudo)
    .single();

  if (error || !data) return res.status(401).json({ error: "Utilisateur introuvable" });
  if (data.mot_de_passe !== mot_de_passe)
    return res.status(401).json({ error: "Mot de passe incorrect" });
  if (!data.actif) return res.status(403).json({ error: "Utilisateur désactivé" });

  res.json({
    message: "Connexion réussie",
    id: data.id,
    pseudo: data.pseudo,
    role: data.role,
    actif: data.actif,
  });
});

// POST /vente
app.post("/vente", async (req, res) => {
  const { utilisateur_id, produits, total } = req.body;
  if (!utilisateur_id || !produits || typeof total !== "number")
    return res.status(400).json({ error: "Champs requis manquants." });

  const { data: vente, error: erreurVente } = await supabase
    .from("ventes")
    .insert([{ utilisateur_id, produits, total }])
    .select()
    .single();

  if (erreurVente) return res.status(500).json({ error: erreurVente.message });

  for (const { id, quantite } of produits) {
    const { error: erreurStock } = await supabase.rpc("deduire_stock", {
      produit_id_input: id,
      quantite_input: quantite,
    });

    if (erreurStock) return res.status(500).json({ error: `Erreur sur produit ${id}` });
  }

  res.json({ message: "Vente enregistrée avec succès", vente });
});

// ✅ NOUVELLE ROUTE /stats/:id
app.get("/stats/:id", async (req, res) => {
  const utilisateurId = parseInt(req.params.id);

  try {
    // Total des ventes et nombre de ventes
    const { data: ventes, error: errVentes } = await supabase
      .from("ventes")
      .select("total")
      .eq("utilisateur_id", utilisateurId);

    if (errVentes) throw errVentes;

    const nb_ventes = ventes.length;
    const total_ventes = ventes.reduce((acc, v) => acc + (v.total || 0), 0);

    // Nombre total de produits vendus (en comptant les quantités)
    let nb_produits = 0;
    for (const vente of ventes) {
      const produits = vente.produits || [];
      nb_produits += produits.reduce((sum, p) => sum + (p.quantite || 0), 0);
    }

    // Nombre de craft (si table disponible)
    const { data: crafts, error: errCrafts } = await supabase
      .from("crafts")
      .select("*")
      .eq("utilisateur_id", utilisateurId);

    const nb_crafts = crafts?.length || 0;

    res.json({ nb_ventes, total_ventes, nb_produits, nb_crafts });
  } catch (error) {
    console.error("Erreur dans /stats/:id", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
