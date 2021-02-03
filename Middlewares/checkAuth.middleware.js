const resModel = require('../Models/responseModel');

module.exports.checkAuth = (req, res, next) => {
    if (req.user)
        return next();
    else return res.status(401).send(new resModel.ErrorModel('Not authorized'));
}

module.exports.checkAuthRedirect = (redirectTo) => (req, res, next) => {
    if (req.user)
        return next();
    else return res.redirect(redirectTo);
}