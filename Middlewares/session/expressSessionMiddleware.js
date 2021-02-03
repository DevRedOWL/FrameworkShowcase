`use strict`

const session = require('express-session');
const options = require('../../options');

module.exports = session({
    secret: options.session.secretKey,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: options.session.TTL,
        httpOnly: false
    }
})