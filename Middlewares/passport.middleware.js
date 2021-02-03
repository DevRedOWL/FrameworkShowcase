`use strict`

const passport = require('passport');
const options = require('../options');
// Models
const User = require('../Models/User');

// Describe Google strategy
//const GoogleStrategy = require('passport-google-oauth20').Strategy;
/* passport.use(
    new GoogleStrategy({
        // Options for this strategy
    }), () => {
        // Callback but because of redirect this should not fire
    }
) */

// Describe local strategy
const LocalStrategy = require('passport-local').Strategy;
passport.use('auth_local', new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, email, password, done) {
        try {
            User.findOne({ where: { email } }).then((user) => {
                if (user && user.validatePassword(password)) {
                    if (user.emailConfirmed) return done(null, user);
                    else return done('Email not confirmed', false);
                }
                else return done('Wrong email or incorrect password', false);
            });
        }
        catch (ex) {
            return done(ex, false)
        }
    }
));

// Describe VK strategy
const VKStrategy = require('passport-vkontakte').Strategy;
passport.use('auth_vk', new VKStrategy(
    {
        clientID: options.integrations.vk.appID, // VK.com docs call it 'API ID', 'app_id', 'api_id', 'client_id' or 'apiId'
        clientSecret: options.integrations.vk.appSecret,
        callbackURL: options.host + "auth/vk/callback"
    },
    function (accessToken, refreshToken, params, profile, done) {
        User.passportFindOrCreate(profile, done);
    }
));

// Describe Facebook strategy
const FacebookStrategy = require('passport-facebook').Strategy;
passport.use('auth_fb', new FacebookStrategy(
    {
        clientID: options.integrations.facebook.appID,
        clientSecret: options.integrations.facebook.appSecret,
        callbackURL: options.host + "auth/facebook/callback"
    },
    function (accessToken, refreshToken, profile, done) {
        User.passportFindOrCreate(profile, done);
    }
));

// Describe Google strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy;
passport.use('auth_google', new GoogleStrategy(
    {
        clientID: options.integrations.google.appID,
        clientSecret: options.integrations.google.appSecret,
        callbackURL: options.host + "auth/google/callback"
    },
    function (accessToken, refreshToken, profile, done) {
        User.passportFindOrCreate(profile, done);
    }
));

// Get user from session by saved to session part of user data 
passport.deserializeUser(async (id, done) => {
    User.findByPk(id).then((user) => {
        if (user) return done(null, user);
        else return done(null, false);
    }).catch((ex) => done(null, false));
})

// Basically ave part of user data to session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

module.exports = passport;

/*
..:: Passport.js DOCS ::..
! Use passport.initialize(), passport.session() and session middleware before routing

app.get('/login_strategy', passport.authenticate('strategy_name'), cb(req, res, next))
->
serialize user from done(err, id) passed params
->
app.get('secret'), (req, res, next) -> { req.user(); }
->
deserialize user data from session with done(err, user)
*/