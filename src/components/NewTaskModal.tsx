import { useState, useEffect } from "react";
import { fetchFields } from "../shared/api/fields";
import { createOperation, type CalendarOperation, type CreateOperationInput } from "../shared/api/operations";
import { Select } from "../shared/ui-kit/select";
import type { Field } from "../entities/field/types";
import type { OperationType } from "../entities/operation/types";

const OPERATION_TYPES: OperationType[] = ["Посев", "Обработка", "Уборка", "ВнесениеУдобрений"];
const TYPE_LABELS: Record<OperationType, string> = {
  Посев: "Посев",
  Обработка: "Обработка",
  Уборка: "Уборка",
  ВнесениеУдобрений: "Внесение удобрений",
};

interface Props {
  defaultDate?: string;
  onClose: () => void;
  onCreate: (op: CalendarOperation) => void;
}

export default function NewTaskModal({ defaultDate, onClose, onCreate }: Props) {
  const [fields, setFields] = useState<Field[]>([]);
  const [fieldId, setFieldId] = useState("");
  const [type, setType] = useState<OperationType>("Посев");
  const [date, setDate] = useState(defaultDate ?? new Date().toISOString().slice(0, 10));
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFields().then((data) => {
      setFields(data);
      if (data.length > 0) setFieldId(data[0].id);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldId) return;
    setSaving(true);
    setError(null);
    try {
      const input: CreateOperationInput = { fieldId, type, date };
      if (timeStart) input.timeStart = timeStart;
      if (timeEnd) input.timeEnd = timeEnd;
      const op = await createOperation(input);
      onCreate(op);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ошибка сохранения");
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-800">Новая задача</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 transition-colors text-lg leading-none"
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Поле</label>
            <Select
              value={fieldId}
              onChange={setFieldId}
              placeholder="Выберите поле"
              options={fields.map((f) => ({
                value: f.id,
                label: `${f.name} (${f.currentCrop.name})`,
              }))}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Тип операции</label>
            <Select
              value={type}
              onChange={(value) => setType(value as OperationType)}
              options={OPERATION_TYPES.map((t) => ({ value: t, label: TYPE_LABELS[t] }))}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Дата</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Начало (опц.)</label>
              <input
                type="time"
                value={timeStart}
                onChange={(e) => setTimeStart(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Конец (опц.)</label>
              <input
                type="time"
                value={timeEnd}
                onChange={(e) => setTimeEnd(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
              />
            </div>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="flex gap-2 justify-end pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={saving || !fieldId}
              className="px-4 py-2 text-sm font-medium text-white bg-green-primary rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {saving ? "Сохранение..." : "Создать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
