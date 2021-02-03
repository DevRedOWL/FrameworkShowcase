'use strict';

const redis = require('redis');
const options = require('../../options');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

let redisClient = redis.createClient(options.redis.port, options.redis.host, { no_ready_check: true });
redisClient.auth(options.redis.secretKey, function (err, reply) {
    if (err) console.log(`Redis not loaded state: ${err}`)
    else console.log(`Redis state: ${reply}`);
});

module.exports = session({
    store: new RedisStore({ client: redisClient }),
    secret: options.session.secretKey,
    resave: true,
    rolling: true,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: options.session.TTL,
        httpOnly: false,
    },
});
