'use strict';

const BaseController = require('./baseController');
const options = require('../options');

class AuthController extends BaseController {
    constructor() {
        super();
    }

    generateVerificationCode(email) {
        return email.split('.').join('-') + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

}

const controller = new AuthController();
module.exports = controller;