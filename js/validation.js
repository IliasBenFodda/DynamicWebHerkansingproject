// Notities zitten in een apart object per record-id, los van de lijst met favorieten.
const NOTITIES_SLEUTEL = "stripmuren-notities";

const laadNotities = () => {
    const opgeslagen = localStorage.getItem(NOTITIES_SLEUTEL);
    return opgeslagen ? JSON.parse(opgeslagen) : {};
};

const bewaarNotitie = (id, notitie) => {
    const notities = laadNotities();
    notities[id] = notitie;
    localStorage.setItem(NOTITIES_SLEUTEL, JSON.stringify(notities));
};

const notitieVoor = (id) => laadNotities()[id] || null;

const vertaalNotitieFormulier = () => {
    document.getElementById("notitie-titel").textContent = vertaal("notitieTitel");
    document.getElementById("notitie-uitleg").textContent = vertaal("notitieUitleg");
    document.getElementById("label-muur").textContent = vertaal("notitieMuur");
    document.getElementById("label-label").textContent = vertaal("notitieLabel");
    document.getElementById("label-tekst").textContent = vertaal("notitieTekst");
    document.getElementById("notitie-verstuur").textContent = vertaal("notitieBewaren");
    document.getElementById("notitie-muur").options[0].textContent = vertaal("notitieKies");
};

// Je kan enkel een notitie schrijven bij een muur die al favoriet is.
const vulNotitieKeuze = (stripmuren) => {
    const keuze = document.getElementById("notitie-muur");
    // deze lijst wordt bij elke wijziging opnieuw opgebouwd, dus onthoud ik de keuze
    const vorigeKeuze = keuze.value;
    const favorieten = laadFavorieten();
    const favorieteMuren = stripmuren.filter((muur) => favorieten.includes(muur.id));

    while (keuze.options.length > 1) {
        keuze.remove(1);
    }

    favorieteMuren.forEach((muur) => {
        const optie = document.createElement("option");
        optie.value = muur.id;
        optie.textContent = muur.naam;
        keuze.appendChild(optie);
    });

    keuze.value = favorieten.includes(vorigeKeuze) ? vorigeKeuze : "";
};

// Een lege boodschap betekent dat het veld in orde is. Zo kan dezelfde functie
// de fout tonen én meteen zeggen of het veld geldig was.
const toonFout = (veldId, boodschap) => {
    const foutElement = document.getElementById(`fout-${veldId}`);
    const veld = document.getElementById(veldId);
    foutElement.textContent = boodschap;
    veld.classList.toggle("veld-fout", boodschap !== "");
    return boodschap === "";
};

// De drie controles staan bewust niet in een && achter elkaar: zo krijgt de gebruiker
// alle foutmeldingen tegelijk te zien in plaats van één per keer.
const controleerFormulier = (muurId, label, tekst) => {
    const muurGeldig = toonFout("notitie-muur", muurId === "" ? vertaal("foutMuur") : "");
    const labelGeldig = toonFout(
        "notitie-label",
        label.length === 0
            ? vertaal("foutLabelLeeg")
            : label.length < 3
              ? vertaal("foutLabelKort")
              : ""
    );
    const tekstGeldig = toonFout(
        "notitie-tekst",
        tekst.length === 0
            ? vertaal("foutTekstLeeg")
            : tekst.length < 10
              ? vertaal("foutTekstKort")
              : ""
    );
    return muurGeldig && labelGeldig && tekstGeldig;
};

const initValidatie = (opWijziging) => {
    const formulier = document.getElementById("notitie-formulier");
    const melding = document.getElementById("notitie-melding");

    formulier.addEventListener("submit", (event) => {
        // het formulier staat op novalidate in index.html, de controle gebeurt hier
        event.preventDefault();

        const muurId = document.getElementById("notitie-muur").value;
        const label = document.getElementById("notitie-label").value.trim();
        const tekst = document.getElementById("notitie-tekst").value.trim();

        if (!controleerFormulier(muurId, label, tekst)) {
            melding.textContent = "";
            return;
        }

        bewaarNotitie(muurId, { label, tekst });
        melding.textContent = vertaal("notitieBewaard");
        formulier.reset();
        opWijziging();
    });
};
