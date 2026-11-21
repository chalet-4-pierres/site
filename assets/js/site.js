(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.add("js");

  // ---------- Menu sur petit écran ----------
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

  // ---------- Photo d'ouverture ----------
  var photo = document.querySelector(".ouverture figure img");
  if (photo) {
    var montrer = function () { photo.classList.add("vue"); };
    if (photo.complete) requestAnimationFrame(montrer);
    else { photo.addEventListener("load", montrer); photo.addEventListener("error", montrer); }
  }

  // ---------- Consentement aux cookies ----------
  var CLE = "consentement-cookies";
  var ID_GA = "G-HVD2MF3LY9";
  function lireChoix() { try { return localStorage.getItem(CLE); } catch (e) { return null; } }
  function ecrireChoix(v) { try { localStorage.setItem(CLE, v); } catch (e) { /* stockage indisponible */ } }

  var gaCharge = false;
  function chargerGA() {
    if (gaCharge) return;
    gaCharge = true;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + ID_GA;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", ID_GA);
  }

  function afficherAgendas() {
    document.querySelectorAll("iframe[data-src]").forEach(function (f) {
      f.src = f.getAttribute("data-src");
      f.removeAttribute("data-src");
      f.hidden = false;
      var attente = f.parentNode.querySelector(".agenda-consentement");
      if (attente) attente.remove();
    });
  }

  var bandeau = document.querySelector("[data-cookies]");
  function appliquer(choix) {
    if (choix === "oui") { chargerGA(); afficherAgendas(); }
  }
  var choix = lireChoix();
  if (choix) appliquer(choix);
  else if (bandeau) bandeau.hidden = false;

  document.querySelectorAll("[data-cookies-choix]").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = b.getAttribute("data-cookies-choix");
      ecrireChoix(v);
      if (bandeau) bandeau.hidden = true;
      appliquer(v);
      if (v === "non" && gaCharge) window.location.reload();
    });
  });
  document.querySelectorAll("[data-cookies-ouvrir]").forEach(function (b) {
    b.addEventListener("click", function () { if (bandeau) { bandeau.hidden = false; bandeau.querySelector("button").focus(); } });
  });
  document.querySelectorAll("[data-agenda-afficher]").forEach(function (b) {
    b.addEventListener("click", function () { afficherAgendas(); });
  });

  // ---------- Adresse de contact (protégée contre les robots) ----------
  document.querySelectorAll("[data-courriel]").forEach(function (el) {
    var adresse = el.getAttribute("data-courriel").split("").reverse().join("");
    var a = document.createElement("a");
    a.href = "mailto:" + adresse;
    a.textContent = adresse;
    el.textContent = "";
    el.appendChild(a);
  });

  // ---------- Formulaire de demande ----------
  var form = document.querySelector("form[name='demande']");
  if (!form) return;

  var params = new URLSearchParams(window.location.search);
  if (params.get("arrivee") && form.arrivee) form.arrivee.value = params.get("arrivee");

  var prix = null;
  fetch("/assets/data/tarifs.json").then(function (r) { return r.json(); }).then(function (d) { prix = d; estimer(); }).catch(function () {});

  var euros = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  var sortie = form.querySelector("[data-estimation]");

  function nuits() {
    var a = form.arrivee.value, d = form.depart.value;
    if (!a || !d) return null;
    var n = Math.round((new Date(d + "T12:00:00") - new Date(a + "T12:00:00")) / 86400000);
    return n > 0 ? n : null;
  }

  function estimer() {
    if (!sortie || !prix) return;
    var opt = 0;
    var champLits = form.querySelector("#draps_lits");
    var lits = parseInt(champLits.value, 10) || 0;
    if (form.option_draps.checked && lits > 0) opt += lits * prix.options.draps;
    if (form.option_bois.checked) opt += prix.options.bois;
    if (form.option_menage.checked) opt += prix.options.menage;
    var n = nuits();
    var titre, detail;
    var optTxt = opt ? " Options : " + euros.format(opt) + "." : "";
    if (!n) {
      titre = "Indiquez vos dates pour voir une estimation.";
      detail = opt ? "Options choisies : " + euros.format(opt) + "." : "";
    } else if (n === 7) {
      var s = prix.semaine;
      var vals = Object.keys(s).map(function (k) { return s[k]; });
      var mini = Math.min.apply(null, vals), maxi = Math.max.apply(null, vals);
      titre = "Une semaine : de " + euros.format(mini + opt) + " à " + euros.format(maxi + opt) + ", options comprises.";
      detail = "Le prix dépend de la période (intersaison, vacances, fêtes)." + optTxt + " Nous vous confirmons le prix exact dans notre réponse.";
    } else if (n === 2 || n === 1) {
      var we = prix["week-end"].samedi + (n === 2 ? prix["week-end"]["deuxieme-nuit"] : 0);
      titre = (n === 2 ? "Un week-end de 2 nuits : " : "1 nuit : ") + euros.format(we + opt) + ", options comprises.";
      detail = (n === 1 ? "Le séjour minimum est de 2 nuits. " : "") + "Tarif week-end, hors vacances d'hiver et d'été et fêtes de fin d'année." + optTxt + " Nous vous confirmons le prix dans notre réponse.";
    } else {
      titre = n + " nuits : prix sur demande.";
      detail = "Nous vous proposons un prix dans notre réponse, selon la période." + optTxt;
    }
    sortie.innerHTML = "<strong></strong><p></p>";
    sortie.querySelector("strong").textContent = titre;
    sortie.querySelector("p").textContent = detail;
    var cache = form.querySelector("input[name='Estimation affichée']");
    if (cache) cache.value = titre + (detail ? " " + detail : "");
  }
  form.addEventListener("input", estimer);
  form.addEventListener("change", estimer);
  estimer();

  // Validation avec messages en français
  function erreur(champ, msg) {
    var id = champ.id + "-erreur";
    var el = document.getElementById(id);
    if (!el) {
      el = document.createElement("p");
      el.className = "erreur";
      el.id = id;
      (champ.closest(".champ") || champ.parentNode).appendChild(el);
    }
    el.textContent = msg || "";
    el.hidden = !msg;
    if (msg) { champ.setAttribute("aria-invalid", "true"); champ.setAttribute("aria-describedby", id); }
    else champ.removeAttribute("aria-invalid");
  }
  form.addEventListener("submit", function (e) {
    var premier = null;
    function verifier(champ, ok, msg) { erreur(champ, ok ? "" : msg); if (!ok && !premier) premier = champ; }
    verifier(form.nom, form.nom.value.trim().length > 1, "Indiquez votre nom et votre prénom.");
    verifier(form.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.value.trim()), "Indiquez une adresse email valide, par exemple prenom@exemple.fr.");
    verifier(form.arrivee, !!form.arrivee.value, "Choisissez une date d'arrivée.");
    verifier(form.depart, !!form.depart.value && (!form.arrivee.value || nuits()), "Choisissez une date de départ après la date d'arrivée.");
    var p = parseInt(form.personnes.value, 10);
    verifier(form.personnes, p >= 1 && p <= 14, "Indiquez un nombre de personnes entre 1 et 14.");
    var champLits = form.querySelector("#draps_lits");
    var nbLits = parseInt(champLits.value, 10) || 0;
    verifier(champLits, nbLits >= 0 && nbLits <= 10, "Le chalet compte 10 lits : indiquez un nombre entre 0 et 10.");
    verifier(form.cgv, form.cgv.checked, "Pour envoyer votre demande, acceptez les conditions de location.");
    if (premier) { e.preventDefault(); premier.focus(); }
  });
  form.querySelectorAll("input, textarea").forEach(function (c) {
    c.addEventListener("input", function () { if (c.getAttribute("aria-invalid")) erreur(c, ""); });
  });
})();
