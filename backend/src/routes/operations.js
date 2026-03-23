const express = require('express');
const router = express.Router();
const operationsController = require('../controllers/operationsController');

router.get('/', operationsController.getAll);
router.post('/', operationsController.create);
router.get('/:id', operationsController.getById);
router.patch('/:id/reschedule', operationsController.reschedule);
router.patch('/:id/status', operationsController.patchStatus);

module.exports = router;
