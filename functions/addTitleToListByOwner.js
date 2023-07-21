const verifyAuthentication = require('./middleware/verifyAuthentication');
const { fResponse } = require('./util/fResponse');
const config = require('./util/config');
const { db } = require('./util/admin');
const firebase = require('firebase');
const rr = require('rainbow-road');

if (!firebase.apps.length) firebase.initializeApp(config);

exports.handler = async req => {
    verifyAuthentication(req);
    const { title, uid } = JSON.parse(req.body);

    const response = db
        .collection('user_lists')
        .where('owner', '==', uid)
        .orderBy('date_created', 'desc')
        .get()
        .then(async data => {
            let newList = new Set(data.docs[0].data().contents);
            newList.add(title);
            newList = Array.from(newList);
            rr.succ('List Found Successfully!');

            const updateResult = db
                .collection('user_lists')
                .doc(data.docs[0].id)
                .update({
                    contents: newList,
                    last_modified: new Date().toISOString()
                })
                .then(data => {
                    rr.succ('Title Added Successfully!');
                    return fResponse(200, {
                        type: 'success',
                        message: 'List updated successfully!',
                        list: newList
                    });
                })
                .catch(err => {
                    rr.err(`${err}`);
                    return fResponse(500, { type: 'danger', error: err });
                });
            return await updateResult;
        })
        .catch(err => {
            rr.err(`${err}`);
            return fResponse(500, { type: 'danger', error: err });
        });
    return await response;
};
