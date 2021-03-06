# leaflet_map-interactive

Prototype d'une carte interactive de la ville de Montréal.
La carte présente les patrimoines et les pistes cyclables.

---

## Texte explicatif du sujet

Mon projet a pour sujet les sites et immeubles patrimoniaux, ainsi que les pistes cyclables de la ville de Montréal.

L’idée du sujet est d’avoir une liste de bâtiments intéressants à voir et savoir s’il est possible de s’y rendre en utilisant seulement les pistes cyclables.

De plus, la carte indique des informations pratiques pour un cycliste, telles que les points d’eau, les supports à vélos, les tables à pique-nique et les bancs disponibles sur l’île.

---

## Fonctionnalités

### Échelle

En bas à droite de l'écran, se retrouve l'échelle de la carte ainsi que le contrôle pour augmenter/réduire le zoom.

### Barre de recherche

La barre de recherche se trouve dans le coin supérieur gauche de la carte.

### Icône pour changer de fond de carte

L'icône pour changer le fond de la carte se trouve dans le coin supérieur droit.

### Icône pour changer les couches d'informations

L'icône pour activer/désactiver des couches d'informations se trouve dans le coin supérieur droit.

### Bouton de _toggle_ localisation de l'usager

Les boutons qui permettent d'activer/désactiver la géolocalisation se trouvent dans le centre du _header_.

### Filtre sur la grosseur des patrimoines

Dans la légende, il y a un filtre pour faire apparaître les patrimoines selon leur superficie.

### Affichage de la météo

En mobile, la météo affiche lorsque l'usager appuie sur le bouton 'Afficher Météo'. En desktop, la météo s'affiche en tout temps dans le coin supérieur droit.

---

## Site web réactif

Afin que le site soit « responsive » j'ai utilisé **display:grid** et **display-flex**. De plus, je modifie l'emplacement de la légende pour qu'elle soit sous la carte en mobile et sur la carte en version desktop. Finalement, la météo s'affiche seulement sur demande en mobile.

---

## Objet JavaScript

Le projet regroupe plusieurs objets latéraux, en voici un exemple :

```js
let baseLayers = {
	Gris: fondGris,
	Réaliste: fondImagery,
	Rue: fondRues,
};
```

---

## Source des données

1. [Les patrimoines](https://donnees.montreal.ca/ville-de-montreal/sites-immeubles-proteges-lpc)
2. [Les pistes cyclables](https://donnees.montreal.ca/ville-de-montreal/pistes-cyclables)
3. [Les points d'intérêts](https://donnees.montreal.ca/ville-de-montreal/mobilierurbaingp)
