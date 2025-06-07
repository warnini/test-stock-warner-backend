const produitsContainer = document.getElementById("produits-container");
const totalElement = document.getElementById("total");
const validerBtn = document.getElementById("valider-btn");
const confirmation = document.getElementById("confirmation");

// Récupérer les produits depuis le backend
fetch("https://ton-backend.onrender.com/produits") // ← Remplace par ton URL
  .then((res) => res.json())
  .then((produits) => {
    produits.forEach((produit) => {
      const div = document.createElement("div");
      div.className = "produit";
      div.innerHTML = `
        <label>${produit.nom} (${produit.prix}$)</label>
        <input type="number" min="0" value="0" data-id="${produit.id}" data-prix="${produit.prix}" />
      `;
      produitsContainer.appendChild(div);
    });
  });

// Met à jour le total automatiquement
produitsContainer.addEventListener("input", () => {
  const inputs = produitsContainer.querySelectorAll("input");
  let total = 0;
  inputs.forEach((input) => {
    total += parseInt(input.value || 0) * parseFloat(input.dataset.prix);
  });
  totalElement.textContent = `${total} $`;
});

// Envoie les données au backend
validerBtn.addEventListener("click", () => {
  const utilisateur_id = document.getElementById("utilisateur_id").value.trim();
  if (!utilisateur_id) return alert("Veuillez entrer l'ID employé");

  const produits = [];
  const inputs = produitsContainer.querySelectorAll("input");

  inputs.forEach((input) => {
    const quantite = parseInt(input.value || 0);
    if (quantite > 0) {
      produits.push({
        id: parseInt(input.dataset.id),
        quantite: quantite,
      });
    }
  });

  if (produits.length === 0) return alert("Sélectionnez au moins un produit.");

  const total = parseFloat(totalElement.textContent);

  fetch("https://ton-backend.onrender.com/vente", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ utilisateur_id, produits, total }),
  })
    .then((res) => res.json())
    .then((data) => {
      confirmation.classList.remove("hidden");
      setTimeout(() => confirmation.classList.add("hidden"), 3000);
      produitsContainer.querySelectorAll("input").forEach((input) => (input.value = 0));
      totalElement.textContent = "0 $";
    })
    .catch((err) => {
      alert("Erreur lors de l’enregistrement.");
      console.error(err);
    });
});
