import { useRef, useState, type FormEvent } from "react";
import { Input } from "../shared/ui-kit/input";
import { Select } from "../shared/ui-kit/select";
import { Button } from "../shared/ui-kit/button";
import type { DocumentTemplateType } from "../entities/document/types";
import { TEMPLATE_TYPE_LABELS } from "../pages/Documents/docx";

interface DocumentTemplateUploadFormProps {
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (payload: {
    name: string;
    type: DocumentTemplateType;
    file: File;
  }) => Promise<void>;
}

const TYPE_OPTIONS = (Object.entries(TEMPLATE_TYPE_LABELS) as Array<
  [DocumentTemplateType, string]
>).map(([value, label]) => ({
  value,
  label,
}));

export default function DocumentTemplateUploadForm({
  isSubmitting,
  error,
  onSubmit,
}: DocumentTemplateUploadFormProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<DocumentTemplateType>("single_document");
  const [file, setFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (nextFile: File | null) => {
    setFile(nextFile);
    setFormError(null);

    if (!nextFile || name.trim()) {
      return;
    }

    const cleanName = nextFile.name.replace(/\.docx$/i, "");
    setName(cleanName);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      setFormError("Загрузите DOCX-шаблон.");
      return;
    }

    if (!name.trim()) {
      setFormError("Укажите название шаблона.");
      return;
    }

    setFormError(null);

    try {
      await onSubmit({
        name: name.trim(),
        type,
        file,
      });

      setName("");
      setType("single_document");
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch {
      // Ошибка уже отрисована родительским контейнером.
    }
  };

  return (
    <section className="min-w-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-gray-800">Загрузить шаблон</h2>
        <p className="text-sm text-gray-400">
          Поддерживается только <span className="font-medium text-gray-500">.docx</span>. Подсказчик
          переменных и визуальный мастер оставляем на следующую итерацию.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="min-w-0 flex flex-col gap-4">
        <div className="min-w-0 flex flex-col gap-1.5">
          <label htmlFor="document-template-name" className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">
            Название шаблона
          </label>
          <Input
            id="document-template-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Например, Реестр выполненных работ"
            disabled={isSubmitting}
          />
        </div>

        <div className="min-w-0 flex flex-col gap-1.5">
          <label htmlFor="document-template-type" className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">
            Тип шаблона
          </label>
          <Select
            id="document-template-type"
            value={type}
            onChange={(value) => setType(value as DocumentTemplateType)}
            options={TYPE_OPTIONS}
            disabled={isSubmitting}
          />
        </div>

        <div className="min-w-0 flex flex-col gap-1.5">
          <label htmlFor="document-template-file" className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">
            DOCX-файл
          </label>
          <label
            htmlFor="document-template-file"
            className="min-w-0 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-4 text-sm text-gray-500 hover:border-green-300 hover:bg-green-50/50 transition-colors cursor-pointer"
          >
            <span className="block break-words font-medium text-gray-700">
              {file ? file.name : "Выберите или перетащите шаблон"}
            </span>
            <span className="block mt-1 break-words text-xs text-gray-400">
              Пример маркеров: `[document_date]`, `[field_name]`, `[items_start]...[items_end]`
            </span>
          </label>
          <input
            ref={fileInputRef}
            id="document-template-file"
            type="file"
            accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="sr-only"
            disabled={isSubmitting}
            onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
          />
        </div>

        {(formError || error) && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
            {formError ?? error}
          </div>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Загружаем шаблон..." : "Сохранить шаблон"}
        </Button>
      </form>
    </section>
  );
}
