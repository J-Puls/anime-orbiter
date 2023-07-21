const { fResponse } = require('../util/fResponse');
const fbAuth = require('../util/fbAuth');

module.exports = async req => {
    if (await fbAuth(req))
        return fResponse(403, {
            type: 'danger',
            error: 'Authentication Failed'
        });
};
