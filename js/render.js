// Opbouw van de bestands-URL zoals beschreven op de datasetpagina van Opendatasoft.
// /300/ geeft een kleine versie voor de tabel, /download/ de volledige foto.
const IMAGE_BASE = "https://bruxellesdata.opendatasoft.com/explore/dataset/bruxelles_parcours_bd/files";

const buildImageUrl = (image) =>
    image && image.id ? `${IMAGE_BASE}/${image.id}/300/` : "";

const buildImageUrlGroot = (image) =>
    image && image.id ? `${IMAGE_BASE}/${image.id}/download/` : "";

// Lege velden laat de API gewoon weg, vandaar overal een || als vangnet.
const mapRecord = (record) => {
    const veld = record.fields;
    return {
        id: record.recordid,
        naamNl: veld.naam_fresco_nl || "Onbekend",
        naamFr: veld.nom_de_la_fresque || "Inconnu",
        tekenaar: veld.dessinateur || "Onbekend",
        jaar: veld.date || "",
        adresNl: veld.adres_nl || "",
        adresFr: veld.adresse_fr || "",
        wijk: veld.quartier || "",
        gemeenteNl: veld.gemeente || "",
        gemeenteFr: veld.commune || "",
        postcode: veld.code_postal || "",
        uitgeverij: veld.maison_d_edition || "",
        oppervlakte: veld.surface_m2 || "",
        coordinaten: veld.geo_point || null,
        weblinkNl: veld.link_site_striproute || "",
        weblinkFr: veld.lien_site_parcours_bd || "",
        googleMaps: veld.google_maps || "",
        streetView: veld.google_street_view || "",
        afbeelding: buildImageUrl(veld.image),
        afbeeldingGroot: buildImageUrlGroot(veld.image),
    };
};

// NL en FR zitten allebei in hetzelfde record, dus bij een taalwissel
// moet er niets opnieuw opgehaald worden.
const vertaalRecord = (muur) => ({
    ...muur,
    naam: huidigeTaal === "fr" ? muur.naamFr : muur.naamNl,
    adres: huidigeTaal === "fr" ? muur.adresFr : muur.adresNl,
    gemeente: huidigeTaal === "fr" ? muur.gemeenteFr : muur.gemeenteNl,
    weblink: huidigeTaal === "fr" ? muur.weblinkFr : muur.weblinkNl,
});

// Sleutels in plaats van vaste tekst, anders blijft de tabelkop Nederlands
// als je naar het Frans schakelt.
const COLUMN_KEYS = [
    "kolomFavoriet",
    "kolomAfbeelding",
    "kolomNaam",
    "kolomTekenaar",
    "kolomJaar",
    "kolomAdres",
    "kolomWijk",
    "kolomOppervlakte",
];

// data-src in plaats van src: observer.js zet de echte src pas als de rij in beeld komt.
const buildRow = (muur) => `
    <tr data-id="${muur.id}">
        <td>${buildFavorietKnop(muur.id)}</td>
        <td>${muur.afbeelding ? `<img class="strip-img lazy" data-src="${muur.afbeelding}" alt="${muur.naam}">` : ""}</td>
        <td>${muur.naam}</td>
        <td>${muur.tekenaar}</td>
        <td>${muur.jaar}</td>
        <td>${muur.adres}, ${muur.postcode} ${muur.gemeente}</td>
        <td>${muur.wijk}</td>
        <td>${muur.oppervlakte}</td>
    </tr>`;

const renderTable = (stripmuren, container) => {
    const koppen = COLUMN_KEYS.map((sleutel) => `<th>${vertaal(sleutel)}</th>`).join("");
    const rijen = stripmuren.map(buildRow).join("");
    container.innerHTML = `
        <table class="stripmuren-tabel">
            <thead><tr>${koppen}</tr></thead>
            <tbody>${rijen}</tbody>
        </table>`;
};

const buildLink = (url, label) =>
    url ? `<a href="${url}" target="_blank" rel="noopener">${label}</a>` : "";

const renderDetail = (muur, container) => {
    container.innerHTML = `
        <div class="detail-inhoud">
            <button class="detail-sluiten" type="button" aria-label="${vertaal("sluiten")}">&times;</button>
            ${muur.afbeeldingGroot ? `<img class="detail-afbeelding" src="${muur.afbeeldingGroot}" alt="${muur.naam}">` : ""}
            <h2>${muur.naam}</h2>
            <ul class="detail-info">
                <li><strong>${vertaal("kolomTekenaar")}:</strong> ${muur.tekenaar}</li>
                <li><strong>${vertaal("kolomJaar")}:</strong> ${muur.jaar}</li>
                <li><strong>${vertaal("kolomAdres")}:</strong> ${muur.adres}</li>
                <li><strong>${vertaal("kolomWijk")}:</strong> ${muur.wijk}</li>
                <li><strong>${vertaal("gemeente")}:</strong> ${muur.gemeente}</li>
                <li><strong>${vertaal("postcode")}:</strong> ${muur.postcode}</li>
                <li><strong>${vertaal("uitgeverij")}:</strong> ${muur.uitgeverij}</li>
                <li><strong>${vertaal("oppervlakte")}:</strong> ${muur.oppervlakte} m²</li>
            </ul>
            <div class="detail-links">
                ${buildLink(muur.googleMaps, vertaal("googleMaps"))}
                ${buildLink(muur.streetView, vertaal("streetView"))}
                ${buildLink(muur.weblink, vertaal("meerInfo"))}
            </div>
        </div>`;
    container.classList.remove("hidden");
};

const sluitDetail = (container) => {
    container.classList.add("hidden");
    container.innerHTML = "";
};

// De listeners worden telkens opnieuw gezet, want renderTable heeft de oude rijen
// net vervangen door nieuwe.
const initDetail = (stripmuren, tabelContainer, detailContainer) => {
    const rijen = tabelContainer.querySelectorAll("tbody tr");

    rijen.forEach((rij) => {
        rij.addEventListener("click", () => {
            const muur = stripmuren.find((item) => item.id === rij.dataset.id);
            renderDetail(muur, detailContainer);
        });
    });
    };

    const initDetailSluiten = (detailContainer)=>{
    // Deze staat maar één keer op de container zelf, want de inhoud wisselt voortdurend.
    // Klikken naast het venster sluit het ook, zoals bij de meeste pop-ups.
    detailContainer.addEventListener("click", (event) => {
        if (event.target === detailContainer || event.target.className === "detail-sluiten") {
            sluitDetail(detailContainer);
        }
    });
};