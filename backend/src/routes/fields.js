const express = require('express');
const router = express.Router();
const fieldsController = require('../controllers/fieldsController');

router.get('/', fieldsController.getAll);
router.get('/:id', fieldsController.getById);
router.put('/:id', fieldsController.update);

module.exports = router;
