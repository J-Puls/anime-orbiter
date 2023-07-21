const verifyAuthentication = require('./middleware/verifyAuthentication');
const { fResponse } = require('./util/fResponse');
const { db, admin } = require('./util/admin');
const config = require('./util/config');
const firebase = require('firebase');
const rr = require('rainbow-road');

if (!firebase.apps.length) firebase.initializeApp(config);

exports.handler = async req => {
    if (req.headers.uid === process.env.REACT_APP_PUBLIC_USER_UID) {
        rr.err('Cannot Delete Public Account.');
        return fResponse(403, {
            type: 'danger',
            error: "Nice try, you're not allowed to delete the 'Public User' account!"
        });
    }

    verifyAuthentication(req);

    const data = JSON.parse(req.body);
    const { uid } = data;
    let response;

    response = admin
        .auth()
        .deleteUser(uid)
        .then(() => {
            rr.succ('Account Deleted Successfully! ');
            return fResponse(200, {
                type: 'success',
                message: 'Account deleted successfully.'
            });
        })
        .catch(err => {
            rr.err(`${err}`);
            return fResponse(500, { error: err, type: 'error' });
        });

    response = db
        .collection('user_lists')
        .where('owner', '==', uid)
        .get()
        .then(data => {
            db.collection('user_lists')
                .doc(data.docs[0].id)
                .delete()
                .then(() => rr.succ('List Deleted Successfully!'))
                .catch(err => {
                    rr.err(`${err}`);
                    return fResponse(500, { error: err });
                });
            return fResponse(200, {
                type: 'success',
                message: 'List deleted successfully.'
            });
        })
        .catch(err => {
            rr.err(`${err}`);
            return fResponse(500, { error: err });
        });

    response = db
        .collection('users')
        .doc(uid)
        .delete()
        .then(() => rr.succ('Profile Deleted Successfully!'))
        .then(() => {
            return fResponse(200, {
                message: 'Account, Profile and List deleted successfully!',
                type: 'success'
            });
        })
        .catch(err => {
            rr.err(`${err}`);
            return fResponse(500, { error: err, type: 'danger' });
        });
    return response;
};
