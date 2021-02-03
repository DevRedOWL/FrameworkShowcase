'use strict';

const BaseController = require('./baseController');
const options = require('../options');
const pug = require('pug');

class MailingController extends BaseController {
    constructor() {
        super();
    }

    sendEmailVerification(email, verify_code, callback) {
        let verify_url = `${options.host}auth/verify?code=${verify_code}`; // ${req.protocol}://${req.headers.host}
        var message = {
            from: options.mailerTransport.options.auth.user,
            to: email,
            subject: "Verify account",
            text: `Please, follow this link to verify your account: ${verify_url}`,
            html: `<!DOCTYPE HTML><h1>Account verification</h1><br><a href="${verify_url}">Verify</a>`
        };
        options.mailerTransport.sendMail(message, async (err) => {
            callback(err);
        });
    }
}

const controller = new MailingController();
module.exports = controller;