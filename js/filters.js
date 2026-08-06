const uniekeWaarden = (stripmuren, sleutel) =>
    [...new Set(stripmuren.map((muur) => muur[sleutel]))]
        .filter((waarde) => waarde !== "")
        .sort();

const vulKeuzelijst = (select, waarden) => {
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
    return [...stripmuren].sort((a, b) => {
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
    };

    [zoek, wijk, gemeente, postcode, sorteer, richting].forEach((element) => {
        element.addEventListener("input", werkBij);
    });

    vulFilterLijsten(stripmuren.map(vertaalRecord));
    werkBij();

    return () => {
        const inTaal = stripmuren.map(vertaalRecord);
        vulFilterLijsten(inTaal);
        toonMarkers(inTaal);
        werkBij();
    };
};