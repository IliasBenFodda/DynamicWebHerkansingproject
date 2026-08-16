const THEMA_SLEUTEL = "stripmuren-thema";
const TAAL_SLEUTEL = "stripmuren-taal";

// Alle teksten van de interface staan hier samen, per taal. Zo hoef ik voor een
// vertaling niet in index.html of in de andere js-bestanden te zoeken.
const VERTALINGEN = {
    nl: {
        titel: "Stripmuren in Brussel",
        zoekPlaceholder: "Zoek op naam, tekenaar of adres",
        alleWijken: "Alle wijken",
        alleGemeenten: "Alle gemeenten",
        allePostcodes: "Alle postcodes",
        sorteerNaam: "Sorteer op naam",
        sorteerJaar: "Sorteer op jaar",
        oplopend: "Oplopend",
        aflopend: "Aflopend",
        naarDonker: "Donker thema",
        naarLicht: "Licht thema",
        locatieKnop: "Toon mijn locatie",
        locatieBezig: "Locatie wordt gezocht...",
        locatieGevonden: "Je locatie staat op de kaart.",
        locatieFout: "Locatie niet beschikbaar.",
        locatieGeenSteun: "Geolocatie wordt niet ondersteund.",
        jijBentHier: "Je bent hier",
        kolomFavoriet: "Favoriet",
        kolomAfbeelding: "Afbeelding",
        kolomNaam: "Naam",
        kolomTekenaar: "Tekenaar",
        kolomJaar: "Jaar",
        kolomAdres: "Adres",
        kolomWijk: "Wijk",
        kolomOppervlakte: "Oppervlakte (m²)",
        oppervlakte: "Oppervlakte",
        gemeente: "Gemeente",
        postcode: "Postcode",
        uitgeverij: "Uitgeverij",
        googleMaps: "Google Maps",
        streetView: "Street View",
        meerInfo: "Meer info",
        sluiten: "Sluiten",
        favorietenTitel: "Mijn favorieten",
        favorietenLeeg: "Je hebt nog geen favorieten. Klik op ☆ in de tabel.",
        verwijderen: "Verwijderen",
        toevoegenAria: "Voeg toe aan favorieten",
        verwijderenAria: "Verwijder uit favorieten",
        notitieTitel: "Notitie bij een favoriet",
        kaartTitel: "Kaart",
        overzichtTitel: "Overzicht",        notitieUitleg: "Kies een favoriet en bewaar er je eigen notitie bij.",
        notitieMuur: "Stripmuur",
        notitieLabel: "Label",
        notitieTekst: "Notitie",
        notitieKies: "Kies een favoriet",
        notitieBewaren: "Notitie bewaren",
        notitieBewaard: "Je notitie is bewaard.",
        foutMuur: "Kies eerst een favoriete stripmuur.",
        foutLabelLeeg: "Een label is verplicht.",
        foutLabelKort: "Het label moet minstens 3 tekens lang zijn.",
        foutTekstLeeg: "Een notitie is verplicht.",
        foutTekstKort: "De notitie moet minstens 10 tekens lang zijn.",
    },
    fr: {
        titel: "Murs BD à Bruxelles",
        zoekPlaceholder: "Chercher par nom, dessinateur ou adresse",
        alleWijken: "Tous les quartiers",
        alleGemeenten: "Toutes les communes",
        allePostcodes: "Tous les codes postaux",
        sorteerNaam: "Trier par nom",
        sorteerJaar: "Trier par année",
        oplopend: "Croissant",
        aflopend: "Décroissant",
        naarDonker: "Thème sombre",
        naarLicht: "Thème clair",
        locatieKnop: "Afficher ma position",
        locatieBezig: "Recherche de la position...",
        locatieGevonden: "Votre position est sur la carte.",
        locatieFout: "Position non disponible.",
        locatieGeenSteun: "La géolocalisation n'est pas supportée.",
        jijBentHier: "Vous êtes ici",
        kolomFavoriet: "Favori",
        kolomAfbeelding: "Image",
        kolomNaam: "Nom",
        kolomTekenaar: "Dessinateur",
        kolomJaar: "Année",
        kolomAdres: "Adresse",
        kolomWijk: "Quartier",
        kolomOppervlakte: "Surface (m²)",
        oppervlakte: "Surface",
        gemeente: "Commune",
        postcode: "Code postal",
        uitgeverij: "Maison d'édition",
        googleMaps: "Google Maps",
        streetView: "Street View",
        meerInfo: "Plus d'infos",
        sluiten: "Fermer",
        favorietenTitel: "Mes favoris",
        favorietenLeeg: "Vous n'avez pas encore de favoris. Cliquez sur ☆ dans le tableau.",
        verwijderen: "Supprimer",
        toevoegenAria: "Ajouter aux favoris",
        verwijderenAria: "Retirer des favoris",
        notitieTitel: "Note sur un favori",
        kaartTitel: "Carte",
        overzichtTitel: "Aperçu",
        notitieUitleg: "Choisissez un favori et enregistrez-y votre propre note.",
        notitieMuur: "Fresque",
        notitieLabel: "Étiquette",
        notitieTekst: "Note",
        notitieKies: "Choisissez un favori",
        notitieBewaren: "Enregistrer la note",
        notitieBewaard: "Votre note est enregistrée.",
        foutMuur: "Choisissez d'abord une fresque favorite.",
        foutLabelLeeg: "Une étiquette est obligatoire.",
        foutLabelKort: "L'étiquette doit contenir au moins 3 caractères.",
        foutTekstLeeg: "Une note est obligatoire.",
        foutTekstKort: "La note doit contenir au moins 10 caractères.",
    },
};

