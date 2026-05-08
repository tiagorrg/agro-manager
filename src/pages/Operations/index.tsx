import { useState, useEffect, useMemo } from "react";
import { fetchOperations, type CalendarOperation, type CalendarStatus } from "../../shared/api/operations";
import { Select } from "../../shared/ui-kit/select";
import type { OperationType } from "../../entities/operation/types";

const TYPE_LABELS: Record<OperationType, string> = {
  Посев:               "Посев",
  Обработка:           "Обработка",
  Уборка:              "Уборка",
  ВнесениеУдобрений:  "Внесение удобрений",
};

const TYPE_DOT: Record<OperationType, string> = {
  Посев:               "bg-green-500",
  Обработка:           "bg-blue-500",
  Уборка:              "bg-amber-500",
  ВнесениеУдобрений:  "bg-purple-500",
};

const STATUS_BADGE: Record<CalendarStatus, string> = {
  Запланировано: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  "В процессе":  "bg-blue-50 text-blue-700 border border-blue-200",
  Выполнено:     "bg-green-50 text-green-700 border border-green-200",
};

function localDate(d: Date): string {
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-");
  return `${d}.${m}.${y}`;
}

export default function OperationsPage() {
  const [ops, setOps] = useState<CalendarOperation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Фильтры
  const [filterField, setFilterField]   = useState("");
  const [filterType, setFilterType]     = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [dateFrom, setDateFrom]         = useState("");
  const [dateTo, setDateTo]             = useState("");

  useEffect(() => {
    let cancelled = false;
    fetchOperations()
      .then((data) => {
        if (!cancelled) {
          setOps(data.sort((a, b) => b.date.localeCompare(a.date)));
          setLoading(false);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) { setError(err.message); setLoading(false); }
      });
    return () => { cancelled = true; };
  }, []);

  // Уникальные поля для select-ов
  const fieldOptions = useMemo(() => {
    const seen = new Map<string, string>();
    ops.forEach((op) => {
      if (op.field) seen.set(op.fieldId, op.field.name);
    });
    return Array.from(seen.entries());
  }, [ops]);

  const filtered = useMemo(() => {
    return ops.filter((op) => {
      if (filterField  && op.fieldId         !== filterField)  return false;
      if (filterType   && op.type            !== filterType)   return false;
      if (filterStatus && op.calendarStatus  !== filterStatus) return false;
      if (dateFrom     && op.date < dateFrom)                  return false;
      if (dateTo       && op.date > dateTo)                    return false;
      return true;
    });
  }, [ops, filterField, filterType, filterStatus, dateFrom, dateTo]);

  const clearFilters = () => {
    setFilterField(""); setFilterType(""); setFilterStatus("");
    setDateFrom(""); setDateTo("");
  };
  const hasFilters = filterField || filterType || filterStatus || dateFrom || dateTo;

  return (
    <div className="max-w-5xl mx-auto py-6 flex flex-col gap-5">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Журнал операций</h1>
        {!loading && (
          <span className="text-sm text-gray-400">{filtered.length} из {ops.length}</span>
        )}
      </div>

      {/* Фильтры */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3 items-end">
        {/* Поле */}
        <div className="flex flex-col gap-1 min-w-[160px]">
          <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">Поле</label>
          <Select
            value={filterField}
            onChange={setFilterField}
            buttonClassName="min-h-8 py-1.5"
            options={[
              { value: "", label: "Все поля" },
              ...fieldOptions.map(([id, name]) => ({ value: id, label: name })),
            ]}
          />
        </div>

        {/* Тип */}
        <div className="flex flex-col gap-1 min-w-[160px]">
          <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">Тип</label>
          <Select
            value={filterType}
            onChange={setFilterType}
            buttonClassName="min-h-8 py-1.5"
            options={[
              { value: "", label: "Все типы" },
              ...(Object.keys(TYPE_LABELS) as OperationType[]).map((t) => ({ value: t, label: TYPE_LABELS[t] })),
            ]}
          />
        </div>

        {/* Статус */}
        <div className="flex flex-col gap-1 min-w-[150px]">
          <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">Статус</label>
          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            buttonClassName="min-h-8 py-1.5"
            options={[
              { value: "", label: "Все статусы" },
              { value: "Запланировано", label: "Запланировано" },
              { value: "В процессе", label: "В процессе" },
              { value: "Выполнено", label: "Выполнено" },
            ]}
          />
        </div>

        {/* Дата от */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">С</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
          />
        </div>

        {/* Дата до */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">По</label>
          <input
            type="date"
            value={dateTo}
            max={localDate(new Date())}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
          />
        </div>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="px-3 py-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors self-end"
          >
            Сбросить
          </button>
        )}
      </div>

      {/* Состояния */}
      {loading && (
        <div className="flex flex-col gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center h-32 text-red-400 text-sm">
          Не удалось загрузить операции
        </div>
      )}

      {/* Таблица */}
      {!loading && !error && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
              Операций не найдено
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Дата</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Поле</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Тип</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Статус</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Время</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((op, i) => (
                  <tr
                    key={op.id}
                    className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i === filtered.length - 1 ? "border-b-0" : ""}`}
                  >
                    <td className="px-4 py-3 text-gray-700 font-medium whitespace-nowrap">
                      {formatDate(op.date)}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {op.field?.name ?? op.fieldId}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${TYPE_DOT[op.type] ?? "bg-gray-400"}`} />
                        {TYPE_LABELS[op.type] ?? op.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_BADGE[op.calendarStatus] ?? "bg-gray-100 text-gray-500"}`}>
                        {op.calendarStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs whitespace-nowrap">
                      {op.timeStart && op.timeEnd ? `${op.timeStart} – ${op.timeEnd}` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
