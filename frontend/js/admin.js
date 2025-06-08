async function chargerProduits() {
  const res = await fetch("/admin/produits");
  const produits = await res.json();
  const tbody = document.querySelector("#table-produits tbody");
  tbody.innerHTML = "";

  produits.forEach(p => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${p.id}</td>
      <td><input value="${p.nom}" onchange="modifierProduit(${p.id})" /></td>
      <td><input type="number" value="${p.prix_vente}" onchange="modifierProduit(${p.id})" /></td>
      <td><input type="number" value="${p.stock}" onchange="modifierProduit(${p.id})" /></td>
      <td><button data-id="${p.id}" class="btn-supprimer-produit">❌</button></td>
    `;
    tbody.appendChild(row);
  });

  document.querySelectorAll(".btn-supprimer-produit").forEach(btn => {
    btn.addEventListener("click", () => supprimerProduit(btn.dataset.id));
  });
}

async function ajouterProduit() {
  const nom = document.getElementById("produit-nom").value;
  const prix = parseFloat(document.getElementById("produit-prix").value);
  const stock = parseInt(document.getElementById("produit-stock").value);

  if (!nom || isNaN(prix) || isNaN(stock)) return alert("Champs invalides");

  const res = await fetch("/admin/produits", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nom, prix_vente: prix, stock }),
  });

  if (!res.ok) {
    const err = await res.json();
    return alert("Erreur : " + err.error);
  }

  document.getElementById("produit-nom").value = "";
  document.getElementById("produit-prix").value = "";
  document.getElementById("produit-stock").value = "";

  chargerProduits();
}

async function modifierProduit(id) {
  const ligne = [...document.querySelectorAll("#table-produits tbody tr")]
    .find(tr => tr.children[0].textContent == id);

  const nom = ligne.children[1].querySelector("input").value;
  const prix_vente = parseFloat(ligne.children[2].querySelector("input").value);
  const stock = parseInt(ligne.children[3].querySelector("input").value);

  const res = await fetch(`/admin/produits/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nom, prix_vente, stock }),
  });

  if (!res.ok) {
    const err = await res.json();
    return alert("Erreur : " + err.error);
  }
}

async function supprimerProduit(id) {
  if (!confirm("Supprimer ce produit ?")) return;
  const res = await fetch(`/admin/produits/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json();
    return alert("Erreur : " + err.error);
  }
  chargerProduits();
}

async function chargerUtilisateurs() {
  const res = await fetch("/admin/utilisateurs");
  const users = await res.json();
  const tbody = document.querySelector("#table-utilisateurs tbody");
  tbody.innerHTML = "";

  users.forEach(u => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${u.id}</td>
      <td><input value="${u.pseudo}" onchange="modifierUtilisateur(${u.id})" /></td>
      <td>
        <select onchange="modifierUtilisateur(${u.id})">
          <option value="employe" ${u.role === "employe" ? "selected" : ""}>Employé</option>
          <option value="admin" ${u.role === "admin" ? "selected" : ""}>Admin</option>
        </select>
      </td>
      <td><input type="checkbox" ${u.actif ? "checked" : ""} onchange="modifierUtilisateur(${u.id})" /></td>
      <td><button data-id="${u.id}" class="btn-supprimer-utilisateur">❌</button></td>
    `;
    tbody.appendChild(row);
  });

  document.querySelectorAll(".btn-supprimer-utilisateur").forEach(btn => {
    btn.addEventListener("click", () => supprimerUtilisateur(btn.dataset.id));
  });
}

async function ajouterUtilisateur() {
  const pseudo = document.getElementById("user-pseudo").value;
  const mot_de_passe = document.getElementById("user-mdp").value;
  const role = document.getElementById("user-role").value;

  if (!pseudo || !mot_de_passe || !role) return alert("Champs manquants");

  const res = await fetch("/admin/utilisateurs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pseudo, mot_de_passe, role }),
  });

  if (!res.ok) {
    const err = await res.json();
    return alert("Erreur : " + err.error);
  }

  document.getElementById("user-pseudo").value = "";
  document.getElementById("user-mdp").value = "";
  document.getElementById("user-role").value = "employe";

  chargerUtilisateurs();
}

async function modifierUtilisateur(id) {
  const ligne = [...document.querySelectorAll("#table-utilisateurs tbody tr")]
    .find(tr => tr.children[0].textContent == id);

  const pseudo = ligne.children[1].querySelector("input").value;
  const role = ligne.children[2].querySelector("select").value;
  const actif = ligne.children[3].querySelector("input").checked;

  const res = await fetch(`/admin/utilisateurs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pseudo, role, actif }),
  });

  if (!res.ok) {
    const err = await res.json();
    return alert("Erreur : " + err.error);
  }
}

async function supprimerUtilisateur(id) {
  if (!confirm("Supprimer cet utilisateur ?")) return;
  const res = await fetch(`/admin/utilisateurs/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json();
    return alert("Erreur : " + err.error);
  }
  chargerUtilisateurs();
}

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("ajouter-produit")?.addEventListener("click", ajouterProduit);
  document.getElementById("ajouter-utilisateur")?.addEventListener("click", ajouterUtilisateur);
  chargerProduits();
  chargerUtilisateurs();
});
