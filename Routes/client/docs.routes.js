'use strict';

const express = require('express');
const router = express.Router();
const options = require('../../options');

/* /docs */
router.get('/', function (req, res, next) {
    return res.send('Default docs page');
});

/* /docs/api */
router.get('/api', function (req, res, next) {
    return res.sendFile('/Views/swaggerView.html', { "root": options.root });
});

/* /docs/gdpr */
router.get('/gdpr', function (req, res, next) {
    return res.sendFile('/Assets/docs/gdpr_ru.html', { "root": options.root });
});

module.exports = router;