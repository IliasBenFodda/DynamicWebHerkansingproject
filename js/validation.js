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

const vulNotitieKeuze = (stripmuren) => {
    const keuze = document.getElementById("notitie-muur");
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

const toonFout = (veldId, boodschap) => {
    const foutElement = document.getElementById(`fout-${veldId}`);
    const veld = document.getElementById(veldId);
    foutElement.textContent = boodschap;
    veld.classList.toggle("veld-fout", boodschap !== "");
    return boodschap === "";
};

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
