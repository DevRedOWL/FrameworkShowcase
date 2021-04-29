'use strict';

const express = require('express');
const router = express.Router();
const options = require('../../options');
// Middlewares
const adminBroMiddleware = require('../../Middlewares/adminBro.middleware');
const authMiddleware = require('../../Middlewares/checkAuth.middleware');
// Auth middleware
router.use(authMiddleware.checkAuthAdmin);

/* /admin */
router.get('/', (req, res) => { res.send('Admin panel'); });
router.use('/bro', adminBroMiddleware);

module.exports = router;