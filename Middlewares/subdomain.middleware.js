const options = require('../options');
const apiRouter = require('../Routes/api/index.routes');
const authRouter = require('../Routes/auth/index.routes');
const limiter = require('../Middlewares/limiter.middleware');

module.exports.middleware = (req, res, next) => {
    if (req.subdomains.length !== 1) return next();
    else switch (req.subdomains[0]) {
        case 'api': return apiRouter.handle(req, res, next);
        case 'auth': return authRouter.handle(req, res, next);
        default: return;
    }
};