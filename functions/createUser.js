const { validateSignupData } = require('./util/validators');
const { fResponse } = require('./util/fResponse');
const config = require('./util/config');
const { db } = require('./util/admin');
const firebase = require('firebase');
const rr = require('rainbow-road');

const DEFAULT_IMG_URL = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/no-img.png?alt=media`;

if (!firebase.apps.length) firebase.initializeApp(config);

exports.handler = async req => {
    try {
        const { username, email, password, confirmPassword } = JSON.parse(
            req.body
        );

        const account_data = await db
            .collection('users')
            .where('username', '==', username)
            .get();

        const account_exists = account_data.docs?.[0];

        if (!!account_exists)
            return fResponse(400, {
                type: 'danger',
                error: 'This username is already taken!'
            });

        // Create a new Firebase Authentication entry
        const credentials = await firebase
            .auth()
            .createUserWithEmailAndPassword(email, password);

        // If account creation fails, return failure response
        if (!credentials.user.uid)
            return fResponse(400, {
                type: 'danger',
                error: 'Failed to validate credentials.'
            });

        rr.info(`${credentials.user}`);
        rr.succ(`Account created successfully with the above credentials`);

        const payload = {
            username,
            email,
            password,
            confirmPassword
        };

        // Validate user signup credentials
        const validation = validateSignupData(payload);
        if (!validation?.valid)
            return fResponse(400, { type: 'danger', error: validation?.error });
        rr.succ('Credentials Validated Successfully!');

        const profileInfo = {
            username,
            email,
            date_created: new Date().toISOString(),
            image_url: DEFAULT_IMG_URL,
            uid: credentials.user.uid
        };

        // Create profile and list with validated credentials

        await db.doc(`/users/${credentials?.user?.uid}`).set(profileInfo);

        const list = {
            owner: credentials.user.uid,
            contents: [],
            date_created: new Date().toISOString()
        };
        rr.succ('User Profile Created Successfully!');

        await db.collection('user_lists').add(list);

        rr.succ(`User List Created Successfully!`);

        const token = await credentials.user.getIdToken();

        return fResponse(201, {
            type: 'success',
            message: 'User and list created successfully!',
            credentials: profileInfo,
            token
        });
    } catch (err) {
        return fResponse(500, { type: 'danger', error: err?.message || err });
    }
};
