'use strict';

module.exports = function (req, res, next) {
    console.log('This middleware does something');
    next();
}