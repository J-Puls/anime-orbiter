import { err } from 'rainbow-road';

export const authenticateAndLogin = async data => {

    try {

        const url = '/api/loginUser/';
        const options = {
            method: 'POST',
            mode: 'cors',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };

        const response = await fetch(url, options);
        return await response.json();
    
    } catch (e) {

        err(e?.message || e);
    
    }

};

export default authenticateAndLogin;
