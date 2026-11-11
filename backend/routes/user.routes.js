const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');
const auth = require('../middleware/auth'); 
const requireAdmin = require('../middleware/requireAdmin');
router.post('/login', controller.login);


router.get('/', auth, requireAdmin, controller.getAll);
router.get('/:id', auth, requireAdmin, controller.getById);
router.post('/', auth, requireAdmin, controller.create);
router.put('/:id', auth, requireAdmin, controller.update);
router.delete('/:id', auth, requireAdmin, controller.delete);

module.exports = router;
