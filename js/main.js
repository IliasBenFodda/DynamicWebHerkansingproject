const statusElement = document.getElementById("status");

const start = async () => {
    try {
        const data = await fetchStripmuren();
        const stripmuren = data.map(mapRecord);
        statusElement.dataset.aantal = stripmuren.length;
        statusElement.textContent = vertaal("aantal").replace("{n}", stripmuren.length);
        initDetailSluiten(document.getElementById("detail"));
        const herlaad = initFilters(
            stripmuren,
            document.getElementById("app"),
            document.getElementById("detail"),
            document.getElementById("favorieten")
        );
        const kaart = renderMap(document.getElementById("kaart"));
        toonMarkers(stripmuren.map(vertaalRecord));
        initVoorkeuren(kaart, herlaad);
        window.stripmuren = stripmuren;
    } catch (fout) {
        statusElement.textContent = `Er ging iets mis: ${fout.message}`;
    }
};

start();