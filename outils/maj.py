#!/usr/bin/env python3
"""Met à jour toutes les pages du site (français, anglais, allemand, néerlandais).

1. Recopie l'en-tête et le pied de page de la bonne langue (outils/morceaux/)
   dans chaque page, entre les repères <!-- debut:xxx --> et <!-- fin:xxx -->,
   avec le sélecteur de langue qui pointe vers la même page dans les autres langues.
2. Ajoute dans <head> les liens hreflang vers les versions traduites.
3. Remplace chaque prix marqué data-prix="cle" par la valeur de
   assets/data/tarifs.json (au format de la langue), et remplit les
   attributs data-modele (ex. la description Google).
4. Génère les données structurées (FAQ, chalet) et le sitemap.xml.

Pour ajouter une page : l'ajouter dans PAGES ci-dessous, dans les 3 langues.

Usage : python3 outils/maj.py
"""
import json, re, pathlib, datetime, html as _h

RACINE = pathlib.Path(__file__).resolve().parent.parent
MORCEAUX = RACINE / "outils" / "morceaux"
SITE = "https://www.chalet-4-pierres-location.fr"
LANGUES = ("fr", "en", "de", "nl")
NOMS = {"fr": "Français", "en": "English", "de": "Deutsch", "nl": "Nederlands"}

# Chaque page dans les 4 langues : (fr, en, de, nl, dans le sitemap ?).
PAGES = {
    "accueil":    ("/", "/en/", "/de/", "/nl/", True),
    "chalet":     ("/le-chalet/", "/en/the-chalet/", "/de/das-chalet/", "/nl/het-chalet/", True),
    "tarifs":     ("/tarifs/", "/en/rates/", "/de/preise/", "/nl/prijzen/", True),
    "reserver":   ("/reserver/", "/en/booking/", "/de/anfrage/", "/nl/aanvraag/", True),
    "venir":      ("/venir/", "/en/getting-here/", "/de/anreise/", "/nl/route/", True),
    "hiver":      ("/hiver/", "/en/winter/", "/de/winter/", "/nl/winter/", True),
    "ete":        ("/ete/", "/en/summer/", "/de/sommer/", "/nl/zomer/", True),
    "questions":  ("/questions/", "/en/faq/", "/de/fragen/", "/nl/vragen/", True),
    "conditions": ("/conditions/", "/en/terms/", "/de/mietbedingungen/", "/nl/huurvoorwaarden/", True),
    "mentions":   ("/mentions-legales/", "/en/legal-notice/", "/de/impressum/", "/nl/juridische-informatie/", True),
    "merci":      ("/merci/", "/en/thank-you/", "/de/danke/", "/nl/bedankt/", False),
}
PAR_URL = {}
for cle, (*urls, _) in PAGES.items():
    for lg, url in zip(LANGUES, urls):
        PAR_URL[url] = (cle, lg)


def euros(n, lg):
    if lg == "en":
        return f"€{n:,}"
    if lg == "de":
        return f"{n:,}".replace(",", ".") + " €"
    if lg == "nl":
        return "€ " + f"{n:,}".replace(",", ".")
    return f"{n:,}".replace(",", " ") + " €"


def valeurs(lg):
    d = json.loads((RACINE / "assets/data/tarifs.json").read_text(encoding="utf-8"))
    v = {}
    for k, p in d["semaine"].items():
        v[f"semaine-{k}"] = p
    v["semaine-min"] = min(d["semaine"].values())
    v["semaine-max"] = max(d["semaine"].values())
    v["weekend-samedi"] = d["week-end"]["samedi"]
    v["weekend-deuxieme-nuit"] = d["week-end"]["deuxieme-nuit"]
    v["weekend-total"] = d["week-end"]["samedi"] + d["week-end"]["deuxieme-nuit"]
    for k, p in d["options"].items():
        v[f"option-{k}"] = p
    v["acompte"] = d["acompte"]
    return {k: euros(p, lg) for k, p in v.items()}


def page_courante(chemin):
    rel = chemin.relative_to(RACINE).as_posix()
    return "/" if rel == "index.html" else "/" + rel.rsplit("index.html", 1)[0]


def langue_de(chemin):
    rel = chemin.relative_to(RACINE).as_posix()
    return rel[:2] if rel[:3] in ("en/", "de/", "nl/") else "fr"


