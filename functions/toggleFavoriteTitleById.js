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

        const user_list = await db
            .collection('user_lists')
            .where('owner', '==', uid)
            .orderBy('date_created', 'desc')
            .get();

        const list = user_list?.docs?.[0]?.data()?.contents;

        const to_update = list.find(item => item.id === titleId);
        if (!to_update) throw Error('Title not found in list.');

        console.log('is favorite:', to_update);

        list[list.indexOf(to_update)] = {
            ...to_update,
            favorite: !to_update.favorite
        };

        await db
            .collection('user_lists')
            .doc(user_list?.docs?.[0]?.id)
            .update({ contents: list });

        return fResponse(200, {
            type: 'success',
            message: 'Title updated successfully!',
            list
        });
    
    } catch (err) {

        return fResponse(500, { type: 'danger', error: err?.message || err });
    
    }

};
