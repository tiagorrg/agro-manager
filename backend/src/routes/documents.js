const express = require('express');

const documentsController = require('../controllers/documentsController');

const router = express.Router();

router.get('/templates', documentsController.listTemplates);
router.post('/templates', documentsController.uploadTemplate);
router.delete('/templates/:templateId', documentsController.deleteTemplate);
router.post('/generate', documentsController.generateDocument);

module.exports = router;
