const API_URL = "https://bruxellesdata.opendatasoft.com/api/records/1.0/search/?dataset=bruxelles_parcours_bd&rows=100";

const fetchStripmuren = async () => {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error(`Ophalen mislukt met status: ${response.status}`);
    }

    const data = await response.json();
    return data.records;
};