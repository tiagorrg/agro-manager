import { useParams, useNavigate } from "react-router-dom";
import { useFetch } from "../../shared/lib/useFetch";
import { fetchFieldDetail } from "../../shared/api/fields";
import { getCropColor } from "../../shared/config/crops";
import MetricCard from "../../widgets/dashboard/MetricCard";
import { IconArea, IconHarvest, IconOps, IconFields } from "../../shared/ui-kit/icons";
import { OperationsTable } from "./components/OperationsTable";

export default function FieldDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: field, loading, error } = useFetch(() => fetchFieldDetail(id!));

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-6 transition-colors"
      >
        ← Назад
      </button>

      {loading && (
        <div className="space-y-4 animate-pulse">
          <div className="h-8 w-56 bg-gray-200 rounded-lg" />
          <div className="h-4 w-32 bg-gray-100 rounded" />
          <div className="mt-6 grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-gray-100 rounded-2xl" />
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="text-red-400 text-sm">Не удалось загрузить данные поля</div>
      )}

      {field && (
        <>
          {/* Заголовок */}
          <div className="flex items-start gap-3 mb-6">
            <span
              className="w-1.5 self-stretch rounded-full shrink-0 mt-1"
              style={{ backgroundColor: getCropColor(field.currentCrop.name) }}
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{field.name}</h1>
              <p className="text-sm text-gray-400 mt-0.5">
                {field.currentCrop.name} · {field.area} га
                {field.cadastralNumber && ` · ${field.cadastralNumber}`}
              </p>
            </div>
          </div>

          {/* Метрики */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <MetricCard
              label="Площадь"
              value={String(field.area)}
              unit="га"
              icon={<IconArea />}
            />
            <MetricCard
              label="Культура"
              value={field.currentCrop.name}
              unit="текущий сезон"
              icon={<IconHarvest />}
            />
            <MetricCard
              label="Операций"
              value={String(field.operations.length)}
              unit="всего"
              icon={<IconOps />}
            />
            <MetricCard
              label="Урожаев"
              value={String(field.harvests.length)}
              unit="сезонов"
              icon={<IconFields />}
            />
          </div>

          {/* Операции */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Операции</h2>
            <OperationsTable operations={field.operations} />
          </div>
        </>
      )}
    </div>
  );
}
