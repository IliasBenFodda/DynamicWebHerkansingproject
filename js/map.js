const BRUSSEL_CENTRUM = [50.8467, 4.3525];

let markerLaag = null;

const renderMap = (container) => {
    const kaart = L.map(container).setView(BRUSSEL_CENTRUM, 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap-bijdragers",
    }).addTo(kaart);

    markerLaag = L.layerGroup().addTo(kaart);
    return kaart;
};

const toonMarkers = (stripmuren) => {
    markerLaag.clearLayers();

    stripmuren.forEach((muur) => {
        if (!muur.coordinaten) {
            return;
        }

        const marker = L.marker(muur.coordinaten);
        marker.bindPopup(`<strong>${muur.naam}</strong><br>${muur.adres}`);
        markerLaag.addLayer(marker);
    });
};