// Staat bewust globaal: render.js en filters.js lezen deze taal uit.
// Nederlands is de standaard zolang de gebruiker niets gekozen heeft.
let huidigeTaal = localStorage.getItem(TAAL_SLEUTEL) || "nl";

const vertaal = (sleutel) => VERTALINGEN[huidigeTaal][sleutel];

// Eén klasse op body volstaat, de kleuren zelf zitten in style.css onder body.donker.
const pasThemaToe = (thema) => {
    const knop = document.getElementById("thema-knop");
    const donker = thema === "donker";
    document.body.classList.toggle("donker", donker);
    const label = donker ? vertaal("naarLicht") : vertaal("naarDonker");
    knop.setAttribute("aria-pressed", donker);
    knop.setAttribute("aria-label", label);
    knop.title = label;
};

// Alles wat vast in index.html staat, wordt hier opnieuw ingevuld. De tabel, de
// favorieten en het detail worden elders al hertekend en zitten hier dus niet in.
const pasTaalToe = () => {
    document.documentElement.lang = huidigeTaal;
    document.querySelector("header h1").textContent = vertaal("titel");

    document.getElementById("zoek").placeholder = vertaal("zoekPlaceholder");
    document.getElementById("filter-wijk").options[0].textContent = vertaal("alleWijken");
    document.getElementById("filter-gemeente").options[0].textContent = vertaal("alleGemeenten");
    document.getElementById("filter-postcode").options[0].textContent = vertaal("allePostcodes");

    const sorteer = document.getElementById("sorteer");
    sorteer.options[0].textContent = vertaal("sorteerNaam");
    sorteer.options[1].textContent = vertaal("sorteerJaar");

    const richting = document.getElementById("richting");
    richting.options[0].textContent = vertaal("oplopend");
    richting.options[1].textContent = vertaal("aflopend");

    document.getElementById("locatie-knop").textContent = vertaal("locatieKnop");
    document.getElementById("kaart-titel").textContent = vertaal("kaartTitel");
    document.getElementById("overzicht-titel").textContent = vertaal("overzichtTitel");
    vertaalNotitieFormulier();
    pasThemaToe(localStorage.getItem(THEMA_SLEUTEL) || "licht");
};

// Werkt enkel op localhost of via https, browsers blokkeren geolocatie op http.
// getCurrentPosition krijgt twee callbacks mee: één als het lukt, één als het misgaat.
const toonMijnLocatie = (kaart) => {
    const status = document.getElementById("locatie-status");

    if (!navigator.geolocation) {
        status.textContent = vertaal("locatieGeenSteun");
        return;
    }

    status.textContent = vertaal("locatieBezig");
    navigator.geolocation.getCurrentPosition(
        (positie) => {
            const punt = [positie.coords.latitude, positie.coords.longitude];
            L.marker(punt).addTo(kaart).bindPopup(vertaal("jijBentHier")).openPopup();
            kaart.setView(punt, 14);
            status.textContent = vertaal("locatieGevonden");
        },
        () => {
            status.textContent = vertaal("locatieFout");
        }
    );
};

const initVoorkeuren = (kaart, opWijziging) => {
    const themaKnop = document.getElementById("thema-knop");
    const taalKeuze = document.getElementById("taal");
    const locatieKnop = document.getElementById("locatie-knop");

    taalKeuze.value = huidigeTaal;
    pasTaalToe();

    themaKnop.addEventListener("click", () => {
        const nieuwThema = document.body.classList.contains("donker") ? "licht" : "donker";
        localStorage.setItem(THEMA_SLEUTEL, nieuwThema);
        pasThemaToe(nieuwThema);
    });

    taalKeuze.addEventListener("change", () => {
        huidigeTaal = taalKeuze.value;
        localStorage.setItem(TAAL_SLEUTEL, huidigeTaal);
        pasTaalToe();
        // het openstaande detail zou anders in de oude taal blijven staan
        sluitDetail(document.getElementById("detail"));
        opWijziging();
    });

    locatieKnop.addEventListener("click", () => toonMijnLocatie(kaart));
};

pasTaalToe();
