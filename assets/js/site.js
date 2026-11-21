(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.add("js");
  var LANGUE = (doc.lang || "fr").slice(0, 2);
  if (["fr", "en", "de"].indexOf(LANGUE) < 0) LANGUE = "fr";

  // Textes affichés par le script, dans les 3 langues
  var TEXTES = {
    fr: {
      locale: "fr-FR",
      dates: "Indiquez vos dates pour voir une estimation.",
      optionsChoisies: "Options choisies : {o}.",
      options: " Options : {o}.",
      semaine: "Une semaine : de {a} à {b}, options comprises.",
      semaineDetail: "Le prix dépend de la période (intersaison, vacances, fêtes).{o} Nous vous confirmons le prix exact dans notre réponse.",
      weekend2: "Un week-end de 2 nuits : {p}, options comprises.",
      weekend1: "1 nuit : {p}, options comprises.",
      minimum: "Le séjour minimum est de 2 nuits. ",
      weekendDetail: "Tarif week-end, hors vacances d'hiver et d'été et fêtes de fin d'année.{o} Nous vous confirmons le prix dans notre réponse.",
      autres: "{n} nuits : prix sur demande.",
      autresDetail: "Nous vous proposons un prix dans notre réponse, selon la période.{o}",
      errNom: "Indiquez votre nom et votre prénom.",
      errEmail: "Indiquez une adresse email valide, par exemple prenom@exemple.fr.",
      errArrivee: "Choisissez une date d'arrivée.",
      errDepart: "Choisissez une date de départ après la date d'arrivée.",
      errPersonnes: "Indiquez un nombre de personnes entre 1 et 14.",
      errLits: "Le chalet compte 10 lits : indiquez un nombre entre 0 et 10.",
      errCgv: "Pour envoyer votre demande, acceptez les conditions de location."
    },
    en: {
      locale: "en-GB",
      dates: "Enter your dates to see an estimate.",
      optionsChoisies: "Selected extras: {o}.",
      options: " Extras: {o}.",
      semaine: "One week: from {a} to {b}, extras included.",
      semaineDetail: "The price depends on the time of year (off-season, school holidays, Christmas and New Year).{o} We confirm the exact price in our reply.",
      weekend2: "A 2-night weekend: {p}, extras included.",
      weekend1: "1 night: {p}, extras included.",
      minimum: "The minimum stay is 2 nights. ",
      weekendDetail: "Weekend rate, outside the French winter and summer school holidays, Christmas and New Year.{o} We confirm the price in our reply.",
      autres: "{n} nights: price on request.",
      autresDetail: "We will quote a price in our reply, depending on the time of year.{o}",
      errNom: "Please enter your full name.",
      errEmail: "Please enter a valid email address, for example name@example.com.",
      errArrivee: "Please choose an arrival date.",
      errDepart: "Please choose a departure date after your arrival date.",
      errPersonnes: "Please enter a number of guests between 1 and 14.",
      errLits: "The chalet has 10 beds: please enter a number between 0 and 10.",
      errCgv: "To send your request, please accept the terms and conditions."
    },
    de: {
      locale: "de-DE",
      dates: "Geben Sie Ihre Reisedaten ein, um eine Preisschätzung zu sehen.",
      optionsChoisies: "Gewählte Extras: {o}.",
      options: " Extras: {o}.",
      semaine: "Eine Woche: {a} bis {b}, Extras inklusive.",
      semaineDetail: "Der Preis hängt vom Zeitraum ab (Nebensaison, Schulferien, Weihnachten und Neujahr).{o} Den genauen Preis bestätigen wir Ihnen in unserer Antwort.",
      weekend2: "Ein Wochenende mit 2 Nächten: {p}, Extras inklusive.",
      weekend1: "1 Nacht: {p}, Extras inklusive.",
      minimum: "Der Mindestaufenthalt beträgt 2 Nächte. ",
      weekendDetail: "Wochenendpreis, außerhalb der französischen Winter- und Sommerferien sowie Weihnachten und Neujahr.{o} Den Preis bestätigen wir Ihnen in unserer Antwort.",
      autres: "{n} Nächte: Preis auf Anfrage.",
      autresDetail: "Wir nennen Ihnen in unserer Antwort einen Preis, je nach Zeitraum.{o}",
      errNom: "Bitte geben Sie Ihren Vor- und Nachnamen ein.",
      errEmail: "Bitte geben Sie eine gültige E-Mail-Adresse ein, zum Beispiel name@beispiel.de.",
      errArrivee: "Bitte wählen Sie ein Anreisedatum.",
      errDepart: "Bitte wählen Sie ein Abreisedatum nach dem Anreisedatum.",
      errPersonnes: "Bitte geben Sie eine Personenzahl zwischen 1 und 14 ein.",
      errLits: "Das Chalet hat 10 Betten: Bitte geben Sie eine Zahl zwischen 0 und 10 ein.",
      errCgv: "Um Ihre Anfrage zu senden, akzeptieren Sie bitte die Mietbedingungen."
    }
  };
  var T = TEXTES[LANGUE];
  function txt(cle, v) {
    return T[cle].replace(/\{(\w)\}/g, function (_, k) { return v && v[k] !== undefined ? v[k] : ""; });
  }

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

  var bandeau = document.querySelector("[data-cookies]");
  function appliquer(choix) {
    if (choix === "oui") chargerGA();
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

  var euros = new Intl.NumberFormat(T.locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
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
    var optTxt = opt ? txt("options", { o: euros.format(opt) }) : "";
    if (!n) {
      titre = txt("dates");
      detail = opt ? txt("optionsChoisies", { o: euros.format(opt) }) : "";
    } else if (n === 7) {
      var s = prix.semaine;
      var vals = Object.keys(s).map(function (k) { return s[k]; });
      var mini = Math.min.apply(null, vals), maxi = Math.max.apply(null, vals);
      titre = txt("semaine", { a: euros.format(mini + opt), b: euros.format(maxi + opt) });
      detail = txt("semaineDetail", { o: optTxt });
    } else if (n === 2 || n === 1) {
      var we = prix["week-end"].samedi + (n === 2 ? prix["week-end"]["deuxieme-nuit"] : 0);
      titre = txt(n === 2 ? "weekend2" : "weekend1", { p: euros.format(we + opt) });
      detail = (n === 1 ? txt("minimum") : "") + txt("weekendDetail", { o: optTxt });
    } else {
      titre = txt("autres", { n: n });
      detail = txt("autresDetail", { o: optTxt });
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

  // Validation avec messages dans la langue de la page
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
    verifier(form.nom, form.nom.value.trim().length > 1, txt("errNom"));
    verifier(form.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.value.trim()), txt("errEmail"));
    verifier(form.arrivee, !!form.arrivee.value, txt("errArrivee"));
    verifier(form.depart, !!form.depart.value && (!form.arrivee.value || nuits()), txt("errDepart"));
    var p = parseInt(form.personnes.value, 10);
    verifier(form.personnes, p >= 1 && p <= 14, txt("errPersonnes"));
    var champLits = form.querySelector("#draps_lits");
    var nbLits = parseInt(champLits.value, 10) || 0;
    verifier(champLits, nbLits >= 0 && nbLits <= 10, txt("errLits"));
    verifier(form.cgv, form.cgv.checked, txt("errCgv"));
    if (premier) { e.preventDefault(); premier.focus(); }
  });
  form.querySelectorAll("input, textarea").forEach(function (c) {
    c.addEventListener("input", function () { if (c.getAttribute("aria-invalid")) erreur(c, ""); });
  });
})();
