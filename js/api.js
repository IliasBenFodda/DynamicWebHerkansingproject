// Search API v1 van Opendatasoft: https://help.opendatasoft.com/apis/ods-search-v1/
// rows=100 omdat de dataset er 70 heeft, zo komt alles in één request binnen
const API_URL = "https://bruxellesdata.opendatasoft.com/api/records/1.0/search/?dataset=bruxelles_parcours_bd&rows=100";

const fetchStripmuren = async () => {
    const response = await fetch(API_URL);

    // fetch geeft geen fout bij een 404 of 500, dus die check doe ik zelf
    if (!response.ok) {
        throw new Error(`Ophalen mislukt met status: ${response.status}`);
    }

    const data = await response.json();
    return data.records;
};