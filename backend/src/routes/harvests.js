const express = require('express');
const router = express.Router();
const harvestsController = require('../controllers/harvestsController');

router.get('/', harvestsController.getAll);

module.exports = router;
