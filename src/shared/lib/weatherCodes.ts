export interface WeatherInfo {
  label: string;
  icon: string;
}

const WMO_CODES: Record<number, WeatherInfo> = {
  0:  { label: "Ясно",                   icon: "☀️" },
  1:  { label: "Преим. ясно",            icon: "🌤️" },
  2:  { label: "Переменная облачность",  icon: "⛅" },
  3:  { label: "Пасмурно",              icon: "☁️" },
  45: { label: "Туман",                  icon: "🌫️" },
  48: { label: "Иней",                   icon: "🌫️" },
  51: { label: "Лёгкая морось",          icon: "🌦️" },
  53: { label: "Морось",                 icon: "🌦️" },
  55: { label: "Сильная морось",         icon: "🌦️" },
  61: { label: "Небольшой дождь",        icon: "🌧️" },
  63: { label: "Дождь",                  icon: "🌧️" },
  65: { label: "Сильный дождь",          icon: "🌧️" },
  71: { label: "Небольшой снег",         icon: "❄️" },
  73: { label: "Снег",                   icon: "❄️" },
  75: { label: "Сильный снег",           icon: "❄️" },
  77: { label: "Снежная крупа",          icon: "🌨️" },
  80: { label: "Ливень",                 icon: "🌧️" },
  81: { label: "Умеренный ливень",       icon: "🌧️" },
  82: { label: "Сильный ливень",         icon: "⛈️" },
  85: { label: "Снегопад",              icon: "🌨️" },
  86: { label: "Сильный снегопад",       icon: "🌨️" },
  95: { label: "Гроза",                  icon: "⛈️" },
  96: { label: "Гроза с градом",         icon: "⛈️" },
  99: { label: "Гроза с сильным градом", icon: "⛈️" },
};

export function getWeatherInfo(code: number): WeatherInfo {
  return WMO_CODES[code] ?? { label: "Неизвестно", icon: "🌡️" };
}

/** Форматирует дату "2026-03-13" → "Чт" */
export function formatWeekday(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("ru-RU", { weekday: "short" });
}

/** Форматирует дату "2026-03-13" → "13 мар" */
export function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}
