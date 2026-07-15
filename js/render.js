const IMAGE_BASE = "https://bruxellesdata.opendatasoft.com/explore/dataset/bruxelles_parcours_bd/files";

const buildImageUrl = (image) =>
    image && image.id ? `${IMAGE_BASE}/${image.id}/300/` : "";

const buildImageUrlGroot = (image) =>
    image && image.id ? `${IMAGE_BASE}/${image.id}/download/` : "";

const mapRecord = (record) => {
    const veld = record.fields;
    return {
        id: record.recordid,
        naam: veld.naam_fresco_nl || "Onbekend",
        tekenaar: veld.dessinateur || "Onbekend",
        jaar: veld.date || "",
        adres: veld.adres_nl || "",
        wijk: veld.quartier || "",
        gemeente: veld.gemeente || "",
        postcode: veld.code_postal || "",
        uitgeverij: veld.maison_d_edition || "",
        oppervlakte: veld.surface_m2 || "",
        weblink: veld.link_site_striproute || "",
        googleMaps: veld.google_maps || "",
        streetView: veld.google_street_view || "",
        afbeelding: buildImageUrl(veld.image),
        afbeeldingGroot: buildImageUrlGroot(veld.image),
    };
};

const COLUMNS = ["Afbeelding", "Naam", "Tekenaar", "Jaar", "Adres", "Wijk", "Oppervlakte (m²)"];

const buildRow = (muur) => `
    <tr data-id="${muur.id}">
        <td>${muur.afbeelding ? `<img class="strip-img" src="${muur.afbeelding}" alt="${muur.naam}">` : ""}</td>
        <td>${muur.naam}</td>
        <td>${muur.tekenaar}</td>
        <td>${muur.jaar}</td>
        <td>${muur.adres}, ${muur.postcode} ${muur.gemeente}</td>
        <td>${muur.wijk}</td>
        <td>${muur.oppervlakte}</td>
    </tr>`;

const renderTable = (stripmuren, container) => {
    const koppen = COLUMNS.map((kop) => `<th>${kop}</th>`).join("");
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
            <button class="detail-sluiten" type="button" aria-label="Sluiten">&times;</button>
            ${muur.afbeeldingGroot ? `<img class="detail-afbeelding" src="${muur.afbeeldingGroot}" alt="${muur.naam}">` : ""}
            <h2>${muur.naam}</h2>
            <ul class="detail-info">
                <li><strong>Tekenaar:</strong> ${muur.tekenaar}</li>
                <li><strong>Jaar:</strong> ${muur.jaar}</li>
                <li><strong>Adres:</strong> ${muur.adres}</li>
                <li><strong>Wijk:</strong> ${muur.wijk}</li>
                <li><strong>Gemeente:</strong> ${muur.gemeente}</li>
                <li><strong>Postcode:</strong> ${muur.postcode}</li>
                <li><strong>Uitgeverij:</strong> ${muur.uitgeverij}</li>
                <li><strong>Oppervlakte:</strong> ${muur.oppervlakte} m²</li>
            </ul>
            <div class="detail-links">
                ${buildLink(muur.googleMaps, "Google Maps")}
                ${buildLink(muur.streetView, "Street View")}
                ${buildLink(muur.weblink, "Meer info")}
            </div>
        </div>`;
    container.classList.remove("hidden");
};

const sluitDetail = (container) => {
    container.classList.add("hidden");
    container.innerHTML = "";
};

const initDetail = (stripmuren, tabelContainer, detailContainer) => {
    const rijen = tabelContainer.querySelectorAll("tbody tr");

    rijen.forEach((rij) => {
        rij.addEventListener("click", () => {
            const muur = stripmuren.find((item) => item.id === rij.dataset.id);
            renderDetail(muur, detailContainer);
        });
    });

    detailContainer.addEventListener("click", (event) => {
        if (event.target === detailContainer || event.target.className === "detail-sluiten") {
            sluitDetail(detailContainer);
        }
    });
};