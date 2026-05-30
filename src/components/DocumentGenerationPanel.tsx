import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Input } from "../shared/ui-kit/input";
import { Select } from "../shared/ui-kit/select";
import { Button } from "../shared/ui-kit/button";
import type { Field } from "../entities/field/types";
import type {
  DocumentGenerationMode,
  DocumentTemplate,
  GenerateDocumentInput,
} from "../entities/document/types";
import type { CalendarOperation } from "../shared/api/operations";
import { GENERATION_MODE_LABELS, TEMPLATE_TYPE_LABELS } from "../pages/Documents/docx";

interface DocumentGenerationPanelProps {
  templates: DocumentTemplate[];
  operations: CalendarOperation[];
  fields: Field[];
  isLoadingMeta: boolean;
  operationsError: string | null;
  isGenerating: boolean;
  generationError: string | null;
  generationSuccess: string | null;
  onGenerate: (payload: GenerateDocumentInput) => Promise<void>;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function sortOperationsByDateDesc(left: CalendarOperation, right: CalendarOperation) {
  if (left.date === right.date) {
    return right.id.localeCompare(left.id);
  }

  return right.date.localeCompare(left.date);
}

function suggestMode(template: DocumentTemplate): DocumentGenerationMode {
  if (template.type === "single_document") {
    return "by_operation";
  }

  const searchableText = `${template.name} ${template.fileName}`.toLowerCase();

  if (searchableText.includes("period") || searchableText.includes("период")) {
    return "by_period";
  }

  if (
    searchableText.includes("day") ||
    searchableText.includes("ежеднев") ||
    searchableText.includes("день")
  ) {
    return "by_day";
  }

  return template.supportedModes.includes("by_period")
    ? "by_period"
    : template.supportedModes[0] ?? "by_day";
}

function formatOperationLabel(operation: CalendarOperation) {
  const date = new Date(`${operation.date}T00:00:00`).toLocaleDateString("ru-RU");
  const fieldName = operation.field?.name ?? operation.fieldId;
  return `${date} · ${operation.type} · ${fieldName}`;
}

export default function DocumentGenerationPanel({
  templates,
  operations,
  fields,
  isLoadingMeta,
  operationsError,
  isGenerating,
  generationError,
  generationSuccess,
  onGenerate,
}: DocumentGenerationPanelProps) {
  const [templateId, setTemplateId] = useState("");
  const [mode, setMode] = useState<DocumentGenerationMode>("by_operation");
  const [operationId, setOperationId] = useState("");
  const [date, setDate] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [fieldId, setFieldId] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const validTemplates = useMemo(
    () => templates.filter((template) => template.isValid),
    [templates],
  );

  const selectedTemplate = useMemo(
    () => validTemplates.find((template) => template.id === templateId) ?? validTemplates[0],
    [validTemplates, templateId],
  );

  const completedOperations = useMemo(
    () =>
      operations
        .filter((operation) => operation.calendarStatus === "Выполнено")
        .slice()
        .sort(sortOperationsByDateDesc),
    [operations],
  );

  const fallbackDate = completedOperations[0]?.date ?? todayStr();
  const defaultOperationId = completedOperations[0]?.id ?? operations[0]?.id ?? "";

  useEffect(() => {
    if (!selectedTemplate) {
      setTemplateId("");
      return;
    }

    setTemplateId(selectedTemplate.id);
  }, [selectedTemplate]);

  useEffect(() => {
    if (!selectedTemplate) {
      return;
    }

    setMode(suggestMode(selectedTemplate));
    setFieldId("");
    setFormError(null);

    if (selectedTemplate.type === "single_document") {
      setOperationId(defaultOperationId);
      return;
    }

    setDate(fallbackDate);
    setDateFrom(fallbackDate);
    setDateTo(fallbackDate);
  }, [defaultOperationId, fallbackDate, selectedTemplate]);

  useEffect(() => {
    if (!selectedTemplate) {
      return;
    }

    if (!selectedTemplate.supportedModes.includes(mode)) {
      setMode(suggestMode(selectedTemplate));
    }
  }, [mode, selectedTemplate]);

  useEffect(() => {
    if (mode === "by_operation") {
      setFieldId("");
      setOperationId((current) => current || defaultOperationId);
      return;
    }

    setFieldId("");
    setFormError(null);
  }, [defaultOperationId, mode]);

  useEffect(() => {
    if (operations.length === 0) {
      return;
    }

    setDate((current) => (current ? current : fallbackDate));
    setDateFrom((current) => (current ? current : fallbackDate));
    setDateTo((current) => (current ? current : fallbackDate));
    setOperationId((current) => current || defaultOperationId);
  }, [defaultOperationId, fallbackDate, operations.length]);

  const operationOptions = useMemo(
    () =>
      completedOperations
        .slice()
        .sort(sortOperationsByDateDesc)
        .map((operation) => ({
          value: operation.id,
          label: formatOperationLabel(operation),
        })),
    [completedOperations],
  );

  const fieldOptions = useMemo(
    () => [
      { value: "", label: "Все поля" },
      ...fields.map((field) => ({
        value: field.id,
        label: `${field.name} · ${field.area} га`,
      })),
    ],
    [fields],
  );

  const modeOptions = useMemo(
    () =>
      (selectedTemplate?.supportedModes ?? []).map((value) => ({
        value,
        label: GENERATION_MODE_LABELS[value],
      })),
    [selectedTemplate],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedTemplate) {
      setFormError("Сначала загрузите и провалидируйте хотя бы один шаблон.");
      return;
    }

    if (mode === "by_operation" && !operationId) {
      setFormError("Выберите операцию для одиночного документа.");
      return;
    }

    if (mode === "by_day" && !date) {
      setFormError("Выберите дату реестра.");
      return;
    }

    if (mode === "by_period") {
      if (!dateFrom || !dateTo) {
        setFormError("Укажите начало и конец периода.");
        return;
      }

      if (dateFrom > dateTo) {
        setFormError("Дата начала периода не может быть позже даты окончания.");
        return;
      }
    }

    setFormError(null);

    await onGenerate({
      templateId: selectedTemplate.id,
      mode,
      operationId: mode === "by_operation" ? operationId : undefined,
      date: mode === "by_day" ? date : undefined,
      dateFrom: mode === "by_period" ? dateFrom : undefined,
      dateTo: mode === "by_period" ? dateTo : undefined,
      fieldId: mode === "by_operation" ? undefined : fieldId || undefined,
    });
  };

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-gray-800">Генерация документа</h2>
        <p className="text-sm text-gray-400">
          Выберите шаблон, режим и фильтры. Генерация использует backend-контракт и возвращает готовый DOCX.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Готовые шаблоны</p>
          <p className="mt-1 text-lg font-semibold text-gray-800">{validTemplates.length}</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Операции</p>
          <p className="mt-1 text-lg font-semibold text-gray-800">{operations.length}</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Поля</p>
          <p className="mt-1 text-lg font-semibold text-gray-800">{fields.length}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="document-generate-template" className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
            Шаблон
          </label>
          <Select
            id="document-generate-template"
            value={selectedTemplate?.id ?? ""}
            onChange={setTemplateId}
            disabled={isLoadingMeta || validTemplates.length === 0}
            options={validTemplates.map((template) => ({
              value: template.id,
              label: `${template.name} · ${TEMPLATE_TYPE_LABELS[template.type]}`,
            }))}
            placeholder="Выберите шаблон"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="document-generate-mode" className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
            Режим генерации
          </label>
          <Select
            id="document-generate-mode"
            value={mode}
            onChange={(value) => setMode(value as DocumentGenerationMode)}
            disabled={!selectedTemplate}
            options={modeOptions}
            placeholder="Выберите режим"
          />
        </div>

