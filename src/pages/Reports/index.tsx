import { useState, useEffect } from "react";
import { fetchReports, type ReportsData, type FieldStat } from "../../shared/api/reports";

const TYPE_LABELS: Record<string, string> = {
  Посев: "Посев",
  Обработка: "Обработка",
  Уборка: "Уборка",
  ВнесениеУдобрений: "Внесение удобрений",
};

const TYPE_COLOR: Record<string, string> = {
  Посев: "bg-green-500",
  Обработка: "bg-blue-500",
  Уборка: "bg-amber-500",
  ВнесениеУдобрений: "bg-purple-500",
};

const STATUS_COLOR: Record<string, string> = {
  Выполнено: "bg-green-500",
  "В процессе": "bg-blue-400",
  Запланировано: "bg-amber-400",
};

function HBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-40 text-xs text-gray-600 shrink-0 truncate">{label}</span>
      <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-6 text-xs font-semibold text-gray-700 text-right shrink-0">{value}</span>
    </div>
  );
}

function VBars({ data }: { data: Record<string, number> }) {
  const entries = Object.entries(data).sort(([a], [b]) => a.localeCompare(b));
  const max = Math.max(...entries.map(([, v]) => v), 1);
  return (
    <div className="flex items-end gap-3 h-32">
      {entries.map(([key, val]) => {
        const pct = Math.round((val / max) * 100);
        return (
          <div key={key} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-xs font-semibold text-gray-700">{val.toFixed(0)}</span>
            <div className="w-full bg-gray-100 rounded-t-md relative" style={{ height: "80px" }}>
              <div
                className="w-full bg-green-500 rounded-t-md transition-all absolute bottom-0"
                style={{ height: `${pct}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-400">{key}</span>
          </div>
        );
      })}
    </div>
  );
}

function FieldTable({ rows }: { rows: FieldStat[] }) {
  return (
    <div className="flex flex-col gap-2">
      {rows.map((f) => {
        const pct = f.total > 0 ? Math.round((f.completed / f.total) * 100) : 0;
        return (
          <div key={f.id} className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-700 truncate">{f.name}</span>
                <span className="text-xs text-gray-400 shrink-0 ml-2">{f.completed}/{f.total}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
            <span className="text-xs font-semibold text-gray-700 w-10 text-right shrink-0">{pct}%</span>
          </div>
        );
      })}
    </div>
  );
}

export default function ReportsPage() {
  const [data, setData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchReports()
      .then((d) => { if (!cancelled) { setData(d); setLoading(false); } })
      .catch((err: Error) => { if (!cancelled) { setError(err.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        Загрузка...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-48 text-red-400 text-sm">
        Ошибка загрузки данных
      </div>
    );
  }

  const maxType = Math.max(...Object.values(data.byType), 1);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Отчёты</h1>
        <button
          onClick={() => window.print()}
          className="print:hidden px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5"
        >
          🖨 Печать
        </button>
      </div>

      {/* Сводка */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Всего операций", value: data.totals.operations },
          { label: "Полей", value: data.totals.fields },
          { label: "Общая площадь", value: `${data.totals.totalArea} га` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Операции по типу */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Операции по типу</h2>
          <div className="flex flex-col gap-2.5">
            {Object.entries(data.byType).map(([type, count]) => (
              <HBar
                key={type}
                label={TYPE_LABELS[type] ?? type}
                value={count}
                max={maxType}
                color={TYPE_COLOR[type] ?? "bg-gray-400"}
              />
            ))}
          </div>
        </div>

        {/* Статусы */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">По статусу</h2>
          <div className="flex flex-col gap-3">
            {Object.entries(data.byStatus).map(([status, count]) => {
              const total = Object.values(data.byStatus).reduce((a, b) => a + b, 0);
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={status} className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${STATUS_COLOR[status] ?? "bg-gray-400"}`} />
                  <span className="flex-1 text-xs text-gray-600">{status}</span>
                  <span className="text-xs text-gray-400">{count}</span>
                  <span className="text-xs font-semibold text-gray-700 w-9 text-right">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Валовой урожай по годам */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Валовой урожай по годам, т</h2>
        <VBars data={data.yieldByYear} />
      </div>

      {/* Выполнение по полям */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Выполнение операций по полям</h2>
        <FieldTable rows={data.byField} />
      </div>
    </div>
  );
}
