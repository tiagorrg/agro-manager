import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchFields } from "../../shared/api/fields";
import { getCropColor } from "../../shared/config/crops";
import type { Field } from "../../entities/field/types";

export default function FieldsPage() {
  const navigate = useNavigate();
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchFields()
      .then((data) => { if (!cancelled) { setFields(data); setLoading(false); } })
      .catch((err: Error) => { if (!cancelled) { setError(err.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-44 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-48 text-red-400 text-sm">
        Не удалось загрузить поля
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">Поля</h1>
        <span className="text-sm text-gray-400">{fields.length} полей</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {fields.map((field) => {
          const color = getCropColor(field.currentCrop.name);
          return (
            <div
              key={field.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col"
            >
              {/* Цветная полоса культуры */}
              <div className="h-1.5 w-full" style={{ backgroundColor: color }} />

              <div className="p-5 flex flex-col gap-3 flex-1">
                <div>
                  <h2 className="text-base font-semibold text-gray-800">{field.name}</h2>
                  <p className="text-sm text-gray-400 mt-0.5">{field.currentCrop.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 rounded-xl p-2.5">
                    <p className="text-[10px] text-gray-400 mb-0.5">Площадь</p>
                    <p className="text-sm font-semibold text-gray-700">{field.area} га</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-2.5">
                    <p className="text-[10px] text-gray-400 mb-0.5">Кадастр</p>
                    <p className="text-xs font-medium text-gray-600 truncate">
                      {field.cadastralNumber ?? "—"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/fields/${field.id}`)}
                  className="mt-auto w-full py-2 text-sm font-medium text-green-700 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
                >
                  Подробнее →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
