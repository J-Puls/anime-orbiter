const verifyAuthentication = require('./middleware/verifyAuthentication');
const { reduceMotto } = require('./util/validators');
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

        const newMotto = reduceMotto(request.newMotto);
        if (!newMotto) throw 'No motto supplied.';

        if (request.newMotto === request.currentMotto) {
            throw 'New motto cannot be the same as current motto!';
        }

        if (request.newMotto.length <= 5) {
            throw 'New motto must be at least 5 characters long!';
        }

        await db.doc(`/users/${req.headers.uid}`).update({ motto: newMotto });
        rr.succ(`Motto Changed Successfully!`);

        return fResponse(200, {
            type: 'success',
            message: 'Motto updated successfully.',
            motto: newMotto
        });
    } catch (err) {
        return fResponse(500, { type: 'danger', error: err?.message || err });
    }
};
