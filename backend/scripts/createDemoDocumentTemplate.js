const fs = require('fs/promises');
const path = require('path');
const PizZip = require('pizzip');

const outputPath = path.join(
  __dirname,
  '..',
  'uploads',
  'templates',
  'tpl100-akt-vypolnennykh-polevykh-rabot.docx'
);

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function paragraph(text, options = {}) {
  const align = options.align ? `<w:jc w:val="${options.align}"/>` : '';
  const bold = options.bold ? '<w:b/>' : '';
  const size = options.size ? `<w:sz w:val="${options.size}"/><w:szCs w:val="${options.size}"/>` : '';

  return [
    '<w:p>',
    `<w:pPr>${align}<w:spacing w:after="120"/></w:pPr>`,
    `<w:r><w:rPr>${bold}${size}</w:rPr><w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r>`,
    '</w:p>',
  ].join('');
}

function cell(text, width, isHeader = false) {
  return [
    '<w:tc>',
    '<w:tcPr>',
    `<w:tcW w:w="${width}" w:type="dxa"/>`,
    '<w:tcBorders>',
    '<w:top w:val="single" w:sz="4" w:space="0" w:color="B7C3D0"/>',
    '<w:left w:val="single" w:sz="4" w:space="0" w:color="B7C3D0"/>',
    '<w:bottom w:val="single" w:sz="4" w:space="0" w:color="B7C3D0"/>',
    '<w:right w:val="single" w:sz="4" w:space="0" w:color="B7C3D0"/>',
    '</w:tcBorders>',
    `<w:shd w:fill="${isHeader ? 'EEF2F7' : 'FFFFFF'}"/>`,
    '</w:tcPr>',
    `<w:p><w:r><w:rPr>${isHeader ? '<w:b/>' : ''}</w:rPr><w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r></w:p>`,
    '</w:tc>',
  ].join('');
}

function row(cells) {
  return `<w:tr>${cells}</w:tr>`;
}

function table() {
  return [
    '<w:tbl>',
    '<w:tblPr><w:tblW w:w="0" w:type="auto"/><w:tblLook w:firstRow="1" w:noHBand="0" w:noVBand="1"/></w:tblPr>',
    '<w:tblGrid>',
    '<w:gridCol w:w="650"/><w:gridCol w:w="1200"/><w:gridCol w:w="1750"/><w:gridCol w:w="1200"/>',
    '<w:gridCol w:w="1150"/><w:gridCol w:w="1400"/><w:gridCol w:w="1900"/>',
    '</w:tblGrid>',
    row(
      cell('№', '650', true)
      + cell('Дата', '1200', true)
      + cell('Поле', '1750', true)
      + cell('Площадь, га', '1200', true)
      + cell('Культура', '1150', true)
      + cell('Вид работ', '1400', true)
      + cell('Техника', '1900', true)
    ),
    row(
      cell('[items_start][item_index]', '650')
      + cell('[item_operation_date]', '1200')
      + cell('[item_field_name]', '1750')
      + cell('[item_field_area]', '1200')
      + cell('[item_crop_name]', '1150')
      + cell('[item_operation_type]', '1400')
      + cell('[item_equipment_name], [item_equipment_model], [item_equipment_reg_number][items_end]', '1900')
    ),
    '</w:tbl>',
  ].join('');
}

function buildDocumentXml() {
  const body = [
    paragraph('АКТ ВЫПОЛНЕННЫХ ПОЛЕВЫХ РАБОТ', { align: 'center', bold: true, size: 28 }),
    paragraph('№ [template_name] от [document_date]', { align: 'center' }),
    paragraph('Организация: [enterprise_name]'),
    paragraph('ИНН: [enterprise_inn]   КПП: [enterprise_kpp]   ОГРН/ОГРНИП: [enterprise_ogrn]'),
    paragraph('Адрес: [enterprise_address]'),
    paragraph('Телефон: [enterprise_phone]'),
    paragraph('Период выполнения работ: с [period_start] по [period_end]'),
    paragraph('Поле/фильтр: [field_name]; площадь: [field_area] га; кадастровый номер: [field_cadastral_number]'),
    paragraph('Количество выполненных операций: [operations_count]'),
    table(),
    paragraph('Работы выполнены в соответствии с производственным планом хозяйства и данными журнала операций AgroScope.'),
    paragraph('Ответственные лица:'),
    paragraph('[manager_position] ____________________ [manager_name]'),
    paragraph('[agronomist_position] ____________________ [agronomist_name]'),
    paragraph('Дата и время формирования: [generated_at]'),
    '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="850" w:bottom="1134" w:left="850" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr>',
  ].join('');

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><w:body>${body}</w:body></w:document>`;
}

async function main() {
  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  const zip = new PizZip();
  zip.file('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>');
  zip.folder('_rels').file('.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>');
  zip.folder('word').file('document.xml', buildDocumentXml());
  zip.folder('word').folder('_rels').file('document.xml.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>');
  zip.folder('docProps').file('core.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>Акт выполненных полевых работ</dc:title><dc:creator>AgroScope</dc:creator><cp:lastModifiedBy>AgroScope</cp:lastModifiedBy></cp:coreProperties>');
  zip.folder('docProps').file('app.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>AgroScope</Application></Properties>');

  const buffer = zip.generate({ type: 'nodebuffer', compression: 'DEFLATE' });
  await fs.writeFile(outputPath, buffer);
  console.log(outputPath);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
