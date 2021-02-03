const rateLimit = require("express-rate-limit");

// Limit api requests
exports.apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20, // Limit each IP to 15 requests per windowMs
    message: "Too many requests, please stay frosty" // chill the fuck out
});

// Limit all auth requests
exports.authLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 5 minute
    max: 20, // Limit each IP to 20 requests per windowMs
    message: "Too many auth attempts, please try in 5 minutes" // chill the fuck out
});

// Limit register requests
exports.signUpLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 60 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: "Too many accounts registered, please try in 1 hour" // chill the fuck out
});