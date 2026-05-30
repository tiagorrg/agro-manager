const fs = require('fs/promises');
const Docxtemplater = require('docxtemplater');
const PizZip = require('pizzip');

const { createHttpError } = require('../../utils/httpError');

const XML_FILES_PATTERN = /^word\/(document|header\d+|footer\d+)\.xml$/;

function replaceRegistryControlTags(zip) {
  Object.keys(zip.files)
    .filter((fileName) => XML_FILES_PATTERN.test(fileName))
    .forEach((fileName) => {
      const originalContent = zip.file(fileName).asText();
      const transformedContent = originalContent
        .replace(/\[items_start\]/g, '[#items]')
        .replace(/\[items_end\]/g, '[/items]');

      if (transformedContent !== originalContent) {
        zip.file(fileName, transformedContent);
      }
    });
}

function extractDocxErrorDetails(error) {
  const explanation = error && error.properties && Array.isArray(error.properties.errors)
    ? error.properties.errors.map((entry) => entry.properties && entry.properties.explanation).filter(Boolean)
    : [];

  return explanation.length > 0 ? explanation : null;
}

async function renderDocumentBuffer({ templatePath, data }) {
  let templateBuffer;

  try {
    templateBuffer = await fs.readFile(templatePath);
  } catch (error) {
    throw createHttpError(500, 'TEMPLATE_FILE_READ_FAILED', 'Не удалось прочитать сохранённый DOCX шаблон');
  }

  try {
    const zip = new PizZip(templateBuffer);
    replaceRegistryControlTags(zip);

    const doc = new Docxtemplater(zip, {
      delimiters: {
        start: '[',
        end: ']',
      },
      linebreaks: true,
      paragraphLoop: true,
      nullGetter() {
        return '';
      },
    });

    doc.render(data);

    return doc.getZip().generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    });
  } catch (error) {
    throw createHttpError(
      422,
      'DOCUMENT_RENDER_FAILED',
      'Не удалось сгенерировать документ по выбранному шаблону',
      {
        details: extractDocxErrorDetails(error),
      }
    );
  }
}

module.exports = {
  renderDocumentBuffer,
};
