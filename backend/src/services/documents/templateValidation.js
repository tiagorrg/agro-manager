const PizZip = require('pizzip');

const { createHttpError } = require('../../utils/httpError');
const {
  TEMPLATE_TYPES,
  getAllowedTokenSet,
} = require('./templateDictionary');

const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
const DOCX_TOKEN_PATTERN = /\[([a-zA-Z0-9_]+)\]/g;
const XML_FILES_PATTERN = /^word\/(document|header\d+|footer\d+)\.xml$/;

function decodeBase64Docx(base64Input) {
  if (!base64Input || typeof base64Input !== 'string') {
    throw createHttpError(400, 'TEMPLATE_CONTENT_REQUIRED', 'Необходимо передать templateContentBase64');
  }

  const normalizedBase64 = base64Input.includes(',')
    ? base64Input.slice(base64Input.indexOf(',') + 1)
    : base64Input;

  try {
    return Buffer.from(normalizedBase64, 'base64');
  } catch (error) {
    throw createHttpError(400, 'INVALID_TEMPLATE_BASE64', 'Не удалось декодировать DOCX из base64');
  }
}

function assertDocxFileName(templateFileName) {
  if (!templateFileName || typeof templateFileName !== 'string') {
    throw createHttpError(400, 'TEMPLATE_FILENAME_REQUIRED', 'Необходимо передать templateFileName');
  }

  if (!templateFileName.toLowerCase().endsWith('.docx')) {
    throw createHttpError(400, 'INVALID_TEMPLATE_FILENAME', 'Поддерживаются только файлы .docx', {
      templateFileName,
      expectedMimeType: DOCX_MIME,
    });
  }
}

function getDocxZip(buffer) {
  try {
    const zip = new PizZip(buffer);
    if (!zip.file('word/document.xml')) {
      throw new Error('word/document.xml is missing');
    }
    return zip;
  } catch (error) {
    throw createHttpError(400, 'INVALID_DOCX_FILE', 'Загруженный файл не является корректным DOCX');
  }
}

function extractTextFromXml(xmlContent) {
  return xmlContent
    .replace(/<w:tab\/>/g, '\t')
    .replace(/<w:br\/>/g, '\n')
    .replace(/<[^>]+>/g, '');
}

function extractTokenOccurrencesFromZip(zip) {
  const occurrences = [];

  Object.keys(zip.files)
    .filter((fileName) => XML_FILES_PATTERN.test(fileName))
    .forEach((fileName) => {
      const xmlContent = zip.file(fileName).asText();
      const plainText = extractTextFromXml(xmlContent);
      let match = DOCX_TOKEN_PATTERN.exec(plainText);

      while (match) {
        occurrences.push({
          token: match[1],
          fileName,
          index: match.index,
        });
        match = DOCX_TOKEN_PATTERN.exec(plainText);
      }

      DOCX_TOKEN_PATTERN.lastIndex = 0;
    });

  return occurrences;
}

function buildValidationResult(templateType, occurrences) {
  const allowedTokens = getAllowedTokenSet(templateType);
  const detectedTokens = [...new Set(occurrences.map((entry) => entry.token))];
  const unknownTokens = detectedTokens.filter((token) => !allowedTokens.has(token));
  const validationErrors = [];
  const hasItemsStart = detectedTokens.includes('items_start');
  const hasItemsEnd = detectedTokens.includes('items_end');
  const hasItemsBlock = hasItemsStart && hasItemsEnd;
  const itemTokenUsage = detectedTokens.filter((token) => token.startsWith('item_'));

  if (templateType === TEMPLATE_TYPES.SINGLE) {
    if (hasItemsStart || hasItemsEnd || itemTokenUsage.length > 0) {
      validationErrors.push({
        code: 'ITEMS_BLOCK_NOT_ALLOWED',
        message: 'single_document не поддерживает [items_start], [items_end] и item_* токены',
      });
    }
  }

  if (templateType === TEMPLATE_TYPES.REGISTRY) {
    const itemsStartCount = occurrences.filter((entry) => entry.token === 'items_start').length;
    const itemsEndCount = occurrences.filter((entry) => entry.token === 'items_end').length;
    const firstItemsStart = occurrences.findIndex((entry) => entry.token === 'items_start');
    const firstItemsEnd = occurrences.findIndex((entry) => entry.token === 'items_end');

    if (!hasItemsStart || !hasItemsEnd) {
      validationErrors.push({
        code: 'ITEMS_BLOCK_REQUIRED',
        message: 'registry_document должен содержать [items_start] и [items_end]',
      });
    }

    if (itemsStartCount > 1 || itemsEndCount > 1) {
      validationErrors.push({
        code: 'ITEMS_BLOCK_MULTIPLE',
        message: 'В первой итерации поддерживается только один повторяемый блок items',
      });
    }

    if (firstItemsStart !== -1 && firstItemsEnd !== -1 && firstItemsStart > firstItemsEnd) {
      validationErrors.push({
        code: 'ITEMS_BLOCK_ORDER',
        message: 'Маркер [items_start] должен идти раньше [items_end]',
      });
    }

    if (itemTokenUsage.length > 0 && !hasItemsBlock) {
      validationErrors.push({
        code: 'ITEM_TOKENS_WITHOUT_BLOCK',
        message: 'item_* токены можно использовать только вместе с [items_start]...[items_end]',
      });
    }
  }

  return {
    detectedTokens,
    unknownTokens,
    validationErrors,
    hasItemsBlock,
    isValid: unknownTokens.length === 0 && validationErrors.length === 0,
  };
}

function validateTemplateBuffer({ buffer, templateType }) {
  const zip = getDocxZip(buffer);
  const occurrences = extractTokenOccurrencesFromZip(zip);
  return buildValidationResult(templateType, occurrences);
}

module.exports = {
  assertDocxFileName,
  decodeBase64Docx,
  validateTemplateBuffer,
};
