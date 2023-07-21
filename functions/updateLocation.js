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

    const requestBody = JSON.parse(req.body);

    const newLocation = reduceLocation(requestBody.newLocation);
    if (!newLocation)
        return fResponse(500, {
            type: 'danger',
            error: 'New location missing from request body!'
        });

    if (requestBody.newLocation === requestBody.currentLocation) {
        rr.err('New location cannot be the same as current location!');
        return fResponse(400, {
            type: 'danger',
            error: 'New location cannot be the same as current location!'
        });
    }

    const response = db
        .doc(`/users/${req.headers.uid}`)
        .update({ location: newLocation })
        .then(() => {
            rr.succ(`Location Changed Successfully!
          old: ${requestBody.currentLocation}
          new: ${newLocation}
          `);
            return fResponse(200, {
                type: 'success',
                message: 'Location updated successfully.',
                location: newLocation
            });
        })
        .catch(err => {
            rr.err(`${err}`);
            return fResponse(500, {
                type: 'danger',
                error: err
            });
        });
    return response;
};
