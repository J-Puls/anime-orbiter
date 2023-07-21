const verifyAuthentication = require('./middleware/verifyAuthentication');
const { fResponse } = require('./util/fResponse');
const config = require('./util/config');
const { db } = require('./util/admin');
const firebase = require('firebase');
const rr = require('rainbow-road');

if (!firebase.apps.length) firebase.initializeApp(config);

exports.handler = async req => {
    verifyAuthentication(req);

    let responseData = {};
    const uid = req?.headers?.uid;

    try {
        const user_doc = await db.doc(`/users/${uid}`).get();

        if (!user_doc?.exists)
            return fResponse(500, {
                type: 'danger',
                error: 'Account not found.'
            });

        rr.succ('Account Found Successfully!');
        responseData.credentials = user_doc.data();

        const list_doc = await db
            .collection('user_lists')
            .where('owner', '==', uid)
            .orderBy('date_created', 'desc')
            .get();

        const list = list_doc?.docs?.[0]?.data?.()?.contents;

        if (!list)
            return fResponse(500, {
                type: 'danger',
                error: 'No list found for this account.'
            });

        rr.succ('List Found Successfully!');
        responseData.list = [...list];
    } catch (err) {
        rr.err(`${err}`);
        return fResponse(500, {
            type: 'danger',
            error: `An error occurred: ${err?.message || err}`
        });
    }

    const response = fResponse(200, {
        type: 'success',
        message: 'Details retrieved successfully.',
        ...responseData
    });

    rr.succ('All Data Found Successfully!');
    return response;
};
