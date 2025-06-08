const role = localStorage.getItem("utilisateur_role");
if (role !== "admin") {
  window.location.href = "login.html";
}

const api = "https://test-stock-warner-backend.onrender.com";

async function chargerProduits() {
  const res = await fetch(`${api}/admin/produits`);
  const produits = await res.json();
  const tbody = document.querySelector("#table-produits tbody");
  tbody.innerHTML = "";

  produits.forEach(p => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${p.id}</td>
      <td><input value="${p.nom}" onchange="modifierProduit(${p.id})" /></td>
      <td><input type="number" value="${p.prix_vente}" onchange="modifierProduit(${p.id})" /></td>
      <td><input type="number" value="${p.stock ?? 0}" onchange="modifierProduit(${p.id})" /></td>
      <td><button onclick="supprimerProduit(${p.id})">❌</button></td>
    `;
    tbody.appendChild(row);
  });
}

async function ajouterProduit() {
  const nom = document.getElementById("produit-nom").value;
  const prix = parseFloat(document.getElementById("produit-prix").value);
  const stock = parseInt(document.getElementById("produit-stock").value);

  const res = await fetch(`${api}/admin/produits`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nom, prix_vente: prix, stock }),
  });

  if (!res.ok) {
    alert("Erreur lors de l'ajout du produit");
    return;
  }

  chargerProduits();
}

async function modifierProduit(id) {
  const ligne = [...document.querySelectorAll("#table-produits tbody tr")]
    .find(tr => tr.children[0].textContent == id);
  const nom = ligne.children[1].querySelector("input").value;
  const prix_vente = parseFloat(ligne.children[2].querySelector("input").value);
  const stock = parseInt(ligne.children[3].querySelector("input").value);

  await fetch(`${api}/admin/produits/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nom, prix_vente, stock }),
  });
}

async function supprimerProduit(id) {
  if (!confirm("Supprimer ce produit ?")) return;
  await fetch(`${api}/admin/produits/${id}`, { method: "DELETE" });
  chargerProduits();
}

async function chargerUtilisateurs() {
  const res = await fetch(`${api}/admin/utilisateurs`);
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
      <td><button onclick="supprimerUtilisateur(${u.id})">❌</button></td>
    `;
    tbody.appendChild(row);
  });
}

async function ajouterUtilisateur() {
  const pseudo = document.getElementById("user-pseudo").value;
  const mot_de_passe = document.getElementById("user-mdp").value;
  const role = document.getElementById("user-role").value;

  await fetch(`${api}/admin/utilisateurs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pseudo, mot_de_passe, role, actif: true }),
  });

  chargerUtilisateurs();
}

async function modifierUtilisateur(id) {
  const ligne = [...document.querySelectorAll("#table-utilisateurs tbody tr")]
    .find(tr => tr.children[0].textContent == id);
  const pseudo = ligne.children[1].querySelector("input").value;
  const role = ligne.children[2].querySelector("select").value;
  const actif = ligne.children[3].querySelector("input").checked;

  await fetch(`${api}/admin/utilisateurs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pseudo, role, actif }),
  });
}

async function supprimerUtilisateur(id) {
  if (!confirm("Supprimer cet utilisateur ?")) return;
  await fetch(`${api}/admin/utilisateurs/${id}`, { method: "DELETE" });
  chargerUtilisateurs();
}

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

const btnCompte = document.getElementById("btn-compte");
const menuCompte = document.getElementById("menu-compte");

btnCompte?.addEventListener("click", () => {
  menuCompte.style.display = menuCompte.style.display === "none" ? "block" : "none";
});

document.addEventListener("click", (e) => {
  if (!btnCompte.contains(e.target) && !menuCompte.contains(e.target)) {
    menuCompte.style.display = "none";
  }
});

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("ajouter-produit").addEventListener("click", ajouterProduit);
  document.getElementById("ajouter-utilisateur").addEventListener("click", ajouterUtilisateur);
  chargerProduits();
  chargerUtilisateurs();
});
