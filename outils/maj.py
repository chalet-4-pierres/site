#!/usr/bin/env python3
"""Met à jour toutes les pages du site.

1. Recopie l'en-tête et le pied de page (outils/morceaux/) dans chaque page,
   entre les repères <!-- debut:xxx --> et <!-- fin:xxx -->.
2. Remplace chaque prix marqué data-prix="cle" par la valeur de
   assets/data/tarifs.json, et remplit les attributs data-modele
   (ex. la description Google) avec les mêmes valeurs.

Usage : python3 outils/maj.py
"""
import json, re, pathlib

RACINE = pathlib.Path(__file__).resolve().parent.parent
MORCEAUX = RACINE / "outils" / "morceaux"


def euros(n):
    return f"{n:,}".replace(",", " ") + " €"


def valeurs():
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
    return {k: euros(p) for k, p in v.items()}


def page_courante(chemin):
    rel = chemin.relative_to(RACINE).as_posix()
    return "/" if rel == "index.html" else "/" + rel.rsplit("index.html", 1)[0]


def traiter(chemin, prix):
    t = chemin.read_text(encoding="utf-8")
    for nom in ("entete", "pied"):
        morceau = (MORCEAUX / f"{nom}.html").read_text(encoding="utf-8").rstrip()
        url = page_courante(chemin)
        morceau = morceau.replace(f'href="{url}"', f'href="{url}" aria-current="page"', 1) if url != "/" else morceau
        t = re.sub(rf"(<!-- debut:{nom} -->).*?(<!-- fin:{nom} -->)",
                   lambda m: m.group(1) + "\n  " + morceau + "\n  " + m.group(2), t, flags=re.S)

    def rempl_texte(m):
        cle = m.group(2)
        if cle not in prix:
            raise SystemExit(f"{chemin}: prix inconnu « {cle} »")
        return m.group(1) + prix[cle] + m.group(3)
    t = re.sub(r'(<[^>]*\bdata-prix="([^"]+)"[^>]*>)[^<]*(</)', rempl_texte, t)

    def rempl_modele(m):
        modele = m.group(2)
        texte = re.sub(r"\{([a-z0-9-]+)\}", lambda x: prix[x.group(1)], modele)
        return m.group(1) + texte + m.group(3)
    t = re.sub(r'(<meta[^>]*\bdata-modele="([^"]+)"[^>]*\bcontent=")[^"]*(")', rempl_modele, t)
    chemin.write_text(t, encoding="utf-8")


if __name__ == "__main__":
    prix = valeurs()
    pages = [p for p in RACINE.rglob("index.html") if "outils" not in p.parts and ".impeccable" not in p.parts]
    for p in pages:
        traiter(p, prix)
        print("à jour :", p.relative_to(RACINE))
