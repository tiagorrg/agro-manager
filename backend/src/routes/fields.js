const express = require('express');
const router = express.Router();
const fieldsController = require('../controllers/fieldsController');

router.get('/', fieldsController.getAll);
router.get('/:id', fieldsController.getById);

module.exports = router;
