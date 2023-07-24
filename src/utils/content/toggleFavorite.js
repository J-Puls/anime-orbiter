import makeRequest from '../general/makeRequest';

export const toggleFavorite = async data => {

    // tell our API to have Firebase toggle the "favorite"
    // status of the selected title for the current user
    const url = '/api/toggleFavoriteTitleById';
    const options = {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.token}`,
            uid: data.uid,
        },
        body: JSON.stringify({
            titleId: data.titleId,
            uid: data.uid,
        }),
    };

    return await makeRequest(url, options);

};

export default toggleFavorite;