        {mode === "by_operation" && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="document-generate-operation" className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
              Операция
            </label>
            <Select
              id="document-generate-operation"
              value={operationId}
              onChange={(value) => {
                setOperationId(value);
                setFormError(null);
              }}
              disabled={operationOptions.length === 0}
              options={operationOptions}
              placeholder="Выберите выполненную операцию"
            />
          </div>
        )}

        {mode === "by_day" && (
          <>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="document-generate-date" className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
                Дата
              </label>
              <Input
                id="document-generate-date"
                type="date"
                value={date}
                onChange={(event) => {
                  setDate(event.target.value);
                  setFormError(null);
                }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="document-generate-field-day" className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
                Поле
              </label>
              <Select
                id="document-generate-field-day"
                value={fieldId}
                onChange={(value) => {
                  setFieldId(value);
                  setFormError(null);
                }}
                options={fieldOptions}
              />
            </div>
          </>
        )}

        {mode === "by_period" && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="document-generate-date-from" className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
                  Период с
                </label>
                <Input
                  id="document-generate-date-from"
                  type="date"
                  value={dateFrom}
                  onChange={(event) => {
                    setDateFrom(event.target.value);
                    setFormError(null);
                  }}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="document-generate-date-to" className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
                  Период по
                </label>
                <Input
                  id="document-generate-date-to"
                  type="date"
                  value={dateTo}
                  onChange={(event) => {
                    setDateTo(event.target.value);
                    setFormError(null);
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="document-generate-field-period" className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
                Поле
              </label>
              <Select
                id="document-generate-field-period"
                value={fieldId}
                onChange={(value) => {
                  setFieldId(value);
                  setFormError(null);
                }}
                options={fieldOptions}
              />
            </div>
          </>
        )}

        {mode !== "by_operation" && (
          <p className="text-xs text-gray-400">
            Для реестров по умолчанию подставляется последняя дата, где есть выполненные операции.
          </p>
        )}

        {(formError || operationsError || generationError) && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
            {formError ?? operationsError ?? generationError}
          </div>
        )}

        {generationSuccess && (
          <div className="rounded-xl border border-green-100 bg-green-50 px-3 py-2 text-sm text-green-700">
            {generationSuccess}
          </div>
        )}

        <Button type="submit" disabled={isGenerating || validTemplates.length === 0 || !!operationsError}>
          {isGenerating ? "Формируем документ..." : "Сформировать и скачать"}
        </Button>
      </form>
    </section>
  );
}
