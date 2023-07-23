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

    try {
        const data = JSON.parse(req.body);
        const { uid } = data;

        const user_list = await db
            .collection('user_lists')
            .where('owner', '==', uid)
            .get();

        // Delete the user's list record
        await db
            .collection('user_lists')
            .doc(user_list?.docs?.[0]?.id)
            .delete();
        rr.succ('User List Deleted Successfully!');

        // Delete the user's profile record
        await db.collection('users').doc(uid).delete();
        rr.succ('Profile Deleted Successfully!');

        // Delete the user's authentication record
        await admin.auth().deleteUser(uid);
        rr.succ('Account Deleted Successfully! ');

        return fResponse(200, {
            message: 'Account and all associated data deleted.',
            type: 'success'
        });
    } catch (err) {
        return fResponse(500, { error: err?.message || err, type: 'error' });
    }
};
