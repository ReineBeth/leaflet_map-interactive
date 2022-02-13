const maCarte = L.map('map', {
	zoomControl: false,
	attributionControl: false,
	maxZoom: 20,
}).setView([45.51, -73.68], 10.5);

// Sélection de couches
const fondGris = L.esri.Vector.vectorBasemapLayer('ArcGIS:LightGray', {
	apikey: apiKey,
});

const fondRues = L.esri.Vector.vectorBasemapLayer('ArcGIS:Streets', {
	apikey: apiKey,
});

const fondImagery = L.esri.Vector.vectorBasemapLayer('ArcGIS:Imagery', {
	apikey: apiKey,
});

fondGris.addTo(maCarte);

let baseLayers = {
	Gris: fondGris,
	Réaliste: fondImagery,
	Rue: fondRues,
};

/*Les couches d'informations*/

let groupeInformations = L.layerGroup().addTo(maCarte);

/* Patrimoines */

const urlPatrimoines =
	'https://services6.arcgis.com/pG4MNR4EC4WmfCRT/ArcGIS/rest/services/PatrimoineLPC/FeatureServer/0';

const couchePatrimoines = L.esri
	.featureLayer({
		style(feature) {
			return {
				color: '#154077',
			};
		},
		url: urlPatrimoines,
	})
	.bindPopup(function (layer) {
		return `<h3>${layer.feature.properties.Nom}</h3> <br>
				<a href="${layer.feature.properties.lien_web}" target="_blank">Liens vers le site web</a>`;
	})
	.addTo(groupeInformations);

/* Piste cyclable */
const coucheCyclables = L.geoJSON(pisteCyclables, {
	style: function (feature) {
		let est4Saison = feature.properties.SAISONS4;
		let color;
		switch (est4Saison) {
			case 'OUI':
				color = '#56DBCA';
				break;
			case 'NON':
				color = '#CC70D6';
				break;
			default:
				color = '#AAD266';
		}
		return {
			color: color,
			opacity: 0.65,
			weight: 2,
		};
	},
})
	.bindPopup(function (layer) {
		let nombreVoie;
		let typePrincipale;
		let longueurVoie = layer.feature.properties.LONGUEUR / 100;
		let nomArrondissement = layer.feature.properties.NOM_ARR_VI;

		if (layer.feature.properties.NBR_VOIE == 1) {
			nombreVoie = 'Unidirectionnel';
		} else {
			nombreVoie = 'Bidirectionnel';
		}

		switch (layer.feature.properties.TYPE_VOIE) {
			case 1:
				typePrincipale = 'Chaussée désignée';
				break;
			case 2:
				typePrincipale = 'Accotement asphalté';
				break;
			case 3:
				typePrincipale = 'Bande cyclable';
				break;
			case 4:
				typePrincipale = 'Piste cyclable sur rue';
				break;
			case 5:
				typePrincipale = 'Piste cyclable en site propre';
				break;
			case 6:
				typePrincipale = 'Piste cyclable au niveau du trottoir';
				break;
			case 7:
				typePrincipale = 'Sentier polyvalent';
				break;
			case 8:
				typePrincipale = 'Vélo-rue';
				break;
			case 9:
				typePrincipale = 'Voie partagée Bus-Vélo';
				break;
			default:
				typePrincipale = 'Aucune information sur le type';
		}

		return `<h3>Arrondissement ${nomArrondissement}</h3>
				<p>Piste ${nombreVoie}</p>
				<p>Type de voie : ${typePrincipale}</p>
				<p>Longueur : ${longueurVoie}KM</p>`;
	})
	.addTo(groupeInformations);

// Centre d'intérêts

const markerEau = L.icon({
	iconUrl: './assets/images/eau.png',
	iconSize: [30, 30],
	iconAnchor: [15, 15],
});
const markerVelo = L.icon({
	iconUrl: './assets/images/velo.png',
	iconSize: [30, 30],
	iconAnchor: [15, 15],
});
const markerPicnic = L.icon({
	iconUrl: './assets/images/picnic.png',
	iconSize: [30, 30],
	iconAnchor: [15, 15],
});
const markerBanc = L.icon({
	iconUrl: './assets/images/banc.png',
	iconSize: [30, 30],
	iconAnchor: [15, 15],
});

