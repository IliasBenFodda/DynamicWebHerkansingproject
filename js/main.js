const statusElement = document.getElementById("status");

const start = async () => {
    try {
        const stripmuren = await fetchStripmuren();
        statusElement.textContent = `Er zijn ${stripmuren.length} stripmuren opgehaald.`;
        window.stripmuren = stripmuren;
    } catch (fout) {
        statusElement.textContent = `Er ging iets mis: ${fout.message}`;
        statusElement.classList.add("error");
    }
};

start();