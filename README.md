# Multimilliardaire.com

Landing page statique prête à déployer sur GitHub Pages, Railway, Netlify, Vercel ou n'importe quel hébergement HTTP.

## Fonctionnalités

- Classement mondial dynamique
- Définition par défaut : fortune >= 2 milliards USD
- Recherche par nom / business
- Filtres pays, secteur, fortune minimale
- Pagination de 50 résultats
- Rang, fortune, source de richesse, secteur, pays, variation
- Statistiques calculées en direct
- Responsive mobile
- SEO complet : title, description, canonical, Open Graph, JSON-LD
- favicon, image OG, robots.txt, sitemap.xml, page 404
- fallback embarqué sur le Top 20 si la source distante est indisponible

## Source de données

Endpoint utilisé :


Les données sont des estimations et peuvent être décalées par rapport au classement Forbes en temps réel. Le site affiche la date de la dernière donnée reçue.

## Déploiement

Commit tous les fichiers à la racine du repo. Il n'y a aucune étape de build et aucune dépendance npm.

Pour GitHub Pages : Settings > Pages > Deploy from a branch > `main` / root.

Pour Railway / autre serveur statique : servir simplement le dossier racine.


## Guides SEO des montants

- /1-million-euros/
- /10-millions-euros/
- /100-millions-euros/
- /1-milliard-euros/
- /10-milliards-euros/
- /100-milliards-euros/

## Design (refonte du 19 novembre 2026)

- Polices auto-hébergées dans `fonts/` (licence OFL) : Instrument Serif
  pour les titres et les montants, Geist pour l'interface.
- Couleurs et tailles : jetons en tête de `style.css` (`--ink`, `--gold`,
  `--foil`…). `guide.css` ne contient que les composants des guides.
- Motif guilloché (rosaces de billet de banque) : généré par
  `navigation.js` derrière la carte du n°1 et les encadrés « réponse » /
  « montant » des guides. Aucune image à charger.
- Classement : chaque ligne porte une barre proportionnelle à la fortune
  du n°1 (`script.js`, `.worth-bar`).
- Les fichiers CSS et JS sont appelés avec `?v=2`. Après une modification,
  change ce numéro dans les pages pour que les visiteurs aient la
  nouvelle version.
