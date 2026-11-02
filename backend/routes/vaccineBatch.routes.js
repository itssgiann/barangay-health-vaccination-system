const express = require('express');
const router = express.Router();
const controller = require('../controllers/vaccineBatch.controller');

router.get('/', controller.getAll);
router.get('/with-vaccines', controller.getWithVaccines);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;