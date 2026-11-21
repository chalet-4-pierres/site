(function () {
  "use strict";
  document.documentElement.classList.add("js");

  // Menu sur petit écran
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

  // Coupe du chalet : apparition étage par étage, survol
  var coupe = document.querySelector(".coupe");
  if (coupe) {
    var svgCoupe = coupe.querySelector("svg");
    var mq = window.matchMedia("(max-width: 640px)");
    var cadrer = function () { svgCoupe.setAttribute("viewBox", mq.matches ? "200 86 320 326" : "0 86 520 326"); };
    cadrer();
    if (mq.addEventListener) mq.addEventListener("change", cadrer);
    requestAnimationFrame(function () { requestAnimationFrame(function () { coupe.classList.add("pret"); }); });
    coupe.querySelectorAll(".etage").forEach(function (g) {
      g.addEventListener("mouseenter", function () { g.classList.add("actif"); });
      g.addEventListener("mouseleave", function () { g.classList.remove("actif"); });
    });
  }

  // Règle des saisons
  var regle = document.querySelector("[data-regle]");
  if (!regle) return;
  var curseur = regle.querySelector("input[type=range]");
  var bandes = regle.querySelector(".piste-bandes");
  var mois = regle.querySelector(".piste-mois");
  var etat = regle.querySelector(".regle-etat");
  var lienDemande = regle.querySelector("[data-demande]");

  var JOUR = 86400000;
  function versDate(s) { var p = s.split("-"); return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])); }
  function iso(d) { return d.toISOString().slice(0, 10); }
  var fmtJour = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  var fmtMois = new Intl.DateTimeFormat("fr-FR", { month: "short", timeZone: "UTC" });

  fetch(regle.getAttribute("data-source"))
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var periodes = data.periodes.map(function (p) {
        return { nom: p.nom, debut: versDate(p.debut), fin: versDate(p.fin), weekEnd: p.weekEnd, vacances: p.vacances, id: p.id };
      });
      var finDonnees = periodes[periodes.length - 1].fin;

      var aujourdhui = new Date();
      var debut = new Date(Date.UTC(aujourdhui.getFullYear(), aujourdhui.getMonth(), aujourdhui.getDate()));
      while (debut.getUTCDay() !== 6) debut = new Date(debut.getTime() + JOUR);

      var semaines = [];
      for (var d = debut; d < finDonnees && semaines.length < 53; d = new Date(d.getTime() + 7 * JOUR)) semaines.push(d);
      if (!semaines.length) return;
      var fin = new Date(semaines[semaines.length - 1].getTime() + 7 * JOUR);
      var total = fin - debut;
      function pos(date) { return Math.max(0, Math.min(100, ((date - debut) / total) * 100)); }

      // Bandes de couleur par période
      periodes.forEach(function (p) {
        if (p.fin <= debut || p.debut >= fin) return;
        if (!p.vacances) return;
        var s = document.createElement("span");
        s.className = /noel|nouvel/.test(p.id) ? "fetes" : "vacances";
        s.style.left = pos(p.debut) + "%";
        s.style.width = (pos(p.fin) - pos(p.debut)) + "%";
        bandes.appendChild(s);
      });

      // Repères de mois
      var m = new Date(Date.UTC(debut.getUTCFullYear(), debut.getUTCMonth() + 1, 1));
      var i = 0;
      for (; m < fin; m = new Date(Date.UTC(m.getUTCFullYear(), m.getUTCMonth() + 1, 1)), i++) {
        var lab = document.createElement("span");
        var txt = fmtMois.format(m).replace(".", "");
        if (m.getUTCMonth() === 0) txt += " " + m.getUTCFullYear();
        lab.textContent = txt;
        lab.style.left = pos(m) + "%";
        if (i % 2) lab.className = "secondaire";
        mois.appendChild(lab);
      }

      curseur.min = 0;
      curseur.max = semaines.length - 1;
      curseur.step = 1;
      curseur.value = 0;

      function periodeDe(date) {
        for (var k = 0; k < periodes.length; k++) if (date >= periodes[k].debut && date < periodes[k].fin) return periodes[k];
        return null;
      }

      function majournee() {
        var sem = semaines[+curseur.value];
        var p = periodeDe(sem);
        var libelle = "Semaine du " + fmtJour.format(sem);
        var regleTxt = p && !p.weekEnd
          ? "Location à la semaine, du samedi au samedi."
          : "À la semaine, ou au week-end (2 nuits minimum).";
        etat.innerHTML = "<strong>" + libelle + "</strong><br>" + (p ? p.nom + " · " : "") + regleTxt;
        curseur.setAttribute("aria-valuetext", libelle + ", " + (p ? p.nom : ""));
        if (lienDemande) lienDemande.href = "/reserver/?arrivee=" + iso(sem);
      }
      curseur.addEventListener("input", majournee);
      majournee();
      regle.classList.add("prete");
    })
    .catch(function () {
      etat.textContent = "Consultez les disponibilités sur la page Tarifs.";
    });
})();