def selecteur(url, lg):
    cle = PAR_URL.get(url, (None,))[0]
    liens = []
    for autre in LANGUES:
        cible = PAGES[cle][LANGUES.index(autre)] if cle else ("/" if autre == "fr" else f"/{autre}/")
        courant = ' aria-current="true"' if autre == lg else ""
        liens.append(f'<li><a href="{cible}" hreflang="{autre}" lang="{autre}" title="{NOMS[autre]}"{courant}>{autre.upper()}</a></li>')
    etiquette = {"fr": "Langue", "en": "Language", "de": "Sprache", "nl": "Taal"}[lg]
    return f'<ul class="langues" aria-label="{etiquette}">' + "".join(liens) + "</ul>"


def alternates(url):
    cle = PAR_URL.get(url, (None,))[0]
    if not cle:
        return ""
    urls = PAGES[cle][:4]
    lignes = [f'<link rel="alternate" hreflang="{lg}" href="{SITE}{u}">' for lg, u in zip(LANGUES, urls)]
    lignes.append(f'<link rel="alternate" hreflang="x-default" href="{SITE}{urls[0]}">')
    return "\n  ".join(lignes)


def traiter(chemin, prix):
    t = chemin.read_text(encoding="utf-8")
    lg = langue_de(chemin)
    url = page_courante(chemin) if chemin.name == "index.html" else None
    for nom in ("entete", "pied"):
        morceau = (MORCEAUX / f"{nom}.{lg}.html").read_text(encoding="utf-8").rstrip()
        if url and url not in ("/", "/en/", "/de/"):
            morceau = morceau.replace(f'href="{url}"', f'href="{url}" aria-current="page"', 1)
        morceau = morceau.replace("<!-- langues -->", selecteur(url, lg))
        t = re.sub(rf"(<!-- debut:{nom} -->).*?(<!-- fin:{nom} -->)",
                   lambda m: m.group(1) + "\n  " + morceau + "\n  " + m.group(2), t, flags=re.S)

    if url and "<!-- debut:langues -->" in t:
        t = re.sub(r"(<!-- debut:langues -->).*?(<!-- fin:langues -->)",
                   lambda m: m.group(1) + "\n  " + alternates(url) + "\n  " + m.group(2), t, flags=re.S)

    p = prix[lg]

    def rempl_texte(m):
        cle = m.group(2)
        if cle not in p:
            raise SystemExit(f"{chemin}: prix inconnu « {cle} »")
        return m.group(1) + p[cle] + m.group(3)
    t = re.sub(r'(<[^>]*\bdata-prix="([^"]+)"[^>]*>)[^<]*(</)', rempl_texte, t)

    def rempl_modele(m):
        texte = re.sub(r"\{([a-z0-9-]+)\}", lambda x: p[x.group(1)], m.group(2))
        return m.group(1) + texte + m.group(3)
    t = re.sub(r'(<meta[^>]*\bdata-modele="([^"]+)"[^>]*\bcontent=")[^"]*(")', rempl_modele, t)
    t = donnees_structurees(t, p, lg)
    chemin.write_text(t, encoding="utf-8")


def texte_brut(fragment):
    return " ".join(_h.unescape(re.sub(r"<[^>]+>", "", fragment)).split())


def bloc_ld(objet):
    return '<script type="application/ld+json">' + json.dumps(objet, ensure_ascii=False, indent=1) + "</script>"


CHALET = {
    "fr": {
        "description": "Chalet écologique en bois massif de 240 m² pour 14 personnes au Grand Valtin, à 8 km de Gérardmer. 6 chambres, une salle d'eau et des WC à chaque étage.",
        "semaine": "la semaine",
        "equipements": ["Wifi", "Poêle à bois", "Lave-vaisselle", "Lave-linge", "Sèche-linge", "Terrasse", "Local à skis", "Lit bébé"],
        "etoiles": "Meublé de tourisme classé 4 étoiles",
    },
    "en": {
        "description": "Eco-friendly solid wood chalet of 240 m² for 14 people in Grand Valtin, 8 km from Gérardmer in the Vosges mountains, France. 6 bedrooms, a shower room and toilet on every floor.",
        "semaine": "per week",
        "equipements": ["Wi-Fi", "Wood-burning stove", "Dishwasher", "Washing machine", "Tumble dryer", "Terrace", "Ski storage", "Baby cot"],
        "etoiles": "Officially rated 4-star holiday rental",
    },
    "de": {
        "description": "Ökologisches Chalet aus Massivholz, 240 m² für 14 Personen in Grand Valtin, 8 km von Gérardmer in den Vogesen, Frankreich. 6 Schlafzimmer, Duschbad und WC auf jeder Etage.",
        "semaine": "pro Woche",
        "equipements": ["WLAN", "Holzofen", "Geschirrspüler", "Waschmaschine", "Wäschetrockner", "Terrasse", "Skiraum", "Babybett"],
        "etoiles": "Offiziell mit 4 Sternen klassifizierte Ferienunterkunft",
    },
    "nl": {
        "description": "Ecologisch chalet van massief hout, 240 m² voor 14 personen in Grand Valtin, op 8 km van Gérardmer in de Vogezen, Frankrijk. 6 slaapkamers, een badkamer en toilet op elke verdieping.",
        "semaine": "per week",
        "equipements": ["Wifi", "Houtkachel", "Vaatwasser", "Wasmachine", "Droger", "Terras", "Skiruimte", "Babybedje"],
        "etoiles": "Officieel geclassificeerd vakantiehuis met 4 sterren",
    },
}


