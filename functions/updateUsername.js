const verifyAuthentication = require('./middleware/verifyAuthentication');
const { reduceUsername } = require('./util/validators');
const { fResponse } = require('./util/fResponse');
const config = require('./util/config');
const { db } = require('./util/admin');
const firebase = require('firebase');
const rr = require('rainbow-road');

if (!firebase.apps.length) firebase.initializeApp(config);

exports.handler = async req => {
    if (req.headers.uid === process.env.REACT_APP_PUBLIC_USER_UID) {
        rr.err('Cannot Modify Public Account.');
        return fResponse(403, {
            type: 'danger',
            error: "Sorry, modifications are not allowed to the 'Public User' account!"
        });
    }

    verifyAuthentication(req);

    const requestBody = JSON.parse(req.body);

    const nameInUse = await db
        .collection('/users/')
        .where('username', '==', requestBody.newUsername)
        .get()
        .then(data => {
            if (data.docs.length > 0) return true;
            return false;
        });

    if (nameInUse) {
        rr.err('Username Already Taken!');
        return fResponse(500, {
            type: 'danger',
            error: 'This username is already taken!'
        });
    }

    if (requestBody.newUsername === requestBody.currentUsername) {
        rr.err('New username cannot be the same as current username!');
        return fResponse(500, {
            type: 'danger',
            error: 'New username cannot be the same as current username!'
        });
    }

    if (requestBody.newUsername.length <= 5) {
        rr.err('New username too short!');
        return fResponse(500, {
            type: 'danger',
            error: 'New username must be at least 5 characters long!'
        });
    }

    const newUsername = reduceUsername(requestBody.newUsername);

    if (!newUsername)
        return fResponse(500, {
            type: 'danger',
            error: 'Username missing from request body!'
        });

    const response = db
        .doc(`/users/${req.headers.uid}`)
        .update({ username: newUsername })
        .then(() => {
            rr.succ(`Username Changed Successfully!
          old: ${requestBody.currentUsername}
          new: ${newUsername}
          `);
            return fResponse(200, {
                type: 'success',
                message: 'Username updated successfully.',
                username: newUsername
            });
        })
        .catch(err => {
            rr.err(`${err}`);
            return fResponse(500, {
                type: 'danger',
                error: err
            });
        });
    return response;
};
