'use strict';

const express = require('express');
const router = express.Router();
const options = require('../../options');
// Middlewares
const adminBroMiddleware = require('../../Middlewares/adminBro.middleware');
const authMiddleware = require('../../Middlewares/checkAuth.middleware');

/* /admin */
router.use('/', authMiddleware.checkAuthAdmin, adminBroMiddleware);

module.exports = router;