def donnees_structurees(t, p, lg):
    if "<!-- debut:ld-faq -->" in t:
        paires = re.findall(r"<div><dt>(.*?)</dt><dd>(.*?)</dd></div>", t, flags=re.S)
        faq = {"@context": "https://schema.org", "@type": "FAQPage", "inLanguage": lg, "mainEntity": [
            {"@type": "Question", "name": texte_brut(q), "acceptedAnswer": {"@type": "Answer", "text": texte_brut(r)}} for q, r in paires]}
        t = re.sub(r"(<!-- debut:ld-faq -->).*?(<!-- fin:ld-faq -->)", lambda m: m.group(1) + "\n  " + bloc_ld(faq) + "\n  " + m.group(2), t, flags=re.S)
    if "<!-- debut:ld-chalet -->" in t:
        c = CHALET[lg]
        chalet = {
            "@context": "https://schema.org", "@type": "LodgingBusiness",
            "name": "Le Chalet des Quatre Pierres",
            "alternateName": "Le Pointu",
            "description": c["description"],
            "url": SITE + PAGES["accueil"][LANGUES.index(lg)],
            "image": [SITE + "/assets/img/vue-terrasse-1600.webp", SITE + "/assets/img/chalet-ete-900.webp"],
            "address": {"@type": "PostalAddress", "streetAddress": "Chemin de Sérichamp, hameau du Grand Valtin", "postalCode": "88230", "addressLocality": "Ban-sur-Meurthe-Clefcy", "addressRegion": "Vosges", "addressCountry": "FR"},
            "geo": {"@type": "GeoCoordinates", "latitude": 48.0964, "longitude": 6.9942},
            "numberOfRooms": 6,
            "petsAllowed": True,
            "checkinTime": "16:00", "checkoutTime": "10:00",
            "priceRange": p["semaine-min"] + " – " + p["semaine-max"] + " " + c["semaine"],
            "amenityFeature": [{"@type": "LocationFeatureSpecification", "name": n, "value": True} for n in c["equipements"]],
            "starRating": {"@type": "Rating", "ratingValue": "4", "bestRating": "5", "name": c["etoiles"]},
        }
        t = re.sub(r"(<!-- debut:ld-chalet -->).*?(<!-- fin:ld-chalet -->)", lambda m: m.group(1) + "\n  " + bloc_ld(chalet) + "\n  " + m.group(2), t, flags=re.S)
    return t


def sitemap():
    jour = datetime.date.today().isoformat()
    lignes = ['<?xml version="1.0" encoding="UTF-8"?>',
              '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">']
    for cle, (*urls, indexer) in PAGES.items():
        if not indexer:
            continue
        for u in urls:
            lignes.append(f"  <url><loc>{SITE}{u}</loc><lastmod>{jour}</lastmod>")
            for lg, v in zip(LANGUES, urls):
                lignes.append(f'    <xhtml:link rel="alternate" hreflang="{lg}" href="{SITE}{v}"/>')
            lignes.append(f'    <xhtml:link rel="alternate" hreflang="x-default" href="{SITE}{urls[0]}"/>')
            lignes.append("  </url>")
    lignes.append("</urlset>")
    (RACINE / "sitemap.xml").write_text("\n".join(lignes) + "\n", encoding="utf-8")


if __name__ == "__main__":
    prix = {lg: valeurs(lg) for lg in LANGUES}
    pages = [p for p in RACINE.rglob("index.html") if "outils" not in p.parts and ".impeccable" not in p.parts]
    pages += [p for p in (RACINE / "404.html", RACINE / "en/404.html", RACINE / "de/404.html", RACINE / "nl/404.html") if p.exists()]
    for p in sorted(pages):
        traiter(p, prix)
        print("à jour :", p.relative_to(RACINE))
    sitemap()
    print("à jour : sitemap.xml")
