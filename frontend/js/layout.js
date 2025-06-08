// Toggle affichage du menu déroulant
document.addEventListener("DOMContentLoaded", () => {
  const btnCompte = document.getElementById("btn-compte");
  const menuCompte = document.getElementById("menu-compte");

  if (btnCompte && menuCompte) {
    btnCompte.addEventListener("click", () => {
      menuCompte.style.display =
        menuCompte.style.display === "block" ? "none" : "block";
    });
  }

  // Déconnexion
  const logoutBtn = document.getElementById("btn-logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "login.html";
    });
  }
});
