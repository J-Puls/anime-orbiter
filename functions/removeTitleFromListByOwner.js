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

        const { titleId, uid } = JSON.parse(req.body);

        const list_data = await db
            .collection('user_lists')
            .where('owner', '==', uid)
            .get();

        let list = list_data.docs?.[0]?.data?.()?.contents;

        console.log('prev list:', list);

        if (list.find(item => item?.id === titleId)) {

            list = list.filter(item => item?.id !== titleId);

            console.log('new list:', list);

            const payload = {
                contents: list,
                last_modified: new Date().toISOString()
            };

            await db
                .collection('user_lists')
                .doc(list_data?.docs?.[0]?.id)
                .update(payload);

            rr.succ('List updated successfully!');
        
        } else {

            rr.warn('List item not found');
        
        }

        return fResponse(200, {
            type: 'success',
            message: 'List updated successfully.',
            list
        });
    
    } catch (err) {

        return fResponse(500, {
            type: 'danger',
            error: err?.message || 'An unknown error occurred'
        });
    
    }

};
