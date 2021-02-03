'use strict';

const router = require('express').Router();
const options = require('../../options');
const passport = require('passport');
// Middlewares
const authMiddleware = require('../../Middlewares/checkAuth.middleware');
const { validate, body, query } = require('../../Middlewares/validation.middleware');
// Models
const resModel = require('../../Models/responseModel');

// /auth/facebook/
router.get('/', passport.authenticate('auth_fb'), (req, res) => {
    // The request will be redirected to vk.com for authentication, so this function will not be called.
});

// /auth/facebook/callback
router.get('/callback',
    passport.authenticate('auth_fb', { failureRedirect: '/auth' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/auth');
    });

module.exports = router;