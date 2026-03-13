import { fetchDashboard } from "../../shared/api/dashboard";
import { useFetch } from "../../shared/lib/useFetch";
import MetricCard from "../../widgets/dashboard/MetricCard";
import FieldsMiniMap from "../../widgets/dashboard/FieldsMiniMap";
import WeatherWidget from "../../widgets/dashboard/WeatherWidget";
import CropPieChart from "../../widgets/dashboard/CropPieChart";
import { IconArea, IconFields, IconHarvest, IconOps } from "../../shared/ui-kit/icons";

function MetricsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 h-28 animate-pulse">
          <div className="h-3 w-24 bg-gray-200 rounded mb-4" />
          <div className="h-8 w-20 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { data, loading, error } = useFetch(fetchDashboard);

  return (
    <div className="flex gap-6 items-start">

      {/* Левая колонка — графики */}
      <section className="flex-1 min-w-0 space-y-4" aria-label="Графики">
        <h2 className="text-xl font-semibold text-gray-800">Дашборд</h2>
        <FieldsMiniMap />
        <WeatherWidget />
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex items-center justify-center h-52 text-gray-300 text-sm">
          Последние операции — в разработке
        </div>
      </section>

      {/* Правая колонка — метрики */}
      <aside className="w-64 shrink-0" aria-label="Ключевые показатели">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Показатели
        </h3>

        {loading && <MetricsSkeleton />}

        {error && (
          <p role="alert" className="text-sm text-red-500 bg-red-50 rounded-xl p-4">
            Ошибка загрузки данных
          </p>
        )}

        {data && (
          <div className="flex flex-col gap-4">
            <MetricCard
              label="Общая площадь"
              value={(data.totalArea ?? 0).toLocaleString("ru")}
              unit="га"
              trend={data.areaTrend ?? null}
              icon={<IconArea />}
            />
            <MetricCard
              label="Активных полей"
              value={String(data.activeFields ?? 0)}
              unit="полей"
              trend={null}
              icon={<IconFields />}
            />
            <MetricCard
              label="Урожай (факт)"
              value={(data.harvestForecast ?? 0).toLocaleString("ru")}
              unit="т"
              trend={data.harvestTrend ?? null}
              icon={<IconHarvest />}
            />
            <MetricCard
              label="Выполнено работ"
              value={String(data.completedOpsPercent ?? 0)}
              unit="%"
              trend={null}
              icon={<IconOps />}
            />
          </div>
        )}

        {data && <CropPieChart data={data.cropsDistribution} />}
      </aside>

    </div>
  );
}
