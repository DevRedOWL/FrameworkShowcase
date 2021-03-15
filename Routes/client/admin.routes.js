'use strict';

const express = require('express');
const router = express.Router();
const options = require('../../options');
// Middlewares
const adminBroMiddleware = require('../../Middlewares/adminBro.middleware');

/* /admin */
router.use('/', adminBroMiddleware);

module.exports = router;