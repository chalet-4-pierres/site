(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var menuBouton = document.querySelector(".menu-bouton");
  var menuListe = document.getElementById("menu");
  if (menuBouton && menuListe) {
    menuBouton.addEventListener("click", function () {
      var ouvert = menuListe.classList.toggle("ouvert");
      menuBouton.setAttribute("aria-expanded", ouvert ? "true" : "false");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menuListe.classList.contains("ouvert")) {
        menuListe.classList.remove("ouvert");
        menuBouton.setAttribute("aria-expanded", "false");
        menuBouton.focus();
      }
    });
  }

  var photo = document.querySelector(".ouverture figure img");
  if (photo) {
    var montrer = function () { photo.classList.add("vue"); };
    if (photo.complete) requestAnimationFrame(montrer);
    else { photo.addEventListener("load", montrer); photo.addEventListener("error", montrer); }
  }
})();
