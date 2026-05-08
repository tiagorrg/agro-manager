import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import {
  fetchReports,
  type ReportsData,
  type FieldStat,
  type ReportFilters,
  type ReportScope,
} from "../../shared/api/reports";
import { fetchFields } from "../../shared/api/fields";
import { Select } from "../../shared/ui-kit/select";
import type { Field } from "../../entities/field/types";

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

function EmptyChart({ children }: { children: string }) {
  return (
    <div className="h-28 flex items-center justify-center text-xs text-gray-400">
      {children}
    </div>
  );
}

function VBars({ data }: { data: Record<string, number> }) {
  const entries = Object.entries(data).sort(([a], [b]) => a.localeCompare(b));
  if (entries.length === 0) return <EmptyChart>Нет данных за период</EmptyChart>;

  const max = Math.max(...entries.map(([, v]) => v), 1);
  return (
    <div className="flex items-end gap-3 h-32">
      {entries.map(([key, val]) => {
        const pct = Math.round((val / max) * 100);
        return (
          <div key={key} className="flex-1 flex flex-col items-center gap-1 min-w-0">
            <span className="text-xs font-semibold text-gray-700">{val.toFixed(0)}</span>
            <div className="w-full bg-gray-100 rounded-t-md relative" style={{ height: "80px" }}>
              <div
                className="w-full bg-green-500 rounded-t-md transition-all absolute bottom-0"
                style={{ height: `${pct}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-400 truncate">{key}</span>
          </div>
        );
      })}
    </div>
  );
}

function FieldTable({ rows }: { rows: FieldStat[] }) {
  if (rows.length === 0) {
    return <p className="text-xs text-gray-400">Нет полей для отчета</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {rows.map((field) => {
        const pct = field.total > 0 ? Math.round((field.completed / field.total) * 100) : 0;
        return (
          <div key={field.id} className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-700 truncate">{field.name}</span>
                <span className="text-xs text-gray-400 shrink-0 ml-2">{field.completed}/{field.total}</span>
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

function formatDate(date: string): string {
  if (!date) return "";
  return new Date(`${date}T00:00:00`).toLocaleDateString("ru");
}

function formatPeriod(filters: ReportFilters): string {
  if (filters.dateFrom && filters.dateTo) {
    return `${formatDate(filters.dateFrom)} - ${formatDate(filters.dateTo)}`;
  }
  if (filters.dateFrom) return `с ${formatDate(filters.dateFrom)}`;
  if (filters.dateTo) return `по ${formatDate(filters.dateTo)}`;
  return "весь доступный период";
}

function buildDefaultFilters(): ReportFilters {
  return { scope: "farm", fieldId: "", dateFrom: "", dateTo: "" };
}

export default function ReportsPage() {
  const [fields, setFields] = useState<Field[]>([]);
  const [data, setData] = useState<ReportsData | null>(null);
  const [draftFilters, setDraftFilters] = useState<ReportFilters>(() => buildDefaultFilters());
  const [appliedFilters, setAppliedFilters] = useState<ReportFilters>(() => buildDefaultFilters());
  const [loading, setLoading] = useState(true);
  const [fieldsLoading, setFieldsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchFields()
      .then((items) => {
        if (!cancelled) {
          setFields(items);
          setFieldsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setFieldsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchReports(appliedFilters)
      .then((report) => {
        if (!cancelled) {
          setData(report);
          setLoading(false);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [appliedFilters]);

  const handleScopeChange = (scope: ReportScope) => {
    setDraftFilters((prev) => ({
      ...prev,
      scope,
      fieldId: scope === "field" ? prev.fieldId || fields[0]?.id || "" : "",
    }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setAppliedFilters({
      ...draftFilters,
      fieldId: draftFilters.scope === "field" ? draftFilters.fieldId || fields[0]?.id || "" : "",
    });
  };

  const reportTitle =
    appliedFilters.scope === "field" && data?.selectedField
      ? `Отчет по полю: ${data.selectedField.name}`
      : "Отчет по хозяйству";
  const maxType = Math.max(...Object.values(data?.byType ?? {}), 1);
  const statusTotal = Object.values(data?.byStatus ?? {}).reduce((sum, value) => sum + value, 0);
  const generatedAt = new Date().toLocaleDateString("ru");

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 flex flex-col gap-6 print-page">
      <div className="print:hidden flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Отчёты</h1>
            <p className="text-sm text-gray-400 mt-1">
              Соберите отчет по хозяйству или отдельному полю
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Печать
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 grid grid-cols-1 md:grid-cols-[1.2fr_1fr_1fr_1fr_auto] gap-3 items-end"
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="report-scope" className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">Тип отчета</label>
            <Select
              id="report-scope"
              value={draftFilters.scope}
              onChange={(value) => handleScopeChange(value as ReportScope)}
              options={[
                { value: "farm", label: "По хозяйству" },
                { value: "field", label: "По полю" },
              ]}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="report-field" className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">Поле</label>
            <Select
              id="report-field"
              value={draftFilters.fieldId ?? ""}
              disabled={draftFilters.scope !== "field" || fieldsLoading}
              onChange={(value) => setDraftFilters((prev) => ({ ...prev, fieldId: value }))}
              options={[
                { value: "", label: "Все поля" },
                ...fields.map((field) => ({ value: field.id, label: field.name })),
              ]}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="report-date-from" className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">С</label>
            <input
              id="report-date-from"
              type="date"
              value={draftFilters.dateFrom ?? ""}
              onChange={(event) => setDraftFilters((prev) => ({ ...prev, dateFrom: event.target.value }))}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="report-date-to" className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">По</label>
            <input
              id="report-date-to"
              type="date"
              value={draftFilters.dateTo ?? ""}
              onChange={(event) => setDraftFilters((prev) => ({ ...prev, dateTo: event.target.value }))}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-green-primary rounded-lg hover:bg-green-700 transition-colors"
          >
            Сформировать
          </button>
        </form>
      </div>

      {loading && (
        <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
          Загрузка...
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center h-48 text-red-400 text-sm">
          Ошибка загрузки данных
        </div>
      )}

      {!loading && !error && data && (
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-6 print:shadow-none print:border-0 print:p-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{reportTitle}</h2>
              <p className="text-sm text-gray-400 mt-1">
                Период: {formatPeriod(appliedFilters)}
              </p>
            </div>
            <div className="text-left sm:text-right text-xs text-gray-400">
              <p>Сформировано: {generatedAt}</p>
              {data.selectedField && (
                <p>{data.selectedField.crop} · {data.selectedField.area} га</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Всего операций", value: data.totals.operations },
              { label: "Полей в отчете", value: data.totals.fields },
              { label: "Общая площадь", value: `${data.totals.totalArea} га` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
              </div>
            ))}
          </div>

          <div className="bg-green-50 rounded-xl p-5 border border-green-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Выводы</h3>
            <ul className="space-y-2">
              {data.insights.map((insight) => (
                <li key={insight} className="flex gap-2 text-sm text-gray-700">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-green-600 shrink-0" />
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Операции по типу</h3>
              {Object.keys(data.byType).length === 0 ? (
                <EmptyChart>Операций нет</EmptyChart>
              ) : (
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
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">По статусу</h3>
              {Object.keys(data.byStatus).length === 0 ? (
                <EmptyChart>Статусов нет</EmptyChart>
              ) : (
                <div className="flex flex-col gap-3">
                  {Object.entries(data.byStatus).map(([status, count]) => {
                    const pct = statusTotal > 0 ? Math.round((count / statusTotal) * 100) : 0;
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
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Валовой урожай по годам, т</h3>
            <VBars data={data.yieldByYear} />
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              {appliedFilters.scope === "field" ? "Выполнение операций по полю" : "Выполнение операций по полям"}
            </h3>
            <FieldTable rows={data.byField} />
          </div>
        </section>
      )}
    </div>
  );
}
