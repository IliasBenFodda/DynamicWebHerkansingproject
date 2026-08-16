const statusElement = document.getElementById("status");

// Startpunt van de app: eerst de data, daarna pas alles opbouwen.
// De volgorde van de scripts staat onderaan index.html.
const start = async () => {
    try {
        const data = await fetchStripmuren();
        const stripmuren = data.map(mapRecord);
        initDetailSluiten(document.getElementById("detail"));
        // initFilters geeft een functie terug om alles opnieuw te tekenen,
        // die hebben validatie en voorkeuren nodig
        const herlaad = initFilters(
            stripmuren,
            document.getElementById("app"),
            document.getElementById("detail"),
            document.getElementById("favorieten")
        );
        const kaart = renderMap(document.getElementById("kaart"));
        toonMarkers(stripmuren.map(vertaalRecord));
        initValidatie(herlaad);
        initVoorkeuren(kaart, herlaad);
        window.stripmuren = stripmuren;
    } catch (fout) {
        // gaat de API plat of ligt het internet eruit, dan ziet de gebruiker
        // een melding in plaats van een lege pagina
        statusElement.textContent = `Er ging iets mis: ${fout.message}`;
        statusElement.classList.remove("hidden");
    }
};

start();