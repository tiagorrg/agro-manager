const express = require('express');
const router = express.Router();
const recommendationsController = require('../controllers/recommendationsController');

router.get('/', recommendationsController.getAll);

module.exports = router;
