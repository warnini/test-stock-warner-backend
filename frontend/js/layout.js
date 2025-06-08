// js/layout.js
document.addEventListener("DOMContentLoaded", () => {
  const btnCompte = document.getElementById("btn-compte");
  const menuCompte = document.getElementById("menu-compte");
  const btnDeconnexion = document.getElementById("btn-deconnexion");

  if (btnCompte && menuCompte) {
    btnCompte.addEventListener("click", () => {
      menuCompte.classList.toggle("show");
    });
  }

  if (btnDeconnexion) {
    btnDeconnexion.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "login.html";
    });
  }
});
