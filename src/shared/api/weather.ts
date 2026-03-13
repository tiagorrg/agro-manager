export interface CurrentWeather {
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  humidity: number;
  precipitation: number;
}

export interface DailyForecast {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipitationSum: number;
  windSpeedMax: number;
}

export interface WeatherData {
  current: CurrentWeather;
  daily: DailyForecast[];
  lat: number;
  lng: number;
}

export async function fetchWeather(lat: number, lng: number, days = 5): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: lat.toFixed(4),
    longitude: lng.toFixed(4),
    current: "temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m,precipitation",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max",
    timezone: "Europe/Moscow",
    forecast_days: String(days + 1), // +1 чтобы пропустить сегодня
  });

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!res.ok) throw new Error("Не удалось загрузить погоду");

  const json = await res.json();

  const current: CurrentWeather = {
    temperature: Math.round(json.current.temperature_2m),
    weatherCode: json.current.weather_code,
    windSpeed: Math.round(json.current.wind_speed_10m),
    humidity: Math.round(json.current.relative_humidity_2m),
    precipitation: json.current.precipitation ?? 0,
  };

  const daily: DailyForecast[] = json.daily.time
    .slice(1) // пропускаем сегодня
    .map((date: string, i: number) => ({
      date,
      weatherCode: json.daily.weather_code[i + 1],
      tempMax: Math.round(json.daily.temperature_2m_max[i + 1]),
      tempMin: Math.round(json.daily.temperature_2m_min[i + 1]),
      precipitationSum: +(json.daily.precipitation_sum[i + 1] ?? 0).toFixed(1),
      windSpeedMax: Math.round(json.daily.wind_speed_10m_max[i + 1]),
    }));

  return { current, daily, lat, lng };
}
