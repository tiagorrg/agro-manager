import { useState, useEffect } from "react";
import { fetchFields } from "../shared/api/fields";
import { fetchWeather } from "../shared/api/weather";
import { getWeatherInfo, formatWeekday, formatShortDate } from "../shared/lib/weatherCodes";
import type { DailyForecast } from "../shared/api/weather";
import type { CalendarOperation } from "../shared/api/operations";
import type { OperationType } from "../entities/operation/types";

const ALL_TYPES: OperationType[] = ["Посев", "Обработка", "Уборка", "ВнесениеУдобрений"];

const TYPE_LABELS: Record<OperationType, string> = {
  "Посев":              "Посев",
  "Обработка":          "Обработка",
  "Уборка":             "Уборка",
  "ВнесениеУдобрений": "Удобрения",
};

const TYPE_DOT: Record<OperationType, string> = {
  "Посев":              "bg-green-500",
  "Обработка":          "bg-blue-500",
  "Уборка":             "bg-amber-500",
  "ВнесениеУдобрений": "bg-purple-500",
};

// Центр полей — фиксированный fallback, точный вычисляется из данных
const DEFAULT_LAT = 46.26;
const DEFAULT_LNG = 39.52;

interface WeatherSectionProps {}

function WeatherSection(_: WeatherSectionProps) {
  const [forecast, setForecast] = useState<DailyForecast[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetchFields()
      .then((fields) => {
        if (cancelled) return;
        const points = fields.flatMap((f) => f.coordinates.coordinates[0]);
        const lat = points.reduce((s, [, y]) => s + y, 0) / points.length;
        const lng = points.reduce((s, [x]) => s + x, 0) / points.length;
        return fetchWeather(lat || DEFAULT_LAT, lng || DEFAULT_LNG, 4);
      })
      .then((data) => {
        if (!cancelled && data) {
          setForecast(data.daily.slice(0, 4));
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          // Тихо падаем — погода необязательна
          fetchWeather(DEFAULT_LAT, DEFAULT_LNG, 4)
            .then((d) => { if (!cancelled) { setForecast(d.daily.slice(0, 4)); setLoading(false); } })
            .catch(() => { if (!cancelled) setLoading(false); });
        }
      });

    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!forecast.length) return null;

  return (
    <div className="flex flex-col gap-1.5">
      {forecast.map((day) => {
        const info = getWeatherInfo(day.weatherCode);
        return (
          <div
            key={day.date}
            className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg"
          >
            <span className="text-lg leading-none">{info.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-700 capitalize">
                {formatWeekday(day.date)}, {formatShortDate(day.date)}
              </p>
              <p className="text-[10px] text-gray-400 truncate">{info.label}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs font-semibold text-gray-700">
                {day.tempMax > 0 ? "+" : ""}{day.tempMax}°
              </p>
              <p className="text-[10px] text-gray-400">{day.tempMin}°</p>
            </div>
            {day.precipitationSum > 0 && (
              <span className="text-[10px] text-blue-500 shrink-0">
                {day.precipitationSum}мм
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

const MONTHS_SHORT = ["янв","фев","мар","апр","май","июн","июл","авг","сен","окт","ноя","дек"];

interface Props {
  operations: CalendarOperation[];
  activeTypes: Set<OperationType>;
  onTypeToggle: (type: OperationType) => void;
  onSelectDay: (date: Date) => void;
}

export default function CalendarSidebar({ operations, activeTypes, onTypeToggle, onSelectDay }: Props) {
  const today = new Date();

  // Ближайшие задачи: отфильтрованные, начиная с сегодня, сортировка по дате+времени
  const upcoming = operations
    .filter((op) => {
      if (!activeTypes.has(op.type)) return false;
      const d = new Date(op.date + "T00:00:00");
      return d >= new Date(today.getFullYear(), today.getMonth(), today.getDate());
    })
    .sort((a, b) => {
      const da = a.date + (a.timeStart ?? "");
      const db = b.date + (b.timeStart ?? "");
      return da < db ? -1 : da > db ? 1 : 0;
    })
    .slice(0, 6);

  return (
    <aside className="w-60 shrink-0 flex flex-col gap-5">
      {/* Погода */}
      <section>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Погода на неделю
        </h4>
        <WeatherSection />
      </section>

      {/* Фильтры по типу операции */}
      <section>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Тип операции
        </h4>
        <div className="flex flex-col gap-1">
          {ALL_TYPES.map((type) => (
            <label
              key={type}
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer select-none"
            >
              <input
                type="checkbox"
                checked={activeTypes.has(type)}
                onChange={() => onTypeToggle(type)}
                className="w-3.5 h-3.5 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
              />
              <span className={`w-2 h-2 rounded-full shrink-0 ${TYPE_DOT[type]}`} />
              <span className="text-sm text-gray-700">{TYPE_LABELS[type]}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Ближайшие задачи */}
      <section>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Ближайшие задачи
        </h4>
        {upcoming.length === 0 ? (
          <p className="text-xs text-gray-400 px-1">Нет предстоящих задач</p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {upcoming.map((op) => {
              const d = new Date(op.date + "T00:00:00");
              const dot = TYPE_DOT[op.type];
              return (
                <button
                  key={op.id}
                  onClick={() => onSelectDay(d)}
                  className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left w-full group"
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700 truncate">{op.type}</p>
                    <p className="text-[11px] text-gray-400 truncate">{op.field?.name ?? op.fieldId}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[11px] font-medium text-gray-500">
                      {d.getDate()} {MONTHS_SHORT[d.getMonth()]}
                    </p>
                    {op.timeStart && (
                      <p className="text-[10px] text-gray-400">{op.timeStart}</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </aside>
  );
}
