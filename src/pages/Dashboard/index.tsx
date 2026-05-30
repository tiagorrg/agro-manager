import { useFetch } from "../../shared/lib/useFetch";
import { fetchDashboard } from "../../shared/api/dashboard";
import FieldsMiniMap from "../../widgets/dashboard/FieldsMiniMap";
import WeatherWidget from "../../widgets/dashboard/WeatherWidget";
import DashboardMetrics from "../../components/DashboardMetrics";
import RiskRecommendationsCenter from "../../components/RiskRecommendationsCenter";

export default function DashboardPage() {
  const { data, loading, error } = useFetch(fetchDashboard);

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-start">

      <section className="flex-1 min-w-0 space-y-4" aria-label="Графики">
        <h2 className="text-xl font-semibold text-gray-800">Дашборд</h2>
        <FieldsMiniMap />
        <WeatherWidget />
        <RiskRecommendationsCenter />
      </section>

      <aside className="w-full md:w-64 md:shrink-0" aria-label="Ключевые показатели">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Показатели
        </h3>
        <DashboardMetrics data={data} loading={loading} error={error} />
      </aside>

    </div>
  );
}
