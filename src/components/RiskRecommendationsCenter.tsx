import { useNavigate } from "react-router-dom";
import { useFetch } from "../shared/lib/useFetch";
import {
  fetchRecommendations,
  type RecommendationItem,
  type RecommendationSeverity,
} from "../shared/api/recommendations";

const SEVERITY_VIEW: Record<RecommendationSeverity, { label: string; tone: string; dot: string }> = {
  high: {
    label: "Высокий риск",
    tone: "bg-red-50 text-red-700 border-red-100",
    dot: "bg-red-500",
  },
  medium: {
    label: "Нужно внимание",
    tone: "bg-amber-50 text-amber-700 border-amber-100",
    dot: "bg-amber-500",
  },
  low: {
    label: "Планирование",
    tone: "bg-gray-50 text-gray-600 border-gray-100",
    dot: "bg-gray-400",
  },
  info: {
    label: "Ближайшее",
    tone: "bg-blue-50 text-blue-700 border-blue-100",
    dot: "bg-blue-500",
  },
};

function RecommendationsSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="h-5 w-48 bg-gray-100 rounded mb-4 animate-pulse" />
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="h-24 bg-gray-50 rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}

function RecommendationCard({ item }: { item: RecommendationItem }) {
  const navigate = useNavigate();
  const view = SEVERITY_VIEW[item.severity];

  return (
    <article className="rounded-xl bg-gray-50 p-3 min-h-[132px] flex flex-col">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1 ${view.dot}`} />
          <h3 className="text-sm font-semibold leading-snug text-gray-800">{item.title}</h3>
        </div>
        <span className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full border ${view.tone}`}>
          {view.label}
        </span>
      </div>
      <p className="text-xs leading-relaxed text-gray-500">{item.description}</p>
      <button
        type="button"
        onClick={() => navigate(item.actionHref)}
        className="mt-auto pt-3 text-left text-xs font-medium text-green-700 hover:text-green-800"
      >
        {item.actionLabel} →
      </button>
    </article>
  );
}

export default function RiskRecommendationsCenter() {
  const { data, loading, error } = useFetch(fetchRecommendations);

  if (loading) return <RecommendationsSkeleton />;

  if (error) {
    return (
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-sm font-semibold text-gray-700">Центр рисков и рекомендаций</h2>
        <p role="alert" className="text-sm text-red-500 bg-red-50 rounded-xl p-4 mt-4">
          Не удалось загрузить рекомендации
        </p>
      </section>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-sm font-semibold text-gray-700">Центр рисков и рекомендаций</h2>
        <div className="mt-4 rounded-xl bg-green-50 border border-green-100 p-4">
          <p className="text-sm font-medium text-green-700">Критичных рисков нет</p>
          <p className="text-xs text-green-600 mt-1">План сезона выглядит устойчиво.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-700">Центр рисков и рекомендаций</h2>
          <p className="text-xs text-gray-400 mt-1">
            Что требует внимания агронома сегодня
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.summary.high > 0 && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-100">
              Высоких: {data.summary.high}
            </span>
          )}
          {data.summary.medium > 0 && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
              Средних: {data.summary.medium}
            </span>
          )}
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-50 text-gray-500 border border-gray-100">
            Всего: {data.summary.total}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {data.items.map((item) => (
          <RecommendationCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
