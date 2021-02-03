'use strict';

// Thirtd-party libraries
exports.env = require('dotenv').config().parsed; // First of all load environment
const fs = require("fs"); // Filesystem

// Root folder
exports.root = __dirname;

// Server state
const state = exports.state = {
    startup_time: Date.now(),
    debug: (process.env.NODE_ENVIRONMENT.toLowerCase() == 'dev' || process.argv.indexOf('--env-dev') !== -1),
    isMasterThread: ( // For cluster mode
        (process.env['NODE APP INSTANCE'] && process.env['NODE APP INSTANCE'] === '0') ||
        (process.env.NODE_APP_INSTANCE && process.env.NODE_APP_INSTANCE === '0') ||
        (process.env.NODE_APP_INSTANCE === undefined && process.env['NODE APP INSTANCE'] === undefined)
    )
}

// General data
exports.host = `http${state.debug ? '' : 's'}://${process.env.NODE_HOST ? process.env.NODE_HOST : 'localhost'}/`;
exports.secret = process.env.NODE_APP_SECRET;
exports.port = {
    http: 80,
    https: 443
};

// Contacts
exports.contacts = {
    email: {
        appointment: process.env.NODE_CONTACT_EMAIL_APPOINTMENT ? process.env.NODE_CONTACT_EMAIL_APPOINTMENT : process.env.NODE_SMTP_LOGIN
    }
}

// SSL Options
exports.ssl = {
    key: fs.readFileSync('SSL/' + (process.env.NODE_SSL_KEY_NAME ? process.env.NODE_SSL_KEY_NAME : 'certificate.crt')),
    cert: fs.readFileSync('SSL/' + (process.env.NODE_SSL_CRT_NAME ? process.env.NODE_SSL_CRT_NAME : 'certificate.key')),
    requestCert: false,
    rejectUnauthorized: false,
};

// Database connection
const Sequelize = require('sequelize'); // library for mapping models
exports.db = {
    sync: {
        allow_force: (process.env.NODE_SEQUELIZE_ALLOW_FORCE_SYNC === 'true'),
        allow_alter: (process.env.NODE_SEQUELIZE_ALLOW_ALTER_SYNC === 'true')
    },
    sequelize: new Sequelize(
        process.env.NODE_SEQUELIZE_DB_NAME,
        process.env.NODE_SEQUELIZE_DB_USERNAME ? process.env.NODE_SEQUELIZE_DB_USERNAME : '',
        process.env.NODE_SEQUELIZE_DB_PASSWORD ? process.env.NODE_SEQUELIZE_DB_PASSWORD : '',
        {
            host: process.env.NODE_SEQUELIZE_DB_HOST ? process.env.NODE_SEQUELIZE_DB_HOST : '127.0.0.1',
            dialect: process.env.NODE_SEQUELIZE_DIALECT,
            logging: (state.debug && process.env.NODE_SEQUELIZE_PRINT_DEBUG != 'false' || process.env.NODE_SEQUELIZE_PRINT_DEBUG == 'true')
                ? (message) => console.log(`\x1b[35m${message}\x1b[0m`)
                : false,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            },
            define: {
                timestamps: false, // only columun name you have, without = id, createdAt, updatedAt
                freezeTableName: true // only table name you have, without = tablename(s)
            }
        }),
    mongoDB: {
        dbString: process.env.NODE_MONGO_DB_CONNECTION_STRING,
        dbNames: process.env.NODE_MONGO_DB_DBNAMES.split(',')
    }
}

// Email
const nodemailer = require('nodemailer');
exports.mailerTransport = nodemailer.createTransport({
    host: process.env.NODE_SMTP_HOST,
    port: process.env.NODE_SMTP_PORT ? Number(process.env.NODE_SMTP_PORT) : 465,
    secure: true, // use TLS
    auth: {
        user: process.env.NODE_SMTP_LOGIN,
        pass: process.env.NODE_SMTP_PASSWORD
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    }
});

// Init server
const initScripts = require('./init');
exports.init = (callback) => {
    initScripts.startInitialize(state.isMasterThread, callback,
        initScripts.initSequelize(exports.db.sequelize),
        initScripts.syncDBTables(`${exports.root}/Models`, { force: false, alter: true }),
        initScripts.initMailer(exports.mailerTransport)
    );
}

// Session settings
exports.session = {
    secretKey: process.env.NODE_SESSION_SECRET,
    TTL: process.env.NODE_SESSION_ALIVE ? Number(process.env.NODE_SESSION_ALIVE) : (24 * 60 * 60 * 1000),
    middleware: () => require('./Middlewares/session/cookieSessionMiddleware')
};

// Redis settings
exports.redis = {
    host: process.env.NODE_REDIS_HOST ? process.env.NODE_REDIS_HOST : '127.0.0.1',
    port: process.env.NODE_REDIS_PORT ? Number(process.env.NODE_REDIS_PORT) : 6379,
    secretKey: process.env.NODE_REDIS_SECRET
}

// A settings
exports.integrations = {
    vk: {
        appID: process.env.NODE_VK_APP_ID,
        appSecret: process.env.NODE_VK_APP_SECRET
    },
    facebook: {
        appID: process.env.NODE_FB_APP_ID,
        appSecret: process.env.NODE_FB_APP_SECRET
    },
    google: {
        appID: process.env.NODE_GOOGLE_CLIENT_ID,
        appSecret: process.env.NODE_GOOGLE_CLENT_SECRET
    }
}

// Cookie Settings
exports.cookiesecretKey = process.env.NODE_COOKIES_SECRET;
exports.cookieSettings = () => { return { expires: new Date(Date.now() + Number(process.env.NODE_COOKIES_ALIVE)), signed: true } };

// Static config
exports.staticServeOptions = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['htm', 'html'],
    fallthrough: true,
    index: false,
    maxAge: '1d',
    redirect: false,
    setHeaders: function (res, path, stat) {
        res.set('x-timestamp', Date.now())
    }
}

// Git Webhooks Secret
exports.gitWebhooksSecret = process.env.NODE_GIT_WEBHOOK_SECRET;
exports.gitWebhooksReference = process.env.NODE_GIT_WEBHOOK_REFERENCE;
exports.reloadScriptName = 'lin_reload_pm2.sh';