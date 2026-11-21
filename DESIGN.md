---
name: Le Chalet des Quatre Pierres
description: Site du chalet, clair et aéré, chaleureux par touches d'orange.
colors:
  orange-four: "#b4531d"
  orange-four-fonce: "#95431a"
  abricot: "#e07a3f"
  neige: "#fafaf8"
  blanc: "#ffffff"
  granite: "#eeedea"
  filet-pierre: "#e4e1dc"
  contour-bouton: "#cfc8c1"
  anthracite: "#2e2a27"
  brun-gris: "#5f5852"
typography:
  display:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "clamp(2.2rem, 1.4rem + 2.6vw, 3.5rem)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "clamp(1.6rem, 1.25rem + 1.2vw, 2.25rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.005em"
  body:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "clamp(1rem, 0.97rem + 0.15vw, 1.0625rem)"
    fontWeight: 400
    lineHeight: 1.65
  intro:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 600
    lineHeight: 1.4
rounded:
  carte: "16px"
  petit: "10px"
  pilule: "999px"
spacing:
  marge: "clamp(1.25rem, 4vw, 3rem)"
  page: "1180px"
  section: "clamp(3rem, 6vw, 5.5rem)"
  groupe: "1.5rem"
  ligne: "0.85rem"
components:
  button-primary:
    backgroundColor: "{colors.orange-four}"
    textColor: "{colors.blanc}"
    typography: "{typography.label}"
    rounded: "{rounded.pilule}"
    padding: "12px 22px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.orange-four-fonce}"
    textColor: "{colors.blanc}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.anthracite}"
    typography: "{typography.label}"
    rounded: "{rounded.pilule}"
    padding: "12px 22px"
    height: "48px"
  panel:
    backgroundColor: "{colors.blanc}"
    rounded: "{rounded.carte}"
    padding: "clamp(1.5rem, 3vw, 2.25rem)"
  photo:
    rounded: "{rounded.carte}"
---

# Design System: Le Chalet des Quatre Pierres

## Overview

**Creative North Star: "La maison claire au bout du chemin"**

Le site ressemble au chalet un matin d'été : beaucoup de lumière, du blanc chaud, et la chaleur qui vient du bois et des photos, pas des aplats de couleur. La page respire. Un titre, une phrase, une photo, un bouton. L'orange ne sert qu'à dire « c'est ici qu'on agit » et à signer la marque.

La propriétaire a refusé une première version jugée lourde : grands aplats orange et bois, capitales condensées, chalet dessiné en coupe. Elle a validé la version claire, ronde et chaleureuse décrite ici. Les visiteurs (familles réunies, groupes d'amis) comparent avec les grandes plateformes de location : le site doit être aussi simple à lire qu'elles, en plus personnel.

**Key Characteristics:**
- Fond blanc chaud très clair, panneaux blancs, filets gris pierre.
- Une seule police, Figtree, titres en minuscules et graisse 600.
- Orange soutenu pour les boutons pleins, abricot pour le logo et les petits triangles.
- Vraies photos du chalet, coins arrondis, jamais en plein écran.
- Aucune ombre au repos, sauf le menu déroulant sur téléphone.

## Colors

Une palette neutre et lumineuse, réchauffée par deux orange utilisés avec parcimonie.

### Primary
- **Orange des Quatre Pierres** (orange-four) : fond des boutons d'action (« Faire une demande »), avec texte blanc. Contraste d'environ 5:1. Sert aussi à l'anneau de focus clavier, au total du week-end et au lien survolé.
- **Orange brûlé** (orange-four-fonce) : survol des boutons pleins uniquement.

### Secondary
- **Abricot du Pointu** (abricot) : le triangle du logo et les petits triangles des listes. Jamais sous du texte, car son contraste sur fond clair est trop faible (environ 3:1).

### Neutral
- **Neige** (neige) : fond de toutes les pages.
- **Blanc** (blanc) : panneaux (chiffres, week-end, réserver, agenda) posés sur la neige.
- **Granite** (granite) : survol des liens dans le menu mobile.
- **Filet pierre** (filet-pierre) : traits de séparation entre sections et entre lignes de listes ou de tableaux.
- **Contour bouton** (contour-bouton) : bordure des boutons secondaires au repos.
- **Anthracite** (anthracite) : titres et texte principal.
- **Brun gris** (brun-gris) : texte secondaire (introductions, descriptions, notes, pied de page). Contraste d'environ 6,7:1 sur la neige.

### Named Rules
**La règle de l'orange qui agit.** L'orange soutenu est réservé aux actions et à l'état actif. Un bloc, un fond de section ou un titre en orange est hors système.

**La règle de l'abricot qui signe.** L'abricot signe la marque (logo, triangles de liste). Il ne porte jamais de texte.

## Typography

**Display Font:** Figtree (avec system-ui, sans-serif), hébergée sur le site en police variable, sous-ensembles latin et latin étendu.
**Body Font:** Figtree.

**Character:** une linéale ronde, simple et très lisible, qui donne un ton amical sans être enfantin.

### Hierarchy
- **Display** (600, clamp(2.2rem → 3.5rem), 1.08) : le titre de chaque page (h1), en minuscules, équilibré sur plusieurs lignes.
- **Headline** (600, clamp(1.6rem → 2.25rem), 1.15) : titres de sections (h2). Les titres de colonnes des pages intérieures descendent à clamp(1.3rem → 1.6rem).
- **Title** (600, 1.15rem, 1.3) : sous-titres (h3), par exemple « Manger à deux pas ».
- **Intro** (400, 1.15rem, 1.65) : la phrase d'introduction sous le titre, en brun gris, 44 à 52 caractères de large. Elle passe à 1.05rem sous 640 px.
- **Body** (400, 1rem à 1.0625rem, 1.65) : texte courant, 66 caractères de large au plus.
- **Label** (600, 0.95rem à 1rem) : boutons, titres du pied de page, termes mis en gras dans les listes.

### Named Rules
**La règle des minuscules.** Les titres s'écrivent comme des phrases, jamais en capitales.

**La règle de l'espace insécable.** Un nombre ne se sépare jamais de son unité (240 m², 8 km, 16 h, 2 nuits, 1 700 €). Les noms propres courts restent groupés (Quatre Pierres, au cœur).

**La règle des chiffres alignés.** Les prix s'affichent en chiffres tabulaires, alignés à droite.

## Layout

Une colonne centrée de 1 180 px au plus, avec des marges latérales de clamp(1.25rem, 4vw, 3rem). Les sections sont espacées de clamp(3rem, 6vw, 5.5rem) et séparées par un filet pierre.

Les ouvertures de page sont en deux colonnes sur ordinateur : texte à gauche, photo à droite pour l'accueil. Les sections de contenu utilisent deux colonnes (points forts et chiffres, prix à la semaine et week-end) ou trois (options, arrivée, paiement).

Tout passe sur une colonne sous 960 px. Les galeries passent de 4 à 2 photos par ligne. Les boutons s'élargissent sous 640 px. Les titres de colonnes voisines partent à la même hauteur.

## Elevation & Depth

Le système est plat. La profondeur vient du contraste entre la neige du fond et le blanc des panneaux, et des filets pierre. La seule ombre est celle du menu déroulant mobile, qui flotte au-dessus de la page.

### Shadow Vocabulary
- **Menu flottant** (`box-shadow: 0 12px 32px rgb(46 42 39 / 0.14)`) : uniquement le menu ouvert sur téléphone.

### Named Rules
**La règle du plat au repos.** Aucune carte, aucun bouton, aucune photo n'a d'ombre.

## Shapes

Les panneaux et les photos ont des coins de 16 px, les liens du menu mobile de 10 px. Les boutons sont des pilules. Le triangle est la seule forme de marque : le logo (triangle abricot et quatre carrés blancs aux coins adoucis) et les puces de liste.

## Components

### Buttons
- **Shape:** pilule (999px), hauteur minimale 48 px.
- **Primary:** fond orange des Quatre Pierres, texte blanc en Label. Un seul par bloc en général, toujours pour « Faire une demande ».
- **Hover / Focus:** fond orange brûlé au survol, transition de 0,25 s. Anneau de focus orange de 3 px, décalé de 3 px.
- **Secondary:** fond transparent, bordure contour bouton de 1,5 px, texte anthracite. Au survol, la bordure devient anthracite. Sert à « Voir les disponibilités » et aux liens de navigation entre pages.

### Cards / Containers
- **Corner Style:** 16 px.
- **Background:** blanc sur fond neige.
- **Shadow Strategy:** aucune (voir Elevation & Depth).
- **Border:** aucune. Les séparations internes sont des filets pierre.
- **Internal Padding:** clamp(1.5rem, 3vw, 2.25rem) pour les panneaux, jusqu'à 3rem pour le bloc « Réserver en direct ».

### Navigation
- **En-tête :** logo et nom à gauche, liens en graisse 500 à droite, puis le bouton plein « Faire une demande ». La page en cours est en orange.
- **Mobile (sous 960 px) :** un bouton secondaire « Menu » ouvre une liste blanche flottante. Sans JavaScript, les liens restent visibles et passent à la ligne.

### Listes de faits
Le cœur de l'information du site. Il y en a deux formes :
- liste à puces triangulaires abricot, avec un terme en gras suivi d'une phrase en brun gris ;
- lignes « libellé / valeur » séparées par des filets pierre, avec la valeur en graisse 600, alignée à droite pour les prix.

### Tableau des prix
Pleine largeur, période à gauche, prix à droite en chiffres tabulaires, filets pierre entre les lignes, en-tête en brun gris.

### Photos
Vraies photos du chalet, coins de 16 px, cadrées par `object-fit: cover` (5:4 en ouverture, 4:5 en galerie). Elles sont légèrement agrandies au survol quand elles servent de lien.

## Do's and Don'ts

### Do:
- **Do** garder le fond neige et poser l'information dans des panneaux blancs ou entre des filets pierre.
- **Do** réserver l'orange soutenu aux actions (boutons pleins, focus, état actif), avec du texte blanc.
- **Do** écrire les titres en minuscules, en Figtree 600, et mettre des espaces insécables entre les nombres et leurs unités.
- **Do** utiliser de vraies photos du chalet, arrondies à 16 px.
- **Do** faire lire tous les prix dans `assets/data/tarifs.json` via `outils/maj.py`, jamais en dur.

### Don't:
- **Don't** utiliser de grands aplats orange ou bois, ni de vert sapin : la propriétaire les a trouvés lourds.
- **Don't** écrire les titres en capitales, ni utiliser de police condensée.
- **Don't** ajouter de schémas décoratifs (comme le chalet dessiné en coupe), déjà essayés et refusés.
- **Don't** mettre du texte en abricot ni du texte foncé sur un bouton orange.
- **Don't** afficher de dates précises de périodes : elles changent chaque année.
