import { getCropColor } from "../shared/config/crops";
import type { FieldDetail } from "../entities/field/types";

interface Props {
  field: FieldDetail;
  onEdit?: () => void;
}

export default function FieldHeader({ field, onEdit }: Props) {
  const color = getCropColor(field.currentCrop.name);
  return (
    <div className="flex items-start gap-3 mb-6">
      <span
        className="w-1.5 self-stretch rounded-full shrink-0 mt-1"
        style={{ backgroundColor: color }}
      />
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-gray-800">{field.name}</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {field.currentCrop.name} · {field.area} га
          {field.cadastralNumber && ` · ${field.cadastralNumber}`}
        </p>
      </div>
      {onEdit && (
        <button
          onClick={onEdit}
          className="shrink-0 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Редактировать
        </button>
      )}
    </div>
  );
}
