const {
  generateDocument,
  getTemplatesResponse,
  removeTemplate,
  uploadTemplate,
} = require('../services/documents/documentTemplateService');

const DOCX_CONTENT_TYPE = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

function sendSuccess(res, status, data) {
  return res.status(status).json({
    ok: true,
    data,
  });
}

function sendError(res, error) {
  const status = error && error.status ? error.status : 500;
  const message = error && error.message ? error.message : 'Внутренняя ошибка сервера';

  return res.status(status).json({
    ok: false,
    error: {
      code: error && error.code ? error.code : 'INTERNAL_SERVER_ERROR',
      message,
      details: error && error.details ? error.details : null,
    },
  });
}

exports.listTemplates = (req, res) => {
  try {
    return sendSuccess(res, 200, getTemplatesResponse());
  } catch (error) {
    return sendError(res, error);
  }
};

exports.uploadTemplate = async (req, res) => {
  try {
    const template = await uploadTemplate(req.body || {});
    return sendSuccess(res, 201, { template });
  } catch (error) {
    return sendError(res, error);
  }
};

exports.deleteTemplate = async (req, res) => {
  try {
    const result = await removeTemplate(req.params.templateId);
    return sendSuccess(res, 200, result);
  } catch (error) {
    return sendError(res, error);
  }
};

exports.generateDocument = async (req, res) => {
  try {
    const generated = await generateDocument(req.body || {});

    res.setHeader('Content-Type', DOCX_CONTENT_TYPE);
    res.setHeader('Content-Disposition', `attachment; filename="${generated.fileName}"`);
    res.setHeader('X-Document-Template-Id', generated.templateId);
    res.setHeader('X-Document-Template-Type', generated.templateType);
    res.setHeader('X-Document-Mode', generated.mode || '');

    return res.status(200).send(generated.buffer);
  } catch (error) {
    return sendError(res, error);
  }
};
