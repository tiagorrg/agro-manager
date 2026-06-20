import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import type {
  CreateDocumentTemplateInput,
  DocumentGenerationMode,
  DocumentTemplate,
  DocumentTemplateType,
  DocumentTemplatesCatalog,
  DocumentTokenDefinition,
  GenerateDocumentInput,
} from "../../entities/document/types";
import type { CalendarOperation } from "../api/operations";
import { demoData } from "./api";

interface StoredDocumentTemplate extends DocumentTemplate {
  contentBase64: string;
}

const TEMPLATE_TYPES = {
  SINGLE: "single_document",
  REGISTRY: "registry_document",
} as const;

const GENERATION_MODES = {
  BY_OPERATION: "by_operation",
  BY_DAY: "by_day",
  BY_PERIOD: "by_period",
} as const;

const TOKEN_CATALOG_BY_TYPE: DocumentTemplatesCatalog["tokenCatalogByType"] = {
  single_document: [
    { token: "document_date", description: "Дата формирования документа", section: "common" },
    { token: "generated_at", description: "Дата и время формирования документа", section: "common" },
    { token: "template_name", description: "Название шаблона", section: "common" },
    { token: "period_start", description: "Начало периода или дата операции", section: "common" },
    { token: "period_end", description: "Конец периода или дата операции", section: "common" },
    { token: "operations_count", description: "Количество операций в выборке", section: "common" },
    { token: "field_name", description: "Название поля", section: "common" },
    { token: "field_area", description: "Площадь поля", section: "common" },
    { token: "field_cadastral_number", description: "Кадастровый номер поля", section: "common" },
    { token: "enterprise_name", description: "Полное название предприятия", section: "common" },
    { token: "enterprise_short_name", description: "Краткое название предприятия", section: "common" },
    { token: "manager_position", description: "Должность руководителя", section: "common" },
    { token: "manager_name", description: "ФИО руководителя", section: "common" },
    { token: "agronomist_position", description: "Должность агронома", section: "common" },
    { token: "agronomist_name", description: "ФИО агронома", section: "common" },
    { token: "operation_id", description: "Идентификатор операции", section: "singleOnly" },
    { token: "operation_date", description: "Дата операции", section: "singleOnly" },
    { token: "operation_type", description: "Тип операции", section: "singleOnly" },
    { token: "operation_status", description: "Статус операции", section: "singleOnly" },
    { token: "operation_calendar_status", description: "Календарный статус операции", section: "singleOnly" },
    { token: "time_start", description: "Время начала операции", section: "singleOnly" },
    { token: "time_end", description: "Время окончания операции", section: "singleOnly" },
    { token: "field_id", description: "Идентификатор поля", section: "singleOnly" },
    { token: "crop_name", description: "Название культуры", section: "singleOnly" },
    { token: "crop_code", description: "Код культуры", section: "singleOnly" },
    { token: "equipment_name", description: "Название техники", section: "singleOnly" },
    { token: "equipment_type", description: "Тип техники", section: "singleOnly" },
    { token: "equipment_model", description: "Модель техники", section: "singleOnly" },
    { token: "equipment_reg_number", description: "Госномер техники", section: "singleOnly" },
  ],
  registry_document: [
    { token: "document_date", description: "Дата формирования документа", section: "common" },
    { token: "generated_at", description: "Дата и время формирования документа", section: "common" },
    { token: "template_name", description: "Название шаблона", section: "common" },
    { token: "period_start", description: "Начало периода", section: "common" },
    { token: "period_end", description: "Конец периода", section: "common" },
    { token: "operations_count", description: "Количество операций в выборке", section: "common" },
    { token: "field_name", description: "Название поля или фильтра", section: "common" },
    { token: "field_area", description: "Площадь поля", section: "common" },
    { token: "field_cadastral_number", description: "Кадастровый номер поля", section: "common" },
    { token: "enterprise_name", description: "Полное название предприятия", section: "common" },
    { token: "enterprise_short_name", description: "Краткое название предприятия", section: "common" },
    { token: "manager_position", description: "Должность руководителя", section: "common" },
    { token: "manager_name", description: "ФИО руководителя", section: "common" },
    { token: "agronomist_position", description: "Должность агронома", section: "common" },
    { token: "agronomist_name", description: "ФИО агронома", section: "common" },
    { token: "items_start", description: "Начало блока строк", section: "registryOnly" },
    { token: "items_end", description: "Конец блока строк", section: "registryOnly" },
    { token: "item_index", description: "Порядковый номер строки", section: "registryOnly" },
    { token: "item_operation_id", description: "Идентификатор операции", section: "registryOnly" },
    { token: "item_operation_date", description: "Дата операции", section: "registryOnly" },
    { token: "item_operation_type", description: "Тип операции", section: "registryOnly" },
    { token: "item_operation_status", description: "Статус операции", section: "registryOnly" },
    { token: "item_operation_calendar_status", description: "Календарный статус операции", section: "registryOnly" },
    { token: "item_time_start", description: "Время начала", section: "registryOnly" },
    { token: "item_time_end", description: "Время окончания", section: "registryOnly" },
    { token: "item_field_id", description: "Идентификатор поля", section: "registryOnly" },
    { token: "item_field_name", description: "Название поля", section: "registryOnly" },
    { token: "item_field_area", description: "Площадь поля", section: "registryOnly" },
    { token: "item_field_cadastral_number", description: "Кадастровый номер поля", section: "registryOnly" },
    { token: "item_crop_name", description: "Название культуры", section: "registryOnly" },
    { token: "item_crop_code", description: "Код культуры", section: "registryOnly" },
    { token: "item_equipment_name", description: "Название техники", section: "registryOnly" },
    { token: "item_equipment_type", description: "Тип техники", section: "registryOnly" },
    { token: "item_equipment_model", description: "Модель техники", section: "registryOnly" },
    { token: "item_equipment_reg_number", description: "Госномер техники", section: "registryOnly" },
  ],
};

