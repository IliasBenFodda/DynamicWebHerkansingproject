const IMAGE_BASE = "https://bruxellesdata.opendatasoft.com/explore/dataset/bruxelles_parcours_bd/files";

const buildImageUrl = (image) =>
    image && image.id ? `${IMAGE_BASE}/${image.id}/300/` : "";

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
        afbeelding: buildImageUrl(veld.image),
    };
};

const COLUMNS = ["Afbeelding", "Naam", "Tekenaar", "Jaar", "Adres", "Wijk", "Gemeente", "Postcode", "Oppervlakte (m²)", "Website"];

const buildRow = (muur) => `
    <tr data-id="${muur.id}">
        <td>${muur.afbeelding ? `<img class="strip-img" src="${muur.afbeelding}" alt="${muur.naam}">` : ""}</td>
        <td>${muur.naam}</td>
        <td>${muur.tekenaar}</td>
        <td>${muur.jaar}</td>
        <td>${muur.adres}</td>
        <td>${muur.wijk}</td>
        <td>${muur.gemeente}</td>
        <td>${muur.postcode}</td>
        <td>${muur.oppervlakte}</td>
        <td>${muur.weblink ? `<a href="${muur.weblink}" target="_blank" rel="noopener">Bekijk</a>` : ""}</td>
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