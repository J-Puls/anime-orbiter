const verifyAuthentication = require('./middleware/verifyAuthentication');
const { reduceLocation } = require('./util/validators');
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
        const requestBody = JSON.parse(req.body);

        const newLocation = reduceLocation(requestBody?.newLocation);
        if (!newLocation) throw 'No location supplied.';

        if (requestBody?.newLocation === requestBody?.currentLocation)
            throw 'New location cannot be the same as current location!';

        await db
            .doc(`/users/${req.headers.uid}`)
            .update({ location: newLocation });

        rr.succ(`Location Changed Successfully!`);
        return fResponse(200, {
            type: 'success',
            message: 'Location updated successfully.',
            location: newLocation
        });
    } catch (err) {
        return fResponse(500, { type: 'danger', error: err?.message || err });
    }
};
