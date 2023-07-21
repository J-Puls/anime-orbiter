const { validateLoginData } = require('./util/validators');
const { fResponse } = require('./util/fResponse');
const config = require('./util/config');
const { db } = require('./util/admin');
const firebase = require('firebase');
const rr = require('rainbow-road');

if (!firebase.apps.length) firebase.initializeApp(config);

exports.handler = async req => {
    try {
        const { email, password } = JSON.parse(req.body);
        const credentials = { email, password };

        const { valid, errors } = validateLoginData(credentials);
        if (!valid) return fResponse(400, { type: 'danger', error: errors });

        const auth_data = await firebase
            .auth()
            .signInWithEmailAndPassword(email, password);

        const token = await auth_data?.user?.getIdToken();
        rr.succ('Login Successful!');

        const user_record = await db
            .collection('users')
            .where('email', '==', email)
            .get();

        const { username, uid } = user_record?.docs?.[0]?.data?.() || {};

        return fResponse(200, {
            type: 'success',
            message: 'login successful',
            token,
            username,
            uid
        });
    } catch (e) {
        const { code, message } = e || {};

        rr.err(`${message}`);

        switch (code) {
            case 'auth/wrong-password':
                return fResponse(403, {
                    type: 'danger',
                    error: 'Wrong password. Please try again.'
                });
            case 'auth/user-not-found':
                return fResponse(403, {
                    type: 'danger',
                    error: 'No account found for that email. Please try again.'
                });
            case 'auth/too-many-requests':
                return fResponse(403, {
                    type: 'danger',
                    error: 'Too many failed login attempts. Please wait a moment before trying again.'
                });
            default:
                return fResponse(500, {
                    type: 'danger',
                    error: `An error occurred: ${message}`
                });
        }
    }
};
