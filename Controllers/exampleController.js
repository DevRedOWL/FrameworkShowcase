'use strict';

const BaseController = require('./baseController');

class ExampleController extends BaseController {
    constructor() {
        super();
    }

    exampleMethod() {
        console.log('This function does something');
    }

}

const controller = new ExampleController();
module.exports = controller;