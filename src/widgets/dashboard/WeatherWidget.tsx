import { useState, useEffect, useMemo } from "react";
import { fetchFields } from "../../shared/api/fields";
import { fetchWeather } from "../../shared/api/weather";
import type { WeatherData, DailyForecast } from "../../shared/api/weather";
import { getWeatherInfo, formatWeekday, formatShortDate } from "../../shared/lib/weatherCodes";
import type { Field } from "../../entities/field/types";

const FORECAST_DAYS = 7;

/** Вычисляет центроид всех координат всех полей */
function computeCentroid(fields: Field[]): { lat: number; lng: number } {
  const points = fields.flatMap((f) => f.coordinates.coordinates[0]);
  const lat = points.reduce((s, [, lat]) => s + lat, 0) / points.length;
  const lng = points.reduce((s, [lng]) => s + lng, 0) / points.length;
  return { lat, lng };
}

/** Горизонтальный индикатор осадков */
function PrecipBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="flex items-center gap-1.5 w-full">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-blue-400 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[10px] text-gray-400 w-8 text-right shrink-0">{value} мм</span>
    </div>
  );
}


export default function WeatherWidget() {
  const [centroid, setCentroid] = useState<{ lat: number; lng: number } | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [initLoading, setInitLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Шаг 1 — загружаем поля один раз, вычисляем центроид
  useEffect(() => {
    let cancelled = false;
    fetchFields()
      .then((fields) => {
        if (!cancelled) setCentroid(computeCentroid(fields));
      })
      .catch((e: Error) => {
        if (!cancelled) { setError(e.message); setInitLoading(false); }
      });
    return () => { cancelled = true; };
  }, []);

  // Шаг 2 — загружаем погоду при наличии центроида
  useEffect(() => {
    if (!centroid) return;
    let cancelled = false;

    fetchWeather(centroid.lat, centroid.lng, FORECAST_DAYS)
      .then((data) => {
        if (!cancelled) { setWeather(data); setInitLoading(false); }
      })
      .catch((e: Error) => {
        if (!cancelled) { setError(e.message); setInitLoading(false); }
      });

    return () => { cancelled = true; };
  }, [centroid]);

  const maxPrecip = useMemo(
    () => (weather ? Math.max(...weather.daily.map((d) => d.precipitationSum), 0.1) : 1),
    [weather]
  );

  if (initLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 animate-pulse">
        <div className="h-4 bg-gray-100 rounded w-32 mb-4" />
        <div className="h-16 bg-gray-100 rounded mb-3" />
        <div className="h-24 bg-gray-100 rounded" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <p className="text-sm text-red-400">Погода недоступна: {error}</p>
      </div>
    );
  }

  const { current, daily } = weather!;
  const currentInfo = getWeatherInfo(current.weatherCode);

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Шапка */}
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Погода на полях</h3>
        <span className="text-[10px] text-gray-400">
          Open-Meteo · {weather!.lat.toFixed(2)}°N {weather!.lng.toFixed(2)}°E
        </span>
      </div>

      {/* Текущая погода */}
      <div className="px-5 pb-4 flex items-center gap-4">
        <div className="text-5xl leading-none select-none">{currentInfo.icon}</div>
        <div>
          <div className="text-3xl font-bold text-gray-800 leading-none">
            {current.temperature > 0 ? "+" : ""}{current.temperature}°C
          </div>
          <div className="text-sm text-gray-500 mt-0.5">{currentInfo.label}</div>
        </div>
        <div className="ml-auto flex flex-col gap-1 text-xs text-gray-500 text-right">
          <span>💨 {current.windSpeed} км/ч</span>
          <span>💧 {current.humidity}%</span>
          <span>🌧️ {current.precipitation} мм</span>
        </div>
      </div>

      <div className="border-t border-gray-50 mx-5" />

      {/* Прогноз — карточки */}
      <div className="px-5 py-4">
        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-3">
          Прогноз на 7 дней
        </p>
        <div className="flex gap-2">
          {daily.map((day: DailyForecast) => {
            const info = getWeatherInfo(day.weatherCode);
            return (
              <div
                key={day.date}
                className="flex-1 flex flex-col items-center gap-1 bg-gray-50 rounded-xl py-2.5 px-1 min-w-0"
              >
                <span className="text-[11px] font-semibold text-gray-600 capitalize">
                  {formatWeekday(day.date)}
                </span>
                <span className="text-[10px] text-gray-400">{formatShortDate(day.date)}</span>
                <span className="text-xl leading-none my-0.5 select-none">{info.icon}</span>
                <span className="text-xs font-bold text-gray-700">
                  {day.tempMax > 0 ? "+" : ""}{day.tempMax}°
                </span>
                <span className="text-[10px] text-gray-400">{day.tempMin}°</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Осадки */}
      <div className="px-5 pb-5">
        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-2">
          Осадки (мм)
        </p>
        <div className="flex flex-col gap-1.5">
          {daily.map((day: DailyForecast) => (
            <div key={day.date} className="flex items-center gap-2">
              <span className="text-[11px] text-gray-500 w-14 shrink-0 capitalize">
                {formatWeekday(day.date)} {formatShortDate(day.date)}
              </span>
              <PrecipBar value={day.precipitationSum} max={maxPrecip} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
