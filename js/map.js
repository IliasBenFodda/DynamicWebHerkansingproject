const BRUSSEL_CENTRUM = [50.8467, 4.3525];

const renderMap = (stripmuren, container) => {
    const kaart = L.map(container).setView(BRUSSEL_CENTRUM, 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap-bijdragers",
    }).addTo(kaart);

    stripmuren.forEach((muur) => {
        if (!muur.coordinaten) {
            return;
        }

        const marker = L.marker(muur.coordinaten).addTo(kaart);
        marker.bindPopup(`<strong>${muur.naam}</strong><br>${muur.adres}`);
    });

    return kaart;
};