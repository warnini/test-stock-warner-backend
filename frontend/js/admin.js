async function chargerProduits() {
  const res = await fetch("/admin/produits");
  const produits = await res.json();
  const tbody = document.querySelector("#table-produits tbody");
  tbody.innerHTML = "";
  produits.forEach(p => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${p.id}</td>
      <td><input value="${p.nom}" onchange="modifierProduit(${p.id}, 'nom', this.value)" /></td>
      <td><input type="number" value="${p.prix_vente}" onchange="modifierProduit(${p.id}, 'prix_vente', this.value)" /></td>
      <td><input type="number" value="${p.stock}" onchange="modifierProduit(${p.id}, 'stock', this.value)" /></td>
      <td><button onclick="supprimerProduit(${p.id})">❌</button></td>
    `;
    tbody.appendChild(row);
  });
}

async function ajouterProduit() {
  const nom = document.getElementById("produit-nom").value;
  const prix = parseFloat(document.getElementById("produit-prix").value);
  const stock = parseInt(document.getElementById("produit-stock").value);

  await fetch("/admin/produits", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nom, prix_vente: prix, stock }),
  });
  chargerProduits();
}

async function modifierProduit(id, champ, valeur) {
  const ligne = document.querySelector(`#table-produits tr td:first-child:contains(${id})`)?.parentElement;
  const nom = ligne?.children[1].querySelector("input").value;
  const prix_vente = parseFloat(ligne?.children[2].querySelector("input").value);
  const stock = parseInt(ligne?.children[3].querySelector("input").value);

  await fetch(`/admin/produits/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nom, prix_vente, stock }),
  });
}

async function supprimerProduit(id) {
  await fetch(`/admin/produits/${id}`, { method: "DELETE" });
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
      <td><select onchange="modifierUtilisateur(${u.id})">
            <option value="employe" ${u.role === "employe" ? "selected" : ""}>Employé</option>
            <option value="admin" ${u.role === "admin" ? "selected" : ""}>Admin</option>
          </select></td>
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

  await fetch("/admin/utilisateurs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pseudo, mot_de_passe, role }),
  });
  chargerUtilisateurs();
}

async function modifierUtilisateur(id) {
  const ligne = [...document.querySelectorAll("#table-utilisateurs tr")].find(tr => tr.children[0].textContent == id);
  const pseudo = ligne.children[1].querySelector("input").value;
  const role = ligne.children[2].querySelector("select").value;
  const actif = ligne.children[3].querySelector("input").checked;

  await fetch(`/admin/utilisateurs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pseudo, role, actif }),
  });
}

async function supprimerUtilisateur(id) {
  await fetch(`/admin/utilisateurs/${id}`, { method: "DELETE" });
  chargerUtilisateurs();
}

chargerProduits();
chargerUtilisateurs();
