export type DocumentTemplateType = "single_document" | "registry_document";

export type DocumentGenerationMode = "by_operation" | "by_day" | "by_period";

export interface DocumentTokenDefinition {
  token: string;
  description: string;
  section: "common" | "singleOnly" | "registryOnly";
}

export interface DocumentTemplate {
  id: string;
  name: string;
  fileName: string;
  type: DocumentTemplateType;
  availableTokens?: DocumentTokenDefinition[];
  detectedTokens: string[];
  unknownTokens: string[];
  validationErrors: string[];
  hasItemsBlock: boolean;
  isValid: boolean;
  supportedModes: DocumentGenerationMode[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateDocumentTemplateInput {
  name: string;
  type: DocumentTemplateType;
  templateFileName: string;
  templateContentBase64: string;
}

export interface GenerateDocumentInput {
  templateId: string;
  mode: DocumentGenerationMode;
  operationId?: string;
  date?: string;
  dateFrom?: string;
  dateTo?: string;
  fieldId?: string;
}

export interface DocumentTemplatesCatalog {
  templates: DocumentTemplate[];
  tokenCatalogByType: Record<DocumentTemplateType, DocumentTokenDefinition[]>;
}
