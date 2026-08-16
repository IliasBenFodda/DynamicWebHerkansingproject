// De filterlijsten komen uit de data zelf, zo kloppen ze altijd met wat de API teruggeeft.
// Set haalt de dubbels eruit: 70 records, maar veel minder wijken en gemeenten.
const uniekeWaarden = (stripmuren, sleutel) =>
    [...new Set(stripmuren.map((muur) => muur[sleutel]))]
        .filter((waarde) => waarde !== "")
        .sort();

const vulKeuzelijst = (select, waarden) => {
    // optie 0 is "Alle wijken/gemeenten/postcodes" en die moet blijven staan
    while (select.options.length > 1) {
        select.remove(1);
    }

    waarden.forEach((waarde) => {
        const optie = document.createElement("option");
        optie.value = waarde;
        optie.textContent = waarde;
        select.appendChild(optie);
    });
};

// Een lege filterwaarde betekent "toon alles", daarom die controle op "" per criterium.
const filterStripmuren = (stripmuren, criteria) =>
    stripmuren.filter((muur) => {
        const zoek = criteria.zoek.toLowerCase();
        const zoektMee =
            muur.naam.toLowerCase().includes(zoek) ||
            muur.tekenaar.toLowerCase().includes(zoek) ||
            muur.adres.toLowerCase().includes(zoek);
        const wijkMee = criteria.wijk === "" || muur.wijk === criteria.wijk;
        const gemeenteMee = criteria.gemeente === "" || muur.gemeente === criteria.gemeente;
        const postcodeMee = criteria.postcode === "" || muur.postcode === criteria.postcode;
        return zoektMee && wijkMee && gemeenteMee && postcodeMee;
    });

const sorteerStripmuren = (stripmuren, sleutel, richting) => {
    const factor = richting === "aflopend" ? -1 : 1;
    // kopie met [...], want sort() past de originele array aan
    return [...stripmuren].sort((a, b) => {
        // jaar als getal vergelijken, anders komt "1991" voor "89"
        const waardeA = sleutel === "jaar" ? Number(a.jaar) : a.naam.toLowerCase();
        const waardeB = sleutel === "jaar" ? Number(b.jaar) : b.naam.toLowerCase();
        if (waardeA < waardeB) return -1 * factor;
        if (waardeA > waardeB) return 1 * factor;
        return 0;
    });
};

const initFilters = (stripmuren, tabelContainer, detailContainer, favorietenContainer) => {
    const zoek = document.getElementById("zoek");
    const wijk = document.getElementById("filter-wijk");
    const gemeente = document.getElementById("filter-gemeente");
    const postcode = document.getElementById("filter-postcode");
    const sorteer = document.getElementById("sorteer");
    const richting = document.getElementById("richting");

    const vulFilterLijsten = (muren) => {
        vulKeuzelijst(wijk, uniekeWaarden(muren, "wijk"));
        vulKeuzelijst(gemeente, uniekeWaarden(muren, "gemeente"));
        vulKeuzelijst(postcode, uniekeWaarden(muren, "postcode"));
    };

    // Alles wordt in één keer opnieuw opgebouwd. Bijhouden wat er precies veranderd is
    // zou hier alleen maar ingewikkelder zijn.
    const werkBij = () => {
        const inTaal = stripmuren.map(vertaalRecord);
        const criteria = {
            zoek: zoek.value,
            wijk: wijk.value,
            gemeente: gemeente.value,
            postcode: postcode.value,
        };
        const gefilterd = filterStripmuren(inTaal, criteria);
        const gesorteerd = sorteerStripmuren(gefilterd, sorteer.value, richting.value);
        renderTable(gesorteerd, tabelContainer);
        initDetail(gesorteerd, tabelContainer, detailContainer);
        initFavorietKnoppen(tabelContainer, werkBij);
        renderFavorieten(inTaal, favorietenContainer, werkBij);
        vulNotitieKeuze(inTaal);
        initLazyLoading(tabelContainer);
        initLazyLoading(favorietenContainer);
    };

    // input vuurt ook bij de select-elementen, dus één listener volstaat voor alles
    [zoek, wijk, gemeente, postcode, sorteer, richting].forEach((element) => {
        element.addEventListener("input", werkBij);
    });

    vulFilterLijsten(stripmuren.map(vertaalRecord));
    werkBij();

    // Wordt na een taalwissel opgeroepen: dan moeten ook de filterlijsten
    // en de markers op de kaart mee veranderen.
    return () => {
        const inTaal = stripmuren.map(vertaalRecord);
        vulFilterLijsten(inTaal);
        toonMarkers(inTaal);
        werkBij();
    };
};