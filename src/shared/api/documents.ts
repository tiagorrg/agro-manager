import { API_URL, IS_DEMO_MODE } from "../config";
import type {
  CreateDocumentTemplateInput,
  DocumentTemplatesCatalog,
  DocumentTokenDefinition,
  DocumentTemplate,
  DocumentTemplateType,
  GenerateDocumentInput,
} from "../../entities/document/types";
import {
  createDemoDocumentTemplate,
  deleteDemoDocumentTemplate,
  fetchDemoDocumentTemplates,
  generateDemoDocument,
} from "../demo/documents";

const JSON_HEADERS = {
  "Content-Type": "application/json",
};

interface ApiErrorPayload {
  ok?: false;
  error?: {
    message?: string;
  };
}

interface ApiSuccessEnvelope<T> {
  ok: true;
  data: T;
}

interface BackendValidationError {
  code: string;
  message: string;
}

interface BackendTemplate {
  id: string;
  name: string;
  type: DocumentTemplate["type"];
  templateFileName: string;
  originalFileName: string;
  supportedModes: DocumentTemplate["supportedModes"];
  availableTokens?: DocumentTokenDefinition[];
  detectedTokens: string[];
  unknownTokens: string[];
  validationErrors: BackendValidationError[];
  isValid: boolean;
  hasItemsBlock: boolean;
  createdAt: string;
  updatedAt: string;
}

function mapTemplate(template: BackendTemplate): DocumentTemplate {
  return {
    id: template.id,
    name: template.name,
    fileName: template.originalFileName || template.templateFileName,
    type: template.type,
    availableTokens: template.availableTokens,
    detectedTokens: template.detectedTokens,
    unknownTokens: template.unknownTokens,
    validationErrors: template.validationErrors.map((entry) => entry.message),
    hasItemsBlock: template.hasItemsBlock,
    isValid: template.isValid,
    supportedModes: template.supportedModes,
    createdAt: template.createdAt,
    updatedAt: template.updatedAt,
  };
}

async function requestJson<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: JSON_HEADERS,
    ...options,
  });

  if (!response.ok) {
    let message = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const payload = (await response.json()) as ApiErrorPayload;
      if (payload.error?.message) {
        message = payload.error.message;
      }
    } catch {
      // ignore parsing errors for non-json payloads
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

async function requestBlob(path: string, body: unknown): Promise<Blob> {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let message = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const payload = (await response.json()) as ApiErrorPayload;
      if (payload.error?.message) {
        message = payload.error.message;
      }
    } catch {
      // ignore parsing errors for non-json payloads
    }
    throw new Error(message);
  }

  return response.blob();
}

export const fetchDocumentTemplates = async (): Promise<DocumentTemplatesCatalog> => {
  if (IS_DEMO_MODE) {
    return fetchDemoDocumentTemplates();
  }

  const payload = await requestJson<
    ApiSuccessEnvelope<{
      templates: BackendTemplate[];
      tokenCatalogByType?: Record<DocumentTemplateType, DocumentTokenDefinition[]>;
    }>
  >("/documents/templates");

  return {
    templates: payload.data.templates.map(mapTemplate),
    tokenCatalogByType: payload.data.tokenCatalogByType ?? {
      single_document: [],
      registry_document: [],
    },
  };
};

export const createDocumentTemplate = async (
  payload: CreateDocumentTemplateInput,
): Promise<DocumentTemplate> => {
  if (IS_DEMO_MODE) {
    return createDemoDocumentTemplate(payload);
  }

  const response = await requestJson<
    ApiSuccessEnvelope<{ template: BackendTemplate }>
  >("/documents/templates", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return mapTemplate(response.data.template);
};

export const deleteDocumentTemplate = async (id: string): Promise<{ ok: true }> => {
  if (IS_DEMO_MODE) {
    return deleteDemoDocumentTemplate(id);
  }

  await requestJson<ApiSuccessEnvelope<{ id: string; deleted: true }>>(
    `/documents/templates/${id}`,
    {
      method: "DELETE",
    },
  );

  return { ok: true };
};

export const generateDocument = (payload: GenerateDocumentInput): Promise<Blob> =>
  IS_DEMO_MODE ? generateDemoDocument(payload) : requestBlob("/documents/generate", payload);
