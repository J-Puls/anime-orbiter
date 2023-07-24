import makeRequest from '../general/makeRequest';

export const findTitles = async (query) => {

    // send a basic request for all shows matching the query
    const url = `https://api.tvmaze.com/search/shows?q=${query}`;
    return await makeRequest(url);

};

export default findTitles;
