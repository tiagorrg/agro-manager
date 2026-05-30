import type {
  DocumentGenerationMode,
  DocumentTemplate,
  DocumentTemplateType,
  DocumentTokenDefinition,
} from "../../entities/document/types";

export const TEMPLATE_TYPE_LABELS: Record<DocumentTemplateType, string> = {
  single_document: "Одиночный документ",
  registry_document: "Реестр",
};

export const GENERATION_MODE_LABELS: Record<DocumentGenerationMode, string> = {
  by_operation: "По операции",
  by_day: "За день",
  by_period: "За период",
};

export const TOKEN_SECTION_LABELS: Record<DocumentTokenDefinition["section"], string> = {
  common: "Общие поля",
  singleOnly: "Одиночный документ",
  registryOnly: "Реестр и строки items",
};

export function downloadGeneratedDocument(blob: Blob, fileName: string) {
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(url);
}

export function buildGeneratedFileName(
  template: Pick<DocumentTemplate, "name">,
  mode: DocumentGenerationMode,
  params: {
    operationId?: string;
    date?: string;
    dateFrom?: string;
    dateTo?: string;
  },
) {
  const normalizedTemplateName = slugify(template.name) || "document";

  if (mode === "by_operation" && params.operationId) {
    return `${normalizedTemplateName}-${params.operationId}.docx`;
  }

  if (mode === "by_day" && params.date) {
    return `${normalizedTemplateName}-${params.date}.docx`;
  }

  if (mode === "by_period") {
    return `${normalizedTemplateName}-${params.dateFrom ?? "start"}-${params.dateTo ?? "end"}.docx`;
  }

  return `${normalizedTemplateName}.docx`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/^-+|-+$/g, "");
}
