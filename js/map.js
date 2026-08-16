// Grote Markt, ongeveer het midden van de striproute.
const BRUSSEL_CENTRUM = [50.8467, 4.3525];

// Alle markers in één laag, zo kan ik ze in één keer wissen bij een taalwissel
// zonder de kaart zelf opnieuw op te bouwen.
let markerLaag = null;

// Opzet van de kaart en de tegellaag volgens de quick start van Leaflet:
// https://leafletjs.com/examples/quick-start/
const renderMap = (container) => {
    const kaart = L.map(container).setView(BRUSSEL_CENTRUM, 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        // vermelding van OpenStreetMap is verplicht bij het gebruik van hun tegels
        attribution: "&copy; OpenStreetMap-bijdragers",
    }).addTo(kaart);

    markerLaag = L.layerGroup().addTo(kaart);
    return kaart;
};

const toonMarkers = (stripmuren) => {
    markerLaag.clearLayers();

    stripmuren.forEach((muur) => {
        // niet elk record in de dataset heeft een geo_point
        if (!muur.coordinaten) {
            return;
        }

        const marker = L.marker(muur.coordinaten);
        marker.bindPopup(`<strong>${muur.naam}</strong><br>${muur.adres}`);
        markerLaag.addLayer(marker);
    });
};