import { useEffect } from "react";
import { getCropColor } from "../shared/config/crops";
import { useMapStore } from "../store/mapStore";
import type { Field } from "../entities/field/types";

interface Props {
  fields: Field[] | null;
  loading: boolean;
  error: string | null;
}

interface FieldCardProps {
  field: Field;
  isSelected: boolean;
  onClick: () => void;
}

function FieldCard({ field, isSelected, onClick }: FieldCardProps) {
  const color = getCropColor(field.currentCrop.name);
  return (
    <li>
      <button
        onClick={onClick}
        className={`w-full text-left px-3 py-3 rounded-xl transition-colors flex items-start gap-3 ${
          isSelected ? "bg-green-50 ring-1 ring-green-primary" : "hover:bg-gray-50"
        }`}
      >
        <span
          className="w-1 self-stretch rounded-full shrink-0 mt-0.5"
          style={{ backgroundColor: color }}
        />
        <div className="min-w-0">
          <p className={`text-sm font-semibold truncate ${isSelected ? "text-green-primary" : "text-gray-800"}`}>
            {field.name}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">{field.currentCrop.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">{field.area} га</p>
        </div>
        {isSelected && (
          <span className="ml-auto text-green-primary text-lg leading-none shrink-0">›</span>
        )}
      </button>
    </li>
  );
}

export default function MapSidebar({ fields, loading, error }: Props) {
  const selectedFieldId = useMapStore((s) => s.selectedFieldId);
  const selectField = useMapStore((s) => s.selectField);

  const totalArea = fields
    ? fields.reduce((s, f) => s + f.area, 0).toLocaleString("ru")
    : "—";

  // Keyboard navigation
  useEffect(() => {
    if (!fields?.length) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      // Не перехватываем стрелки когда фокус в поле ввода
      const tag = (document.activeElement as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      e.preventDefault();
      const currentIndex = fields.findIndex((f) => f.id === selectedFieldId);
      let nextIndex: number;
      if (currentIndex === -1) {
        nextIndex = e.key === "ArrowDown" ? 0 : fields.length - 1;
      } else {
        nextIndex =
          e.key === "ArrowDown"
            ? (currentIndex + 1) % fields.length
            : (currentIndex - 1 + fields.length) % fields.length;
      }
      selectField(fields[nextIndex]);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fields, selectedFieldId, selectField]);

  return (
    <aside className="w-72 shrink-0 bg-white border-r border-gray-100 flex flex-col overflow-hidden">
      <div className="px-4 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-800">Поля хозяйства</h2>
        {fields && (
          <p className="text-xs text-gray-400 mt-0.5">
            {fields.length} пол. · {totalArea} га
          </p>
        )}
        {fields && (
          <p className="text-[10px] text-gray-300 mt-1.5 flex items-center gap-1">
            <kbd className="inline-flex items-center justify-center w-4 h-4 rounded border border-gray-200 text-[9px] font-mono text-gray-400 bg-gray-50">↑</kbd>
            <kbd className="inline-flex items-center justify-center w-4 h-4 rounded border border-gray-200 text-[9px] font-mono text-gray-400 bg-gray-50">↓</kbd>
            переключение между полями
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {loading && (
          <div className="space-y-2 p-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        )}
        {error && <p className="text-xs text-red-400 p-3">Ошибка загрузки полей</p>}
        {fields && (
          <ul className="space-y-1">
            {fields.map((field) => (
              <FieldCard
                key={field.id}
                field={field}
                isSelected={selectedFieldId === field.id}
                onClick={() => selectField(field)}
              />
            ))}
          </ul>
        )}
      </div>

      {fields && (
        <div className="px-4 py-3 border-t border-gray-100">
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-2">
            Культуры
          </p>
          <ul className="space-y-1">
            {[...new Map(fields.map((f) => [f.currentCrop.name, f.currentCrop])).values()].map(
              (crop) => (
                <li key={crop.name} className="flex items-center gap-2 text-xs text-gray-600">
                  <span
                    className="w-2.5 h-2.5 rounded-sm shrink-0"
                    style={{ backgroundColor: getCropColor(crop.name) }}
                  />
                  {crop.name}
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </aside>
  );
}
