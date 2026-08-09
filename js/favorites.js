const FAVORIETEN_SLEUTEL = "stripmuren-favorieten";

const laadFavorieten = () => {
    const opgeslagen = localStorage.getItem(FAVORIETEN_SLEUTEL);
    return opgeslagen ? JSON.parse(opgeslagen) : [];
};

const bewaarFavorieten = (favorieten) => {
    localStorage.setItem(FAVORIETEN_SLEUTEL, JSON.stringify(favorieten));
};

const isFavoriet = (id) => laadFavorieten().includes(id);

const wisselFavoriet = (id) => {
    const favorieten = laadFavorieten();
    const nieuweFavorieten = isFavoriet(id)
        ? favorieten.filter((favorietId) => favorietId !== id)
        : [...favorieten, id];
    bewaarFavorieten(nieuweFavorieten);
};

const verwijderFavoriet = (id) => {
    bewaarFavorieten(laadFavorieten().filter((favorietId) => favorietId !== id));
};

const buildFavorietKnop = (id) => {
    const actief = isFavoriet(id);
    return `<button type="button" class="favoriet-knop ${actief ? "actief" : ""}" data-id="${id}"
        aria-label="${actief ? vertaal("verwijderenAria") : vertaal("toevoegenAria")}">${actief ? "★" : "☆"}</button>`;
};

const initFavorietKnoppen = (tabelContainer, opWijziging) => {
    const knoppen = tabelContainer.querySelectorAll(".favoriet-knop");

    knoppen.forEach((knop) => {
        knop.addEventListener("click", (event) => {
            event.stopPropagation();
            wisselFavoriet(knop.dataset.id);
            opWijziging();
        });
    });
};

const renderFavorieten = (stripmuren, container, opWijziging) => {
    const favorieten = laadFavorieten();
    const favorieteMuren = stripmuren.filter((muur) => favorieten.includes(muur.id));

    if (favorieteMuren.length === 0) {
        container.innerHTML = `
            <h2>${vertaal("favorietenTitel")}</h2>
            <p class="favorieten-leeg">${vertaal("favorietenLeeg")}</p>`;
        return;
    }

    const items = favorieteMuren
        .map(
            (muur) => {
                const notitie = notitieVoor(muur.id);
                return `
            <li class="favoriet-item">
                ${muur.afbeelding ? `<img class="favoriet-img lazy" data-src="${muur.afbeelding}" alt="${muur.naam}">` : ""}
                <span class="favoriet-naam">${muur.naam}</span>
                ${notitie ? `<span class="favoriet-label">${notitie.label}</span><span class="favoriet-notitie">${notitie.tekst}</span>` : ""}
                <button type="button" class="favoriet-verwijder" data-id="${muur.id}"
                    aria-label="${vertaal("verwijderenAria")}">🗑 ${vertaal("verwijderen")}</button>
            </li>`;
            }
        )
        .join("");

    container.innerHTML = `
        <h2>${vertaal("favorietenTitel")} (${favorieteMuren.length})</h2>
        <ul class="favorieten-lijst">${items}</ul>`;

    container.querySelectorAll(".favoriet-verwijder").forEach((knop) => {
        knop.addEventListener("click", () => {
            verwijderFavoriet(knop.dataset.id);
            opWijziging();
        });
    });
};
