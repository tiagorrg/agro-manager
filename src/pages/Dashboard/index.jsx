import { fetchDashboard } from "../../shared/api/dashboard";
import { useFetch } from "../../shared/lib/useFetch";
import MetricCard from "../../widgets/dashboard/MetricCard";
import FieldsMiniMap from "../../widgets/dashboard/FieldsMiniMap";
import WeatherWidget from "../../widgets/dashboard/WeatherWidget";
import CropPieChart from "../../widgets/dashboard/CropPieChart";

const icons = {
  area: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  fields: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
  ),
  harvest: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  ),
  ops: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
};

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

      {/* Левая колонка — графики (заглушка) */}
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
              icon={icons.area}
            />
            <MetricCard
              label="Активных полей"
              value={String(data.activeFields ?? 0)}
              unit="полей"
              trend={null}
              icon={icons.fields}
            />
            <MetricCard
              label="Урожай (факт)"
              value={(data.harvestForecast ?? 0).toLocaleString("ru")}
              unit="т"
              trend={data.harvestTrend ?? null}
              icon={icons.harvest}
            />
            <MetricCard
              label="Выполнено работ"
              value={String(data.completedOpsPercent ?? 0)}
              unit="%"
              trend={null}
              icon={icons.ops}
            />
          </div>
        )}

        {data && <CropPieChart data={data.cropsDistribution} />}
      </aside>

    </div>
  );
}
