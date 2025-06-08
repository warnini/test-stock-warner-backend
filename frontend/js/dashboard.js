const utilisateur_id = localStorage.getItem("utilisateur_id");
if (!utilisateur_id) {
  window.location.href = "login.html";
}

const statsContainer = document.getElementById("stats");

async function chargerStats() {
  try {
    const res = await fetch(`https://test-stock-warner-backend.onrender.com/stats/${utilisateur_id}`);
    const stats = await res.json();

    statsContainer.innerHTML = `
      <p><strong>Total des ventes :</strong> ${stats.total_ventes} $</p>
      <p><strong>Nombre de ventes :</strong> ${stats.nb_ventes}</p>
      <p><strong>Produits vendus :</strong> ${stats.nb_produits}</p>
      <p><strong>Nombre de crafts :</strong> ${stats.nb_crafts}</p>
    `;
  } catch (error) {
    statsContainer.innerHTML = "❌ Erreur de chargement des statistiques.";
  }
}

chargerStats();
