const statusElement = document.getElementById("status");

const start = async () => {
    try {
        const data = await fetchStripmuren();
        const stripmuren = data.map(mapRecord);
        statusElement.textContent = `Er zijn ${stripmuren.length} stripmuren opgehaald.`;
        renderTable(stripmuren, document.getElementById("app"));
        window.stripmuren = stripmuren;
    } catch (fout) {
        statusElement.textContent = `Er ging iets mis: ${fout.message}`;
    }
};

start();