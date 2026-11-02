const express = require('express');
const router = express.Router();
const controller = require('../controllers/batchExpiry.controller');

router.get('/expiring', controller.getExpiring);
router.post('/check', controller.runCheck);

module.exports = router;
