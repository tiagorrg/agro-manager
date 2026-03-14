import type { DashboardData } from "../shared/api/dashboard";
import MetricCard from "../widgets/dashboard/MetricCard";
import CropPieChart from "../widgets/dashboard/CropPieChart";
import { IconArea, IconFields, IconHarvest, IconOps } from "../shared/ui-kit/icons";

interface Props {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
}

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

export default function DashboardMetrics({ data, loading, error }: Props) {
  if (loading) return <MetricsSkeleton />;

  if (error) {
    return (
      <p role="alert" className="text-sm text-red-500 bg-red-50 rounded-xl p-4">
        Ошибка загрузки данных
      </p>
    );
  }

  if (!data) return null;

  return (
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
      <CropPieChart data={data.cropsDistribution} />
    </div>
  );
}
