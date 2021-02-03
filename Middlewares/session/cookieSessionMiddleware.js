`use strict`

const cookieSession = require('cookie-session');
const options = require('../../options');

module.exports = cookieSession({
    maxAge: options.session.TTL,
    secret: options.session.secretKey,
    // keys: [options.session.secretKey]
})