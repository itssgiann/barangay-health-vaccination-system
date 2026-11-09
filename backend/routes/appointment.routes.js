const express = require('express');
const router = express.Router();
const controller = require('../controllers/appointment.controller');
const auth = require('../middleware/auth');

router.post('/', auth, controller.create);
router.get('/', controller.getAll);
router.get('/with-records', controller.getWithRecords);
router.get('/:id', controller.getById);

router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;