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

    try {
        const request = JSON.parse(req.body);

        const user_data = await db
            .collection('/users/')
            .where('username', '==', request.newUsername)
            .get();

        const name_exists = !!user_data?.docs?.[0];

        if (name_exists) throw 'This username is already taken!';

        const newUsername = reduceUsername(request.newUsername);

        if (!newUsername) throw 'No username supplied.';

        if (request.newUsername === request.currentUsername)
            throw 'New username cannot be the same as current username!';

        if (request.newUsername.length <= 5)
            throw 'New username must be at least 5 characters long!';

        await db
            .doc(`/users/${req.headers.uid}`)
            .update({ username: newUsername });
        rr.succ(`Username Changed Successfully!`);
        return fResponse(200, {
            type: 'success',
            message: 'Username updated successfully.',
            username: newUsername
        });
    } catch (err) {
        return fResponse(500, {
            type: 'danger',
            error: err?.message || err
        });
    }
};
