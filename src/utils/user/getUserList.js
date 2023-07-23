import makeRequest from '../general/makeRequest';

export const getUserList = async data => {
    const url = '/api/getListByOwner';
    const options = {
        method: 'POST',
        mode: 'cors',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ uid: data })
    };

    return await makeRequest(url, options);
};

export default getUserList;
