const TEMPLATE_TYPES = {
  SINGLE: 'single_document',
  REGISTRY: 'registry_document',
};

const GENERATION_MODES = {
  BY_OPERATION: 'by_operation',
  BY_DAY: 'by_day',
  BY_PERIOD: 'by_period',
};

const TOKEN_SECTIONS = {
  common: [
    { token: 'document_date', description: 'Дата формирования документа', section: 'common' },
    { token: 'generated_at', description: 'Дата и время формирования документа', section: 'common' },
    { token: 'template_name', description: 'Название шаблона', section: 'common' },
    { token: 'period_start', description: 'Начало периода или дата операции', section: 'common' },
    { token: 'period_end', description: 'Конец периода или дата операции', section: 'common' },
    { token: 'operations_count', description: 'Количество операций в выборке', section: 'common' },
    { token: 'field_name', description: 'Название поля или текущий фильтр поля', section: 'common' },
    { token: 'field_area', description: 'Площадь поля', section: 'common' },
    { token: 'field_cadastral_number', description: 'Кадастровый номер поля', section: 'common' },
  ],
  singleOnly: [
    { token: 'operation_id', description: 'Идентификатор операции', section: 'singleOnly' },
    { token: 'operation_date', description: 'Дата операции', section: 'singleOnly' },
    { token: 'operation_type', description: 'Тип операции', section: 'singleOnly' },
    { token: 'operation_status', description: 'Статус операции', section: 'singleOnly' },
    { token: 'operation_calendar_status', description: 'Календарный статус операции', section: 'singleOnly' },
    { token: 'time_start', description: 'Время начала операции', section: 'singleOnly' },
    { token: 'time_end', description: 'Время окончания операции', section: 'singleOnly' },
    { token: 'field_id', description: 'Идентификатор поля', section: 'singleOnly' },
    { token: 'crop_name', description: 'Название культуры', section: 'singleOnly' },
    { token: 'crop_code', description: 'Код культуры', section: 'singleOnly' },
    { token: 'equipment_name', description: 'Название техники или агрегата', section: 'singleOnly' },
    { token: 'equipment_type', description: 'Тип техники', section: 'singleOnly' },
    { token: 'equipment_model', description: 'Модель техники', section: 'singleOnly' },
    { token: 'equipment_reg_number', description: 'Госномер техники', section: 'singleOnly' },
  ],
  registryOnly: [
    { token: 'items_start', description: 'Начало повторяемого блока строк реестра', section: 'registryOnly' },
    { token: 'items_end', description: 'Конец повторяемого блока строк реестра', section: 'registryOnly' },
    { token: 'item_index', description: 'Порядковый номер строки', section: 'registryOnly' },
    { token: 'item_operation_id', description: 'Идентификатор операции в строке', section: 'registryOnly' },
    { token: 'item_operation_date', description: 'Дата операции в строке', section: 'registryOnly' },
    { token: 'item_operation_type', description: 'Тип операции в строке', section: 'registryOnly' },
    { token: 'item_operation_status', description: 'Статус операции в строке', section: 'registryOnly' },
    { token: 'item_operation_calendar_status', description: 'Календарный статус операции в строке', section: 'registryOnly' },
    { token: 'item_time_start', description: 'Время начала операции в строке', section: 'registryOnly' },
    { token: 'item_time_end', description: 'Время окончания операции в строке', section: 'registryOnly' },
    { token: 'item_field_id', description: 'Идентификатор поля в строке', section: 'registryOnly' },
    { token: 'item_field_name', description: 'Название поля в строке', section: 'registryOnly' },
    { token: 'item_field_area', description: 'Площадь поля в строке', section: 'registryOnly' },
    { token: 'item_field_cadastral_number', description: 'Кадастровый номер поля в строке', section: 'registryOnly' },
    { token: 'item_crop_name', description: 'Название культуры в строке', section: 'registryOnly' },
    { token: 'item_crop_code', description: 'Код культуры в строке', section: 'registryOnly' },
    { token: 'item_equipment_name', description: 'Название техники в строке', section: 'registryOnly' },
    { token: 'item_equipment_type', description: 'Тип техники в строке', section: 'registryOnly' },
    { token: 'item_equipment_model', description: 'Модель техники в строке', section: 'registryOnly' },
    { token: 'item_equipment_reg_number', description: 'Госномер техники в строке', section: 'registryOnly' },
  ],
};

const TOKEN_LIST_BY_TYPE = {
  [TEMPLATE_TYPES.SINGLE]: [
    ...TOKEN_SECTIONS.common,
    ...TOKEN_SECTIONS.singleOnly,
  ],
  [TEMPLATE_TYPES.REGISTRY]: [
    ...TOKEN_SECTIONS.common,
    ...TOKEN_SECTIONS.registryOnly,
  ],
};

const SUPPORTED_MODES_BY_TEMPLATE_TYPE = {
  [TEMPLATE_TYPES.SINGLE]: [GENERATION_MODES.BY_OPERATION],
  [TEMPLATE_TYPES.REGISTRY]: [GENERATION_MODES.BY_DAY, GENERATION_MODES.BY_PERIOD],
};

function getAvailableTokensForType(templateType) {
  const tokens = TOKEN_LIST_BY_TYPE[templateType] || [];
  return tokens.map((entry) => ({ ...entry }));
}

function getAllowedTokenSet(templateType) {
  return new Set(getAvailableTokensForType(templateType).map((entry) => entry.token));
}

function getSupportedModes(templateType) {
  return [...(SUPPORTED_MODES_BY_TEMPLATE_TYPE[templateType] || [])];
}

function getTokenCatalogByType() {
  return {
    [TEMPLATE_TYPES.SINGLE]: getAvailableTokensForType(TEMPLATE_TYPES.SINGLE),
    [TEMPLATE_TYPES.REGISTRY]: getAvailableTokensForType(TEMPLATE_TYPES.REGISTRY),
  };
}

module.exports = {
  TEMPLATE_TYPES,
  GENERATION_MODES,
  TOKEN_SECTIONS,
  getAllowedTokenSet,
  getAvailableTokensForType,
  getTokenCatalogByType,
  getSupportedModes,
};
