const fs = require('fs/promises');
const path = require('path');

const templates = require('../../data/documentTemplates');
const { createHttpError } = require('../../utils/httpError');
const {
  TEMPLATE_TYPES,
  getAvailableTokensForType,
  getSupportedModes,
} = require('./templateDictionary');

const uploadsRoot = path.join(__dirname, '..', '..', '..', 'uploads');
const templatesDirectory = path.join(uploadsRoot, 'templates');
const generatedDirectory = path.join(uploadsRoot, 'generated-documents');

let templateCounter = templates.reduce((max, template) => {
  const numericId = Number(String(template.id || '').replace('tpl', ''));
  return Number.isFinite(numericId) ? Math.max(max, numericId) : max;
}, 0);

function sanitizeFileName(fileName) {
  return String(fileName || 'template.docx')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase() || 'template.docx';
}

function toTemplateView(template) {
  return {
    id: template.id,
    name: template.name,
    type: template.type,
    templateFileName: template.templateFileName,
    originalFileName: template.originalFileName,
    supportedModes: getSupportedModes(template.type),
    availableTokens: getAvailableTokensForType(template.type),
    detectedTokens: [...template.detectedTokens],
    unknownTokens: [...template.unknownTokens],
    validationErrors: template.validationErrors.map((entry) => ({ ...entry })),
    isValid: template.isValid,
    hasItemsBlock: template.hasItemsBlock,
    createdAt: template.createdAt,
    updatedAt: template.updatedAt,
  };
}

async function ensureDocumentDirectories() {
  await fs.mkdir(templatesDirectory, { recursive: true });
  await fs.mkdir(generatedDirectory, { recursive: true });
}

async function writeTemplateFile({ templateId, originalFileName, buffer }) {
  await ensureDocumentDirectories();
  const sanitizedName = sanitizeFileName(originalFileName);
  const storedFileName = `${templateId}-${sanitizedName.endsWith('.docx') ? sanitizedName : `${sanitizedName}.docx`}`;
  const filePath = path.join(templatesDirectory, storedFileName);

  await fs.writeFile(filePath, buffer);
  return { filePath, storedFileName };
}

async function removeTemplateFile(filePath) {
  if (!filePath) return;

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error && error.code !== 'ENOENT') {
      throw error;
    }
  }
}

function createTemplateRecord({
  name,
  type,
  originalFileName,
  storedFileName,
  filePath,
  validation,
}) {
  templateCounter += 1;
  const timestamp = new Date().toISOString();
  const templateId = `tpl${templateCounter}`;

  return {
    id: templateId,
    name,
    type,
    templateFileName: storedFileName,
    originalFileName,
    filePath,
    detectedTokens: validation.detectedTokens,
    unknownTokens: validation.unknownTokens,
    validationErrors: validation.validationErrors,
    isValid: validation.isValid,
    hasItemsBlock: validation.hasItemsBlock,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function listTemplates() {
  return templates
    .slice()
    .sort((left, right) => String(right.createdAt).localeCompare(String(left.createdAt)))
    .map(toTemplateView);
}

function getTemplateById(templateId) {
  return templates.find((template) => template.id === templateId) || null;
}

function getTemplateOrThrow(templateId) {
  const template = getTemplateById(templateId);

  if (!template) {
    throw createHttpError(404, 'TEMPLATE_NOT_FOUND', 'Шаблон документа не найден');
  }

  return template;
}

async function addTemplate({ name, type, originalFileName, buffer, validation }) {
  const templateId = `tpl${templateCounter + 1}`;
  const { filePath, storedFileName } = await writeTemplateFile({
    templateId,
    originalFileName,
    buffer,
  });

  const template = createTemplateRecord({
    name,
    type,
    originalFileName,
    storedFileName,
    filePath,
    validation,
  });

  templates.push(template);
  return toTemplateView(template);
}

async function deleteTemplate(templateId) {
  const template = getTemplateOrThrow(templateId);
  const index = templates.findIndex((entry) => entry.id === templateId);

  if (index === -1) {
    throw createHttpError(404, 'TEMPLATE_NOT_FOUND', 'Шаблон документа не найден');
  }

  templates.splice(index, 1);
  await removeTemplateFile(template.filePath);

  return {
    id: templateId,
    deleted: true,
  };
}

function assertTemplateType(templateType) {
  if (!Object.values(TEMPLATE_TYPES).includes(templateType)) {
    throw createHttpError(
      400,
      'INVALID_TEMPLATE_TYPE',
      'Поддерживаются только template types single_document и registry_document',
      {
        received: templateType,
        allowed: Object.values(TEMPLATE_TYPES),
      }
    );
  }
}

module.exports = {
  addTemplate,
  assertTemplateType,
  ensureDocumentDirectories,
  getTemplateById,
  getTemplateOrThrow,
  listTemplates,
  deleteTemplate,
  toTemplateView,
};