const SUPPORTED_MODES: Record<DocumentTemplateType, DocumentGenerationMode[]> = {
  single_document: ["by_operation"],
  registry_document: ["by_day", "by_period"],
};

const ENTERPRISE = {
  enterprise_name: 'КФХ "Теплый стан"',
  enterprise_short_name: 'КФХ "Теплый стан"',
  enterprise_inn: "231102345678",
  enterprise_kpp: "",
  enterprise_ogrn: "326237500012345",
  enterprise_address: "353740, Краснодарский край, станица Ленинградская, ул. Полевая, д. 12",
  enterprise_phone: "+7 (86145) 5-21-44",
  manager_position: "Глава КФХ",
  manager_name: "Иванов Иван Иванович",
  agronomist_position: "Главный агроном",
  agronomist_name: "Петрова Анна Сергеевна",
};

const STORAGE_KEY = "agro_demo_v1:document_templates";
const DOCX_TOKEN_PATTERN = /\[([a-zA-Z0-9_]+)\]/g;
const XML_FILES_PATTERN = /^word\/(document|header\d+|footer\d+)\.xml$/;

function readTemplates(): StoredDocumentTemplate[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredDocumentTemplate[]) : [];
  } catch {
    return [];
  }
}

function writeTemplates(templates: StoredDocumentTemplate[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
}

function publicTemplate(template: StoredDocumentTemplate): DocumentTemplate {
  const { contentBase64: _contentBase64, ...metadata } = template;
  return metadata;
}

function getAllowedTokens(type: DocumentTemplateType) {
  return new Set(TOKEN_CATALOG_BY_TYPE[type].map((entry) => entry.token));
}

function getZip(base64: string) {
  try {
    const zip = new PizZip(base64.includes(",") ? base64.slice(base64.indexOf(",") + 1) : base64, {
      base64: true,
    });

    if (!zip.file("word/document.xml")) {
      throw new Error("word/document.xml is missing");
    }

    return zip;
  } catch {
    throw new Error("Загруженный файл не является корректным DOCX.");
  }
}

function extractTextFromXml(xml: string) {
  return xml
    .replace(/<w:tab\/>/g, "\t")
    .replace(/<w:br\/>/g, "\n")
    .replace(/<[^>]+>/g, "");
}

function getXmlFileNames(zip: PizZip) {
  return Object.keys(zip.files).filter((fileName) => XML_FILES_PATTERN.test(fileName));
}

function detectTokens(zip: PizZip) {
  const tokens: string[] = [];

  getXmlFileNames(zip).forEach((fileName) => {
    const plainText = extractTextFromXml(zip.file(fileName)?.asText() || "");
    let match = DOCX_TOKEN_PATTERN.exec(plainText);

    while (match) {
      tokens.push(match[1]);
      match = DOCX_TOKEN_PATTERN.exec(plainText);
    }

    DOCX_TOKEN_PATTERN.lastIndex = 0;
  });

  return [...new Set(tokens)];
}

function validateTemplate(type: DocumentTemplateType, zip: PizZip) {
  const detectedTokens = detectTokens(zip);
  const allowedTokens = getAllowedTokens(type);
  const unknownTokens = detectedTokens.filter((token) => !allowedTokens.has(token));
  const validationErrors: string[] = [];
  const hasItemsStart = detectedTokens.includes("items_start");
  const hasItemsEnd = detectedTokens.includes("items_end");
  const hasItemsBlock = hasItemsStart && hasItemsEnd;
  const itemTokenUsage = detectedTokens.filter((token) => token.startsWith("item_"));

  if (type === TEMPLATE_TYPES.SINGLE && (hasItemsStart || hasItemsEnd || itemTokenUsage.length > 0)) {
    validationErrors.push("single_document не поддерживает [items_start], [items_end] и item_* токены");
  }

  if (type === TEMPLATE_TYPES.REGISTRY) {
    if (!hasItemsBlock) {
      validationErrors.push("registry_document должен содержать [items_start] и [items_end]");
    }

    if (itemTokenUsage.length > 0 && !hasItemsBlock) {
      validationErrors.push("item_* токены можно использовать только вместе с [items_start]...[items_end]");
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

export async function fetchDemoDocumentTemplates(): Promise<DocumentTemplatesCatalog> {
  return {
    templates: readTemplates().map(publicTemplate),
    tokenCatalogByType: TOKEN_CATALOG_BY_TYPE,
  };
}

export async function createDemoDocumentTemplate(
  payload: CreateDocumentTemplateInput,
): Promise<DocumentTemplate> {
  if (!payload.templateFileName.toLowerCase().endsWith(".docx")) {
    throw new Error("Поддерживаются только файлы .docx.");
  }

  const zip = getZip(payload.templateContentBase64);
  const validation = validateTemplate(payload.type, zip);
  const now = new Date().toISOString();
  const template: StoredDocumentTemplate = {
    id: `template-${Date.now()}`,
    name: payload.name.trim() || payload.templateFileName.replace(/\.docx$/i, ""),
    fileName: payload.templateFileName,
    type: payload.type,
    availableTokens: TOKEN_CATALOG_BY_TYPE[payload.type],
    detectedTokens: validation.detectedTokens,
    unknownTokens: validation.unknownTokens,
    validationErrors: validation.validationErrors,
    hasItemsBlock: validation.hasItemsBlock,
    isValid: validation.isValid,
    supportedModes: SUPPORTED_MODES[payload.type],
    createdAt: now,
    updatedAt: now,
    contentBase64: payload.templateContentBase64,
  };
  const templates = readTemplates();
  writeTemplates([template, ...templates]);
  return publicTemplate(template);
}

export async function deleteDemoDocumentTemplate(id: string): Promise<{ ok: true }> {
  writeTemplates(readTemplates().filter((template) => template.id !== id));
  return { ok: true };
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function normalize(value: unknown) {
  return value == null ? "" : String(value);
}

function fieldHeader(fieldId?: string | null) {
  const field = fieldId ? demoData.getFields().find((item) => item.id === fieldId) : null;

  if (!field) {
    return {
      field_name: fieldId ? "" : "Все поля",
      field_area: "",
      field_cadastral_number: "",
    };
  }

  return {
    field_name: normalize(field.name),
    field_area: normalize(field.area),
    field_cadastral_number: normalize(field.cadastralNumber),
  };
}

function operationPayload(operation: CalendarOperation) {
  return {
    operation_id: normalize(operation.id),
    operation_date: normalize(operation.date),
    operation_type: normalize(operation.type === "ВнесениеУдобрений" ? "Внесение удобрений" : operation.type),
    operation_status: normalize(operation.status),
    operation_calendar_status: normalize(operation.calendarStatus),
    time_start: normalize(operation.timeStart),
    time_end: normalize(operation.timeEnd),
    field_id: normalize(operation.fieldId),
    crop_name: normalize(operation.crop?.name),
    crop_code: normalize(demoData.getCrops().find((crop) => crop.id === operation.crop?.id)?.code),
    equipment_name: normalize((operation as CalendarOperation & { equipment?: { name?: string } }).equipment?.name),
    equipment_type: normalize((operation as CalendarOperation & { equipment?: { type?: string } }).equipment?.type),
    equipment_model: normalize((operation as CalendarOperation & { equipment?: { model?: string } }).equipment?.model),
    equipment_reg_number: normalize((operation as CalendarOperation & { equipment?: { regNumber?: string | null } }).equipment?.regNumber),
  };
}

function resolveDocumentData(template: StoredDocumentTemplate, payload: GenerateDocumentInput) {
  const now = new Date();
  const base = {
    document_date: formatDate(now),
    generated_at: now.toISOString(),
    template_name: template.name,
    ...ENTERPRISE,
  };

  if (template.type === TEMPLATE_TYPES.SINGLE) {
    if (payload.mode !== GENERATION_MODES.BY_OPERATION || !payload.operationId) {
      throw new Error("Для одиночного документа выберите операцию.");
    }

    const operation = demoData
      .getOperations()
      .map(demoData.enrichOperation)
      .find((item) => item.id === payload.operationId);

    if (!operation) {
      throw new Error("Операция для документа не найдена.");
    }

    return {
      ...base,
      period_start: operation.date,
      period_end: operation.date,
      operations_count: "1",
      ...fieldHeader(operation.fieldId),
      ...operationPayload(operation),
    };
  }

  const dateFrom = payload.mode === GENERATION_MODES.BY_DAY ? payload.date : payload.dateFrom;
  const dateTo = payload.mode === GENERATION_MODES.BY_DAY ? payload.date : payload.dateTo;

  if (!dateFrom || !dateTo) {
    throw new Error("Для реестра выберите дату или период.");
  }

  if (dateFrom > dateTo) {
    throw new Error("Дата начала периода не может быть позже даты окончания.");
  }

  const items = demoData
    .getOperations()
    .map(demoData.enrichOperation)
    .filter((operation) => operation.date >= dateFrom && operation.date <= dateTo)
    .filter((operation) => !payload.fieldId || operation.fieldId === payload.fieldId)
    .filter((operation) => operation.calendarStatus === "Выполнено");

  if (items.length === 0) {
    throw new Error("По выбранным параметрам не найдено выполненных операций.");
  }

  return {
    ...base,
    period_start: dateFrom,
    period_end: dateTo,
    operations_count: String(items.length),
    ...fieldHeader(payload.fieldId),
    items: items.map((operation, index) => ({
      item_index: String(index + 1),
      item_operation_id: operation.id,
      item_operation_date: operation.date,
      item_operation_type: operation.type === "ВнесениеУдобрений" ? "Внесение удобрений" : operation.type,
      item_operation_status: operation.status,
      item_operation_calendar_status: operation.calendarStatus,
      item_time_start: normalize(operation.timeStart),
      item_time_end: normalize(operation.timeEnd),
      item_field_id: operation.fieldId,
      item_field_name: normalize(operation.field?.name),
      item_field_area: normalize(operation.field?.area),
      item_field_cadastral_number: normalize(demoData.getFields().find((field) => field.id === operation.fieldId)?.cadastralNumber),
      item_crop_name: normalize(operation.crop?.name),
      item_crop_code: normalize(demoData.getCrops().find((crop) => crop.id === operation.crop?.id)?.code),
      item_equipment_name: normalize((operation as CalendarOperation & { equipment?: { name?: string } }).equipment?.name),
      item_equipment_type: normalize((operation as CalendarOperation & { equipment?: { type?: string } }).equipment?.type),
      item_equipment_model: normalize((operation as CalendarOperation & { equipment?: { model?: string } }).equipment?.model),
      item_equipment_reg_number: normalize((operation as CalendarOperation & { equipment?: { regNumber?: string | null } }).equipment?.regNumber),
    })),
  };
}

function replaceRegistryControlTags(zip: PizZip) {
  getXmlFileNames(zip).forEach((fileName) => {
    const content = zip.file(fileName)?.asText() || "";
    const transformed = content
      .replace(/\[items_start\]/g, "[#items]")
      .replace(/\[items_end\]/g, "[/items]");

    if (transformed !== content) {
      zip.file(fileName, transformed);
    }
  });
}

export async function generateDemoDocument(payload: GenerateDocumentInput): Promise<Blob> {
  const template = readTemplates().find((item) => item.id === payload.templateId);

  if (!template) {
    throw new Error("Шаблон не найден.");
  }

  if (!template.isValid) {
    throw new Error("Нельзя генерировать документ по невалидному шаблону.");
  }

  const zip = getZip(template.contentBase64);
  replaceRegistryControlTags(zip);

  try {
    const document = new Docxtemplater(zip, {
      delimiters: { start: "[", end: "]" },
      linebreaks: true,
      paragraphLoop: true,
      nullGetter() {
        return "";
      },
    });
    document.render(resolveDocumentData(template, payload));

    return document.getZip().generate({
      type: "blob",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      compression: "DEFLATE",
    });
  } catch {
    throw new Error("Не удалось сгенерировать документ по выбранному шаблону.");
  }
}

export function getDemoDocumentTokenCatalog(): Record<DocumentTemplateType, DocumentTokenDefinition[]> {
  return TOKEN_CATALOG_BY_TYPE;
}
