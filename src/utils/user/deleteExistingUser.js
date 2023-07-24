import makeRequest from '../general/makeRequest';

export const deleteExistingUser = async data => {

    const url = '/api/deleteUser';
    const options = {
        method: 'POST',
        mode: 'cors',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            uid: data.uid,
            Authorization: `Bearer ${data.token}`,
        },
        body: JSON.stringify(data),
    };

    return await makeRequest(url, options);

};

export default deleteExistingUser;
