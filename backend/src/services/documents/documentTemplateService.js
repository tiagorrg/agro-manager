const path = require('path');

const { createHttpError } = require('../../utils/httpError');
const {
  TEMPLATE_TYPES,
  getTokenCatalogByType,
  getSupportedModes,
} = require('./templateDictionary');
const {
  addTemplate,
  assertTemplateType,
  deleteTemplate,
  getTemplateOrThrow,
  listTemplates,
} = require('./templateStorage');
const {
  assertDocxFileName,
  decodeBase64Docx,
  validateTemplateBuffer,
} = require('./templateValidation');
const { resolveDocumentData } = require('./documentDataResolver');
const { renderDocumentBuffer } = require('./documentRenderer');

function deriveTemplateName(name, templateFileName) {
  if (name && typeof name === 'string' && name.trim()) {
    return name.trim();
  }

  return String(templateFileName || 'template.docx').replace(/\.docx$/i, '');
}

function buildDownloadFileName(templateName) {
  const sanitizedBaseName = String(templateName || 'document')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase() || 'document';

  return sanitizedBaseName.endsWith('.docx') ? sanitizedBaseName : `${sanitizedBaseName}.docx`;
}

async function uploadTemplate(payload) {
  const templateType = payload.type || payload.templateType;
  const templateFileName = payload.templateFileName;
  const templateContentBase64 = payload.templateContentBase64;

  assertTemplateType(templateType);
  assertDocxFileName(templateFileName);

  const buffer = decodeBase64Docx(templateContentBase64);
  if (!buffer.length) {
    throw createHttpError(400, 'EMPTY_TEMPLATE_FILE', 'Загруженный DOCX шаблон пустой');
  }

  const validation = validateTemplateBuffer({
    buffer,
    templateType,
  });

  return addTemplate({
    name: deriveTemplateName(payload.name, templateFileName),
    type: templateType,
    originalFileName: templateFileName,
    buffer,
    validation,
  });
}

function getTemplatesResponse() {
  return {
    templates: listTemplates(),
    templateTypes: Object.values(TEMPLATE_TYPES),
    tokenCatalogByType: getTokenCatalogByType(),
  };
}

async function removeTemplate(templateId) {
  return deleteTemplate(templateId);
}

async function generateDocument(payload) {
  const { templateId, mode, operationId, date, dateFrom, dateTo, fieldId } = payload || {};

  if (!templateId) {
    throw createHttpError(400, 'TEMPLATE_ID_REQUIRED', 'Для генерации документа необходимо передать templateId');
  }

  const template = getTemplateOrThrow(templateId);
  if (!template.isValid) {
    throw createHttpError(422, 'TEMPLATE_INVALID', 'Нельзя генерировать документ по невалидному шаблону', {
      templateId,
      validationErrors: template.validationErrors,
      unknownTokens: template.unknownTokens,
    });
  }

  const documentData = resolveDocumentData({
    template,
    mode,
    operationId,
    date,
    dateFrom,
    dateTo,
    fieldId,
  });

  const buffer = await renderDocumentBuffer({
    templatePath: path.resolve(template.filePath),
    data: documentData,
  });

  return {
    buffer,
    fileName: buildDownloadFileName(payload.outputFileName || template.name),
    templateId: template.id,
    templateType: template.type,
    mode,
    supportedModes: getSupportedModes(template.type),
  };
}

module.exports = {
  generateDocument,
  getTemplatesResponse,
  removeTemplate,
  uploadTemplate,
};
