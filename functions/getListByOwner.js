const verifyAuthentication = require('./middleware/verifyAuthentication');
const { fResponse } = require('./util/fResponse');
const config = require('./util/config');
const { db } = require('./util/admin');
const firebase = require('firebase');
const rr = require('rainbow-road');

if (!firebase.apps.length) firebase.initializeApp(config);

exports.handler = async req => {

    verifyAuthentication(req);

    try {

        const { uid } = JSON.parse(req.body);

        const list_data = await db
            .collection('user_lists')
            .where('owner', '==', uid)
            .orderBy('date_created', 'desc')
            .get();

        rr.succ('List Retrieved Successfully!');
        return fResponse(200, {
            type: 'success',
            list: list_data?.docs?.[0]?.data?.()?.contents,
            message: 'List retrieved successfully.'
        });
    
    } catch (err) {

        rr.err(`${err}`);
        return fResponse(500, { type: 'danger', error: err.message || err });
    
    }

};
