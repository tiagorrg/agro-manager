import clsx from "clsx";
import type { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string;
  unit?: string;
  trend?: number | null;
  icon: ReactNode;
}

export default function MetricCard({ label, value, unit, trend, icon }: MetricCardProps) {
  const trendPositive = trend !== null && trend !== undefined && trend > 0;
  const trendNegative = trend !== null && trend !== undefined && trend < 0;

  return (
    <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500 font-medium">{label}</span>
        <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-green-50 text-green-primary">
          {icon}
        </span>
      </div>

      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-gray-900 leading-none">{value}</span>
        {unit && <span className="text-sm text-gray-400 mb-0.5">{unit}</span>}
      </div>

      {trend !== null && trend !== undefined && (
        <p
          className={clsx(
            "text-xs font-medium",
            trendPositive && "text-emerald-600",
            trendNegative && "text-red-500",
            !trendPositive && !trendNegative && "text-gray-400",
          )}
        >
          {trendPositive && "↑"}
          {trendNegative && "↓"}
          {Math.abs(trend)}% к прошлому году
        </p>
      )}
    </article>
  );
}