const markers = L.markerClusterGroup();

const coucheInterets = L.geoJSON(pointsInterets, {
	pointToLayer: function (feature, latlng) {
		let markerInteret;

		if (feature.properties.Element == 'SUV') {
			markerInteret = markerVelo;
		} else if (feature.properties.Element == 'BNC') {
			markerInteret = markerBanc;
		} else if (feature.properties.Element == 'TPN') {
			markerInteret = markerPicnic;
		} else if (feature.properties.Element == 'FAB') {
			markerInteret = markerEau;
		}

		return L.marker(latlng, { icon: markerInteret });
	},
});

// Marker cluster
markers.addLayer(coucheInterets);
maCarte.addLayer(markers);

// Overlays

let overlays = {
	Patrimoines: couchePatrimoines,
	'Piste cyclable': coucheCyclables,
	"Centre d'intérêt": coucheInterets,
};

L.control.layers(baseLayers, overlays).addTo(maCarte);

// Échelle et zoom

let echelle = L.control
	.scale({ imperial: true, maxWidth: 500, position: 'bottomright' })
	.addTo(maCarte);
let zoom = new L.Control.Zoom({ position: 'bottomright' }).addTo(maCarte);

// Barre de recherche

const searchControl = L.esri.Geocoding.geosearch({
	position: 'topleft',
	placeholder: 'Entrer une adresse',
	useMapBounds: false,
	providers: [
		L.esri.Geocoding.arcgisOnlineProvider({
			apikey: apiKey,
			nearby: {
				lat: 46,
				lng: -71,
			},
		}),
	],
}).addTo(maCarte);

const couchePoints = L.layerGroup();
couchePoints.addTo(maCarte);

searchControl.on('results', (data) => {
	for (let i = 0; i < data.results.length; i++) {
		couchePoints.clearLayers();
		let marqueur = L.marker(data.results[i].latlng);
		marqueur.bindPopup(data.results[i].text);
		marqueur.addTo(couchePoints);
	}
});

// Géolocalisation
const iconePerson = L.icon({
	iconUrl: './assets/images/icon_person.png',
	iconSize: [30, 30],
	iconAnchor: [15, 15],
	popupAnchor: [-2, -2],
});

const btnGeo = document.getElementById('btn_geo');
const btnStop = document.getElementById('btn_stop');
const pElement = document.getElementById('afficher_position');

let marqueurPosition = L.layerGroup().addTo(maCarte);

function getPosition() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			affichePosition,
			afficheErreur
		);
	} else {
		pElement.innerHTML = 'Problème!';
	}
}

function affichePosition(position) {
	let lacitude = position.coords.latitude;
	let longitude = position.coords.longitude;

	marqueurPosition.clearLayers();
	maCarte.locate({ watch: true, setView: true });
	pElement.innerHTML = `Voici votre lacitude : ${lacitude} <br> Voici votre longitude : ${longitude}`;

	L.marker([lacitude, longitude], { icon: iconePerson })
		.addTo(marqueurPosition)
		.bindPopup('Tu es ici!');

	maCarte.flyTo(L.latLng(lacitude, longitude), 15);
	btnStop.disabled = false;
	btnGeo.disabled = true;
}

function afficheErreur(erreur) {
	pElement.innerHTML = erreur;
}

function stopLocation() {
	maCarte.stopLocate();
	marqueurPosition.clearLayers();
	pElement.innerHTML = '';
	maCarte.flyTo(L.latLng([45.51, -73.68]), 10.5);
	btnStop.disabled = true;
	btnGeo.disabled = false;
}

btnGeo.addEventListener('click', getPosition);
btnStop.addEventListener('click', stopLocation);
