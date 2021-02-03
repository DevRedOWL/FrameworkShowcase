'use strict';

const router = require('express').Router();
const options = require('../../options');
const passport = require('passport');
// Middlewares
const authMiddleware = require('../../Middlewares/checkAuth.middleware');
const limiterMiddleware = require('../../Middlewares/limiter.middleware');
const { validate, body, query } = require('../../Middlewares/validation.middleware');
// Models
const User = require('../../Models/User');
const EmailConfirmation = require('../../Models/EmailConfirmation');
const resModel = require('../../Models/responseModel');
// Controllers 
const mailingController = require('../../Controllers/mailingController');
const authController = require('../../Controllers/authController');

/* Load routes from this directory */
const directoryPath = require('path').join(options.root, 'Routes', 'auth');
for (let fileName of require('fs').readdirSync(directoryPath)) {
    if (fileName.indexOf('.routes.js') !== -1 && fileName != 'index.routes.js') {
        try {
            let routeName = `/${fileName.split('.').slice(0, -2).join('/')}`;
            router.use(routeName, require(`./${fileName}`));
            // console.log(`${fileName} loaded as endpont '${routeName}'`);
        }
        catch (ex) {
            console.error(`Unable to load route: ${fileName}\n${ex}`);
        }
    }
    else {
        if (fileName != 'index.routes.js') console.error(`${fileName} is not a .routes file`);
    }
}

/* /auth/ */
router.post('/', authMiddleware.checkAuth, function (req, res, next) {
    return res.send(new resModel.CompleteModel({ 'email': req.user.email }));
});
router.get('/', authMiddleware.checkAuth, function (req, res, next) {
    return res.send(new resModel.CompleteModel({
        'email': req.user.email,
        'vkontakteID': req.user.vkontakteID,
        'googleID': req.user.googleID,
        'facebookID': req.user.facebookID
    }));
});

/* /auth/login */
router.post('/login', passport.authenticate('auth_local'), function (req, res, next) {
    return res.send(new resModel.CompleteModel({ 'email': req.user.email }));
});

/* /auth/register */
router.post('/register',
    // Use validation middleware
    validate([
        body('email').isEmail().normalizeEmail().bail(),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 symbols').bail(),
        body('firstName').optional().escape().isLength({ min: 6, max: 33 }),
        body('lastName').optional().escape().isLength({ min: 6, max: 33 })
    ]),
    // Limit amount of requests
    limiterMiddleware.signUpLimiter,
    // Process the request
    async function (req, res, next) {
        // Find all users
        let users = await User.findAll({ where: { email: req.body.email } });
        if (users.length) return res.send('This email is already taken');
        // If not exist create new
        let newUser = await User.create(req.body);
        // Prepare verify message
        let verify_code = authController.generateVerificationCode(req.body.email);
        mailingController.sendEmailVerification(req.body.email, verify_code, async (error) => {
            if (error) return res.send(new resModel.ErrorModel(`Unable to send Email, ${error}`));
            else {
                await EmailConfirmation.create({ confirmationCode: verify_code, userEmail: newUser.email });
                return res.send(new resModel.CompleteModel({ user: newUser }));
            }
        });
    });

/* /auth/verify */
router.get('/verify',
    validate([query('code').isLength({ min: 10 }).withMessage('Wrong code parametr')]),
    async function (req, res, next) {
        // Find all users
        let confirmEntity = await EmailConfirmation.findAll({ where: { confirmationCode: req.query.code } });
        if (!confirmEntity.length) return res.send('Wrong verification code');
        // If find
        confirmEntity[0].confirmEmail((err, data) => res.send(err ? new resModel.ErrorModel(err) : new resModel.CompleteModel(data)));
    });

/* /auth/logout */
router.post('/logout', authMiddleware.checkAuth, function (req, res, next) {
    req.logout();
    return res.send(new resModel.CompleteModel());
});
router.get('/logout', authMiddleware.checkAuthRedirect('/'), function (req, res, next) {
    req.logout();
    return res.redirect('/');
});

module.exports = router;