import { useState } from "react";
import { updateField } from "../shared/api/fields";
import type { Field } from "../entities/field/types";

interface Props {
  field: Field;
  onClose: () => void;
  onSave: (updated: Field) => void;
}

export default function FieldEditModal({ field, onClose, onSave }: Props) {
  const [name, setName] = useState(field.name);
  const [area, setArea] = useState(String(field.area));
  const [cadastralNumber, setCadastralNumber] = useState(field.cadastralNumber ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const updated = await updateField(field.id, {
        name: name.trim(),
        area: parseFloat(area),
        cadastralNumber: cadastralNumber.trim() || undefined,
      });
      onSave(updated);
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
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-800">Редактировать поле</h2>
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
            <label className="block text-xs font-medium text-gray-600 mb-1">Название</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Площадь, га</label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Кадастровый номер (опц.)
            </label>
            <input
              type="text"
              value={cadastralNumber}
              onChange={(e) => setCadastralNumber(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
            />
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
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-green-primary rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {saving ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
