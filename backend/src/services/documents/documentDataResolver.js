const operations = require('../../data/operations');
const fields = require('../../data/fields');
const crops = require('../../data/crops');
const equipment = require('../../data/equipment');
const { createHttpError } = require('../../utils/httpError');
const { GENERATION_MODES, TEMPLATE_TYPES } = require('./templateDictionary');

const OPERATION_TYPE_LABELS = {
  Посев: 'Посев',
  Обработка: 'Обработка',
  Уборка: 'Уборка',
  ВнесениеУдобрений: 'Внесение удобрений',
};

function enrichOperation(operation) {
  return {
    ...operation,
    field: fields.find((field) => field.id === operation.fieldId) || null,
    crop: crops.find((crop) => crop.id === operation.cropId) || null,
    equipment: equipment.find((item) => item.id === operation.equipmentId) || null,
  };
}

function formatDateTime(date) {
  return date.toISOString();
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function normalizeString(value) {
  return value == null ? '' : String(value);
}

function normalizeNumber(value) {
  return value == null || Number.isNaN(value) ? '' : String(value);
}

function buildFieldHeader(field) {
  if (!field) {
    return {
      field_name: '',
      field_area: '',
      field_cadastral_number: '',
    };
  }

  return {
    field_name: normalizeString(field.name),
    field_area: normalizeNumber(field.area),
    field_cadastral_number: normalizeString(field.cadastralNumber),
  };
}

function buildSingleDocumentPayload({ templateName, operation }) {
  const now = new Date();
  const field = operation.field;

  return {
    document_date: formatDate(now),
    generated_at: formatDateTime(now),
    template_name: normalizeString(templateName),
    period_start: normalizeString(operation.date),
    period_end: normalizeString(operation.date),
    operations_count: '1',
    operation_id: normalizeString(operation.id),
    operation_date: normalizeString(operation.date),
    operation_type: normalizeString(OPERATION_TYPE_LABELS[operation.type] || operation.type),
    operation_status: normalizeString(operation.status),
    operation_calendar_status: normalizeString(operation.calendarStatus),
    time_start: normalizeString(operation.timeStart),
    time_end: normalizeString(operation.timeEnd),
    field_id: normalizeString(operation.fieldId),
    crop_name: normalizeString(operation.crop && operation.crop.name),
    crop_code: normalizeString(operation.crop && operation.crop.code),
    equipment_name: normalizeString(operation.equipment && operation.equipment.name),
    equipment_type: normalizeString(operation.equipment && operation.equipment.type),
    equipment_model: normalizeString(operation.equipment && operation.equipment.model),
    equipment_reg_number: normalizeString(operation.equipment && operation.equipment.regNumber),
    ...buildFieldHeader(field),
  };
}

function buildRegistryDocumentPayload({
  templateName,
  periodStart,
  periodEnd,
  field,
  items,
}) {
  const now = new Date();
  const headerField = field
    ? buildFieldHeader(field)
    : {
        field_name: 'Все поля',
        field_area: '',
        field_cadastral_number: '',
      };

  return {
    document_date: formatDate(now),
    generated_at: formatDateTime(now),
    template_name: normalizeString(templateName),
    period_start: normalizeString(periodStart),
    period_end: normalizeString(periodEnd),
    operations_count: String(items.length),
    ...headerField,
    items: items.map((operation, index) => ({
      item_index: String(index + 1),
      item_operation_id: normalizeString(operation.id),
      item_operation_date: normalizeString(operation.date),
      item_operation_type: normalizeString(OPERATION_TYPE_LABELS[operation.type] || operation.type),
      item_operation_status: normalizeString(operation.status),
      item_operation_calendar_status: normalizeString(operation.calendarStatus),
      item_time_start: normalizeString(operation.timeStart),
      item_time_end: normalizeString(operation.timeEnd),
      item_field_id: normalizeString(operation.fieldId),
      item_field_name: normalizeString(operation.field && operation.field.name),
      item_field_area: normalizeNumber(operation.field && operation.field.area),
      item_field_cadastral_number: normalizeString(operation.field && operation.field.cadastralNumber),
      item_crop_name: normalizeString(operation.crop && operation.crop.name),
      item_crop_code: normalizeString(operation.crop && operation.crop.code),
      item_equipment_name: normalizeString(operation.equipment && operation.equipment.name),
      item_equipment_type: normalizeString(operation.equipment && operation.equipment.type),
      item_equipment_model: normalizeString(operation.equipment && operation.equipment.model),
      item_equipment_reg_number: normalizeString(operation.equipment && operation.equipment.regNumber),
    })),
  };
}

function getFieldOrThrow(fieldId) {
  const field = fields.find((entry) => entry.id === fieldId);

  if (!field) {
    throw createHttpError(404, 'FIELD_NOT_FOUND', 'Поле для документа не найдено', { fieldId });
  }

  return field;
}

function resolveSingleDocumentData({ templateName, operationId }) {
  if (!operationId) {
    throw createHttpError(400, 'OPERATION_ID_REQUIRED', 'Для single_document необходимо передать operationId');
  }

  const operation = operations.find((entry) => entry.id === operationId);
  if (!operation) {
    throw createHttpError(404, 'OPERATION_NOT_FOUND', 'Операция для документа не найдена', { operationId });
  }

  return buildSingleDocumentPayload({
    templateName,
    operation: enrichOperation(operation),
  });
}

function resolveRegistryOperations({ mode, date, dateFrom, dateTo, fieldId }) {
  if (mode === GENERATION_MODES.BY_DAY) {
    if (!date) {
      throw createHttpError(400, 'DATE_REQUIRED', 'Для режима by_day необходимо передать date');
    }

    return {
      periodStart: date,
      periodEnd: date,
      field: fieldId ? getFieldOrThrow(fieldId) : null,
      items: operations
        .filter((operation) => operation.date === date)
        .filter((operation) => !fieldId || operation.fieldId === fieldId)
        .filter((operation) => operation.calendarStatus === 'Выполнено')
        .map(enrichOperation),
    };
  }

  if (mode === GENERATION_MODES.BY_PERIOD) {
    if (!dateFrom || !dateTo) {
      throw createHttpError(400, 'DATE_RANGE_REQUIRED', 'Для режима by_period необходимо передать dateFrom и dateTo');
    }

    if (dateFrom > dateTo) {
      throw createHttpError(400, 'INVALID_DATE_RANGE', 'Дата начала периода не может быть позже даты окончания');
    }

    return {
      periodStart: dateFrom,
      periodEnd: dateTo,
      field: fieldId ? getFieldOrThrow(fieldId) : null,
      items: operations
        .filter((operation) => operation.date >= dateFrom && operation.date <= dateTo)
        .filter((operation) => !fieldId || operation.fieldId === fieldId)
        .filter((operation) => operation.calendarStatus === 'Выполнено')
        .map(enrichOperation),
    };
  }

  throw createHttpError(400, 'INVALID_GENERATION_MODE', 'Для registry_document поддерживаются режимы by_day и by_period', {
    mode,
    allowed: [GENERATION_MODES.BY_DAY, GENERATION_MODES.BY_PERIOD],
  });
}

function resolveRegistryDocumentData({ templateName, mode, date, dateFrom, dateTo, fieldId }) {
  const { periodStart, periodEnd, field, items } = resolveRegistryOperations({
    mode,
    date,
    dateFrom,
    dateTo,
    fieldId,
  });

  if (items.length === 0) {
    throw createHttpError(404, 'DOCUMENT_DATA_NOT_FOUND', 'По выбранным параметрам не найдено выполненных операций', {
      mode,
      date,
      dateFrom,
      dateTo,
      fieldId: fieldId || null,
    });
  }

  return buildRegistryDocumentPayload({
    templateName,
    periodStart,
    periodEnd,
    field,
    items,
  });
}

function resolveDocumentData({ template, mode, operationId, date, dateFrom, dateTo, fieldId }) {
  if (template.type === TEMPLATE_TYPES.SINGLE) {
    if (mode !== GENERATION_MODES.BY_OPERATION) {
      throw createHttpError(400, 'INVALID_GENERATION_MODE', 'Для single_document поддерживается только режим by_operation', {
        mode,
        allowed: [GENERATION_MODES.BY_OPERATION],
      });
    }

    return resolveSingleDocumentData({
      templateName: template.name,
      operationId,
    });
  }

  if (template.type === TEMPLATE_TYPES.REGISTRY) {
    return resolveRegistryDocumentData({
      templateName: template.name,
      mode,
      date,
      dateFrom,
      dateTo,
      fieldId,
    });
  }

  throw createHttpError(400, 'INVALID_TEMPLATE_TYPE', 'Неподдерживаемый тип шаблона документа', {
    templateType: template.type,
  });
}

module.exports = {
  resolveDocumentData,
};
