const express = require('express');
const router = express.Router();
const operationsController = require('../controllers/operationsController');

router.get('/', operationsController.getAll);
router.get('/:id', operationsController.getById);

module.exports = router;
