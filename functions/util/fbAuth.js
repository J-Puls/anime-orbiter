const { admin, db } = require('./admin');
const rr = require('rainbow-road');

// Verifies the current user before processing the request
module.exports = (req) => {

    let idToken;
    const uid = req.headers.uid;

    if (
        req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
    ) {

        idToken = req.headers.authorization.split('Bearer ')[1];
  
    } else {

        rr.err('No token found');
        return false;
  
    }

    const isAuthenticated = admin
        .auth()
        .verifyIdToken(idToken)
        .then((decodedToken) => {

            req.user = decodedToken;
    
        })
        .then(() => {

            return db
                .doc(`/users/${uid}`)
                .get()
                .then((data) => data.data())
                .catch((err) => rr.err(`${err}`));
    
        })
        .then((data) => {

            req.user.username = data.username;
            rr.succ('Authentication Successful!');
            return true;
    
        })
        .catch((err) => {

            rr.err(`${err}`);
            return false;
    
        });
    return isAuthenticated;

};
