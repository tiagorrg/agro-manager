import { useEffect, useMemo, useState } from "react";
import type {
  CreateDocumentTemplateInput,
  DocumentTemplatesCatalog,
  DocumentTemplate,
  GenerateDocumentInput,
} from "../../entities/document/types";
import { fetchFields } from "../../shared/api/fields";
import { fetchOperations, type CalendarOperation } from "../../shared/api/operations";
import {
  createDocumentTemplate,
  deleteDocumentTemplate,
  fetchDocumentTemplates,
  generateDocument,
} from "../../shared/api/documents";
import type { Field } from "../../entities/field/types";
import DocumentTemplateUploadForm from "../../components/DocumentTemplateUploadForm";
import DocumentTemplatesPanel from "../../components/DocumentTemplatesPanel";
import DocumentGenerationPanel from "../../components/DocumentGenerationPanel";
import { buildGeneratedFileName, downloadGeneratedDocument } from "./docx";
import { fileToBase64 } from "./storage";

function sortTemplates(templates: DocumentTemplate[]) {
  return templates
    .slice()
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

export default function DocumentsPage() {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [tokenCatalogByType, setTokenCatalogByType] = useState<
    DocumentTemplatesCatalog["tokenCatalogByType"]
  >({
    single_document: [],
    registry_document: [],
  });
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [templatesError, setTemplatesError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [operations, setOperations] = useState<CalendarOperation[]>([]);
  const [operationsLoading, setOperationsLoading] = useState(true);
  const [operationsError, setOperationsError] = useState<string | null>(null);

  const [fields, setFields] = useState<Field[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generationSuccess, setGenerationSuccess] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchDocumentTemplates()
      .then((payload) => {
        if (!cancelled) {
          setTemplates(sortTemplates(payload.templates));
          setTokenCatalogByType(payload.tokenCatalogByType);
          setTemplatesError(null);
          setTemplatesLoading(false);
        }
      })
      .catch((error: Error) => {
        if (!cancelled) {
          setTemplatesError(error.message);
          setTemplatesLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetchOperations()
      .then((items) => {
        if (!cancelled) {
          setOperations(items);
          setOperationsError(null);
          setOperationsLoading(false);
        }
      })
      .catch((error: Error) => {
        if (!cancelled) {
          setOperationsError(error.message);
          setOperationsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetchFields()
      .then((items) => {
        if (!cancelled) {
          setFields(items);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  const validTemplates = useMemo(
    () => templates.filter((template) => template.isValid),
    [templates],
  );

  const availableFields = useMemo(() => {
    if (fields.length > 0) {
      return fields;
    }

    const uniqueFields = new Map<string, Field>();

    operations.forEach((operation) => {
      if (operation.field) {
        uniqueFields.set(operation.field.id, {
          id: operation.field.id,
          name: operation.field.name,
          area: operation.field.area,
          currentCrop: {
            id: operation.crop?.id ?? `${operation.field.id}-crop`,
            name: operation.crop?.name ?? "Не указана",
          },
          coordinates: { type: "Polygon", coordinates: [] },
        });
      }
    });

    return Array.from(uniqueFields.values());
  }, [fields, operations]);

  const handleCreateTemplate = async ({
    name,
    type,
    file,
  }: {
    name: string;
    type: CreateDocumentTemplateInput["type"];
    file: File;
  }) => {
    setIsCreating(true);
    setCreateError(null);

    try {
      const templateContentBase64 = await fileToBase64(file);
      const createdTemplate = await createDocumentTemplate({
        name,
        type,
        templateFileName: file.name,
        templateContentBase64,
      });

      setTemplates((previous) => sortTemplates([createdTemplate, ...previous]));
    } catch (error) {
      setCreateError(error instanceof Error ? error.message : "Не удалось загрузить шаблон.");
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    setDeleteId(id);

    try {
      await deleteDocumentTemplate(id);
      setTemplates((previous) => previous.filter((template) => template.id !== id));
      setTemplatesError(null);
    } catch (error) {
      setTemplatesError(
        error instanceof Error ? error.message : "Не удалось удалить шаблон.",
      );
    } finally {
      setDeleteId(null);
    }
  };

  const handleGenerateDocument = async (payload: GenerateDocumentInput) => {
    const template = templates.find((item) => item.id === payload.templateId);

    if (!template) {
      setGenerationError("Шаблон не найден. Обновите страницу и попробуйте снова.");
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);
    setGenerationSuccess(null);

    try {
      const blob = await generateDocument(payload);
      const fileName = buildGeneratedFileName(template, payload.mode, payload);
      downloadGeneratedDocument(blob, fileName);
      setGenerationSuccess(`Документ ${fileName} сформирован и скачан.`);
    } catch (error) {
      setGenerationError(
        error instanceof Error ? error.message : "Не удалось сформировать документ.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="py-6 flex flex-col gap-6">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Документы</h1>
          <p className="mt-1 text-sm text-gray-400 max-w-3xl">
            MVP-экран для DOCX-шаблонов: загрузка, валидация и генерация одиночных документов
            или реестров по операциям.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-gray-500">
          <span className="rounded-full bg-white border border-gray-200 px-3 py-1.5">
            Шаблонов: {templates.length}
          </span>
          <span className="rounded-full bg-white border border-gray-200 px-3 py-1.5">
            Валидных: {validTemplates.length}
          </span>
          <span className="rounded-full bg-white border border-gray-200 px-3 py-1.5">
            Операций: {operations.length}
          </span>
        </div>
      </div>

      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] items-start">
        <div className="contents xl:flex xl:flex-col xl:gap-6">
          <DocumentTemplateUploadForm
            isSubmitting={isCreating}
            error={createError}
            onSubmit={handleCreateTemplate}
          />
        </div>

        <div className="contents xl:block">
          <DocumentGenerationPanel
            templates={templates}
            operations={operations}
            fields={availableFields}
            isLoadingMeta={templatesLoading || operationsLoading}
            operationsError={operationsError}
            isGenerating={isGenerating}
            generationError={generationError}
            generationSuccess={generationSuccess}
            onGenerate={handleGenerateDocument}
          />
        </div>

        <div className="xl:col-start-1 xl:row-start-2">
          <DocumentTemplatesPanel
            templates={templates}
            tokenCatalogByType={tokenCatalogByType}
            isLoading={templatesLoading}
            error={templatesError}
            deletingId={deleteId}
            onDelete={handleDeleteTemplate}
          />
        </div>
      </div>
    </div>
  );
}
